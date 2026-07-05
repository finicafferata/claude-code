// components/OurStory.tsx — Título + texto + 2 fotos.

import Image from "next/image";
import { siteConfig } from "@/content/config";
import Reveal from "./Reveal";

export default function OurStory() {
  const { titulo, parrafos, fotos } = siteConfig.historia;

  return (
    <section id="historia" className="bg-crema px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* Texto */}
          <Reveal className="order-2 md:order-1">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-dorado">
              Cómo empezó todo
            </p>
            <h2 className="font-serif text-4xl font-medium text-tinta sm:text-5xl">
              {titulo}
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-tinta-suave">
              {parrafos.map((p, i) => (
                <p key={i} className="text-pretty">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          {/* Fotos superpuestas */}
          <Reveal delay={120} className="order-1 md:order-2">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
              {fotos[0] && (
                <div className="absolute left-0 top-0 h-[70%] w-[68%] overflow-hidden rounded-2xl shadow-lg ring-1 ring-linea">
                  <Image
                    src={fotos[0].src}
                    alt={fotos[0].alt}
                    fill
                    sizes="(max-width: 768px) 60vw, 300px"
                    className="object-cover"
                  />
                </div>
              )}
              {fotos[1] && (
                <div className="absolute bottom-0 right-0 h-[62%] w-[60%] overflow-hidden rounded-2xl shadow-xl ring-4 ring-crema">
                  <Image
                    src={fotos[1].src}
                    alt={fotos[1].alt}
                    fill
                    sizes="(max-width: 768px) 55vw, 260px"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
