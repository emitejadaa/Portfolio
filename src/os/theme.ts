"use client";

import { flushSync } from "react-dom";
import type { StoreApi } from "zustand";
import { isReducedMotion } from "./prefs";
import type { OSState, Theme } from "./store";

type ViewTransitionDoc = Document & { startViewTransition?: (cb: () => void) => unknown };

/** B·04: transición de 400 ms, un círculo que se expande desde el toggle (View Transitions API). */
export function switchTheme(store: StoreApi<OSState>, next?: Theme, origin?: { x: number; y: number }) {
  const state = store.getState();
  const target: Theme = next ?? (state.theme === "midnight" ? "daylight" : "midnight");
  if (target === state.theme) return;
  const apply = () => state.setTheme(target);
  const doc = document as ViewTransitionDoc;
  if (!doc.startViewTransition || isReducedMotion()) {
    apply();
    return;
  }
  const x = origin?.x ?? 24;
  const y = origin?.y ?? 20;
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const root = document.documentElement;
  root.style.setProperty("--vt-x", `${x}px`);
  root.style.setProperty("--vt-y", `${y}px`);
  root.style.setProperty("--vt-r", `${r}px`);
  doc.startViewTransition(() => flushSync(apply));
}
