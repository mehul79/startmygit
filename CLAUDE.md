# startmyigt

Platform where users submit GitHub repo URLs. AI reads the readme (+ parts of
the project), generates an easy-to-understand summary, detects the tech
stack, and tags the repo into categories that emerge dynamically as repos get
added. Visitors can star repos they like.

## Stack (all Cloudflare, decided — don't revisit without reason)

- **Frontend:** Next.js + TypeScript + Tailwind, in `startmyigt-web/`. Deploys to Cloudflare Pages.
- **Backend:** Hono + TypeScript, in `startmyigt-api/`. Runs on Cloudflare Workers (native runtime, not Node — no Express, no Vite).
- **Data:** Cloudflare D1 (SQLite).
- **AI:** Cloudflare Workers AI — summary + tech stack + category tags. No external LLM key needed.
- **Readme fetch:** GitHub API from the Worker (server-side, avoids the 60 req/hr unauthenticated browser limit).

## Explicitly rejected (don't re-add without a stated reason)

- No user accounts / auth / sessions for MVP. Submitting a repo needs no login.
- No separate `categories` table — AI returns 1–3 category strings per repo, stored as a text column, `SELECT DISTINCT` for the filter list. Normalize only when this actually breaks.
- Star button = plain `<a href="https://github.com/owner/repo">` linking to GitHub's own star button. Not a one-click OAuth star. Real GitHub stars require the user's own OAuth token — GitHub won't let us star on someone's behalf without it, so redirect is the lazy-correct default.
  - If an in-app "like" count independent of GitHub is ever wanted, that's anonymous per-browser dedup (localStorage + hashed-IP/cookie on the Worker) — still no login.
  - "Sign in with GitHub" is the cheap upgrade path *if* one-click starring or spam-gating is ever needed later — one OAuth route on the Worker, no password storage.
- No Node/Express, no Python/FastAPI backend — wrong runtime for Workers.

## Local dev

Requires: Node 18+, npm, git, `wrangler` (`npm install -g wrangler`).

```bash
# frontend
cd startmyigt-web && npm run dev      # localhost:3000

# backend
cd startmyigt-api && npm run dev      # localhost:8787 (Wrangler local)
```

D1 + Workers AI are cloud-only, no local setup — created once in the Cloudflare dashboard / via `wrangler d1 create`.

### First-time backend bring-up (login-gated, run interactively)

```bash
cd startmyigt-api
wrangler login                                   # browser OAuth, once
wrangler d1 create startmyigt                     # copy the printed database_id
#   -> paste it into wrangler.jsonc, replacing PLACEHOLDER_RUN_WRANGLER_D1_CREATE
wrangler d1 execute startmyigt --remote --file=./schema.sql   # create table in cloud D1
wrangler d1 execute startmyigt --local  --file=./schema.sql   # same for local dev
wrangler dev                                      # needs login: AI binding runs remote even locally
```

Note: Workers AI has no local emulator — the `/repos` submit route always calls
the real cloud AI, so `wrangler dev` requires an authenticated session.

### API routes (startmyigt-api/src/index.ts)

- `POST /repos {url}` — parse → fetch readme → Workers AI (llama-3.1-8b) → store. 400 bad url / 409 dup / 404 no readme.
- `GET /repos?category=` — list, optional category filter, sorted by stars.
- `GET /categories` — distinct category tags for the filter UI.
- `POST /repos/:id/star` — bump in-app star count.

## Deploy

```bash
cd startmyigt-api && npx wrangler deploy
cd startmyigt-web && npm run build    # then Pages via git push or `wrangler pages deploy`
```

## Ponytail

Full mode. Ladder-first: no abstraction, table, or auth layer until something
concrete needs it. Mark deliberate shortcuts with `// ponytail:` comments.
