import type { L } from "./types";

export const SITE_URL = "https://portfolio-tejada.vercel.app";

export const identity = {
  name: "Emiliano Tejada",
  firstName: "Emiliano",
  monogram: "ET",
  /** "tejada.os" solo aparece en detalles: prompt, boot y firma del wallpaper. */
  systemName: "tejada.os",
  focus: { es: "Hardware · Backend · IA", en: "Hardware · Backend · AI" } satisfies L,
  tabTitle: {
    es: "Emiliano Tejada · Hardware, Backend e IA",
    en: "Emiliano Tejada · Hardware, Backend & AI",
  } satisfies L,
  headline: {
    es: "Desarrollo soluciones tecnológicas innovadoras.",
    en: "I build innovative technology solutions.",
  } satisfies L,
  subhead: {
    es: "Integro electrónica, software e inteligencia artificial en soluciones eficientes, seguras y optimizadas.",
    en: "I bring electronics, software and artificial intelligence together into efficient, secure and optimized solutions.",
  } satisfies L,
  location: "Buenos Aires, Argentina",
  city: "Buenos Aires",
  timeZone: "America/Argentina/Buenos_Aires",
  utcLabel: "GMT−3",
  coords: { lat: -34.6037, lon: -58.3816 },
  graduation: 2026,
  bootText: { es: "cargando proyectos…", en: "loading projects…" } satisfies L,
};

export const contact = {
  email: "emitejadaaragon@gmail.com",
  github: { handle: "@emitejadaa", url: "https://github.com/emitejadaa", user: "emitejadaa" },
  linkedin: { name: "Emiliano Tejada", url: "https://www.linkedin.com/in/emiliano-tejada-7a2791396/" },
  title: { es: "Hablemos.", en: "Let's talk." } satisfies L,
  text: {
    es: "¿Tenés un proyecto en mente? Estoy disponible para proyectos freelance con horarios flexibles. Respondo en menos de 48 horas.",
    en: "Have a project in mind? I'm available for freelance projects with flexible hours. I reply within 48 hours.",
  } satisfies L,
  sent: {
    es: "Mensaje enviado. Te respondo en menos de 48 horas.",
    en: "Message sent. I'll reply within 48 hours.",
  } satisfies L,
};

export const availability = {
  short: { es: "Disponible", en: "Available" } satisfies L,
  lines: [
    { es: "Disponible para proyectos freelance", en: "Available for freelance projects" },
    { es: "Horarios flexibles", en: "Flexible hours" },
    { es: "Respondo en 48\u00a0h", en: "I reply within 48\u00a0h" },
  ] satisfies L[],
  cta: { es: "Escribime →", en: "Write to me →" } satisfies L,
};

export const about = {
  bioShort: {
    es: "Estudiante de último año en ORT Belgrano, orientación TIC. Desarrollo soluciones tecnológicas que integran hardware, backend e inteligencia artificial.",
    en: "Final-year student at ORT Belgrano, ICT track. I build technology solutions that combine hardware, backend and artificial intelligence.",
  } satisfies L,
  bioLong: {
    es: "Soy Emiliano Tejada, estudiante de 5.º año en ORT Belgrano, orientación Tecnologías de la Información y la Comunicación, con egreso en 2026. Desarrollo soluciones tecnológicas innovadoras que combinan hardware, backend e inteligencia artificial, con foco en la eficiencia, la seguridad y el código optimizado. Trabajé en proyectos que van desde un carrito inteligente para el préstamo de computadoras hasta un modelo de IA que interpreta señales cerebrales y el backend de una plataforma de alquiler de autos entre particulares. A partir de 2027 voy a estudiar Ingeniería Electrónica para profundizar en el desarrollo de hardware.",
    en: "I'm Emiliano Tejada, a 5th-year student at ORT Belgrano in the Information and Communication Technologies track, graduating in 2026. I build innovative technology solutions that combine hardware, backend and artificial intelligence, with a focus on efficiency, security and optimized code. My projects range from a smart cart for lending computers to an AI model that interprets brain signals and the backend of a peer-to-peer car rental platform. Starting in 2027 I'll study Electronic Engineering to go deeper into hardware development.",
  } satisfies L,
  now: [
    { es: "Cursando el último año del secundario", en: "In my final year of high school" },
    { es: "Próximo: Ingeniería Electrónica, 2027", en: "Next: Electronic Engineering, 2027" },
  ] satisfies L[],
  howIWork: [
    { es: "Eficiencia", en: "Efficiency" },
    { es: "Seguridad", en: "Security" },
    { es: "Optimización", en: "Optimization" },
  ] satisfies L[],
  projection: {
    es: "Busco oportunidades para liderar el desarrollo de proyectos tecnológicos y seguir creciendo hacia la ingeniería, con especial interés en el desarrollo de hardware. Trabajo de forma remota y estoy abierto a analizar propuestas.",
    en: "I'm looking for opportunities to lead the development of technology projects and keep growing towards engineering, with a special interest in hardware development. I work remotely and I'm open to discussing proposals.",
  } satisfies L,
  languages: [
    { es: "Español · nativo", en: "Spanish · native" },
    { es: "Inglés · B2, Cambridge", en: "English · B2, Cambridge" },
  ] satisfies L[],
  certifications: [{ name: "Cambridge First Certificate (B2)", year: 2023 }],
};

