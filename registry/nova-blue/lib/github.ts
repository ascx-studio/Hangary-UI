export interface GitHubRepo {
  /** Display name in `owner/repo` format (e.g. `"shadcn-ui/ui"`). */
  fullName: string;
  /** Number of stars on the repository. */
  stars: number;
  /** Number of forks. */
  forks: number;
  /** Number of subscribers (people watching the repo). */
  watchers: number;
  /** Number of open issues. */
  issues: number;
  /** Repository description */
  description: string | null;
  /** Repository topics/tags */
  topics: string[];
  /** Whether the repository is archived */
  isArchived: boolean;
  /** Whether the repository is a fork */
  isFork: boolean;
  /** Primary programming language */
  language: string | null;
  /** Hex color code for the language */
  languageColor: string | null;
  /** SPDX license identifier */
  license: string | null;
  /** Last updated timestamp */
  updatedAt: string;
}

/** Type alias for backward compatibility */
export type GitHubRepoData = GitHubRepo;

/**
 * Fetch public metadata for a GitHub repository.
 *
 * - Uses the public GitHub REST API — no API key required.
 * - Optionally authenticates with `process.env.GITHUB_TOKEN` to raise
 *   the rate limit from 60 → 5 000 requests per hour.
 * - Caches the result for 1 hour via Next.js ISR (`next.revalidate`).
 *
 * Returns `null` if the request fails or the repo doesn't exist.
 */
export async function fetchGitHubRepo(
  owner: string,
  repo: string,
): Promise<GitHubRepo | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        next: { revalidate: 3600 },
      },
    );
    if (!response.ok) return null;
    const data = await response.json();
    if (
      typeof data.full_name !== "string" ||
      typeof data.stargazers_count !== "number"
    ) {
      return null;
    }
    return {
      fullName: data.full_name,
      stars: data.stargazers_count,
      forks: data.forks_count,
      watchers: data.subscribers_count,
      issues: data.open_issues_count,
      description: data.description ?? null,
      topics: Array.isArray(data.topics) ? data.topics : [],
      isArchived: data.archived === true,
      isFork: data.fork === true,
      language: data.language ?? null,
      languageColor: data.language_color ?? null,
      license: data.license?.spdx_id ?? null,
      updatedAt: data.updated_at ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/** Alias for fetchGitHubRepo for backward compatibility */
export const fetchGitHubRepoData = fetchGitHubRepo;

/**
 * Format a number for compact display.
 *
 * - `236000` → `"236k"`
 * - `1500000` → `"1.5m"`
 * - `842` → `"842"`
 */
export function formatCount(count: number): string {
  if (count >= 1_000_000) {
    const value = count / 1_000_000;
    return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}m`;
  }
  if (count >= 1_000) {
    const value = count / 1_000;
    return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}k`;
  }
  return count.toLocaleString("en-US");
}

/**
 * Format a relative date (e.g., "2 days ago").
 */
export function formatRelativeDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffMonths / 12);

    if (diffSecs < 60) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    if (diffMonths < 12) return `${diffMonths}mo ago`;
    return `${diffYears}y ago`;
  } catch {
    return "unknown";
  }
}

/** @deprecated Use `formatCount` instead. */
export const formatStarCount = formatCount;
