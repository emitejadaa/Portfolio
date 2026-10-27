import type { NextConfig } from "next";
import pkg from "./package.json";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
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
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
