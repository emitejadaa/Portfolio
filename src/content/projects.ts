import type { Project, Tier } from "./types";

// Fuente: doc "tejada.os · contenido crudo del portfolio" (13–14 oct 2026).
// Regla del doc: no se dice si algo está en desarrollo o en producción, ni se nombra a compañeros.

export const projects: Project[] = [
  {
    slug: "freewheel",
    tier: "destacado",
    title: "FreeWheel",
    year: 2026,
    type: { es: "Plataforma web · startup", en: "Web platform · startup" },
    role: { es: "Backend", en: "Backend" },
    events: ["MVP Experience 2026"],
    summary: {
      es: "Plataforma de alquiler de autos entre particulares.",
      en: "Peer-to-peer car rental platform.",
    },
    description: {
      es: "FreeWheel es una plataforma de alquiler de autos entre particulares para Argentina, desarrollada como proyecto de startup. Desarrollé el backend completo: autenticación, verificación de identidad, publicaciones, disponibilidad, reservas con entrega y devolución por código QR, pagos con Stripe y administración.",
      en: "FreeWheel is a peer-to-peer car rental platform for Argentina, built as a startup project. I developed the entire backend: authentication, identity verification, listings, availability, bookings with QR-code handover and return, Stripe payments and administration.",
    },
    stack: [
      "NestJS",
      "TypeScript",
      "Prisma",
      "PostgreSQL (Neon)",
      "JWT",
      "Google OAuth",
      "Stripe",
      "Jest",
      "Vercel serverless",
      "Docker",
      "Render",
    ],
    highlights: [
      {
        es: "Registro en dos pasos con verificación de email y control de mayoría de edad.",
        en: "Two-step sign-up with email verification and an age check.",
      },
      {
        es: "Verificación de identidad con DNI, licencia y selfie, leídos con IA y revisión manual.",
        en: "Identity verification with national ID, driver's license and selfie, read by AI plus manual review.",
      },
      {
        es: "Circuito completo de reserva: pedido, aceptación, pago, entrega con QR, devolución y calificación.",
        en: "Full booking flow: request, acceptance, payment, QR handover, return and rating.",
      },
      {
        es: "IA en cuatro puntos: especificaciones del auto, validación de fotos, lectura de documentos y transcripción de notas de voz.",
        en: "AI in four places: car specs, photo validation, document reading and voice-note transcription.",
      },
      {
        es: "Servicio de lectura de documentos en Docker sobre Render.",
        en: "Document-reading service running in Docker on Render.",
      },
      { es: "Interfaz en 5 idiomas.", en: "Interface in 5 languages." },
      { es: "Presentado en MVP Experience 2026.", en: "Presented at MVP Experience 2026." },
    ],
    links: {
      demo: "https://freewheel-5a.vercel.app",
      repo: "https://github.com/emitejadaa/FreeWheel",
      repoFullName: "emitejadaa/FreeWheel",
      extra: [
        { label: { es: "Landing", en: "Landing" }, url: "https://landing-page-free-wheel.vercel.app" },
        { label: { es: "API", en: "API" }, url: "https://free-wheel-back.vercel.app" },
      ],
    },
    metrics: [
      { label: { es: "commits en el backend", en: "backend commits" }, value: "220", source: "github" },
      { label: { es: "idiomas", en: "languages" }, value: "5", source: "manual" },
    ],
    media: {
      screenshots: ["/projects/freewheel/app.webp", "/projects/freewheel/landing.webp"],
      mobile: "/projects/freewheel/mobile.webp",
    },
  },
  {
    slug: "secure-track",
    tier: "destacado",
    title: "Secure Track",
    year: 2024,
    type: { es: "Hardware + web", en: "Hardware + web" },
    role: { es: "Hardware", en: "Hardware" },
    events: ["TIC Experience 2025"],
    summary: {
      es: "Carrito inteligente para el préstamo de computadoras.",
      en: "Smart cart for lending computers.",
    },
    description: {
      es: "Secure Track es un sistema de hardware y software para administrar carritos de computadoras compartidas en instituciones educativas. Combina cierres electrónicos controlados por una Raspberry Pi, retiro por código QR y un panel web con vistas para estudiantes, profesores y asistentes. Estuve a cargo del desarrollo del hardware.",
      en: "Secure Track is a hardware and software system for managing shared computer carts in schools. It combines electronic locks controlled by a Raspberry Pi, QR-code checkout and a web dashboard with views for students, teachers and assistants. I was in charge of the hardware development.",
    },
    stack: ["Raspberry Pi", "Electrónica", "Python", "Flask", "HTML", "CSS", "JavaScript"],
    highlights: [
      { es: "Control físico de cierres.", en: "Physical lock control." },
      { es: "Retiro y devolución por QR.", en: "QR checkout and return." },
      { es: "Vistas por rol: estudiantes, profesores y asistentes.", en: "Role-based views: students, teachers and assistants." },
      { es: "Presentado en TIC Experience 2025.", en: "Presented at TIC Experience 2025." },
    ],
    links: {
      demo: "https://secure-track.vercel.app",
      repo: "https://github.com/3-TIC-ORT/proyecto-3-secure-track/tree/Mrhardware--emi",
    },
    media: {
      screenshots: ["/projects/secure-track/site.webp"],
      diagram: "secure-track",
    },
  },
  {
    slug: "neurolinked",
    tier: "destacado",
    title: "NeuroLinked",
    year: 2025,
    type: { es: "IA + IoT", en: "AI + IoT" },
    role: { es: "Modelo de IA", en: "AI model" },
    events: ["MVP Experience 2025", "Expo InnovELA 2025", "TIC Experience 2026"],
    summary: {
      es: "IA que interpreta señales cerebrales para controlar dispositivos del hogar.",
      en: "AI that interprets brain signals to control home devices.",
    },
    description: {
      es: "NeuroLinked es un modelo de inteligencia artificial que interpreta señales de electroencefalograma (EEG) para controlar dispositivos de domótica, con el objetivo de dar autonomía a personas con movilidad reducida. Me dediqué al desarrollo del modelo: preprocesamiento de las señales, arquitectura y entrenamiento.",
      en: "NeuroLinked is an artificial intelligence model that interprets electroencephalogram (EEG) signals to control smart-home devices, aiming to give autonomy to people with reduced mobility. I focused on the model: signal preprocessing, architecture and training.",
    },
    stack: ["Python", "PyTorch", "PyTorch Lightning", "MNE", "Google Colab", "API REST", "Tuya IoT"],
    highlights: [
      {
        es: "Dataset PhysioNet EEG Motor Movement/Imagery: 79 de sus 109 sujetos, 64 canales.",
        en: "PhysioNet EEG Motor Movement/Imagery dataset: 79 of its 109 subjects, 64 channels.",
      },
      {
        es: "Clasificación de reposo frente a imaginación del movimiento de la mano izquierda.",
        en: "Classifies rest versus imagined movement of the left hand.",
      },
      {
        es: "Red convolucional con bloques Transformer, unos 70 mil parámetros.",
        en: "Convolutional network with Transformer blocks, about 70k parameters.",
      },
      { es: "76,5 % de accuracy en test.", en: "76.5% test accuracy." },
      { es: "Predicción en 0,2 a 2 s.", en: "Predictions in 0.2 to 2 s." },
      {
        es: "Presentado en MVP Experience 2025, Expo InnovELA 2025 y TIC Experience 2026.",
        en: "Presented at MVP Experience 2025, Expo InnovELA 2025 and TIC Experience 2026.",
      },
    ],
    links: {
      demo: "https://neurolinked.vercel.app",
      repo: "https://github.com/emitejadaa/NeuroLinked",
      repoFullName: "emitejadaa/NeuroLinked",
    },
    metrics: [
      { label: { es: "accuracy en test", en: "test accuracy" }, value: "76,5 %", source: "manual" },
      { label: { es: "commits", en: "commits" }, value: "78", source: "github" },
    ],
    // Sin capturas mientras el deploy da 404: se dibujan las señales EEG con los datos del modelo.
    media: { screenshots: [], diagram: "neurolinked" },
    // El deploy da 404 hasta que se arregle: no se monitorea para no mostrarlo caído.
    monitor: false,
  },
  {
    slug: "pequenos-pasos",
    tier: "destacado",
    title: "Pequeños Pasos",
    year: 2026,
    type: { es: "Sitio + panel · cliente", en: "Website + dashboard · client" },
    role: { es: "Desarrollo completo", en: "Full development" },
    client: "Consultorio Pequeños Pasos",
    summary: {
      es: "Sitio y panel para un consultorio pediátrico.",
      en: "Website and dashboard for a pediatric practice.",
    },
    description: {
      es: "Sitio web del consultorio pediátrico Pequeños Pasos, en Vicente López. Desarrollé la web completa: equipo, vacunas, coberturas y turnos, un cuestionario de desarrollo infantil (CSBS-DP) con puntaje automático y un panel de acceso para los profesionales.",
      en: "Website for Pequeños Pasos, a pediatric practice in Vicente López. I built the whole site: team, vaccines, insurance coverage and appointments, a child-development questionnaire (CSBS-DP) with automatic scoring and a login dashboard for the practitioners.",
    },
    stack: ["Astro", "TypeScript", "Vercel"],
    highlights: [
      { es: "Dominio propio.", en: "Custom domain." },
      {
        es: "Preferencias de tema, movimiento reducido y tamaño de texto.",
        en: "Theme, reduced-motion and text-size preferences.",
      },
      { es: "Panel profesional sin registro abierto.", en: "Practitioner dashboard with no open sign-up." },
      { es: "Integra la herramienta CSBS-DP.", en: "Integrates the CSBS-DP tool." },
    ],
    links: {
      demo: "https://www.xn--pequeospasos-ehb.app",
      demoLabel: "pequeñospasos.app",
    },
    media: {
      screenshots: ["/projects/pequenos-pasos/home.webp"],
      mobile: "/projects/pequenos-pasos/mobile.webp",
    },
  },
  {
    slug: "game-it",
    tier: "destacado",
    title: "game.it",
    year: 2026,
    type: { es: "Juegos web en tiempo real", en: "Real-time web games" },
    role: { es: "Desarrollo y mantenimiento", en: "Development and maintenance" },
    summary: {
      es: "Portal de juegos web con partidas online en tiempo real.",
      en: "Web game portal with real-time online matches.",
    },
    description: {
      es: "game.it es un portal de juegos web minimalista, liviano y fluido, con versiones propias de juegos clásicos y populares. Incluye un servidor de salas en tiempo real para jugar online, un SDK propio para integrar juegos y un flujo abierto para que otros desarrolladores sumen los suyos.",
      en: "game.it is a minimal, lightweight and smooth web game portal with its own takes on classic and popular games. It includes a real-time room server for online play, its own SDK for integrating games and an open workflow so other developers can add theirs.",
    },
    stack: ["JavaScript", "Vite", "Canvas", "Node.js", "WebSockets", "Render"],
    highlights: [
      { es: "39 juegos, 18 con modo online.", en: "39 games, 18 with an online mode." },
      { es: "Español e inglés.", en: "Spanish and English." },
      { es: "60 fps y menos de 15 MB por juego.", en: "60 fps and under 15 MB per game." },
      {
        es: "Contribuciones por pull request con plantilla y validador automático.",
        en: "Contributions via pull request with a template and an automatic validator.",
      },
    ],
    links: {
      demo: "https://game-it-63r9.onrender.com",
      repo: "https://github.com/emitejadaa/game.it",
      repoFullName: "emitejadaa/game.it",
    },
    metrics: [
      { label: { es: "juegos", en: "games" }, value: "39", source: "manual" },
      { label: { es: "online", en: "online" }, value: "18", source: "manual" },
      { label: { es: "commits", en: "commits" }, value: "80", source: "github" },
    ],
    media: {
      screenshots: ["/projects/game-it/home.webp"],
      video: "/projects/game-it/tour.mp4",
    },
  },
  {
    slug: "framelab",
    tier: "proyecto",
    title: "framelab",
    year: 2026,
    type: { es: "Librería de Python", en: "Python library" },
    role: { es: "Autor", en: "Author" },
    summary: {
      es: "Librería de Python para explorar DataFrames sin escribir código.",
      en: "Python library to explore DataFrames without writing code.",
    },
    description: {
      es: "framelab es una librería de Python pensada para desarrolladores e investigadores de ciencia de datos. Permite explorar, transformar y graficar DataFrames de pandas desde una interfaz visual y devuelve siempre el código pandas exacto de cada paso.",
      en: "framelab is a Python library for data science developers and researchers. It lets you explore, transform and plot pandas DataFrames from a visual interface, and always gives back the exact pandas code for every step.",
    },
    stack: ["Python", "pandas", "Matplotlib", "pywebview", "Jupyter"],
    highlights: [
      {
        es: "Funciona dentro de Jupyter y VS Code o en ventana propia.",
        en: "Runs inside Jupyter and VS Code or in its own window.",
      },
      { es: "Exporta la sesión a .py o .ipynb.", en: "Exports the session to .py or .ipynb." },
      { es: "CLI para CSV, Parquet, JSON, Excel y Feather.", en: "CLI for CSV, Parquet, JSON, Excel and Feather." },
      { es: "Interfaz en español e inglés.", en: "Spanish and English interface." },
      { es: "Licencia MIT.", en: "MIT license." },
    ],
    links: {
      repo: "https://github.com/emitejadaa/framelab",
      repoFullName: "emitejadaa/framelab",
    },
    metrics: [{ label: { es: "commits", en: "commits" }, value: "68", source: "github" }],
    media: { screenshots: [] },
  },
  {
    slug: "liba",
    tier: "proyecto",
    title: "LIBA",
    year: 2026,
    type: { es: "Landing + minijuego", en: "Landing + mini-game" },
    role: { es: "Desarrollo", en: "Development" },
    summary: {
      es: "Landing interactiva para un torneo de básquet 3v3.",
      en: "Interactive landing page for a 3v3 basketball tournament.",
    },
    description: {
      es: "Landing de LIBA, un torneo amateur de básquet 3v3, construida a partir de su diseño en Figma. Suma animaciones atadas al scroll, un minijuego de tiro al aro y un formulario de inscripción, con pruebas automatizadas de accesibilidad y diseño responsive.",
      en: "Landing page for LIBA, an amateur 3v3 basketball tournament, built from its Figma design. It adds scroll-driven animations, a free-throw mini-game and a sign-up form, with automated accessibility tests and a responsive layout.",
    },
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Motion", "anime.js", "Vitest", "Playwright"],
    highlights: [
      {
        es: "Pruebas end-to-end en 8 tamaños de pantalla, de 320 a 1920 px.",
        en: "End-to-end tests on 8 screen sizes, from 320 to 1920 px.",
      },
      {
        es: "Áreas táctiles de al menos 24 × 24 px (WCAG 2.2).",
        en: "Touch targets of at least 24 × 24 px (WCAG 2.2).",
      },
      { es: "Sitio estático.", en: "Static site." },
    ],
    links: {
      demo: "https://liba-one.vercel.app",
      repo: "https://github.com/emitejadaa/Tp4Liba",
      repoFullName: "emitejadaa/Tp4Liba",
    },
    metrics: [{ label: { es: "commits", en: "commits" }, value: "30", source: "github" }],
    media: { screenshots: ["/projects/liba/home.webp"] },
  },
  {
    slug: "csbs-dp",
    tier: "proyecto",
    title: "CSBS-DP",
    year: 2026,
    type: { es: "Herramienta clínica", en: "Clinical tool" },
    role: { es: "Desarrollo completo", en: "Full development" },
    summary: {
      es: "Cuestionario clínico digital con puntaje automático.",
      en: "Digital clinical questionnaire with automatic scoring.",
    },
    description: {
      es: "Herramienta que digitaliza el CSBS-DP, un cuestionario de desarrollo comunicativo que los pediatras suelen completar en papel. El cuidador lo responde desde un enlace, el sistema calcula los puntajes y envía un informe al profesional. Nació de la necesidad de una pediatra, está pensada para cualquier consultorio y hoy funciona integrada en Pequeños Pasos.",
      en: "A tool that digitizes the CSBS-DP, a communication-development questionnaire pediatricians usually fill out on paper. The caregiver answers it from a link, the system calculates the scores and emails a report to the practitioner. It was born from a pediatrician's need, is designed for any practice, and now runs integrated into Pequeños Pasos.",
    },
    stack: ["Next.js", "React", "TypeScript", "Resend", "Serverless"],
    highlights: [
      { es: "24 ítems en 7 categorías.", en: "24 items in 7 categories." },
      {
        es: "Puntajes compuestos de comunicación y lenguaje expresivo.",
        en: "Composite scores for communication and expressive language.",
      },
      { es: "Informe por email al profesional.", en: "Email report to the practitioner." },
    ],
    links: {
      demo: "https://csbs-form.vercel.app",
      repo: "https://github.com/emitejadaa/csbs-form",
      repoFullName: "emitejadaa/csbs-form",
    },
    metrics: [
      { label: { es: "ítems", en: "items" }, value: "24", source: "manual" },
      { label: { es: "categorías", en: "categories" }, value: "7", source: "manual" },
    ],
    media: { screenshots: ["/projects/csbs-dp/home.webp"] },
  },

  // Prácticas: viven en el Lab, una línea cada una, sin ventana propia.
  {
    slug: "what-the-weather",
    tier: "practica",
    title: "WhatTheWeather",
    year: 2026,
    type: { es: "Dashboard web", en: "Web dashboard" },
    role: { es: "Autor", en: "Author" },
    summary: {
      es: "Dashboard de clima con búsqueda por ciudad y pronóstico corto.",
      en: "Weather dashboard with city search and a short forecast.",
    },
    description: {
      es: "Dashboard de clima con búsqueda por ciudad y pronóstico corto.",
      en: "Weather dashboard with city search and a short forecast.",
    },
    stack: ["Astro", "JavaScript", "WeatherAPI", "GitHub Actions"],
    highlights: [],
    links: {
      demo: "https://what-the-weather.vercel.app/",
      repo: "https://github.com/emitejadaa/whatTheWeather",
      repoFullName: "emitejadaa/whatTheWeather",
    },
    metrics: [{ label: { es: "commits", en: "commits" }, value: "38", source: "github" }],
    media: { screenshots: [] },
  },
  {
    slug: "amigo-invisible",
    tier: "practica",
    title: "Amigo invisible",
    year: 2026,
    type: { es: "App en tiempo real", en: "Real-time app" },
    role: { es: "Autor", en: "Author" },
    summary: {
      es: "Sorteo en tiempo real donde cada participante ve solo su propio resultado.",
      en: "Real-time Secret Santa draw where each participant only sees their own result.",
    },
    description: {
      es: "Sorteo en tiempo real donde cada participante ve solo su propio resultado.",
      en: "Real-time Secret Santa draw where each participant only sees their own result.",
    },
    stack: ["JavaScript", "Supabase Realtime", "Edge Functions", "RLS"],
    highlights: [],
    links: {
      demo: "https://amigo-invisible-neon.vercel.app",
      repo: "https://github.com/emitejadaa/amigoInvisible",
      repoFullName: "emitejadaa/amigoInvisible",
    },
    metrics: [{ label: { es: "commits", en: "commits" }, value: "6", source: "github" }],
    media: { screenshots: [] },
  },
  {
    slug: "arma-tu-trago",
    tier: "practica",
    title: "Armá tu trago",
    year: 2026,
    type: { es: "Simulador interactivo", en: "Interactive simulator" },
    role: { es: "Autor", en: "Author" },
    summary: {
      es: "Simulador educativo que estima el alcohol en sangre según peso, sexo, comidas y tiempo.",
      en: "Educational simulator that estimates blood alcohol from weight, sex, meals and time.",
    },
    description: {
      es: "Simulador educativo que estima el alcohol en sangre según peso, sexo, comidas y tiempo.",
      en: "Educational simulator that estimates blood alcohol from weight, sex, meals and time.",
    },
    stack: ["React", "Vite"],
    highlights: [],
    links: {
      demo: "https://quimica-queque.vercel.app",
      repo: "https://github.com/emitejadaa/quimica",
      repoFullName: "emitejadaa/quimica",
    },
    metrics: [{ label: { es: "commits", en: "commits" }, value: "34", source: "github" }],
    media: { screenshots: [] },
  },
  {
    slug: "esp-now",
    tier: "practica",
    title: "ESP-NOW",
    year: 2025,
    type: { es: "Embebidos", en: "Embedded" },
    role: { es: "Autor", en: "Author" },
    summary: {
      es: "Comunicación inalámbrica entre placas ESP32 con el protocolo ESP-NOW.",
      en: "Wireless communication between ESP32 boards using the ESP-NOW protocol.",
    },
    description: {
      es: "Comunicación inalámbrica entre placas ESP32 con el protocolo ESP-NOW.",
      en: "Wireless communication between ESP32 boards using the ESP-NOW protocol.",
    },
    stack: ["C++", "Arduino", "ESP32"],
    highlights: [],
    links: {
      repo: "https://github.com/emitejadaa/esp-now",
      repoFullName: "emitejadaa/esp-now",
    },
    metrics: [{ label: { es: "commits", en: "commits" }, value: "3", source: "github" }],
    media: { screenshots: [] },
  },
  {
    slug: "assembly",
    tier: "practica",
    title: "Máquina expendedora en Assembly",
    year: 2026,
    type: { es: "Bajo nivel", en: "Low level" },
    role: { es: "Autor", en: "Author" },
    summary: {
      es: "Lógica de una máquina expendedora, condicionales y bucles en Assembly.",
      en: "Vending machine logic, conditionals and loops in Assembly.",
    },
    description: {
      es: "Lógica de una máquina expendedora, condicionales y bucles en Assembly.",
      en: "Vending machine logic, conditionals and loops in Assembly.",
    },
    stack: ["Assembly"],
    highlights: [],
    links: {
      repo: "https://github.com/emitejadaa/tpCaro",
      repoFullName: "emitejadaa/tpCaro",
    },
    media: { screenshots: [] },
  },
  {
    slug: "portfolio-v1",
    tier: "practica",
    title: "Portfolio anterior",
    year: 2026,
    type: { es: "Sitio personal", en: "Personal website" },
    role: { es: "Autor", en: "Author" },
    summary: {
      es: "Versión anterior de este sitio; se reemplaza con esta.",
      en: "Previous version of this site, replaced by this one.",
    },
    description: {
      es: "Versión anterior de este sitio; se reemplaza con esta.",
      en: "Previous version of this site, replaced by this one.",
    },
    stack: ["Next.js", "Tailwind CSS"],
    highlights: [],
    links: {
      // El repo ahora aloja este sitio: se linkea el último commit de la versión anterior.
      repo: "https://github.com/emitejadaa/Portfolio/tree/a2d950aa6811b67eda24001ee111baee20ccce6a",
    },
    metrics: [{ label: { es: "commits", en: "commits" }, value: "17", source: "manual" }],
    media: { screenshots: [] },
  },
];

export const tierOrder: Tier[] = ["destacado", "proyecto", "practica"];

export const projectsByTier = (tier: Tier) => projects.filter((p) => p.tier === tier);

/** Projects that open in their own window (Destacado + Proyecto). */
export const windowProjects = projects.filter((p) => p.tier !== "practica");

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/** Doc: 602 commits públicos en 14 repos propios y 425 contribuciones en el último año (GitHub, 14 oct 2026). */
export const githubSnapshot = {
  asOf: "2026-10-14",
  publicCommits: 602,
  ownRepos: 14,
  contributionsLastYear: 425,
};
