"use client";

import { useOS } from "./store";

/** "Disponible": the halo pulses a few times when the desktop shows up and again while hovered, then rests
 *  (globals.css · .live-ping). An endless pulse would keep the compositor drawing, and re-blurring the glass
 *  under it, on every frame for as long as the tab is open. */
export function LiveDot() {
  const phase = useOS((s) => s.phase);
  return (
    <span className="relative flex h-[7px] w-[7px]">
      {phase === "desktop" ? <span className="live-ping absolute inset-0 rounded-full bg-accent opacity-60" /> : null}
      <span className="relative h-[7px] w-[7px] rounded-full bg-accent" />
    </span>
  );
}
