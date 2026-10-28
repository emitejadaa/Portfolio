"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ui } from "@/content/ui";
import { AppIcon, appIconProps } from "../AppIcon";
import { appOf, winIcon, winName, type SingletonApp } from "../apps";
import { registerLaunchRect, setLocalFlag, useLocalFlag } from "../hooks";
import { useReducedMotion } from "../prefs";
import { useLocale, useT } from "../i18n";
import { useOS, useOSStore, type Win } from "../store";

export const DOCK_APPS: SingletonApp[] = ["projects", "about", "lab", "terminal", "contact"];

const BASE = 60;
const PEAK = 84;

export function Dock() {
  const mouseX = useMotionValue(Infinity);
  const windows = useOS((s) => s.windows);
  const minimized = windows.filter((w) => w.minimized);
  const reduced = useReducedMotion();
  const contactSeen = useLocalFlag("tejada.contactSeen");
  const contactOpen = windows.some((w) => w.key === "contact");

  useEffect(() => {
    if (contactOpen) setLocalFlag("tejada.contactSeen");
  }, [contactOpen]);

  return (
    <nav aria-label="Dock" className="pointer-events-none fixed inset-x-0 bottom-3 z-[60] flex justify-center">
      <div
        className="dock-shell pointer-events-auto flex h-[80px] items-end gap-2.5 px-2.5 pb-[9px]"
        onMouseMove={(e) => !reduced && mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {DOCK_APPS.map((app) => (
          <DockItem
            key={app}
            app={app}
            mouseX={mouseX}
            running={windows.some((w) => appOf(w.key) === app || (app === "projects" && appOf(w.key) === "project"))}
            badge={app === "contact" && !contactSeen ? "1" : undefined}
          />
        ))}
        {minimized.length > 0 ? <span aria-hidden="true" className="mx-0.5 mb-1 h-12 w-px self-end bg-line daylight:bg-[var(--tinta)]" /> : null}
        <AnimatePresence initial={false}>
          {minimized.map((w) => (
            <DockMinimized key={w.key} win={w} mouseX={mouseX} />
          ))}
        </AnimatePresence>
      </div>
    </nav>
  );
}

function useMagnify(mouseX: MotionValue<number>, ref: React.RefObject<HTMLElement | null>) {
  // The icon's resting center, measured once per visit: reading layout on every move while the icons
  // resize would force a layout per frame.
  const center = useRef<number | null>(null);
  const distance = useTransform(mouseX, (v) => {
    if (!Number.isFinite(v)) {
      center.current = null;
      return Infinity;
    }
    if (center.current === null) {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return Infinity;
      center.current = r.left + r.width / 2;
    }
    return v - center.current;
  });
  // M·04 Dock + hover: 60 → 70 vecinos → 84 bajo el cursor
  const target = useTransform(distance, [-150, -75, 0, 75, 150], [BASE, BASE + 10, PEAK, BASE + 10, BASE]);
  return useSpring(target, { mass: 0.1, stiffness: 170, damping: 14 });
}

function DockItem({
  app,
  mouseX,
  running,
  badge,
}: {
  app: SingletonApp;
  mouseX: MotionValue<number>;
  running: boolean;
  badge?: string;
}) {
  const store = useOSStore();
  const t = useT();
  const ref = useRef<HTMLButtonElement>(null);
  const size = useMagnify(mouseX, ref);
  const [hover, setHover] = useState(false);
  const label = t(ui.apps[app]);

  useEffect(() => {
    const el = ref.current;
    const update = () => registerLaunchRect(app, el);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [app]);

  const onClick = () => {
    registerLaunchRect(app, ref.current);
    const s = store.getState();
    const r = ref.current?.getBoundingClientRect();
    const origin = r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : undefined;
    if (app === "projects") {
      // Restore a minimized project before opening the folder.
      const minimizedProject = s.windows.find((w) => appOf(w.key) === "project" && w.minimized);
      if (minimizedProject && !s.windows.some((w) => w.key === "projects")) {
        s.focusWindow(minimizedProject.key);
        return;
      }
    }
    s.openWindow(app, { origin });
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      aria-label={label}
      className="relative flex flex-col items-center outline-none"
      style={{ width: size, height: size }}
      onClick={onClick}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      whileTap={{ scale: 0.9 }}
    >
      <AppIcon {...appIconProps[app]!} badge={badge} className="h-full w-full" />
      <AnimatePresence>
        {hover ? (
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4, transition: { duration: 0.12 } }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="dock-tooltip pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 rounded-lg px-3 py-1.5 text-[13px] whitespace-nowrap"
          >
            {label}
          </motion.span>
        ) : null}
      </AnimatePresence>
      <span
        aria-hidden="true"
        className={`absolute -bottom-[7px] h-[5px] w-[5px] rounded-full bg-text transition-opacity duration-200 ${running ? "opacity-100" : "opacity-0"}`}
      />
    </motion.button>
  );
}

function DockMinimized({ win, mouseX }: { win: Win; mouseX: MotionValue<number> }) {
  const store = useOSStore();
  const locale = useLocale();
  const ref = useRef<HTMLButtonElement>(null);
  const size = useMagnify(mouseX, ref);
  const [hover, setHover] = useState(false);
  const name = winName(win.key, locale);

  useEffect(() => registerLaunchRect(`min:${win.key}`, ref.current), [win.key]);

  return (
    <motion.button
      ref={ref}
      type="button"
      aria-label={name}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.4 }}
      className="relative"
      style={{ width: size, height: size }}
      onClick={() => store.getState().focusWindow(win.key)}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <AppIcon icon={winIcon(win.key)} className="h-full w-full opacity-90" />
      <span className="pointer-events-none absolute inset-x-1 bottom-1.5 truncate text-center font-mono text-[9px] text-text-2 daylight:text-[var(--tinta)]">
        {name}
      </span>
      {hover ? (
        <span className="dock-tooltip pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 rounded-lg px-3 py-1.5 text-[13px] whitespace-nowrap">
          {name}
        </span>
      ) : null}
    </motion.button>
  );
}
