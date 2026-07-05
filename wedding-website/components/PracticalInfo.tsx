"use client";

// components/PracticalInfo.tsx — Alojamiento, transporte, regalos (alias/CBU) y FAQ (acordeón).

import { useState } from "react";
import { siteConfig } from "@/content/config";
import Reveal from "./Reveal";

// Botón para copiar alias/CBU al portapapeles.
function CopiarDato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(valor);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      // Silencioso: si falla el portapapeles, el dato igual está visible.
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-crema px-4 py-3 ring-1 ring-linea">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-tinta-suave">{etiqueta}</p>
        <p className="truncate font-medium text-tinta">{valor}</p>
      </div>
      <button
        type="button"
        onClick={copiar}
        aria-label={`Copiar ${etiqueta}`}
        className="shrink-0 rounded-full border border-linea px-4 py-1.5 text-sm font-medium text-salvia-oscuro transition-colors hover:bg-salvia-claro"
      >
        {copiado ? "¡Copiado!" : "Copiar"}
      </button>
    </div>
  );
}

// Ítem del acordeón de FAQ.
function ItemFaq({
  pregunta,
  respuesta,
  abierto,
  onToggle,
  id,
}: {
  pregunta: string;
  respuesta: string;
  abierto: boolean;
  onToggle: () => void;
  id: string;
}) {
  return (
    <div className="border-b border-linea">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={abierto}
          aria-controls={`${id}-panel`}
          id={`${id}-boton`}
          className="flex w-full items-center justify-between gap-4 py-5 text-left"
        >
          <span className="font-serif text-xl text-tinta">{pregunta}</span>
          <span
            className={[
              "shrink-0 text-dorado transition-transform duration-300",
              abierto ? "rotate-45" : "rotate-0",
            ].join(" ")}
            aria-hidden="true"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-boton`}
        className={[
          "grid transition-all duration-300 ease-out",
          abierto ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0",
        ].join(" ")}
      >
        <div className="overflow-hidden">
          <p className="text-tinta-suave">{respuesta}</p>
        </div>
      </div>
    </div>
  );
}

export default function PracticalInfo() {
  const { alojamiento, transporte, regalos, faq } = siteConfig;
  const [abierto, setAbierto] = useState<number | null>(0);

  return (
    <section id="info" className="bg-marfil px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal className="text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-dorado">
            Para que tengas todo a mano
          </p>
          <h2 className="font-serif text-4xl font-medium text-tinta sm:text-5xl">
            Información útil
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Alojamiento */}
          <Reveal as="article">
            <div className="h-full rounded-3xl bg-crema p-8 ring-1 ring-linea">
              <h3 className="font-serif text-2xl font-medium text-tinta">Alojamiento</h3>
              <ul className="mt-5 space-y-4">
                {alojamiento.map((a) => (
                  <li key={a.nombre}>
                    <p className="font-medium text-tinta">{a.nombre}</p>
                    <p className="text-tinta-suave">{a.detalle}</p>
                    {a.link && (
                      <a
                        href={a.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-sm font-medium text-salvia-oscuro underline underline-offset-4 hover:text-dorado"
                      >
                        Ver ubicación
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Transporte */}
          <Reveal as="article" delay={100}>
            <div className="h-full rounded-3xl bg-crema p-8 ring-1 ring-linea">
              <h3 className="font-serif text-2xl font-medium text-tinta">
                {transporte.titulo}
              </h3>
              <p className="mt-5 text-tinta-suave">{transporte.texto}</p>
              <p className="mt-3 rounded-xl bg-salvia-claro/50 px-4 py-3 text-sm font-medium text-salvia-oscuro">
                {transporte.detalle}
              </p>
            </div>
          </Reveal>

          {/* Regalos (ocupa las dos columnas en desktop) */}
          <Reveal as="article" delay={60} className="md:col-span-2">
            <div className="rounded-3xl bg-crema p-8 ring-1 ring-linea">
              <h3 className="font-serif text-2xl font-medium text-tinta">
                {regalos.titulo}
              </h3>
              <p className="mt-4 max-w-2xl text-tinta-suave">{regalos.mensaje}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <CopiarDato etiqueta="Alias" valor={regalos.alias} />
                <CopiarDato etiqueta="CBU" valor={regalos.cbu} />
              </div>
              <p className="mt-3 text-sm text-tinta-suave">
                Titular: {regalos.titular}
              </p>
            </div>
          </Reveal>
        </div>

        {/* FAQ */}
        <Reveal className="mt-14">
          <h3 className="text-center font-serif text-3xl font-medium text-tinta">
            Preguntas frecuentes
          </h3>
          <div className="mx-auto mt-6 max-w-3xl">
            {faq.map((item, i) => (
              <ItemFaq
                key={item.pregunta}
                id={`faq-${i}`}
                pregunta={item.pregunta}
                respuesta={item.respuesta}
                abierto={abierto === i}
                onToggle={() => setAbierto(abierto === i ? null : i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
