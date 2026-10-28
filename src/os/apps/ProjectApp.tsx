"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { stackItemLabel } from "@/content/profile";
import { getProject, windowProjects } from "@/content/projects";
import type { Project } from "@/content/types";
import { ui } from "@/content/ui";
import { useNow } from "../hooks";
import { Icon } from "../icons";
import { formatNumber, relativeTime, useLocale, useT } from "../i18n";
import { useDeploys, useGitHub, useStatus } from "../live";
import { useOS } from "../store";
import { ProjectMedia } from "./ProjectMedia";

type Tab = "overview" | "stack" | "process" | "code";
const TABS: Tab[] = ["overview", "stack", "process", "code"];

export function ProjectApp({ slug, view }: { slug: string; view?: string }) {
  const project = getProject(slug);
  const layout = useOS((s) => s.layout);
  if (!project) return null;
  const index = windowProjects.findIndex((p) => p.slug === slug) + 1;
  const full = project.tier === "destacado";
  return full && layout !== "mobile" ? (
    <div className="flex h-full">
      <Sidebar project={project} />
      <div className="scroll-area min-w-0 flex-1">
        <ProjectBody project={project} index={index} view={view} />
      </div>
    </div>
  ) : (
    <div className="scroll-area h-full">
      <ProjectBody project={project} index={index} view={view} />
    </div>
  );
}

function useLiveStatus(project: Project) {
  const t = useT();
  const locale = useLocale();
  const now = useNow();
  const status = useStatus();
  const deploys = useDeploys();
  const gh = useGitHub();
  const svc = status.data?.services.find((s) => s.slug === project.slug);
  const deployed = deploys.data?.bySlug[project.slug];
  const pushed = project.links.repoFullName ? gh.data?.pushedAt[project.links.repoFullName] : undefined;

  if (project.links.demo && project.monitor !== false) {
    if (!svc) return { tone: "idle" as const, text: t(ui.project.status.checking) };
    const base = svc.state === "up" ? t(ui.project.status.up) : svc.state === "slow" ? t(ui.project.status.slow) : t(ui.project.status.down);
    const when = deployed && now ? ` · ${relativeTime(deployed, locale, now)}` : svc.ms ? ` · ${svc.ms} ms` : "";
    return { tone: svc.state, text: `${base}${when}` };
  }
  if (pushed && now) return { tone: "idle" as const, text: `${t(ui.project.lastPush)} · ${relativeTime(pushed, locale, now)}` };
  return { tone: "idle" as const, text: project.links.demo ? project.links.demoLabel ?? new URL(project.links.demo).host : t(ui.project.status.unknown) };
}

function StatusLine({ project }: { project: Project }) {
  const s = useLiveStatus(project);
  const color = s.tone === "up" ? "bg-ok" : s.tone === "slow" ? "bg-warn" : s.tone === "down" ? "bg-danger" : "bg-text-2";
  return (
    <span className="flex items-center gap-2 font-mono text-[12px] text-text-2" suppressHydrationWarning>
      <span className={`h-[7px] w-[7px] shrink-0 rounded-full ${color}`} />
      <span className="truncate">{s.text}</span>
    </span>
  );
}

