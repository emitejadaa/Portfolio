import { profile } from "@/data/portfolio";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="font-mono"
      style={{
        padding: "40px 0 60px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap",
        borderTop: "1px solid var(--border)",
        fontSize: 12,
        color: "var(--muted)",
      }}
    >
      <span>
        © {year} {profile.name} · {profile.disciplines.join(" · ")}
      </span>
      <span>Diseñado y construido con intención.</span>
    </footer>
  );
}
