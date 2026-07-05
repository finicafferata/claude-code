"use client";

// components/Navbar.tsx — Navbar fijo con anclas y scroll suave.
// Es transparente sobre el hero y se vuelve sólido al hacer scroll.

import { useEffect, useState } from "react";
import { siteConfig } from "@/content/config";

const LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#historia", label: "Historia" },
  { href: "#evento", label: "Evento" },
  { href: "#info", label: "Info" },
  { href: "#rsvp", label: "Confirmar" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { novia, ampersand, novio } = siteConfig.novios;

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open
          ? "bg-crema/90 shadow-sm backdrop-blur-md"
          : "bg-transparent",
      ].join(" ")}
    >
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8"
      >
        {/* Iniciales / logo */}
        <a
          href="#inicio"
          className={[
            "font-serif text-xl tracking-wide transition-colors",
            scrolled || open ? "text-tinta" : "text-white drop-shadow",
          ].join(" ")}
        >
          {novia[0]} {ampersand} {novio[0]}
        </a>

        {/* Links de escritorio */}
        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={[
                  "text-sm font-medium tracking-wide transition-colors hover:text-dorado",
                  scrolled ? "text-tinta-suave" : "text-white drop-shadow",
                ].join(" ")}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Botón hamburguesa (mobile) */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className={[
            "flex h-10 w-10 items-center justify-center rounded-full transition-colors md:hidden",
            scrolled || open ? "text-tinta" : "text-white",
          ].join(" ")}
        >
          <span className="sr-only">Menú</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {/* Menú desplegable (mobile) */}
      <div
        id="menu-mobile"
        className={[
          "overflow-hidden border-t border-linea bg-crema/95 backdrop-blur-md transition-[max-height] duration-300 md:hidden",
          open ? "max-h-80" : "max-h-0",
        ].join(" ")}
      >
        <ul className="flex flex-col px-5 py-2">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-sm font-medium tracking-wide text-tinta-suave hover:text-dorado"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
