import type { SVGProps } from "react";
import type { IconName } from "./apps";

type Props = Omit<SVGProps<SVGSVGElement>, "stroke"> & { name: IconName; size?: number; weight?: number };

/** A·05 Íconos de línea: glifo de 1.6 px, mismo set en los dos modos. */
export function Icon({ name, size = 20, weight = 1.6, ...rest }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={weight}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}

const paths: Record<IconName, React.ReactNode> = {
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M4.5 20.2c1.2-3.6 4.1-5.6 7.5-5.6s6.3 2 7.5 5.6" />
    </>
  ),
  flask: (
    <>
      <path d="M9.5 3.5h5" />
      <path d="M10.3 3.5v5.7L5 18.2a1.6 1.6 0 0 0 1.4 2.3h11.2a1.6 1.6 0 0 0 1.4-2.3l-5.3-9V3.5" />
      <path d="M7.4 14.5h9.2" />
    </>
  ),
  term: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2.4" />
      <path d="m7 10 2.6 2.4L7 14.8" />
      <path d="M12.4 15h4.6" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2.2" />
      <path d="m3.8 7 8.2 6 8.2-6" />
    </>
  ),
  doc: (
    <>
      <path d="M6.5 3.5h7.3l3.7 3.7v12.1a1.2 1.2 0 0 1-1.2 1.2H6.5a1.2 1.2 0 0 1-1.2-1.2V4.7a1.2 1.2 0 0 1 1.2-1.2Z" />
      <path d="M13.5 3.6v3.9h3.9" />
      <path d="M8.6 12.3h6.8M8.6 15.8h4.6" />
    </>
  ),
  folder: (
    <>
      <path d="M3.5 7.2a1.7 1.7 0 0 1 1.7-1.7h4l1.9 2.1h7.7a1.7 1.7 0 0 1 1.7 1.7v8.5a1.7 1.7 0 0 1-1.7 1.7H5.2a1.7 1.7 0 0 1-1.7-1.7Z" />
      <path d="M3.5 10h17" />
    </>
  ),
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="m20.5 20.5-5.1-5.1" />
    </>
  ),
  cube: (
    <>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9Z" />
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
    </>
  ),
  moon: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5a8.5 8.5 0 0 1 0 17Z" fill="currentColor" stroke="none" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.8v2.1M12 19.1v2.1M2.8 12h2.1M19.1 12h2.1M5.5 5.5 7 7M17 17l1.5 1.5M5.5 18.5 7 17M17 7l1.5-1.5" />
    </>
  ),
  github: (
    <path d="M9.2 19.6c-4.3 1.4-4.3-2.2-6-2.6m12 4.5v-3.3a2.9 2.9 0 0 0-.8-2.2c2.7-.3 5.5-1.3 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.8 3.3 5.8 3.6 5.8 3.6a4.3 4.3 0 0 0-.1 3.2 4.6 4.6 0 0 0-1.3 3.2c0 4.6 2.8 5.7 5.5 6a2.9 2.9 0 0 0-.8 2.2v3.3" />
  ),
  linkedin: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.4" />
      <path d="M8 10.5v6M8 7.6v.1M11.6 16.5v-3.6c0-1.4 1-2.4 2.3-2.4s2.1.9 2.1 2.4v3.6M11.6 10.5v6" />
    </>
  ),
  link: (
    <>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 1 0-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 1 0 5.7 5.7l1-1" />
    </>
  ),
  copy: (
    <>
      <rect x="8.5" y="8.5" width="12" height="12" rx="2" />
      <path d="M15.5 8.5V5.2a1.7 1.7 0 0 0-1.7-1.7H5.2a1.7 1.7 0 0 0-1.7 1.7v8.6a1.7 1.7 0 0 0 1.7 1.7h3.3" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.3 2.4 3.4 5.2 3.4 8.5s-1.1 6.1-3.4 8.5c-2.3-2.4-3.4-5.2-3.4-8.5S9.7 5.9 12 3.5Z" />
    </>
  ),
  arrow: <path d="M7 17 17 7M8.5 7H17v8.5" />,
  sliders: (
    <>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle cx="15" cy="7" r="2.2" />
      <circle cx="9" cy="17" r="2.2" />
    </>
  ),
};
