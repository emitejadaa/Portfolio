import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { getTechIcon } from "@/lib/tech-icons";
import { skillGroups } from "@/data/portfolio";

const skillBadgeClass =
  "inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3.5 py-1.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-emerald-400/50 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:text-white";

export function Skills() {
  return (
    <section id="skills" className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <SectionHeading label="Tecnologías" eyebrow="Stack principal" />
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Ordeno las herramientas por dominios para atacar proyectos complejos
          sin perder el foco entre hardware, software y datos.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {skillGroups.map((group, i) => (
          <Reveal key={group.title} delay={(i % 2) * 80}>
            <article className="h-full rounded-2xl border border-black/5 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.02]">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                {group.title}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => {
                  const Icon = getTechIcon(item);
                  return (
                    <span key={item} className={skillBadgeClass}>
                      <Icon
                        className="h-4 w-4 text-emerald-500 dark:text-emerald-400"
                        aria-hidden="true"
                      />
                      {item}
                    </span>
                  );
                })}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
