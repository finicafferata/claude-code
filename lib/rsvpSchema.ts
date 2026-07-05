import { z } from "zod";

/**
 * Esquema de validación del formulario RSVP.
 * Se usa tanto en el frontend (validar antes de enviar) como en el
 * backend (validar de nuevo antes de escribir en el Sheet).
 */

export const DIETARY_OPTIONS = [
  "Ninguna",
  "Vegetariano",
  "Vegano",
  "Celíaco",
  "Otra",
] as const;

// Un acompañante: nombre + su propia restricción alimentaria.
export const companionSchema = z.object({
  nombre: z.string().trim().max(120).default(""),
  restriccionAlimentaria: z.enum(DIETARY_OPTIONS).default("Ninguna"),
  detalleRestriccion: z.string().trim().max(300).default(""),
});

export type Companion = z.infer<typeof companionSchema>;

export const rsvpSchema = z
  .object({
    // Datos de contacto
    nombreCompleto: z
      .string()
      .trim()
      .min(2, "Ingresá tu nombre completo")
      .max(120),
    email: z.string().trim().email("Ingresá un email válido").max(200),
    telefono: z.string().trim().max(40).optional().default(""),

    // Confirmación
    asiste: z.enum(["si", "no"], {
      errorMap: () => ({ message: "Indicá si vas a asistir" }),
    }),

    // Acompañantes (solo relevante si asiste === "si")
    cantidadAcompanantes: z.coerce
      .number()
      .int()
      .min(0)
      .max(20)
      .optional()
      .default(0),
    // Una entrada por acompañante (nombre + restricción de cada uno).
    acompanantes: z.array(companionSchema).max(20).optional().default([]),

    // ¿Necesita traslado (combi)? Solo relevante si asiste === "si".
    necesitaTraslado: z.enum(["si", "no"]).optional().default("no"),

    // Restricciones alimentarias
    restriccionAlimentaria: z
      .enum(DIETARY_OPTIONS)
      .optional()
      .default("Ninguna"),
    detalleRestriccion: z.string().trim().max(300).optional().default(""),

    // Extras
    cancionSugerida: z.string().trim().max(200).optional().default(""),
    mensaje: z.string().trim().max(1000).optional().default(""),

    // Anti-spam: campo oculto (honeypot). Los bots lo completan, las
    // personas no. Se acepta cualquier valor acá para que la validación no
    // falle; el endpoint detecta si vino con contenido y descarta el envío
    // en silencio (sin delatar la trampa). Ver app/api/rsvp/route.ts.
    website: z.string().max(200).optional().default(""),
  })
  .refine(
    (data) =>
      data.restriccionAlimentaria !== "Otra" ||
      data.detalleRestriccion.length > 0,
    {
      message: "Contanos cuál es tu restricción",
      path: ["detalleRestriccion"],
    }
  );

export type RsvpInput = z.input<typeof rsvpSchema>;
export type RsvpData = z.output<typeof rsvpSchema>;
