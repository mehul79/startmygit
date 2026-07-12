# startmyigt

A platform where you drop a GitHub repo URL and get back an AI-generated
summary, detected tech stack, and dynamic category tags — no manual tagging,
no curation queue. Visitors browse by category and star the repos they like
(via GitHub's own star button, so it's a real GitHub star, not an in-app
fake one).

## What it does

1. You paste a `github.com/owner/repo` URL.
2. The backend fetches the repo's README server-side (via the GitHub API,
   so it isn't limited by the browser's 60 req/hr unauthenticated cap).
3. Cloudflare Workers AI reads the README and returns a plain-English
   summary, the tech stack, and 1–3 category tags.
4. The repo is stored and shows up in the grid, filterable by category.

Categories aren't a fixed taxonomy — they emerge from whatever the AI tags
repos with as they get submitted.

## Tech stack

Everything runs on Cloudflare — no separate hosting, no server to patch.

| Layer    | Choice                                      |
|----------|----------------------------------------------|
| Frontend | Next.js + TypeScript + Tailwind (`startmyigt-web/`), deployed to **Cloudflare Pages** |
| Backend  | Hono + TypeScript (`startmyigt-api/`), running natively on **Cloudflare Workers** (not Node — no Express, no Vite) |
| Data     | **Cloudflare D1** (SQLite) |
| AI       | **Cloudflare Workers AI** (`@cf/meta/llama-3.1-8b-instruct`) — summary, tech stack, and category tags. No external LLM API key needed |
| Readme fetch | GitHub REST API, called from the Worker (server-side) |

No user accounts, no auth, no separate `categories` table for the MVP — see
`CLAUDE.md` for the full list of what was deliberately left out and why.

## Running it locally

Requires Node 18+, npm, git, and `wrangler` (`npm install -g wrangler`).

```bash
# frontend — localhost:3000
cd startmyigt-web
npm install
npm run dev

# backend — localhost:8787 (Wrangler local dev)
cd startmyigt-api
npm install
npm run dev
```

D1 and Workers AI are cloud-only — there's no local emulator for either, so
`wrangler dev` needs an authenticated Cloudflare session even for local work
(see one-time setup below). The frontend reads the API URL from
`startmyigt-web/.env.local` (`NEXT_PUBLIC_API_URL`).

### One-time backend setup

```bash
cd startmyigt-api
wrangler login                                                # browser OAuth, once
wrangler d1 create startmyigt                                 # copy the printed database_id...
#   ...into wrangler.jsonc, replacing PLACEHOLDER_RUN_WRANGLER_D1_CREATE
wrangler d1 execute startmyigt --remote --file=./schema.sql   # create the table in cloud D1
wrangler d1 execute startmyigt --local  --file=./schema.sql   # same schema for local dev
```

## Deploying — all on Cloudflare

```bash
# API -> Cloudflare Workers
cd startmyigt-api
npx wrangler deploy

# Web -> Cloudflare Pages
cd startmyigt-web
npm run build
# then push to the connected git branch, or: wrangler pages deploy
```

A few pointers on how the backend sits entirely inside Cloudflare's stack:

- **Compute** — the API is a Worker (`startmyigt-api/src/index.ts`), not a
  Node process. It runs on Cloudflare's V8-isolate runtime, so there's no
  container, no cold-start VM, no server to keep patched.
- **Database** — D1 is Cloudflare's managed SQLite. It's bound to the Worker
  in `wrangler.jsonc` (`d1_databases`) and queried directly via
  `c.env.DB.prepare(...)` — no connection string, no separate DB host.
- **AI inference** — Workers AI is bound the same way (`ai` block in
  `wrangler.jsonc`) and called with `c.env.AI.run(...)`. It runs on
  Cloudflare's own inference infrastructure, so there's no OpenAI/Anthropic
  key to manage for this feature.
- **Config** — everything the Worker needs (D1 binding, AI binding,
  observability) lives in one file, `startmyigt-api/wrangler.jsonc`. There's
  no separate `.env` for infra config; secrets (if any get added later)
  would go through `wrangler secret put`.
- **Frontend hosting** — Cloudflare Pages builds and serves the Next.js
  static output, so frontend and backend deploy from the same Cloudflare
  account/dashboard with no third-party hosting involved.

## API routes

`startmyigt-api/src/index.ts`:

- `POST /repos {url}` — parse → fetch readme → Workers AI → store. `400` bad
  url, `409` duplicate, `404` no readme found.
- `GET /repos?category=` — list repos, optional category filter, sorted by
  stars.
- `GET /categories` — distinct category tags, for the filter UI.
- `POST /repos/:id/star` — bump the in-app star counter.

## Project conventions

See `CLAUDE.md` for the stack decisions, what's explicitly been rejected
(auth, a categories table, one-click OAuth starring) and why, plus the
project's "ponytail" philosophy: no abstraction, table, or auth layer gets
added until something concrete needs it.
