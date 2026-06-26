"use client";

import { useEffect, useRef } from "react";

const LABELS = [
  "IA", "Arduino", "Python", "NestJS", "C++", "TensorFlow",
  "SQL", "Linux", "Flask", "Raspberry", "Git", "Astro",
];
const N = 46;

type Node = { x: number; y: number; z: number; label: string | null; pulse: number };

/**
 * Hero "neural network" orb: a Fibonacci sphere of nodes (some carrying stack
 * labels) projected to 2D canvas. Auto-spins, eases toward the pointer on hover.
 * Under reduced motion it renders a single static frame.
 */
export function TechOrb() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const target = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const nodes: Node[] = [];
    for (let i = 0; i < N; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / N);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      nodes.push({
        x: Math.sin(phi) * Math.cos(theta),
        y: Math.sin(phi) * Math.sin(theta),
        z: Math.cos(phi),
        label: i % 4 === 0 ? LABELS[(i / 4) % LABELS.length] : null,
        pulse: Math.random() * 6.283,
      });
    }

    const edges: [number, number][] = [];
    for (let i = 0; i < N; i++) {
      const ds: [number, number][] = [];
      for (let j = 0; j < N; j++) {
        if (i === j) continue;
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dz = nodes[i].z - nodes[j].z;
        ds.push([j, dx * dx + dy * dy + dz * dz]);
      }
      ds.sort((a, b) => a[1] - b[1]);
      for (let k = 0; k < 3; k++) {
        const j = ds[k][0];
        if (i < j) edges.push([i, j]);
      }
    }

    let W = 0;
    let H = 0;
    let R = 0;
    let rx = -0.3;
    let ry = 0;
    let t = 0;
    let raf = 0;
    const vy = 0.0026;

    const sync = () => {
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (!cw || !ch) return false;
      if (cw !== W || ch !== H) {
        W = cw;
        H = ch;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        R = Math.min(W, H) * 0.36;
      }
      return true;
    };

    const render = () => {
      if (!sync()) return;
      const tg = target.current;
      if (!reduce) {
        const tgY = tg.active ? tg.x * 1.6 : ry + vy;
        const tgX = tg.active ? tg.y * 1.2 : -0.3;
        ry += (tgY - ry) * (tg.active ? 0.08 : 1);
        if (!tg.active) ry += vy;
        rx += (tgX - rx) * 0.06;
        t += 0.016;
      } else {
        rx = -0.32;
        ry = 0.6;
      }

      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const light = !document.documentElement.classList.contains("dark");
      const accent = light ? "31,107,255" : "98,180,255";
      const baseC = light ? "40,80,150" : "150,190,255";
      const cx = W / 2;
      const cy = H / 2;
      const persp = 2.4;

      const P = nodes.map((n) => {
        const y1 = n.y * cosX - n.z * sinX;
        const z1 = n.y * sinX + n.z * cosX;
        const x2 = n.x * cosY + z1 * sinY;
        const z2 = -n.x * sinY + z1 * cosY;
        const scale = persp / (persp - z2);
        return { sx: cx + x2 * R * scale, sy: cy + y1 * R * scale, z: z2, scale, node: n };
      });

      ctx.clearRect(0, 0, W, H);

      for (const [i, j] of edges) {
        const a = P[i];
        const b = P[j];
        const depth = (a.z + b.z) / 2;
        const op = 0.5 + depth * 0.5;
        ctx.strokeStyle = `rgba(${baseC},${(light ? 0.16 : 0.18) * op})`;
        ctx.lineWidth = 0.6 + Math.max(0, depth) * 0.7;
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.stroke();
      }

      const order = P.map((_, i) => i).sort((a, b) => P[a].z - P[b].z);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const i of order) {
        const p = P[i];
        const depth = (p.z + 1) / 2;
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.6 + p.node.pulse);
        const r = (p.node.label ? 3.1 : 1.8) * p.scale * (0.55 + depth * 0.6);
        if (p.node.label) {
          ctx.fillStyle = `rgba(${accent},${0.25 + depth * 0.5})`;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, r + 3 + pulse * 2, 0, 6.283);
          ctx.fill();
        }
        ctx.fillStyle = p.node.label
          ? `rgba(${accent},${0.6 + depth * 0.4})`
          : `rgba(${baseC},${0.35 + depth * 0.5})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r, 0, 6.283);
        ctx.fill();
        if (p.node.label && depth > 0.42) {
          ctx.font = `${Math.round(10.5 * (0.7 + depth * 0.5))}px var(--font-jetbrains-mono, 'JetBrains Mono'), monospace`;
          ctx.fillStyle = `rgba(${light ? "13,22,38" : "233,238,247"},${(depth - 0.3) * 1.2})`;
          ctx.fillText(p.node.label, p.sx, p.sy - r - 8);
        }
      }
    };

    const loop = () => {
      render();
      raf = requestAnimationFrame(loop);
    };

    if (reduce) {
      // draw one static frame after layout settles
      requestAnimationFrame(render);
    } else {
      loop();
    }

    const onResize = () => render();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const onPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    target.current = {
      x: (e.clientX - r.left) / r.width - 0.5,
      y: (e.clientY - r.top) / r.height - 0.5,
      active: true,
    };
  };
  const onLeave = () => {
    target.current.active = false;
  };

  return (
    <div
      ref={wrapRef}
      data-cursor=""
      onPointerMove={onPointer}
      onPointerLeave={onLeave}
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        aspectRatio: "1 / 1",
        width: "100%",
        maxWidth: 480,
        margin: "0 auto",
        touchAction: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
      <div
        className="font-mono"
        style={{
          position: "absolute",
          bottom: 6,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 10.5,
          letterSpacing: "0.12em",
          color: "var(--muted)",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--accent)",
            boxShadow: "0 0 8px var(--accent)",
          }}
        />
        RED NEURONAL · MOVÉ EL MOUSE
      </div>
    </div>
  );
}
