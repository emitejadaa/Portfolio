import type { Metadata } from "next";
import { contact } from "@/content/profile";

export const metadata: Metadata = {
  title: "Contacto",
  description: contact.text.es,
  alternates: { canonical: "/contacto" },
};

export default function ContactPage() {
  return null;
}
