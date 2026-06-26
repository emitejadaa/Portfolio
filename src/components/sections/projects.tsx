"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { projects } from "@/data/portfolio";

export function Projects() {
  const [sel, setSel] = useState<number | null>(null);
  const n = projects.length;

  useEffect(() => {
    if (sel === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSel(null);
      else if (e.key === "ArrowLeft") setSel((s) => (s === null ? s : (s - 1 + n) % n));
      else if (e.key === "ArrowRight") setSel((s) => (s === null ? s : (s + 1) % n));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [sel, n]);

  return (
    <section id="proyectos" style={{ padding: "80px 0" }}>
      <Reveal>
        <SectionHeading index="02" label="PROYECTOS" title="Cosas que construí" />
      </Reveal>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))",
          gap: 20,
        }}
      >
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 60} style={{ height: "100%" }}>
            <button
              data-cursor=""
              onClick={() => setSel(i)}
              aria-label={`Ver proyecto ${p.title}`}
              className="et-project et-card et-card-hover"
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
                width: "100%",
                height: "100%",
                padding: 0,
                borderRadius: 20,
                color: "var(--text)",
              }}
            >
              <span className="et-prj-bar" aria-hidden="true" />
              <div
                className="et-prj-thumb"
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16 / 9",
                  borderBottom: "1px solid var(--border)",
                  background: "var(--surface2)",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={p.image}
                  alt={`Captura de ${p.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  style={{ objectFit: "cover", objectPosition: "top" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "20px 24px 24px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <span className="font-mono" style={{ fontSize: 12, color: "var(--muted)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden="true"
                    style={{
                      display: "inline-flex",
                      width: 34,
                      height: 34,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 10,
                      border: "1px solid var(--border)",
                      color: "var(--accent)",
                    }}
                  >
                    ↗
                  </span>
                </div>
                <h3 style={{ margin: "0 0 10px", fontSize: 23, fontWeight: 600 }}>{p.title}</h3>
                <p
                  style={{
                    margin: "0 0 18px",
                    color: "var(--muted)",
                    fontSize: 14.5,
                    lineHeight: 1.55,
                    flex: 1,
                  }}
                >
                  {p.description}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {p.tags.map((tag) => (
                    <span key={tag} className="et-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      {sel !== null && (
        <ProjectDetail
          index={sel}
          onClose={() => setSel(null)}
          onPrev={() => setSel((s) => (s === null ? s : (s - 1 + n) % n))}
          onNext={() => setSel((s) => (s === null ? s : (s + 1) % n))}
        />
      )}
    </section>
  );
}

function ProjectDetail({
  index,
  onClose,
  onPrev,
  onNext,
}: {
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const n = projects.length;
  const p = projects[index];
  const prev = projects[(index - 1 + n) % n];
  const next = projects[(index + 1) % n];
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, [index]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Proyecto ${p.title}`}
      key={index}
      className="et-detail-in"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 70,
        overflowY: "auto",
        background:
          "radial-gradient(1000px 600px at 50% -10%, var(--glow), transparent 60%), var(--bg)",
      }}
    >
      <div
        style={{
          maxWidth: 920,
          margin: "0 auto",
          padding: "clamp(28px, 6vw, 72px) clamp(20px, 5vw, 40px) 80px",
        }}
      >
        <button
          ref={closeRef}
          data-cursor=""
          onClick={onClose}
          className="et-btn et-btn-ghost font-mono"
          style={{ marginBottom: 44, padding: "11px 18px", borderRadius: 11, fontSize: 13, fontWeight: 500 }}
        >
          ← Volver al inicio
        </button>

        <div className="font-mono" style={{ fontSize: 13, color: "var(--accent)", marginBottom: 14 }}>
          {String(index + 1).padStart(2, "0")} / PROYECTO
        </div>
        <h1 style={{ margin: 0, fontSize: "clamp(38px, 8vw, 72px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.02 }}>
          {p.title}
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 22 }}>
          {p.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono"
              style={{
                fontSize: 12,
                padding: "6px 12px",
                borderRadius: 8,
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div
          style={{
            margin: "36px 0",
            position: "relative",
            aspectRatio: "16 / 9",
            borderRadius: 20,
            border: "1px solid var(--border)",
            overflow: "hidden",
            background: "var(--surface)",
          }}
        >
          <Image
            src={p.image}
            alt={`Captura del proyecto ${p.title}`}
            fill
            sizes="(max-width: 980px) 100vw, 920px"
            style={{ objectFit: "cover", objectPosition: "top" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 28, marginBottom: 40 }}>
          <div>
            <div className="font-mono" style={{ fontSize: 12, color: "var(--accent)", marginBottom: 12 }}>
              QUÉ ES
            </div>
            <p style={{ margin: 0, color: "var(--text)", fontSize: 17, lineHeight: 1.65 }}>{p.description}</p>
          </div>
          <div>
            <div className="font-mono" style={{ fontSize: 12, color: "var(--accent)", marginBottom: 12 }}>
              IMPACTO
            </div>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: 17, lineHeight: 1.65 }}>{p.impact}</p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            paddingBottom: 46,
            borderBottom: "1px solid var(--border)",
          }}
        >
          <a data-cursor="" href={p.links.site} target="_blank" rel="noreferrer" className="et-btn et-btn-primary">
            Visitar sitio ↗
          </a>
          <a data-cursor="" href={p.links.github} target="_blank" rel="noreferrer" className="et-btn et-btn-ghost">
            Ver código ↗
          </a>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginTop: 30 }}>
          <button
            data-cursor=""
            onClick={onPrev}
            style={{ cursor: "pointer", textAlign: "left", background: "none", border: "none", color: "var(--muted)", fontFamily: "var(--font-space-grotesk), sans-serif" }}
          >
            <div className="font-mono" style={{ fontSize: 11, marginBottom: 5 }}>← ANTERIOR</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: "var(--text)" }}>{prev.title}</div>
          </button>
          <button
            data-cursor=""
            onClick={onNext}
            style={{ cursor: "pointer", textAlign: "right", background: "none", border: "none", color: "var(--muted)", fontFamily: "var(--font-space-grotesk), sans-serif" }}
          >
            <div className="font-mono" style={{ fontSize: 11, marginBottom: 5 }}>SIGUIENTE →</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: "var(--text)" }}>{next.title}</div>
          </button>
        </div>
      </div>
    </div>
  );
}
