"use client";

import { useEffect, useRef } from "react";
import { projectsByTier } from "@/content/projects";
import { ui } from "@/content/ui";
import { formatNumber, useLocale, useT } from "../i18n";
import { useGitHub } from "../live";

/** Lab: las prácticas, una línea cada una, sin ventana propia. */
export function LabApp({ view, nonce }: { view?: string; nonce?: number }) {
  const t = useT();
  const locale = useLocale();
  const gh = useGitHub();
  const listRef = useRef<HTMLOListElement>(null);
  const practices = projectsByTier("practica");

  useEffect(() => {
    if (!view) return;
    const row = listRef.current?.querySelector<HTMLElement>(`[data-slug="${view}"]`);
    if (!row) return;
    row.scrollIntoView({ block: "center", behavior: "smooth" });
    row.dataset.flash = "1";
    const id = window.setTimeout(() => delete row.dataset.flash, 1400);
    return () => window.clearTimeout(id);
  }, [view, nonce]);

  return (
    <div className="scroll-area h-full">
      <div className="mx-auto flex max-w-[860px] flex-col gap-5 p-6 max-[820px]:p-4">
        <header>
          <h1 className="t-h2 font-semibold">{t(ui.lab.title)}</h1>
          <p className="mt-1 text-[14px] text-text-2">{t(ui.lab.subtitle)}</p>
        </header>
        <ol ref={listRef} className="flex flex-col">
          {practices.map((p, i) => {
            const commits = p.links.repoFullName ? gh.data?.repoCommits[p.links.repoFullName] : undefined;
            const fallback = p.metrics?.find((m) => m.label.es === "commits")?.value;
            return (
              <li
                key={p.slug}
                data-slug={p.slug}
                className="lab-row grid grid-cols-[34px_1fr_auto] gap-x-3 gap-y-1 border-t border-line py-4 transition-colors duration-700 data-[flash=1]:bg-[var(--hover-fill)] daylight:border-[var(--line)] max-[640px]:grid-cols-[28px_1fr]"
              >
                <span className="pt-0.5 font-mono text-[12px] text-text-2">{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0">
                  <h2 className="text-[16px] font-medium">
                    {p.title} <span className="font-mono text-[12px] font-normal text-text-2">· {p.year}</span>
                  </h2>
                  <p className="mt-0.5 text-[14px] leading-[1.5] text-text-2">{p.summary[locale]}</p>
                  <p className="mt-1.5 font-mono text-[12px] text-text-2">
                    {p.stack.join(" · ")}
                    {commits ?? fallback ? ` · ${commits !== undefined ? formatNumber(commits, locale) : fallback} commits` : ""}
                  </p>
                </div>
                <div className="flex items-start gap-3 pt-0.5 text-[13px] max-[640px]:col-start-2">
                  {p.links.demo ? (
                    <a href={p.links.demo} target="_blank" rel="noopener noreferrer" className="link whitespace-nowrap">
                      {t(ui.lab.site)}
                    </a>
                  ) : null}
                  {p.links.repo ? (
                    <a href={p.links.repo} target="_blank" rel="noopener noreferrer" className="link whitespace-nowrap text-text-2 hover:text-text">
                      {t(ui.lab.repo)}
                    </a>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
