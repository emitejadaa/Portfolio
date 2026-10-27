import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, windowProjects } from "@/content/projects";
import { baseOpenGraph } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return windowProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary.es,
    alternates: { canonical: `/proyectos/${slug}` },
    // The card image comes from the opengraph-image.tsx next to this page.
    openGraph: { ...baseOpenGraph, title: `${project.title} · Emiliano Tejada`, description: project.summary.es },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getProject(slug)) notFound();
  return null;
}
