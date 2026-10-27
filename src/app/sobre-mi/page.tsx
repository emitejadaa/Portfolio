import type { Metadata } from "next";
import { about } from "@/content/profile";

export const metadata: Metadata = {
  title: "Sobre mí",
  description: about.bioShort.es,
  alternates: { canonical: "/sobre-mi" },
};

export default function AboutPage() {
  return null;
}
