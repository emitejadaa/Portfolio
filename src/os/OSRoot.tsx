"use client";

import { MotionConfig } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import type { StoreApi } from "zustand";
import { getProject } from "@/content/projects";
import { ui } from "@/content/ui";
import type { Readme } from "@/lib/readme";
import { isKnownPath, keyForPath, pathFor } from "./apps";
import { preloadApps } from "./apps/AppContent";
import { ReadmeContext } from "./readme-context";
import { Desktop } from "./desktop/Desktop";
import { Spotlight } from "./desktop/Spotlight";
import { isTypingTarget } from "./hooks";
import { MobileShell } from "./mobile/MobileShell";
import { isReducedMotion, useReducedMotion } from "./prefs";
import { BootScreen, Confetti, CrashOverlay, LockScreen, Screensaver, Toast } from "./overlays";
import {
  createOSStore,
  getNavIdx,
  OSStoreContext,
  readNavIdx,
  refreshTitle,
  registerProjectTitle,
  setNavIdx,
  useOS,
  type OSState,
} from "./store";
import { switchTheme } from "./theme";
import { Cursor } from "./Cursor";

registerProjectTitle((slug) => (slug ? (getProject(slug)?.title ?? slug) : ""));

export function OSRoot({ readme, children }: { readme: Readme; children: ReactNode }) {
  const pathname = usePathname();
  const [store] = useState(() => createOSStore({ pathname: pathname ?? "/" }));

  return (
    <OSStoreContext.Provider value={store}>
      <ReadmeContext.Provider value={readme}>
        <a href="#contenido" className="sr-only-focusable fixed top-2 left-2 z-[400] rounded-md bg-accent px-3 py-2 text-accent-ink">
          {ui.skip.es}
        </a>
        <div id="os-root">
          <Shell />
        </div>
        <Hydrator store={store} />
        {children}
      </ReadmeContext.Provider>
    </OSStoreContext.Provider>
  );
}

function Shell() {
  const layout = useOS((s) => s.layout);
  const reduced = useReducedMotion();
  return (
    // Ajustes → Reducir movimiento (or the system setting) turns every Motion transform into a fade.
    <MotionConfig reducedMotion={reduced ? "always" : "never"}>
      {layout !== "mobile" ? <Desktop className={layout === "ssr" ? "max-[820px]:hidden" : ""} /> : null}
      {layout !== "desktop" ? <MobileShell className={layout === "ssr" ? "min-[821px]:hidden" : ""} /> : null}
      <Spotlight />
      <Toast />
      <Confetti />
      <Screensaver />
      <LockScreen />
      <BootScreen />
      <CrashOverlay />
      {layout === "desktop" ? <Cursor /> : null}
    </MotionConfig>
  );
}

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

