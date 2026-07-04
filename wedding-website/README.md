# Web de Casamiento 💍

Sitio con RSVP que guarda las confirmaciones en un **Google Sheet**.
Stack: **Next.js (App Router) + TypeScript + Google Sheets API**, deploy en **Vercel**.

Este README cubre el **backend** (ya construido y funcionando). Para el frontend,
ver [`DESIGN_BRIEF.md`](./DESIGN_BRIEF.md).

---

## Estado actual

- ✅ Backend completo: endpoint `POST /api/rsvp` valida y escribe en el Sheet.
- ✅ Validación de datos con Zod, anti-spam (honeypot + rate limiting).
- ✅ Endpoint `GET /api/health` para chequear la configuración.
- ✅ Compila y buildea (`npm run build`).
- ⏳ Frontend: a generar con Claude (ver `DESIGN_BRIEF.md`).
- ⏳ Contenido real: reemplazar placeholders en `content/config.ts`.

---

## Estructura

```
wedding-website/
├── app/
│   ├── layout.tsx            # Layout raíz (metadata)
│   ├── page.tsx              # Placeholder (lo reemplaza el frontend)
│   └── api/
│       ├── rsvp/route.ts     # POST: valida y guarda el RSVP en el Sheet
│       └── health/route.ts   # GET: chequea que las credenciales estén cargadas
├── lib/
│   ├── googleSheets.ts       # Cliente de Google Sheets (Service Account)
│   ├── rsvpSchema.ts         # Esquema Zod + tipos (compartido front/back)
│   └── rateLimit.ts          # Rate limiting simple por IP
├── content/
│   └── config.ts             # Textos, fechas, direcciones (PLACEHOLDERS)
├── scripts/
│   └── initSheet.ts          # Escribe los encabezados en el Sheet (correr 1 vez)
├── .env.example              # Plantilla de variables de entorno
└── DESIGN_BRIEF.md           # Brief para generar el frontend con Claude
```

## El contrato del RSVP (para el frontend)

El formulario debe hacer un `POST /api/rsvp` con este JSON:

```jsonc
{
  "nombreCompleto": "Juan Pérez",        // obligatorio (2–120)
  "email": "juan@mail.com",              // obligatorio, email válido
  "telefono": "+54 9 11 5555-5555",      // opcional
  "asiste": "si",                        // "si" | "no"  (obligatorio)
  "cantidadAcompanantes": 1,             // número >= 0 (solo si asiste)
  "nombresAcompanantes": "María Pérez",  // opcional
  "restriccionAlimentaria": "Vegetariano", // Ninguna|Vegetariano|Vegano|Celíaco|Otra
  "detalleRestriccion": "",              // obligatorio SOLO si restriccion === "Otra"
  "cancionSugerida": "",                 // opcional
  "mensaje": "¡Felicitaciones!",         // opcional
  "website": ""                          // honeypot: dejar SIEMPRE vacío
}
```

**Respuestas del servidor:**
- `200 { ok: true }` → guardado con éxito.
- `422 { ok: false, error, fieldErrors }` → errores de validación por campo.
- `429 { ok: false, error }` → demasiados intentos (rate limit).
- `502 { ok: false, error }` → falló el guardado en el Sheet.

---

## Puesta en marcha

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Google Sheets

1. Creá un Google Sheet con una pestaña llamada `RSVP`.
2. En [Google Cloud Console](https://console.cloud.google.com/):
   - Creá un proyecto y habilitá la **Google Sheets API**.
   - Creá una **Service Account** y generá una **key JSON**.
3. Abrí el JSON descargado y copiá `client_email` y `private_key`.
4. **Compartí el Sheet** con ese `client_email`, con permiso de **Editor**.
5. Copiá el **ID del Sheet** (está en la URL, entre `/d/` y `/edit`).

### 3. Variables de entorno

```bash
cp .env.example .env.local
```

Completá `.env.local`:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=xxx@xxx.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=1AbC...
GOOGLE_SHEET_TAB=RSVP
```

> El `private_key` va entre comillas y con los `\n` tal cual vienen en el JSON.

### 4. Inicializar los encabezados del Sheet (una vez)

```bash
npx tsx scripts/initSheet.ts
```

### 5. Correr en local

```bash
npm run dev
```

Verificá la config en <http://localhost:3000/api/health> → debería decir `"configured": true`.

Probá el endpoint:

```bash
curl -X POST http://localhost:3000/api/rsvp \
  -H "Content-Type: application/json" \
  -d '{"nombreCompleto":"Test Uno","email":"test@mail.com","asiste":"si","cantidadAcompanantes":0,"restriccionAlimentaria":"Ninguna"}'
```

Debería devolver `{"ok":true}` y aparecer una fila nueva en el Sheet.

---

## Deploy en Vercel

1. Importá el proyecto en [Vercel](https://vercel.com/new) (root: `wedding-website`).
2. En **Settings → Environment Variables**, cargá las 4 variables del `.env.local`.
   - Ojo con `GOOGLE_PRIVATE_KEY`: pegá el valor completo con los `\n`.
3. Deploy. Vercel te da una URL con HTTPS. (Opcional: dominio propio.)

---

## Reemplazar los placeholders

Todo el contenido editable vive en [`content/config.ts`](./content/config.ts).
Buscá los `// TODO` y reemplazá nombres, fechas, direcciones, etc. No hace falta
tocar el resto del código.
