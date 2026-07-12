"use client";

import { useState } from "react";
import type { Repo } from "@/lib/api";
import { RepoCard } from "./RepoCard";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "@/components/icons";

const PAGE = 10; // ponytail: client-side "load more" — real pagination when the table gets big

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
  const [visible, setVisible] = useState(PAGE);

  if (loading) {
    return (
      <div>
        {Array.from({ length: 4 }).map((_, i) => (
          <RowSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div className="border-b border-rule px-6 py-16 text-center sm:px-10">
        <p className="text-ink">
          {activeCategory ? `No repos in “${activeCategory}” yet.` : "No repos yet — be the first to add one above."}
        </p>
        {activeCategory && (
          <button onClick={onClearFilter} className="mt-2 text-sm text-orange hover:underline">
            Clear filter
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      {repos.slice(0, visible).map((repo) => (
        <RepoCard key={repo.id} repo={repo} onStar={onStar} isNew={repo.id === newestId} />
      ))}
      {repos.length > visible && (
        <div className="flex justify-center border-b border-rule px-6 py-10">
          <Button variant="outline" className="rounded-lg bg-card" onClick={() => setVisible((v) => v + PAGE)}>
            Load more repositories <ChevronDownIcon size={14} />
          </Button>
        </div>
      )}
    </div>
  );
}

function RowSkeleton() {
  const shimmer =
    "rounded bg-[linear-gradient(90deg,var(--muted)_25%,var(--rule)_50%,var(--muted)_75%)] bg-[length:200%_100%] [animation:shimmer_1.6s_ease-in-out_infinite]";
  return (
    <div className="grid gap-5 border-b border-rule px-6 py-8 sm:px-10 md:grid-cols-[220px_1fr_170px] md:gap-8">
      <div className={`h-5 w-3/4 ${shimmer}`} />
      <div className="flex flex-col gap-2">
        <div className={`h-4 w-full ${shimmer}`} />
        <div className={`h-4 w-4/5 ${shimmer}`} />
        <div className={`h-4 w-2/5 ${shimmer}`} />
      </div>
      <div className={`h-5 w-16 ${shimmer} md:justify-self-end`} />
    </div>
  );
}
