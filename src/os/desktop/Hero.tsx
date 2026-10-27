"use client";

import { motion } from "motion/react";
import { identity } from "@/content/profile";
import { ui } from "@/content/ui";
import { useKeys } from "../hooks";
import { useT } from "../i18n";
import { useOS, useOSStore } from "../store";
import { KineticText } from "./KineticText";

/** Escritorio, estado base: nombre, frase cinética y bajada sobre el wallpaper. */
export function Hero() {
  const store = useOSStore();
  const t = useT();
  const phase = useOS((s) => s.phase);
  const ready = phase === "desktop";
  const spotlightKeys = useKeys("mod", "K");

  const enter = (i: number) => ({
    initial: { opacity: 0, y: 16, filter: "blur(8px)" },
    animate: ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined,
    transition: { duration: 0.6, delay: 0.08 + i * 0.06, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section
      id="contenido"
      aria-label={t(ui.desktop.hero)}
      className="hero pointer-events-none absolute top-[clamp(110px,19vh,210px)] left-[clamp(112px,9vw,150px)] z-0 max-w-[min(820px,calc(100vw-560px))] select-none"
    >
      <motion.p {...enter(0)} className="t-label text-text-2">
        {t(identity.focus)} <span className="opacity-50">·</span> {identity.location}
      </motion.p>
      <motion.h1 {...enter(1)} className="t-display mt-5 text-balance">
        {identity.name}
        <span aria-hidden="true" className="ml-[0.04em] inline-block h-[0.2em] w-[0.2em] bg-accent align-baseline" />
      </motion.h1>
      <motion.p {...enter(2)} className="t-h2 pointer-events-auto mt-6 max-w-[34ch]">
        <KineticText key={t(identity.headline)} text={t(identity.headline)} start={ready} />
      </motion.p>
      <motion.p {...enter(3)} className="mt-4 max-w-[52ch] text-[17px] leading-[1.55] text-text-2">
        {t(identity.subhead)}
      </motion.p>
      <motion.div {...enter(4)} className="pointer-events-auto mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          className="btn btn-primary"
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            store.getState().openWindow("projects", { origin: { x: r.left + r.width / 2, y: r.top + r.height / 2 } });
          }}
        >
          {t(ui.desktop.seeProjects)} <span aria-hidden="true">↗</span>
        </button>
        <button
          type="button"
          className="btn"
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            store.getState().openWindow("contact", { origin: { x: r.left + r.width / 2, y: r.top + r.height / 2 } });
          }}
        >
          {t(ui.desktop.contactMe)}
        </button>
      </motion.div>
      <motion.p {...enter(5)} className="mt-6 font-mono text-[12px] text-text-2">
        {t(ui.desktop.idleHint).replace("{keys}", spotlightKeys)}
      </motion.p>
    </section>
  );
}
