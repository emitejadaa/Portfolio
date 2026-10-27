import { NextResponse, type NextRequest } from "next/server";
import { getProject } from "@/content/projects";
import { ping } from "@/lib/ping";

export const dynamic = "force-dynamic";

/** `ping <slug>` de la terminal: estado y latencia en vivo de una demo. */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug") ?? "";
  const project = getProject(slug);
  if (!project) return NextResponse.json({ error: "unknown_slug" }, { status: 404 });
  if (!project.links.demo) return NextResponse.json({ error: "no_demo" }, { status: 404 });
  const result = await ping(project.links.demo, 6000);
  return NextResponse.json({ slug, url: project.links.demo, ...result }, { headers: { "Cache-Control": "no-store" } });
}
