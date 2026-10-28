import type { StoreApi } from "zustand";
import { about, contact, identity, stack } from "@/content/profile";
import { getProject, projects, projectsByTier, windowProjects } from "@/content/projects";
import type { Locale } from "@/content/types";
import type { GitHubResponse, WeatherResponse } from "@/lib/api-types";
import type { SingletonApp } from "../apps";
import { formatBA, copyText } from "../hooks";
import { relativeTime } from "../i18n";
import type { OSState } from "../store";
import { switchTheme } from "../theme";

export type Tone = "text" | "muted" | "error" | "accent" | "ok";
export type Line = { text: string; tone?: Tone; action?: () => void; href?: string };

export type Ctx = {
  store: StoreApi<OSState>;
  locale: Locale;
  cwd: string;
  setCwd: (cwd: string) => void;
  history: () => string[];
  print: (lines: Line | Line[]) => void;
  clear: () => void;
  close: () => void;
  openEditor: (name: string) => void;
  askPassword: (onDone: (pw: string) => void) => void;
  exits: () => { count: number };
  readme: string | null;
};

const HOME = "/home/visitante";
const es = (ctx: Ctx) => ctx.locale === "es";
const L = (ctx: Ctx, esText: string, enText: string) => (es(ctx) ? esText : enText);

/* ---------- Virtual filesystem ---------- */

type Node = { type: "dir"; children: string[] } | { type: "file" };

const featuredAndRegular = windowProjects.map((p) => p.slug);
const practiceSlugs = projectsByTier("practica").map((p) => p.slug);

const FS: Record<string, Node> = {
  "/": { type: "dir", children: ["home"] },
  "/home": { type: "dir", children: ["visitante"] },
  [HOME]: { type: "dir", children: ["proyectos/", "lab/", "sobre-mi.txt", "contacto.txt", "README.md"] },
  [`${HOME}/proyectos`]: { type: "dir", children: featuredAndRegular },
  [`${HOME}/lab`]: { type: "dir", children: practiceSlugs },
};

export function resolvePath(cwd: string, arg = "~"): string {
  let p = arg.trim();
  if (!p || p === "~") return HOME;
  if (p.startsWith("~/")) p = HOME + p.slice(1);
  else if (!p.startsWith("/")) p = `${cwd}/${p}`;
  const parts: string[] = [];
  for (const seg of p.split("/")) {
    if (!seg || seg === ".") continue;
    if (seg === "..") parts.pop();
    else parts.push(seg);
  }
  return `/${parts.join("/")}`;
}

export const prettyPath = (abs: string) => (abs === HOME ? "~" : abs.startsWith(`${HOME}/`) ? `~/${abs.slice(HOME.length + 1)}` : abs);

function isDir(abs: string) {
  return FS[abs]?.type === "dir";
}

type VFile = { kind: "bio" } | { kind: "contact" } | { kind: "readme" } | { kind: "project"; slug: string };

function fileFor(abs: string): VFile | null {
  if (abs === `${HOME}/sobre-mi.txt`) return { kind: "bio" };
  if (abs === `${HOME}/contacto.txt`) return { kind: "contact" };
  if (abs === `${HOME}/README.md`) return { kind: "readme" };
  const m = abs.match(/^\/home\/visitante\/(proyectos|lab)\/([a-z0-9-]+)$/);
  if (m?.[2] && getProject(m[2])) return { kind: "project", slug: m[2] };
  return null;
}

/* ---------- Commands ---------- */

type Cmd = {
  run: (args: string[], ctx: Ctx, raw: string) => void | Promise<void>;
  help: { es: string; en: string };
  man?: { es: string; en: string };
  hidden?: boolean;
};

const APP_ALIASES: Record<string, SingletonApp> = {
  proyectos: "projects",
  projects: "projects",
  "sobre-mi": "about",
  about: "about",
  sobremi: "about",
  lab: "lab",
  terminal: "terminal",
  contacto: "contact",
  contact: "contact",
  readme: "readme",
  "readme.md": "readme",
  ajustes: "prefs",
  settings: "prefs",
  preferencias: "prefs",
  prefs: "prefs",
};

