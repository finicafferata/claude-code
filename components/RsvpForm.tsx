"use client";

// components/RsvpForm.tsx — Formulario de confirmación de asistencia (RSVP).
// Envía POST /api/rsvp (JSON). Maneja estados idle/enviando/éxito/error,
// validación en cliente, errores por campo (422) y honeypot anti-spam.

import { useState } from "react";
import { siteConfig } from "@/content/config";
import Reveal from "./Reveal";

// --- Tipos -------------------------------------------------------------------
type Asiste = "" | "si" | "no";

const RESTRICCIONES = ["Ninguna", "Vegetariano", "Vegano", "Celíaco", "Otra"] as const;
type Restriccion = (typeof RESTRICCIONES)[number];

// Cada acompañante tiene su propio nombre y restricción alimentaria.
type Acompanante = {
  nombre: string;
  restriccionAlimentaria: Restriccion;
  detalleRestriccion: string;
};

const acompananteVacio = (): Acompanante => ({
  nombre: "",
  restriccionAlimentaria: "Ninguna",
  detalleRestriccion: "",
});

type FormState = {
  nombreCompleto: string;
  email: string;
  telefono: string;
  asiste: Asiste;
  cantidadAcompanantes: string; // string en el input; se castea a número al enviar
  acompanantes: Acompanante[];
  necesitaTraslado: "si" | "no";
  restriccionAlimentaria: Restriccion;
  detalleRestriccion: string;
  cancionSugerida: string;
  mensaje: string;
  website: string; // honeypot (siempre vacío)
};

type FieldErrors = Partial<Record<keyof FormState, string[]>>;
type Estado = "idle" | "enviando" | "exito" | "error";

const INICIAL: FormState = {
  nombreCompleto: "",
  email: "",
  telefono: "",
  asiste: "",
  cantidadAcompanantes: "0",
  acompanantes: [],
  necesitaTraslado: "no",
  restriccionAlimentaria: "Ninguna",
  detalleRestriccion: "",
  cancionSugerida: "",
  mensaje: "",
  website: "",
};

// --- Validación en cliente (mismo criterio que el backend) -------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validar(f: FormState): FieldErrors {
  const e: FieldErrors = {};

  if (!f.nombreCompleto.trim()) e.nombreCompleto = ["Ingresá tu nombre completo."];
  if (!f.email.trim()) e.email = ["Ingresá tu email."];
  else if (!EMAIL_RE.test(f.email.trim())) e.email = ["El email no parece válido."];
  if (f.asiste !== "si" && f.asiste !== "no")
    e.asiste = ["Indicá si vas a asistir."];

  if (f.asiste === "si") {
    const n = Number(f.cantidadAcompanantes);
    if (!Number.isInteger(n) || n < 0 || n > 20)
      e.cantidadAcompanantes = ["Debe ser un número entre 0 y 20."];
    if (f.restriccionAlimentaria === "Otra" && !f.detalleRestriccion.trim())
      e.detalleRestriccion = ["Contanos cuál es la restricción."];
  }

  return e;
}

