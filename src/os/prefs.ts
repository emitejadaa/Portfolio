"use client";

import { useSyncExternalStore } from "react";

/**
 * Ajustes de accesibilidad. The single source of truth is a set of data attributes on <html>: the
 * pre-paint script in app/layout.tsx applies the saved values before first paint, CSS reacts to the
 * attributes (globals.css · "Ajustes"), and these helpers read and write them.
 *
 * Only what the visitor chose is saved (PREFS_KEY). Anything left unset follows the device: the system's
 * reduced-motion setting, and solid surfaces on hardware that cannot blur glass smoothly (PERF_KEY,
 * written by src/os/perf.ts).
 */
export type MotionPref = "auto" | "reduce" | "full";
export type Prefs = {
  /** "auto" follows the system setting. */
  motion: MotionPref;
  /** Solid surfaces instead of frosted glass (also the cheapest rendering path). */
  solid: boolean;
  contrast: boolean;
  largeText: boolean;
  cursor: boolean;
};

export const PREFS_KEY = "tejada.prefs";
export const PERF_KEY = "tejada.perf";
const EVENT = "tejada:prefs";
const DEFAULTS: Prefs = { motion: "auto", solid: false, contrast: false, largeText: false, cursor: true };

/** What the visitor set explicitly. Version 2 stores only changed keys; v1 stored every key at once. */
type Stored = Partial<Prefs> & { v?: 2 };

export type PerfTier = "lite" | "full";
export type PerfRecord = { tier: PerfTier; reason?: "gpu" | "frames"; gpu?: "hw" | "sw" | "none"; at: number };

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function readStored(): Stored {
  const s = readJson<Stored>(PREFS_KEY) ?? {};
  // v1 saved `solid: false` alongside any other change, so it never meant "I want glass".
  if (!s.v && s.solid === false) delete s.solid;
  return s;
}

export function readPerf(): PerfRecord | null {
  return readJson<PerfRecord>(PERF_KEY);
}

let cache: { key: string; prefs: Prefs } | null = null;

function readPrefs(): Prefs {
  const d = document.documentElement.dataset;
  const key = [d.motion, d.solid, d.contrast, d.text, d.cursor].join("|");
  if (cache?.key === key) return cache.prefs;
  const prefs: Prefs = {
    motion: d.motion === "reduce" || d.motion === "full" ? d.motion : "auto",
    solid: d.solid === "1",
    contrast: d.contrast === "more",
    largeText: d.text === "large",
    cursor: d.cursor !== "off",
  };
  cache = { key, prefs };
  return prefs;
}

function apply(prefs: Prefs) {
  const d = document.documentElement.dataset;
  const set = (name: string, value: string | false) => {
    if (value) d[name] = value;
    else delete d[name];
  };
  set("motion", prefs.motion !== "auto" && prefs.motion);
  set("solid", prefs.solid && "1");
  set("contrast", prefs.contrast && "more");
  set("text", prefs.largeText && "large");
  set("cursor", !prefs.cursor && "off");
  window.dispatchEvent(new Event(EVENT));
}

/** Same rule as the pre-paint script: very low-end devices, or a measured slow renderer, get solid surfaces. */
function deviceSolid(): boolean {
  const n = navigator as Navigator & { deviceMemory?: number };
  const lowEnd = (!!n.deviceMemory && n.deviceMemory <= 2) || (!!n.hardwareConcurrency && n.hardwareConcurrency <= 2);
  return lowEnd || readPerf()?.tier === "lite";
}

function resolve(stored: Stored): Prefs {
  return {
    motion: stored.motion === "reduce" || stored.motion === "full" ? stored.motion : "auto",
    solid: stored.solid ?? deviceSolid(),
    contrast: stored.contrast ?? DEFAULTS.contrast,
    largeText: stored.largeText ?? DEFAULTS.largeText,
    cursor: stored.cursor ?? DEFAULTS.cursor,
  };
}

export function setPrefs(patch: Partial<Prefs>) {
  const stored: Stored = { ...readStored(), ...patch, v: 2 };
  if (stored.motion === "auto") delete stored.motion;
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(stored));
  } catch {}
  apply(resolve(stored));
}

export function resetPrefs() {
  try {
    localStorage.removeItem(PREFS_KEY);
  } catch {}
  apply(resolve({}));
}

/** Records what src/os/perf.ts measured. Returns true when it switched the desktop to solid surfaces. */
export function setPerf(record: PerfRecord): boolean {
  const before = readPrefs().solid;
  try {
    localStorage.setItem(PERF_KEY, JSON.stringify(record));
  } catch {}
  const stored = readStored();
  if (stored.solid !== undefined) return false;
  const next = resolve(stored);
  apply(next);
  return !before && next.solid;
}

/** Solid surfaces are on because of the device, not because the visitor asked for them. */
export function isAutoSolid() {
  return readPrefs().solid && readStored().solid === undefined;
}

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(REDUCE_QUERY);
  mq.addEventListener("change", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    mq.removeEventListener("change", cb);
    window.removeEventListener(EVENT, cb);
  };
}

export function usePrefs(): Prefs {
  return useSyncExternalStore(subscribe, readPrefs, () => DEFAULTS);
}

/** Reduced motion as the visitor chose it in Ajustes, falling back to the system setting. */
export function isReducedMotion() {
  const { motion } = readPrefs();
  return motion === "reduce" || (motion === "auto" && window.matchMedia(REDUCE_QUERY).matches);
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, isReducedMotion, () => false);
}
