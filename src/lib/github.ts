import "server-only";
import { contact } from "@/content/profile";
import { githubSnapshot, projects } from "@/content/projects";
import type { Commit, GitHubResponse } from "./api-types";

const USER = contact.github.user;
const API = "https://api.github.com";
const REVALIDATE = 3600; // doc: caché 1 h

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "tejada-portfolio",
  };
  // Token fine-grained de solo lectura, sin acceso a privados; vive solo en el servidor.
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

async function gh<T>(path: string, init?: RequestInit): Promise<{ data: T; res: Response } | null> {
  try {
    const res = await fetch(`${API}${path}`, {
      ...init,
      headers: { ...headers(), ...(init?.headers ?? {}) },
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return { data: (await res.json()) as T, res };
  } catch {
    return null;
  }
}

/** Repos we report commit counts for (public, owned by the user). */
const trackedRepos = projects.map((p) => p.links.repoFullName).filter((r): r is string => !!r);

const LEVELS: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

type GraphQLData = {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number;
        weeks: { contributionDays: { contributionLevel: string; weekday: number }[] }[];
      };
    };
    repositories: {
      nodes: {
        nameWithOwner: string;
        pushedAt: string;
        languages: { edges: { size: number; node: { name: string; color: string | null } }[] };
        defaultBranchRef: {
          target: {
            history?: {
              totalCount: number;
              nodes: {
                messageHeadline: string;
                committedDate: string;
                url: string;
                oid: string;
                author: { user: { login: string } | null } | null;
              }[];
            };
          } | null;
        } | null;
      }[];
    };
  } | null;
};

const QUERY = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { contributionLevel weekday } }
      }
    }
    repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC, isFork: false, orderBy: { field: PUSHED_AT, direction: DESC }) {
      nodes {
        nameWithOwner
        pushedAt
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) { edges { size node { name color } } }
        defaultBranchRef { target { ... on Commit { history(first: 5) { totalCount nodes { messageHeadline committedDate url oid author { user { login } } } } } } }
      }
    }
  }
}`;

function aggregateLanguages(sizes: Map<string, { size: number; color: string | null }>) {
  const total = [...sizes.values()].reduce((a, b) => a + b.size, 0);
  if (!total) return [];
  const sorted = [...sizes.entries()].sort((a, b) => b[1].size - a[1].size);
  const top = sorted.slice(0, 6).map(([name, v]) => ({ name, color: v.color, pct: Math.max(1, Math.round((v.size / total) * 100)) }));
  const rest = 100 - top.reduce((a, b) => a + b.pct, 0);
  if (rest > 0 && sorted.length > 6) top.push({ name: "Otros", color: null, pct: rest });
  return top;
}

async function viaGraphQL(): Promise<GitHubResponse | null> {
  if (!process.env.GITHUB_TOKEN) return null;
  try {
    const res = await fetch(`${API}/graphql`, {
      method: "POST",
      headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify({ query: QUERY, variables: { login: USER } }),
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: GraphQLData };
    const user = json.data?.user;
    if (!user) return null;

    const cal = user.contributionsCollection.contributionCalendar;
    const weeks = cal.weeks.map((w) => {
      const days = Array<number>(7).fill(-1);
      w.contributionDays.forEach((d) => (days[d.weekday] = LEVELS[d.contributionLevel] ?? 0));
      return days.map((d) => Math.max(0, d));
    });

    const sizes = new Map<string, { size: number; color: string | null }>();
    const commits: Commit[] = [];
    const repoCommits: Record<string, number> = {};
    const pushedAt: Record<string, string> = {};
    for (const repo of user.repositories.nodes) {
      pushedAt[repo.nameWithOwner] = repo.pushedAt;
      for (const e of repo.languages.edges) {
        const cur = sizes.get(e.node.name);
        sizes.set(e.node.name, { size: (cur?.size ?? 0) + e.size, color: e.node.color });
      }
      const history = repo.defaultBranchRef?.target?.history;
      if (history) {
        repoCommits[repo.nameWithOwner] = history.totalCount;
        for (const c of history.nodes) {
          if (c.author?.user?.login?.toLowerCase() !== USER.toLowerCase()) continue;
          commits.push({ repo: repo.nameWithOwner.split("/")[1]!, message: c.messageHeadline, url: c.url, date: c.committedDate, sha: c.oid.slice(0, 7) });
        }
      }
    }
    commits.sort((a, b) => +new Date(b.date) - +new Date(a.date));

    return {
      total: cal.totalContributions,
      weeks: weeks.slice(-53),
      lastCommit: commits[0] ?? null,
      commits: commits.slice(0, 5),
      languages: aggregateLanguages(sizes),
      repoCommits,
      pushedAt,
      source: "graphql",
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/** Public contributions calendar (no token): parses the same HTML the profile page uses. */
async function scrapeCalendar(): Promise<{ total: number; weeks: number[][] } | null> {
  try {
    const res = await fetch(`https://github.com/users/${USER}/contributions`, {
      headers: { "User-Agent": "tejada-portfolio", Accept: "text/html" },
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    const days: { date: string; level: number }[] = [];
    for (const m of html.matchAll(/<td[^>]*ContributionCalendar-day[^>]*>/g)) {
      const tag = m[0];
      const date = tag.match(/data-date="(\d{4}-\d{2}-\d{2})"/)?.[1];
      const level = tag.match(/data-level="(\d)"/)?.[1];
      if (date && level) days.push({ date, level: Number(level) });
    }
    if (!days.length) return null;
    days.sort((a, b) => a.date.localeCompare(b.date));
    const weeks: number[][] = [];
    let week: number[] = [];
    for (const d of days) {
      const wd = new Date(`${d.date}T12:00:00Z`).getUTCDay();
      if (wd === 0 && week.length) {
        weeks.push(week);
        week = [];
      }
      while (week.length < wd) week.push(0);
      week.push(d.level);
    }
    if (week.length) {
      while (week.length < 7) week.push(0);
      weeks.push(week);
    }
    const totalText = html.match(/([\d,.]+)\s+contributions?\s+in the last year/i)?.[1];
    const total = totalText ? Number(totalText.replace(/[,.]/g, "")) : githubSnapshot.contributionsLastYear;
    return { total, weeks: weeks.slice(-53) };
  } catch {
    return null;
  }
}

