import type { Metadata } from "next";
import { identity } from "@/content/profile";

/** Shared Open Graph fields: a page that sets `openGraph` replaces its parent's object entirely. */
export const baseOpenGraph = {
  type: "website",
  siteName: identity.name,
  locale: "es_AR",
  alternateLocale: ["en_US"],
} satisfies Metadata["openGraph"];
