"use client";

import { useEffect, useState } from "react";
import { api, type Repo } from "@/lib/api";
import { SubmitForm } from "@/components/SubmitForm";
import { CategoryFilter } from "@/components/CategoryFilter";
import { RepoGrid } from "@/components/RepoGrid";

export default function Home() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  // loading is derived, not toggled directly: undefined sentinel means
  // "never loaded", so the initial render (before any category was fetched) shows loading too.
  const [loadedFor, setLoadedFor] = useState<string | null | undefined>(undefined);
  const [newestId, setNewestId] = useState<number | null>(null);
  const loading = loadedFor !== activeCategory;

  useEffect(() => {
    let ignore = false;
    Promise.all([api.listRepos(activeCategory ?? undefined), api.listCategories()]).then(
      ([repoList, categoryList]) => {
        if (ignore) return;
        setRepos(repoList);
        setCategories(categoryList);
        setLoadedFor(activeCategory);
      }
    );
    return () => {
      ignore = true;
    };
  }, [activeCategory]);

  function handleAdded(repo: Repo) {
    setNewestId(repo.id);
    setRepos((prev) => (activeCategory ? prev : [repo, ...prev]));
    setCategories((prev) => {
      const fresh = repo.categories.split(",").filter((c) => c && !prev.includes(c));
      return fresh.length ? [...prev, ...fresh].sort() : prev;
    });
  }

  async function handleStar(id: number) {
    await api.starRepo(id);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-lg">
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">startmyigt</h1>
          <p className="mt-2 text-base leading-relaxed text-ink-muted">
            Submit a GitHub repo. An AI reads the readme and writes the summary, tech stack, and
            categories for you.
          </p>
        </div>
        <SubmitForm onAdded={handleAdded} />
      </header>

      <CategoryFilter categories={categories} active={activeCategory} onSelect={setActiveCategory} />

      <RepoGrid
        repos={repos}
        loading={loading}
        activeCategory={activeCategory}
        onClearFilter={() => setActiveCategory(null)}
        onStar={handleStar}
        newestId={newestId}
      />
    </div>
  );
}
