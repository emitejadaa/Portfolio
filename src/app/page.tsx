import Link from "next/link";
import {
  ArrowUpRight,
  Boxes,
  Braces,
  Brackets,
  Cherry,
  CircuitBoard,
  Code2,
  Database,
  DatabaseZap,
  ExternalLink,
  Figma,
  FlaskConical,
  GitBranch,
  Github,
  Grid3x3,
  Infinity,
  LayoutPanelLeft,
  LineChart,
  Linkedin,
  Mail,
  PhoneCall,
  Sparkles,
  SquareCode,
  TerminalSquare,
  Zap,
  Binary,
  type LucideIcon,
} from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  achievements,
  contactContent,
  education,
  experience,
  heroContent,
  projects,
  skillGroups,
  socialLinks,
} from "@/data/portfolio";

const skillBadgeClass =
  "inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white px-4 py-1 text-sm font-medium text-zinc-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100";

const techIconMap: Record<string, LucideIcon> = {
  Arduino: CircuitBoard,
  Electrónica: Zap,
  C: Braces,
  "C++": Brackets,
  "Raspberry Pi": Cherry,
  Python: Binary,
  TensorFlow: Boxes,
  NumPy: Grid3x3,
  Matplotlib: LineChart,
  "Google Colab": Infinity,
  Flask: FlaskConical,
  JavaScript: Code2,
  SQL: Database,
  Postgres: DatabaseZap,
  "HTML / CSS": LayoutPanelLeft,
  "Git & GitHub": GitBranch,
  Linux: TerminalSquare,
  "VS Code": SquareCode,
  Figma: Figma,
};

