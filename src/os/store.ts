"use client";

import { createContext, useContext } from "react";
import { createStore, useStore, type StoreApi } from "zustand";
import type { Locale } from "@/content/types";
import { apps, appOf, keyForPath, projectSize, slugOf, type SingletonApp, type WinKey } from "./apps";

export type Theme = "midnight" | "daylight";
export type Phase = "boot" | "lock" | "desktop" | "crash";
export type Layout = "ssr" | "desktop" | "mobile";

export type Rect = { x: number; y: number; w: number; h: number };

export type Win = {
  key: WinKey;
  z: number;
  minimized: boolean;
  maximized: boolean;
  rect: Rect;
  /** Center of whatever launched it (dock icon, desktop icon), for the open animation. */
  origin?: { x: number; y: number };
  /** Bumps when the window is re-requested so the app can react (e.g. Spotlight → tab). */
  nonce: number;
  /** Optional sub-view requested by whoever opened it (e.g. a project tab). */
  view?: string;
};

export type Toast = { id: number; text: string };

export type OSState = {
  theme: Theme;
  locale: Locale;
  retro: boolean;
  phase: Phase;
  layout: Layout;
  hydrated: boolean;
  windows: Win[];
  focused: WinKey | null;
  topZ: number;
  spotlight: { open: boolean; query: string };
  toast: Toast | null;
  confetti: number;
  screensaver: boolean;
  bootedAt: number;

  setHydrated: () => void;
  setLayout: (layout: Layout) => void;
  setPhase: (phase: Phase) => void;
  setTheme: (theme: Theme) => void;
  setLocale: (locale: Locale) => void;
  setRetro: (on: boolean) => void;
  openWindow: (key: WinKey, opts?: OpenOpts) => void;
  closeWindow: (key: WinKey) => void;
  focusWindow: (key: WinKey) => void;
  minimizeWindow: (key: WinKey) => void;
  toggleMaximize: (key: WinKey) => void;
  closeAll: () => void;
  cycleWindows: () => void;
  openSpotlight: (query?: string) => void;
  closeSpotlight: () => void;
  setSpotlightQuery: (query: string) => void;
  showToast: (text: string) => void;
  fireConfetti: () => void;
  setScreensaver: (on: boolean) => void;
};

export type OpenOpts = {
  origin?: { x: number; y: number };
  view?: string;
  /** "push" adds a history entry (default), "replace" swaps it, "none" leaves the URL alone. */
  nav?: "push" | "replace" | "none";
};

// Desktop chrome that windows must not cover (A·08: menu bar 40 px; dock ~96 px).
export const MENU_H = 40;
export const DOCK_H = 104;
const DEFAULT_VIEWPORT = { w: 1440, h: 900 };

function viewport() {
  if (typeof window === "undefined") return DEFAULT_VIEWPORT;
  return { w: window.innerWidth, h: window.innerHeight };
}

export function sizeFor(key: WinKey): [number, number] {
  const slug = slugOf(key);
  return slug ? projectSize(slug) : apps[key as SingletonApp].size;
}

export function placeWindow(key: WinKey, index: number, vp = viewport()): Rect {
  const [dw, dh] = sizeFor(key);
  const availW = vp.w - 24;
  const availH = vp.h - MENU_H - DOCK_H - 16;
  const w = Math.min(dw, availW);
  const h = Math.min(dh, availH);
  const cascade = (index % 6) * 28;
  const x = Math.max(12, Math.round((vp.w - w) / 2 - 60 + cascade));
  const y = Math.max(MENU_H + 8, Math.round(MENU_H + (availH - h) / 2 + cascade * 0.8));
  return { x, y, w, h };
}

/* ---------- History integration (L·05: "← volver" cierra la ventana) ---------- */

let navIdx = 0;
type HistoryState = { tejada?: { idx: number; key: WinKey | null } };

