"use client";

import { AnimatePresence } from "motion/react";
import { useRef } from "react";
import { identity } from "@/content/profile";
import { AppContent } from "../apps/AppContent";
import { useOS } from "../store";
import { ContextMenu } from "./ContextMenu";
import { DesktopIcons } from "./DesktopIcons";
import { Dock } from "./Dock";
import { Hero } from "./Hero";
import { MenuBar } from "./MenuBar";
import { Pasarela } from "./Pasarela";
import { Wallpaper } from "./Wallpaper";
import { WidgetColumn } from "./Widgets";
import { Window, dockIdFor } from "./Window";

/** L·01 Escritorio: menu bar, íconos, ventanas, widgets, dock y pasarela 3D. */
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
        <div className="pasarela-card card absolute bottom-[18px] left-4 z-[1] h-[150px] w-[360px] overflow-hidden max-[1180px]:hidden">
          <Pasarela className="h-full" />
        </div>
        <span className="pointer-events-none absolute right-5 bottom-[18px] font-mono text-[11px] text-text-2 max-[1180px]:hidden">
          ◐ {identity.systemName}
        </span>
      </main>
      {/* Viewport coordinates: window rects, launch origins and dock targets all share them. */}
      <div ref={layerRef} className="window-layer pointer-events-none absolute inset-0 z-[50]">
        <AnimatePresence>
          {windows.map((win) => (
            <Window key={win.key} win={win} constraintsRef={layerRef} dockId={dockIdFor(win.key)}>
              <AppContent win={win} />
            </Window>
          ))}
        </AnimatePresence>
      </div>
      <Dock />
      <ContextMenu />
    </div>
  );
}
