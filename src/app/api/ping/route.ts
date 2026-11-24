import { NextResponse, type NextRequest } from "next/server";
import { getProject } from "@/content/projects";
import { pingCached } from "@/lib/ping";

export const dynamic = "force-dynamic";

const MAX_AGE_S = 30;

/** `ping <slug>` de la terminal: estado y latencia de una demo, medidos como mucho cada 30 s. */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug") ?? "";
  const project = /^[a-z0-9-]{1,40}$/.test(slug) ? getProject(slug) : undefined;
  if (!project) return NextResponse.json({ error: "unknown_slug" }, { status: 404 });
  if (!project.links.demo) return NextResponse.json({ error: "no_demo" }, { status: 404 });
  const result = await pingCached(project.links.demo, MAX_AGE_S * 1000, 6000);
  return NextResponse.json(
    { slug, url: project.links.demo, ...result },
    { headers: { "Cache-Control": `public, s-maxage=${MAX_AGE_S}, stale-while-revalidate=${MAX_AGE_S * 2}` } },
  );
}
