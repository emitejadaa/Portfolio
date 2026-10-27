import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Same ET monogram as icon.svg, full-bleed: iOS rounds the corners itself. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#07080a" }}>
        <svg width="180" height="180" viewBox="0 0 64 64">
          <g fill="#d4ff3a">
            <rect x="12.5" y="17" width="6" height="30" />
            <rect x="12.5" y="17" width="17" height="6" />
            <rect x="12.5" y="29" width="14" height="6" />
            <rect x="12.5" y="41" width="17" height="6" />
            <rect x="33.5" y="17" width="18" height="6" />
            <rect x="39.5" y="17" width="6" height="30" />
          </g>
        </svg>
      </div>
    ),
    size,
  );
}
