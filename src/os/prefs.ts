"use client";

import { useSyncExternalStore } from "react";

/**
 * Ajustes de accesibilidad. The single source of truth is a set of data attributes on <html>: the
 * pre-paint script in app/layout.tsx applies the saved values before first paint, CSS reacts to the
 * attributes (globals.css · "Ajustes"), and these helpers read and write them.
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
const EVENT = "tejada:prefs";
const DEFAULTS: Prefs = { motion: "auto", solid: false, contrast: false, largeText: false, cursor: true };

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

export function setPrefs(patch: Partial<Prefs>) {
  const next = { ...readPrefs(), ...patch };
  apply(next);
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(next));
  } catch {}
}

/** Same rule as the pre-paint script: very low-end devices default to solid surfaces. */
function deviceDefaults(): Prefs {
  const n = navigator as Navigator & { deviceMemory?: number };
  const lowEnd = (!!n.deviceMemory && n.deviceMemory <= 2) || (!!n.hardwareConcurrency && n.hardwareConcurrency <= 2);
  return { ...DEFAULTS, solid: lowEnd };
}

export function resetPrefs() {
  apply(deviceDefaults());
  try {
    localStorage.removeItem(PREFS_KEY);
  } catch {}
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
