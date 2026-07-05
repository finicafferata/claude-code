import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * GET /api/health
 * Chequeo rápido de configuración: dice si las variables de entorno de
 * Google están presentes (sin exponer sus valores). Útil para verificar
 * el deploy sin tener que mandar un RSVP de prueba.
 */
export async function GET() {
  const checks = {
    GOOGLE_SERVICE_ACCOUNT_EMAIL: Boolean(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    ),
    GOOGLE_PRIVATE_KEY: Boolean(process.env.GOOGLE_PRIVATE_KEY),
    GOOGLE_SHEET_ID: Boolean(process.env.GOOGLE_SHEET_ID),
  };

  const configured = Object.values(checks).every(Boolean);

  return NextResponse.json({ ok: true, configured, checks });
}
