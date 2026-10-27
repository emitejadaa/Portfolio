"use client";

import { useEffect, useRef, useState } from "react";
import { techObjects } from "@/content/profile";
import { ui } from "@/content/ui";
import { usePrefersReducedMotion } from "../hooks";
import { useT } from "../i18n";
import { useOS, useOSStore } from "../store";
import type { PasarelaController } from "../three/pasarela-scene";

type Props = { mode?: "strip" | "single"; className?: string };

/** X·02 Pasarela 3D: tecnologías que giran y aceleran con el cursor. */
export function Pasarela({ mode = "strip", className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctrl = useRef<PasarelaController | null>(null);
  const store = useOSStore();
  const theme = useOS((s) => s.theme);
  const t = useT();
  const reduced = usePrefersReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let disposed = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    import("../three/pasarela-scene")
      .then(({ createPasarela }) => {
        if (disposed) return;
        try {
          ctrl.current = createPasarela(canvas, {
            ids: techObjects.map((o) => o.id),
            theme: store.getState().theme,
            mode,
            reducedMotion: reduced,
            onHover: setHovered,
            onIndex: setIndex,
            onSelect: (id) => {
              const tech = techObjects.find((o) => o.id === id);
              if (tech) store.getState().openSpotlight(tech.query);
            },
          });
        } catch {
          setFailed(true);
        }
      })
      .catch(() => setFailed(true));
    return () => {
      disposed = true;
      ctrl.current?.dispose();
      ctrl.current = null;
    };
  }, [mode, reduced, store]);

  useEffect(() => {
    ctrl.current?.setTheme(theme);
  }, [theme]);

  const current = mode === "single" ? techObjects[index] : techObjects.find((o) => o.id === hovered);
  const label = current ? t(current.name) : t(ui.widgets.pasarela);

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center justify-between px-4 pt-3">
        <span className="t-label text-text-2">
          {label}
          {mode === "single" ? (
            <span className="ml-2 tabular-nums">
              {String(index + 1).padStart(2, "0")} / {String(techObjects.length).padStart(2, "0")}
            </span>
          ) : null}
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            className="kbd h-6 w-6 hover:text-text"
            aria-label={t(ui.project.prev)}
            onClick={() => ctrl.current?.step(-1)}
          >
            ◂
          </button>
          <button
            type="button"
            className="kbd h-6 w-6 hover:text-text"
            aria-label={t(ui.project.next)}
            onClick={() => ctrl.current?.step(1)}
          >
            ▸
          </button>
        </div>
      </div>
      {failed ? (
        <p className="px-4 pt-6 pb-4 font-mono text-[12px] text-text-2">
          {techObjects.map((o) => t(o.name)).join(" · ")}
        </p>
      ) : (
        <canvas
          ref={canvasRef}
          className="block h-[calc(100%-36px)] w-full cursor-grab touch-pan-y active:cursor-grabbing"
          aria-label={techObjects.map((o) => t(o.name)).join(", ")}
          role="img"
        />
      )}
    </div>
  );
}
