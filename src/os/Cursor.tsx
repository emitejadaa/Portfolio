"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "./hooks";
import { usePrefs, useReducedMotion } from "./prefs";

/**
 * M·02 Cursor + magnetismo: un halo que sigue al puntero y crece sobre lo accionable.
 * No React state per move: pointer events only record the target, one rAF loop eases the halo
 * toward it and stops as soon as it arrives. Size and fade are CSS transitions on an inner element.
 */
export function Cursor() {
  const reduced = useReducedMotion();
  const { cursor } = usePrefs();
  const fine = useMediaQuery("(pointer: fine)");
  const enabled = fine && !reduced && cursor;
  const haloRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const halo = haloRef.current;
    if (!enabled || !halo) return;
    const pos = { x: -100, y: -100 };
    const target = { x: -100, y: -100 };
    let raf = 0;
    let lastEl: Element | null = null;
    let magnet: { el: HTMLElement; cx: number; cy: number } | null = null;

    const release = () => {
      if (magnet) magnet.el.style.transform = "";
      magnet = null;
    };
    const step = () => {
      pos.x += (target.x - pos.x) * 0.38;
      pos.y += (target.y - pos.y) * 0.38;
      if (Math.abs(target.x - pos.x) < 0.3 && Math.abs(target.y - pos.y) < 0.3) {
        pos.x = target.x;
        pos.y = target.y;
        raf = 0;
      } else raf = requestAnimationFrame(step);
      halo.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    };
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!raf) raf = requestAnimationFrame(step);

      const el = e.target as Element | null;
      if (el !== lastEl) {
        lastEl = el;
        const state = !el?.closest
          ? "idle"
          : el.closest("input, textarea, [contenteditable=true], .terminal")
            ? "text"
            : el.closest("a, button, [role=button], [role=option], [role=tab], [role=switch], summary")
              ? "action"
              : "idle";
        halo.dataset.state = state;
        const m = el?.closest?.<HTMLElement>("[data-magnetic]") ?? null;
        if (m !== magnet?.el) {
          release();
          if (m) {
            const r = m.getBoundingClientRect();
            magnet = { el: m, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
          }
        }
      }
      if (magnet) {
        const dx = (e.clientX - magnet.cx) * 0.18;
        const dy = (e.clientY - magnet.cy) * 0.18;
        magnet.el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      }
    };
    const onLeave = () => {
      halo.dataset.state = "hidden";
      lastEl = null;
      release();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      release();
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={haloRef} aria-hidden="true" data-state="hidden" className="cursor pointer-events-none fixed top-0 left-0 z-[500]">
      <div className="cursor-halo" />
    </div>
  );
}
