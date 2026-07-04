# Brief de diseño — Frontend de la web de casamiento

Este documento tiene **dos partes**:

1. **El prompt listo para pegar en Claude** (app / artifacts) para que genere el frontend.
2. **Notas y contrato técnico** para que lo generado encaje con el backend ya construido.

> 💡 **Cómo usarlo:** abrí Claude, pegá el prompt de la Parte 1, y adjuntá o pegá
> también este archivo entero para que tenga el contexto técnico. Cuando tengas
> los datos reales de la fiesta, sumalos al prompt (o dejá que use los placeholders).

---

## Parte 1 — Prompt para pegar en Claude

```
Necesito que diseñes el frontend de una web de casamiento, elegante y romántica,
en una sola página (one-page) con scroll suave. Es un proyecto Next.js (App Router)
+ TypeScript + Tailwind CSS que YA tiene el backend hecho. Vos hacés SOLO el frontend.

CONTEXTO TÉCNICO IMPORTANTE:
- Framework: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS.
- El contenido (nombres, fechas, direcciones) viene de un objeto `siteConfig`
  importado desde "@/content/config". Usá esos valores, no hardcodees texto.
- El RSVP se envía con fetch a POST /api/rsvp (ese endpoint YA existe). No lo crees.
- Idioma del sitio: español (Argentina).

SECCIONES (en este orden, todas en app/page.tsx como componentes en /components):
1. Navbar fijo con anclas a cada sección + scroll suave.
2. Hero: nombres de los novios, fecha, una imagen de fondo a pantalla completa.
3. Countdown: cuenta regresiva en vivo hasta la fecha (siteConfig.fecha.iso).
4. OurStory: título + texto + 2 fotos.
5. EventDetails: dos tarjetas (Ceremonia y Fiesta) con lugar, dirección, hora,
   botón "Cómo llegar" (link a Google Maps) y el dress code.
6. PracticalInfo: alojamiento, transporte, regalos (con alias/CBU) y un FAQ (acordeón).
7. RsvpForm: el formulario de confirmación (ver contrato abajo). Es lo más importante.
8. Footer simple con el hashtag.

ESTÉTICA:
- Elegante, romántica, minimalista. Mobile-first (la mayoría entra desde el celular).
- Tipografía: una serif linda para títulos + una sans legible para el cuerpo.
- Paleta suave y sofisticada (podés proponer una; ej. crema/verde salvia/dorado tenue).
- Animaciones sutiles al hacer scroll (fade/slide-in). Nada estridente.
- Buen contraste y accesibilidad (navegación por teclado, alt en imágenes).

FORMULARIO RSVP — campos y comportamiento:
- nombreCompleto (texto, obligatorio)
- email (email, obligatorio)
- telefono (texto, opcional)
- asiste: elegir "Sí" o "No" (obligatorio). Manda "si" o "no".
- Si asiste === "si", mostrar además:
    - cantidadAcompanantes (número, 0 a 20)
    - nombresAcompanantes (texto)
    - restriccionAlimentaria (select: Ninguna | Vegetariano | Vegano | Celíaco | Otra)
    - detalleRestriccion (texto; obligatorio SOLO si restriccion === "Otra")
    - cancionSugerida (texto, opcional)
- mensaje (textarea, opcional)
- Campo honeypot oculto llamado "website" (input escondido con CSS, tabIndex -1,
  autoComplete off). Se manda siempre vacío. NO debe verlo el usuario.

ENVÍO DEL FORMULARIO:
- POST a /api/rsvp con Content-Type application/json y el body con esos campos.
- Estados: idle / enviando (deshabilitar botón + spinner) / éxito / error.
- Éxito (200 {ok:true}): mostrar un mensaje lindo tipo "¡Gracias! Tu confirmación
  quedó registrada 🎉" y ocultar el formulario.
- Error 422: el body trae { fieldErrors: { campo: [mensajes] } }. Mostrar el error
  debajo de cada campo correspondiente.
- Error 429 o 502: mostrar un mensaje general y permitir reintentar.
- Validar en el cliente antes de enviar (usá el mismo criterio que el backend).

ENTREGABLES:
- app/page.tsx que compone las secciones.
- Un componente por sección en /components.
- app/globals.css con la config de Tailwind y las fuentes.
- Usá los placeholders de siteConfig donde falten datos reales.
- Código limpio, comentado en español donde ayude.
```

---

## Parte 2 — Contrato técnico (referencia)

### Endpoint del RSVP

`POST /api/rsvp` — body JSON:

| Campo | Tipo | Regla |
|---|---|---|
| `nombreCompleto` | string | obligatorio, 2–120 |
| `email` | string | obligatorio, email válido |
| `telefono` | string | opcional |
| `asiste` | `"si"` \| `"no"` | obligatorio |
| `cantidadAcompanantes` | number | 0–20 (solo si asiste) |
| `nombresAcompanantes` | string | opcional |
| `restriccionAlimentaria` | enum | `Ninguna\|Vegetariano\|Vegano\|Celíaco\|Otra` |
| `detalleRestriccion` | string | obligatorio si `restriccionAlimentaria === "Otra"` |
| `cancionSugerida` | string | opcional |
| `mensaje` | string | opcional |
| `website` | string | **honeypot** — siempre vacío |

**Respuestas:**

| Código | Cuerpo | Significado |
|---|---|---|
| `200` | `{ ok: true }` | Guardado OK |
| `422` | `{ ok: false, error, fieldErrors }` | Errores de validación por campo |
| `429` | `{ ok: false, error }` | Rate limit (demasiados intentos) |
| `502` | `{ ok: false, error }` | Falló el guardado en el Sheet |

> El esquema exacto (con mensajes de error en español) está en
> [`lib/rsvpSchema.ts`](./lib/rsvpSchema.ts). El frontend puede **importar
> `rsvpSchema`** desde ahí para validar en el cliente con los mismos criterios.

### Ejemplo de envío (fetch)

```ts
const res = await fetch("/api/rsvp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});
const data = await res.json();
if (res.ok && data.ok) {
  // éxito
} else if (res.status === 422) {
  // data.fieldErrors → mostrar por campo
} else {
  // data.error → mensaje general
}
```

### Contenido / placeholders

Todo el texto sale de `siteConfig` en [`content/config.ts`](./content/config.ts).
Los componentes deben leer de ahí (ej. `siteConfig.novios.persona1`,
`siteConfig.fecha.iso`, `siteConfig.ceremonia.mapsUrl`, etc.).

### Falta agregar (dependencias del frontend)

El backend no usa Tailwind. Cuando incorpores el frontend, sumá:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
# y, si usás animaciones:
npm install framer-motion
```

Y creá `app/globals.css` con las directivas de Tailwind, importándolo en `app/layout.tsx`.
