"use client";

import { AnimatePresence, motion, useDragControls } from "motion/react";
import { availability, contact, identity } from "@/content/profile";
import { ui } from "@/content/ui";
import { AppContent } from "../apps/AppContent";
import { AppIcon, appIconProps } from "../AppIcon";
import { winName, winTitle, type SingletonApp } from "../apps";
import { GitHubWidget, ModeWidget, WeatherWidget } from "../desktop/Widgets";
import { Wallpaper } from "../desktop/Wallpaper";
import { ClockText } from "../hooks";
import { Icon } from "../icons";
import { useLocale, useT } from "../i18n";
import { useOS, useOSStore, type Win } from "../store";

const GRID: (SingletonApp | "github" | "linkedin")[] = ["terminal", "readme", "github", "linkedin"];
const DOCK: SingletonApp[] = ["projects", "about", "lab", "contact"];

/** L·04 Mobile: home screen tipo iOS; mismas apps, sin ventanas flotantes. */
export function MobileShell({ className = "" }: { className?: string }) {
  const store = useOSStore();
  const t = useT();
  const windows = useOS((s) => s.windows);
  const focused = useOS((s) => s.focused);
  const top = windows.find((w) => w.key === focused && !w.minimized);

  const open = (app: SingletonApp) => store.getState().openWindow(app);

  return (
    <div className={`mobile fixed inset-0 overflow-hidden ${className}`}>
      <Wallpaper />
      <div className="scroll-area absolute inset-0 pb-[176px]">
        {/* Status bar */}
        <div className="sticky top-0 z-10 flex h-11 items-center justify-between px-6 pt-[env(safe-area-inset-top)] text-[14px] font-semibold">
          <ClockText className="t-dot text-[15px]" />
          <span className="flex items-center gap-3 font-mono text-[12px] font-normal text-text-2">
            ◐ {identity.systemName}
            <button
              type="button"
              aria-label={t(ui.apps.prefs)}
              onClick={() => open("prefs")}
              className="-mr-2 grid h-9 w-9 place-items-center text-text"
            >
              <Icon name="sliders" size={19} />
            </button>
          </span>
        </div>

        <div className="mobile-home flex flex-col gap-5 px-5 pt-3">
          <section aria-label={t(ui.desktop.hero)}>
            <p className="t-label text-text-2">{t(identity.focus)}</p>
            <h1 className="mt-2 text-[44px] leading-[0.98] font-semibold tracking-[-0.05em]">
              {identity.name}
              <span aria-hidden="true" className="ml-[0.04em] inline-block h-[0.2em] w-[0.2em] bg-accent" />
            </h1>
            <p className="mt-3 text-[20px] leading-[1.2] font-medium tracking-[-0.01em]">
              {t(identity.headline)}
            </p>
            <p className="mt-2 text-[15px] leading-[1.5] text-text-2">{t(identity.subhead)}</p>
          </section>

          {/* widget · hora + estado */}
          <button type="button" className="card flex items-center justify-between gap-4 p-4 text-left" onClick={() => open("contact")}>
            <span>
              <span className="t-label text-text-2">
                {identity.city} · {identity.utcLabel}
              </span>
              <ClockText className="t-dot block text-[48px] leading-none" />
            </span>
            <span className="max-w-[48%] text-right text-[13px] leading-snug">
              <span className="mb-1 inline-flex items-center gap-1.5 font-medium">
                <span className="h-[7px] w-[7px] rounded-full bg-accent" /> {t(availability.short)}
              </span>
              <span className="block text-text-2">
                {t(availability.lines[0]!)} · {t(availability.lines[2]!)}
              </span>
            </span>
          </button>

          <nav aria-label="Apps" className="grid grid-cols-4 gap-x-3 gap-y-4">
            {GRID.map((item) => {
              if (item === "github" || item === "linkedin") {
                const href = item === "github" ? contact.github.url : contact.linkedin.url;
                return (
                  <a key={item} href={href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5">
                    <AppIcon icon={item} size={60} />
                    <span className="text-[12px]">{item === "github" ? "GitHub" : "LinkedIn"}</span>
                  </a>
                );
              }
              return (
                <button key={item} type="button" onClick={() => open(item)} className="flex flex-col items-center gap-1.5">
                  <AppIcon {...appIconProps[item]!} size={60} />
                  <span className="text-[12px]">{t(ui.apps[item])}</span>
                </button>
              );
            })}
          </nav>

          <div className="grid grid-cols-2 gap-3">
            <WeatherWidget />
            <ModeWidget />
          </div>
          <GitHubWidget />
        </div>
      </div>

      {/* Buscar + dock */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex flex-col items-center gap-2.5 px-4 pb-[max(14px,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={() => store.getState().openSpotlight()}
          className="popover pointer-events-auto flex h-8 items-center gap-1.5 rounded-full px-4 text-[13px] daylight:rounded-none"
        >
          <Icon name="search" size={14} /> {t(ui.mobile.search)}
        </button>
        <nav aria-label="Dock" className="dock-shell pointer-events-auto flex w-full max-w-[420px] justify-around px-3 py-3">
          {DOCK.map((app) => (
            <button key={app} type="button" aria-label={t(ui.apps[app])} onClick={() => open(app)}>
              <AppIcon {...appIconProps[app]!} size={58} />
            </button>
          ))}
        </nav>
      </div>

      <AnimatePresence>{top ? <Sheet key={top.key} win={top} /> : null}</AnimatePresence>
    </div>
  );
}

/** App = hoja a pantalla completa; se cierra deslizando hacia abajo. */
function Sheet({ win }: { win: Win }) {
  const store = useOSStore();
  const locale = useLocale();
  const t = useT();
  const controls = useDragControls();
  const close = () => store.getState().closeWindow(win.key);

  return (
    <motion.section
      role="dialog"
      aria-label={winName(win.key, locale)}
      className="sheet fixed inset-x-0 top-[max(10px,env(safe-area-inset-top))] bottom-0 z-[90] flex flex-col overflow-hidden rounded-t-[22px] border border-b-0 border-line bg-[var(--window)] backdrop-blur-[40px] daylight:rounded-t-[14px] daylight:border-[var(--tinta)] daylight:bg-[var(--blanco-roto)]"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%", transition: { duration: 0.28, ease: [0.4, 0, 1, 1] } }}
      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
      drag="y"
      dragControls={controls}
      dragListener={false}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.9 }}
      onDragEnd={(_, info) => {
        if (info.offset.y > 120 || info.velocity.y > 600) close();
      }}
    >
      <header className="flex shrink-0 touch-none flex-col items-center gap-2 border-b border-line pt-2 pb-2.5 daylight:border-[var(--tinta)]" onPointerDown={(e) => controls.start(e)}>
        <span className="h-[5px] w-12 rounded-full bg-text-2/50" aria-hidden="true" />
        <div className="flex w-full items-center justify-between px-4">
          <span className="font-mono text-[12px] text-text-2">{winTitle(win.key)}</span>
          <button type="button" onClick={close} className="text-[14px] font-medium text-accent daylight:text-[var(--klein)]">
            {t(ui.mobile.close)}
          </button>
        </div>
      </header>
      <div className="sheet-body relative min-h-0 flex-1">
        <AppContent win={win} />
      </div>
    </motion.section>
  );
}
