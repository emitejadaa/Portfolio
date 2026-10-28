"use client";

import type { ReactNode } from "react";
import { availability, contact, identity } from "@/content/profile";
import { ui } from "@/content/ui";
import type { DeploysResponse, GitHubResponse, StatusResponse, WeatherResponse } from "@/lib/api-types";
import { formatBA, useApi, useClockBA, useNow } from "../hooks";
import { Icon } from "../icons";
import { formatNumber, relativeTime, useLocale, useT } from "../i18n";
import { useOS, useOSStore } from "../store";
import { switchTheme } from "../theme";

function Widget({
  label,
  children,
  className = "",
  onClick,
  ariaLabel,
}: {
  label: ReactNode;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`card @container ${onClick ? "card-hover cursor-pointer" : ""} flex w-full flex-col p-3.5 text-left ${className}`}
    >
      <span className="t-label flex items-center gap-1.5 text-text-2">{label}</span>
      {children}
    </Tag>
  );
}

export function ClockWidget() {
  const { time, date } = useClockBA();
  return (
    <Widget label={`${identity.city} · ${identity.utcLabel}`} className="min-h-[120px] justify-between">
      <span className="t-dot text-[min(52px,25cqi)] leading-none whitespace-nowrap" suppressHydrationWarning>
        {time}
      </span>
      <span className="font-mono text-[12px] text-text-2 capitalize" suppressHydrationWarning>
        {date || " "}
      </span>
    </Widget>
  );
}

const WEATHER_GLYPH = (code: number, isDay: boolean) => {
  if (code === 0 || code === 1) return isDay ? "☀" : "☾";
  if (code === 2) return "⛅";
  if (code === 3) return "☁";
  if (code >= 45 && code <= 48) return "≋";
  if (code >= 51 && code <= 67) return "☂";
  if (code >= 71 && code <= 77) return "❄";
  if (code >= 80 && code <= 82) return "☂";
  return "⚡";
};

export function weatherLabel(code: number) {
  const keys = [95, 80, 71, 61, 51, 45, 3, 2, 1, 0];
  const k = keys.find((x) => code >= x) ?? 0;
  return ui.weather[k] ?? ui.weather[0]!;
}

export function WeatherWidget() {
  const t = useT();
  const { data, error } = useApi<WeatherResponse>("/api/weather", 15 * 60 * 1000);
  return (
    <Widget
      label={
        <>
          {t(ui.widgets.weather)}
          {data ? (
            <span className="ml-auto text-[17px] leading-none tracking-normal" aria-hidden="true">
              {WEATHER_GLYPH(data.code, data.isDay)}
            </span>
          ) : null}
        </>
      }
      className="min-h-[120px] justify-between"
    >
      {data ? (
        <>
          <span className="t-dot text-[min(44px,46cqi)] leading-none whitespace-nowrap">{Math.round(data.temp)}°</span>
          <span className="truncate font-mono text-[11.5px] text-text-2">
            {t(weatherLabel(data.code))} · {t(ui.widgets.max)} {Math.round(data.max)}° {t(ui.widgets.min)} {Math.round(data.min)}°
          </span>
        </>
      ) : (
        <span className="mt-auto font-mono text-[12px] text-text-2">{error ? t(ui.widgets.offline) : t(ui.widgets.loading)}</span>
      )}
    </Widget>
  );
}

export function ModeWidget() {
  const store = useOSStore();
  const theme = useOS((s) => s.theme);
  const t = useT();
  return (
    <Widget
      label={t(ui.widgets.mode)}
      className="min-h-[120px] justify-between"
      onClick={() => switchTheme(store)}
      ariaLabel={theme === "midnight" ? t(ui.menu.modeToDaylight) : t(ui.menu.modeToMidnight)}
    >
      <Icon name="moon" size={26} className={`transition-transform duration-500 ${theme === "daylight" ? "rotate-180" : ""}`} />
      <span className="flex flex-col font-mono text-[12px] leading-[1.35]">
        <span className={theme === "midnight" ? "text-text" : "text-text-2 opacity-70"}>{theme === "midnight" ? "● " : "  "}Midnight</span>
        <span className={theme === "daylight" ? "text-text" : "text-text-2 opacity-70"}>{theme === "daylight" ? "● " : "  "}Daylight</span>
      </span>
    </Widget>
  );
}

