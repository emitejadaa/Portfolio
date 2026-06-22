import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://emiliano-tejada.vercel.app"),
  title: "Emiliano Tejada | Hardware | Backend | IA",
  description:
    "Portfolio de Emiliano Tejada: proyectos de hardware, backend e inteligencia artificial listos para producción.",
  openGraph: {
    title: "Emiliano Tejada | Hardware | Backend | IA",
    description:
      "Ingeniero en formación que integra electrónica, backend e IA para crear soluciones reales.",
    type: "website",
    url: "https://emiliano-tejada.vercel.app",
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen text-zinc-900 antialiased dark:text-zinc-100`}
      >
        <ThemeProvider>
          <Nav />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
