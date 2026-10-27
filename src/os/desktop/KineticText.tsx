"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks";

const GLYPHS = "▓▒░/\\|<>_-=+*#01ETX";

/** M·01 Texto cinético: cada letra se descifra en orden; hover vuelve a mezclar. */
export function KineticText({ text, className = "", start = true }: { text: string; className?: string; start?: boolean }) {
  const reduced = usePrefersReducedMotion();
  // null = show the real text (SSR, reduced motion, animation finished).
  const [scrambled, setScrambled] = useState<string | null>(null);
  const raf = useRef(0);

  const run = (from = 0) => {
    cancelAnimationFrame(raf.current);
    if (reduced) return;
    const t0 = performance.now();
    const chars = [...text];
    const step = (now: number) => {
      const elapsed = now - t0;
      let done = true;
      const next = chars
        .map((ch, i) => {
          if (ch === " " || i < from) return ch;
          if (elapsed >= (i - from) * 18 + 260) return ch;
          done = false;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");
      setScrambled(done ? null : next);
      if (!done) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    if (start) run();
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, start, reduced]);

  return (
    <span className={className} aria-label={text} onPointerEnter={() => run(Math.floor(text.length * 0.35))}>
      <span aria-hidden="true">{scrambled ?? text}</span>
    </span>
  );
}
