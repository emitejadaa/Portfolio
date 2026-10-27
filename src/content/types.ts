export type Locale = "es" | "en";

/** A string in both site languages. */
export type L = { es: string; en: string };

export type Tier = "destacado" | "proyecto" | "practica";

export type MetricSource = "github" | "vercel" | "render" | "manual";

export type Metric = {
  label: L;
  value: string;
  source: MetricSource;
};

export type Project = {
  slug: string;
  tier: Tier;
  title: string;
  year: number;
  type: L;
  role: L;
  client?: string;
  events?: string[];
  /** One line: card, Spotlight and `cat <slug>`. */
  summary: L;
  /** Overview tab. */
  description: L;
  stack: string[];
  /** Proceso tab. */
  highlights: L[];
  links: {
    demo?: string;
    /** Label shown instead of the raw demo host (e.g. punycode domains). */
    demoLabel?: string;
    repo?: string;
    /** owner/name used for live GitHub metrics; omitted when the repo is private or not ours. */
    repoFullName?: string;
    extra?: { label: L; url: string }[];
  };
  metrics?: Metric[];
  media: {
    screenshots: string[];
    mobile?: string;
    video?: string;
    /** Draw the system diagram instead of (or next to) screenshots. */
    diagram?: "secure-track" | "neurolinked";
  };
  /** Ping the demo for the services widget. False while a deploy is known to be broken. */
  monitor?: boolean;
};
