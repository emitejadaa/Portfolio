import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Nav } from "@/components/nav";
import { ScrollProgress } from "@/components/fx/scroll-progress";
import { ParticleField } from "@/components/fx/particle-field";
import { GridOverlay } from "@/components/fx/grid-overlay";
import { CustomCursor } from "@/components/fx/custom-cursor";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://emiliano-tejada.vercel.app"),
  title: "Emiliano Tejada | Hardware · Backend · IA",
  description:
    "Portfolio de Emiliano Tejada: proyectos de hardware, backend e inteligencia artificial listos para producción.",
  openGraph: {
    title: "Emiliano Tejada | Hardware · Backend · IA",
    description:
      "Ingeniero en formación que integra electrónica, backend e IA para crear soluciones reales.",
    type: "website",
    url: "https://emiliano-tejada.vercel.app",
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Emiliano Tejada | Portfolio",
    description:
      "Proyectos de hardware, backend e inteligencia artificial construidos con enfoque en usuarios reales.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider>
          <ScrollProgress />
          <ParticleField />
          <GridOverlay />
          <CustomCursor />
          <Nav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
