"use client";

import { useEffect, useState } from "react";
import { api, type Repo } from "@/lib/api";
import { SubmitForm } from "@/components/SubmitForm";
import { CategoryFilter } from "@/components/CategoryFilter";
import { RepoGrid } from "@/components/RepoGrid";
import { CodeMarkIcon, GitHubIcon } from "@/components/icons";

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
    ).catch(() => {
      // ponytail: API down → show the empty state instead of skeletons forever
      if (!ignore) setLoadedFor(activeCategory);
    });
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

  const focusSubmit = () => document.getElementById("repo-url")?.focus();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col border-x border-rule">
      <header className="grid grid-cols-[64px_1fr_auto] items-stretch border-b border-rule">
        <div className="flex items-center justify-center border-r border-rule text-orange">
          <CodeMarkIcon size={20} />
        </div>
        <div className="flex items-center gap-10 px-5">
          <span className="text-[15px] font-bold tracking-tight text-ink">startmyigt</span>
          <nav className="hidden items-center gap-6 text-sm sm:flex" aria-label="Main">
            <a href="#explore" className="relative py-5 font-medium text-ink">
              Explore
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-orange" />
            </a>
            <span aria-hidden className="size-0.5 rounded-full bg-ink-muted" />
            <a href="#about" className="py-5 text-ink-muted hover:text-ink">
              About
            </a>
          </nav>
        </div>
        <button
          onClick={focusSubmit}
          className="flex items-center gap-2 border-l border-rule px-6 text-sm font-medium text-ink transition-colors hover:text-orange"
        >
          <span aria-hidden className="text-base leading-none">+</span> Submit a repo
        </button>
      </header>

      <section className="hero-atmosphere border-b border-rule">
        <div className="relative z-10 px-6 py-16 sm:px-10 sm:py-20">
          <p className="text-xs font-semibold tracking-[0.14em] text-orange uppercase">
            Open source, explained
          </p>
          <h1 className="mt-5 max-w-2xl font-serif text-5xl leading-[1.08] font-medium tracking-tight text-ink sm:text-6xl">
            Discover what people are building.
          </h1>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink-muted">
            We read the README, explain it in simple terms, detect the tech stack, and tag it so you
            can explore the best projects faster.
          </p>
          <div className="mt-8">
            <SubmitForm onAdded={handleAdded} />
          </div>
        </div>
      </section>

      <div id="explore" className="grid scroll-mt-4 border-b border-rule lg:grid-cols-[1fr_240px]">
        <h2 className="px-6 py-4 text-xs font-semibold tracking-[0.14em] text-ink uppercase sm:px-10">
          Explore repositories
        </h2>
        <p className="hidden items-center justify-center border-l border-rule text-xs font-semibold tracking-[0.14em] text-ink uppercase lg:flex">
          {loading ? "…" : `${repos.length} ${repos.length === 1 ? "project" : "projects"}`}
        </p>
      </div>

      <CategoryFilter categories={categories} active={activeCategory} onSelect={setActiveCategory} />

      <main className="flex-1">
        <RepoGrid
          key={activeCategory ?? "all"}
          repos={repos}
          loading={loading}
          activeCategory={activeCategory}
          onClearFilter={() => setActiveCategory(null)}
          onStar={handleStar}
          newestId={newestId}
        />
      </main>

      <footer id="about" className="flex flex-col justify-between gap-4 px-6 py-8 sm:flex-row sm:items-center sm:px-10">
        <div>
          <p className="text-sm font-bold text-ink">startmyigt</p>
          <p className="mt-1 text-sm text-ink-muted">
            Exploring the world&rsquo;s open source, one README at a time.
          </p>
        </div>
        <p className="flex items-center gap-3 text-sm text-ink-muted">
          Built with <span aria-hidden>♥</span> and open source
          <GitHubIcon size={20} className="text-ink" />
        </p>
      </footer>
    </div>
  );
}
