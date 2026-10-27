"use client";

import Image from "next/image";
import { SITE_URL } from "@/content/profile";
import { projectsByTier, windowProjects } from "@/content/projects";
import type { Project } from "@/content/types";
import { ui } from "@/content/ui";
import { useContextMenu } from "../desktop/ContextMenu";
import { copyText } from "../hooks";
import { Icon } from "../icons";
import { useLocale, useT } from "../i18n";
import { useOSStore } from "../store";
import { ProjectVisual } from "./ProjectMedia";

export function ProjectsApp() {
  const t = useT();
  const store = useOSStore();
  const featured = projectsByTier("destacado");
  const regular = projectsByTier("proyecto");
  const practices = projectsByTier("practica");

  return (
    <div className="scroll-area h-full">
      <div className="mx-auto flex max-w-[980px] flex-col gap-8 p-6 max-[820px]:p-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="t-h2 font-semibold">{t(ui.apps.projects)}</h1>
            <p className="mt-1 font-mono text-[12px] text-text-2">
              {featured.length + regular.length + practices.length} {t(ui.projects.count)} · {featured.length}{" "}
              {t(ui.projects.featured).toLowerCase()} · {regular.length} {t(ui.projects.projects).toLowerCase()} · {practices.length}{" "}
              {t(ui.projects.practices).toLowerCase()}
            </p>
          </div>
        </header>

        <section className="flex flex-col gap-3">
          <h2 className="t-label text-text-2">{t(ui.projects.featured)}</h2>
          <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
            {featured.map((p, i) => (
              <FeaturedCard key={p.slug} project={p} wide={i === 0} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="t-label text-text-2">{t(ui.projects.projects)}</h2>
          <ul className="flex flex-col">
            {regular.map((p) => (
              <ProjectRow key={p.slug} project={p} />
            ))}
          </ul>
        </section>

        <button
          type="button"
          onClick={() => store.getState().openWindow("lab")}
          className="card card-hover flex items-center justify-between gap-4 p-4 text-left"
        >
          <span className="flex items-center gap-3">
            <Icon name="flask" size={22} />
            <span>
              <span className="block text-[15px] font-medium">
                {t(ui.projects.practices)} · {practices.length}
              </span>
              <span className="block text-[13px] text-text-2">{practices.map((p) => p.title).join(" · ")}</span>
            </span>
          </span>
          <span className="shrink-0 font-mono text-[12px] text-text-2">{t(ui.projects.practicesHint)} →</span>
        </button>
      </div>
    </div>
  );
}

function useProjectActions(project: Project) {
  const store = useOSStore();
  const t = useT();
  const openMenu = useContextMenu((s) => s.open);
  const open = (el?: HTMLElement) => {
    const r = el?.getBoundingClientRect();
    store.getState().openWindow(`project:${project.slug}`, {
      origin: r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : undefined,
    });
  };
  const onContextMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    openMenu(e.clientX, e.clientY, [
      { label: t(ui.context.open), keys: ["enter"], onSelect: () => open(target) },
      { label: t(ui.context.openNew), keys: ["mod", "enter"], onSelect: () => window.open(`/proyectos/${project.slug}`, "_blank", "noopener") },
      {
        label: t(ui.context.copyLink),
        keys: ["mod", "L"],
        onSelect: () =>
          void copyText(`${SITE_URL}/proyectos/${project.slug}`).then(() => store.getState().showToast(t(ui.toast.linkCopied))),
      },
      ...(project.links.repo
        ? (["separator", { label: t(ui.context.viewCode), hint: "↗", onSelect: () => window.open(project.links.repo, "_blank", "noopener") }] as const)
        : []),
    ]);
  };
  return { open, onContextMenu };
}

function FeaturedCard({ project, wide }: { project: Project; wide: boolean }) {
  const locale = useLocale();
  const { open, onContextMenu } = useProjectActions(project);
  const index = windowProjects.findIndex((p) => p.slug === project.slug) + 1;
  const shot = project.media.screenshots[0];
  return (
    <button
      type="button"
      onClick={(e) => open(e.currentTarget)}
      onContextMenu={onContextMenu}
      className={`card card-hover group flex flex-col overflow-hidden text-left ${wide ? "col-span-2 max-[640px]:col-span-1" : ""}`}
    >
      <span className={`relative block w-full overflow-hidden border-b border-line daylight:border-[var(--tinta)] ${wide ? "aspect-[16/6]" : "aspect-[16/8]"}`}>
        {shot ? (
          <Image
            src={shot}
            alt=""
            fill
            sizes={wide ? "900px" : "450px"}
            className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <ProjectVisual project={project} poster />
        )}
        <span className="absolute top-3 left-3 rounded-[6px] bg-black/55 px-2 py-1 font-mono text-[11px] text-white backdrop-blur daylight:rounded-none daylight:border daylight:border-[var(--tinta)] daylight:bg-[var(--blanco-roto)] daylight:text-[var(--tinta)]">
          P—{String(index).padStart(2, "0")}
        </span>
      </span>
      <span className="flex flex-col gap-1.5 p-4">
        <span className="flex items-baseline justify-between gap-3">
          <span className="text-[18px] font-semibold tracking-[-0.01em]">{project.title}</span>
          <span className="font-mono text-[12px] text-text-2">
            {project.year} · {project.role[locale]}
          </span>
        </span>
        <span className="text-[14px] leading-[1.45] text-text-2">{project.summary[locale]}</span>
      </span>
    </button>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const locale = useLocale();
  const t = useT();
  const { open, onContextMenu } = useProjectActions(project);
  return (
    <li>
      <button
        type="button"
        onClick={(e) => open(e.currentTarget)}
        onContextMenu={onContextMenu}
        className="grid w-full grid-cols-[28px_1fr_auto] items-center gap-3 border-t border-line px-1 py-3 text-left transition-colors hover:bg-[var(--hover-fill)] daylight:border-[var(--line)]"
      >
        <Icon name="grid" size={18} className="text-text-2" />
        <span className="min-w-0">
          <span className="block text-[15px] font-medium">{project.title}</span>
          <span className="block truncate text-[13.5px] text-text-2">{project.summary[locale]}</span>
        </span>
        <span className="font-mono text-[12px] text-text-2">
          {project.year} · {t(ui.projects.open)} →
        </span>
      </button>
    </li>
  );
}
