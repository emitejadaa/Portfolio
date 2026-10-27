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
