import { NextResponse } from "next/server";
import { getGitHub } from "@/lib/github";

export const revalidate = 3600;

/** Contribuciones, último commit, lenguajes y commits por repo (solo datos públicos). */
export async function GET() {
  const data = await getGitHub();
  return NextResponse.json(data);
}
