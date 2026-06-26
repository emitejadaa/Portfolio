"use client";

import { useEffect, useRef } from "react";

type Pt = { x: number; y: number; vx: number; vy: number };

/**
 * Interactive particle network drawn on a fixed full-viewport canvas.
 * Particles drift, link to nearby neighbours, and are gently pulled toward the
 * cursor. Theme is read from the .dark class each frame so it tracks toggles.
 * Skipped entirely under reduced motion; paused when the tab is hidden.
 */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (reduce || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let pts: Pt[] = [];
    let W = 0;
    let H = 0;
    let raf = 0;
    let running = true;
    const mouse = { x: -1000, y: -1000, has: false };
    const MR = 180;

    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(70, Math.floor((W * H) / 18000));
      pts = [];
      for (let i = 0; i < n; i++) {
        pts.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
        });
      }
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.has = true;
    };
    const onLeave = () => {
      mouse.has = false;
    };

    const draw = () => {
      if (!running) return;
      const light = !document.documentElement.classList.contains("dark");
      const base = light ? "30,70,140" : "120,170,255";
      const accent = light ? "31,107,255" : "98,180,255";
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        let near = 0;
        if (mouse.has) {
          const ax = mouse.x - p.x;
          const ay = mouse.y - p.y;
          const ad = Math.hypot(ax, ay) || 1;
          if (ad < MR) {
            near = 1 - ad / MR;
            const f = near * 0.035;
            p.vx += (ax / ad) * f;
            p.vy += (ay / ad) * f;
          }
        }
        p.vx *= 0.992;
        p.vy *= 0.992;
        const sp = Math.hypot(p.vx, p.vy);
        if (sp < 0.18) {
          const a = Math.random() * 6.283;
          p.vx += Math.cos(a) * 0.04;
          p.vy += Math.sin(a) * 0.04;
        }
        if (sp > 1.1) {
          p.vx *= 1.1 / sp;
          p.vy *= 1.1 / sp;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        p.x = Math.max(0, Math.min(W, p.x));
        p.y = Math.max(0, Math.min(H, p.y));

        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d = Math.hypot(dx, dy);
          if (d < 130) {
            ctx.strokeStyle = `rgba(${base},${(1 - d / 130) * (light ? 0.18 : 0.16)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }

        if (near > 0.02) {
          ctx.strokeStyle = `rgba(${accent},${near * 0.45})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
          ctx.fillStyle = `rgba(${accent},${0.55 + near * 0.4})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5 + near * 1.6, 0, 6.283);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(${base},${light ? 0.5 : 0.55})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5, 0, 6.283);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        draw();
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    draw();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
