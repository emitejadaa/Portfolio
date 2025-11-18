export const heroContent = {
  name: "Emiliano Tejada",
  roles: ["Hardware", "Backend", "IA"],
  headline:
    "Creo soluciones conectadas que unen electrónica, software y modelos de IA para impactar de forma tangible.",
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
    impact: "Prototipo finalista dentro del colegio, integra hardware biométrico y experiencia completa de usuario.",
    tags: ["IA aplicada", "Domótica", "EEG", "Accesibilidad"],
    links: {
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
      "Implementé autenticación y registro de uso para asegurar trazabilidad de los equipos.",
      "Coordiné a mi equipo en pruebas de hardware y mejoras de UX basadas en feedback real de docentes.",
    ],
    link: "https://secure-track.vercel.app/",
  },
  {
    role: "Investigador y desarrollador - NeuroLinked",
    organisation: "ORT Belgrano - Proyecto final",
    period: "2023",
    details: [
      "Entrené modelos de deep learning en Colab para clasificar patrones EEG.",
      "Diseñé la electrónica y el pipeline de inferencia en tiempo real para accionar dispositivos del hogar.",
      "Validé el prototipo con usuarios y documenté un roadmap para escalarlo.",
    ],
    link: "https://github.com/emitejadaa/NeuroLinked",
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
    period: "2020 - 2025",
  },
  {
    institution: "Colegio San Carlos Diálogos",
    detail: "Educación primaria con foco en pensamiento científico y valores comunitarios.",
    period: "2009 - 2019",
  },
  {
    institution: "Cambridge First Certificate (B1)",
    detail: "Certificación internacional de inglés emitida por Cambridge University.",
    period: "2022",
  },
];

export const achievements = [
  {
    title: "Participante destacado - Fundación Bullrich",
    description: "Seleccionado para presentar soluciones tecnológicas que mejoran la seguridad ciudadana.",
  },
];

export const contactContent = {
  copy:
    "¿Necesitás llevar una idea desde el prototipo hasta un piloto funcional? Estoy disponible para colaborar en equipos que integren hardware, backend e inteligencia artificial.",
  responseTime: "Respondo en menos de 48 horas",
};
