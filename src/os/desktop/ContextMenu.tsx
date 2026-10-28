"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { create } from "zustand";
import { formatKeys, useIsApple } from "../hooks";

type Action = {
  label: string;
  /** Shortcut, e.g. ["mod", "L"]; shown for the visitor's platform. "mod" shortcuts work while the menu is open. */
  keys?: string[];
  /** Glyph shown when there is no shortcut, e.g. "↗". */
  hint?: string;
  onSelect: () => void;
};
export type MenuItem = Action | "separator";

type MenuState = {
  menu: { x: number; y: number; items: MenuItem[] } | null;
  open: (x: number, y: number, items: MenuItem[]) => void;
  close: () => void;
};

// Client-only UI state (never rendered on the server), so a module store is fine here.
export const useContextMenu = create<MenuState>((set) => ({
  menu: null,
  open: (x, y, items) => set({ menu: { x, y, items } }),
  close: () => set({ menu: null }),
}));

/** A·08 Menú contextual: Abrir ↵ · Abrir en ventana nueva ⌘↵ · Copiar link ⌘L · Ver código ↗ */
export function ContextMenu() {
  const menu = useContextMenu((s) => s.menu);
  const close = useContextMenu((s) => s.close);
  const apple = useIsApple();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menu) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
      }
    };
    window.addEventListener("pointerdown", onDown, true);
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("resize", close);
    ref.current?.querySelector<HTMLButtonElement>("button")?.focus();
    return () => {
      window.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("resize", close);
    };
  }, [menu, close]);

  const x = menu ? Math.min(menu.x, (typeof window !== "undefined" ? window.innerWidth : 1440) - 270) : 0;
  const y = menu ? Math.min(menu.y, (typeof window !== "undefined" ? window.innerHeight : 900) - 180) : 0;

  return (
    <AnimatePresence>
      {menu ? (
        <motion.div
          ref={ref}
          role="menu"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="popover fixed z-[120] w-[254px] origin-top-left rounded-[12px] p-[7px] daylight:rounded-none"
          style={{ left: x, top: y }}
          onKeyDown={(e) => {
            if (e.metaKey || e.ctrlKey) {
              const pressed = e.key === "Enter" ? "enter" : e.key.toUpperCase();
              const action = menu.items.find(
                (it): it is Action => it !== "separator" && it.keys?.[0] === "mod" && it.keys.at(-1) === pressed,
              );
              if (action) {
                e.preventDefault();
                close();
                action.onSelect();
              }
              return;
            }
            const buttons = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>("button") ?? []);
            const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
            if (e.key === "ArrowDown") {
              e.preventDefault();
              buttons[(i + 1) % buttons.length]?.focus();
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              buttons[(i - 1 + buttons.length) % buttons.length]?.focus();
            }
          }}
        >
          {menu.items.map((item, i) =>
            item === "separator" ? (
              <div key={`s${i}`} role="separator" className="mx-1 my-[3px] h-px bg-line daylight:bg-[var(--tinta)]" />
            ) : (
              <button
                key={item.label}
                role="menuitem"
                type="button"
                className="flex h-[34px] w-full items-center justify-between rounded-[7px] px-[10px] text-left text-[13.5px] outline-none hover:bg-[var(--hover-fill)] focus-visible:bg-[var(--hover-fill)] daylight:rounded-none daylight:hover:bg-[var(--tinta)] daylight:hover:text-[var(--blanco-roto)] daylight:focus-visible:bg-[var(--tinta)] daylight:focus-visible:text-[var(--blanco-roto)]"
                onClick={() => {
                  close();
                  item.onSelect();
                }}
              >
                <span>{item.label}</span>
                {item.keys || item.hint ? (
                  <span className="font-mono text-[12px] opacity-60">{item.keys ? formatKeys(item.keys, apple) : item.hint}</span>
                ) : null}
              </button>
            ),
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
