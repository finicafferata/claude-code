import { NextRequest, NextResponse } from "next/server";
import { rsvpSchema } from "@/lib/rsvpSchema";
import { appendRsvp } from "@/lib/googleSheets";
import { rateLimit } from "@/lib/rateLimit";

// Este endpoint usa la API de Google (Node runtime, no edge).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/**
 * POST /api/rsvp
 * Recibe el formulario, lo valida y agrega una fila al Google Sheet.
 */
export async function POST(req: NextRequest) {
  // 1) Rate limiting por IP
  const ip = getClientIp(req);
  const limit = rateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Demasiados intentos. Probá de nuevo en un momento." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  // 2) Parsear el body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Solicitud inválida." },
      { status: 400 }
    );
  }

  // 3) Validar con Zod
  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) {
    // Devolvemos los errores por campo para que el frontend los muestre.
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return NextResponse.json(
      { ok: false, error: "Revisá los datos del formulario.", fieldErrors },
      { status: 422 }
    );
  }

  // 4) Anti-spam: si el honeypot vino completo, es un bot.
  //    Respondemos ok para no darle pistas, pero no guardamos nada.
  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  // 5) Guardar en el Sheet
  try {
    const timestamp = new Date().toISOString();
    await appendRsvp(parsed.data, timestamp);
  } catch (err) {
    console.error("Error al guardar el RSVP en Google Sheets:", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "No pudimos registrar tu respuesta. Probá de nuevo en unos minutos.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

// Bloqueamos otros métodos explícitamente.
export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Método no permitido." },
    { status: 405 }
  );
}
