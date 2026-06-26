"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a,button,input,textarea,select,label,[role='button'],[data-cursor]";
const RING = 34; // base ring diameter
const HOVER_SCALE = 1.55;

/**
 * Ring + dot cursor that eases toward the pointer and grows over interactive
 * elements. Only mounts on fine pointers with motion enabled; otherwise the
 * native cursor is left untouched (see globals.css .et-cursor-none gating).
 *
 * Perf: the rAF loop only writes `translate` on the wrapper; the hover growth is
 * a CSS-transitioned `scale` on the inner ring (transform/opacity only).
 */
export function CustomCursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const wrap = wrapRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!wrap || !ring || !dot) return;

    document.documentElement.classList.add("et-cursor-none");

    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;
    const half = RING / 2;

    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx - 2.5}px, ${my - 2.5}px)`;
    };

    const over = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const hit = target?.closest?.(INTERACTIVE);
      if (hit) {
        ring.style.transform = `scale(${HOVER_SCALE})`;
        ring.style.background = "var(--accent)";
        ring.style.opacity = "0.18";
      } else {
        ring.style.transform = "scale(1)";
        ring.style.background = "transparent";
        ring.style.opacity = "1";
      }
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      wrap.style.transform = `translate(${rx - half}px, ${ry - half}px)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.classList.remove("et-cursor-none");
    };
  }, []);

  const fixedBase: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    pointerEvents: "none",
    zIndex: 9999,
    transform: "translate(-100px, -100px)",
  };

  return (
    <>
      <div ref={wrapRef} aria-hidden="true" style={{ ...fixedBase, width: RING, height: RING }}>
        <div
          ref={ringRef}
          style={{
            width: "100%",
            height: "100%",
            border: "1.5px solid var(--accent)",
            borderRadius: "50%",
            transformOrigin: "center",
            transition: "transform .2s, background .2s, opacity .2s",
            mixBlendMode: "difference",
          }}
        />
      </div>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{ ...fixedBase, width: 5, height: 5, background: "var(--accent)", borderRadius: "50%" }}
      />
    </>
  );
}
