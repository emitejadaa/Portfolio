"use client";

import type { StoreApi } from "zustand";
import { readPerf, readStored, setPerf, type PerfRecord } from "./prefs";
import type { OSState } from "./store";

/**
 * Modo liviano automático. Frosted glass (backdrop-filter) is cheap on a GPU and very expensive without
 * one: every moving pixel behind a window gets blurred again by the CPU. Two signals switch this browser
 * to solid surfaces (the "Reducir transparencia" setting), unless the visitor already chose either way:
 *
 * 1. Software rendering: WebGL refuses a context that would run without a GPU ("major performance
 *    caveat"), or names a software rasterizer. Checked once every two weeks, in idle time.
 * 2. Slow frames: the first animations (leaving the lock screen, opening windows) are timed, and two of
 *    them running below ~30 fps is enough.
 *
 * The result is saved, so the next visit starts in the right mode before first paint.
 */
const RECHECK_MS = 14 * 24 * 60 * 60 * 1000;
const SLOW_FRAME_MS = 34;
const MAX_SAMPLES = 4;

type Gpu = NonNullable<PerfRecord["gpu"]>;

function loseContext(gl: WebGLRenderingContext | null) {
  gl?.getExtension("WEBGL_lose_context")?.loseContext();
}

export function probeGpu(): Gpu {
  try {
    const gl = document.createElement("canvas").getContext("webgl", {
      failIfMajorPerformanceCaveat: true,
      powerPreference: "low-power",
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
    });
    if (!gl) {
      // Refused with the caveat flag: a context without it means software; none at all means no WebGL.
      const any = document.createElement("canvas").getContext("webgl");
      loseContext(any);
      return any ? "sw" : "none";
    }
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? "");
    loseContext(gl);
    return /swiftshader|llvmpipe|softpipe|software|basic render|mesa offscreen/i.test(renderer) ? "sw" : "hw";
  } catch {
    return "hw";
  }
}

/** Median frame interval over ~650 ms of an animation, or null if the tab was hidden meanwhile. */
function sampleFrames(): Promise<number | null> {
  return new Promise((resolve) => {
    const times: number[] = [];
    const start = performance.now();
    const tick = (t: number) => {
      times.push(t);
      if (t - start < 650) {
        requestAnimationFrame(tick);
        return;
      }
      if (document.hidden) return resolve(null);
      // The first frames carry the click itself (state change, React render): skip them.
      const iv = times.slice(3).map((v, i) => v - times[i + 2]!);
      if (iv.length < 4 || iv.some((x) => x > 1000)) return resolve(null);
      iv.sort((a, b) => a - b);
      resolve(iv[Math.floor(iv.length / 2)]!);
    };
    requestAnimationFrame(tick);
  });
}

/** Starts both checks; returns a cleanup. `onLite` runs when this visit switched to solid surfaces. */
export function startPerfWatch(store: StoreApi<OSState>, onLite: (reason: "gpu" | "frames") => void) {
  const noop = () => {};
  const prev = readPerf();
  // "No GPU" can change (drivers, browser settings): look again now and then. Slow frames cannot be
  // re-measured from solid surfaces, so that verdict stays until the visitor changes it in Ajustes.
  const recheckGpu = prev?.tier === "lite" && prev.reason === "gpu" && Date.now() - prev.at >= RECHECK_MS;
  // The visitor's own choice always wins; low-end devices already start solid.
  if (readStored().solid !== undefined) return noop;
  if (prev?.tier === "lite" && !recheckGpu) return noop;
  if (prev?.tier !== "lite" && document.documentElement.dataset.solid === "1") return noop;

  let stopped = false;
  const ric = typeof window.requestIdleCallback === "function";

  const gpuCheck = () => {
    if (stopped) return;
    if (prev && !recheckGpu && Date.now() - prev.at < RECHECK_MS) return;
    const gpu = probeGpu();
    const lite = gpu !== "hw";
    if (setPerf({ tier: lite ? "lite" : "full", reason: lite ? "gpu" : undefined, gpu, at: Date.now() })) onLite("gpu");
  };
  const idle = ric ? window.requestIdleCallback(gpuCheck, { timeout: 5000 }) : window.setTimeout(gpuCheck, 3000);

  let samples = 0;
  let slow = 0;
  let sampling = false;
  const light = () => readPerf()?.tier === "lite" || readStored().solid !== undefined;
  const measure = async () => {
    if (sampling || stopped || samples >= MAX_SAMPLES || light()) return;
    sampling = true;
    const median = await sampleFrames();
    sampling = false;
    if (stopped || median === null || light()) return;
    samples += 1;
    if (median > SLOW_FRAME_MS) slow += 1;
    if (slow >= 2) {
      stopped = true;
      if (setPerf({ tier: "lite", reason: "frames", gpu: readPerf()?.gpu, at: Date.now() })) onLite("frames");
    }
  };
  const unsubscribe = store.subscribe((s, prev) => {
    const entered = prev.phase !== "desktop" && s.phase === "desktop";
    const opened = s.windows.length > prev.windows.length;
    if (entered || opened) void measure();
  });

  return () => {
    stopped = true;
    unsubscribe();
    if (ric) window.cancelIdleCallback(idle);
    else window.clearTimeout(idle);
  };
}
