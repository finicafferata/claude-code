// components/EventDetails.tsx — Dos tarjetas: Ceremonia y Fiesta + dress code.

import { siteConfig, type Evento } from "@/content/config";
import Reveal from "./Reveal";

// Ícono simple según el tipo de evento (sin SVGs complejos dibujados a mano).
function Icono({ tipo }: { tipo: "ceremonia" | "fiesta" }) {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-salvia-claro text-salvia-oscuro">
      {tipo === "ceremonia" ? (
        // Anillos
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="9" cy="14" r="5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="15" cy="14" r="5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ) : (
        // Copas
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 4l2 6a3 3 0 006 0l2-6M12 16v3M9 21h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

function TarjetaEvento({ evento, tipo, delay }: { evento: Evento; tipo: "ceremonia" | "fiesta"; delay: number }) {
  return (
    <Reveal delay={delay} as="article" className="h-full">
      <div className="flex h-full flex-col rounded-3xl bg-marfil p-8 shadow-sm ring-1 ring-linea">
        <Icono tipo={tipo} />
        <h3 className="mt-5 font-serif text-3xl font-medium text-tinta">
          {evento.titulo}
        </h3>

        <dl className="mt-5 space-y-3 text-tinta-suave">
          <div>
            <dt className="sr-only">Lugar</dt>
            <dd className="text-lg font-medium text-tinta">{evento.lugar}</dd>
          </div>
          <div className="flex items-start gap-2">
            <dt className="text-sm font-semibold uppercase tracking-wide text-dorado">Dirección</dt>
            <dd>{evento.direccion}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="text-sm font-semibold uppercase tracking-wide text-dorado">Hora</dt>
            <dd>{evento.hora}</dd>
          </div>
        </dl>

        <a
          href={evento.maps}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-salvia px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-salvia-oscuro"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11z" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          Cómo llegar
        </a>
      </div>
    </Reveal>
  );
}

export default function EventDetails() {
  const { ceremonia, fiesta, dressCode } = siteConfig;

  return (
    <section id="evento" className="bg-crema px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal className="text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-dorado">
            Te esperamos
          </p>
          <h2 className="font-serif text-4xl font-medium text-tinta sm:text-5xl">
            El evento
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <TarjetaEvento evento={ceremonia} tipo="ceremonia" delay={0} />
          <TarjetaEvento evento={fiesta} tipo="fiesta" delay={120} />
        </div>

        {/* Dress code */}
        <Reveal delay={80}>
          <div className="mt-8 rounded-3xl bg-salvia-claro/50 px-8 py-8 text-center ring-1 ring-linea">
            <h3 className="font-serif text-2xl font-medium text-salvia-oscuro">
              {dressCode.titulo}
            </h3>
            <p className="mt-2 text-lg font-medium tracking-wide text-tinta">
              {dressCode.detalle}
            </p>
            <p className="mt-1 text-sm text-tinta-suave">{dressCode.nota}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
