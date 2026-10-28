"use client";

import { useId, type ReactNode } from "react";
import { ui } from "@/content/ui";
import { useMediaQuery } from "../hooks";
import { useLocale, useT } from "../i18n";
import { resetPrefs, setPrefs, usePrefs } from "../prefs";
import { useOS, useOSStore } from "../store";
import { switchTheme } from "../theme";

/** Ajustes: apariencia + accesibilidad. Every change applies at once and is saved in this browser. */
export function PrefsApp() {
  const t = useT();
  const store = useOSStore();
  const theme = useOS((s) => s.theme);
  const locale = useLocale();
  const prefs = usePrefs();
  const systemReduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const finePointer = useMediaQuery("(pointer: fine)");
  const reduced = prefs.motion === "reduce" || (prefs.motion === "auto" && systemReduce);

  return (
    <div className="scroll-area h-full">
      <div className="mx-auto flex max-w-[520px] flex-col gap-7 p-6 max-[820px]:p-4">
        <header className="flex flex-col gap-1.5">
          <h1 className="t-h2">{t(ui.apps.prefs)}</h1>
          <p className="text-[14px] text-text-2">{t(ui.prefs.intro)}</p>
        </header>

        <Group title={t(ui.prefs.appearance)}>
          <Row label={t(ui.prefs.mode)}>
            <Segmented
              label={t(ui.prefs.mode)}
              value={theme}
              options={[
                ["midnight", "Midnight"],
                ["daylight", "Daylight"],
              ]}
              onChange={(next) => switchTheme(store, next)}
            />
          </Row>
          <Row label={t(ui.prefs.language)}>
            <Segmented
              label={t(ui.prefs.language)}
              value={locale}
              options={[
                ["es", "Español"],
                ["en", "English"],
              ]}
              onChange={(next) => store.getState().setLocale(next)}
            />
          </Row>
        </Group>

        <Group title={t(ui.prefs.accessibility)}>
          <Switch
            label={t(ui.prefs.motion)}
            hint={t(ui.prefs.motionHint)}
            on={reduced}
            // Turning it off overrides the system setting only when the system asks for less motion.
            onChange={(on) => setPrefs({ motion: on ? "reduce" : systemReduce ? "full" : "auto" })}
          />
          <Switch label={t(ui.prefs.solid)} hint={t(ui.prefs.solidHint)} on={prefs.solid} onChange={(solid) => setPrefs({ solid })} />
          <Switch label={t(ui.prefs.contrast)} hint={t(ui.prefs.contrastHint)} on={prefs.contrast} onChange={(contrast) => setPrefs({ contrast })} />
          <Switch label={t(ui.prefs.largeText)} hint={t(ui.prefs.largeTextHint)} on={prefs.largeText} onChange={(largeText) => setPrefs({ largeText })} />
          {finePointer ? (
            <Switch
              label={t(ui.prefs.cursor)}
              hint={t(ui.prefs.cursorHint)}
              on={prefs.cursor && !reduced}
              disabled={reduced}
              onChange={(cursor) => setPrefs({ cursor })}
            />
          ) : null}
        </Group>

        <button type="button" className="link w-max text-[13px] text-text-2 hover:text-text" onClick={resetPrefs}>
          {t(ui.prefs.reset)}
        </button>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="t-label text-text-2">{title}</h2>
      <div className="prefs-group flex flex-col">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-[54px] items-center justify-between gap-4 px-4 py-2.5">
      <span className="text-[14.5px] font-medium">{label}</span>
      {children}
    </div>
  );
}

function Switch({
  label,
  hint,
  on,
  disabled,
  onChange,
}: {
  label: string;
  hint: string;
  on: boolean;
  disabled?: boolean;
  onChange: (on: boolean) => void;
}) {
  const id = useId();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-labelledby={`${id}-l`}
      aria-describedby={`${id}-h`}
      disabled={disabled}
      onClick={() => onChange(!on)}
      className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-[var(--hover-fill)] disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent"
    >
      <span className="flex flex-col gap-0.5">
        <span id={`${id}-l`} className="text-[14.5px] font-medium">
          {label}
        </span>
        <span id={`${id}-h`} className="text-[12.5px] leading-snug text-text-2">
          {hint}
        </span>
      </span>
      <span className="switch" data-on={on ? "1" : "0"} aria-hidden="true" />
    </button>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: [T, string][];
  onChange: (value: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="segmented flex shrink-0 p-[3px]">
      {options.map(([v, text]) => (
        <button key={v} type="button" aria-pressed={value === v} className="seg" onClick={() => onChange(v)}>
          {text}
        </button>
      ))}
    </div>
  );
}
