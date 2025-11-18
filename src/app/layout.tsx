import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

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
        className={`${geistSans.variable} ${geistMono.variable} bg-slate-50 antialiased dark:bg-zinc-950`}
      >
        <ThemeProvider>
          <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 text-zinc-900 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900/30 dark:text-zinc-100">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
