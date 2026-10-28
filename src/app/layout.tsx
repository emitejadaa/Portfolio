import type { Metadata, Viewport } from "next";
import { Doto, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { identity, SITE_URL } from "@/content/profile";
import { getReadme } from "@/lib/readme";
import { baseOpenGraph } from "@/lib/seo";
import { OSRoot } from "@/os/OSRoot";

const geist = Geist({ variable: "--font-geist", subsets: ["latin", "latin-ext"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "latin-ext"], display: "swap" });
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
 * (src/os/prefs.ts). Very low-end devices start with solid surfaces until the visitor says otherwise.
 */
const bootScript = `(function(){try{var d=document.documentElement,q=new URLSearchParams(location.search),t=q.get('theme');if(t!=='daylight'&&t!=='midnight'){t=localStorage.getItem('tejada.theme')}if(t!=='daylight'&&t!=='midnight'){t=matchMedia('(prefers-color-scheme: light)').matches?'daylight':'midnight'}d.dataset.theme=t;var l=localStorage.getItem('tejada.lang');if(l!=='es'&&l!=='en'){l=(navigator.language||'es').toLowerCase().indexOf('en')===0?'en':'es'}d.lang=l;d.dataset.lang=l;if(!localStorage.getItem('tejada.visited')){d.dataset.first='1'}var p={};try{p=JSON.parse(localStorage.getItem('tejada.prefs')||'{}')||{}}catch(e){}if(p.motion==='reduce'||p.motion==='full'){d.dataset.motion=p.motion}var n=navigator;if(p.solid===true||(p.solid===undefined&&((n.deviceMemory&&n.deviceMemory<=2)||(n.hardwareConcurrency&&n.hardwareConcurrency<=2)))){d.dataset.solid='1'}if(p.contrast){d.dataset.contrast='more'}if(p.largeText){d.dataset.text='large'}if(p.cursor===false){d.dataset.cursor='off'}}catch(e){}})();`;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const readme = await getReadme();
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
        <OSRoot readme={readme}>{children}</OSRoot>
      </body>
    </html>
  );
}
