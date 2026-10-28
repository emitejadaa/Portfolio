"use client";

import { animate, motion, useDragControls, useMotionValue, type PanInfo } from "motion/react";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { ui } from "@/content/ui";
import { winTitle } from "../apps";
import { centerOf, launchCenter } from "../hooks";
import { useReducedMotion } from "../prefs";
import { useT } from "../i18n";
import { DOCK_H, MENU_H, placeWindow, useOS, useOSStore, type Rect, type Win } from "../store";

const SPRING = { type: "spring", bounce: 0.2, duration: 0.48 } as const;
const EXIT = { duration: 0.24, ease: [0.4, 0, 1, 1] } as const;

type Props = {
  win: Win;
  children: ReactNode;
  constraintsRef: RefObject<HTMLDivElement | null>;
  /** Dock icon id this window minimizes into. */
  dockId: string;
};

export function Window({ win, children, constraintsRef, dockId }: Props) {
  const store = useOSStore();
  const focused = useOS((s) => s.focused === win.key);
  const t = useT();
  const reduced = useReducedMotion();
  const titleId = useId();
  const controls = useDragControls();
  const ref = useRef<HTMLElement>(null);

  const x = useMotionValue(win.rect.x);
  const y = useMotionValue(win.rect.y);
  const width = useMotionValue(win.rect.w);
  const height = useMotionValue(win.rect.h);
  const restoreRect = useRef<Rect | null>(null);

  const [origin, setOrigin] = useState(() =>
    win.origin ? `${win.origin.x - win.rect.x}px ${win.origin.y - win.rect.y}px` : "50% 50%",
  );

  // Server render assumes 1440 × 900: fit the window to the real viewport before paint.
  useLayoutEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const r = { x: x.get(), y: y.get(), w: width.get(), h: height.get() };
    if (r.w > vw - 16 || r.h > vh - MENU_H - DOCK_H || r.x + r.w > vw - 8 || r.y + r.h > vh - 24) {
      const next = placeWindow(win.key, 0, { w: vw, h: vh });
      x.set(next.x);
      y.set(next.y);
      width.set(next.w);
      height.set(next.h);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animateRect = useCallback(
    (r: Rect) => {
      const opts = reduced ? { duration: 0 } : SPRING;
      animate(x, r.x, opts);
      animate(y, r.y, opts);
      animate(width, r.w, opts);
      animate(height, r.h, opts);
    },
    [x, y, width, height, reduced],
  );

  useEffect(() => {
    if (win.maximized) {
      restoreRect.current = { x: x.get(), y: y.get(), w: width.get(), h: height.get() };
      animateRect({ x: 8, y: MENU_H + 8, w: window.innerWidth - 16, h: window.innerHeight - MENU_H - DOCK_H - 4 });
    } else if (restoreRect.current) {
      animateRect(restoreRect.current);
      restoreRect.current = null;
    }
  }, [win.maximized, animateRect, x, y, width, height]);

  // Minimize: shrink toward the dock icon (and grow back out of it).
  const [minimizeOrigin, setMinimizeOrigin] = useState<string | null>(null);
  const [prevMinimized, setPrevMinimized] = useState(win.minimized);
  if (prevMinimized !== win.minimized) {
    setPrevMinimized(win.minimized);
    if (win.minimized) {
      const target = launchCenter(dockId) ?? { x: 720, y: 860 };
      setMinimizeOrigin(`${target.x - x.get()}px ${target.y - y.get()}px`);
    }
  }

  const startDrag = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    if (win.maximized) return;
    controls.start(e);
  };

  const onResizeDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const start = { px: e.clientX, py: e.clientY, w: width.get(), h: height.get() };
    const [minW, minH] = [380, 280];
    const move = (ev: PointerEvent) => {
      const maxW = window.innerWidth - x.get() - 8;
      const maxH = window.innerHeight - y.get() - 8;
      width.set(Math.max(minW, Math.min(maxW, start.w + ev.clientX - start.px)));
      height.set(Math.max(minH, Math.min(maxH, start.h + ev.clientY - start.py)));
    };
    const up = () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    // Keep the title bar reachable after an inertial throw.
    void info;
    const maxY = window.innerHeight - 64;
    if (y.get() > maxY) animate(y, maxY, SPRING);
    if (y.get() < MENU_H) animate(y, MENU_H + 4, SPRING);
  };

  const close = () => store.getState().closeWindow(win.key);
  const minimize = () => store.getState().minimizeWindow(win.key);
  const maximize = () => store.getState().toggleMaximize(win.key);

  const hidden = win.minimized;

  return (
    <motion.section
      ref={ref}
      role="dialog"
      aria-labelledby={titleId}
      aria-hidden={hidden || undefined}
      data-focused={focused ? "1" : "0"}
      data-window={win.key}
      className="os-window pointer-events-auto absolute top-0 left-0 flex flex-col"
      style={{ x, y, width, height, zIndex: win.z, transformOrigin: win.minimized && minimizeOrigin ? minimizeOrigin : origin }}
      drag={!win.maximized}
      dragControls={controls}
      dragListener={false}
      dragMomentum
      dragTransition={{ power: 0.18, timeConstant: 220 }}
      dragElastic={0.04}
      dragConstraints={constraintsRef}
      onDragEnd={onDragEnd}
      onPointerDownCapture={() => store.getState().focusWindow(win.key)}
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: win.origin ? 0.3 : 0.94 }}
      animate={
        hidden
          ? { opacity: 0, scale: 0.08, transition: reduced ? { duration: 0.12 } : { duration: 0.42, ease: [0.16, 1, 0.3, 1] } }
          : { opacity: 1, scale: 1, transition: reduced ? { duration: 0.12 } : SPRING }
      }
      exit={reduced ? { opacity: 0, transition: { duration: 0.12 } } : { opacity: 0, scale: 0.95, transition: EXIT }}
      onAnimationComplete={() => {
        if (!hidden && origin !== "50% 50%") setOrigin("50% 50%");
      }}
      inert={hidden || undefined}
    >
      <div
        className="titlebar relative flex shrink-0 touch-none items-center select-none"
        onPointerDown={startDrag}
        onDoubleClick={(e) => {
          if (!(e.target as HTMLElement).closest("button")) maximize();
        }}
      >
        {/* Midnight: semáforo a la izquierda · Daylight: caja de cierre a la izquierda, zoom a la derecha */}
        <div className="tl-group flex items-center gap-2 pl-[18px] daylight:pl-[14px]">
          <button type="button" className="tl-btn tl-close" aria-label={t(ui.window.close)} onClick={close}>
            <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3.5 3.5l5 5M8.5 3.5l-5 5" /></svg>
          </button>
          <button type="button" className="tl-btn tl-min daylight:hidden" aria-label={t(ui.window.minimize)} onClick={minimize}>
            <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 6h6" /></svg>
          </button>
          <button type="button" className="tl-btn tl-max daylight:hidden" aria-label={win.maximized ? t(ui.window.restore) : t(ui.window.maximize)} onClick={maximize}>
            <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 3v6M3 6h6" /></svg>
          </button>
        </div>

        <div className="tl-stripes pointer-events-none absolute inset-y-[9px] right-[70px] left-10 hidden daylight:block" />

        <h2
          id={titleId}
          className="tl-title pointer-events-none absolute inset-x-0 mx-auto w-max max-w-[60%] truncate px-3 text-center font-mono text-[13px] tracking-[0.02em]"
        >
          {winTitle(win.key)}
        </h2>

        <div className="ml-auto flex items-center gap-2 pr-[14px]">
          <button type="button" className="tl-btn tl-min hidden daylight:grid" aria-label={t(ui.window.minimize)} onClick={minimize}>
            <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6h7" /></svg>
          </button>
          <button type="button" className="tl-btn tl-max hidden daylight:grid" aria-label={win.maximized ? t(ui.window.restore) : t(ui.window.maximize)} onClick={maximize}>
            <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 3h6v6H3z" /></svg>
          </button>
          <span className="kbd tl-esc daylight:hidden" aria-hidden="true">
            esc
          </span>
        </div>
      </div>

      <div className="os-window-body relative min-h-0 flex-1">{children}</div>

      {!win.maximized && (
        <div
          role="separator"
          aria-label={t(ui.window.resize)}
          className="absolute right-1 bottom-1 z-10 h-4 w-4 cursor-nwse-resize touch-none text-text-2 opacity-60 hover:opacity-100"
          onPointerDown={onResizeDown}
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true" stroke="currentColor" strokeWidth="1.2" fill="none">
            <path d="M14 6 6 14M14 10l-4 4" />
          </svg>
        </div>
      )}
    </motion.section>
  );
}

export function dockIdFor(key: string) {
  return key.startsWith("project:") ? "projects" : key;
}

export { centerOf };
