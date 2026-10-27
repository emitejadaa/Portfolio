"use client";

import { useEffect, useSyncExternalStore } from "react";
import { identity } from "@/content/profile";

/* ---------- Time ---------- */

const listeners = new Set<() => void>();
let tick: ReturnType<typeof setInterval> | null = null;
let nowValue = 0;

function subscribeNow(cb: () => void) {
  listeners.add(cb);
  if (!tick) {
    nowValue = Date.now();
    tick = setInterval(() => {
      nowValue = Date.now();
      listeners.forEach((l) => l());
    }, 1000);
  }
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0 && tick) {
      clearInterval(tick);
      tick = null;
    }
  };
}

/** Current time, ticking every second. 0 during SSR so markup never depends on the server clock. */
export function useNow(): number {
  return useSyncExternalStore(
    subscribeNow,
    () => nowValue || Date.now(),
    () => 0,
  );
}

const baFormatters = new Map<string, Intl.DateTimeFormat>();
export function formatBA(ms: number, opts: Intl.DateTimeFormatOptions, locale = "es-AR") {
  const key = locale + JSON.stringify(opts);
  let f = baFormatters.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat(locale, { timeZone: identity.timeZone, ...opts });
    baFormatters.set(key, f);
  }
  return f.format(ms);
}

/** "14:32" in Buenos Aires (GMT−3). */
export function useClockBA() {
  const now = useNow();
  if (!now) return { time: "··:··", date: "", now };
  return {
    time: formatBA(now, { hour: "2-digit", minute: "2-digit", hour12: false }),
    date: formatBA(now, { weekday: "short", day: "numeric", month: "short" }),
    now,
  };
}

/* ---------- Data ---------- */

type CacheEntry = { data: unknown; error: boolean; at: number; promise?: Promise<void> };
const cache = new Map<string, CacheEntry>();
const subscribers = new Map<string, Set<() => void>>();

function notify(url: string) {
  subscribers.get(url)?.forEach((cb) => cb());
}

function load(url: string, ttlMs: number) {
  const hit = cache.get(url);
  if (hit?.promise) return;
  if (hit && !hit.error && hit.data != null && Date.now() - hit.at < ttlMs) return;
  const promise = fetch(url)
    .then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    })
    .then((data) => {
      cache.set(url, { data, error: false, at: Date.now() });
    })
    .catch(() => {
      cache.set(url, { data: cache.get(url)?.data ?? null, error: true, at: Date.now() });
    })
    .finally(() => notify(url));
  cache.set(url, { data: hit?.data ?? null, error: false, at: hit?.at ?? 0, promise });
}

/** Small shared fetch cache for the live widgets: one request per URL, every subscriber updates. */
export function useApi<T>(url: string | null, ttlMs = 5 * 60 * 1000) {
  const entry = useSyncExternalStore(
    (cb) => {
      if (!url) return () => {};
      const set = subscribers.get(url) ?? new Set();
      set.add(cb);
      subscribers.set(url, set);
      return () => set.delete(cb);
    },
    () => (url ? cache.get(url) : undefined),
    () => undefined,
  );

  useEffect(() => {
    if (url) load(url, ttlMs);
  }, [url, ttlMs]);

  return {
    data: (entry?.data as T | null | undefined) ?? null,
    error: !!entry?.error,
    loading: entry?.data == null && !entry?.error,
  };
}

/* ---------- Persistent flags (localStorage) ---------- */

const flagListeners = new Set<() => void>();
function readFlag(key: string) {
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}
export function setLocalFlag(key: string) {
  try {
    if (localStorage.getItem(key) === "1") return;
    localStorage.setItem(key, "1");
  } catch {}
  flagListeners.forEach((cb) => cb());
}
/** A "seen" flag kept in localStorage; `fallback` is what the server renders. */
export function useLocalFlag(key: string, fallback = true) {
  return useSyncExternalStore(
    (cb) => {
      flagListeners.add(cb);
      return () => flagListeners.delete(cb);
    },
    () => readFlag(key),
    () => fallback,
  );
}

export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

const noopSubscribe = () => () => {};
/** ⌘ on Apple devices, Ctrl elsewhere. Server renders ⌘. */
export function useIsApple() {
  return useSyncExternalStore(
    noopSubscribe,
    () => /Mac|iPhone|iPad/i.test(navigator.userAgent),
    () => true,
  );
}

const APPLE_KEYS: Record<string, string> = { mod: "⌘", shift: "⇧", enter: "↵" };
const PC_KEYS: Record<string, string> = { mod: "Ctrl", shift: "Shift", enter: "Enter" };

/** ["mod", "shift", "L"] → "⌘⇧L" on Apple devices, "Ctrl+Shift+L" elsewhere. */
export function formatKeys(keys: string[], apple: boolean) {
  return apple ? keys.map((k) => APPLE_KEYS[k] ?? k).join("") : keys.map((k) => PC_KEYS[k] ?? k).join("+");
}

export function useKeys(...keys: string[]) {
  return formatKeys(keys, useIsApple());
}

/* ---------- Environment ---------- */

export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

export const isTypingTarget = (el: EventTarget | null) => {
  const node = el as HTMLElement | null;
  if (!node) return false;
  const tag = node.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || node.isContentEditable;
};

/* ---------- Launch origins (open/minimize animations) ---------- */

const launchRects = new Map<string, DOMRect>();
export function registerLaunchRect(id: string, el: HTMLElement | null) {
  if (el) launchRects.set(id, el.getBoundingClientRect());
}
export function launchCenter(id: string) {
  const r = launchRects.get(id);
  return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : undefined;
}
export function centerOf(el: Element | null) {
  if (!el) return undefined;
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}
