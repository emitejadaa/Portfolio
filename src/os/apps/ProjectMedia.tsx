"use client";

import Image from "next/image";
import type { Project } from "@/content/types";
import { ui } from "@/content/ui";
import { useLocale, useT } from "../i18n";

/** The visual itself, absolutely positioned: video, screenshot, diagram or a generated piece. */
export function ProjectVisual({ project, priority = false, poster = false }: { project: Project; priority?: boolean; poster?: boolean }) {
  const t = useT();
  const shot = project.media.screenshots[0];
  if (project.media.video && !poster) {
    return (
      <video
        className="absolute inset-0 h-full w-full object-cover object-top"
        src={project.media.video}
        poster={shot}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={project.title}
      />
    );
  }
  if (project.media.diagram === "secure-track") return <SecureTrackDiagram label={t(ui.project.diagram)} />;
  if (project.media.diagram === "neurolinked") return <NeuroVisual />;
  if (shot) {
    return (
      <Image
        src={shot}
        alt={`${project.title}: ${project.summary.es}`}
        fill
        sizes="(max-width: 820px) 100vw, 720px"
        className="object-cover object-top"
        priority={priority}
      />
    );
  }
  if (project.slug === "framelab") return <FramelabVisual />;
  return <div className="halftone absolute inset-0 opacity-20" />;
}

/** Media del proyecto: video en loop, captura, diagrama o una pieza generada cuando no hay capturas. */
export function ProjectMedia({ project, index, className = "" }: { project: Project; index: number; className?: string }) {
  const label = `P—${String(index).padStart(2, "0")}`;
  return (
    <div className={`project-media relative overflow-hidden rounded-[14px] border border-line daylight:border-[var(--tinta)] ${className}`}>
      <ProjectVisual project={project} priority={index <= 2} />
      <span className="absolute top-3 left-3 rounded-[6px] bg-black/55 px-2 py-1 font-mono text-[11px] text-white backdrop-blur daylight:rounded-none daylight:border daylight:border-[var(--tinta)] daylight:bg-[var(--blanco-roto)] daylight:text-[var(--tinta)]">
        {label}
      </span>
    </div>
  );
}

/* EEG traces: deterministic pseudo-signals, drawn twice so the scroll loops seamlessly. */
function eegPath(seed: number, amp: number) {
  const pts: string[] = [];
  for (let x = 0; x <= 1200; x += 6) {
    // Integer harmonics of a 600 px period, so the 600 px scroll loops without a seam.
    const w = (k: number) => (2 * Math.PI * k * x) / 600;
    const y =
      Math.sin(w(4) + seed) * amp * 0.5 +
      Math.sin(w(11) + seed * 2.1) * amp * 0.3 +
      Math.sin(w(2) + seed * 0.7) * amp * 0.45 +
      Math.sin(w(29) + seed * 3.3) * amp * 0.12;
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return `M${pts.join(" L")}`;
}
const CHANNELS = [
  { name: "FC3", seed: 1.3, amp: 16 },
  { name: "C3", seed: 2.9, amp: 22 },
  { name: "Cz", seed: 4.1, amp: 14 },
  { name: "C4", seed: 5.7, amp: 18 },
].map((c) => ({ ...c, d: eegPath(c.seed, c.amp) }));

/** NeuroLinked: 64 canales EEG, ventana de predicción de 0,2 a 2 s, reposo vs. mano izquierda (76,5 %). */
function NeuroVisual() {
  const en = useLocale() === "en";
  return (
    <svg viewBox="0 0 800 300" role="img" aria-label="EEG" className="absolute inset-0 h-full w-full bg-surface-2 daylight:bg-[var(--blanco-roto)]">
      <defs>
        <clipPath id="eeg-clip">
          <rect x="70" y="40" width="470" height="240" />
        </clipPath>
        <pattern id="eeg-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="currentColor" strokeOpacity="0.06" />
        </pattern>
      </defs>
      <rect width="800" height="300" fill="url(#eeg-grid)" className="text-text" />
      <text x="30" y="28" className="fill-[var(--text-2)] font-mono text-[11px] tracking-[0.08em]">
        {en ? "EEG · 64 CHANNELS · PHYSIONET MMI" : "EEG · 64 CANALES · PHYSIONET MMI"}
      </text>
      <rect x="380" y="40" width="120" height="240" className="fill-[var(--accent)]" fillOpacity="0.1" />
      <text x="386" y="272" className="fill-[var(--text-2)] font-mono text-[10px]">
        0,2–2 s
      </text>
      {CHANNELS.map((c, i) => (
        <g key={c.name} transform={`translate(0 ${80 + i * 55})`}>
          <text x="30" y="4" className="fill-[var(--text-2)] font-mono text-[11px]">
            {c.name}
          </text>
          <g clipPath="url(#eeg-clip)" transform={`translate(0 ${-80 - i * 55})`}>
            <g transform={`translate(0 ${80 + i * 55})`}>
              <path d={c.d} className="eeg-trace" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ color: i === 1 ? "var(--accent)" : "var(--text)" }} strokeOpacity={i === 1 ? 1 : 0.7} />
            </g>
          </g>
        </g>
      ))}
      <g transform="translate(580 92)" className="font-mono">
        <text className="fill-[var(--text-2)] text-[11px] tracking-[0.08em]">{en ? "PREDICTION" : "PREDICCIÓN"}</text>
        {[
          { l: en ? "rest" : "reposo", v: 0.24 },
          { l: en ? "left hand" : "mano izq.", v: 0.76 },
        ].map((row, i) => (
          <g key={row.l} transform={`translate(0 ${30 + i * 52})`}>
            <text className="fill-[var(--text)] text-[13px]">{row.l}</text>
            <text x="190" textAnchor="end" className="fill-[var(--text-2)] text-[12px]">
              {Math.round(row.v * 100)}%
            </text>
            <rect y="12" width="190" height="6" rx="3" className="fill-[var(--hover-fill)]" />
            <rect y="12" width={190 * row.v} height="6" rx="3" className={i === 1 ? "fill-[var(--accent)]" : "fill-[var(--text-2)]"} />
          </g>
        ))}
        <text y="150" className="fill-[var(--text-2)] text-[11px]">
          {en ? "test accuracy 76.5%" : "accuracy en test 76,5 %"}
        </text>
      </g>
    </svg>
  );
}

