"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { identity } from "@/content/profile";
import { ui } from "@/content/ui";
import { useClockBA } from "./hooks";
import { useReducedMotion } from "./prefs";
import { useT } from "./i18n";
import { useOS, useOSStore } from "./store";

/** M·06 Boot sequence: ≤ 1,2 s, solo en la primera visita. */
export function BootScreen() {
  const store = useOSStore();
  const phase = useOS((s) => s.phase);
  const hydrated = useOS((s) => s.hydrated);
  const t = useT();
  const reduced = useReducedMotion();
  // Before hydration the first-visit flag lives on <html> (CSS decides); after, the phase does.
  const ssrPlaceholder = !hydrated && phase === "lock";

  useEffect(() => {
    if (phase !== "boot") return;
    const id = window.setTimeout(
      () => {
        try {
          localStorage.setItem("tejada.visited", "1");
        } catch {}
        delete document.documentElement.dataset.first;
        const s = store.getState();
        if (s.phase === "boot") s.setPhase(s.windows.length ? "desktop" : "lock");
      },
      reduced ? 300 : 1200,
    );
    return () => window.clearTimeout(id);
  }, [phase, reduced, store]);

  return (
    <AnimatePresence>
      {phase === "boot" || ssrPlaceholder ? (
        <motion.div
          key="boot"
          data-ssr={ssrPlaceholder ? "1" : undefined}
          className="boot-screen fixed inset-0 z-[300] grid place-items-center bg-bg"
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          aria-live="polite"
        >
          <div className="flex w-[220px] flex-col items-center gap-6">
            <span className="t-dot text-[64px] leading-none">{identity.monogram}</span>
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-[var(--hover-fill)] daylight:rounded-none daylight:border daylight:border-[var(--tinta)]">
              <motion.div
                className="h-full bg-accent"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: reduced ? 0.2 : 1.1, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span className="font-mono text-[12px] text-text-2">{t(identity.bootText)}</span>
          </div>
          <span className="absolute bottom-6 font-mono text-[11px] text-text-2">◐ {identity.systemName}</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** L·05 Bloqueo: hora + "Entrar". */
export function LockScreen() {
  const store = useOSStore();
  const phase = useOS((s) => s.phase);
  const t = useT();
  const show = phase === "lock";

  useEffect(() => {
    if (!show) return;
    const enter = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        store.getState().setPhase("desktop");
      }
    };
    window.addEventListener("keydown", enter);
    return () => window.removeEventListener("keydown", enter);
  }, [show, store]);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="lock"
          className="lock-screen fixed inset-0 z-[250] flex cursor-pointer flex-col items-center justify-between overflow-hidden px-6 py-[12vh] text-text"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40, transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] } }}
          onClick={() => store.getState().setPhase("desktop")}
          onWheel={(e) => e.deltaY > 20 && store.getState().setPhase("desktop")}
        >
          <div className="lock-veil absolute inset-0" aria-hidden="true" />
          <LockClock />
          <div className="relative flex flex-col items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-full border border-line-strong font-mono text-[18px] font-semibold daylight:rounded-none daylight:border-[var(--tinta)] daylight:bg-[var(--blanco-roto)] daylight:shadow-[4px_4px_0_var(--tinta)]">
              {identity.monogram}
            </span>
            <span className="text-[17px] font-medium">{identity.name}</span>
            <button
              type="button"
              autoFocus
              className="btn btn-primary mt-1 h-11 rounded-full px-7 daylight:rounded-[10px]"
              onClick={(e) => {
                e.stopPropagation();
                store.getState().setPhase("desktop");
              }}
            >
              {t(ui.lock.enter)} <span aria-hidden="true">→</span>
            </button>
            <span className="font-mono text-[12px] text-text-2">{t(ui.lock.hint)}</span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** X·03 easter egg 04: 60 s sin actividad → protector de pantalla (cielo que se mueve despacio + hora). */
