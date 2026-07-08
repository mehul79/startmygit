"use client";

export function CategoryFilter({
  categories,
  active,
  onSelect,
}: {
  categories: string[];
  active: string | null;
  onSelect: (category: string | null) => void;
}) {
  if (categories.length === 0) return null;

  return (
    <nav
      aria-label="Filter by category"
      className="sticky top-0 z-10 -mx-4 flex gap-2 overflow-x-auto bg-bg/95 px-4 py-3 backdrop-blur-sm"
    >
      <Chip label="All" isActive={active === null} onClick={() => onSelect(null)} />
      {categories.map((c) => (
        <Chip key={c} label={c} isActive={active === c} onClick={() => onSelect(c)} />
      ))}
    </nav>
  );
}

function Chip({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors active:scale-[0.97] ${
        isActive
          ? "border-accent bg-accent text-accent-ink"
          : "border-border bg-surface text-ink-muted hover:border-accent hover:text-accent"
      }`}
    >
      {label}
    </button>
  );
}
