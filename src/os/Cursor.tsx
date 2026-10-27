"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useMediaQuery, usePrefersReducedMotion } from "./hooks";

/** M·02 Cursor + magnetismo: un halo que sigue al puntero y crece sobre lo accionable. */
export function Cursor() {
  const reduced = usePrefersReducedMotion();
  const fine = useMediaQuery("(pointer: fine)");
  const enabled = fine && !reduced;
  const [state, setState] = useState<"idle" | "action" | "text" | "hidden">("hidden");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 900, damping: 60, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 900, damping: 60, mass: 0.4 });

  useEffect(() => {
    if (!enabled) return;
    let magnet: HTMLElement | null = null;
    const release = () => {
      if (magnet) magnet.style.transform = "";
      magnet = null;
    };
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      if (!el?.closest) return;
      if (el.closest("input, textarea, [contenteditable=true], .terminal")) setState("text");
      else if (el.closest("a, button, [role=button], [role=option], [role=tab], summary")) setState("action");
      else setState("idle");

      const m = el.closest<HTMLElement>("[data-magnetic]");
      if (m !== magnet) release();
      if (m) {
        magnet = m;
        const r = m.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.18;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.18;
        m.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      }
    };
    const onLeave = () => {
      setState("hidden");
      release();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      release();
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  const size = state === "action" ? 44 : state === "text" ? 6 : 26;
  return (
    <motion.div
      aria-hidden="true"
      className="cursor-halo pointer-events-none fixed top-0 left-0 z-[500] rounded-full"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{ width: size, height: size, opacity: state === "hidden" ? 0 : state === "text" ? 0 : 1 }}
      transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
    />
  );
}
