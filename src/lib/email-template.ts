import "server-only";

export type ContactEmail = {
  name: string;
  email: string;
  message: string;
  locale: "es" | "en";
  page?: string;
  sentAt: Date;
};

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Midnight palette (A·01): Noche, Grafito, Carbón, Acero, Niebla, Hueso + Volt.
const C = {
  noche: "#07080A",
  grafito: "#0E1013",
  carbon: "#161A20",
  acero: "#2A2F38",
  linea: "#1E2127",
  niebla: "#8B9099",
  hueso: "#EDEEF0",
  volt: "#D4FF3A",
  coral: "#FF5A36",
  indigo: "#3B3BFF",
};

const SANS = "'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const MONO = "'Geist Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

export function contactSubject(name: string) {
  return `Nuevo mensaje de ${name.replace(/[\r\n]+/g, " ").slice(0, 80)} · Portfolio`;
}

/** HTML email that follows the site's Midnight look: a window from the desktop, in your inbox. */
export function renderContactEmail(data: ContactEmail): { html: string; text: string } {
  const first = data.name.trim().split(/\s+/)[0] ?? data.name;
  const when = formatDate(data.sentAt);
  const lang = data.locale === "en" ? "English" : "Español";
  const replyHref = `mailto:${encodeURIComponent(data.email)}?subject=${encodeURIComponent("Re: tu mensaje en mi portfolio")}`;
  const messageHtml = esc(data.message).replace(/\r?\n/g, "<br>");

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 0;border-top:1px solid ${C.linea};font-family:${MONO};font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:${C.niebla};width:120px;vertical-align:top;">${label}</td>
      <td style="padding:10px 0;border-top:1px solid ${C.linea};font-family:${SANS};font-size:15px;color:${C.hueso};vertical-align:top;">${value}</td>
    </tr>`;

  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${esc(contactSubject(data.name))}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap');
  :root { color-scheme: dark; supported-color-schemes: dark; }
  a { color: ${C.volt}; }
  @media (max-width: 620px) { .card { border-radius: 14px !important; } .pad { padding-left: 22px !important; padding-right: 22px !important; } .h1 { font-size: 26px !important; } }
</style>
</head>
<body style="margin:0;padding:0;background:${C.noche};" bgcolor="${C.noche}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(first)}: ${esc(data.message.slice(0, 110))}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.noche}" style="background:${C.noche};background-image:radial-gradient(60% 40% at 90% 0%, rgba(59,59,255,.35), rgba(7,8,10,0) 70%);">
  <tr>
    <td align="center" style="padding:40px 14px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
        <tr>
          <td style="padding:0 6px 14px;font-family:${MONO};font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:${C.niebla};">
            ◐ tejada.os &nbsp;·&nbsp; contacto.app
          </td>
        </tr>
        <tr>
          <td class="card" bgcolor="${C.grafito}" style="background:${C.grafito};border:1px solid ${C.linea};border-radius:20px;overflow:hidden;">
            <!-- Barra de título de la ventana -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom:1px solid ${C.linea};">
              <tr>
                <td style="padding:14px 18px;width:70px;white-space:nowrap;font-size:0;line-height:0;">
                  <span style="display:inline-block;width:12px;height:12px;border-radius:12px;background:${C.coral};margin-right:8px;"></span><span style="display:inline-block;width:12px;height:12px;border-radius:12px;background:${C.acero};margin-right:8px;"></span><span style="display:inline-block;width:12px;height:12px;border-radius:12px;background:${C.acero};"></span>
                </td>
                <td align="center" style="padding:14px 0;font-family:${MONO};font-size:12px;color:${C.niebla};">contacto / mensaje-nuevo.app</td>
                <td style="padding:14px 18px;width:70px;" align="right"><span style="font-family:${MONO};font-size:11px;color:${C.niebla};border:1px solid ${C.linea};border-radius:6px;padding:2px 6px;">esc</span></td>
              </tr>
            </table>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td class="pad" style="padding:34px 40px 8px;">
                  <div style="font-family:${MONO};font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:${C.niebla};">Mensaje nuevo · Portfolio</div>
                  <h1 class="h1" style="margin:12px 0 0;font-family:${SANS};font-weight:600;font-size:32px;line-height:1.08;letter-spacing:-0.03em;color:${C.hueso};">
                    ${esc(first)} te escribió<span style="display:inline-block;width:.24em;height:.24em;background:${C.volt};margin-left:.06em;vertical-align:baseline;"></span>
                  </h1>
                </td>
              </tr>
              <tr>
                <td class="pad" style="padding:22px 40px 0;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.carbon}" style="background:${C.carbon};border:1px solid ${C.linea};border-radius:14px;">
                    <tr>
                      <td style="padding:22px 24px;font-family:${SANS};font-size:16px;line-height:1.6;color:${C.hueso};word-break:break-word;">${messageHtml}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td class="pad" style="padding:22px 40px 4px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    ${row("Nombre", esc(data.name))}
                    ${row("Email", `<a href="mailto:${esc(data.email)}" style="color:${C.volt};text-decoration:none;">${esc(data.email)}</a>`)}
                    ${row("Idioma", lang)}
                    ${row("Fecha", `${esc(when)} <span style="color:${C.niebla};">(Buenos Aires)</span>`)}
                    ${data.page ? row("Desde", `<span style="font-family:${MONO};font-size:13px;color:${C.niebla};">${esc(data.page)}</span>`) : ""}
                  </table>
                </td>
              </tr>
              <tr>
                <td class="pad" style="padding:26px 40px 38px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td bgcolor="${C.volt}" style="background:${C.volt};border-radius:10px;">
                        <a href="${replyHref}" style="display:inline-block;padding:13px 22px;font-family:${SANS};font-size:15px;font-weight:600;color:${C.noche};text-decoration:none;">Responder a ${esc(first)} →</a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin:14px 0 0;font-family:${SANS};font-size:13px;line-height:1.5;color:${C.niebla};">También podés responder este mail directamente: la respuesta va a ${esc(data.email)}.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:18px 6px 0;font-family:${MONO};font-size:11px;letter-spacing:.06em;color:${C.niebla};">
            Emiliano Tejada &nbsp;·&nbsp; Hardware · Backend · IA &nbsp;·&nbsp; <a href="https://portfolio-tejada.vercel.app" style="color:${C.niebla};">portfolio-tejada.vercel.app</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  const text = [
    `${first} te escribió desde el portfolio.`,
    "",
    data.message,
    "",
    "—",
    `Nombre: ${data.name}`,
    `Email: ${data.email}`,
    `Idioma: ${lang}`,
    `Fecha: ${when} (Buenos Aires)`,
    data.page ? `Desde: ${data.page}` : "",
    "",
    "Respondé este mail para contestarle directamente.",
  ]
    .filter((l) => l !== null)
    .join("\n");

  return { html, text };
}
