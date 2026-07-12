"use client";

import { useState } from "react";
import { api, type Repo } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRightIcon, GitHubIcon, LockIcon } from "@/components/icons";

type Status = "idle" | "loading" | "error";

export function SubmitForm({ onAdded }: { onAdded: (repo: Repo) => void }) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

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
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-3">
      <div className="flex items-center gap-2 rounded-xl border border-rule bg-card p-1.5 pl-4 shadow-sm">
        <GitHubIcon size={18} className="shrink-0 text-ink" />
        <Input
          id="repo-url"
          type="url"
          required
          placeholder="Paste a public GitHub repository URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={status === "loading"}
          aria-invalid={status === "error"}
          className="h-11 border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent"
        />
        <Button type="submit" disabled={status === "loading"} className="h-11 shrink-0 rounded-lg px-5">
          {status === "loading" ? (
            <>
              <span
                aria-hidden
                className="size-3 animate-spin rounded-full border-2 border-white/30 border-t-white"
              />
              Reading&hellip;
            </>
          ) : (
            <>
              Analyze repository <ArrowRightIcon size={15} />
            </>
          )}
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
      <p className="flex items-center gap-2 text-sm text-ink-muted">
        <LockIcon size={13} className="text-ink-muted" />
        No accounts. No logins. Just public repositories.
      </p>
    </form>
  );
}
