import { NextResponse } from "next/server";
import { projects } from "@/content/projects";
import type { StatusResponse } from "@/lib/api-types";
import { pingCached } from "@/lib/ping";

// Pings must be real (no data cache); the CDN caches the answer for 5 min, and pingCached keeps a
// request that skips the CDN from pinging every demo again.
export const dynamic = "force-dynamic";

/** Estado de servicios: un punto por cada demo, caché de 5 min. */
export async function GET() {
  const targets = projects.filter((p) => p.links.demo && p.monitor !== false);
  const results = await Promise.all(targets.map((p) => pingCached(p.links.demo!, 5 * 60 * 1000)));
  const body: StatusResponse = {
    services: targets.map((p, i) => ({
      slug: p.slug,
      title: p.title,
      url: p.links.demo!,
      window: p.tier !== "practica",
      ...results[i]!,
    })),
    updatedAt: new Date().toISOString(),
  };
  return NextResponse.json(body, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } });
}