export type StackGroup = { area: L; items: string[] };

/** Sin niveles: badges del README, portfolio anterior, lenguajes de los repos y lo usado en cada proyecto. */
export const stack: StackGroup[] = [
  {
    area: { es: "Lenguajes", en: "Languages" },
    items: ["C", "C++", "C#", "Python", "JavaScript", "TypeScript", "SQL", "Assembly", "HTML", "CSS", "Bash", "PowerShell"],
  },
  {
    area: { es: "Hardware y embebidos", en: "Hardware & embedded" },
    items: ["Electrónica", "Arduino", "ESP32 (ESP-NOW)", "Raspberry Pi"],
  },
  {
    area: { es: "IA y datos", en: "AI & data" },
    items: [
      "PyTorch",
      "PyTorch Lightning",
      "TensorFlow",
      "Keras",
      "scikit-learn",
      "OpenCV",
      "NumPy",
      "pandas",
      "Matplotlib",
      "MNE",
      "Jupyter",
      "Google Colab",
    ],
  },
  {
    area: { es: "Backend", en: "Backend" },
    items: [
      "Node.js",
      "NestJS",
      "Express",
      "Flask",
      "Prisma",
      "PostgreSQL",
      "SQLite",
      "Supabase",
      "WebSockets",
      "JWT",
      "OAuth",
      "Stripe",
      "Resend",
    ],
  },
  {
    area: { es: "Frontend", en: "Frontend" },
    items: ["React", "Next.js", "Astro", "Vite", "Tailwind CSS", "Motion", "anime.js"],
  },
  {
    area: { es: "Calidad", en: "Quality" },
    items: ["Jest", "Vitest", "Testing Library", "Playwright", "ESLint", "Prettier", "GitHub Actions"],
  },
  {
    area: { es: "Deploy e infraestructura", en: "Deploy & infrastructure" },
    items: ["Vercel", "Render", "Docker", "Neon", "n8n", "Pi-hole"],
  },
  {
    area: { es: "Herramientas", en: "Tools" },
    items: ["Git", "GitHub", "GitLab", "VS Code", "Figma", "Postman", "Unity", "Nodemon", "Claude Code"],
  },
  {
    area: { es: "Sistemas", en: "Systems" },
    items: ["Linux", "Arch Linux", "Hyprland", "Zsh", "Oh My Zsh", "Windows Terminal"],
  },
];

/** Some stack items are Spanish words; everything else is a proper noun. */
export const stackItemLabel = (item: string, locale: "es" | "en") =>
  locale === "en" && item === "Electrónica" ? "Electronics" : item;

export type TimelineItem = { year: string; title: L; detail: L; future?: boolean };

