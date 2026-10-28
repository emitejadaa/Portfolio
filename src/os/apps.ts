import { getProject, windowProjects } from "@/content/projects";
import type { L } from "@/content/types";
import { ui } from "@/content/ui";

export type AppId = "projects" | "project" | "about" | "lab" | "terminal" | "contact" | "readme" | "prefs";
export type SingletonApp = Exclude<AppId, "project">;
export type WinKey = SingletonApp | `project:${string}`;

export type IconName =
  | "grid"
  | "user"
  | "flask"
  | "term"
  | "mail"
  | "doc"
  | "folder"
  | "search"
  | "cube"
  | "moon"
  | "sun"
  | "github"
  | "linkedin"
  | "link"
  | "copy"
  | "globe"
  | "arrow"
  | "sliders";

type AppMeta = {
  name: L;
  /** Title-bar file name: "tejada.os" style details. */
  file: string;
  icon: IconName;
  path?: string;
  /** Default size on a 1440 × 900 desktop. */
  size: [number, number];
  minSize: [number, number];
};

export const apps: Record<SingletonApp, AppMeta> = {
  projects: { name: ui.apps.projects, file: "proyectos/", icon: "grid", path: "/proyectos", size: [880, 580], minSize: [520, 360] },
  about: { name: ui.apps.about, file: "sobre-mi.app", icon: "user", path: "/sobre-mi", size: [900, 640], minSize: [520, 400] },
  lab: { name: ui.apps.lab, file: "lab/", icon: "flask", path: "/lab", size: [760, 520], minSize: [480, 340] },
  terminal: { name: ui.apps.terminal, file: "terminal — visitante@tejada.os", icon: "term", size: [760, 460], minSize: [420, 260] },
  contact: { name: ui.apps.contact, file: "contacto.app", icon: "mail", path: "/contacto", size: [620, 640], minSize: [420, 420] },
  readme: { name: ui.apps.readme, file: "README.md", icon: "doc", size: [720, 640], minSize: [420, 320] },
  prefs: { name: ui.apps.prefs, file: "ajustes.app", icon: "sliders", size: [480, 640], minSize: [380, 360] },
};

export const projectSize = (slug: string): [number, number] =>
  getProject(slug)?.tier === "destacado" ? [960, 640] : [760, 600];

export function appOf(key: WinKey): AppId {
  return key.startsWith("project:") ? "project" : (key as SingletonApp);
}

export function slugOf(key: WinKey): string | undefined {
  return key.startsWith("project:") ? key.slice("project:".length) : undefined;
}

export function winTitle(key: WinKey): string {
  const slug = slugOf(key);
  if (slug) return `proyectos / ${slug}.app`;
  return apps[key as SingletonApp].file;
}

export function winName(key: WinKey, locale: "es" | "en"): string {
  const slug = slugOf(key);
  if (slug) return getProject(slug)?.title ?? slug;
  return apps[key as SingletonApp].name[locale];
}

export function winIcon(key: WinKey): IconName {
  return slugOf(key) ? "grid" : apps[key as SingletonApp].icon;
}

/** Every window that has a deep link (L·05: "todo lo que se abre tiene URL"). */
export function pathFor(key: WinKey): string | undefined {
  const slug = slugOf(key);
  if (slug) return `/proyectos/${slug}`;
  return apps[key as SingletonApp].path;
}

export function keyForPath(pathname: string): WinKey | null {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (clean === "/") return null;
  if (clean === "/proyectos") return "projects";
  const m = clean.match(/^\/proyectos\/([a-z0-9-]+)$/);
  if (m?.[1] && windowProjects.some((p) => p.slug === m[1])) return `project:${m[1]}`;
  if (clean === "/sobre-mi") return "about";
  if (clean === "/lab") return "lab";
  if (clean === "/contacto") return "contact";
  return null;
}

export const isKnownPath = (pathname: string) => {
  const clean = pathname.replace(/\/+$/, "") || "/";
  return clean === "/" || keyForPath(clean) !== null;
};