function openTarget(target: string, ctx: Ctx): boolean {
  const key = target.toLowerCase().replace(/\.app$/, "").replace(/\/$/, "");
  const app = APP_ALIASES[key];
  const s = ctx.store.getState();
  if (app) {
    s.openWindow(app);
    return true;
  }
  const project = getProject(key);
  if (project) {
    if (project.tier === "practica") s.openWindow("lab", { view: project.slug });
    else s.openWindow(`project:${project.slug}`);
    return true;
  }
  return false;
}

const TOP_STACK = ["Python", "TypeScript", "C++", "NestJS", "PyTorch", "Raspberry Pi"];

const NEOFETCH_ART = [
  "███████ ████████",
  "██         ██   ",
  "█████      ██   ",
  "██         ██   ",
  "███████    ██   ",
];

function listProjects(ctx: Ctx, withSummary: boolean, includePractice = true): Line[] {
  const out: Line[] = [];
  const groups: [string, ReturnType<typeof projectsByTier>][] = [
    [L(ctx, "destacados", "featured"), projectsByTier("destacado")],
    [L(ctx, "proyectos", "projects"), projectsByTier("proyecto")],
  ];
  if (includePractice) groups.push([L(ctx, "prácticas (lab/)", "practice (lab/)"), projectsByTier("practica")]);
  for (const [title, list] of groups) {
    out.push({ text: `# ${title}`, tone: "muted" });
    for (const p of list) {
      out.push({
        text: withSummary ? `  ${p.slug.padEnd(18)} ${p.summary[ctx.locale]}` : `  ${p.slug}`,
        tone: "text",
        action: () => openTarget(p.slug, ctx),
      });
    }
  }
  return out;
}

