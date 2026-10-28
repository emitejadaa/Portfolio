"use client";

import dynamic from "next/dynamic";
import { appOf, slugOf } from "../apps";
import type { Win } from "../store";

// Each app is its own chunk: the desktop loads without them and a window fetches its app when it opens.
// Server rendering stays on, so a deep link (/proyectos/freewheel) still arrives with its content.
const blank = () => <div className="h-full" />;
const ProjectsApp = dynamic(() => import("./ProjectsApp").then((m) => m.ProjectsApp), { loading: blank });
const ProjectApp = dynamic(() => import("./ProjectApp").then((m) => m.ProjectApp), { loading: blank });
const AboutApp = dynamic(() => import("./AboutApp").then((m) => m.AboutApp), { loading: blank });
const LabApp = dynamic(() => import("./LabApp").then((m) => m.LabApp), { loading: blank });
const TerminalApp = dynamic(() => import("../terminal/TerminalApp").then((m) => m.TerminalApp), { loading: blank });
const ContactApp = dynamic(() => import("./ContactApp").then((m) => m.ContactApp), { loading: blank });
const ReadmeApp = dynamic(() => import("./ReadmeApp").then((m) => m.ReadmeApp), { loading: blank });
const PrefsApp = dynamic(() => import("./PrefsApp").then((m) => m.PrefsApp), { loading: blank });

/** Warm the app chunks once the browser is idle, so the first open of each window is instant. */
export function preloadApps() {
  const n = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (n.connection?.saveData) return;
  void import("./ProjectsApp");
  void import("./ProjectApp");
  void import("./AboutApp");
  void import("./LabApp");
  void import("../terminal/TerminalApp");
  void import("./ContactApp");
  void import("./ReadmeApp");
  void import("./PrefsApp");
}

export function AppContent({ win }: { win: Win }) {
  switch (appOf(win.key)) {
    case "projects":
      return <ProjectsApp />;
    case "project":
      return <ProjectApp key={win.nonce} slug={slugOf(win.key)!} view={win.view} />;
    case "about":
      return <AboutApp view={win.view} />;
    case "lab":
      return <LabApp view={win.view} nonce={win.nonce} />;
    case "terminal":
      return <TerminalApp />;
    case "contact":
      return <ContactApp />;
    case "readme":
      return <ReadmeApp />;
    case "prefs":
      return <PrefsApp />;
    default:
      return null;
  }
}
