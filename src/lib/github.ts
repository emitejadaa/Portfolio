import { githubStats } from "@/data/portfolio";

/** Live public-repo count, revalidated daily. Falls back when the API is unavailable. */
export async function getGithubRepos(): Promise<number> {
  try {
    const res = await fetch(`https://api.github.com/users/${githubStats.username}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const data = (await res.json()) as { public_repos?: number };
    return data.public_repos ?? githubStats.fallback.publicRepos;
  } catch {
    return githubStats.fallback.publicRepos;
  }
}
