"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="rounded-full border border-white/10 bg-white/10 p-2 text-sm text-white/80 backdrop-blur"
      >
        —
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center gap-2 rounded-full border border-zinc-200/60 bg-white/80 px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:border-zinc-300 hover:bg-white dark:border-zinc-700/80 dark:bg-zinc-900/70 dark:text-zinc-100 dark:hover:border-zinc-600"
      aria-label="Cambiar tema"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      <span>{isDark ? "Claro" : "Oscuro"}</span>
    </button>
  );
}
