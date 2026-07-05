"use client";

// components/Countdown.tsx — Cuenta regresiva en vivo hasta la fecha del casamiento.

import { useEffect, useState } from "react";
import { siteConfig } from "@/content/config";
import Reveal from "./Reveal";

type Tiempo = { dias: number; horas: number; minutos: number; segundos: number };

// Calcula el tiempo restante entre ahora y la fecha objetivo.
function calcular(objetivo: number): { restante: Tiempo; terminado: boolean } {
  const diff = objetivo - Date.now();
  if (diff <= 0) {
    return { restante: { dias: 0, horas: 0, minutos: 0, segundos: 0 }, terminado: true };
  }
  const s = Math.floor(diff / 1000);
  return {
    restante: {
      dias: Math.floor(s / 86400),
      horas: Math.floor((s % 86400) / 3600),
      minutos: Math.floor((s % 3600) / 60),
      segundos: s % 60,
    },
    terminado: false,
  };
}

const UNIDADES: { key: keyof Tiempo; label: string }[] = [
  { key: "dias", label: "Días" },
  { key: "horas", label: "Horas" },
  { key: "minutos", label: "Minutos" },
  { key: "segundos", label: "Segundos" },
];

export default function Countdown() {
  const objetivo = new Date(siteConfig.fecha.iso).getTime();

  // Arrancamos en null para evitar diferencias de hidratación (SSR vs cliente).
  const [estado, setEstado] = useState<{ restante: Tiempo; terminado: boolean } | null>(null);

  useEffect(() => {
    setEstado(calcular(objetivo));
    const id = setInterval(() => setEstado(calcular(objetivo)), 1000);
    return () => clearInterval(id);
  }, [objetivo]);

  return (
    <section className="bg-salvia px-6 py-16 text-white md:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <p className="mb-2 text-sm uppercase tracking-[0.3em] text-white/80">
            Falta cada vez menos
          </p>
          <h2 className="font-serif text-3xl font-medium sm:text-4xl">
            {siteConfig.fecha.textoLargo}
          </h2>
        </Reveal>

        <Reveal delay={120}>
          {estado?.terminado ? (
            <p className="mt-10 font-serif text-3xl">¡Llegó el gran día! 🎉</p>
          ) : (
            <div className="mt-10 grid grid-cols-4 gap-3 sm:gap-6">
              {UNIDADES.map(({ key, label }) => (
                <div
                  key={key}
                  className="rounded-2xl bg-white/10 px-2 py-5 backdrop-blur-sm sm:px-4 sm:py-7"
                >
                  <div
                    className="font-serif text-4xl font-semibold tabular-nums sm:text-6xl"
                    // aria-live para que lectores de pantalla no lean cada segundo de forma molesta
                    aria-hidden="true"
                  >
                    {String(estado?.restante[key] ?? 0).padStart(2, "0")}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/80 sm:text-sm">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
