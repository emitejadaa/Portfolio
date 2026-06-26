import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { experience } from "@/data/portfolio";

export function Experience() {
  return (
    <section id="experiencia" style={{ padding: "80px 0" }}>
      <Reveal>
        <SectionHeading index="03" label="EXPERIENCIA" title="Trayectoria" />
      </Reveal>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {experience.map((exp, i) => (
          <Reveal key={exp.role} delay={i * 80}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "clamp(80px, 18vw, 120px) 1fr",
                gap: "clamp(14px, 4vw, 40px)",
                padding: "28px 0",
                borderTop: "1px solid var(--border)",
              }}
            >
              <div>
                <div className="font-mono" style={{ fontSize: 26, color: "var(--accent)", fontWeight: 600 }}>
                  {exp.period}
                </div>
                <div className="font-mono" style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>
                  {exp.organisation}
                </div>
              </div>
              <div>
                <h3 style={{ margin: "0 0 16px", fontSize: 21, fontWeight: 600 }}>{exp.role}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  {exp.details.map((d) => (
                    <div key={d} style={{ display: "flex", gap: 11, color: "var(--muted)", fontSize: 15, lineHeight: 1.5 }}>
                      <span aria-hidden="true" style={{ color: "var(--accent)", flexShrink: 0 }}>
                        ▹
                      </span>
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
                  <a
                    data-cursor=""
                    href={exp.link}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono"
                    style={{
                      fontSize: 12,
                      color: "var(--accent)",
                      textDecoration: "none",
                      border: "1px solid var(--border)",
                      padding: "7px 13px",
                      borderRadius: 8,
                    }}
                  >
                    Ver sitio ↗
                  </a>
                  <a
                    data-cursor=""
                    href={exp.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono"
                    style={{
                      fontSize: 12,
                      color: "var(--muted)",
                      textDecoration: "none",
                      border: "1px solid var(--border)",
                      padding: "7px 13px",
                      borderRadius: 8,
                    }}
                  >
                    Repo ↗
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
