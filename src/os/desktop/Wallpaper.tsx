/**
 * A·06 / B·06 Wallpaper: tinta quieta. Pure CSS (globals.css · .wallpaper): no canvas and no pointer
 * tracking, so the glass above it only re-blurs when something actually moves.
 */
export function Wallpaper({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`wallpaper pointer-events-none absolute inset-0 ${className}`} />;
}