function Hydrator({ store }: { store: StoreApi<OSState> }) {
  // 1. Sync mode, language and layout from what the pre-paint script decided.
  useEffect(() => {
    const root = document.documentElement;
    const theme = root.dataset.theme === "daylight" ? "daylight" : "midnight";
    const locale = root.dataset.lang === "en" ? "en" : "es";
    store.setState({ theme, locale });
    root.lang = locale;
    refreshTitle(store);

    const mq = window.matchMedia("(max-width: 820px)");
    const applyLayout = () => store.getState().setLayout(mq.matches ? "mobile" : "desktop");
    applyLayout();
    mq.addEventListener("change", applyLayout);

    const path = window.location.pathname;
    if (!isKnownPath(path)) {
      store.getState().showToast(ui.toast.notFound[locale]);
      window.history.replaceState(window.history.state, "", "/" + window.location.search);
    } else if (path === "/" && root.dataset.first === "1") {
      store.getState().setPhase("boot");
    }

    // Seed this history entry so back/forward can tell direction.
    const key = keyForPath(window.location.pathname);
    window.history.replaceState({ ...(window.history.state ?? {}), tejada: { idx: 0, key } }, "");
    setNavIdx(0);

    // Follow the OS colour scheme until the visitor picks a mode.
    const scheme = window.matchMedia("(prefers-color-scheme: light)");
    const onScheme = () => {
      try {
        if (localStorage.getItem("tejada.theme")) return;
      } catch {}
      store.setState({ theme: scheme.matches ? "daylight" : "midnight" });
      root.dataset.theme = scheme.matches ? "daylight" : "midnight";
    };
    scheme.addEventListener("change", onScheme);

    store.getState().setHydrated();
    // Safari has no requestIdleCallback.
    const ric = typeof window.requestIdleCallback === "function";
    const idle = ric ? window.requestIdleCallback(preloadApps, { timeout: 4000 }) : window.setTimeout(preloadApps, 2500);
    return () => {
      if (ric) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      mq.removeEventListener("change", applyLayout);
      scheme.removeEventListener("change", onScheme);
    };
  }, [store]);

  // 2. L·05 "← volver" cierra la ventana: back/forward opens or closes windows.
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const idx = readNavIdx(e.state) ?? 0;
      const back = idx < getNavIdx();
      setNavIdx(idx);
      const s = store.getState();
      const target = keyForPath(window.location.pathname);
      if (back) {
        const leaving = s.focused;
        if (leaving && leaving !== target && pathFor(leaving)) s.closeWindow(leaving);
      }
      if (target) s.openWindow(target, { nav: "none" });
      if (s.phase === "lock" || s.phase === "boot") s.setPhase("desktop");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [store]);

  // 3. X·03 Atajos y secretos.
  useEffect(() => {
    let konami = 0;
    let typed = "";
    const onKey = (e: KeyboardEvent) => {
      const s = store.getState();
      const mod = e.metaKey || e.ctrlKey;
      const typing = isTypingTarget(e.target);

      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (s.spotlight.open) s.closeSpotlight();
        else {
          if (s.phase === "lock") s.setPhase("desktop");
          s.openSpotlight();
        }
        return;
      }
      if (mod && e.shiftKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        switchTheme(store);
        return;
      }
      if ((e.ctrlKey || e.altKey) && e.code === "Backquote") {
        e.preventDefault();
        s.cycleWindows();
        return;
      }

      // Konami → modo retro System 7 (works even while typing arrows elsewhere).
      const want = KONAMI[konami];
      if (want && e.key.toLowerCase() === want.toLowerCase()) {
        konami += 1;
        if (konami === KONAMI.length) {
          konami = 0;
          const on = !s.retro;
          s.setRetro(on);
          s.showToast(on ? ui.toast.retroOn[s.locale] : ui.toast.retroOff[s.locale]);
        }
      } else konami = e.key === "ArrowUp" ? 1 : 0;

      if (e.key === "Escape" && !e.defaultPrevented) {
        if (s.spotlight.open) {
          s.closeSpotlight();
          return;
        }
        if (s.phase === "desktop" && s.focused && !typing) {
          s.closeWindow(s.focused);
          return;
        }
        if (s.phase === "desktop" && s.focused === "terminal") {
          s.closeWindow("terminal");
          return;
        }
      }

      if (typing || mod || e.altKey) return;

      if (e.code === "Backquote" || e.key === "`") {
        e.preventDefault();
        if (s.phase !== "desktop") s.setPhase("desktop");
        if (s.focused === "terminal") s.closeWindow("terminal");
        else s.openWindow("terminal");
        return;
      }

      // Escribir "tejada" en cualquier lado abre la terminal.
      if (e.key.length === 1) {
        typed = (typed + e.key.toLowerCase()).slice(-6);
        if (typed === "tejada") {
          typed = "";
          // Keep the final "a" out of the terminal input that is about to get focus.
          e.preventDefault();
          if (s.phase !== "desktop") s.setPhase("desktop");
          s.openWindow("terminal");
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [store]);

  // 4. 60 s sin actividad → protector de pantalla.
  useEffect(() => {
    let last = Date.now();
    const bump = () => (last = Date.now());
    const events = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart"] as const;
    events.forEach((ev) => window.addEventListener(ev, bump, { passive: true }));
    const id = window.setInterval(() => {
      const s = store.getState();
      if (s.layout !== "desktop" || s.phase !== "desktop" || s.screensaver || document.hidden) return;
      if (isReducedMotion()) return;
      if (Date.now() - last > 60_000) s.setScreensaver(true);
    }, 5000);
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, bump));
      window.clearInterval(id);
    };
  }, [store]);

  // 5. Keep the tab title in the visitor's language.
  useEffect(
    () =>
      store.subscribe((s, prev) => {
        if (s.locale !== prev.locale) refreshTitle(store);
      }),
    [store],
  );

  return null;
}
