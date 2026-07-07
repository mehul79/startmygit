"use client";

import { useState } from "react";
import { csv, type Repo } from "@/lib/api";

export function RepoCard({
  repo,
  onStar,
  isNew,
}: {
  repo: Repo;
  onStar: (id: number) => Promise<void>;
  isNew?: boolean;
}) {
  const [stars, setStars] = useState(repo.stars);
  const [starring, setStarring] = useState(false);

  async function handleStar() {
    if (starring) return;
    setStarring(true);
    setStars((s) => s + 1); // optimistic
    try {
      await onStar(repo.id);
    } catch {
      setStars((s) => s - 1); // rollback
    } finally {
      setStarring(false);
    }
  }

  return (
    <article
      className={`flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 ${
        isNew ? "animate-[card-in_0.4s_cubic-bezier(0.16,1,0.3,1)]" : ""
      }`}
    >
      <header className="flex items-start justify-between gap-3">
        <a
          href={`https://${repo.url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0 font-medium text-ink hover:text-accent"
        >
          <span className="text-ink-muted">{repo.owner}/</span>
          {repo.name}
        </a>
        <button
          onClick={handleStar}
          disabled={starring}
          aria-label={`Star ${repo.owner}/${repo.name} (${stars} stars)`}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface-2 px-3 py-1 text-sm text-ink-muted transition-transform hover:border-accent hover:text-accent active:scale-[0.96]"
        >
          <StarIcon />
          <span className="font-mono tabular-nums">{stars}</span>
        </button>
      </header>

      <p className="text-sm leading-relaxed text-ink-muted">{repo.summary}</p>

      {csv(repo.tech_stack).length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
          {csv(repo.tech_stack).map((t) => (
            <li
              key={t}
              className="rounded border border-border px-1.5 py-0.5 font-mono text-xs text-ink-muted"
            >
              {t}
            </li>
          ))}
        </ul>
      )}

      {csv(repo.categories).length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="Categories">
          {csv(repo.categories).map((c) => (
            <li
              key={c}
              className="rounded-full bg-category-bg px-2 py-0.5 text-xs font-medium text-category-text"
            >
              {c}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
    </svg>
  );
}