/** A·07 Sidebar: archivos del proyecto. */
function Sidebar({ project }: { project: Project }) {
  const t = useT();
  const files: { id: Tab | "captures"; label: string }[] = [
    { id: "overview", label: ui.project.files.overview },
    { id: "stack", label: ui.project.files.stack },
    { id: "process", label: ui.project.files.process },
    { id: "captures", label: ui.project.files.captures },
    { id: "code", label: t(ui.project.files.code) },
  ];
  const go = (id: string) => window.dispatchEvent(new CustomEvent(`project-nav:${project.slug}`, { detail: id }));
  return (
    <aside className="flex w-[210px] shrink-0 flex-col border-r border-line p-2 daylight:border-[var(--tinta)]">
      <span className="px-2 pt-2.5 pb-3 font-mono text-[13px] text-text">▾ {project.slug}</span>
      <ul className="flex flex-col gap-0.5">
        {files.map((f) => (
          <li key={f.id}>
            <button
              type="button"
              onClick={() => go(f.id)}
              className="sidebar-item flex h-7 w-full items-center gap-2 rounded-[7px] px-2 text-left font-mono text-[13px] text-text-2 hover:bg-[var(--hover-fill)] hover:text-text daylight:rounded-none"
              data-file={f.id}
            >
              <Icon name={f.id === "captures" || f.id === "process" || f.id === "code" ? "folder" : "doc"} size={14} />
              {f.label}
            </button>
          </li>
        ))}
        {project.links.demo ? (
          <li>
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-7 items-center gap-2 rounded-[7px] px-2 font-mono text-[13px] text-text-2 hover:bg-[var(--hover-fill)] hover:text-text daylight:rounded-none"
            >
              <Icon name="arrow" size={14} />
              {t(ui.project.demo)}
            </a>
          </li>
        ) : null}
      </ul>
      <div className="mt-auto px-2 pb-1.5">
        <StatusLine project={project} />
      </div>
    </aside>
  );
}

