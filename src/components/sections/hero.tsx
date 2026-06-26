"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/portfolio";
import { scrollToId } from "@/lib/scroll";
import { TechOrb } from "@/components/fx/tech-orb";

export function Hero() {
  const roles = profile.disciplines;
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setRoleIndex((i) => (i + 1) % roles.length);
    }, 2200);
    return () => clearInterval(id);
  }, [roles.length]);

  return (
    <section
      id="inicio"
      style={{
        minHeight: "100dvh",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))",
        alignItems: "center",
        gap: 48,
        padding: "clamp(96px, 13vh, 116px) 0 72px",
      }}
    >
      <div>
        <div className="et-pill" style={{ marginBottom: 30 }}>
          <span className="et-dot" aria-hidden="true" />
          {profile.availability}
        </div>

        <div
          className="font-mono"
          style={{ fontSize: 14, letterSpacing: "0.18em", color: "var(--accent)", marginBottom: 14 }}
        >
          {profile.name.toUpperCase()}
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "clamp(40px, 7vw, 76px)",
            lineHeight: 1.02,
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          {profile.buildLine}
          <br />
          <span
            style={{
              display: "inline-block",
              overflow: "hidden",
              height: "1.1em",
              verticalAlign: "bottom",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: "block",
                transition: "transform .6s cubic-bezier(.7, 0, .2, 1)",
                transform: `translateY(${-roleIndex * 1.1}em)`,
                willChange: "transform",
              }}
            >
              {roles.map((role) => (
                <span key={role} className="et-role-gradient" style={{ display: "block", lineHeight: 1.1 }}>
                  {role}
                </span>
              ))}
            </span>
            <span className="sr-only">{roles.join(", ")}</span>
          </span>
        </h1>

        <p
          style={{
            maxWidth: "34ch",
            margin: "26px 0 0",
            fontSize: "clamp(16px, 2.1vw, 19px)",
            lineHeight: 1.6,
            color: "var(--muted)",
          }}
        >
          {profile.headline}
        </p>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 34 }}>
          <button data-cursor="" className="et-btn et-btn-primary" onClick={() => scrollToId("proyectos")}>
            Ver proyectos →
          </button>
          <button data-cursor="" className="et-btn et-btn-ghost" onClick={() => scrollToId("contacto")}>
            Contacto
          </button>
        </div>
      </div>

      <TechOrb />
    </section>
  );
}
