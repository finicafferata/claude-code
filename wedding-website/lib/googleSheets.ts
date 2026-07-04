import { google } from "googleapis";
import type { RsvpData } from "./rsvpSchema";

/**
 * Cliente de Google Sheets.
 *
 * Se autentica con una Service Account (las credenciales viven solo en el
 * servidor, en variables de entorno) y agrega una fila nueva por cada RSVP.
 */

const SHEET_TAB = process.env.GOOGLE_SHEET_TAB || "RSVP";

// Orden de las columnas en el Sheet. Debe coincidir con la fila de encabezados.
export const SHEET_HEADERS = [
  "timestamp",
  "nombre_completo",
  "email",
  "telefono",
  "asiste",
  "cantidad_acompanantes",
  "nombres_acompanantes",
  "restriccion_alimentaria",
  "detalle_restriccion",
  "cancion_sugerida",
  "mensaje",
] as const;

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !rawKey) {
    throw new Error(
      "Faltan credenciales de Google. Configurá GOOGLE_SERVICE_ACCOUNT_EMAIL y GOOGLE_PRIVATE_KEY."
    );
  }

  // Las variables de entorno guardan los saltos de línea como \n literales;
  // hay que convertirlos a saltos reales para que la clave sea válida.
  const privateKey = rawKey.replace(/\\n/g, "\n");

  return new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheetId() {
  const id = process.env.GOOGLE_SHEET_ID;
  if (!id) {
    throw new Error("Falta GOOGLE_SHEET_ID en las variables de entorno.");
  }
  return id;
}

/** Convierte un RSVP validado en la fila que se escribe en el Sheet. */
function toRow(data: RsvpData, timestamp: string): string[] {
  return [
    timestamp,
    data.nombreCompleto,
    data.email,
    data.telefono ?? "",
    data.asiste === "si" ? "Sí" : "No",
    data.asiste === "si" ? String(data.cantidadAcompanantes ?? 0) : "",
    data.asiste === "si" ? data.nombresAcompanantes ?? "" : "",
    data.restriccionAlimentaria ?? "Ninguna",
    data.detalleRestriccion ?? "",
    data.cancionSugerida ?? "",
    data.mensaje ?? "",
  ];
}

/**
 * Agrega una fila con el RSVP al final de la pestaña configurada.
 * `timestamp` lo genera el servidor (no el invitado).
 */
export async function appendRsvp(
  data: RsvpData,
  timestamp: string
): Promise<void> {
  const sheets = google.sheets({ version: "v4", auth: getAuth() });

  await sheets.spreadsheets.values.append({
    spreadsheetId: getSheetId(),
    range: `${SHEET_TAB}!A:K`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [toRow(data, timestamp)],
    },
  });
}

/**
 * Utilidad opcional: asegura que la primera fila tenga los encabezados.
 * Útil para ejecutar una vez al preparar el Sheet (ver scripts/initSheet).
 */
export async function ensureHeaders(): Promise<void> {
  const sheets = google.sheets({ version: "v4", auth: getAuth() });
  const spreadsheetId = getSheetId();

  const current = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_TAB}!A1:K1`,
  });

  const hasHeaders = (current.data.values?.[0]?.length ?? 0) > 0;
  if (hasHeaders) return;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${SHEET_TAB}!A1`,
    valueInputOption: "RAW",
    requestBody: { values: [[...SHEET_HEADERS]] },
  });
}