export function StatusWidget() {
  const store = useOSStore();
  const t = useT();
  return (
    <Widget
      label={
        <>
          <span className="relative mr-0.5 flex h-[7px] w-[7px]">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
            <span className="relative h-[7px] w-[7px] rounded-full bg-accent" />
          </span>
          {t(ui.widgets.status)}
        </>
      }
      className="min-h-[120px] justify-between"
      onClick={() => store.getState().openWindow("contact")}
    >
      <span className="text-[13px] leading-snug">
        <span className="block font-medium">{t(availability.lines[0]!)}</span>
        <span className="block text-text-2">
          {t(availability.lines[1]!)} · {t(availability.lines[2]!)}
        </span>
      </span>
      <span className="text-[13px] font-medium text-accent daylight:text-[var(--klein)]">{t(availability.cta)}</span>
    </Widget>
  );
}

export function LastDeployWidget() {
  const t = useT();
  const locale = useLocale();
  const now = useNow();
  const { data, error } = useApi<DeploysResponse>("/api/deploys", 10 * 60 * 1000);
  const latest = data?.latest;
  return (
    <Widget label={t(ui.widgets.lastDeploy)} className="min-h-[120px] justify-between">
      {latest ? (
        <>
          <span className="t-dot text-[min(30px,30cqi)] leading-none whitespace-nowrap" suppressHydrationWarning>
            {now ? relativeTime(latest.date, locale, now).replace(/^hace /, "") : "··"}
          </span>
          <span className="truncate font-mono text-[12px] text-text-2">
            {latest.title}
            {locale === "es" ? " · hace" : " · ago"}
          </span>
        </>
      ) : (
        <span className="mt-auto font-mono text-[12px] text-text-2">{error || data ? t(ui.widgets.offline) : t(ui.widgets.loading)}</span>
      )}
    </Widget>
  );
}

const LEVELS_MIDNIGHT = ["rgb(255 255 255 / 0.07)", "rgb(59 59 255 / 0.55)", "rgb(139 92 255 / 0.75)", "rgb(176 150 255 / 0.95)", "#d4ff3a"];
const LEVELS_DAYLIGHT = ["rgb(17 17 16 / 0.08)", "rgb(31 59 255 / 0.3)", "rgb(31 59 255 / 0.55)", "rgb(31 59 255 / 0.8)", "#111110"];

const PLACEHOLDER_WEEKS = Array.from({ length: 53 }, () => Array<number>(7).fill(0));

