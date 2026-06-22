import { ExternalLink, Github } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { projects } from "@/data/portfolio";

export function Projects() {
  return (
    <section id="projects" className="pt-8">
      <SectionHeading label="Proyectos destacados" eyebrow="Impacto real" />
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.title} delay={(i % 2) * 80}>
            <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white/70 p-6 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-emerald-400/30">
              {/* Brillo sutil al hover */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 transition group-hover:opacity-100"
              />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {project.impact}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {project.links.site && (
                    <a
                      href={project.links.site}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${project.title} – sitio en vivo`}
                      className="grid h-9 w-9 place-items-center rounded-full border border-black/10 text-zinc-600 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-white/10 dark:text-zinc-300"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${project.title} – código`}
                      className="grid h-9 w-9 place-items-center rounded-full border border-black/10 text-zinc-600 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-white/10 dark:text-zinc-300"
                    >
                      <Github size={15} />
                    </a>
                  )}
                </div>
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                {project.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
