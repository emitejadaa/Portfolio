// Single source of truth for the portfolio content.
// Copy follows the approved /Design mockup. Dashes are hyphens (never em-dashes).

export const profile = {
  name: "Emiliano Tejada",
  handle: "emiliano",
  domain: ".dev",
  disciplines: ["Hardware", "Backend", "IA"] as const,
  availability: "Disponible para nuevos desafíos",
  // Hero: "Construyo en {role}" with the rotating disciplines, headline as subtext.
  buildLine: "Construyo en",
  headline:
    "Soluciones conectadas que unen electrónica, software e IA para impactar de forma tangible.",
  about:
    "Combino prototipado de hardware, desarrollo backend y modelos de inteligencia artificial para productos listos para producción. Me adapto rápido a nuevas tecnologías y disfruto integrando IA y robótica en problemas reales.",
};

export const socialLinks = {
  email: "emitejadaaragon@gmail.com",
  github: "https://github.com/emitejadaa",
  githubHandle: "@emitejadaa",
  linkedin: "https://www.linkedin.com/in/emiliano-tejada-7a2791396/",
  linkedinName: "Emiliano Tejada",
};

export type Project = {
  slug: string;
  title: string;
  description: string;
  impact: string;
  tags: string[];
  image: string;
  links: { site: string; github: string };
};

export const projects: Project[] = [
  {
    slug: "neurolinked",
    title: "NeuroLinked",
    description:
      "Modelo de IA que interpreta señales EEG reales para accionar domótica y devolver autonomía a personas con movilidad reducida.",
    impact:
      "Da la posibilidad a cualquiera de controlar domótica de una manera innovadora y accesible.",
    tags: ["IA aplicada", "Domótica", "EEG", "Accesibilidad"],
    image: "/projects/neurolinked.png",
    links: {
      site: "https://neurolinked.vercel.app",
      github: "https://github.com/emitejadaa/NeuroLinked",
    },
  },
  {
    slug: "secure-track",
    title: "Secure Track",
    description:
      "Plataforma backend + hardware para administrar carritos de computadoras compartidas con monitoreo, cierres seguros y panel web.",
    impact:
      "Reduce pérdidas de equipos y facilita la logística tecnológica en instituciones educativas y empresas.",
    tags: ["Backend", "IoT", "Flask", "Raspberry Pi"],
    image: "/projects/secure-track.png",
    links: {
      site: "https://secure-track.vercel.app/",
      github: "https://github.com/3-TIC-ORT/proyecto-3-secure-track",
    },
  },
  {
    slug: "freewheel",
    title: "FreeWheel",
    description:
      "Backend NestJS para un marketplace P2P de alquiler de autos: autenticación, perfiles, publicación de vehículos, disponibilidad, reservas, pagos mock reemplazables y panel de administración.",
    impact:
      "Infraestructura backend lista para producción, desplegable como función serverless.",
    tags: ["Backend", "NestJS", "Prisma", "PostgreSQL"],
    image: "/projects/freewheel.png",
    links: {
      site: "https://free-wheel.vercel.app",
      github: "https://github.com/emitejadaa/FreeWheel",
    },
  },
  {
    slug: "csbs-form",
    title: "CSBS-DP Form",
    description:
      "Aplicación clínica en Next.js que digitaliza el cuestionario CSBS-DP, calcula los puntajes automáticamente y envía un reporte estructurado por email al profesional de la salud.",
    impact:
      "Automatiza la evaluación clínica y elimina el cálculo manual de puntajes.",
    tags: ["Next.js", "Frontend", "Serverless", "Salud"],
    image: "/projects/csbs-form.png",
    links: {
      site: "https://csbs-form.vercel.app",
      github: "https://github.com/emitejadaa/csbs-form",
    },
  },
  {
    slug: "whattheweather",
    title: "WhatTheWeather",
    description:
      "Dashboard de clima desarrollado con Astro que muestra el estado actual y un pronóstico corto de cualquier ciudad mediante búsqueda.",
    impact:
      "Consulta rápida del clima con una interfaz limpia y totalmente responsive.",
    tags: ["Astro", "Frontend", "API REST"],
    image: "/projects/whattheweather.png",
    links: {
      site: "https://what-the-weather.vercel.app",
      github: "https://github.com/emitejadaa/whatTheWeather",
    },
  },
];

export const skillGroups = [
  { title: "Hardware & Embedded", items: ["Arduino", "Electrónica", "C", "C++", "Raspberry Pi"] },
  { title: "AI, Data & Prototyping", items: ["Python", "TensorFlow", "NumPy", "Matplotlib", "Google Colab"] },
  { title: "Backend & Web", items: ["Flask", "JavaScript", "SQL", "Postgres", "HTML / CSS"] },
  { title: "Herramientas & Flujo", items: ["Git & GitHub", "Linux", "VS Code", "Figma"] },
];

export const experience = [
  {
    role: "Líder técnico - Secure Track",
    organisation: "ORT Belgrano · Proyecto 2024",
    period: "2024",
    details: [
      "Diseñé la arquitectura del carrito inteligente, integrando controladores físicos, backend Flask y dashboard responsive.",
      "Implementé un sistema de retiro por QR que optimiza la gestión de préstamos y devoluciones.",
      "Trabajé con un equipo que aseguró un proyecto moderno, escalable y fácil de usar.",
    ],
    link: "https://secure-track.vercel.app/",
    repo: "https://github.com/3-TIC-ORT/proyecto-3-secure-track/tree/Mrhardware--emi",
  },
  {
    role: "Investigador y desarrollador - NeuroLinked",
    organisation: "ORT Belgrano · Proyecto 2025",
    period: "2025",
    details: [
      "Entrené modelos de deep learning para clasificar patrones EEG.",
      "Creamos una web donde cualquiera puede probar la precisión del modelo con sus propias mediciones EEG.",
      "Validé el prototipo con usuarios y documenté un roadmap para escalarlo.",
    ],
    link: "https://neurolinked.vercel.app",
    repo: "https://github.com/emitejadaa/NeuroLinked",
  },
];

export const education = [
  {
    institution: "Secundario ORT Belgrano",
    detail:
      "Tecnologías de la Información y la Comunicación - enfoque en hardware, software y gestión de proyectos.",
    period: "2021 - 2026",
  },
  {
    institution: "Colegio San Carlos Diálogos",
    detail: "Educación preescolar y primaria bilingüe.",
    period: "2010 - 2020",
  },
  {
    institution: "Cambridge First Certificate (B2)",
    detail: "Certificación internacional de inglés emitida por Cambridge University.",
    period: "2023",
  },
];

export const achievements = [
  {
    title: "TIC Experience 2025",
    description: "Participante presentando Secure Track.",
    site: "https://www.ort.edu.ar/ticexperience/2025/",
  },
  {
    title: "MVP Experience 2025",
    description: "Participante presentando NeuroLinked.",
    site: "https://mvpexperience25.vercel.app/",
  },
];

export const contactContent = {
  copy:
    "¿Necesitás llevar una idea desde el prototipo hasta un piloto funcional? Estoy disponible para colaborar en equipos que integren hardware, backend e inteligencia artificial.",
  responseTime: "Respondo en menos de 48 horas",
};

// GitHub: live values are fetched server-side; these are fallbacks (rate-limit / offline)
// and the language list used in the stats tile.
export const githubStats = {
  username: "emitejadaa",
  url: "https://github.com/emitejadaa",
  fallback: { publicRepos: 31, followers: 4 },
  languages: ["TypeScript", "Python", "C++", "JavaScript", "C#"],
};
