import { identity } from "@/content/profile";
import { ogSize, renderOgCard } from "@/lib/og";

export const alt = identity.tabTitle.es;
export const size = ogSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgCard({
    file: "sobre-mi.app",
    kicker: "Portfolio · Buenos Aires",
    title: identity.name,
    text: identity.headline.es,
    chips: ["Hardware", "Backend", "Inteligencia artificial"],
  });
}
