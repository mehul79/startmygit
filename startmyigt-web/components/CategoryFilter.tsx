"use client";

import { useState } from "react";
import { ArrowRightIcon } from "@/components/icons";

export function CategoryFilter({
  categories,
  active,
  onSelect,
}: {
  categories: string[];
  active: string | null;
  onSelect: (category: string | null) => void;
}) {
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="grid border-b border-rule lg:grid-cols-[1fr_240px]">
      <nav
        aria-label="Filter by category"
        className={`flex gap-7 px-6 sm:px-10 ${
          showAll
            ? "flex-wrap"
            : "overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        }`}
      >
        <Tab label="All" isActive={active === null} onClick={() => onSelect(null)} />
        {categories.map((c) => (
          <Tab key={c} label={c} isActive={active === c} onClick={() => onSelect(c)} />
        ))}
      </nav>
      <button
        onClick={() => setShowAll((s) => !s)}
        className="hidden items-center justify-center gap-2 border-l border-rule px-6 py-4 text-sm text-ink transition-colors hover:text-orange lg:flex"
      >
        {showAll ? "Collapse categories" : "View all categories"} <ArrowRightIcon size={14} />
      </button>
    </div>
  );
}

function Tab({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className={`-mb-px shrink-0 border-b-2 py-4 text-sm transition-colors ${
        isActive
          ? "border-orange font-medium text-ink"
          : "border-transparent text-ink-muted hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}
