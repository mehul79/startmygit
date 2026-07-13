import { Hono } from 'hono'
import { env } from 'hono/adapter';
import { cors } from 'hono/cors'

type Bindings = { DB: D1Database; AI: Ai }

const app = new Hono<{ Bindings: Bindings }>()
app.use('/*', cors()) // ponytail: wide-open CORS for MVP. Lock to the Pages origin before launch.

// Any uncaught throw (e.g. Workers AI failing) must still return JSON —
// the frontend always calls res.json() on error responses.
app.onError((err, c) => {
  console.error(err)
  return c.json({ error: 'something went wrong, try again' }, 500)
})

app.get('/', (c) => c.text('startmyigt api'))

// Submit a repo: parse -> fetch readme -> AI summarize -> store
app.post('/repos', async (c) => {
  const { url } = await c.req.json<{ url?: string }>().catch(() => ({ url: undefined }))
  const parsed = parseRepo(url)
  if (!parsed) return c.json({ error: 'need a github.com/owner/repo url' }, 400)
  const { owner, name, canonical } = parsed

  const existing = await c.env.DB.prepare('SELECT id FROM repos WHERE url = ?').bind(canonical).first()
  if (existing) return c.json({ error: 'already added', id: existing.id }, 409)

  const readme = await fetchReadme(owner, name)
  if (readme === null) return c.json({ error: 'repo not found or no readme' }, 404)

  const [ai, stars] = await Promise.all([summarize(c.env.AI, owner, name, readme), fetchStars(owner, name)])

  const row = await c.env.DB.prepare(
    `INSERT INTO repos (url, owner, name, summary, tech_stack, categories, stars)
     VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *`
  ).bind(canonical, owner, name, ai.summary, ai.tech_stack.join(','), ai.categories.join(','), stars).first()

  return c.json(row, 201)
})

// List repos, optional ?category= filter. Star counts are refreshed live from GitHub on every load.
app.get('/repos', async (c) => {
  const cat = c.req.query('category')
  const q = cat
    ? c.env.DB.prepare("SELECT * FROM repos WHERE ',' || categories || ',' LIKE ? ORDER BY stars DESC, id DESC").bind(`%,${cat},%`)
    : c.env.DB.prepare('SELECT * FROM repos ORDER BY stars DESC, id DESC')
  const { results } = await q.all<{ id: number; owner: string; name: string; stars: number }>()

  // ponytail: one GitHub call per listed repo, every list load. Fine at MVP scale (unauth 60 req/hr);
  // add caching/ETags or a cron refresh if the repo count grows or this starts 429ing.
  await Promise.all(
    results.map(async (r) => {
      const live = await fetchStars(r.owner, r.name)
      if (live !== null && live !== r.stars) {
        r.stars = live
        await c.env.DB.prepare('UPDATE repos SET stars = ? WHERE id = ?').bind(live, r.id).run()
      }
    })
  )

  results.sort((a, b) => b.stars - a.stars || b.id - a.id)
  return c.json(results)
})

// Distinct category list for filter UI. ponytail: split CSV in JS — fine at MVP scale.
app.get('/categories', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT categories FROM repos').all<{ categories: string }>()
  const set = new Set<string>()
  for (const r of results) for (const cat of r.categories.split(',')) if (cat) set.add(cat)
  return c.json([...set].sort())
})

export default app

// --- helpers ---

function parseRepo(url?: string): { owner: string; name: string; canonical: string } | null {
  if (!url) return null
  const m = url.trim().match(/github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git|\/|$)/i)
  if (!m) return null
  const owner = m[1], name = m[2]
  return { owner, name, canonical: `github.com/${owner}/${name}` }
}

async function fetchReadme(owner: string, name: string): Promise<string | null> {
  // ponytail: unauthenticated GitHub = 60 req/hr/IP. Add a token when that bites.
  const res = await fetch(`https://api.github.com/repos/${owner}/${name}/readme`, {
    headers: { Accept: 'application/vnd.github.raw', 'User-Agent': 'startmyigt' },
  })
  if (!res.ok) return null
  const text = await res.text()
  return text.slice(0, 8000) // cap tokens fed to the model
}

async function fetchStars(owner: string, name: string): Promise<number | null> {
  const res = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'startmyigt' },
  })
  if (!res.ok) return null
  const data = await res.json<{ stargazers_count?: number }>()
  return data.stargazers_count ?? null
}

async function summarize(ai: Ai, owner: string, name: string, readme: string) {
  const prompt = `You are cataloging a GitHub repo "${owner}/${name}". Based on its README below, respond with ONLY a JSON object, no prose, shaped exactly:
{"summary": "2-3 plain sentences a non-expert understands", "tech_stack": ["Language","Framework",...], "categories": ["1 to 4 short lowercase-kebab tags describing what it IS and what it's FOR, e.g. web, cli, game, ai-tools, rag, llm, chatbot, embeddings, devtools, data-pipeline — always return at least one, never an empty list"]}

README:
${readme}`

  const res = await ai.run('@cf/meta/llama-3.1-8b-instruct-fp8', {
    messages: [{ role: 'user', content: prompt }],
  }) as { response?: string }

  return parseAi(res.response ?? '')
}

function parseAi(text: string): { summary: string; tech_stack: string[]; categories: string[] } {
  // ponytail: model sometimes wraps JSON in prose/fences — grab the first {...} block.
  const match = text.match(/\{[\s\S]*\}/)
  try {
    const o = JSON.parse(match ? match[0] : text)
    return {
      summary: String(o.summary ?? '').trim() || 'No summary generated.',
      tech_stack: toStrArray(o.tech_stack, 8),
      categories: toStrArray(o.categories, 4),
    }
  } catch {
    return { summary: 'No summary generated.', tech_stack: [], categories: [] }
  }
}

function toStrArray(v: unknown, max: number): string[] {
  if (!Array.isArray(v)) return []
  return v.map((x) => String(x).trim()).filter(Boolean).slice(0, max)
}