export const commands: Record<string, Cmd> = {
  help: {
    help: { es: "lista todos los comandos", en: "list every command" },
    run: (_a, ctx) => {
      const names = Object.keys(commands).filter((n) => !commands[n]!.hidden);
      ctx.print({ text: L(ctx, "Comandos disponibles (Tab autocompleta, ↑↓ historial):", "Available commands (Tab completes, ↑↓ history):"), tone: "muted" });
      ctx.print(names.map((n) => ({ text: `  ${n.padEnd(12)} ${commands[n]!.help[ctx.locale]}` })));
      ctx.print({ text: L(ctx, "Hay más cosas escondidas. Probá `man <comando>`.", "There's more hidden in here. Try `man <command>`."), tone: "muted" });
    },
  },
  ls: {
    help: { es: "lista archivos y carpetas", en: "list files and folders" },
    man: {
      es: "ls [carpeta] [-la]\n  Lista el contenido. `ls proyectos` muestra los slugs por nivel.",
      en: "ls [folder] [-la]\n  Lists contents. `ls proyectos` shows the slugs by tier.",
    },
    run: (args, ctx) => {
      const long = args.some((a) => a.startsWith("-") && a.includes("l"));
      const target = args.find((a) => !a.startsWith("-"));
      const abs = resolvePath(ctx.cwd, target ?? ".");
      if (abs === `${HOME}/proyectos` && !long) {
        ctx.print(listProjects(ctx, false, false));
        ctx.print({ text: L(ctx, "# prácticas → ls lab", "# practice → ls lab"), tone: "muted" });
        return;
      }
      const node = FS[abs];
      if (!node) {
        if (fileFor(abs)) ctx.print({ text: target ?? "" });
        else ctx.print({ text: `ls: ${target}: ${L(ctx, "no existe el archivo o la carpeta", "no such file or directory")}`, tone: "error" });
        return;
      }
      if (node.type !== "dir") return;
      if (long) {
        ctx.print({ text: `total ${node.children.length}`, tone: "muted" });
        ctx.print(
          node.children.map((c) => ({
            text: `${c.endsWith("/") || isDir(`${abs}/${c}`) ? "drwxr-xr-x" : "-rw-r--r--"}  visitante  staff  ${c}`,
          })),
        );
        return;
      }
      ctx.print({ text: node.children.map((c) => (isDir(`${abs}/${c.replace(/\/$/, "")}`) && !c.endsWith("/") ? `${c}/` : c)).join("  ") });
    },
  },
  cd: {
    help: { es: "cambia de carpeta (cd .., cd ~)", en: "change folder (cd .., cd ~)" },
    run: (args, ctx) => {
      const abs = resolvePath(ctx.cwd, args[0] ?? "~");
      if (!isDir(abs)) {
        ctx.print({
          text: `cd: ${fileFor(abs) ? L(ctx, "no es una carpeta", "not a directory") : L(ctx, "no existe la carpeta", "no such directory")}: ${args[0]}`,
          tone: "error",
        });
        return;
      }
      ctx.setCwd(abs);
    },
  },
  pwd: {
    help: { es: "muestra la carpeta actual", en: "print the current folder" },
    run: (_a, ctx) => ctx.print({ text: ctx.cwd }),
  },
  cat: {
    help: { es: "imprime un archivo: cat sobre-mi.txt, cat <slug>", en: "print a file: cat sobre-mi.txt, cat <slug>" },
    man: {
      es: "cat <archivo>\n  sobre-mi.txt → bio larga\n  contacto.txt → mail, GitHub y LinkedIn\n  README.md → README de perfil\n  <slug> → resumen de un proyecto",
      en: "cat <file>\n  sobre-mi.txt → long bio\n  contacto.txt → email, GitHub and LinkedIn\n  README.md → profile README\n  <slug> → a project summary",
    },
    run: (args, ctx) => {
      if (!args[0]) {
        ctx.print({ text: L(ctx, "uso: cat <archivo>", "usage: cat <file>"), tone: "muted" });
        return;
      }
      let abs = resolvePath(ctx.cwd, args[0]);
      let f = fileFor(abs);
      if (!f && getProject(args[0])) {
        abs = resolvePath(HOME, `${getProject(args[0])!.tier === "practica" ? "lab" : "proyectos"}/${args[0]}`);
        f = fileFor(abs);
      }
      if (!f) {
        ctx.print({
          text: `cat: ${args[0]}: ${isDir(abs) ? L(ctx, "es una carpeta", "is a directory") : L(ctx, "no existe el archivo", "no such file")}`,
          tone: "error",
        });
        return;
      }
      if (f.kind === "bio") ctx.print({ text: about.bioLong[ctx.locale] });
      else if (f.kind === "contact") commands.contact!.run([], ctx, "contact");
      else if (f.kind === "readme") {
        const lines = (ctx.readme ?? "").split("\n").filter((l) => !l.startsWith("![")).slice(0, 40);
        ctx.print(lines.length ? lines.map((text) => ({ text })) : { text: L(ctx, "No se pudo leer el README.", "Couldn't read the README."), tone: "error" });
      } else {
        const p = getProject(f.slug)!;
        ctx.print([
          { text: `${p.title} · ${p.year} · ${p.type[ctx.locale]}`, tone: "accent" },
          { text: p.summary[ctx.locale] },
          { text: `stack: ${p.stack.join(", ")}`, tone: "muted" },
          ...(p.tier !== "practica"
            ? [{ text: L(ctx, `→ open ${p.slug}`, `→ open ${p.slug}`), tone: "muted" as const, action: () => openTarget(p.slug, ctx) }]
            : []),
        ]);
      }
    },
  },
  open: {
    help: { es: "abre una ventana: open freewheel, open contacto", en: "open a window: open freewheel, open contacto" },
    run: (args, ctx) => {
      if (!args[0]) {
        ctx.print({ text: L(ctx, "uso: open <slug o app>", "usage: open <slug or app>"), tone: "muted" });
        return;
      }
      if (!openTarget(args[0], ctx)) ctx.print({ text: `open: ${args[0]}: ${L(ctx, "no encontré esa app o proyecto", "no such app or project")}`, tone: "error" });
    },
  },
  projects: {
    help: { es: "proyectos con un resumen de una línea", en: "projects with a one-line summary" },
    run: (_a, ctx) => ctx.print(listProjects(ctx, true)),
  },
  about: {
    help: { es: "bio larga", en: "long bio" },
    run: (_a, ctx) => ctx.print([{ text: about.bioLong[ctx.locale] }, { text: about.projection[ctx.locale], tone: "muted" }]),
  },
  contact: {
    help: { es: "mail, GitHub y LinkedIn", en: "email, GitHub and LinkedIn" },
    run: (_a, ctx) =>
      ctx.print([
        { text: `mail      ${contact.email}`, href: `mailto:${contact.email}` },
        { text: `github    ${contact.github.url}`, href: contact.github.url },
        { text: `linkedin  ${contact.linkedin.url}`, href: contact.linkedin.url },
        { text: L(ctx, "→ open contacto", "→ open contacto"), tone: "muted", action: () => openTarget("contacto", ctx) },
      ]),
  },
  theme: {
    help: { es: "cambia de modo: theme midnight | theme daylight", en: "switch mode: theme midnight | theme daylight" },
    run: (args, ctx) => {
      const next = args[0] === "daylight" || args[0] === "midnight" ? args[0] : undefined;
      if (!next && args[0]) {
        ctx.print({ text: L(ctx, "uso: theme midnight | theme daylight", "usage: theme midnight | theme daylight"), tone: "muted" });
        return;
      }
      switchTheme(ctx.store, next);
      ctx.print({ text: `◐ ${next ?? (ctx.store.getState().theme === "midnight" ? "midnight" : "daylight")}`, tone: "accent" });
    },
  },
  lang: {
    help: { es: "cambia de idioma: lang es | lang en", en: "switch language: lang es | lang en" },
    run: (args, ctx) => {
      const next = args[0] === "en" || args[0] === "es" ? args[0] : ctx.locale === "es" ? "en" : "es";
      ctx.store.getState().setLocale(next);
      ctx.print({ text: next === "es" ? "Idioma: español" : "Language: English", tone: "accent" });
    },
  },
  whoami: {
    help: { es: "quién sos", en: "who you are" },
    run: (_a, ctx) => ctx.print({ text: "visitante" }),
  },
  neofetch: {
    help: { es: "info del sistema con el monograma", en: "system info with the monogram" },
    run: (_a, ctx) => {
      const theme = ctx.store.getState().theme;
      const info = [
        `visitante@${identity.systemName}`,
        "───────────────────",
        `Host: ${identity.name}`,
        `${L(ctx, "Foco", "Focus")}: ${L(ctx, "Hardware, Backend, IA", "Hardware, Backend, AI")}`,
        `${L(ctx, "Ubicación", "Location")}: ${identity.city}`,
        `${L(ctx, "Proyectos", "Projects")}: ${projects.length}`,
        `Stack: ${TOP_STACK.join(", ")}`,
        `${L(ctx, "Modo", "Mode")}: ${theme === "midnight" ? "Midnight" : "Daylight"}`,
      ];
      const rows = Math.max(NEOFETCH_ART.length, info.length);
      ctx.print(
        Array.from({ length: rows }, (_, i) => ({
          text: `${(NEOFETCH_ART[i] ?? "").padEnd(20)}${info[i] ?? ""}`,
          tone: i === 0 ? ("accent" as const) : undefined,
        })),
      );
    },
  },
  uname: {
    help: { es: "nombre del sistema y versión", en: "system name and version" },
    run: (args, ctx) => {
      const version = process.env.NEXT_PUBLIC_APP_VERSION ?? "2.0.0";
      const build = process.env.NEXT_PUBLIC_BUILD_DATE ?? "";
      ctx.print({ text: args.includes("-a") ? `${identity.systemName} ${version} (build ${build}) next.js · vercel` : identity.systemName });
    },
  },
  uptime: {
    help: { es: "tiempo desde que abriste la pestaña", en: "time since you opened the tab" },
    run: (_a, ctx) => {
      const secs = Math.round(performance.now() / 1000);
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      ctx.print({ text: `up ${m} min ${s} s, 1 ${L(ctx, "visitante", "visitor")}` });
    },
  },
  date: {
    help: { es: "fecha y hora de Buenos Aires", en: "Buenos Aires date and time" },
    run: (_a, ctx) =>
      ctx.print({
        text: `${formatBA(Date.now(), { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }, ctx.locale === "es" ? "es-AR" : "en-US")} (${identity.utcLabel})`,
      }),
  },
  git: {
    help: { es: "git log: últimos 5 commits públicos", en: "git log: last 5 public commits" },
    run: async (args, ctx) => {
      if (args[0] !== "log") {
        ctx.print({ text: L(ctx, "solo está disponible `git log`", "only `git log` is available here"), tone: "muted" });
        return;
      }
      ctx.print({ text: L(ctx, "leyendo GitHub…", "reading GitHub…"), tone: "muted" });
      try {
        const data = (await fetch("/api/github").then((r) => r.json())) as GitHubResponse;
        if (!data.commits?.length) throw new Error("empty");
        ctx.print(
          data.commits.map((c) => ({
            text: `${c.sha}  ${c.repo.padEnd(14)} ${c.message}  (${relativeTime(c.date, ctx.locale)})`,
            href: c.url,
          })),
        );
      } catch {
        ctx.print({ text: L(ctx, "git: no pude leer los commits ahora", "git: couldn't read commits right now"), tone: "error" });
      }
    },
  },
  ping: {
    help: { es: "estado del deploy de un proyecto: ping <slug>", en: "a project's deploy status: ping <slug>" },
    run: async (args, ctx) => {
      const p = args[0] ? getProject(args[0]) : undefined;
      if (!p) {
        ctx.print({ text: L(ctx, "uso: ping <slug> (probá `projects`)", "usage: ping <slug> (try `projects`)"), tone: "muted" });
        return;
      }
      if (!p.links.demo) {
        ctx.print({ text: `ping: ${p.slug}: ${L(ctx, "no tiene demo pública", "has no public demo")}`, tone: "muted" });
        return;
      }
      const host = new URL(p.links.demo).host;
      ctx.print({ text: `PING ${host} …`, tone: "muted" });
      try {
        const r = (await fetch(`/api/ping?slug=${encodeURIComponent(p.slug)}`).then((x) => x.json())) as {
          state: "up" | "slow" | "down";
          ms: number | null;
          code: number | null;
        };
        if (r.state === "down") ctx.print({ text: `${host}: ${L(ctx, "no responde", "not responding")}${r.code ? ` (HTTP ${r.code})` : ""}`, tone: "error" });
        else ctx.print({ text: `${host}: ${L(ctx, "responde", "responding")} · ${r.ms} ms${r.state === "slow" ? L(ctx, " (lento: estaba dormido)", " (slow: it was asleep)") : ""}`, tone: "ok" });
      } catch {
        ctx.print({ text: `${host}: ${L(ctx, "no pude medirlo", "couldn't measure it")}`, tone: "error" });
      }
    },
  },
  top: {
    help: { es: "apps abiertas como procesos", en: "open apps as processes" },
    run: (_a, ctx) => {
      const wins = ctx.store.getState().windows;
      ctx.print({ text: "PID    %CPU   MEM     COMMAND", tone: "muted" });
      const rows = [{ key: "tejada.os", z: 0 }, ...wins.map((w) => ({ key: w.key, z: w.z }))];
      ctx.print(
        rows.map((w, i) => ({
          text: `${String(1000 + i * 37).padEnd(7)}${(Math.random() * 9 + 0.1).toFixed(1).padStart(4)}   ${String(Math.round(18 + Math.random() * 140)).padStart(3)} MB  ${w.key.replace("project:", "proyectos/")}`,
        })),
      );
    },
  },
  history: {
    help: { es: "comandos de esta sesión", en: "this session's commands" },
    run: (_a, ctx) => ctx.print(ctx.history().map((h, i) => ({ text: `${String(i + 1).padStart(4)}  ${h}` }))),
  },
  echo: {
    help: { es: "repite el texto", en: "repeat the text" },
    run: (_a, ctx, raw) => ctx.print({ text: raw.replace(/^\s*echo\s?/, "") }),
  },
  man: {
    help: { es: "ayuda extendida: man <comando>", en: "extended help: man <command>" },
    run: (args, ctx) => {
      const c = args[0] ? commands[args[0]] : undefined;
      if (!c) {
        ctx.print({ text: L(ctx, "¿Qué página querés? Ej: man cat", "What manual page do you want? e.g. man cat"), tone: "muted" });
        return;
      }
      ctx.print([
        { text: `${args[0]!.toUpperCase()}(1)`, tone: "accent" },
        ...(c.man?.[ctx.locale] ?? `${args[0]} — ${c.help[ctx.locale]}`).split("\n").map((text) => ({ text })),
      ]);
    },
  },
  clear: {
    help: { es: "limpia la pantalla (Ctrl+L)", en: "clear the screen (Ctrl+L)" },
    run: (_a, ctx) => ctx.clear(),
  },
  exit: {
    help: { es: "cierra la terminal", en: "close the terminal" },
    run: (_a, ctx) => {
      const exits = ctx.exits();
      exits.count += 1;
      if (exits.count >= 3) {
        exits.count = 0;
        ctx.print([
          { text: L(ctx, "No te vayas todavía.", "Don't leave just yet."), tone: "accent" },
          { text: L(ctx, "Probá `projects`: hay 14 para ver.", "Try `projects`: there are 14 to see."), tone: "muted", action: () => commands.projects!.run([], ctx, "projects") },
        ]);
        return;
      }
      ctx.close();
    },
  },

  // Comandos comunes de terminal
  tree: {
    help: { es: "árbol de carpetas", en: "folder tree" },
    run: (_a, ctx) => {
      const out: Line[] = [{ text: "~" }];
      const proyectos = projectsByTier("destacado").concat(projectsByTier("proyecto"));
      out.push({ text: "├── proyectos/" });
      proyectos.forEach((p, i) => out.push({ text: `│   ${i === proyectos.length - 1 ? "└──" : "├──"} ${p.slug}`, action: () => openTarget(p.slug, ctx) }));
      out.push({ text: "├── lab/" });
      practiceSlugs.forEach((s, i) => out.push({ text: `│   ${i === practiceSlugs.length - 1 ? "└──" : "├──"} ${s}` }));
      out.push({ text: "├── sobre-mi.txt" }, { text: "├── contacto.txt" }, { text: "└── README.md" });
      ctx.print(out);
    },
  },
  stack: {
    help: { es: "el stack completo, por área", en: "the full stack, by area" },
    run: (_a, ctx) => ctx.print(stack.map((g) => ({ text: `${g.area[ctx.locale].padEnd(26)} ${g.items.join(", ")}` }))),
  },
  weather: {
    help: { es: "clima en Buenos Aires", en: "Buenos Aires weather" },
    run: async (_a, ctx) => {
      try {
        const w = (await fetch("/api/weather").then((r) => r.json())) as WeatherResponse;
        ctx.print({ text: `${identity.city}: ${Math.round(w.temp)}°C · max ${Math.round(w.max)}° · min ${Math.round(w.min)}°` });
      } catch {
        ctx.print({ text: L(ctx, "No pude leer el clima.", "Couldn't read the weather."), tone: "error" });
      }
    },
  },
  github: {
    help: { es: "abre GitHub", en: "open GitHub" },
    run: (_a, ctx) => {
      window.open(contact.github.url, "_blank", "noopener");
      ctx.print({ text: contact.github.url, href: contact.github.url });
    },
  },
  linkedin: {
    help: { es: "abre LinkedIn", en: "open LinkedIn" },
    run: (_a, ctx) => {
      window.open(contact.linkedin.url, "_blank", "noopener");
      ctx.print({ text: contact.linkedin.url, href: contact.linkedin.url });
    },
  },
  mail: {
    help: { es: "copia el mail al portapapeles", en: "copy the email to the clipboard" },
    run: async (_a, ctx) => {
      await copyText(contact.email);
      ctx.print({ text: `${contact.email} ${L(ctx, "copiado ✓", "copied ✓")}`, tone: "ok" });
    },
  },
  reboot: {
    help: { es: "reinicia el sistema", en: "restart the system" },
    run: (_a, ctx) => {
      const s = ctx.store.getState();
      s.closeAll();
      s.setPhase("boot");
    },
  },
  shutdown: {
    help: { es: "bloquea la pantalla", en: "lock the screen" },
    run: (_a, ctx) => ctx.store.getState().setPhase("lock"),
  },
  which: {
    help: { es: "dónde está un comando", en: "where a command lives" },
    hidden: true,
    run: (args, ctx) => ctx.print({ text: args[0] && commands[args[0]] ? `/usr/bin/${args[0]}` : `${args[0] ?? ""} not found`, tone: args[0] && commands[args[0]] ? "text" : "error" }),
  },
  ps: { help: { es: "alias de top", en: "alias of top" }, hidden: true, run: (a, ctx, raw) => commands.top!.run(a, ctx, raw) },
  ll: { help: { es: "alias de ls -la", en: "alias of ls -la" }, hidden: true, run: (a, ctx, raw) => commands.ls!.run(["-la", ...a], ctx, raw) },
  hola: { help: { es: "hola", en: "hi" }, hidden: true, run: (_a, ctx) => ctx.print({ text: L(ctx, "¡Hola! Probá `neofetch`.", "Hi! Try `neofetch`."), tone: "accent" }) },
  hello: { help: { es: "hola", en: "hi" }, hidden: true, run: (a, ctx, raw) => commands.hola!.run(a, ctx, raw) },
  ssh: {
    help: { es: "ssh", en: "ssh" },
    hidden: true,
    run: (args, ctx) => ctx.print({ text: `ssh: connect to host ${args[0] ?? "?"} port 22: ${L(ctx, "conexión rechazada (buen intento)", "connection refused (nice try)")}`, tone: "error" }),
  },
  mkdir: { help: { es: "", en: "" }, hidden: true, run: (_a, ctx) => readOnly(ctx, "mkdir") },
  touch: { help: { es: "", en: "" }, hidden: true, run: (_a, ctx) => readOnly(ctx, "touch") },
  cp: { help: { es: "", en: "" }, hidden: true, run: (_a, ctx) => readOnly(ctx, "cp") },
  mv: { help: { es: "", en: "" }, hidden: true, run: (_a, ctx) => readOnly(ctx, "mv") },

  // Easter eggs
  sudo: {
    help: { es: "sudo hire-me 👀", en: "sudo hire-me 👀" },
    run: (args, ctx, raw) => {
      if (/rm\s+-rf\s+\/\*?\s*$/.test(raw)) return commands.rm!.run(args.slice(1), ctx, raw);
      if (args[0] === "hire-me") {
        ctx.askPassword(() => {
          ctx.print([
            { text: L(ctx, "Acceso concedido. Abriendo contacto…", "Access granted. Opening contact…"), tone: "ok" },
          ]);
          const s = ctx.store.getState();
          s.fireConfetti();
          window.setTimeout(() => s.openWindow("contact"), 500);
        });
        return;
      }
      ctx.print({ text: L(ctx, "visitante no está en el archivo sudoers. Este incidente será reportado.", "visitante is not in the sudoers file. This incident will be reported."), tone: "error" });
    },
  },
  rm: {
    help: { es: "", en: "" },
    hidden: true,
    run: (_args, ctx, raw) => {
      if (/rm\s+-(rf|fr)\s+\/\*?\s*$/.test(raw)) {
        ctx.print({ text: L(ctx, "borrando /…", "deleting /…"), tone: "error" });
        window.setTimeout(() => ctx.store.getState().setPhase("crash"), 300);
        return;
      }
      readOnly(ctx, "rm");
    },
  },
  vim: { help: { es: "editor (suerte para salir)", en: "editor (good luck leaving)" }, hidden: true, run: (_a, ctx) => ctx.openEditor("vim") },
  vi: { help: { es: "", en: "" }, hidden: true, run: (_a, ctx) => ctx.openEditor("vim") },
  nano: { help: { es: "", en: "" }, hidden: true, run: (_a, ctx) => ctx.openEditor("nano") },
  tejada: {
    help: { es: "", en: "" },
    hidden: true,
    run: (_a, ctx) => ctx.print({ text: L(ctx, "Ya estás adentro. 👋", "You're already in. 👋"), tone: "accent" }),
  },
};