function ProjectBody({ project, index, view }: { project: Project; index: number; view?: string }) {
  const t = useT();
  const locale = useLocale();
  const layout = useOS((s) => s.layout);
  const [tab, setTab] = useState<Tab>(TABS.includes(view as Tab) ? (view as Tab) : "overview");
  const galleryRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const simple = project.tier !== "destacado";

  useEffect(() => {
    const onNav = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (id === "captures") {
        galleryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      setTab(id as Tab);
      tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener(`project-nav:${project.slug}`, onNav);
    return () => window.removeEventListener(`project-nav:${project.slug}`, onNav);
  }, [project.slug]);

  const chips = [String(project.year), project.type[locale], project.role[locale], project.client].filter(Boolean) as string[];

  return (
    <article className="mx-auto flex max-w-[860px] flex-col gap-6 p-6 pb-10 max-[820px]:p-4">
      {project.media.screenshots.length || project.media.video || project.media.diagram || project.slug === "framelab" ? (
        <ProjectMedia project={project} index={index} className="aspect-[16/7] w-full max-[820px]:aspect-[16/10]" />
      ) : null}

      <header className="flex flex-col gap-3">
        <h1 className="t-h2 font-semibold">{project.title}</h1>
        <div className="flex flex-wrap gap-2">
          {chips.map((c) => (
            <span key={c} className="chip">
              {c}
            </span>
          ))}
        </div>
        <p className="max-w-[60ch] text-[17px] leading-[1.5] text-text">{project.summary[locale]}</p>
        {layout === "mobile" || simple ? <StatusLine project={project} /> : null}
      </header>

      <Metrics project={project} />

      {simple ? (
        <>
          <Overview project={project} />
          <Section title={t(ui.project.tabs.process)}>
            <Process project={project} />
          </Section>
          <Section title={t(ui.project.tabs.stack)}>
            <Stack project={project} />
          </Section>
          <Section title={t(ui.project.tabs.code)}>
            <Code project={project} />
          </Section>
        </>
      ) : (
        <div ref={tabsRef} className="scroll-mt-4">
          <div role="tablist" aria-label={project.title} className="flex gap-7 border-b border-line daylight:border-[var(--tinta)]">
            {TABS.map((id) => (
              <button
                key={id}
                role="tab"
                type="button"
                id={`tab-${project.slug}-${id}`}
                aria-selected={tab === id}
                aria-controls={`panel-${project.slug}-${id}`}
                onClick={() => setTab(id)}
                className={`relative -mb-px pb-2.5 text-[14px] transition-colors ${tab === id ? "text-text" : "text-text-2 hover:text-text"}`}
              >
                {t(ui.project.tabs[id])}
                {tab === id ? (
                  <motion.span layoutId={`tab-line-${project.slug}`} className="absolute inset-x-0 -bottom-px h-[2px] bg-text daylight:bg-[var(--klein)]" />
                ) : null}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              role="tabpanel"
              id={`panel-${project.slug}-${tab}`}
              aria-labelledby={`tab-${project.slug}-${tab}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="pt-5"
            >
              {tab === "overview" ? <Overview project={project} /> : null}
              {tab === "stack" ? <Stack project={project} /> : null}
              {tab === "process" ? <Process project={project} /> : null}
              {tab === "code" ? <Code project={project} /> : null}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      <Gallery ref={galleryRef} project={project} />
      <Links project={project} />
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="t-label text-text-2">{title}</h2>
      {children}
    </section>
  );
}

function Overview({ project }: { project: Project }) {
  const t = useT();
  const locale = useLocale();
  return (
    <div className="flex flex-col gap-4">
      <p className="max-w-[68ch] text-[16px] leading-[1.65] text-text">{project.description[locale]}</p>
      {project.events?.length ? (
        <p className="text-[14px] text-text-2">
          {t(ui.project.presented)}: <span className="text-text">{project.events.join(" · ")}</span>
        </p>
      ) : null}
    </div>
  );
}

function Metrics({ project }: { project: Project }) {
  const t = useT();
  const locale = useLocale();
  const gh = useGitHub();
  if (!project.metrics?.length) return null;
  return (
    <dl className="flex flex-wrap gap-x-8 gap-y-3">
      {project.metrics.map((m) => {
        const live =
          m.source === "github" && project.links.repoFullName ? gh.data?.repoCommits[project.links.repoFullName] : undefined;
        return (
          <div key={m.label.es} className="flex flex-col">
            <dt className="order-2 text-[12.5px] text-text-2">
              {m.label[locale]}
              {live !== undefined ? <span className="ml-1.5 text-accent daylight:text-[var(--klein)]">● {t(ui.project.live)}</span> : null}
            </dt>
            <dd className="t-dot order-1 text-[30px] leading-none">{live !== undefined ? formatNumber(live, locale) : m.value}</dd>
          </div>
        );
      })}
    </dl>
  );
}

/** stack.json: el stack como JSON, porque así se llama el archivo. */
function Stack({ project }: { project: Project }) {
  const locale = useLocale();
  const items = project.stack.map((s) => stackItemLabel(s, locale));
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {items.map((s) => (
          <span key={s} className="chip text-text daylight:text-[var(--tinta)]">
            {s}
          </span>
        ))}
      </div>
      <pre className="overflow-x-auto rounded-[12px] border border-line bg-[var(--hover-fill)] p-4 font-mono text-[12.5px] leading-[1.7] daylight:rounded-none daylight:border-[var(--tinta)]">
        <span className="text-text-2">{"{"}</span>
        {"\n"}
        <span className="text-text-2">{'  "proyecto": '}</span>
        <span className="text-accent daylight:text-[var(--klein)]">&quot;{project.slug}&quot;</span>
        <span className="text-text-2">,</span>
        {"\n"}
        <span className="text-text-2">{'  "stack": ['}</span>
        {"\n"}
        {items.map((s, i) => (
          <span key={s}>
            {"    "}
            <span className="text-text">&quot;{s}&quot;</span>
            <span className="text-text-2">{i < items.length - 1 ? "," : ""}</span>
            {"\n"}
          </span>
        ))}
        <span className="text-text-2">{"  ]"}</span>
        {"\n"}
        <span className="text-text-2">{"}"}</span>
      </pre>
    </div>
  );
}

function Process({ project }: { project: Project }) {
  const locale = useLocale();
  if (!project.highlights.length) return null;
  return (
    <ol className="flex flex-col gap-0">
      {project.highlights.map((h, i) => (
        <li key={h.es} className="grid grid-cols-[36px_1fr] gap-3 border-t border-line py-3 first:border-t-0 daylight:border-[var(--line)]">
          <span className="pt-0.5 font-mono text-[12px] text-text-2">{String(i + 1).padStart(2, "0")}</span>
          <span className="text-[15px] leading-[1.55]">{h[locale]}</span>
        </li>
      ))}
    </ol>
  );
}

function Code({ project }: { project: Project }) {
  const t = useT();
  const locale = useLocale();
  const now = useNow();
  const gh = useGitHub();
  const full = project.links.repoFullName;
  const commits = full ? gh.data?.repoCommits[full] : undefined;
  const pushed = full ? gh.data?.pushedAt[full] : undefined;

  if (!project.links.repo) {
    return <p className="text-[15px] text-text-2">{t(ui.project.privateRepo)}</p>;
  }
  const repoLabel = project.links.repo.replace("https://github.com/", "").replace(/\/tree\/.*/, "");
  return (
    <div className="flex flex-col gap-3">
      <a
        href={project.links.repo}
        target="_blank"
        rel="noopener noreferrer"
        className="card card-hover flex items-center justify-between gap-4 p-4"
      >
        <span className="flex min-w-0 items-center gap-3">
          <Icon name="github" size={22} />
          <span className="min-w-0">
            <span className="block truncate font-mono text-[14px]">{repoLabel}</span>
            <span className="block font-mono text-[12px] text-text-2" suppressHydrationWarning>
              {commits !== undefined ? `${formatNumber(commits, locale)} commits` : ""}
              {commits !== undefined && pushed ? " · " : ""}
              {pushed && now ? `${t(ui.project.lastPush)} ${relativeTime(pushed, locale, now)}` : ""}
            </span>
          </span>
        </span>
        <span className="shrink-0 text-[14px] font-medium">{t(ui.project.viewCode)}</span>
      </a>
      {!full ? <p className="text-[13.5px] text-text-2">{t(ui.project.orgRepo)}</p> : null}
    </div>
  );
}

const Gallery = function Gallery({ project, ref }: { project: Project; ref: React.Ref<HTMLElement> }) {
  const t = useT();
  const shots = [...project.media.screenshots, ...(project.media.mobile ? [project.media.mobile] : [])];
  const [zoom, setZoom] = useState<string | null>(null);
  if (!shots.length) return <section ref={ref} />;
  return (
    <section ref={ref} className="flex scroll-mt-4 flex-col gap-3">
      <h2 className="t-label text-text-2">{t(ui.project.tabs.captures)}</h2>
      <div className="grid grid-cols-3 gap-3 max-[820px]:grid-cols-2">
        {shots.map((src) => (
          <button
            key={src}
            type="button"
            aria-label={t(ui.project.zoom)}
            onClick={() => setZoom(src)}
            className="group relative aspect-[16/10] overflow-hidden rounded-[10px] border border-line daylight:rounded-none daylight:border-[var(--tinta)]"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="240px"
              className={`object-cover transition-transform duration-500 group-hover:scale-[1.04] ${src.includes("mobile") ? "object-top" : "object-top"}`}
            />
          </button>
        ))}
      </div>
      <AnimatePresence>
        {zoom ? (
          <motion.div
            className="fixed inset-0 z-[150] grid place-items-center bg-black/75 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(null)}
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
          >
            <motion.div
              initial={{ scale: 0.94 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              className={`relative overflow-hidden rounded-[14px] ${zoom.includes("mobile") ? "h-[86vh] aspect-[390/844]" : "aspect-[16/10] w-[min(1200px,92vw)]"}`}
            >
              <Image src={zoom} alt={project.title} fill sizes="92vw" className="object-contain" />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
};

function Links({ project }: { project: Project }) {
  const t = useT();
  const locale = useLocale();
  return (
    <footer className="flex flex-wrap items-center gap-3 border-t border-line pt-5 daylight:border-[var(--tinta)]">
      {project.links.demo ? (
        <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          {t(ui.project.openDemo)} <span aria-hidden="true">↗</span>
        </a>
      ) : null}
      {project.links.repo ? (
        <a href={project.links.repo} target="_blank" rel="noopener noreferrer" className="btn">
          <Icon name="github" size={16} /> {t(ui.project.viewCode)}
        </a>
      ) : null}
      {project.links.extra?.map((x) => (
        <a key={x.url} href={x.url} target="_blank" rel="noopener noreferrer" className="link text-[14px] text-text-2 hover:text-text">
          {x.label[locale]} ↗
        </a>
      ))}
    </footer>
  );
}
