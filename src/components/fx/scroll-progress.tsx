"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";

/** Top scroll-progress bar. Uses Motion's useScroll (no scroll listener). */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });
  const scaleX = reduce ? scrollYProgress : smooth;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        scaleX,
        transformOrigin: "0% 50%",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 60,
        background: "linear-gradient(90deg, var(--accent), var(--accent2))",
        boxShadow: "0 0 12px var(--accent)",
      }}
    />
  );
}
