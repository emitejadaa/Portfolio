import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { profile, skillGroups } from "@/data/portfolio";

export function Stack() {
  return (
    <section id="stack" style={{ padding: "80px 0" }}>
      <Reveal>
        <SectionHeading index="01" label="STACK" title="Conocimiento multidisciplinario" />
        <p
          style={{
            maxWidth: "60ch",
            margin: "-18px 0 36px",
            color: "var(--muted)",
            fontSize: 16,
            lineHeight: 1.6,
          }}
        >
          {profile.about}
        </p>
      </Reveal>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 18,
        }}
      >
        {skillGroups.map((group, i) => (
          <Reveal key={group.title} delay={i * 60} style={{ height: "100%" }}>
            <div data-cursor="" className="et-card et-card-hover" style={{ padding: 24, height: "100%" }}>
              <div className="font-mono" style={{ fontSize: 12, color: "var(--accent)", marginBottom: 14 }}>
                {group.title}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {group.items.map((item) => (
                  <span key={item} className="et-chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
