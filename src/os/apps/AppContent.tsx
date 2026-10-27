"use client";

import { appOf, slugOf } from "../apps";
import type { Win } from "../store";
import { TerminalApp } from "../terminal/TerminalApp";
import { AboutApp } from "./AboutApp";
import { ContactApp } from "./ContactApp";
import { LabApp } from "./LabApp";
import { ProjectApp } from "./ProjectApp";
import { ProjectsApp } from "./ProjectsApp";
import { ReadmeApp } from "./ReadmeApp";

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
    default:
      return null;
  }
}
