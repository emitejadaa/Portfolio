import { getProject, windowProjects } from "@/content/projects";
import { identity } from "@/content/profile";
import { ogSize, renderOgCard } from "@/lib/og";

export const alt = `Proyecto de ${identity.name}`;
export const size = ogSize;
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
  return windowProjects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return new Response("Not found", { status: 404 });
  return renderOgCard({
    file: `proyectos / ${project.slug}.app`,
    kicker: `${project.type.es} · ${project.year}`,
    title: project.title,
    text: project.summary.es,
    chips: project.stack.slice(0, 5),
  });
}
