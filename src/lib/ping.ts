import "server-only";
import type { ServiceState } from "./api-types";

export type PingResult = { state: ServiceState; ms: number | null; code: number | null };

const SLOW_MS = 2500;

/** HEAD a una demo (GET si el host no acepta HEAD). Free tiers that sleep come back as "slow". */
export async function ping(url: string, timeoutMs = 8000): Promise<PingResult> {
  const attempt = async (method: "HEAD" | "GET") => {
    const started = performance.now();
    const res = await fetch(url, {
      method,
      redirect: "follow",
      cache: "no-store",
      headers: { "User-Agent": "tejada.os status (+https://portfolio-tejada.vercel.app)" },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (method === "GET") res.body?.cancel().catch(() => {});
    return { res, ms: Math.round(performance.now() - started) };
  };
  try {
    let { res, ms } = await attempt("HEAD");
    if (res.status === 405 || res.status === 501) ({ res, ms } = await attempt("GET"));
    const ok = res.status < 400;
    return { state: ok ? (ms > SLOW_MS ? "slow" : "up") : "down", ms, code: res.status };
  } catch {
    return { state: "down", ms: null, code: null };
  }
}

const recent = new Map<string, { at: number; result: Promise<PingResult> }>();

/**
 * At most one real check per demo every `maxAgeMs` on this server instance, shared by concurrent
 * callers. The CDN caches /api/status and /api/ping by URL, so without this an extra query string per
 * request would turn every hit into a fresh round of requests against the demos.
 */
export function pingCached(url: string, maxAgeMs: number, timeoutMs?: number): Promise<PingResult> {
  const hit = recent.get(url);
  const now = Date.now();
  if (hit && now - hit.at < maxAgeMs) return hit.result;
  const result = ping(url, timeoutMs);
  recent.set(url, { at: now, result });
  return result;
}
