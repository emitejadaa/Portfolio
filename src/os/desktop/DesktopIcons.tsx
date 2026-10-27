"use client";

import { SITE_URL } from "@/content/profile";
import { ui } from "@/content/ui";
import type { IconName, SingletonApp } from "../apps";
import { copyText } from "../hooks";
import { Icon } from "../icons";
import { useT } from "../i18n";
import { useOSStore } from "../store";
import { useContextMenu } from "./ContextMenu";

type DesktopIcon = {
  id: string;
  label: string | ((t: ReturnType<typeof useT>) => string);
  icon: IconName;
  app: SingletonApp;
  link: string;
  code: string;
};

// L·01: accesos directos (proyectos, CV). El CV queda oculto hasta que exista.
const ICONS: DesktopIcon[] = [
  {
    id: "folder-projects",
    label: (t) => `${t(ui.desktop.projectsFolder)}/`,
    icon: "folder",
    app: "projects",
    link: `${SITE_URL}/proyectos`,
    code: "https://github.com/emitejadaa",
  },
  {
    id: "readme",
    label: "README.md",
    icon: "doc",
    app: "readme",
    link: "https://github.com/emitejadaa/emitejadaa",
    code: "https://github.com/emitejadaa/emitejadaa/blob/main/README.md",
  },
];

export function DesktopIcons() {
  const store = useOSStore();
  const t = useT();
  const openMenu = useContextMenu((s) => s.open);

  const open = (icon: DesktopIcon, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    store.getState().openWindow(icon.app, { origin: { x: r.left + r.width / 2, y: r.top + r.height / 2 } });
  };

  return (
    <nav aria-label="Escritorio" className="absolute top-[60px] left-4 z-[1] flex flex-col gap-3">
      {ICONS.map((icon) => {
        const label = typeof icon.label === "string" ? icon.label : icon.label(t);
        return (
          <button
            key={icon.id}
            type="button"
            className="group flex w-[88px] flex-col items-center gap-1.5 rounded-[12px] py-2 outline-none focus-visible:bg-[var(--hover-fill)]"
            onClick={(e) => open(icon, e.currentTarget)}
            onContextMenu={(e) => {
              e.preventDefault();
              const target = e.currentTarget;
              openMenu(e.clientX, e.clientY, [
                { label: t(ui.context.open), keys: ["enter"], onSelect: () => open(icon, target) },
                {
                  label: t(ui.context.openNew),
                  keys: ["mod", "enter"],
                  onSelect: () => window.open(icon.app === "readme" ? icon.link : `/proyectos`, "_blank", "noopener"),
                },
                {
                  label: t(ui.context.copyLink),
                  keys: ["mod", "L"],
                  onSelect: () => void copyText(icon.link).then(() => store.getState().showToast(t(ui.toast.linkCopied))),
                },
                "separator",
                { label: t(ui.context.viewCode), hint: "↗", onSelect: () => window.open(icon.code, "_blank", "noopener") },
              ]);
            }}
          >
            <span className="grid h-14 w-14 place-items-center rounded-[14px] text-text transition-transform duration-200 group-hover:-translate-y-0.5 group-active:scale-95 daylight:text-[var(--tinta)]">
              <Icon name={icon.icon} size={46} weight={1.3} />
            </span>
            <span className="max-w-full truncate rounded-[5px] px-1.5 py-0.5 font-mono text-[12px] text-text group-hover:bg-[var(--hover-fill)] group-focus-visible:bg-accent group-focus-visible:text-accent-ink">
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
