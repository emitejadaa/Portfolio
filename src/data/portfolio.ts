export const heroContent = {
  name: "Emiliano Tejada",
  roles: ["Hardware", "Backend", "IA"],
  headline:
    "Exploro cómo el hardware, el software y la IA pueden convivir para resolver problemas reales y bien aterrizados.",
  about:
    "Hoy enfoco mis proyectos escolares en hardware embebido con microcontroladores como ESP32, Arduino y Raspberry Pi, y los conecto con servicios backend y modelos de IA cuando la solución lo requiere. Me entusiasma aprender tecnologías nuevas si aportan a la experiencia y accesibilidad de quien usa el producto.",
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
      "Investigación y desarrollo de un modelo de IA capaz de interpretar señales EEG reales para accionar dispositivos domóticos.",
    impact:
      "Prototipo finalista dentro del colegio y seleccionado para MVP Experience 2025, integra hardware biométrico y experiencia completa de usuario.",
    tags: ["IA aplicada", "Domótica", "EEG", "Accesibilidad"],
    links: {
      github: "https://github.com/emitejadaa/NeuroLinked",
    },
  },
  {
    title: "Secure Track",
    description:
      "Carro inteligente que combina hardware propio, backend y panel web para administrar computadoras compartidas en instituciones.",
    impact:
      "Redujo pérdidas de notebooks, simplificó el control de inventario en colegios y fue presentado en TIC Experience 2025 gracias al monitoreo y los cierres seguros.",
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
      "Me encargué del diseño electrónico del carrito y del firmware que conecta Arduino y Raspberry Pi con el backend Flask.",
      "Realicé el cableado y armado físico asegurando lecturas confiables para el monitoreo y el cierre seguro.",
      "Coordiné al equipo en pruebas con docentes para ajustar la experiencia de uso y documentar mejoras futuras.",
      "Representamos el proyecto en TIC Experience 2025 para compartir el enfoque con la comunidad educativa.",
    ],
    link: "https://secure-track.vercel.app/",
  },
  {
    role: "Investigador y desarrollador - NeuroLinked",
    organisation: "ORT Belgrano - Proyecto final",
    period: "2023",
    details: [
      "Investigé bibliografía y datos abiertos para comprender los patrones EEG relevantes para domótica.",
      "Entrené y evalué modelos en Colab, y programé en Python la interfaz que comunica el EEG con la IA en tiempo real.",
      "Probé el prototipo con usuarios finales y redacté aprendizajes para su futura evolución.",
      "Presenté el prototipo en MVP Experience 2025 para recibir feedback de especialistas en innovación.",
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
    "Busco colaborar en proyectos donde pueda aportar mi experiencia en hardware, backend e investigación aplicada, ya sea en entornos escolares, de investigación o en equipos que necesiten alguien que aprenda rápido.",
  responseTime: "Respondo en menos de 48 horas",
};
