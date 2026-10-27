# tejada.os · Portfolio de Emiliano Tejada

Un escritorio que se usa como un sistema operativo: ventanas, dock, Spotlight, terminal y widgets con datos en vivo. Hardware, backend e inteligencia artificial.

**[portfolio-tejada.vercel.app](https://portfolio-tejada.vercel.app)**

## Modos

- **Midnight**: vidrio oscuro, acento Volt `#D4FF3A`.
- **Daylight**: papel y tinta, acento Klein `#1F3BFF`, sombras sin blur.

El cambio de modo solo toca colores y materiales; tipografía, layout y movimiento quedan iguales. En celular el escritorio pasa a una pantalla de inicio con hojas deslizables.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion · three.js · Zustand · Resend · Vercel

## Estructura

```
src/
  app/            rutas (cada una abre su ventana), metadata y API
    api/          clima, GitHub, estado de servicios, deploys y contacto
  content/        todos los textos en español e inglés: perfil, proyectos, UI
  os/             el escritorio: ventanas, dock, Spotlight, terminal, widgets, versión móvil
  lib/            GitHub, pings, README, email de contacto, imágenes para compartir
public/projects/  capturas de los deploys
scripts/          captura de pantallas con Playwright
```

Para editar contenido alcanza con `src/content/`: proyectos, bio, stack, línea de tiempo y textos de la interfaz.

## Desarrollo

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run typecheck
npm run build
```

`npm run screenshots` vuelve a capturar los proyectos desde sus deploys (Playwright + ffmpeg). Acepta slugs: `npm run screenshots -- liba freewheel`.

## Variables de entorno

| Variable | Para qué | |
| --- | --- | --- |
| `RESEND_API_KEY` | Envía los mensajes del formulario de contacto. | Necesaria para el formulario |
| `CONTACT_TO` | Casilla que recibe los mensajes. Por defecto, el email de `src/content/profile.ts`. | Opcional |
| `GITHUB_TOKEN` | Token fine-grained de solo lectura (repos públicos, sin permisos extra): contribuciones exactas por GraphQL y más margen de rate limit. Sin token, los datos salen de la página pública de GitHub. | Opcional |

Se cargan en Vercel → Project → Settings → Environment Variables. Nunca se commitean.

## Datos en vivo

| Widget | Fuente | Caché |
| --- | --- | --- |
| Clima | Open-Meteo | 30 min |
| GitHub | GraphQL con token, o la página pública + REST | 1 h |
| Estado de servicios | HEAD a cada deploy | 5 min en CDN |
| Último deploy | API de deployments de GitHub | 10 min |

---

Hecho por Emiliano Tejada en Buenos Aires.