function currentPath() {
  return typeof window === "undefined" ? "/" : window.location.pathname;
}

function writeUrl(path: string, key: WinKey | null, mode: "push" | "replace") {
  if (typeof window === "undefined") return;
  const url = path + window.location.search;
  if (mode === "push") {
    if (currentPath() === path) return;
    navIdx += 1;
    window.history.pushState({ ...(window.history.state ?? {}), tejada: { idx: navIdx, key } } satisfies HistoryState, "", url);
  } else {
    window.history.replaceState({ ...(window.history.state ?? {}), tejada: { idx: navIdx, key } } satisfies HistoryState, "", url);
  }
}

export function readNavIdx(state: unknown): number | null {
  const s = state as HistoryState | null;
  return s?.tejada?.idx ?? null;
}
export function setNavIdx(idx: number) {
  navIdx = idx;
}
export function getNavIdx() {
  return navIdx;
}

/* ---------- Store ---------- */

export type InitOptions = { pathname: string };

export function initialWindows(pathname: string): { windows: Win[]; focused: WinKey | null } {
  const key = keyForPath(pathname);
  if (!key) return { windows: [], focused: null };
  return {
    windows: [{ key, z: 1, minimized: false, maximized: false, rect: placeWindow(key, 0, DEFAULT_VIEWPORT), nonce: 0 }],
    focused: key,
  };
}

export function createOSStore({ pathname }: InitOptions) {
  const init = initialWindows(pathname);
  const deepLink = init.windows.length > 0;

  return createStore<OSState>()((set, get) => {
    const pathOfFocused = (state: { focused: WinKey | null }) => {
      const k = state.focused;
      if (!k) return "/";
      const p = pathForKey(k);
      return p ?? currentPath();
    };

    const topVisible = (windows: Win[], except?: WinKey) =>
      windows
        .filter((w) => !w.minimized && w.key !== except)
        .sort((a, b) => b.z - a.z)[0]?.key ?? null;

    return {
      theme: "midnight",
      locale: "es",
      retro: false,
      phase: deepLink || pathname !== "/" ? "desktop" : "lock",
      layout: "ssr",
      hydrated: false,
      windows: init.windows,
      focused: init.focused,
      topZ: init.windows.length,
      spotlight: { open: false, query: "" },
      toast: null,
      confetti: 0,
      screensaver: false,
      bootedAt: Date.now(),

      setHydrated: () => set({ hydrated: true }),
      setLayout: (layout) => set({ layout }),
      setPhase: (phase) => set({ phase }),
      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== "undefined") {
          document.documentElement.dataset.theme = theme;
          try {
            localStorage.setItem("tejada.theme", theme);
          } catch {}
        }
      },
      setLocale: (locale) => {
        set({ locale });
        if (typeof document !== "undefined") {
          document.documentElement.lang = locale;
          try {
            localStorage.setItem("tejada.lang", locale);
          } catch {}
        }
      },
      setRetro: (on) => {
        set({ retro: on });
        if (typeof document !== "undefined") document.documentElement.dataset.retro = on ? "1" : "0";
      },

      openWindow: (key, opts = {}) => {
        const { windows, topZ } = get();
        const z = topZ + 1;
        const existing = windows.find((w) => w.key === key);
        if (existing) {
          set({
            windows: windows.map((w) =>
              w.key === key ? { ...w, z, minimized: false, nonce: w.nonce + 1, view: opts.view ?? w.view } : w,
            ),
            focused: key,
            topZ: z,
          });
        } else {
          const visible = windows.filter((w) => !w.minimized).length;
          const win: Win = {
            key,
            z,
            minimized: false,
            maximized: false,
            rect: placeWindow(key, visible),
            origin: opts.origin,
            nonce: 0,
            view: opts.view,
          };
          set({ windows: [...windows, win], focused: key, topZ: z });
        }
        const path = pathForKey(key);
        if (path && opts.nav !== "none") writeUrl(path, key, opts.nav ?? "push");
        syncTitle(get());
      },

      closeWindow: (key) => {
        const { windows } = get();
        if (!windows.some((w) => w.key === key)) return;
        const next = windows.filter((w) => w.key !== key);
        const focused = topVisible(next);
        set({ windows: next, focused });
        // If this window owns the current URL, step the URL back to whatever is focused now.
        if (pathForKey(key) === currentPath()) writeUrl(pathOfFocused({ focused }), focused, "replace");
        syncTitle(get());
      },

      focusWindow: (key) => {
        const { windows, topZ, focused } = get();
        const win = windows.find((w) => w.key === key);
        if (!win) return;
        if (focused === key && !win.minimized && win.z === topZ) return;
        const z = topZ + 1;
        set({ windows: windows.map((w) => (w.key === key ? { ...w, z, minimized: false } : w)), focused: key, topZ: z });
        const path = pathForKey(key);
        if (path) writeUrl(path, key, "replace");
        syncTitle(get());
      },

      minimizeWindow: (key) => {
        const { windows } = get();
        const next = windows.map((w) => (w.key === key ? { ...w, minimized: true } : w));
        const focused = topVisible(next);
        set({ windows: next, focused });
        writeUrl(pathOfFocused({ focused }), focused, "replace");
        syncTitle(get());
      },

      toggleMaximize: (key) => {
        set({ windows: get().windows.map((w) => (w.key === key ? { ...w, maximized: !w.maximized } : w)) });
        get().focusWindow(key);
      },

      closeAll: () => {
        set({ windows: [], focused: null });
        writeUrl("/", null, "replace");
        syncTitle(get());
      },

      cycleWindows: () => {
        const visible = get()
          .windows.filter((w) => !w.minimized)
          .sort((a, b) => a.z - b.z);
        const first = visible[0];
        if (visible.length > 1 && first) get().focusWindow(first.key);
      },

      openSpotlight: (query = "") => set({ spotlight: { open: true, query } }),
      closeSpotlight: () => set({ spotlight: { open: false, query: "" } }),
      setSpotlightQuery: (query) => set({ spotlight: { open: true, query } }),

      showToast: (text) => set({ toast: { id: Date.now(), text } }),
      fireConfetti: () => set({ confetti: get().confetti + 1 }),
      setScreensaver: (on) => set({ screensaver: on }),
    };
  });
}