export function GitHubWidget() {
  const t = useT();
  const locale = useLocale();
  const now = useNow();
  const theme = useOS((s) => s.theme);
  const { data, error } = useApi<GitHubResponse>("/api/github", 30 * 60 * 1000);
  const levels = theme === "daylight" ? LEVELS_DAYLIGHT : LEVELS_MIDNIGHT;
  const weeks = data?.weeks?.length ? data.weeks : PLACEHOLDER_WEEKS;

  return (
    <Widget
      label={
        <>
          <Icon name="github" size={12} /> GitHub · {contact.github.handle}
        </>
      }
      className="gap-2.5"
    >
      <div className="flex items-baseline gap-2">
        <span className="t-dot text-[34px] leading-none">{data ? formatNumber(data.total, locale) : "···"}</span>
        <span className="text-[12.5px] leading-tight text-text-2">{t(ui.widgets.contributions)}</span>
      </div>
      <div
        className="grid grid-flow-col gap-[2px]"
        style={{ gridTemplateRows: "repeat(7, auto)", gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}
        role="img"
        aria-label={data ? `${data.total} ${t(ui.widgets.contributions)}` : t(ui.widgets.loading)}
      >
        {weeks.map((week, wi) =>
          week.map((lvl, di) => (
            <span
              key={`${wi}-${di}`}
              className="aspect-square rounded-full"
              style={{ background: levels[Math.max(0, Math.min(4, lvl))], gridColumn: wi + 1, gridRow: di + 1 }}
            />
          )),
        )}
      </div>
      {data?.languages?.length ? (
        <div>
          <div className="flex h-[6px] overflow-hidden rounded-full">
            {data.languages.map((l) => (
              <span key={l.name} style={{ width: `${l.pct}%`, background: l.color ?? "var(--text-2)" }} title={`${l.name} ${l.pct}%`} />
            ))}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-2.5 gap-y-0.5 font-mono text-[11px] text-text-2">
            {data.languages.slice(0, 4).map((l) => (
              <span key={l.name} className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: l.color ?? "var(--text-2)" }} />
                {l.name} {l.pct}%
              </span>
            ))}
          </div>
        </div>
      ) : null}
      {data?.lastCommit ? (
        <a
          href={data.lastCommit.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block truncate font-mono text-[11.5px] text-text-2 hover:text-text"
        >
          <span className="text-text">{t(ui.widgets.lastCommit)}</span> · {data.lastCommit.repo} ·{" "}
          <span suppressHydrationWarning>{now ? relativeTime(data.lastCommit.date, locale, now) : ""}</span>
          <span className="block truncate opacity-80">“{data.lastCommit.message}”</span>
        </a>
      ) : error ? (
        <span className="font-mono text-[12px] text-text-2">{t(ui.widgets.offline)}</span>
      ) : null}
    </Widget>
  );
}

export function ServicesWidget() {
  const t = useT();
  const store = useOSStore();
  const { data, error } = useApi<StatusResponse>("/api/status", 5 * 60 * 1000);
  return (
    <Widget label={t(ui.widgets.services)} className="gap-2">
      {data ? (
        <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
          {data.services.map((s) => (
            <li key={s.slug}>
              <button
                type="button"
                onClick={() => (s.window ? store.getState().openWindow(`project:${s.slug}`) : store.getState().openWindow("lab"))}
                className="flex w-full items-center gap-1.5 truncate text-left text-[12px] text-text-2 hover:text-text"
                title={`${s.title} · ${s.state === "up" ? "ok" : s.state}${s.ms ? ` · ${s.ms} ms` : ""}`}
              >
                <span
                  className={`h-[7px] w-[7px] shrink-0 rounded-full ${s.state === "up" ? "bg-ok" : s.state === "slow" ? "bg-warn" : "bg-danger"}`}
                />
                <span className="truncate">{s.title}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <span className="font-mono text-[12px] text-text-2">{error ? t(ui.widgets.offline) : t(ui.widgets.loading)}</span>
      )}
    </Widget>
  );
}

/** Desktop right column: 3 × 120 px small cells, wider cards span the row. Scrolls on its own when the
 *  screen is too short; the 8 px padding keeps hover lifts and Daylight's ink shadows from being clipped. */
export function WidgetColumn() {
  return (
    <aside
      aria-label="Widgets"
      className="widget-column scroll-area pointer-events-auto absolute top-[48px] right-2 bottom-[104px] grid w-[400px] grid-cols-3 content-start gap-3 p-2"
    >
      <div className="col-span-2">
        <ClockWidget />
      </div>
      <WeatherWidget />
      <div className="col-span-2">
        <StatusWidget />
      </div>
      <ModeWidget />
      <div className="col-span-3">
        <GitHubWidget />
      </div>
      <div className="col-span-2">
        <ServicesWidget />
      </div>
      <LastDeployWidget />
    </aside>
  );
}

export { formatBA };
