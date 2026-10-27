import { NextResponse } from "next/server";
import { identity } from "@/content/profile";
import type { WeatherResponse } from "@/lib/api-types";

export const revalidate = 1800;

/** Clima de Buenos Aires con Open-Meteo: no necesita clave. */
export async function GET() {
  const { lat, lon } = identity.coords;
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min` +
    `&timezone=${encodeURIComponent(identity.timeZone)}&forecast_days=1`;
  try {
    const res = await fetch(url, { next: { revalidate }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(String(res.status));
    const j = (await res.json()) as {
      current: { temperature_2m: number; weather_code: number; is_day: number; time: string };
      daily: { temperature_2m_max: number[]; temperature_2m_min: number[] };
    };
    const body: WeatherResponse = {
      temp: j.current.temperature_2m,
      code: j.current.weather_code,
      isDay: j.current.is_day === 1,
      max: j.daily.temperature_2m_max[0] ?? j.current.temperature_2m,
      min: j.daily.temperature_2m_min[0] ?? j.current.temperature_2m,
      updatedAt: new Date().toISOString(),
    };
    return NextResponse.json(body);
  } catch {
    return NextResponse.json({ error: "weather_unavailable" }, { status: 503 });
  }
}
