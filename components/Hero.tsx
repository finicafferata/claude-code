// components/Hero.tsx — Portada a pantalla completa con imagen de fondo.

import Image from "next/image";
import { siteConfig } from "@/content/config";

export default function Hero() {
  const { novia, ampersand, novio } = siteConfig.novios;
  const { imagen, alt, frase } = siteConfig.hero;
  const { dia, textoLargo, ciudad } = siteConfig.fecha;

  return (
    <section
      id="inicio"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      {/* Imagen de fondo */}
      <Image
        src={imagen}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Velo para asegurar contraste del texto */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/50"
      />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center text-white">
        <p className="mb-6 text-sm uppercase tracking-[0.35em] text-white/90">
          {frase}
        </p>

        <h1 className="font-serif text-5xl font-medium leading-none drop-shadow-sm sm:text-6xl md:text-8xl">
          <span className="block">{novia}</span>
          <span className="my-2 block text-3xl text-dorado sm:text-4xl md:text-5xl">
            {ampersand}
          </span>
          <span className="block">{novio}</span>
        </h1>

        <div className="mt-8 flex flex-col items-center gap-1 text-white/95">
          <span className="h-px w-16 bg-white/60" aria-hidden="true" />
          <p className="mt-4 text-base tracking-[0.2em] sm:text-lg">
            {dia} · {textoLargo}
          </p>
          <p className="text-sm tracking-[0.2em] text-white/80">{ciudad}</p>
        </div>

        {/* CTA */}
        <a
          href="#rsvp"
          className="mt-10 rounded-full border border-white/70 px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-tinta"
        >
          Confirmar asistencia
        </a>
      </div>

      {/* Indicador de scroll */}
      <a
        href="#historia"
        aria-label="Bajar a la sección Nuestra historia"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/80 transition-colors hover:text-white"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          className="animate-bounce"
          aria-hidden="true"
        >
          <path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}
