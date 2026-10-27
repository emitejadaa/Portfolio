"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { contact, stackItemLabel } from "@/content/profile";
import { projects } from "@/content/projects";
import { ui } from "@/content/ui";
import type { Locale } from "@/content/types";
import type { IconName, SingletonApp } from "../apps";
import { copyText, useKeys } from "../hooks";
import { Icon } from "../icons";
import { useLocale, useT } from "../i18n";
import { useOS, useOSStore, type OSState } from "../store";
import { switchTheme } from "../theme";
import type { StoreApi } from "zustand";

type Group = "projects" | "lab" | "apps" | "actions" | "links";
type Item = {
  id: string;
  group: Group;
  title: string;
  subtitle?: string;
  icon: IconName;
  hint: string;
  haystack: string;
  path?: string;
  run: () => void;
};

const GROUP_ORDER: Group[] = ["projects", "lab", "apps", "actions", "links"];

export const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

function score(item: Item, q: string): number {
  if (!q) return 1;
  const title = normalize(item.title);
  if (title === q) return 120;
  if (title.startsWith(q)) return 100;
  if (title.split(/[\s./-]+/).some((w) => w.startsWith(q))) return 80;
  if (title.includes(q)) return 60;
  if (item.haystack.includes(q)) return 40;
  let i = 0;
  for (const ch of title) if (ch === q[i]) i++;
  return i === q.length ? 20 : 0;
}

function buildItems(
  store: StoreApi<OSState>,
  locale: Locale,
  t: (l: { es: string; en: string }) => string,
  modeKeys: string,
): Item[] {
  const s = () => store.getState();
  const items: Item[] = [];

  for (const p of projects) {
    const isWindow = p.tier !== "practica";
    items.push({
      id: `p:${p.slug}`,
      group: isWindow ? "projects" : "lab",
      title: p.title,
      subtitle: p.summary[locale],
      icon: isWindow ? "grid" : "flask",
      hint: isWindow ? `${t(ui.spotlight.kind.app)} · ${t(ui.spotlight.kind.open)}` : t(ui.apps.lab),
      haystack: normalize(
        [p.summary.es, p.summary.en, p.type.es, p.type.en, p.role.es, p.slug, p.year, ...p.stack.map((x) => `${x} ${stackItemLabel(x, "en")}`)].join(" "),
      ),
      path: isWindow ? `/proyectos/${p.slug}` : "/lab",
      run: () => (isWindow ? s().openWindow(`project:${p.slug}`) : s().openWindow("lab", { view: p.slug })),
    });
  }

  const apps: { app: SingletonApp; icon: IconName; hint: string }[] = [
    { app: "projects", icon: "grid", hint: t(ui.spotlight.kind.window) },
    { app: "about", icon: "user", hint: t(ui.spotlight.kind.window) },
    { app: "lab", icon: "flask", hint: t(ui.spotlight.kind.window) },
    { app: "terminal", icon: "term", hint: "`" },
    { app: "contact", icon: "mail", hint: t(ui.spotlight.kind.window) },
    { app: "readme", icon: "doc", hint: t(ui.spotlight.kind.window) },
  ];
  for (const a of apps) {
    items.push({
      id: `a:${a.app}`,
      group: "apps",
      title: t(ui.apps[a.app]),
      icon: a.icon,
      hint: a.hint,
      haystack: normalize(`${ui.apps[a.app].es} ${ui.apps[a.app].en} ${a.app} app`),
      path: { projects: "/proyectos", about: "/sobre-mi", lab: "/lab", contact: "/contacto" }[a.app as string],
      run: () => s().openWindow(a.app),
    });
  }

  const theme = s().theme;
  items.push(
    {
      id: "x:theme",
      group: "actions",
      title: theme === "midnight" ? t(ui.menu.modeToDaylight) : t(ui.menu.modeToMidnight),
      icon: "moon",
      hint: modeKeys,
      haystack: normalize("modo tema theme midnight daylight oscuro claro dark light"),
      run: () => switchTheme(store),
    },
    {
      id: "x:terminal",
      group: "actions",
      title: t(ui.actions.openTerminal),
      icon: "term",
      hint: "`",
      haystack: normalize("terminal consola shell comandos"),
      run: () => s().openWindow("terminal"),
    },
    {
      id: "x:email",
      group: "actions",
      title: t(ui.actions.copyEmail),
      subtitle: contact.email,
      icon: "copy",
      hint: t(ui.spotlight.kind.action),
      haystack: normalize(`mail email correo copiar copy ${contact.email}`),
      run: () => void copyText(contact.email).then(() => s().showToast(t(ui.toast.emailCopied))),
    },
    {
      id: "x:lang",
      group: "actions",
      title: t(ui.actions.toEnglish),
      icon: "globe",
      hint: locale === "es" ? "EN" : "ES",
      haystack: normalize("idioma language english espanol ingles"),
      run: () => s().setLocale(locale === "es" ? "en" : "es"),
    },
    {
      id: "l:github",
      group: "links",
      title: "GitHub",
      subtitle: contact.github.handle,
      icon: "github",
      hint: t(ui.spotlight.kind.link),
      haystack: normalize("github repos codigo code emitejadaa"),
      run: () => window.open(contact.github.url, "_blank", "noopener"),
    },
    {
      id: "l:linkedin",
      group: "links",
      title: "LinkedIn",
      subtitle: contact.linkedin.name,
      icon: "linkedin",
      hint: t(ui.spotlight.kind.link),
      haystack: normalize("linkedin perfil profile cv"),
      run: () => window.open(contact.linkedin.url, "_blank", "noopener"),
    },
  );
  return items;
}

