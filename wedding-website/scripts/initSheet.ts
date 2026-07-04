/**
 * Inicializa el Google Sheet: escribe la fila de encabezados si está vacía.
 *
 * Ejecutá una sola vez, después de configurar .env.local:
 *   npx tsx scripts/initSheet.ts
 *
 * (Requiere que las variables de entorno de Google estén cargadas.)
 */
import { ensureHeaders, SHEET_HEADERS } from "../lib/googleSheets";

async function main() {
  await ensureHeaders();
  console.log("✅ Encabezados listos en el Sheet:");
  console.log("   " + SHEET_HEADERS.join(" | "));
}

main().catch((err) => {
  console.error("❌ Error inicializando el Sheet:", err);
  process.exit(1);
});
