import { NextResponse, type NextRequest } from "next/server";
import { contact } from "@/content/profile";
import type { ContactResponse } from "@/lib/api-types";
import { contactSubject, renderContactEmail } from "@/lib/email-template";

export const dynamic = "force-dynamic";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;

// Doc: límite de 3 envíos por IP cada 10 minutos. In-memory per instance: good enough for a portfolio.
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

const json = (body: ContactResponse, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "validation" }, 400);
  }

  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string) : "");
  const name = str("name").trim().slice(0, 80);
  const email = str("email").trim().slice(0, 254);
  const message = str("message").trim().slice(0, 4000);
  const locale = str("locale") === "en" ? "en" : "es";
  const page = str("page").slice(0, 120);
  const honeypot = str("website");
  const startedAt = Number(body.startedAt) || 0;

  // Campo trampa para bots: se finge éxito y no se envía nada.
  if (honeypot || (startedAt && Date.now() - startedAt < 2000)) return json({ ok: true });

  const fields: string[] = [];
  if (name.length < 1) fields.push("name");
  if (!EMAIL_RE.test(email)) fields.push("email");
  if (message.length < 10) fields.push("message");
  if (fields.length) return json({ ok: false, error: "validation", fields }, 422);

  const ip = (req.headers.get("x-forwarded-for")?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "unknown").trim();
  if (rateLimited(ip)) return json({ ok: false, error: "rate" }, 429);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return json({ ok: false, error: "send" }, 503);

  const { html, text } = renderContactEmail({ name, email, message, locale, page, sentAt: new Date() });
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        // Sin dominio propio: el remitente de prueba de Resend solo envía a la cuenta dueña, que es justo el destino.
        from: "Portfolio · Emiliano Tejada <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO || contact.email],
        reply_to: email,
        subject: contactSubject(name),
        html,
        text,
        tags: [{ name: "source", value: "portfolio" }],
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return json({ ok: false, error: "send" }, 502);
    return json({ ok: true });
  } catch {
    return json({ ok: false, error: "send" }, 502);
  }
}
