import type { NextConfig } from "next";
import pkg from "./package.json";

const dev = process.env.NODE_ENV !== "production";
// Vercel's toolbar (comments on preview deployments) loads from vercel.live; production never needs it.
const preview = process.env.VERCEL_ENV === "preview";
const toolbar = preview ? " https://vercel.live" : "";

/**
 * Pages are prerendered, so scripts cannot carry a per-request nonce: inline scripts stay allowed (the
 * pre-paint script and Next's own payload), while every other source is pinned to this origin. Images
 * allow https for the profile README's badges; the client only ever calls its own /api routes.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}${toolbar}`,
  `style-src 'self' 'unsafe-inline'${toolbar}`,
  `img-src 'self' data: blob: https:`,
  `font-src 'self'${preview ? " https://vercel.live https://assets.vercel.com" : ""}`,
  `connect-src 'self'${dev ? " ws: wss:" : ""}${preview ? " https://vercel.live wss://ws-us3.pusher.com" : ""}`,
  "media-src 'self'",
  `frame-src ${toolbar ? toolbar.trim() : "'none'"}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(dev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // `uname -a` en la terminal muestra versión y fecha de build.
  env: {
    NEXT_PUBLIC_APP_VERSION: pkg.version,
    NEXT_PUBLIC_BUILD_DATE: new Date().toISOString().slice(0, 10),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // The optimizer only ever resizes the project screenshots; anything else (icons, share cards,
    // API routes) is refused instead of being decoded and re-encoded on request.
    localPatterns: [{ pathname: "/projects/**", search: "" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
