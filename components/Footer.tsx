// components/Footer.tsx — Footer simple con el hashtag.

import { siteConfig } from "@/content/config";

export default function Footer() {
  const { hashtag, firma } = siteConfig.footer;
  const { novia, ampersand, novio } = siteConfig.novios;

  return (
    <footer className="bg-salvia-oscuro px-6 py-14 text-center text-white">
      <p className="font-serif text-3xl">
        {novia} <span className="text-dorado">{ampersand}</span> {novio}
      </p>
      <p className="mt-4 text-lg tracking-[0.25em] text-white/90">{hashtag}</p>
      <p className="mt-6 text-sm text-white/60">{firma}</p>
    </footer>
  );
}
