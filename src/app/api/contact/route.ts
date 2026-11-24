import { NextResponse, type NextRequest } from "next/server";
import { contact } from "@/content/profile";
import type { ContactResponse } from "@/lib/api-types";
import { contactSubject, renderContactEmail } from "@/lib/email-template";
import { isSameOrigin, readJsonBody } from "@/lib/request";

export const dynamic = "force-dynamic";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
/** Across every sender: caps what a burst from many addresses can push into the inbox (and the Resend quota). */
const MAX_TOTAL_PER_WINDOW = 20;
const MAX_BODY_BYTES = 16 * 1024;
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;
// C0/C1 controls (except tab and newline) and the bidi overrides that can disguise a subject line.
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F‎‏‪-‮⁦-⁩]/g;

// Doc: límite de 3 envíos por IP cada 10 minutos. In-memory per instance: good enough for a portfolio.
const hits = new Map<string, number[]>();
let sent: number[] = [];

function prune(now: number) {
  sent = sent.filter((t) => now - t < WINDOW_MS);
  if (hits.size < 2000) return;
  for (const [ip, times] of hits) if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(ip);
  // Still full of live entries: drop the oldest half instead of everyone's history.
  if (hits.size > 5000) [...hits.keys()].slice(0, hits.size / 2).forEach((ip) => hits.delete(ip));
}

function rateLimited(ip: string) {
  const now = Date.now();
  prune(now);
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW || sent.length >= MAX_TOTAL_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  sent.push(now);
  return false;
}

const json = (body: ContactResponse, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: NextRequest) {
  // Only our own page may post here: a cross-site form (enctype text/plain can carry a JSON body)
  // would otherwise send messages from every visitor of another site.
  if (!isSameOrigin(req)) return json({ ok: false, error: "validation" }, 403);
  if (!req.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ ok: false, error: "validation" }, 415);
  }

  const parsed = await readJsonBody(req, MAX_BODY_BYTES);
  if (!parsed.ok) return json({ ok: false, error: "validation" }, parsed.tooLarge ? 413 : 400);
  const body = parsed.value;

  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string) : "");
  const clean = (s: string) => s.replace(CONTROL_RE, "");
  const name = clean(str("name")).replace(/\s+/g, " ").trim().slice(0, 80);
  const email = str("email").trim().slice(0, 254);
  const message = clean(str("message")).trim().slice(0, 4000);
  const locale = str("locale") === "en" ? "en" : "es";
  const page = clean(str("page")).slice(0, 120);
  const honeypot = str("website");
  const startedAt = Number(body.startedAt) || 0;

  // Campo trampa para bots: se finge éxito y no se envía nada.
  if (honeypot || (startedAt && Date.now() - startedAt < 2000)) return json({ ok: true });

  const fields: string[] = [];
  if (name.length < 1) fields.push("name");
  if (!EMAIL_RE.test(email)) fields.push("email");
  if (message.length < 10) fields.push("message");
  if (fields.length) return json({ ok: false, error: "validation", fields }, 422);

  // Vercel sets both headers itself (a client-sent value is replaced), so they identify the sender.
  const ip = (req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown").trim();
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
