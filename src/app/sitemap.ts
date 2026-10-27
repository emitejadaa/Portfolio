import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/profile";
import { windowProjects } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const windows = ["/proyectos", "/sobre-mi", "/lab", "/contacto"];
  return [
    { url: SITE_URL, lastModified, changeFrequency: "monthly", priority: 1 },
    ...windows.map((path) => ({ url: `${SITE_URL}${path}`, lastModified, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...windowProjects.map((p) => ({
      url: `${SITE_URL}/proyectos/${p.slug}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: p.tier === "destacado" ? 0.7 : 0.5,
    })),
  ];
}
