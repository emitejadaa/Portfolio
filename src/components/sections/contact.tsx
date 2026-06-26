import { Reveal } from "@/components/reveal";
import { ContactForm } from "@/components/contact-form";
import { contactContent, socialLinks } from "@/data/portfolio";

const ROWS = [
  { href: `mailto:${socialLinks.email}`, glyph: "✉", label: "Email", sub: socialLinks.email, external: false },
  { href: socialLinks.github, glyph: "</>", label: "GitHub", sub: socialLinks.githubHandle, external: true },
  { href: socialLinks.linkedin, glyph: "in", label: "LinkedIn", sub: socialLinks.linkedinName, external: true },
];

export function Contact() {
  return (
    <section id="contacto" style={{ padding: "90px 0" }}>
      <Reveal>
        <div
          style={{
            position: "relative",
            padding: "clamp(32px, 5vw, 64px)",
            borderRadius: 26,
            border: "1px solid var(--border)",
            background: "var(--surface)",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.6,
              background: "radial-gradient(600px 300px at 80% -20%, var(--glow), transparent 60%)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative" }}>
            <span className="et-eyebrow">06 / CONTACTO</span>
            <h2
              style={{
                margin: "14px 0 18px",
                fontSize: "clamp(30px, 5vw, 52px)",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                maxWidth: "18ch",
              }}
            >
              Hagamos algo juntos.
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
                gap: "clamp(28px, 5vw, 56px)",
                alignItems: "start",
              }}
            >
              <div>
                <p style={{ maxWidth: "42ch", margin: "0 0 28px", color: "var(--muted)", fontSize: 17, lineHeight: 1.6 }}>
                  {contactContent.copy}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {ROWS.map((r) => (
                    <a
                      key={r.label}
                      data-cursor=""
                      href={r.href}
                      target={r.external ? "_blank" : undefined}
                      rel={r.external ? "noreferrer" : undefined}
                      className="et-row"
                    >
                      <span
                        className="et-glyph font-mono"
                        style={{ width: 38, height: 38, fontSize: 14, fontWeight: 700 }}
                        aria-hidden="true"
                      >
                        {r.glyph}
                      </span>
                      <span style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: 600, fontSize: 15 }}>{r.label}</span>
                        <span className="font-mono" style={{ fontSize: 12, color: "var(--muted)" }}>
                          {r.sub}
                        </span>
                      </span>
                    </a>
                  ))}
                </div>
                <div
                  className="font-mono"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 24,
                    fontSize: 12,
                    color: "var(--muted)",
                  }}
                >
                  <span className="et-dot" aria-hidden="true" />
                  {contactContent.responseTime}
                </div>
              </div>

              <div
                style={{
                  borderRadius: 20,
                  border: "1px solid var(--border)",
                  background: "var(--bg2)",
                  padding: "clamp(22px, 3vw, 30px)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <ContactForm emailTo={socialLinks.email} />
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
