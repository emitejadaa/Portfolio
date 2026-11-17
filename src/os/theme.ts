"use client";

import { flushSync } from "react-dom";
import type { StoreApi } from "zustand";
import { isReducedMotion } from "./prefs";
import type { OSState, Theme } from "./store";

type ViewTransitionLike = { finished: Promise<unknown> };
type ViewTransitionDoc = Document & { startViewTransition?: (cb: () => void) => ViewTransitionLike };

/** Where the last press landed, so a switch that starts from somewhere other than the sun toggle
 *  (the mode widget, Ajustes, Spotlight, the terminal) still grows from where the visitor just acted. */
let lastDown: { x: number; y: number; at: number } | null = null;
if (typeof window !== "undefined") {
  window.addEventListener(
    "pointerdown",
    (e) => {
      lastDown = { x: e.clientX, y: e.clientY, at: performance.now() };
    },
    { passive: true, capture: true },
  );
}

/** A press older than this is not what triggered the switch (a shortcut or Spotlight, typed long after). */
const FRESH_MS = 4000;
/** Cross-fade used when there is no circle (no View Transitions, or reduced motion); keep in sync with globals.css. */
const FADE_MS = 280;

function originOf(explicit?: { x: number; y: number }) {
  if (explicit) return explicit;
  if (lastDown && performance.now() - lastDown.at < FRESH_MS) return lastDown;
  return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
}

let run = 0;

/**
 * B·04: el cambio de modo es un círculo que se expande desde donde se hizo click (View Transitions API, 520 ms).
 *
 * - `theme-vt` apaga las transiciones CSS mientras dura: lo que el círculo revela ya es el modo nuevo, sin
 *   bordes y sombras a medio fundir.
 * - Sin View Transitions, o con "reducir movimiento", no hay círculo: `theme-fade` funde los colores (280 ms,
 *   o 120 ms con reducir movimiento) en vez de cambiar de golpe.
 */
export function switchTheme(store: StoreApi<OSState>, next?: Theme, origin?: { x: number; y: number }) {
  const state = store.getState();
  const target: Theme = next ?? (state.theme === "midnight" ? "daylight" : "midnight");
  if (target === state.theme) return;
  const apply = () => state.setTheme(target);
  const root = document.documentElement;
  const id = ++run;
  // Only the latest switch cleans up, so a quick second toggle is not cut short by the first one's timer.
  const done = () => {
    if (id !== run) return;
    root.classList.remove("theme-vt", "theme-fade");
    root.style.removeProperty("--vt-x");
    root.style.removeProperty("--vt-y");
    root.style.removeProperty("--vt-r");
  };

  const doc = document as ViewTransitionDoc;
  if (!doc.startViewTransition || isReducedMotion()) {
    root.classList.remove("theme-vt");
    root.classList.add("theme-fade");
    apply();
    window.setTimeout(done, FADE_MS + 60);
    return;
  }

  const { x, y } = originOf(origin);
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  root.style.setProperty("--vt-x", `${x}px`);
  root.style.setProperty("--vt-y", `${y}px`);
  root.style.setProperty("--vt-r", `${r}px`);
  root.classList.remove("theme-fade");
  root.classList.add("theme-vt");
  doc.startViewTransition(() => flushSync(apply)).finished.then(done, done);
}
