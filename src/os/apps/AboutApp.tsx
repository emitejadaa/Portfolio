"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { about, contact, events, identity, stack, stackItemLabel, timeline } from "@/content/profile";
import { ui } from "@/content/ui";
import { Icon } from "../icons";
import { useLocale, useT } from "../i18n";
import { useOSStore } from "../store";

type View = "bento" | "bio" | "stack" | "timeline";

export function AboutApp({ view: initial }: { view?: string }) {
  const [view, setView] = useState<View>((["bio", "stack", "timeline"] as string[]).includes(initial ?? "") ? (initial as View) : "bento");
  const t = useT();
  // `@container`: the layout follows the width of the window (or sheet), not the viewport, so a narrow
  // desktop window and a phone get the same single column.
  return (
    <div className="scroll-area @container h-full">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-[920px] p-4 @[720px]:p-5"
        >
          {view === "bento" ? (
            <Bento onOpen={setView} />
          ) : (
            <div className="flex flex-col gap-6">
              <button type="button" onClick={() => setView("bento")} className="w-max font-mono text-[13px] text-text-2 hover:text-text">
                {t(ui.about.back)}
              </button>
              {view === "bio" ? <BioView /> : null}
              {view === "stack" ? <StackView /> : null}
              {view === "timeline" ? <TimelineView /> : null}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Cell({
  label,
  children,
  className = "",
  onClick,
  action,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  action?: string;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`card ${onClick ? "card-hover cursor-pointer" : ""} flex min-h-0 flex-col gap-3 p-4 text-left ${className}`}
    >
      <span className="t-label flex items-center justify-between text-text-2">
        {label}
        {action ? <span className="normal-case tracking-normal">{action} →</span> : null}
      </span>
      {children}
    </Tag>
  );
}

/** L·03 Sobre mí · bento: se lee en 10 segundos. */
function Bento({ onOpen }: { onOpen: (v: View) => void }) {
  const t = useT();
  const locale = useLocale();
  const store = useOSStore();
  const topStack = ["Python", "TypeScript", "C++", "NestJS", "PyTorch", "Raspberry Pi", "Arduino", "Next.js", "PostgreSQL"];

  // One column by default; the 12-column bento only when the container is wide enough. The spans live
  // behind the same query as `grid-cols-12`: a span inside a 1-column grid makes implicit columns.
  return (
    <div className="grid grid-cols-1 gap-3 @[720px]:grid-cols-12">
      <Cell label={t(ui.about.photo)} className="min-h-[220px] justify-between @[720px]:col-span-4 @[720px]:row-span-2 @[720px]:min-h-[300px]">
        <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-[10px]">
          <div className="halftone absolute inset-0 opacity-[0.07] daylight:opacity-25" style={{ ["--dot" as string]: "2px" }} />
          <div className="relative grid h-36 w-36 place-items-center rounded-full border border-line-strong bg-[radial-gradient(circle_at_30%_30%,rgb(139_92_255/.45),rgb(59_59_255/.15)_60%,transparent)] daylight:rounded-none daylight:border-[var(--tinta)] daylight:bg-[var(--klein)] daylight:shadow-[6px_6px_0_var(--tinta)]">
            <span className="t-dot text-[56px] leading-none daylight:text-[var(--blanco-roto)]">{identity.monogram}</span>
          </div>
        </div>
        <span className="text-[14px]">
          <span className="font-medium">{identity.name}</span>
          <span className="block font-mono text-[12px] text-text-2">{identity.location}</span>
        </span>
      </Cell>

      <Cell label={t(ui.about.bio)} className="@[720px]:col-span-8" onClick={() => onOpen("bio")} action={t(ui.about.readMore)}>
        <p className="text-[17px] leading-[1.5]">{about.bioShort[locale]}</p>
      </Cell>

      <Cell label={t(ui.about.stack)} className="@[720px]:col-span-4" onClick={() => onOpen("stack")} action={t(ui.about.seeAll)}>
        <div className="flex flex-wrap gap-1.5">
          {topStack.map((s) => (
            <span key={s} className="chip h-6 px-2 text-[11.5px]" title={s}>
              {s}
            </span>
          ))}
        </div>
      </Cell>

      <Cell label={t(ui.about.now)} className="@[720px]:col-span-4">
        <ul className="flex flex-col gap-1.5 text-[14px]">
          {about.now.map((n, i) => (
            <li key={i} className={i === 0 ? "" : "text-text-2"}>
              {n[locale]}
            </li>
          ))}
        </ul>
        <div className="mt-auto">
          <span className="t-label text-text-2">{t(ui.about.howIWork)}</span>
          <p className="mt-1 text-[14px] font-medium">{about.howIWork.map((h) => h[locale]).join(" · ")}</p>
        </div>
      </Cell>

      <Cell label={t(ui.about.timeline)} className="@[720px]:col-span-8" onClick={() => onOpen("timeline")} action={t(ui.about.seeAll)}>
        <MiniTimeline />
      </Cell>

      <Cell label={t(ui.about.contact)} className="@[720px]:col-span-4">
        <div className="flex flex-col gap-2 text-[14px]">
          <a href={`mailto:${contact.email}`} className="link w-max max-w-full truncate" onClick={(e) => e.stopPropagation()}>
            {contact.email}
          </a>
          <a href={contact.github.url} target="_blank" rel="noopener noreferrer" className="link flex w-max items-center gap-1.5">
            <Icon name="github" size={14} /> {contact.github.handle}
          </a>
          <a href={contact.linkedin.url} target="_blank" rel="noopener noreferrer" className="link flex w-max items-center gap-1.5">
            <Icon name="linkedin" size={14} /> {contact.linkedin.name}
          </a>
        </div>
        <button type="button" className="btn mt-auto h-9 w-max px-3 text-[13px]" onClick={() => store.getState().openWindow("contact")}>
          contacto.app →
        </button>
      </Cell>
    </div>
  );
}

/** Línea de tiempo de 2010 a 2027, de izquierda a derecha. */
function MiniTimeline() {
  const locale = useLocale();
  // `hover` is transient (mouse over / keyboard focus); `picked` is what a tap leaves behind, so on a
  // touch screen the selection does not vanish when the finger lifts.
  const [hover, setHover] = useState<number | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const active = hover ?? picked ?? timeline.length - 2;
  return (
    <div className="flex flex-col gap-3">
      <div className="relative mt-2 flex items-center justify-between">
        <span className="absolute inset-x-1 top-1/2 h-px -translate-y-1/2 bg-line-strong daylight:bg-[var(--tinta)]" />
        {timeline.map((tl, i) => (
          <span
            key={tl.year}
            onPointerEnter={(e) => e.pointerType === "mouse" && setHover(i)}
            onPointerLeave={() => setHover(null)}
            onClick={(e) => {
              // The whole card is a button that opens the full journey: a dot only selects its year.
              e.stopPropagation();
              setPicked(i);
            }}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            tabIndex={0}
            role="button"
            aria-label={`${tl.year}: ${tl.title[locale]}`}
            // The ::after widens the tap target to ~44 × 36 px without moving the 12 px dot.
            className="relative z-10 flex flex-col items-center gap-2 outline-none after:absolute after:-inset-x-4 after:-inset-y-3 after:content-['']"
          >
            <span
              className={`h-3 w-3 rounded-full border transition-transform duration-200 daylight:rounded-none ${
                i === active ? "scale-125 border-accent bg-accent" : tl.future ? "border-dashed border-text-2 bg-bg" : "border-text bg-text"
              }`}
            />
          </span>
        ))}
      </div>
      <div className="flex items-baseline justify-between font-mono text-[11px] text-text-2">
        <span>2010</span>
        <span>2027</span>
      </div>
      {/* Every entry sits in the same grid cell and only the active one is visible: the box is as tall as the
          longest entry, so picking a year never shifts what is below. */}
      <div className="grid text-[14px] leading-snug" aria-live="polite">
        {timeline.map((tl, i) => (
          <p key={tl.year} className={`col-start-1 row-start-1 ${i === active ? "" : "invisible"}`} aria-hidden={i === active ? undefined : true}>
            <span className="font-mono text-[12px] text-text-2">{tl.year} · </span>
            <span className="font-medium">{tl.title[locale]}</span>
            <span className="block text-text-2">{tl.detail[locale]}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

function BioView() {
  const t = useT();
  const locale = useLocale();
  return (
    <article className="flex max-w-[64ch] flex-col gap-5">
      <h1 className="t-h2 font-semibold">{t(ui.about.title)}</h1>
      <p className="text-[17px] leading-[1.7]">{about.bioLong[locale]}</p>
      <div>
        <h2 className="t-label text-text-2">{t(ui.about.projection)}</h2>
        <p className="mt-2 text-[16px] leading-[1.65] text-text-2">{about.projection[locale]}</p>
      </div>
    </article>
  );
}

function StackView() {
  const t = useT();
  const locale = useLocale();
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="t-h2 font-semibold">{t(ui.about.stack)}</h1>
        <p className="mt-1 text-[14px] text-text-2">{t(ui.about.stackHint)}</p>
      </div>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-1 @[720px]:grid-cols-[200px_1fr] @[720px]:gap-y-4">
        {stack.map((g) => (
          <div key={g.area.es} className="contents">
            <dt className="t-label pt-3 text-text-2 @[720px]:pt-1.5">{g.area[locale]}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {g.items.map((it) => (
                <span key={it} className="chip text-text daylight:text-[var(--tinta)]">
                  {stackItemLabel(it, locale)}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function TimelineView() {
  const t = useT();
  const locale = useLocale();
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="t-h2 font-semibold">{t(ui.about.timeline)}</h1>
        <ol className="mt-4 flex flex-col">
          {[...timeline].reverse().map((tl) => (
            <li key={tl.year} className="grid grid-cols-[110px_1fr] gap-4 border-t border-line py-3 daylight:border-[var(--line)] @[640px]:grid-cols-[150px_1fr]">
              <span className={`t-dot text-[15px] leading-tight whitespace-nowrap @[640px]:text-[20px] ${tl.future ? "text-text-2" : ""}`}>{tl.year}</span>
              <span>
                <span className="block text-[15px] font-medium">{tl.title[locale]}</span>
                <span className="block text-[14px] text-text-2">{tl.detail[locale]}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="t-label text-text-2">{t(ui.about.events)}</h2>
        <ul className="mt-3 grid grid-cols-1 gap-3 @[720px]:grid-cols-2">
          {events.map((e) => (
            <li key={`${e.name}-${e.edition}`} className="card flex flex-col gap-1 p-4">
              <span className="flex items-baseline justify-between gap-2">
                <span className="text-[15px] font-medium">
                  {e.name} {e.edition}
                </span>
                <span className="font-mono text-[12px] text-text-2">{e.project}</span>
              </span>
              {e.detail ? <span className="text-[13px] text-text-2">{e.detail[locale]}</span> : null}
              {e.note ? <span className="text-[13px] leading-snug">{e.note[locale]}</span> : null}
              {e.url ? (
                <a href={e.url} target="_blank" rel="noopener noreferrer" className="link mt-1 w-max text-[13px] text-text-2 hover:text-text">
                  {e.linkLabel?.[locale] ?? "link"} ↗
                </a>
              ) : (
                <span className="mt-1 font-mono text-[12px] text-text-2">{t(ui.about.noLink)}</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <div className="grid grid-cols-1 gap-6 @[720px]:grid-cols-2">
        <section>
          <h2 className="t-label text-text-2">{t(ui.about.certifications)}</h2>
          <ul className="mt-3 flex flex-col gap-2 text-[15px]">
            {about.certifications.map((c) => (
              <li key={c.name}>
                {c.name} <span className="font-mono text-[12px] text-text-2">· {c.year}</span>
              </li>
            ))}
            <li className="text-text-2 opacity-60">{t(ui.about.nextCerts)}</li>
          </ul>
        </section>
        <section>
          <h2 className="t-label text-text-2">{t(ui.about.languages)}</h2>
          <ul className="mt-3 flex flex-col gap-2 text-[15px]">
            {about.languages.map((l) => (
              <li key={l.es}>{l[locale]}</li>
            ))}
          </ul>
        </section>
      </div>

      <section>
        <h2 className="t-label text-text-2">{t(ui.about.projection)}</h2>
        <p className="mt-2 max-w-[64ch] text-[16px] leading-[1.65]">{about.projection[locale]}</p>
      </section>
    </div>
  );
}
