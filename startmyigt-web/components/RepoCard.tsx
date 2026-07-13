import { csv, type Repo } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRightIcon, RepoIcon, StarIcon } from "@/components/icons";

function formatDate(sqlite: string) {
  const d = new Date(sqlite.replace(" ", "T") + "Z");
  return isNaN(d.getTime())
    ? sqlite
    : d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

export function RepoCard({ repo, isNew }: { repo: Repo; isNew?: boolean }) {
  return (
    <article
      className={`grid gap-5 border-b border-rule px-6 py-8 sm:px-10 md:grid-cols-[220px_1fr_170px] md:gap-8 ${
        isNew ? "animate-[card-in_0.4s_cubic-bezier(0.16,1,0.3,1)]" : ""
      }`}
    >
      <div>
        <a
          href={`https://${repo.url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-2.5 font-semibold text-ink hover:text-orange"
        >
          <RepoIcon size={16} className="mt-0.5 shrink-0" />
          <span className="break-words">
            {repo.owner} / {repo.name}
          </span>
        </a>
        <p className="mt-2 pl-[26px] text-sm text-ink-muted">{formatDate(repo.created_at)}</p>
      </div>

      <div className="min-w-0">
        <p className="max-w-prose text-[15px] leading-relaxed text-ink">{repo.summary}</p>
        {csv(repo.tech_stack).length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1" aria-label="Tech stack">
            {csv(repo.tech_stack).map((t) => (
              <li key={t} className="flex items-center gap-1.5 text-sm text-ink-muted">
                <span aria-hidden className="size-1 rounded-full bg-orange" />
                {t}
              </li>
            ))}
          </ul>
        )}
        {csv(repo.categories).length > 0 && (
          <ul className="mt-3.5 flex flex-wrap gap-2" aria-label="Categories">
            {csv(repo.categories).map((c) => (
              <li key={c}>
                <Badge variant="outline" className="rounded-full border-orange/30 px-2.5 py-0.5 font-normal text-orange">
                  {c}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-row items-center gap-4 md:flex-col md:items-end md:gap-3">
        <a
          href={`https://${repo.url}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${repo.owner}/${repo.name} on GitHub (${repo.stars} stars)`}
          className="group flex items-center gap-2 text-lg font-semibold text-ink"
        >
          <StarIcon size={18} className="text-ink-muted transition-colors group-hover:text-orange" />
          <span className="tabular-nums">{repo.stars.toLocaleString()}</span>
        </a>
        <a
          href={`https://${repo.url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-ink-muted hover:text-orange"
        >
          View on GitHub <ArrowUpRightIcon size={13} />
        </a>
      </div>
    </article>
  );
}
