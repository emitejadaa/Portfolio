"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { scrollToId } from "@/lib/scroll";

const SECTIONS: [string, string][] = [
  ["Stack", "stack"],
  ["Proyectos", "proyectos"],
  ["Experiencia", "experiencia"],
  ["Contacto", "contacto"],
];

export function Nav() {
  const [open, setOpen] = useState(false);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };
  const home = () => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // lock scroll while the mobile menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "16px clamp(20px, 5vw, 56px)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          background: "var(--nav)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <button
          data-cursor=""
          onClick={home}
          aria-label="Inicio"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text)",
          }}
        >
          <span
            className="font-mono"
            style={{
              display: "inline-flex",
              width: 30,
              height: 30,
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--accent)",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14,
              color: "var(--accent)",
              boxShadow: "0 0 14px var(--glow) inset",
            }}
          >
            ET
          </span>
          <span
            className="font-mono"
            style={{ fontSize: 13, letterSpacing: "0.04em", color: "var(--muted)" }}
          >
            emiliano<span style={{ color: "var(--accent)" }}>.dev</span>
          </span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 2vw, 26px)" }}>
          <div className="hidden md:flex" style={{ alignItems: "center", gap: "clamp(12px, 2vw, 26px)" }}>
            {SECTIONS.map(([label, id]) => (
              <button key={id} data-cursor="" className="et-navlink" onClick={() => go(id)}>
                {label}
              </button>
            ))}
          </div>

          <ThemeToggle />

          <button
            data-cursor=""
            onClick={() => setOpen((v) => !v)}
            aria-label="Menú"
            aria-expanded={open}
            className="md:hidden et-btn et-btn-ghost"
            style={{ width: 40, height: 40, padding: 0, borderRadius: 11, fontSize: 18 }}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="et-detail-in md:hidden"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 45,
            background: "rgba(2,5,12,0.6)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: 74,
              left: "clamp(14px, 4vw, 24px)",
              right: "clamp(14px, 4vw, 24px)",
              padding: 14,
              borderRadius: 18,
              border: "1px solid var(--border)",
              background: "var(--bg2)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {SECTIONS.map(([label, id]) => (
              <button
                key={id}
                data-cursor=""
                onClick={() => go(id)}
                className="font-mono"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 16,
                  borderRadius: 12,
                  fontSize: 16,
                  color: "var(--text)",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                }}
              >
                <span>{label}</span>
                <span style={{ color: "var(--accent)" }}>→</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
