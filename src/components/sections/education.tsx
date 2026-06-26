import { Reveal } from "@/components/reveal";
import { achievements, education, githubStats } from "@/data/portfolio";

export function Education({ repos }: { repos: number }) {
  return (
    <section
      id="sobre-mi"
      style={{
        padding: "80px 0",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 44,
      }}
    >
      <Reveal>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 30 }}>
          <span className="et-eyebrow">04 / EDUCACIÓN</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {education.map((ed) => (
            <div
              key={ed.institution}
              className="et-card"
              style={{ padding: 20, borderRadius: 16 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>{ed.institution}</h3>
                <span className="font-mono" style={{ fontSize: 12, color: "var(--accent)", whiteSpace: "nowrap" }}>
                  {ed.period}
                </span>
              </div>
              <p style={{ margin: "10px 0 0", color: "var(--muted)", fontSize: 14, lineHeight: 1.55 }}>{ed.detail}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 30 }}>
          <span className="et-eyebrow">05 / LOGROS</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {achievements.map((ac) => (
            <a
              key={ac.title}
              data-cursor=""
              href={ac.site}
              target="_blank"
              rel="noreferrer"
              className="et-card et-card-hover"
              style={{
                textDecoration: "none",
                color: "inherit",
                padding: 20,
                borderRadius: 16,
                display: "flex",
                gap: 14,
                alignItems: "center",
              }}
            >
              <span className="et-glyph" style={{ width: 42, height: 42, borderRadius: 12, background: "var(--surface2)" }}>
                ★
              </span>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{ac.title}</h3>
                <p style={{ margin: "5px 0 0", color: "var(--muted)", fontSize: 14 }}>{ac.description}</p>
              </div>
            </a>
          ))}

          <div
            style={{
              padding: 20,
              borderRadius: 16,
              border: "1px dashed var(--border)",
              display: "flex",
              justifyContent: "space-around",
              textAlign: "center",
            }}
          >
            <div>
              <div className="font-mono" style={{ fontSize: 30, fontWeight: 600, color: "var(--accent)" }}>
                {repos}+
              </div>
              <div className="font-mono" style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
                REPOS PÚBLICOS
              </div>
            </div>
            <div>
              <div className="font-mono" style={{ fontSize: 30, fontWeight: 600, color: "var(--accent)" }}>
                {githubStats.languages.length}
              </div>
              <div className="font-mono" style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
                LENGUAJES
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
