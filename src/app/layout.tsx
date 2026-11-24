import type { Metadata, Viewport } from "next";
import { Doto, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { identity, SITE_URL } from "@/content/profile";
import { baseOpenGraph } from "@/lib/seo";
import { OSRoot } from "@/os/OSRoot";

// `subsets` only decides what gets preloaded: the other @font-face rules (latin-ext, etc.) stay in the
// CSS and download only if a page actually uses one of their characters. Spanish and English fit in latin.
const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const doto = Doto({ variable: "--font-doto", subsets: ["latin"], weight: "600", display: "swap" });

const description =
  "Portfolio de Emiliano Tejada: un escritorio que se usa como un sistema operativo. Proyectos de hardware, backend e inteligencia artificial.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: identity.tabTitle.es, template: "%s · Emiliano Tejada" },
  description,
  applicationName: "Emiliano Tejada",
  authors: [{ name: identity.name, url: SITE_URL }],
  keywords: ["Emiliano Tejada", "portfolio", "hardware", "backend", "inteligencia artificial", "Buenos Aires"],
  alternates: { canonical: "/" },
  // No og:url here: pages inherit this object, so each shared link keeps its own URL.
  // The image comes from opengraph-image.tsx; X copies title, text and image from Open Graph.
  openGraph: {
    ...baseOpenGraph,
    title: identity.tabTitle.es,
    description: `${identity.headline.es} ${identity.subhead.es}`,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07080a" },
    { media: "(prefers-color-scheme: light)", color: "#f3f1ec" },
  ],
};

/**
 * Runs before paint: mode (?theme → saved → prefers-color-scheme), language, first visit and Ajustes
 * (src/os/prefs.ts). Only the visitor's explicit choices are saved; solid surfaces are also the default on
 * very low-end devices and where src/os/perf.ts measured that frosted glass cannot be drawn smoothly.
 */
const bootScript = `(function(){try{var d=document.documentElement,s=localStorage,q=new URLSearchParams(location.search),t=q.get('theme');if(t!=='daylight'&&t!=='midnight'){t=s.getItem('tejada.theme')}if(t!=='daylight'&&t!=='midnight'){t=matchMedia('(prefers-color-scheme: light)').matches?'daylight':'midnight'}d.dataset.theme=t;var l=s.getItem('tejada.lang');if(l!=='es'&&l!=='en'){l=(navigator.language||'es').toLowerCase().indexOf('en')===0?'en':'es'}d.lang=l;d.dataset.lang=l;if(!s.getItem('tejada.visited')){d.dataset.first='1'}var p={},f={};try{p=JSON.parse(s.getItem('tejada.prefs')||'{}')||{}}catch(e){}try{f=JSON.parse(s.getItem('tejada.perf')||'{}')||{}}catch(e){}if(!p.v&&p.solid===false){delete p.solid}if(p.motion==='reduce'||p.motion==='full'){d.dataset.motion=p.motion}var n=navigator,low=(n.deviceMemory&&n.deviceMemory<=2)||(n.hardwareConcurrency&&n.hardwareConcurrency<=2);if(p.solid===true||(p.solid===undefined&&(low||f.tier==='lite'))){d.dataset.solid='1'}if(p.contrast){d.dataset.contrast='more'}if(p.largeText){d.dataset.text='large'}if(p.cursor===false){d.dataset.cursor='off'}}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      data-theme="midnight"
      className={`${geist.variable} ${geistMono.variable} ${doto.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <OSRoot>{children}</OSRoot>
      </body>
    </html>
  );
}
