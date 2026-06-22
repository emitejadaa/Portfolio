import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { experience } from "@/data/portfolio";

export function Experience() {
  return (
    <section
      id="experience"
      className="grid gap-10 rounded-3xl border border-black/5 bg-white/60 p-8 shadow-xl shadow-black/5 backdrop-blur dark:border-white/10 dark:bg-white/[0.02] lg:grid-cols-[0.8fr_1.2fr]"
    >
      <div className="lg:sticky lg:top-28 lg:self-start">
        <SectionHeading
          label="Experiencia aplicada"
          eyebrow="Proyectos institucionales"
        />
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Trabajo codo a codo con equipos multidisciplinarios para llevar
          prototipos a pilotos funcionales, siempre documentando aprendizajes y
          métricas que habiliten la siguiente iteración.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative space-y-6 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-gradient-to-b before:from-emerald-500/50 before:to-transparent">
        {experience.map((item, i) => (
          <Reveal key={item.role} delay={i * 80}>
            <article className="relative pl-8">
              <span className="absolute left-0 top-2 grid h-4 w-4 place-items-center rounded-full border-2 border-emerald-500 bg-background">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              <div className="rounded-2xl border border-black/5 bg-white/70 p-6 shadow-sm transition hover:border-emerald-400/40 dark:border-white/10 dark:bg-white/[0.03]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                      {item.period}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-white">
                      {item.role}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {item.organisation}
                    </p>
                  </div>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                      Ver
                      <ArrowUpRight size={13} />
                    </a>
                  )}
                </div>
                <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                  {item.details.map((detail) => (
                    <li key={detail} className="flex gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                      <span className="leading-relaxed">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
