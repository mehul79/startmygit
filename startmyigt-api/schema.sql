-- ponytail: one table. categories as CSV text, not a join table — SELECT DISTINCT
-- gives the filter list. Normalize only if this actually breaks.
CREATE TABLE IF NOT EXISTS repos (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  url         TEXT NOT NULL UNIQUE,        -- github.com/owner/repo, dedup key
  owner       TEXT NOT NULL,
  name        TEXT NOT NULL,
  summary     TEXT NOT NULL,
  tech_stack  TEXT NOT NULL DEFAULT '',    -- CSV: "TypeScript,React,D1"
  categories  TEXT NOT NULL DEFAULT '',    -- CSV: "web,ai-tools"
  stars       INTEGER NOT NULL DEFAULT 0,  -- mirrors GitHub's stargazers_count, refreshed on every GET /repos
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
