"use client";

import { ui } from "@/content/ui";
import { Icon } from "../icons";
import { useT } from "../i18n";
import { useReadme } from "../live";

/** README.md del escritorio: el README de perfil de GitHub, pedido al abrir la ventana. */
export function ReadmeApp() {
  const { data: readme, error } = useReadme();
  const t = useT();
  return (
    <div className="scroll-area h-full">
      <div className="mx-auto max-w-[760px] p-6 max-[820px]:p-4">
        <a
          href="https://github.com/emitejadaa/emitejadaa"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-5 flex w-max items-center gap-2 font-mono text-[12px] text-text-2 hover:text-text"
        >
          <Icon name="github" size={14} /> {t(ui.readme.source)} ↗
        </a>
        {readme ? (
          // HTML generated server-side by marked with raw HTML escaped and only http(s)/mailto URLs (src/lib/readme.ts).
          <div className="readme" dangerouslySetInnerHTML={{ __html: readme.html }} />
        ) : error ? (
          <p className="text-text-2">{t(ui.readme.error)}</p>
        ) : (
          <p className="font-mono text-[12px] text-text-2">{t(ui.widgets.loading)}</p>
        )}
      </div>
    </div>
  );
}
