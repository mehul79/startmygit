"use client";

import { useId, useState } from "react";
import { api, type Repo } from "@/lib/api";
import { PillButton } from "@/components/resin";

type Status = "idle" | "loading" | "error";

export function SubmitForm({ onAdded }: { onAdded: (repo: Repo) => void }) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();
  const errorId = useId();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setError(null);
    try {
      const repo = await api.submitRepo(url.trim());
      onAdded(repo);
      setUrl("");
      setStatus("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "something went wrong");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:max-w-md">
      <label htmlFor={inputId} className="text-sm font-medium text-ink">
        Add a repo
      </label>
      <div className="flex gap-2">
        <input
          id={inputId}
          type="url"
          required
          placeholder="github.com/owner/repo"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={status === "loading"}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={status === "error"}
          className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus-visible:border-accent disabled:opacity-60"
        />
        <PillButton type="submit" disabled={status === "loading"} className="shrink-0">
          {status === "loading" ? (
            <>
              <span
                aria-hidden
                className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white"
              />
              Reading&hellip;
            </>
          ) : (
            "Submit"
          )}
        </PillButton>
      </div>
      <p className="text-xs text-ink-muted">
        Paste a public GitHub repo URL &mdash; the summary, tech stack, and categories are generated
        automatically.
      </p>
      {error && (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </form>
  );
}
