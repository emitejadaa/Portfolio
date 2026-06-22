import Link from "next/link";
import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import { heroContent, socialLinks } from "@/data/portfolio";

export function Hero() {
  return (
    <section id="top" className="relative pt-10 sm:pt-16">
      {/* Glow decorativo de fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-[40rem] max-w-full -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[120px] dark:bg-emerald-500/15"
      />

      <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-300">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        Disponible para nuevos proyectos
      </p>

      <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight text-zinc-900 dark:text-white sm:text-6xl lg:text-7xl">
        {heroContent.name}
      </h1>

      <p className="mt-4 text-xl font-medium text-zinc-500 dark:text-zinc-400 sm:text-2xl">
        {heroContent.roles.map((role, i) => (
          <span key={role}>
            <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              {role}
            </span>
            {i < heroContent.roles.length - 1 && (
              <span className="mx-2 text-zinc-300 dark:text-zinc-600">/</span>
            )}
          </span>
        ))}
      </p>

      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
        {heroContent.headline}
      </p>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
        {heroContent.about}
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Link
          href="#contact"
          className="group inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600"
        >
          Hablemos
          <ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
        <a
          href={socialLinks.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-6 py-3 text-sm font-semibold text-zinc-900 backdrop-blur transition hover:border-zinc-300 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-white/20"
        >
          <Github size={16} />
          GitHub
        </a>
        <a
          href={socialLinks.linkedin}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-6 py-3 text-sm font-semibold text-zinc-900 backdrop-blur transition hover:border-zinc-300 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-white/20"
        >
          <Linkedin size={16} />
          LinkedIn
        </a>
      </div>
    </section>
  );
}