/** Raspberry Pi → cierres → Flask → panel. */
function SecureTrackDiagram({ label }: { label: string }) {
  const en = useLocale() === "en";
  const nodes = [
    { x: 40, title: "Raspberry Pi", sub: "GPIO · Python" },
    { x: 230, title: en ? "Locks" : "Cierres", sub: en ? "electronic" : "electrónicos" },
    { x: 420, title: "Flask", sub: "API · QR" },
    { x: 610, title: en ? "Web panel" : "Panel web", sub: en ? "role-based" : "por rol" },
  ];
  return (
    <svg viewBox="0 0 800 260" role="img" aria-label={label} className="absolute inset-0 h-full w-full bg-surface-2 daylight:bg-[var(--blanco-roto)]">
      <defs>
        <marker id="st-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 10 5 0 10z" fill="currentColor" />
        </marker>
        <pattern id="st-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="currentColor" strokeOpacity="0.07" />
        </pattern>
      </defs>
      <rect width="800" height="260" fill="url(#st-grid)" className="text-text" />
      {nodes.slice(0, -1).map((n, i) => (
        <line
          key={n.title}
          x1={n.x + 150}
          y1={130}
          x2={nodes[i + 1]!.x - 8}
          y2={130}
          className="text-text-2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="5 5"
          markerEnd="url(#st-arrow)"
        />
      ))}
      {nodes.map((n, i) => (
        <g key={n.title} className="text-text">
          <rect
            x={n.x}
            y={86}
            width={150}
            height={88}
            rx={12}
            className={i === 0 ? "fill-[var(--accent)]" : "fill-[var(--hover-fill)]"}
            stroke="currentColor"
            strokeOpacity={i === 0 ? 0 : 0.25}
          />
          <text x={n.x + 16} y={124} className={`text-[17px] font-semibold ${i === 0 ? "fill-[var(--accent-ink)]" : "fill-current"}`}>
            {n.title}
          </text>
          <text x={n.x + 16} y={148} className={`font-mono text-[12px] ${i === 0 ? "fill-[var(--accent-ink)]" : "fill-[var(--text-2)]"}`}>
            {n.sub}
          </text>
        </g>
      ))}
      <text x={40} y={44} className="fill-[var(--text-2)] font-mono text-[12px] tracking-[0.08em]">
        {en ? "SECURE TRACK · SYSTEM" : "SECURE TRACK · SISTEMA"}
      </text>
    </svg>
  );
}

/** framelab devuelve el código pandas exacto de cada paso: se muestra eso. */
function FramelabVisual() {
  const en = useLocale() === "en";
  const lines = [
    { c: en ? "# framelab · exported session" : "# framelab · sesión exportada", k: "comment" },
    { c: "import pandas as pd", k: "kw" },
    { c: "df = pd.read_csv('ventas.csv')", k: "code" },
    { c: "df = df[df['region'] == 'AMBA']", k: "code" },
    { c: "df = df.groupby('mes', as_index=False)['total'].sum()", k: "code" },
    { c: "df.plot(x='mes', y='total', kind='line')", k: "code" },
  ];
  return (
    <div className="absolute inset-0 grid grid-cols-[1fr_1.3fr] bg-surface-2 daylight:bg-[var(--blanco-roto)]">
      <div className="flex flex-col justify-end gap-1.5 p-5">
        <span className="t-label text-text-2">{en ? "filter → group → plot" : "filtrar → agrupar → graficar"}</span>
        <svg viewBox="0 0 200 90" className="h-[60%] w-full text-accent" aria-hidden="true">
          <polyline points="0,70 30,58 60,64 90,40 120,46 150,22 180,30 200,12" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <line x1="0" y1="88" x2="200" y2="88" stroke="currentColor" strokeOpacity=".3" />
        </svg>
      </div>
      <pre className="overflow-hidden border-l border-line p-5 font-mono text-[12px] leading-[1.75] daylight:border-[var(--tinta)]">
        {lines.map((l) => (
          <div key={l.c} className={l.k === "comment" ? "text-text-2" : l.k === "kw" ? "text-accent" : "text-text"}>
            {l.c}
          </div>
        ))}
      </pre>
    </div>
  );
}