// --- Componente --------------------------------------------------------------
export default function RsvpForm() {
  const { novia, novio } = siteConfig.novios;

  const [form, setForm] = useState<FormState>(INICIAL);
  const [errores, setErrores] = useState<FieldErrors>({});
  const [estado, setEstado] = useState<Estado>("idle");
  const [errorGeneral, setErrorGeneral] = useState<string>("");

  const asisteSi = form.asiste === "si";
  const vaConAcompanantes = Number(form.cantidadAcompanantes) > 0;

  // Actualiza un campo y limpia su error mientras el usuario corrige.
  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrores((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }

  // Cambiar la cantidad de acompañantes ajusta el array (agrega/quita filas).
  function setCantidad(value: string) {
    const n = Math.max(0, Math.min(20, Math.floor(Number(value) || 0)));
    setForm((prev) => {
      const arr = prev.acompanantes.slice(0, n);
      while (arr.length < n) arr.push(acompananteVacio());
      return { ...prev, cantidadAcompanantes: value, acompanantes: arr };
    });
    setErrores((prev) =>
      prev.cantidadAcompanantes ? { ...prev, cantidadAcompanantes: undefined } : prev
    );
  }

  // Actualiza un campo de un acompañante puntual.
  function setAcomp(i: number, key: keyof Acompanante, value: string) {
    setForm((prev) => ({
      ...prev,
      acompanantes: prev.acompanantes.map((a, idx) =>
        idx === i ? ({ ...a, [key]: value } as Acompanante) : a
      ),
    }));
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setErrorGeneral("");

    // 1) Validación local
    const localErrors = validar(form);
    if (Object.keys(localErrors).length > 0) {
      setErrores(localErrors);
      // Llevar el foco al primer campo con error
      const first = Object.keys(localErrors)[0];
      document.getElementById(first)?.focus();
      return;
    }

    setErrores({});
    setEstado("enviando");

    // 2) Armar payload. Si no asiste, no mandamos los campos condicionales.
    const payload: Record<string, unknown> = {
      nombreCompleto: form.nombreCompleto.trim(),
      email: form.email.trim(),
      telefono: form.telefono.trim(),
      asiste: form.asiste,
      mensaje: form.mensaje.trim(),
      website: form.website, // honeypot, siempre vacío
    };

    if (asisteSi) {
      payload.cantidadAcompanantes = form.acompanantes.length;
      payload.acompanantes = form.acompanantes.map((a) => ({
        nombre: a.nombre.trim(),
        restriccionAlimentaria: a.restriccionAlimentaria,
        detalleRestriccion: a.detalleRestriccion.trim(),
      }));
      payload.necesitaTraslado = form.necesitaTraslado;
      payload.restriccionAlimentaria = form.restriccionAlimentaria;
      payload.detalleRestriccion = form.detalleRestriccion.trim();
      payload.cancionSugerida = form.cancionSugerida.trim();
    }

    // 3) Envío
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setEstado("exito");
        return;
      }

      if (res.status === 422) {
        // Errores por campo desde el backend
        const data = await res.json().catch(() => ({}));
        setErrores((data?.fieldErrors as FieldErrors) ?? {});
        setEstado("idle");
        return;
      }

      if (res.status === 429) {
        setErrorGeneral(
          "Recibimos muchas solicitudes en poco tiempo. Esperá unos segundos y volvé a intentar."
        );
      } else if (res.status === 502) {
        setErrorGeneral(
          "Tuvimos un problema al registrar tu confirmación. Por favor, intentá de nuevo."
        );
      } else {
        setErrorGeneral("Algo salió mal. Por favor, intentá nuevamente.");
      }
      setEstado("error");
    } catch {
      setErrorGeneral(
        "No pudimos conectar con el servidor. Revisá tu conexión e intentá de nuevo."
      );
      setEstado("error");
    }
  }

  // --- Vista de éxito: se oculta el formulario -------------------------------
  if (estado === "exito") {
    return (
      <section id="rsvp" className="bg-salvia px-6 py-24 text-white md:py-32">
        <div className="mx-auto max-w-xl text-center">
          <Reveal>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="font-serif text-4xl font-medium">¡Gracias! 🎉</h2>
            <p className="mt-4 text-lg text-white/90">
              Tu confirmación quedó registrada. ¡Nos vemos para celebrar con {novia} y {novio}!
            </p>
          </Reveal>
        </div>
      </section>
    );
  }

  // --- Formulario ------------------------------------------------------------
  return (
    <section id="rsvp" className="bg-crema px-6 py-20 md:py-28">
      <div className="mx-auto max-w-2xl">
        <Reveal className="text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-dorado">
            Nos encantaría contar con vos
          </p>
          <h2 className="font-serif text-4xl font-medium text-tinta sm:text-5xl">
            Confirmá tu asistencia
          </h2>
          <p className="mt-4 text-tinta-suave">
            Por favor, completá el formulario antes del {siteConfig.rsvp.fechaLimite}.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <form
            onSubmit={onSubmit}
            noValidate
            className="mt-10 space-y-6 rounded-3xl bg-marfil p-6 shadow-sm ring-1 ring-linea sm:p-10"
          >
            {/* Honeypot: oculto para humanos, visible para bots */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-9999px",
                width: 1,
                height: 1,
                overflow: "hidden",
              }}
            >
              <label htmlFor="website">No completar este campo</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
              />
            </div>

            {/* Nombre completo */}
            <Campo id="nombreCompleto" label="Nombre completo" requerido errores={errores.nombreCompleto}>
              <input
                id="nombreCompleto"
                name="nombreCompleto"
                type="text"
                autoComplete="name"
                value={form.nombreCompleto}
                onChange={(e) => set("nombreCompleto", e.target.value)}
                className={inputCls(!!errores.nombreCompleto)}
              />
            </Campo>

            {/* Email */}
            <Campo id="email" label="Email" requerido errores={errores.email}>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className={inputCls(!!errores.email)}
              />
            </Campo>

            {/* Teléfono */}
            <Campo id="telefono" label="Teléfono" opcional errores={errores.telefono}>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                autoComplete="tel"
                value={form.telefono}
                onChange={(e) => set("telefono", e.target.value)}
                className={inputCls(!!errores.telefono)}
              />
            </Campo>

            {/* ¿Asistís? */}
            <fieldset>
              <legend className="mb-2 block text-sm font-semibold text-tinta">
                ¿Vas a asistir? <span className="text-dorado">*</span>
              </legend>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { v: "si" as const, label: "Sí, ahí estaré" },
                  { v: "no" as const, label: "No podré ir" },
                ].map((op) => (
                  <label
                    key={op.v}
                    className={[
                      "cursor-pointer rounded-xl border px-4 py-3 text-center text-sm font-medium transition-colors",
                      form.asiste === op.v
                        ? "border-salvia bg-salvia text-white"
                        : "border-linea bg-crema text-tinta-suave hover:border-salvia",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="asiste"
                      value={op.v}
                      checked={form.asiste === op.v}
                      onChange={() => set("asiste", op.v)}
                      className="sr-only"
                    />
                    {op.label}
                  </label>
                ))}
              </div>
              <ErrorCampo errores={errores.asiste} id="asiste" />
            </fieldset>

            {/* Campos condicionales (solo si asiste === "si") */}
            {asisteSi && (
              <>
                {/* --- Bloque ACOMPAÑANTES (el +1) --- */}
                <div className="space-y-6 rounded-2xl bg-salvia-claro/30 p-5 ring-1 ring-salvia-claro">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-salvia-oscuro">
                    Acompañantes
                  </p>

                  {/* Cantidad de acompañantes */}
                  <Campo
                    id="cantidadAcompanantes"
                    label="Cantidad de acompañantes"
                    errores={errores.cantidadAcompanantes}
                  >
                    <input
                      id="cantidadAcompanantes"
                      name="cantidadAcompanantes"
                      type="number"
                      min={0}
                      max={20}
                      value={form.cantidadAcompanantes}
                      onChange={(e) => setCantidad(e.target.value)}
                      className={inputCls(!!errores.cantidadAcompanantes)}
                    />
                  </Campo>

                  {/* Una tarjeta por acompañante: nombre + su restricción */}
                  {form.acompanantes.map((a, i) => (
                    <div
                      key={i}
                      className="space-y-4 rounded-xl border border-salvia-claro bg-crema/60 p-4"
                    >
                      <p className="text-sm font-semibold text-tinta">
                        Acompañante {i + 1}
                      </p>

                      <Campo id={`acomp-nombre-${i}`} label="Nombre y apellido">
                        <input
                          id={`acomp-nombre-${i}`}
                          type="text"
                          value={a.nombre}
                          onChange={(e) => setAcomp(i, "nombre", e.target.value)}
                          className={inputCls(false)}
                        />
                      </Campo>

                      <Campo
                        id={`acomp-restr-${i}`}
                        label="Restricción alimentaria"
                      >
                        <select
                          id={`acomp-restr-${i}`}
                          value={a.restriccionAlimentaria}
                          onChange={(e) =>
                            setAcomp(i, "restriccionAlimentaria", e.target.value)
                          }
                          className={inputCls(false)}
                        >
                          {RESTRICCIONES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </Campo>

                      {a.restriccionAlimentaria === "Otra" && (
                        <Campo id={`acomp-detalle-${i}`} label="¿Cuál?">
                          <input
                            id={`acomp-detalle-${i}`}
                            type="text"
                            value={a.detalleRestriccion}
                            onChange={(e) =>
                              setAcomp(i, "detalleRestriccion", e.target.value)
                            }
                            className={inputCls(false)}
                          />
                        </Campo>
                      )}
                    </div>
                  ))}
                </div>

                {/* --- Bloque de QUIEN CONFIRMA (tus datos) --- */}
                {/* Restricción alimentaria */}
                <Campo
                  id="restriccionAlimentaria"
                  label="Tu restricción alimentaria"
                  errores={errores.restriccionAlimentaria}
                >
                  <select
                    id="restriccionAlimentaria"
                    name="restriccionAlimentaria"
                    value={form.restriccionAlimentaria}
                    onChange={(e) => set("restriccionAlimentaria", e.target.value as Restriccion)}
                    className={inputCls(!!errores.restriccionAlimentaria)}
                  >
                    {RESTRICCIONES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </Campo>

                {/* Detalle de restricción (obligatorio solo si es "Otra") */}
                {form.restriccionAlimentaria === "Otra" && (
                  <Campo
                    id="detalleRestriccion"
                    label="¿Cuál?"
                    requerido
                    errores={errores.detalleRestriccion}
                  >
                    <input
                      id="detalleRestriccion"
                      name="detalleRestriccion"
                      type="text"
                      value={form.detalleRestriccion}
                      onChange={(e) => set("detalleRestriccion", e.target.value)}
                      className={inputCls(!!errores.detalleRestriccion)}
                    />
                  </Campo>
                )}

                {/* ¿Necesita(n) traslado? — plural si va con acompañantes */}
                <fieldset>
                  <legend className="mb-2 block text-sm font-semibold text-tinta">
                    {vaConAcompanantes ? "¿Necesitan traslado?" : "¿Necesitás traslado?"}{" "}
                    <span className="font-normal text-tinta-suave">(combi ida y vuelta)</span>
                  </legend>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        v: "si" as const,
                        label: vaConAcompanantes ? "Sí, nos sumamos a la combi" : "Sí, me sumo a la combi",
                      },
                      {
                        v: "no" as const,
                        label: vaConAcompanantes ? "No, vamos por nuestra cuenta" : "No, voy por mi cuenta",
                      },
                    ].map((op) => (
                      <label
                        key={op.v}
                        className={[
                          "cursor-pointer rounded-xl border px-4 py-3 text-center text-sm font-medium transition-colors",
                          form.necesitaTraslado === op.v
                            ? "border-salvia bg-salvia text-white"
                            : "border-linea bg-crema text-tinta-suave hover:border-salvia",
                        ].join(" ")}
                      >
                        <input
                          type="radio"
                          name="necesitaTraslado"
                          value={op.v}
                          checked={form.necesitaTraslado === op.v}
                          onChange={() => set("necesitaTraslado", op.v)}
                          className="sr-only"
                        />
                        {op.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                {/* Canción sugerida */}
                <Campo
                  id="cancionSugerida"
                  label="Canción que no puede faltar"
                  opcional
                  errores={errores.cancionSugerida}
                >
                  <input
                    id="cancionSugerida"
                    name="cancionSugerida"
                    type="text"
                    value={form.cancionSugerida}
                    onChange={(e) => set("cancionSugerida", e.target.value)}
                    className={inputCls(!!errores.cancionSugerida)}
                  />
                </Campo>
              </>
            )}

            {/* Mensaje */}
            <Campo id="mensaje" label="Mensaje para los novios" opcional errores={errores.mensaje}>
              <textarea
                id="mensaje"
                name="mensaje"
                rows={4}
                value={form.mensaje}
                onChange={(e) => set("mensaje", e.target.value)}
                className={inputCls(!!errores.mensaje) + " resize-y"}
              />
            </Campo>

            {/* Error general (429 / 502 / red) */}
            {errorGeneral && (
              <p
                role="alert"
                className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {errorGeneral}
              </p>
            )}

            {/* Botón enviar */}
            <button
              type="submit"
              disabled={estado === "enviando"}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-dorado px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[oklch(0.62_0.07_85)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {estado === "enviando" ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                    aria-hidden="true"
                  />
                  Enviando…
                </>
              ) : (
                "Enviar confirmación"
              )}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

// --- Subcomponentes de campo -------------------------------------------------
function inputCls(error: boolean) {
  return [
    "w-full rounded-xl border bg-crema px-4 py-3 text-tinta placeholder:text-tinta-suave/60",
    "transition-colors focus:outline-none focus:ring-2 focus:ring-dorado/60",
    error ? "border-red-400" : "border-linea focus:border-salvia",
  ].join(" ");
}

function Campo({
  id,
  label,
  requerido,
  opcional,
  errores,
  children,
}: {
  id: string;
  label: string;
  requerido?: boolean;
  opcional?: boolean;
  errores?: string[];
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-tinta">
        {label}
        {requerido && <span className="text-dorado"> *</span>}
        {opcional && <span className="font-normal text-tinta-suave"> (opcional)</span>}
      </label>
      {children}
      <ErrorCampo errores={errores} id={id} />
    </div>
  );
}

function ErrorCampo({ errores, id }: { errores?: string[]; id: string }) {
  if (!errores || errores.length === 0) return null;
  return (
    <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-600">
      {errores[0]}
    </p>
  );
}
