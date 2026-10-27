import type { IconName } from "./apps";
import { Icon } from "./icons";

type Props = {
  icon: IconName;
  size?: number;
  /** Proyectos: el único acceso con acento (Volt / Klein). */
  accent?: boolean;
  /** Terminal invertida en Daylight. */
  invert?: boolean;
  badge?: string;
  className?: string;
};

export function AppIcon({ icon, size = 64, accent, invert, badge, className = "" }: Props) {
  return (
    <span
      className={`app-icon ${className}`}
      data-accent={accent ? "1" : undefined}
      data-invert={invert ? "1" : undefined}
      style={{ width: size, height: size }}
    >
      <Icon name={icon} size={Math.round(size * 0.45)} weight={1.6} />
      {badge ? (
        <span className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-danger px-1 font-mono text-[11px] font-semibold text-white shadow-[0_0_0_2px_var(--bg)] daylight:shadow-none daylight:outline daylight:outline-1 daylight:outline-[var(--tinta)]">
          {badge}
        </span>
      ) : null}
    </span>
  );
}

export const appIconProps: Record<string, { icon: IconName; accent?: boolean; invert?: boolean }> = {
  projects: { icon: "grid", accent: true },
  about: { icon: "user" },
  lab: { icon: "flask" },
  terminal: { icon: "term", invert: true },
  contact: { icon: "mail" },
  readme: { icon: "doc" },
};
