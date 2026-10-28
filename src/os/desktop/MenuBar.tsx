"use client";

import { motion } from "motion/react";
import { useRef, useState } from "react";
import { availability, identity } from "@/content/profile";
import { ui } from "@/content/ui";
import type { SingletonApp } from "../apps";
import { ClockText, useKeys } from "../hooks";
import { Icon } from "../icons";
import { useT } from "../i18n";
import { useOS, useOSStore } from "../store";
import { switchTheme } from "../theme";

const MENU_APPS: SingletonApp[] = ["projects", "about", "lab", "contact"];

export function MenuBar() {
  const store = useOSStore();
  const t = useT();
  const locale = useOS((s) => s.locale);
  const spotlightKeys = useKeys("mod", "K");

  const openApp = (app: SingletonApp, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    store.getState().openWindow(app, { origin: { x: r.left + r.width / 2, y: r.bottom } });
  };

  return (
    <header className="menubar fixed inset-x-0 top-0 z-[70] flex h-10 items-center gap-1 pr-3 pl-2 text-[13.5px] select-none">
      <SunToggle />
      <button
        type="button"
        className="menu-item flex items-center font-semibold tracking-tight"
        onClick={(e) => openApp("about", e.currentTarget)}
        aria-label={identity.name}
      >
        <span className="font-mono text-[13px] font-semibold tracking-[0.04em]">{identity.monogram}</span>
      </button>
      <nav aria-label={t(ui.menu.home)} className="ml-2 hidden items-center gap-0.5 md:flex">
        {MENU_APPS.map((app) => (
          <button key={app} type="button" className="menu-item" onClick={(e) => openApp(app, e.currentTarget)}>
            {t(ui.apps[app])}
          </button>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2.5">
        <button
          type="button"
          className="menu-item grid w-8 place-items-center px-0 text-text-2 hover:text-text"
          aria-label={t(ui.apps.prefs)}
          title={t(ui.apps.prefs)}
          onClick={(e) => openApp("prefs", e.currentTarget)}
        >
          <Icon name="sliders" size={17} />
        </button>
        <button
          type="button"
          className="kbd h-6 px-2 transition-colors hover:text-text"
          onClick={() => store.getState().openSpotlight()}
          aria-label={t(ui.menu.spotlight).replace("{keys}", spotlightKeys)}
        >
          {spotlightKeys}
        </button>
        <button
          type="button"
          className="menu-item hidden items-center gap-2 lg:flex"
          onClick={(e) => openApp("contact", e.currentTarget)}
        >
          <span className="relative flex h-[7px] w-[7px]">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
            <span className="relative h-[7px] w-[7px] rounded-full bg-accent" />
          </span>
          {t(availability.short)}
        </button>
        <div role="group" aria-label={t(ui.menu.language)} className="flex items-center font-mono text-[12px]">
          {(["es", "en"] as const).map((l, i) => (
            <span key={l} className="flex items-center">
              {i === 1 ? <span className="px-1 text-text-2" aria-hidden="true">·</span> : null}
              <button
                type="button"
                aria-pressed={locale === l}
                className={`uppercase transition-colors ${locale === l ? "text-text" : "text-text-2 hover:text-text"}`}
                onClick={() => store.getState().setLocale(l)}
              >
                {l}
              </button>
            </span>
          ))}
        </div>
        <ClockText className="t-dot min-w-[46px] text-right text-[15px] tabular-nums" label={identity.city} />
      </div>
    </header>
  );
}

/** ◐ en la menu bar: click cambia de modo (⌘⇧L); arrastrarlo mueve el sol (X·03 easter egg 03). */
function SunToggle() {
  const store = useOSStore();
  const t = useT();
  const theme = useOS((s) => s.theme);
  const ref = useRef<HTMLButtonElement>(null);
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const [sun, setSun] = useState<{ x: number; y: number } | null>(null);

  const label = theme === "midnight" ? t(ui.menu.modeToDaylight) : t(ui.menu.modeToMidnight);
  const modeKeys = useKeys("mod", "shift", "L");

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    drag.current = { x: e.clientX, y: e.clientY, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6) d.moved = true;
    if (d.moved) setSun({ x: e.clientX, y: e.clientY });
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const r = ref.current?.getBoundingClientRect();
    if (!d.moved) {
      switchTheme(store, undefined, r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : undefined);
      return;
    }
    // Sol arriba = día; sol abajo del horizonte = noche.
    const day = e.clientY < window.innerHeight * 0.5;
    setSun(null);
    switchTheme(store, day ? "daylight" : "midnight", { x: e.clientX, y: e.clientY });
  };

  const progress = sun ? Math.min(1, Math.max(0, sun.y / (window.innerHeight * 0.85))) : 0;

  return (
    <>
      <button
        ref={ref}
        type="button"
        className="menu-item grid w-9 touch-none place-items-center px-0"
        aria-label={`${label} (${modeKeys})`}
        title={t(ui.menu.logoHint)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          drag.current = null;
          setSun(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            const r = ref.current?.getBoundingClientRect();
            switchTheme(store, undefined, r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : undefined);
          }
        }}
      >
        <Icon name="moon" size={17} className={theme === "daylight" ? "rotate-180" : ""} />
      </button>
      {sun ? (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200]">
          <div
            className="absolute inset-0 transition-colors duration-100"
            style={{
              background: `linear-gradient(to bottom, rgba(255,214,140,${0.28 * (1 - progress)}), rgba(7,8,10,${0.62 * progress}))`,
            }}
          />
          <motion.div
            className="absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: sun.x,
              top: sun.y,
              background: `radial-gradient(circle, ${progress > 0.5 ? "#edeef0" : "#ffd27a"} 0 45%, transparent 46%)`,
              boxShadow: `0 0 80px 30px ${progress > 0.5 ? "rgba(139,92,255,.35)" : "rgba(255,200,90,.45)"}`,
            }}
          />
          <div className="absolute inset-x-0 border-t border-dashed border-white/30" style={{ top: "50%" }} />
        </div>
      ) : null}
    </>
  );
}
