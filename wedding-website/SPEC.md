# Especificación — Web de Casamiento con RSVP

> Sitio web para el casamiento, con confirmación de asistencia (RSVP), detalles
> del evento e información práctica. Las respuestas se registran en un **Google
> Sheet** que funciona como base de datos.

---

## 1. Objetivo

Crear una web **hermosa, rápida y fácil de usar** donde los invitados puedan:

1. Ver los detalles de la fiesta (fecha, lugar, cómo llegar, dress code).
2. **Confirmar asistencia (RSVP)** indicando si van o no.
3. Informar **restricciones alimentarias** y otros datos relevantes.
4. Consultar información práctica (alojamiento, transporte, regalos, FAQ).

Toda respuesta de RSVP queda guardada automáticamente en un **Google Sheet**
que los organizadores pueden abrir, filtrar y exportar.

---

## 2. Alcance (según lo definido)

**Idioma:** Español (Argentina).

**Secciones incluidas:**

| Sección | Descripción |
|---|---|
| **Hero / Portada** | Nombres de los novios, fecha, y una foto/imagen de fondo. |
| **Cuenta regresiva** | Contador en vivo hasta el día del casamiento. |
| **Nuestra historia** | Breve texto + fotos de la pareja (opcional, editable). |
| **Detalles del evento** | Ceremonia y fiesta: fecha, hora, dirección, mapa, dress code. |
| **Info práctica** | Alojamiento sugerido, cómo llegar/transporte, lista de regalos / datos bancarios, FAQ. |
| **RSVP** | Formulario de confirmación de asistencia (el corazón del sitio). |

**Fuera de alcance (por ahora):** panel de administración propio, sitio
bilingüe, login de invitados. Se pueden agregar más adelante (ver §9).

---

## 3. Stack técnico

| Capa | Tecnología | Por qué |
|---|---|---|
| **Framework** | **Next.js (App Router) + React + TypeScript** | Web moderna, rápida, con buen SEO y componentes reutilizables. |
| **Estilos** | **Tailwind CSS** | Permite lograr un diseño elegante y responsive rápido. |
| **Animaciones** | Framer Motion (sutiles: fades, scroll reveal) | Le da ese toque "muy lindo" sin recargar. |
| **Base de datos** | **Google Sheet** | Simple, gratis, editable por cualquiera del equipo desde el celular. |
| **Conexión al Sheet** | **Google Sheets API** vía *Service Account*, desde una **API Route** de Next.js | Las credenciales quedan del lado del servidor, nunca en el navegador. |
| **Hosting** | **Vercel** (plan gratuito) | Deploy automático desde Git, dominio gratis y HTTPS incluido. |
| **Dominio (opcional)** | Ej: `nombres-boda.com` o subdominio de Vercel | Se puede comprar un dominio lindo y apuntarlo a Vercel. |

**Diagrama de flujo del RSVP:**

```
Invitado → Formulario RSVP (navegador)
             │  POST /api/rsvp
             ▼
        API Route (Next.js, en Vercel)
             │  Google Sheets API (Service Account)
             ▼
        Google Sheet  ──►  Los organizadores ven / filtran / exportan
```

---

## 4. Modelo de datos (Google Sheet)

**Hoja principal: `RSVP`**

| Columna | Campo | Tipo | Ejemplo |
|---|---|---|---|
| A | `timestamp` | Fecha/hora | 2026-03-14 21:03 |
| B | `nombre_completo` | Texto | Juan Pérez |
| C | `email` | Texto | juan@mail.com |
| D | `telefono` | Texto | +54 9 11 5555-5555 |
| E | `asiste` | Sí / No | Sí |
| F | `cantidad_acompanantes` | Número | 1 |
| G | `nombres_acompanantes` | Texto | María Pérez |
| H | `restriccion_alimentaria` | Texto | Vegetariano / Celíaco / Ninguna |
| I | `detalle_restriccion` | Texto | Alergia a frutos secos |
| J | `cancion_sugerida` | Texto (opcional) | ... |
| K | `mensaje` | Texto (opcional) | ¡Felicitaciones! |

**Notas de diseño de datos:**
- Cada envío del formulario = **una fila nueva** (append), nunca se pisa.
- El `timestamp` lo pone el servidor, no el invitado.
- Se puede agregar una hoja `Config` para editar textos del sitio sin tocar código (fase 2).
- Validaciones/formato condicional en el Sheet para resaltar los "No asisten" o las restricciones.

---

## 5. Formulario RSVP — campos

