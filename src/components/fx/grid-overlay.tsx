// Static blueprint grid, masked toward the top. No JS — safe as a server component.
export function GridOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.5,
        backgroundImage:
          "linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
        maskImage:
          "radial-gradient(900px 600px at 50% 0%, #000, transparent 75%)",
        WebkitMaskImage:
          "radial-gradient(900px 600px at 50% 0%, #000, transparent 75%)",
      }}
    />
  );
}
