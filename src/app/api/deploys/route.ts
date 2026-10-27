import { NextResponse } from "next/server";
import { projects } from "@/content/projects";
import type { DeploysResponse } from "@/lib/api-types";
import { getLatestDeployment, getPushedAt } from "@/lib/github";

export const revalidate = 600;

/** Último deploy: Vercel registra cada deploy en GitHub, así que no hacen falta tokens de Vercel ni Render. */
export async function GET() {
  const withDemo = projects.filter((p) => p.links.demo && p.links.repoFullName && p.monitor !== false);
  const dates = await Promise.all(
    withDemo.map(async (p) => {
      const full = p.links.repoFullName!;
      // Render (game.it) deploys on every push to main; fall back to the last push there.
      const deployed = await getLatestDeployment(full);
      if (deployed) return deployed;
      return p.links.demo!.includes("onrender.com") ? getPushedAt(full) : null;
    }),
  );
  const bySlug: Record<string, string> = {};
  withDemo.forEach((p, i) => {
    const d = dates[i];
    if (d) bySlug[p.slug] = d;
  });
  const latestSlug = Object.entries(bySlug).sort((a, b) => +new Date(b[1]) - +new Date(a[1]))[0]?.[0];
  const latestProject = latestSlug ? projects.find((p) => p.slug === latestSlug) : undefined;
  const body: DeploysResponse = {
    latest: latestProject && latestSlug ? { slug: latestSlug, title: latestProject.title, date: bySlug[latestSlug]! } : null,
    bySlug,
    updatedAt: new Date().toISOString(),
  };
  return NextResponse.json(body);
}
