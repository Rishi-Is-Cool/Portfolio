/**
 * GitHub repository metadata, fetched server-side and cached.
 *
 * A GitHub outage or rate limit must never take the portfolio down: every
 * failure path returns an empty list and the section simply does not render.
 */

import { featuredRepos, profile } from "./content";

export interface Repo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  url: string;
  pushedAt: string;
}

interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  pushed_at: string;
  fork: boolean;
}

const REVALIDATE_SECONDS = 3600;

export async function getRepos(): Promise<Repo[]> {
  const token = process.env.GITHUB_TOKEN;

  try {
    const response = await fetch(
      `https://api.github.com/users/${profile.githubUser}/repos?per_page=100&sort=pushed`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        next: { revalidate: REVALIDATE_SECONDS },
        signal: AbortSignal.timeout(8000),
      },
    );

    if (!response.ok) return [];

    const data: unknown = await response.json();
    if (!Array.isArray(data)) return [];

    const order = new Map<string, number>(featuredRepos.map((name, i) => [name.toLowerCase(), i]));

    return (data as GitHubRepo[])
      .filter((repo) => !repo.fork && order.has(repo.name.toLowerCase()))
      .sort(
        (a, b) => order.get(a.name.toLowerCase())! - order.get(b.name.toLowerCase())!,
      )
      .map((repo) => ({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        url: repo.html_url,
        pushedAt: repo.pushed_at,
      }));
  } catch {
    return [];
  }
}

export function formatUpdated(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}
