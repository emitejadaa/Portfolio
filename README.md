# tejada.os · Portfolio de Emiliano Tejada

Un escritorio que se usa como un sistema operativo: ventanas, dock, Spotlight, terminal y widgets con datos en vivo. Hardware, backend e inteligencia artificial.

**[portfolio-tejada.vercel.app](https://portfolio-tejada.vercel.app)**

## Modos

- **Midnight**: vidrio oscuro, acento Volt `#D4FF3A`.
- **Daylight**: papel y tinta, acento Klein `#1F3BFF`, sombras sin blur.

El cambio de modo solo toca colores y materiales; tipografía, layout y movimiento quedan iguales. En celular el escritorio pasa a una pantalla de inicio con hojas deslizables.

## Ajustes

Desde la barra de menú (o `open ajustes` en la terminal): modo, idioma y accesibilidad (reducir movimiento, reducir transparencia, más contraste, texto más grande y halo del cursor). Se guardan en el navegador solo las opciones que cambió el visitante, y se aplican antes del primer pintado (`src/os/prefs.ts`); lo demás sigue al sistema y al equipo.

## Rendimiento

- Fondo en CSS estático: sin canvas, sin seguir al mouse, se pinta una vez.
- El vidrio (`backdrop-filter`) solo en ventanas, dock, barra de menú y menús; las tarjetas usan un relleno sólido.
- Nada se anima solo para siempre: el punto "Disponible" late unas veces al entrar y al pasar el mouse, y las señales EEG de NeuroLinked se mueven con un `transform` que resuelve la GPU. En reposo el escritorio no dibuja ningún cuadro.
- **Modo liviano automático** (`src/os/perf.ts`): si el navegador dibuja sin aceleración gráfica, o las primeras animaciones van a menos de ~30 fps, pasa a superficies sólidas (y protector de pantalla quieto), avisa con un toast y lo recuerda para la próxima visita. La elección del visitante en Ajustes siempre gana.
- Al arrastrar, la ventana tiene su propia capa del compositor; el foco cambia borde y sombra al instante (como macOS) en lugar de repintar la ventana entera durante la transición.
- Cambiar el foco o minimizar solo re-renderiza las ventanas involucradas: el contenido de cada app está memoizado.
- El heatmap de GitHub son 5 trazos SVG (antes 371 elementos por widget).
- Los deep links (`/proyectos/freewheel`) llegan con la ventana visible desde el HTML: el servidor la ubica con la misma fórmula en CSS y no salta al hidratar.
- El servidor renderiza escritorio y celular (no conoce la pantalla); el cliente solo hidrata el que corresponde.
- El README de perfil se pide al abrir README.md o `cat README.md` (`/api/readme`), en vez de viajar en cada página.
- Solo se precarga el subset `latin` de las fuentes; el resto se descarga si aparece algún carácter que lo necesite.
- Cada app es su propio chunk y se precarga cuando el navegador está libre.
- El reloj se actualiza una vez por minuto y solo re-renderiza su propio texto.

## Seguridad

- Headers en `next.config.ts`: Content-Security-Policy (solo este origen para scripts, conexiones, fuentes y media; sin iframes ni `object`), HSTS, `X-Frame-Options: DENY`, COOP, `nosniff` y Permissions-Policy.
- `/api/contact` solo acepta JSON del propio sitio (corta formularios de otros sitios), lee como mucho 16 KB, limpia caracteres de control, limita 3 envíos por IP y 20 en total cada 10 minutos, y tiene campo trampa para bots.
- `/api/status` y `/api/ping` miden cada demo como mucho una vez por intervalo aunque se esquive la caché de la CDN.
- El README se convierte a HTML en el servidor con el HTML crudo escapado y solo links `http(s)`/`mailto`.
- Las claves (`RESEND_API_KEY`, `GITHUB_TOKEN`) viven solo en el servidor (`server-only`).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion · Zustand · Resend · Vercel

## Estructura

```
src/
  app/            rutas (cada una abre su ventana), metadata y API
    api/          clima, GitHub, estado de servicios, deploys, README y contacto
  content/        todos los textos en español e inglés: perfil, proyectos, UI
  os/             el escritorio: ventanas, dock, Spotlight, terminal, widgets, versión móvil
  lib/            GitHub, pings, README, email de contacto, validación de requests, imágenes para compartir
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
| Estado de servicios | HEAD a cada deploy | 5 min en CDN y en el servidor |
| README de perfil | raw.githubusercontent.com | 1 día |
| Último deploy | API de deployments de GitHub | 10 min |

---

Hecho por Emiliano Tejada en Buenos Aires.
