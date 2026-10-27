export type WeatherResponse = {
  temp: number;
  code: number;
  max: number;
  min: number;
  isDay: boolean;
  updatedAt: string;
};

export type Commit = { repo: string; message: string; url: string; date: string; sha: string };

export type GitHubResponse = {
  total: number;
  /** 53 weeks × 7 days, contribution level 0–4 (Sunday first). */
  weeks: number[][];
  lastCommit: Commit | null;
  commits: Commit[];
  languages: { name: string; color: string | null; pct: number }[];
  /** Live commit counts keyed by "owner/repo". */
  repoCommits: Record<string, number>;
  /** Push timestamps keyed by "owner/repo". */
  pushedAt: Record<string, string>;
  source: "graphql" | "public" | "fallback";
  updatedAt: string;
};

export type ServiceState = "up" | "slow" | "down";

export type StatusResponse = {
  services: { slug: string; title: string; url: string; state: ServiceState; ms: number | null; code: number | null; window: boolean }[];
  updatedAt: string;
};

export type DeploysResponse = {
  latest: { slug: string; title: string; date: string } | null;
  bySlug: Record<string, string>;
  updatedAt: string;
};

export type ContactResponse = { ok: true } | { ok: false; error: "validation" | "rate" | "send"; fields?: string[] };
