import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { achievements, education } from "@/data/portfolio";

export function Education() {
  return (
    <section className="grid gap-10 lg:grid-cols-2">
      <div>
        <SectionHeading label="Educación & Certificaciones" eyebrow="Formación" />
        <div className="space-y-4">
          {education.map((item, i) => (
            <Reveal key={item.institution} delay={i * 70}>
              <article className="rounded-2xl border border-black/5 bg-white/60 p-5 backdrop-blur dark:border-white/10 dark:bg-white/[0.02]">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400">
                  {item.period}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-white">
                  {item.institution}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {item.detail}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <div>
        <SectionHeading label="Reconocimientos" eyebrow="Highlights" />
        <div className="space-y-4">
          {achievements.map((achievement, i) => (
            <Reveal key={achievement.title} delay={i * 70}>
              <article className="rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 p-5 text-zinc-800 shadow-sm dark:text-white">
                <h3 className="text-base font-semibold">{achievement.title}</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-200">
                  {achievement.description}
                </p>
                {achievement.site && (
                  <a
                    href={achievement.site}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200"
                  >
                    Visitar
                    <ArrowUpRight size={14} />
                  </a>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
