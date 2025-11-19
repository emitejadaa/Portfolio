export const heroContent = {
  name: "Emiliano Tejada",
  roles: ["Hardware", "Backend", "IA"],
  headline:
    "Creo soluciones conectadas que unen electrónica, software y IA para impactar de forma tangible.",
  about:
    "Combino prototipado de hardware, desarrollo backend y modelos de inteligencia artificial para productos preparados para producción. Busco colaborar en equipos que valoren la innovación aplicada.",
  availability: "Listo para nuevos desafíos en proyectos hardware + software",
};

export const socialLinks = {
  email: "emitejadaaragon@gmail.com",
  github: "https://github.com/emitejadaa",
  linkedin: "https://www.linkedin.com/in/emiliano-tejada-7a2791396/",
  whatsapp: "https://wa.me/541168931873",
};

export const projects = [
  {
    title: "NeuroLinked",
    description:
      "Modelo de IA que interpreta señales EEG reales para accionar domótica y devolver autonomía a personas con movilidad reducida.",
    impact: "Le da la posibilidad a cualquiera de controlar domotica de una manera inovadora y accesible",
    tags: ["IA aplicada", "Domótica", "EEG", "Accesibilidad"],
    links: {
      site: "https://neurolinked.vercel.app",
      github: "https://github.com/emitejadaa/NeuroLinked",
    },
  },
  {
    title: "Secure Track",
    description:
      "Plataforma backend + hardware para administrar carritos de computadoras compartidas con monitoreo, cierres seguros y panel web.",
    impact:
      "Reduce pérdidas de equipos y facilita la logística tecnológica en instituciones educativas y empresas.",
    tags: ["Backend", "IoT", "Flask", "Raspberry Pi"],
    links: {
      site: "https://secure-track.vercel.app/",
      github: "https://github.com/3-TIC-ORT/proyecto-3-secure-track",
    },
  },
];

export const experience = [
  {
    role: "Líder técnico - Secure Track",
    organisation: "ORT Belgrano - Proyecto institucional",
    period: "2024",
    details: [
      "Diseñé la arquitectura del carrito inteligente, integrando controladores físicos, backend Flask y dashboard responsive.",
      "Implementé un sistema de retiro por QR que optimiza la gestión de préstamos y devoluciones.",
      "Trabaje con un equipo que aseguro que el proyecto sea moderno, escalable y fácil de usar.",
    ],
    link: "https://secure-track.vercel.app/",
    repo: "https://github.com/3-TIC-ORT/proyecto-3-secure-track/tree/Mrhardware--emi"
  },
  {
    role: "Investigador y desarrollador - NeuroLinked",
    organisation: "ORT Belgrano - Proyecto final",
    period: "2023",
    details: [
      "Entrené modelos de deep learning para clasificar patrones EEG.",
      "Creamos una web en la que cualquiera pueda probar la precision de nuestro modelo con sus propias mediciones eeg.",
      "Validé el prototipo con usuarios y documenté un roadmap para escalarlo.",
    ],
    link: "https://neurolinked.vercel.app",
    repo: "https://github.com/emitejadaa/NeuroLinked"
  },
];

export const skillGroups = [
  {
    title: "Hardware & Embedded",
    items: ["Arduino", "Electrónica", "C", "C++", "Raspberry Pi"],
  },
  {
    title: "AI, Data & Prototyping",
    items: ["Python", "TensorFlow", "NumPy", "Matplotlib", "Google Colab"],
  },
  {
    title: "Backend & Web",
    items: ["Flask", "JavaScript", "SQL", "Postgres", "HTML / CSS"],
  },
  {
    title: "Herramientas & Flujo",
    items: ["Git & GitHub", "Linux", "VS Code", "Figma"],
  },
];

export const education = [
  {
    institution: "Secundario ORT Belgrano",
    detail:
      "Tecnologías de la Información y la Comunicación - Enfoque en hardware, software y gestión de proyectos.",
    period: "2021 - 2026",
  },
  {
    institution: "Colegio San Carlos Diálogos",
    detail: "Educación preescolar y primaria bilingue.",
    period: "2010 - 2020",
  },
  {
    institution: "Cambridge First Certificate (B1)",
    detail: "Certificación internacional de inglés emitida por Cambridge University.",
    period: "2023",
  },
];

export const achievements = [
  {
    title: "Participante en la Tic Experience 2025.",
    description: "Presentando Securetrack",
    site:"https://www.ort.edu.ar/ticexperience/2025/",
  },
  {
    title: "Participante en la MVP Experience 2025.",
    description: "Presentando Neurolinked",
    site:"https://mvpexperience25.vercel.app/"
  },
];

export const contactContent = {
  copy:
    "¿Necesitás llevar una idea desde el prototipo hasta un piloto funcional? Estoy disponible para colaborar en equipos que integren hardware, backend e inteligencia artificial.",
  responseTime: "Respondo en menos de 48 horas",
};