export function Screensaver() {
  const store = useOSStore();
  const on = useOS((s) => s.screensaver);

  useEffect(() => {
    if (!on) return;
    const off = () => store.getState().setScreensaver(false);
    const timer = window.setTimeout(() => {
      window.addEventListener("pointermove", off, { once: true });
      window.addEventListener("keydown", off, { once: true });
      window.addEventListener("pointerdown", off, { once: true });
      window.addEventListener("wheel", off, { once: true });
    }, 400);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointermove", off);
      window.removeEventListener("keydown", off);
      window.removeEventListener("pointerdown", off);
      window.removeEventListener("wheel", off);
    };
  }, [on, store]);

  return (
    <AnimatePresence>
      {on ? (
        <motion.div
          key="saver"
          className="fixed inset-0 z-[280] overflow-hidden bg-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.24 } }}
          transition={{ duration: 1.2 }}
          aria-hidden="true"
        >
          <div className="screensaver-sky" />
          <SaverClock />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** `rm -rf /`: la pantalla se rompe con glitch y el sistema vuelve a bootear. */
export function CrashOverlay() {
  const store = useOSStore();
  const phase = useOS((s) => s.phase);
  // The glitch itself is a CSS class on #os-root; only the panic text needs React.
  const [stage, setStage] = useState<"panic" | null>(null);

  useEffect(() => {
    if (phase !== "crash") return;
    const root = document.getElementById("os-root");
    root?.classList.add("is-glitching");
    const a = window.setTimeout(() => {
      root?.classList.remove("is-glitching");
      setStage("panic");
    }, 1400);
    const b = window.setTimeout(() => {
      setStage(null);
      const s = store.getState();
      s.closeAll();
      s.setPhase("boot");
    }, 3000);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
      root?.classList.remove("is-glitching");
    };
  }, [phase, store]);

  if (stage !== "panic") return null;
  return (
    <div className="fixed inset-0 z-[320] bg-black p-8 font-mono text-[13px] leading-6 text-[#d4ff3a]" aria-live="assertive">
      <p>rm: borrando / … ✓</p>
      <p>kernel panic: el portfolio se borró a sí mismo.</p>
      <p className="text-[#8b9099]">Mentira. Reiniciando tejada.os…</p>
      <span className="caret">▌</span>
    </div>
  );
}

const CONFETTI = ["✦", "ET", "hire", "{ }", "</>", "01", "◐", "★", "⌘", "∞", "■", "sudo", "✓", "yes"];

/** Deterministic PRNG so the burst is a pure function of its number. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makePieces(burst: number) {
  const rand = mulberry32(burst * 7919);
  return Array.from({ length: 90 }, (_, i) => ({
    id: `${burst}-${i}`,
    text: CONFETTI[i % CONFETTI.length]!,
    x: (rand() - 0.5) * 1100,
    y: -(rand() * 520 + 160),
    r: (rand() - 0.5) * 720,
    d: 1.6 + rand() * 1.2,
    size: 12 + rand() * 22,
    accent: rand() > 0.55,
  }));
}

/** `sudo hire-me` → confeti tipográfico. */
export function Confetti() {
  const fire = useOS((s) => s.confetti);
  const [doneFor, setDoneFor] = useState(0);
  const pieces = useMemo(() => (fire ? makePieces(fire) : []), [fire]);

  useEffect(() => {
    if (!fire) return;
    const id = window.setTimeout(() => setDoneFor(fire), 3200);
    return () => window.clearTimeout(id);
  }, [fire]);

  if (!fire || doneFor === fire) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[260] overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className={`absolute top-1/2 left-1/2 font-mono font-semibold ${p.accent ? "text-accent" : "text-text"}`}
          style={{ fontSize: p.size }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{ x: [0, p.x * 0.6, p.x], y: [0, p.y, p.y + 900], rotate: p.r, opacity: [1, 1, 0] }}
          transition={{ duration: p.d, ease: [0.2, 0.7, 0.4, 1], times: [0, 0.35, 1] }}
        >
          {p.text}
        </motion.span>
      ))}
    </div>
  );
}

export function Toast() {
  const toast = useOS((s) => s.toast);
  const store = useOSStore();
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => store.setState({ toast: null }), 2600);
    return () => window.clearTimeout(id);
  }, [toast, store]);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[112px] z-[130] flex justify-center px-4" aria-live="polite">
      <AnimatePresence>
        {toast ? (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.16 } }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.36 }}
            className="popover rounded-full px-4 py-2 font-mono text-[12.5px] daylight:rounded-none"
          >
            {toast.text}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function LockClock() {
  const { time, date } = useClockBA();
  return (
    <div className="relative flex flex-col items-center">
      <span className="font-mono text-[13px] text-text-2 capitalize" suppressHydrationWarning>
        {date || " "}
      </span>
      <span className="t-dot mt-2 text-[clamp(88px,15vw,168px)] leading-none" suppressHydrationWarning>
        {time}
      </span>
      <span className="t-label mt-3 text-text-2">
        {identity.city} · {identity.utcLabel}
      </span>
    </div>
  );
}

function SaverClock() {
  const { time } = useClockBA();
  return (
    <div className="absolute bottom-10 left-10 flex flex-col">
      <span className="t-dot text-[72px] leading-none text-text/90">{time}</span>
      <span className="mt-2 font-mono text-[12px] text-text-2">◐ {identity.systemName}</span>
    </div>
  );
}