/** Del más viejo al más nuevo: en el bento se dibuja de izquierda a derecha y cierra con Ingeniería Electrónica. */
export const timeline: TimelineItem[] = [
  {
    year: "2010–2020",
    title: { es: "Colegio San Carlos Diálogos", en: "Colegio San Carlos Diálogos" },
    detail: { es: "Preescolar y primaria bilingües.", en: "Bilingual preschool and primary school." },
  },
  {
    year: "2021",
    title: { es: "Ingreso a ORT Belgrano", en: "Joined ORT Belgrano" },
    detail: {
      es: "Orientación Tecnologías de la Información y la Comunicación.",
      en: "Information and Communication Technologies track.",
    },
  },
  {
    year: "2023",
    title: { es: "Cambridge First Certificate (B2)", en: "Cambridge First Certificate (B2)" },
    detail: { es: "Certificación internacional de inglés.", en: "International English certification." },
  },
  {
    year: "2024",
    title: { es: "Secure Track", en: "Secure Track" },
    detail: { es: "Presentado en TIC Experience 2025.", en: "Presented at TIC Experience 2025." },
  },
  {
    year: "2025",
    title: { es: "NeuroLinked", en: "NeuroLinked" },
    detail: {
      es: "MVP Experience y Expo InnovELA 2025 · Secure Track en TIC Experience 2025.",
      en: "MVP Experience and Expo InnovELA 2025 · Secure Track at TIC Experience 2025.",
    },
  },
  {
    year: "2026",
    title: { es: "Egreso de ORT Belgrano", en: "Graduation from ORT Belgrano" },
    detail: {
      es: "FreeWheel, game.it, Pequeños Pasos, framelab y LIBA · MVP Experience 2026 con FreeWheel · TIC Experience 2026 con NeuroLinked.",
      en: "FreeWheel, game.it, Pequeños Pasos, framelab and LIBA · MVP Experience 2026 with FreeWheel · TIC Experience 2026 with NeuroLinked.",
    },
  },
  {
    year: "2027",
    title: { es: "Ingeniería Electrónica", en: "Electronic Engineering" },
    detail: { es: "Inicio de la carrera; universidad a confirmar.", en: "Degree starts; university to be confirmed." },
    future: true,
  },
];

export type EventItem = {
  name: string;
  edition: string;
  detail?: L;
  project: string;
  url?: string;
  linkLabel?: L;
  note?: L;
};

/** Sección propia, sin premios ni fotos por ahora. Del más nuevo al más viejo. */
export const events: EventItem[] = [
  { name: "MVP Experience", edition: "2026", project: "FreeWheel" },
  {
    name: "TIC Experience",
    edition: "2026",
    detail: { es: "23 al 25 de junio, ORT Belgrano", en: "June 23–25, ORT Belgrano" },
    project: "NeuroLinked",
    url: "https://ticexperience2026.vercel.app",
    linkLabel: { es: "sitio", en: "website" },
  },
  {
    name: "MVP Experience",
    edition: "2025",
    detail: { es: "18 de noviembre, Hit Cowork", en: "November 18, Hit Cowork" },
    project: "NeuroLinked",
    url: "https://mvpexperience25.vercel.app/project/neurolinked",
    linkLabel: { es: "ficha del proyecto", en: "project page" },
  },
  {
    name: "Expo InnovELA",
    edition: "2025",
    detail: {
      es: "7 de noviembre, Centro Cultural de la Ciencia (C3)",
      en: "November 7, Centro Cultural de la Ciencia (C3)",
    },
    project: "NeuroLinked",
    url: "https://fundacionestebanbullrich.org/novedades.html",
    linkLabel: { es: "Fundación Esteban Bullrich", en: "Esteban Bullrich Foundation" },
    note: {
      es: "Primer encuentro nacional de innovación para la ELA, organizado por la Fundación Esteban Bullrich: más de 60 proyectos y más de 400 asistentes.",
      en: "The first national innovation gathering for ALS, organized by the Esteban Bullrich Foundation: more than 60 projects and over 400 attendees.",
    },
  },
  {
    name: "TIC Experience",
    edition: "2025",
    project: "Secure Track",
    url: "https://www.ort.edu.ar/ticexperience/2025/",
    linkLabel: { es: "sitio", en: "website" },
  },
];

export type TechObject = { id: string; name: L; query: string };

/** Pasarela 3D: solo forma, un único material clay. */
export const techObjects: TechObject[] = [
  { id: "laptop", name: { es: "Laptop", en: "Laptop" }, query: "Next.js" },
  { id: "raspberry", name: { es: "Raspberry Pi", en: "Raspberry Pi" }, query: "Raspberry Pi" },
  { id: "esp32", name: { es: "ESP32", en: "ESP32" }, query: "ESP32" },
  { id: "git", name: { es: "Git", en: "Git" }, query: "GitHub" },
  { id: "arduino", name: { es: "Arduino", en: "Arduino" }, query: "Arduino" },
  { id: "breadboard", name: { es: "Protoboard con LED", en: "Breadboard with LED" }, query: "Electrónica" },
  { id: "dip", name: { es: "Microcontrolador DIP", en: "DIP microcontroller" }, query: "Assembly" },
  { id: "rack", name: { es: "Servidor en rack", en: "Rack server" }, query: "Backend" },
  { id: "database", name: { es: "Base de datos", en: "Database" }, query: "PostgreSQL" },
  { id: "terminal", name: { es: "Terminal", en: "Terminal" }, query: "Linux" },
];
