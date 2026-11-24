import { NextResponse } from "next/server";
import { getReadme } from "@/lib/readme";

// Dynamic so a failed read is never cached for a day: the GitHub fetch itself sits in the data cache
// (src/lib/readme.ts), and the CDN keeps a good answer for a day.
export const dynamic = "force-dynamic";

/** README de perfil: lo piden la ventana README.md y `cat README.md`, en vez de viajar en cada página. */
export async function GET() {
  const readme = await getReadme();
  if (!readme) {
    return NextResponse.json({ error: "readme_unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json(readme, {
    headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
  });
}
