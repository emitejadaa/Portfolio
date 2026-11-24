"use client";

import { AnimatePresence } from "motion/react";
import { memo, useRef, type RefObject } from "react";
import { identity } from "@/content/profile";
import { AppContent } from "../apps/AppContent";
import { useOS, type Win } from "../store";
import { ContextMenu } from "./ContextMenu";
import { DesktopIcons } from "./DesktopIcons";
import { Dock } from "./Dock";
import { Hero } from "./Hero";
import { MenuBar } from "./MenuBar";
import { Wallpaper } from "./Wallpaper";
import { WidgetColumn } from "./Widgets";
import { Window, dockIdFor } from "./Window";

/** L·01 Escritorio: menu bar, íconos, ventanas, widgets y dock. */
export function Desktop({ className = "" }: { className?: string }) {
  const windows = useOS((s) => s.windows);
  const layerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`desktop fixed inset-0 overflow-hidden ${className}`}>
      <Wallpaper />
      <MenuBar />
      <main className="absolute inset-0 top-10">
        <DesktopIcons />
        <Hero />
        <WidgetColumn />
        <span className="pointer-events-none absolute right-5 bottom-[18px] font-mono text-[11px] text-text-2 max-[1180px]:hidden">
          ◐ {identity.systemName}
        </span>
      </main>
      {/* Viewport coordinates: window rects, launch origins and dock targets all share them. */}
      <div ref={layerRef} className="window-layer pointer-events-none absolute inset-0 z-[50]">
        {/* initial={false}: a deep-linked window is already there on first paint instead of fading in after the script loads. */}
        <AnimatePresence initial={false}>
          {windows.map((win) => (
            <DesktopWindow key={win.key} win={win} layerRef={layerRef} />
          ))}
        </AnimatePresence>
      </div>
      <Dock />
      <ContextMenu />
    </div>
  );
}

/** The store keeps a window's object when another one changes, so focusing one window re-renders only the two involved. */
const DesktopWindow = memo(function DesktopWindow({ win, layerRef }: { win: Win; layerRef: RefObject<HTMLDivElement | null> }) {
  return (
    <Window win={win} constraintsRef={layerRef} dockId={dockIdFor(win.key)}>
      <AppContent win={win} />
    </Window>
  );
});
