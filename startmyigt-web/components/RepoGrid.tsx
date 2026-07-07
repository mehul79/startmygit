"use client";

import type { Repo } from "@/lib/api";
import { RepoCard } from "./RepoCard";

export function RepoGrid({
  repos,
  loading,
  activeCategory,
  onClearFilter,
  onStar,
  newestId,
}: {
  repos: Repo[];
  loading: boolean;
  activeCategory: string | null;
  onClearFilter: () => void;
  onStar: (id: number) => Promise<void>;
  newestId: number | null;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (repos.length === 0 && activeCategory) {
    return (
      <div className="rounded-xl border border-border bg-surface p-8 text-center">
        <p className="text-ink">No repos in &ldquo;{activeCategory}&rdquo; yet.</p>
        <button onClick={onClearFilter} className="mt-2 text-sm text-accent hover:underline">
          Clear filter
        </button>
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-8 text-center">
        <p className="text-ink">No repos yet &mdash; be the first to add one above.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
      {repos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} onStar={onStar} isNew={repo.id === newestId} />
      ))}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5">
      <div className="h-4 w-2/3 rounded bg-[linear-gradient(90deg,var(--surface-2)_25%,var(--border)_50%,var(--surface-2)_75%)] bg-[length:200%_100%] [animation:shimmer_1.6s_ease-in-out_infinite]" />
      <div className="h-3 w-full rounded bg-[linear-gradient(90deg,var(--surface-2)_25%,var(--border)_50%,var(--surface-2)_75%)] bg-[length:200%_100%] [animation:shimmer_1.6s_ease-in-out_infinite]" />
      <div className="h-3 w-4/5 rounded bg-[linear-gradient(90deg,var(--surface-2)_25%,var(--border)_50%,var(--surface-2)_75%)] bg-[length:200%_100%] [animation:shimmer_1.6s_ease-in-out_infinite]" />
      <div className="flex gap-1.5">
        <div className="h-5 w-14 rounded bg-surface-2" />
        <div className="h-5 w-12 rounded bg-surface-2" />
      </div>
    </div>
  );
}
