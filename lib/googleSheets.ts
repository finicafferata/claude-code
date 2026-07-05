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
// Ahora se escribe UNA FILA POR PERSONA (el titular + cada acompañante).
export const SHEET_HEADERS = [
  "timestamp",
  "rol", // "Titular" o "Acompañante"
  "grupo", // nombre del titular: agrupa a toda la familia/grupo
  "nombre_completo",
  "email",
  "telefono",
  "asiste",
  "necesita_traslado",
  "restriccion_alimentaria",
  "detalle_restriccion",
  "cancion_sugerida",
  "mensaje",
] as const;

// Última columna del rango, derivada de la cantidad de encabezados (ej. 12 -> "L").
const LAST_COL = String.fromCharCode(64 + SHEET_HEADERS.length);

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

/**
 * Convierte un RSVP validado en una o varias filas: una para el titular
 * (quien completa el formulario) y una por cada acompañante con nombre.
 */
function toRows(data: RsvpData, timestamp: string): string[][] {
  const asiste = data.asiste === "si";
  const traslado = asiste ? (data.necesitaTraslado === "si" ? "Sí" : "No") : "";
  const grupo = data.nombreCompleto; // agrupa a todo el grupo por el titular

  // Fila del titular
  const rows: string[][] = [
    [
      timestamp,
      "Titular",
      grupo,
      data.nombreCompleto,
      data.email,
      data.telefono ?? "",
      asiste ? "Sí" : "No",
      traslado,
      data.restriccionAlimentaria ?? "Ninguna",
      data.detalleRestriccion ?? "",
      data.cancionSugerida ?? "",
      data.mensaje ?? "",
    ],
  ];

  // Una fila por acompañante (solo si el titular asiste)
  if (asiste) {
    for (const a of data.acompanantes ?? []) {
      const nombre = (a.nombre ?? "").trim();
      if (!nombre) continue; // saltear acompañantes sin nombre
      rows.push([
        timestamp,
        "Acompañante",
        grupo,
        nombre,
        "", // email (no se pide por acompañante)
        "", // teléfono
        "Sí", // vienen con el titular
        traslado, // mismo traslado que el grupo
        a.restriccionAlimentaria ?? "Ninguna",
        a.detalleRestriccion ?? "",
        "", // canción
        "", // mensaje
      ]);
    }
  }

  return rows;
}

/**
 * Agrega las filas del RSVP al final de la pestaña configurada: una para el
 * titular y una por cada acompañante. `timestamp` lo genera el servidor.
 */
export async function appendRsvp(
  data: RsvpData,
  timestamp: string
): Promise<void> {
  const sheets = google.sheets({ version: "v4", auth: getAuth() });

  await sheets.spreadsheets.values.append({
    spreadsheetId: getSheetId(),
    range: `${SHEET_TAB}!A:${LAST_COL}`,
    // RAW (no USER_ENTERED): guarda el texto literal. Evita que un valor que
    // empieza con + = - @ (ej. un teléfono "+54...") se interprete como
    // fórmula y quede como #ERROR!, y previene inyección de fórmulas.
    valueInputOption: "RAW",
    // OVERWRITE (no INSERT_ROWS): escribe en las filas vacías que ya existen
    // debajo, sin insertar filas nuevas en la grilla. Insertar filas correría
    // hacia abajo las referencias de fórmulas de otras pestañas (ej. la de
    // "Confirmados"), rompiéndolas con cada confirmación.
    insertDataOption: "OVERWRITE",
    requestBody: {
      values: toRows(data, timestamp),
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
    range: `${SHEET_TAB}!A1:${LAST_COL}1`,
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