export default function Home() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-12 lg:px-10 lg:py-16">
      <header className="rounded-3xl bg-white/80 p-8 shadow-2xl shadow-emerald-500/5 ring-1 ring-black/5 dark:bg-zinc-900/70 dark:ring-white/5">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
              {heroContent.roles.join(" | ")}
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-zinc-900 dark:text-white sm:text-5xl">
              {heroContent.name}
            </h1>
          </div>
          <ThemeToggle />
        </div>
        <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-300">
          {heroContent.headline}
        </p>
        <p className="mt-4 max-w-3xl text-base text-zinc-500 dark:text-zinc-400">
          {heroContent.about}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {heroContent.roles.map((role) => (
            <span
              key={role}
              className="rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-1 text-sm font-medium text-white shadow-md"
            >
              {role}
            </span>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-400/40 transition hover:bg-emerald-600"
          >
            Hablemos
            <ArrowUpRight size={16} />
          </Link>
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
          >
            GitHub
            <Github size={16} />
          </a>
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-transparent bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
          >
            LinkedIn
            <Linkedin size={16} />
          </a>
        </div>
        <div className="mt-8 flex flex-col gap-2 text-sm text-zinc-500 dark:text-zinc-400 sm:flex-row sm:items-center sm:gap-6">
          <span className="inline-flex items-center gap-2 font-medium text-zinc-900 dark:text-white">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {heroContent.availability}
          </span>
          <span className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-700 sm:block" />
          <nav className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            <Link href="#projects" className="hover:text-emerald-500">
              Proyectos
            </Link>
            <Link href="#experience" className="hover:text-emerald-500">
              Experiencia
            </Link>
            <Link href="#skills" className="hover:text-emerald-500">
              Skills
            </Link>
            <Link href="#contact" className="hover:text-emerald-500">
              Contacto
            </Link>
          </nav>
        </div>
      </header>

      <section
        id="projects"
        className="rounded-3xl bg-white/80 p-8 shadow-xl ring-1 ring-black/5 dark:bg-zinc-900/70 dark:ring-white/10"
      >
        <SectionHeading label="Proyectos destacados" eyebrow="Impacto real" />
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.title}
              className="flex flex-col rounded-2xl border border-zinc-100 bg-gradient-to-b from-white to-white/60 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-900/60"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-sm text-emerald-500">
                    {project.impact}
                  </p>
                </div>
                <div className="flex gap-2">
                  {project.links.site && (
                    <a
                      href={project.links.site}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-zinc-700 dark:text-zinc-200"
                    >
                      Live
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-zinc-700 dark:text-zinc-200"
                    >
                      Código
                      <Github size={14} />
                    </a>
                  )}
                </div>
              </div>
              <p className="mt-4 flex-1 text-sm text-zinc-600 dark:text-zinc-300">
                {project.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="experience"
        className="grid gap-8 rounded-3xl bg-white/80 p-8 shadow-xl ring-1 ring-black/5 dark:bg-zinc-900/70 dark:ring-white/10 lg:grid-cols-2"
      >
        <div>
          <SectionHeading
            label="Experiencia aplicada"
            eyebrow="Proyectos institucionales"
          />
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Trabajo codo a codo con equipos multidisciplinarios para llevar
            prototipos a pilotos funcionales, siempre documentando aprendizajes y
            métricas que habiliten la siguiente iteración.
          </p>
        </div>
        <div className="space-y-6">
          {experience.map((item) => (
            <article
              key={item.role}
              className="rounded-2xl border border-zinc-100/60 bg-white/80 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/60"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
                    {item.period}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-white">
                    {item.role}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {item.organisation}
                  </p>
                </div>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-transparent bg-zinc-900/90 px-3 py-1 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-white/90 dark:text-zinc-900"
                >
                  Ver
                  <ArrowUpRight size={14} />
                </a>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                {item.details.map((detail) => (
                  <li key={detail} className="flex gap-2">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section
        id="skills"
        className="grid gap-8 rounded-3xl bg-white/80 p-8 shadow-xl ring-1 ring-black/5 dark:bg-zinc-900/70 dark:ring-white/10 lg:grid-cols-2"
      >
        <div>
          <SectionHeading label="Tecnologías" eyebrow="Stack principal" />
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Ordeno las herramientas por dominios para atacar proyectos complejos
            sin perder el foco entre hardware, software y datos.
          </p>
        </div>
        <div className="grid gap-4">
          {skillGroups.map((group) => (
            <article
              key={group.title}
              className="rounded-2xl border border-zinc-100 bg-white/70 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40"
            >
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
                {group.title}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => {
                  const Icon = techIconMap[item] ?? Sparkles;
                  return (
                    <span key={item} className={skillBadgeClass}>
                      <Icon
                        className="h-4 w-4 text-emerald-500"
                        aria-hidden="true"
                      />
                      {item}
                    </span>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 rounded-3xl bg-white/80 p-8 shadow-xl ring-1 ring-black/5 dark:bg-zinc-900/70 dark:ring-white/10 lg:grid-cols-2">
        <div>
          <SectionHeading
            label="Educación & Certificaciones"
            eyebrow="Formación"
          />
          <div className="space-y-4">
            {education.map((item) => (
              <article
                key={item.institution}
                className="rounded-2xl border border-zinc-100/70 bg-white/80 p-4 dark:border-zinc-800 dark:bg-zinc-950/40"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-500">
                  {item.period}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-white">
                  {item.institution}
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {item.detail}
                </p>
              </article>
            ))}
          </div>
        </div>
        <div>
          <SectionHeading label="Reconocimientos" eyebrow="Highlights" />
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <article
                key={achievement.title}
                className="rounded-2xl border border-zinc-100/70 bg-gradient-to-r from-emerald-50 to-cyan-50 p-4 text-zinc-800 shadow-sm dark:border-transparent dark:from-emerald-500/10 dark:to-cyan-500/10 dark:text-white"
              >
                <h3 className="text-base font-semibold">{achievement.title}</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-200">
                  {achievement.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="grid gap-10 rounded-3xl bg-white/90 p-8 shadow-2xl shadow-emerald-500/10 ring-1 ring-black/5 dark:bg-zinc-900/70 dark:ring-white/10 lg:grid-cols-2"
      >
        <div className="space-y-6">
          <SectionHeading label="Contacto" eyebrow="Construyamos algo" />
          <p className="text-base text-zinc-600 dark:text-zinc-300">
            {contactContent.copy}
          </p>
          <div className="rounded-2xl border border-zinc-100/80 bg-white/70 p-4 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300">
            <p className="font-semibold text-zinc-900 dark:text-white">
              {contactContent.responseTime}
            </p>
            <p>También podés escribirme por cualquiera de estos canales:</p>
          </div>
          <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
            <li className="flex items-center gap-3">
              <span className="rounded-full bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                <Mail size={18} />
              </span>
              <a
                href={`mailto:${socialLinks.email}`}
                className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-white"
              >
                {socialLinks.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="rounded-full bg-zinc-100 p-2 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-100">
                <Github size={18} />
              </span>
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-white"
              >
                github.com/emitejadaa
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                <Linkedin size={18} />
              </span>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-white"
              >
                LinkedIn
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="rounded-full bg-slate-100 p-2 text-slate-600 dark:bg-slate-500/10 dark:text-slate-200">
                <PhoneCall size={18} />
              </span>
              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-white"
              >
                WhatsApp +54 11 6893 1873
              </a>
            </li>
          </ul>
        </div>
        <div className="rounded-3xl border border-zinc-100 bg-white/80 p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-950/60">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-500">
            Enviar mensaje
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-white">
            Contame sobre tu proyecto
          </h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Recibirás un correo para confirmar el envío. Podés continuar el hilo
            en el canal que prefieras.
          </p>
          <div className="mt-6">
            <ContactForm emailTo={socialLinks.email} />
          </div>
        </div>
      </section>
    </main>
  );
}
