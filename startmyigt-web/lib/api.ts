const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

export type Repo = {
  id: number;
  url: string;
  owner: string;
  name: string;
  summary: string;
  tech_stack: string; // CSV, matches schema.sql
  categories: string; // CSV, matches schema.sql
  stars: number;
  created_at: string;
};

export type ApiError = { error: string; id?: number };

async function json<T>(res: Response): Promise<T> {
  const body = await res.json();
  if (!res.ok) throw new Error((body as ApiError).error ?? `request failed (${res.status})`);
  return body as T;
}

export const api = {
  listRepos: (category?: string): Promise<Repo[]> =>
    fetch(`${API_URL}/repos${category ? `?category=${encodeURIComponent(category)}` : ""}`).then(
      (r) => json<Repo[]>(r)
    ),

  listCategories: (): Promise<string[]> => fetch(`${API_URL}/categories`).then((r) => json<string[]>(r)),

  submitRepo: (url: string): Promise<Repo> =>
    fetch(`${API_URL}/repos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    }).then((r) => json<Repo>(r)),
};

export const csv = (s: string): string[] => s.split(",").filter(Boolean);
