# tejada.os · Portfolio de Emiliano Tejada

Un escritorio que se usa como un sistema operativo: ventanas, dock, Spotlight, terminal y widgets con datos en vivo. Hardware, backend e inteligencia artificial.

**[portfolio-tejada.vercel.app](https://portfolio-tejada.vercel.app)**

## Modos

- **Midnight**: vidrio oscuro, acento Volt `#D4FF3A`.
- **Daylight**: papel y tinta, acento Klein `#1F3BFF`, sombras sin blur.

El cambio de modo solo toca colores y materiales; tipografía, layout y movimiento quedan iguales. En celular el escritorio pasa a una pantalla de inicio con hojas deslizables.

## Ajustes

Desde la barra de menú (o `open ajustes` en la terminal): modo, idioma y accesibilidad (reducir movimiento, reducir transparencia, más contraste, texto más grande y halo del cursor). Se guardan en el navegador y se aplican antes del primer pintado (`src/os/prefs.ts`).

## Rendimiento

- Fondo en CSS estático: sin canvas, sin seguir al mouse, se pinta una vez.
- El vidrio (`backdrop-filter`) solo en ventanas, dock, barra de menú y menús; las tarjetas usan un relleno sólido.
- Cada app es su propio chunk y se precarga cuando el navegador está libre.
- El reloj se actualiza una vez por minuto y solo re-renderiza su propio texto.
- Equipos muy limitados arrancan con superficies sólidas.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion · Zustand · Resend · Vercel

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