1. **Nombre completo** *(obligatorio)*
2. **Email** *(obligatorio, validado)*
3. **Teléfono** *(opcional)*
4. **¿Vas a asistir?** *(obligatorio: Sí / No)*
5. Si responde **Sí**:
   - **¿Cuántos van con vos?** (acompañantes)
   - **Nombres de los acompañantes**
   - **Restricción alimentaria** (selector: Ninguna / Vegetariano / Vegano / Celíaco / Otra)
   - **Detalle de la restricción** (texto libre, si eligió "Otra" o quiere aclarar)
   - **Canción que no puede faltar** *(opcional, divertido)*
6. **Mensaje para los novios** *(opcional)*

**Comportamiento:**
- Validación en el cliente (campos obligatorios, formato de email).
- Estado de carga mientras envía + mensaje de éxito ("¡Gracias, tu confirmación quedó registrada!").
- Manejo de errores (si falla el guardado, avisar y permitir reintentar).
- Protección anti-spam simple (honeypot y/o rate limiting).

---

## 6. Diseño y experiencia

- **Estética:** elegante, romántica, minimalista. Paleta suave (a definir con los novios), buena tipografía (una serif para títulos + una sans legible para el cuerpo).
- **Responsive:** pensado *mobile-first* — la mayoría abrirá la invitación desde el celular.
- **Accesibilidad:** buen contraste, navegación por teclado, textos alternativos en imágenes.
- **Performance:** imágenes optimizadas (`next/image`), carga rápida.
- **Navegación:** una sola página larga (one-page) con scroll suave y un menú fijo que ancla a cada sección.

---

## 7. Estructura del proyecto (propuesta)

```
wedding-website/
├── app/
│   ├── page.tsx              # Página principal (one-page)
│   ├── layout.tsx            # Layout + fuentes + metadata
│   ├── globals.css
│   └── api/
│       └── rsvp/route.ts     # Endpoint que escribe en el Google Sheet
├── components/
│   ├── Hero.tsx
│   ├── Countdown.tsx
│   ├── OurStory.tsx
│   ├── EventDetails.tsx
│   ├── PracticalInfo.tsx
│   ├── RsvpForm.tsx
│   └── Navbar.tsx
├── lib/
│   └── googleSheets.ts       # Cliente de Google Sheets API
├── content/
│   └── config.ts             # Textos, fechas, direcciones (fácil de editar)
├── public/                   # Imágenes
├── .env.local                # Credenciales (NO se sube a git)
└── package.json
```

---

## 8. Configuración de Google Sheets (pasos)

1. Crear el Google Sheet con las columnas de §4.
2. En **Google Cloud Console**: crear un proyecto y habilitar la **Google Sheets API**.
3. Crear una **Service Account** y descargar su archivo de credenciales (JSON).
4. **Compartir el Sheet** con el email de la Service Account (permiso de *Editor*).
5. Guardar en variables de entorno (en `.env.local` y en Vercel):
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `GOOGLE_SHEET_ID`

> ⚠️ **Seguridad:** las credenciales viven solo en el servidor (API Route) y en
> las variables de entorno de Vercel. Nunca se exponen al navegador ni se suben
> al repositorio.

---

## 9. Roadmap sugerido (fases)

**Fase 1 — MVP (lo esencial):**
- [ ] Setup del proyecto Next.js + Tailwind.
- [ ] Sección Hero + Cuenta regresiva + Detalles del evento.
- [ ] Formulario RSVP funcionando y escribiendo en el Google Sheet.
- [ ] Deploy en Vercel.

**Fase 2 — Completar contenido:**
- [ ] Sección "Nuestra historia" con fotos.
- [ ] Info práctica (alojamiento, transporte, regalos, FAQ).
- [ ] Ajustes finos de diseño, animaciones y textos definitivos.

**Fase 3 — Extras (opcional, a futuro):**
- [ ] Panel de administración propio para ver respuestas sin abrir el Sheet.
- [ ] Email de confirmación automático al invitado.
- [ ] Galería de fotos post-evento.
- [ ] Versión bilingüe.

---

## 10. Cosas que necesito de ustedes para avanzar

Para pasar de la spec a la construcción, cuando puedan pásenme:

- Nombres de los novios y **fecha + hora** exacta del casamiento.
- Dirección de la **ceremonia** y de la **fiesta** (con link de Google Maps si tienen).
- **Dress code**.
- Fotos de la pareja (para Hero e Historia).
- Preferencias de **colores/estilo** (o me guío yo con una propuesta elegante).
- Datos de **regalos** (alias/CBU o lista) y de **alojamiento/transporte**, si aplican.
- Si quieren **dominio propio** o alcanza con el de Vercel.

---

*Documento de especificación — versión 1. Cualquier ajuste lo actualizamos acá antes de empezar a construir.*
