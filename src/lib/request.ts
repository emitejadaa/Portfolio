import "server-only";
import type { NextRequest } from "next/server";

/**
 * True unless a browser says the request comes from another site. Cross-site forms can POST here
 * without CORS (enctype="text/plain" even carries a JSON body), so state-changing routes check this.
 * Requests with neither header (curl, servers) cannot act on a visitor's behalf and are let through.
 */
export function isSameOrigin(req: NextRequest): boolean {
  const site = req.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") return false;
  const origin = req.headers.get("origin");
  if (!origin) return true;
  let host: string;
  try {
    host = new URL(origin).host;
  } catch {
    return false;
  }
  // A cross-site form cannot set these headers, so they are safe to compare against.
  return [req.nextUrl.host, req.headers.get("host"), req.headers.get("x-forwarded-host")].some((h) => h === host);
}

type JsonBody = { ok: true; value: Record<string, unknown> } | { ok: false; tooLarge?: boolean };

/** Reads at most `maxBytes` of the body (whatever Content-Length claims) and parses a JSON object. */
export async function readJsonBody(req: Request, maxBytes: number): Promise<JsonBody> {
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > maxBytes) return { ok: false, tooLarge: true };
  if (!req.body) return { ok: false };
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel().catch(() => {});
      return { ok: false, tooLarge: true };
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const c of chunks) {
    bytes.set(c, offset);
    offset += c.byteLength;
  }
  try {
    const value: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!value || typeof value !== "object" || Array.isArray(value)) return { ok: false };
    return { ok: true, value: value as Record<string, unknown> };
  } catch {
    return { ok: false };
  }
}
