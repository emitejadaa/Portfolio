"use client";

import { useCallback } from "react";
import type { L, Locale } from "@/content/types";
import { ui } from "@/content/ui";
import { useOS } from "./store";

export function useLocale(): Locale {
  return useOS((s) => s.locale);
}

/** `t(l)` picks the active language from an `{ es, en }` pair. */
export function useT() {
  const locale = useLocale();
  return useCallback((l: L) => l[locale], [locale]);
}

export function relativeTime(iso: string | number | Date, locale: Locale, now = Date.now()): string {
  const then = new Date(iso).getTime();
  const diff = Math.max(0, now - then);
  const min = Math.round(diff / 60000);
  const u = ui.time.units;
  const fmt = (n: number, unit: L) => (locale === "es" ? `hace ${n} ${unit.es}` : `${n} ${unit.en} ago`);
  if (min < 1) return ui.time.now[locale];
  if (min < 60) return fmt(min, u.m);
  const h = Math.round(min / 60);
  if (h < 48) return fmt(h, u.h);
  const d = Math.round(h / 24);
  if (d < 60) return fmt(d, u.d);
  return fmt(Math.round(d / 30), u.mo);
}

export function formatNumber(n: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "es" ? "es-AR" : "en-US").format(n);
}
