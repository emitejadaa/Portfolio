import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { identity, SITE_URL } from "@/content/profile";

/** Share cards (Open Graph / X) drawn as a Midnight window, like the contact email. */
export const ogSize = { width: 1200, height: 630 };

const C = {
  noche: "#07080a",
  niebla: "#8b9099",
  hueso: "#edeef0",
  volt: "#d4ff3a",
  coral: "#ff5a36",
  idle: "#3a3f48",
  line: "rgba(255,255,255,0.10)",
  lineStrong: "rgba(255,255,255,0.16)",
};

export type OgCard = {
  /** Title-bar file name, e.g. "proyectos / freewheel.app". */
  file: string;
  kicker: string;
  title: string;
  text: string;
  chips: string[];
};

/*
 * Geist (OFL, see og-fonts/OFL.txt) subset to Latin with every OpenType layout table removed:
 *   pyftsubset <font>.ttf --unicodes="U+0020-007E,U+00A0-00FF,U+0152-0153,U+2010-2027,U+2030-203A,U+2190-2193,U+2212,U+20AC"
 *     --layout-features='' --drop-tables+=GSUB,GPOS,GDEF,kern,STAT --name-IDs='*' --name-languages='*' --no-hinting
 * Satori places words using unkerned glyph widths but draws them kerned, which leaves a gap after
 * every kerned word. Without kerning data, layout and drawing agree.
 */
const fontDir = join(process.cwd(), "src/lib/og-fonts");
const font = (file: string) => readFile(join(fontDir, file));

export async function renderOgCard(card: OgCard) {
  const host = SITE_URL.replace(/^https?:\/\//, "");
  const place = `${identity.city} · ${identity.utcLabel}`;
  const [sansSemi, sansRegular, mono] = await Promise.all([
    font("Geist-SemiBold.ttf"),
    font("Geist-Regular.ttf"),
    font("GeistMono-Regular.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "38px 56px 34px",
          background: C.noche,
          backgroundImage:
            "radial-gradient(circle at 92% -8%, rgba(59,59,255,0.55), rgba(7,8,10,0) 48%), radial-gradient(circle at -6% 108%, rgba(139,92,255,0.22), rgba(7,8,10,0) 42%)",
          color: C.hueso,
          fontFamily: "Geist",
        }}
      >
        {/* Menu bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "Geist Mono", fontSize: 19, color: C.niebla }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 10,
                background: C.volt,
                color: C.noche,
                fontFamily: "Geist",
                fontWeight: 600,
                fontSize: 18,
                letterSpacing: -0.5,
              }}
            >
              {identity.monogram}
            </div>
            <div style={{ display: "flex" }}>{identity.systemName}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "7px 16px",
                borderRadius: 999,
                border: `1px solid ${C.lineStrong}`,
                color: C.hueso,
                fontFamily: "Geist",
                fontSize: 18,
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: 999, background: C.volt }} />
              Disponible
            </div>
            <div style={{ display: "flex" }}>{place}</div>
          </div>
        </div>

        {/* Window */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            marginTop: 30,
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(14,16,19,0.82)",
            boxShadow: "0 40px 90px -24px rgba(0,0,0,0.75)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", height: 56, padding: "0 22px", borderBottom: `1px solid ${C.line}` }}>
            <div style={{ display: "flex", gap: 9 }}>
              {[C.coral, C.idle, C.idle].map((color, i) => (
                <div key={i} style={{ width: 13, height: 13, borderRadius: 999, background: color }} />
              ))}
            </div>
            <div style={{ display: "flex", flex: 1, justifyContent: "center", marginRight: 57, fontFamily: "Geist Mono", fontSize: 18, color: C.niebla }}>
              {card.file}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "34px 48px 34px" }}>
            <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 17, letterSpacing: 2.5, color: C.niebla }}>{card.kicker.toUpperCase()}</div>
            <div style={{ display: "flex", alignItems: "flex-end", marginTop: 14, fontSize: 92, fontWeight: 600, letterSpacing: -3.5, lineHeight: 1 }}>
              {card.title}
              <div style={{ width: 18, height: 18, marginLeft: 8, marginBottom: 11, background: C.volt }} />
            </div>
            <div style={{ display: "flex", marginTop: 22, maxWidth: 940, fontSize: 30, lineHeight: 1.35, color: C.niebla }}>{card.text}</div>
            <div style={{ display: "flex", gap: 12, marginTop: "auto" }}>
              {card.chips.map((chip) => (
                <div
                  key={chip}
                  style={{
                    display: "flex",
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: `1px solid ${C.lineStrong}`,
                    background: "rgba(255,255,255,0.04)",
                    fontSize: 20,
                    color: C.hueso,
                  }}
                >
                  {chip}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, fontFamily: "Geist Mono", fontSize: 18, color: C.niebla }}>
          <div style={{ display: "flex" }}>{host}</div>
          <div style={{ display: "flex" }}>github.com/emitejadaa</div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Geist", data: sansSemi, weight: 600, style: "normal" },
        { name: "Geist", data: sansRegular, weight: 400, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