function lastPage(link: string | null): number | null {
  const m = link?.match(/[?&]page=(\d+)>;\s*rel="last"/);
  return m?.[1] ? Number(m[1]) : null;
}

async function viaREST(): Promise<GitHubResponse> {
  const [calendar, repos] = await Promise.all([
    scrapeCalendar(),
    gh<{ full_name: string; pushed_at: string; language: string | null; fork: boolean }[]>(
      `/users/${USER}/repos?per_page=100&type=owner&sort=pushed`,
    ),
  ]);

  const ownRepos = (repos?.data ?? []).filter((r) => !r.fork);
  const pushedAt: Record<string, string> = {};
  ownRepos.forEach((r) => (pushedAt[r.full_name] = r.pushed_at));

  // Lenguajes: bytes por repo (o el lenguaje principal si la API no responde).
  const sizes = new Map<string, { size: number; color: string | null }>();
  const langResults = await Promise.all(
    ownRepos.slice(0, 20).map((r) => gh<Record<string, number>>(`/repos/${r.full_name}/languages`)),
  );
  langResults.forEach((res, i) => {
    if (res) {
      Object.entries(res.data).forEach(([name, size]) => {
        const cur = sizes.get(name);
        sizes.set(name, { size: (cur?.size ?? 0) + size, color: LANGUAGE_COLORS[name] ?? null });
      });
    } else {
      const lang = ownRepos[i]?.language;
      if (lang) sizes.set(lang, { size: (sizes.get(lang)?.size ?? 0) + 1, color: LANGUAGE_COLORS[lang] ?? null });
    }
  });

  // Últimos commits públicos: los 3 repos con push más reciente.
  const commitLists = await Promise.all(
    ownRepos.slice(0, 3).map((r) =>
      gh<{ sha: string; html_url: string; commit: { message: string; author: { date: string } }; author: { login: string } | null }[]>(
        `/repos/${r.full_name}/commits?per_page=5&author=${USER}`,
      ).then((res) => ({ repo: r.full_name, list: res?.data ?? [] })),
    ),
  );
  const commits: Commit[] = commitLists
    .flatMap(({ repo, list }) =>
      list.map((c) => ({
        repo: repo.split("/")[1]!,
        message: c.commit.message.split("\n")[0]!,
        url: c.html_url,
        date: c.commit.author.date,
        sha: c.sha.slice(0, 7),
      })),
    )
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

  // Conteo de commits por repo: el número de la última página con per_page=1.
  const repoCommits: Record<string, number> = {};
  await Promise.all(
    trackedRepos.map(async (full) => {
      const res = await gh<unknown[]>(`/repos/${full}/commits?per_page=1`);
      if (!res) return;
      const n = lastPage(res.res.headers.get("link")) ?? (Array.isArray(res.data) ? res.data.length : 0);
      if (n) repoCommits[full] = n;
    }),
  );

  return {
    total: calendar?.total ?? githubSnapshot.contributionsLastYear,
    weeks: calendar?.weeks ?? [],
    lastCommit: commits[0] ?? null,
    commits: commits.slice(0, 5),
    languages: aggregateLanguages(sizes),
    repoCommits,
    pushedAt,
    source: calendar || repos ? "public" : "fallback",
    updatedAt: new Date().toISOString(),
  };
}

export async function getGitHub(): Promise<GitHubResponse> {
  return (await viaGraphQL()) ?? (await viaREST());
}

/** Last deployment per repo, as Vercel records it on GitHub (no Vercel or Render token needed). */
export async function getLatestDeployment(full: string): Promise<string | null> {
  const res = await gh<{ created_at: string; environment: string }[]>(`/repos/${full}/deployments?per_page=10`);
  if (!res || !res.data.length) return null;
  const prod = res.data.find((d) => /^production/i.test(d.environment)) ?? res.data[0];
  return prod?.created_at ?? null;
}

export async function getPushedAt(full: string): Promise<string | null> {
  const res = await gh<{ pushed_at: string }>(`/repos/${full}`);
  return res?.data.pushed_at ?? null;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Astro: "#ff5a03",
  "Jupyter Notebook": "#DA5B0B",
  Assembly: "#6E4C13",
  Shell: "#89e051",
  PowerShell: "#012456",
  Dockerfile: "#384d54",
  SCSS: "#c6538c",
  Vue: "#41b883",
};