function pathForKey(key: WinKey): string | undefined {
  const app = appOf(key);
  if (app === "project") return `/proyectos/${slugOf(key)}`;
  return apps[app].path;
}

const TITLE: Record<"es" | "en", string> = {
  es: "Emiliano Tejada · Hardware, Backend e IA",
  en: "Emiliano Tejada · Hardware, Backend & AI",
};

function syncTitle(state: OSState) {
  if (typeof document === "undefined") return;
  const k = state.focused;
  if (!k) {
    document.title = TITLE[state.locale];
    return;
  }
  const app = appOf(k);
  const name =
    app === "project" ? (slugOf(k) ?? "") : apps[app].name[state.locale];
  document.title = `${app === "project" ? projectTitle(slugOf(k)) : name} · Emiliano Tejada`;
}

let projectTitle: (slug: string | undefined) => string = (s) => s ?? "";
export function registerProjectTitle(fn: (slug: string | undefined) => string) {
  projectTitle = fn;
}

export function refreshTitle(store: StoreApi<OSState>) {
  syncTitle(store.getState());
}

/* ---------- React bindings ---------- */

export const OSStoreContext = createContext<StoreApi<OSState> | null>(null);

export function useOSStore(): StoreApi<OSState> {
  const store = useContext(OSStoreContext);
  if (!store) throw new Error("useOS must be used inside <OSProvider>");
  return store;
}

export function useOS<T>(selector: (s: OSState) => T): T {
  return useStore(useOSStore(), selector);
}
