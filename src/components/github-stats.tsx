import { ArrowUpRight, FolderGit2, Github, Star, Users } from "lucide-react";
import { githubStats } from "@/data/portfolio";

type GithubUser = {
  public_repos: number;
  followers: number;
};

async function getStats(): Promise<{ repos: number; followers: number }> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${githubStats.username}`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 86400 }, // 1 día
      }
    );
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const data = (await res.json()) as GithubUser;
    return {
      repos: data.public_repos ?? githubStats.fallback.publicRepos,
      followers: data.followers ?? githubStats.fallback.followers,
    };
  } catch {
    return {
      repos: githubStats.fallback.publicRepos,
      followers: githubStats.fallback.followers,
    };
  }
}

export async function GithubStats() {
  const { repos, followers } = await getStats();

  const stats = [
    { label: "Repositorios públicos", value: `${repos}+`, Icon: FolderGit2 },
    { label: "Seguidores", value: `${followers}`, Icon: Users },
    { label: "Lenguajes principales", value: `${githubStats.languages.length}`, Icon: Star },
  ];

  return (
    <section className="overflow-hidden rounded-3xl border border-black/5 bg-white/70 p-8 shadow-xl shadow-black/5 ring-1 ring-black/5 backdrop-blur dark:border-white/10 dark:bg-white/[0.03] dark:ring-white/5">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid flex-1 gap-4 sm:grid-cols-3">
          {stats.map(({ label, value, Icon }) => (
            <div
              key={label}
              className="rounded-2xl border border-black/5 bg-white/60 p-5 dark:border-white/10 dark:bg-white/[0.02]"
            >
              <Icon className="h-5 w-5 text-emerald-500 dark:text-emerald-400" aria-hidden="true" />
              <p className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {value}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {label}
              </p>
            </div>
          ))}
        </div>

        <div className="lg:max-w-xs">
          <div className="flex flex-wrap gap-2">
            {githubStats.languages.map((lang) => (
              <span
                key={lang}
                className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300"
              >
                {lang}
              </span>
            ))}
          </div>
          <a
            href={githubStats.url}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <Github size={16} />
            Ver perfil en GitHub
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