export function Spotlight() {
  const store = useOSStore();
  const open = useOS((s) => s.spotlight.open);
  const query = useOS((s) => s.spotlight.query);
  const theme = useOS((s) => s.theme);
  const layout = useOS((s) => s.layout);
  const locale = useLocale();
  const t = useT();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState({ query: "", index: 0 });
  const active = selection.query === query ? selection.index : 0;
  const setActive = (update: (i: number) => number) => setSelection({ query, index: update(active) });

  const modeKeys = useKeys("mod", "shift", "L");
  const items = useMemo(
    () => (open ? buildItems(store, locale, t, modeKeys) : []),
    // theme in deps so the mode action relabels
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open, locale, theme, store, modeKeys],
  );

  const results = useMemo(() => {
    const q = normalize(query.trim());
    const scored = items
      .map((item) => ({ item, s: score(item, q) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s || GROUP_ORDER.indexOf(a.item.group) - GROUP_ORDER.indexOf(b.item.group));
    const list = q ? scored : scored.filter((r) => r.item.group !== "lab");
    // Groups ordered by their best match (an exact app name beats a stack keyword), score order inside.
    const best = new Map<Group, number>();
    for (const r of list) best.set(r.item.group, Math.max(best.get(r.item.group) ?? 0, r.s));
    const groups = [...GROUP_ORDER].sort((a, b) => (q ? (best.get(b) ?? 0) - (best.get(a) ?? 0) : 0) || GROUP_ORDER.indexOf(a) - GROUP_ORDER.indexOf(b));
    return groups.flatMap((g) => list.filter((r) => r.item.group === g).map((r) => r.item)).slice(0, q ? 40 : 16);
  }, [items, query]);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const runItem = (item: Item, newTab = false) => {
    store.getState().closeSpotlight();
    if (newTab && item.path) {
      window.open(item.path, "_blank", "noopener");
      return;
    }
    item.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[active];
      if (item) runItem(item, e.metaKey || e.ctrlKey);
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      store.getState().closeSpotlight();
    }
  };

  const mobile = layout === "mobile";
  let lastGroup: Group | null = null;

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[110]" role="presentation">
          <motion.div
            className="absolute inset-0 bg-black/30 daylight:bg-[rgb(17_17_16/0.12)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => store.getState().closeSpotlight()}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Spotlight"
            initial={{ opacity: 0, y: -12, scale: 0.98, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.16, ease: [0.4, 0, 1, 1] } }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.36 }}
            className={`popover absolute overflow-hidden ${
              mobile
                ? "inset-x-3 top-[max(12px,env(safe-area-inset-top))] rounded-[20px] daylight:rounded-[14px]"
                : "top-[16vh] left-1/2 w-[min(760px,calc(100vw-32px))] -translate-x-1/2 rounded-[20px] daylight:rounded-[14px]"
            }`}
            onKeyDown={onKeyDown}
          >
            <div className="flex h-16 items-center gap-3.5 px-[22px]">
              <Icon name="search" size={22} className="shrink-0 text-text-2" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => store.getState().setSpotlightQuery(e.target.value)}
                placeholder={t(ui.spotlight.placeholder)}
                aria-label={t(ui.spotlight.placeholder)}
                aria-controls="spotlight-results"
                aria-activedescendant={results[active] ? `spot-${results[active]!.id}` : undefined}
                role="combobox"
                aria-expanded="true"
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent text-[22px] font-normal tracking-[-0.01em] text-text caret-accent outline-none placeholder:text-text-2/70 focus-visible:outline-none"
              />
              <button type="button" className="kbd px-2" onClick={() => store.getState().closeSpotlight()}>
                esc
              </button>
            </div>
            <div className="h-px bg-line daylight:bg-[var(--tinta)]" />
            <div ref={listRef} id="spotlight-results" role="listbox" className="scroll-area max-h-[min(390px,52vh)] p-2.5">
              {results.length === 0 ? (
                <p className="px-3 py-8 text-center text-[14px] text-text-2">
                  {t(ui.spotlight.empty)} “{query}”
                </p>
              ) : (
                results.map((item, i) => {
                  const header = item.group !== lastGroup ? item.group : null;
                  lastGroup = item.group;
                  const selected = i === active;
                  return (
                    <div key={item.id}>
                      {header ? (
                        <div className="t-label px-3 pt-2.5 pb-1.5 text-text-2">{t(ui.spotlight.groups[header])}</div>
                      ) : null}
                      <div
                        id={`spot-${item.id}`}
                        role="option"
                        aria-selected={selected}
                        data-index={i}
                        onMouseMove={() => i !== active && setActive(() => i)}
                        onClick={(e) => runItem(item, e.metaKey || e.ctrlKey)}
                        className={`relative flex h-[46px] cursor-pointer items-center gap-3.5 rounded-[10px] px-[18px] transition-colors duration-100 daylight:rounded-none ${
                          selected ? "bg-[var(--hover-fill)] daylight:bg-[var(--tinta)] daylight:text-[var(--blanco-roto)]" : ""
                        }`}
                      >
                        {selected ? (
                          <span className="absolute top-3 left-0 h-[22px] w-[3px] rounded-full bg-accent daylight:hidden" />
                        ) : null}
                        <Icon name={item.icon} size={20} className={selected ? "" : "text-text-2"} />
                        <span className="min-w-0 flex-1 truncate">
                          <span className="text-[15px]">{item.title}</span>
                          {item.subtitle ? (
                            <span className={`ml-2.5 text-[13px] ${selected ? "opacity-70" : "text-text-2"}`}>{item.subtitle}</span>
                          ) : null}
                        </span>
                        <span className={`shrink-0 font-mono text-[12px] ${selected ? "opacity-80" : "text-text-2"}`}>{item.hint}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="hidden h-11 items-center border-t border-line px-[22px] font-mono text-[12px] text-text-2 sm:flex daylight:border-[var(--tinta)]">
              {t(ui.spotlight.footer)}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