function readOnly(ctx: Ctx, cmd: string) {
  ctx.print({ text: `${cmd}: ${L(ctx, "sistema de archivos de solo lectura", "read-only file system")}`, tone: "error" });
}

/* ---------- Parsing, completion, suggestions ---------- */

export function tokenize(line: string): string[] {
  return line.trim().split(/\s+/).filter(Boolean);
}

function distance(a: string, b: string) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0]![j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i]![j] = Math.min(dp[i - 1]![j]! + 1, dp[i]![j - 1]! + 1, dp[i - 1]![j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length]![b.length]!;
}

export async function runLine(line: string, ctx: Ctx) {
  const tokens = tokenize(line);
  const [name, ...args] = tokens;
  if (!name) return;
  const cmd = commands[name.toLowerCase()];
  if (cmd) {
    await cmd.run(args, ctx, line);
    return;
  }
  // `cd proyectos` style shortcut: typing a folder name works like zsh's autocd.
  if (isDir(resolvePath(ctx.cwd, name))) {
    ctx.setCwd(resolvePath(ctx.cwd, name));
    return;
  }
  const best = Object.keys(commands)
    .map((c) => ({ c, d: distance(name.toLowerCase(), c) }))
    .sort((a, b) => a.d - b.d)[0];
  ctx.print({
    text: `zsh: ${L(ctx, "comando no encontrado", "command not found")}: ${name}${best && best.d <= 2 ? L(ctx, ` · ¿quisiste decir \`${best.c}\`?`, ` · did you mean \`${best.c}\`?`) : ""}`,
    tone: "error",
  });
}

export function complete(line: string, cwd: string): { line: string; options: string[] } {
  const endsWithSpace = /\s$/.test(line);
  const tokens = tokenize(line);
  if (tokens.length === 0) return { line, options: [] };
  if (tokens.length === 1 && !endsWithSpace) {
    const prefix = tokens[0]!.toLowerCase();
    const opts = Object.keys(commands).filter((c) => !commands[c]!.hidden && c.startsWith(prefix));
    return finish(line, prefix, opts, "");
  }
  const cmd = tokens[0]!.toLowerCase();
  const current = endsWithSpace ? "" : tokens[tokens.length - 1]!;
  const before = endsWithSpace ? line : line.slice(0, line.length - current.length);
  let candidates: string[] = [];
  if (cmd === "man") candidates = Object.keys(commands).filter((c) => !commands[c]!.hidden);
  else if (cmd === "theme") candidates = ["midnight", "daylight"];
  else if (cmd === "lang") candidates = ["es", "en"];
  else if (cmd === "git") candidates = ["log"];
  else if (cmd === "sudo") candidates = ["hire-me"];
  else if (cmd === "ping") candidates = projects.filter((p) => p.links.demo).map((p) => p.slug);
  else if (cmd === "open") candidates = [...Object.keys(APP_ALIASES).filter((a) => /^[a-z-]+$/.test(a)), ...projects.map((p) => p.slug)];
  else {
    // Paths relative to cwd (cd, ls, cat).
    const slash = current.lastIndexOf("/");
    const dirPart = slash >= 0 ? current.slice(0, slash + 1) : "";
    const dirAbs = resolvePath(cwd, dirPart || ".");
    const node = FS[dirAbs];
    if (node?.type === "dir") {
      candidates = node.children
        .map((c) => {
          const clean = c.replace(/\/$/, "");
          return dirPart + (isDir(`${dirAbs}/${clean}`) ? `${clean}/` : clean);
        })
        .filter((c) => (cmd === "cd" ? c.endsWith("/") : true));
    }
    if (cmd === "cat" && !dirPart) candidates.push(...windowProjects.map((p) => p.slug));
  }
  const opts = [...new Set(candidates)].filter((c) => c.toLowerCase().startsWith(current.toLowerCase()));
  return finish(line, current, opts, before);
}

function finish(line: string, current: string, opts: string[], before: string) {
  if (opts.length === 0) return { line, options: [] };
  if (opts.length === 1) {
    const only = opts[0]!;
    return { line: `${before}${only}${only.endsWith("/") ? "" : " "}`, options: [] };
  }
  // Longest common prefix.
  let prefix = opts[0]!;
  for (const o of opts) while (!o.startsWith(prefix)) prefix = prefix.slice(0, -1);
  return { line: prefix.length > current.length ? `${before}${prefix}` : line, options: opts };
}
