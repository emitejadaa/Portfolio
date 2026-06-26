"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/** Mono pill toggle. Shows the current theme label; click switches. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme !== "light";
  const label = mounted ? (isDark ? "Oscuro" : "Claro") : "Oscuro";

  return (
    <button
      data-cursor=""
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Cambiar tema"
      className="et-btn et-btn-ghost"
      style={{
        gap: 7,
        padding: "7px 12px",
        borderRadius: 999,
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: 12,
        fontWeight: 500,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "var(--accent)",
          boxShadow: "0 0 10px var(--accent)",
        }}
      />
      {label}
    </button>
  );
}
