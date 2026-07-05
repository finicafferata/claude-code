// content/config.ts
// -----------------------------------------------------------------------------
// Contenido editable del sitio. Reemplazá los placeholders por los datos reales.
// Todos los componentes leen desde acá (nada de texto hardcodeado en la UI).
// -----------------------------------------------------------------------------

export type Foto = { src: string; alt: string };

export type Evento = {
  titulo: string;
  lugar: string;
  direccion: string;
  hora: string;
  maps: string; // link a Google Maps ("Cómo llegar")
};

export type FaqItem = { pregunta: string; respuesta: string };

export type Alojamiento = { nombre: string; detalle: string; link?: string };

export const siteConfig = {
  // --- Novios / marca del sitio ---------------------------------------------
  novios: {
    novia: "Valentina",
    novio: "Mateo",
    ampersand: "&",
    hashtag: "#ValentinaYMateo2026",
  },

  // --- Fecha del casamiento --------------------------------------------------
  fecha: {
    // ISO con zona horaria de Argentina (-03:00). El countdown usa este valor.
    iso: "2026-11-14T18:00:00-03:00",
    dia: "Sábado",
    textoLargo: "14 de Noviembre de 2026",
    ciudad: "Buenos Aires, Argentina",
  },

  // --- Hero ------------------------------------------------------------------
  hero: {
    imagen: "/images/hero.jpg", // <- colocá tu foto acá (recomendado 2000px de ancho)
    alt: "Valentina y Mateo tomados de la mano al atardecer",
    frase: "¡Nos casamos!",
  },

  // --- Nuestra historia ------------------------------------------------------
  historia: {
    titulo: "Nuestra historia",
    parrafos: [
      "Nos conocimos una tarde de otoño, sin apuro y sin saber que ese café se iba a transformar en todo. Desde entonces caminamos juntos: aprendimos, viajamos y construimos un hogar hecho de cosas simples.",
      "Hoy queremos dar el siguiente paso rodeados de la gente que amamos. Gracias por ser parte de nuestra historia y por acompañarnos en el día más importante.",
    ],
    fotos: [
      { src: "/images/historia-1.jpg", alt: "Valentina y Mateo riéndose en la playa" },
      { src: "/images/historia-2.jpg", alt: "Valentina y Mateo abrazados en la montaña" },
    ] as Foto[],
  },

  // --- Detalles del evento ---------------------------------------------------
  ceremonia: {
    titulo: "Ceremonia",
    lugar: "Parroquia Nuestra Señora del Pilar",
    direccion: "Junín 1904, C1113 CABA",
    hora: "18:00 h",
    maps: "https://www.google.com/maps/search/?api=1&query=Parroquia+Nuestra+Se%C3%B1ora+del+Pilar+Buenos+Aires",
  } as Evento,

  fiesta: {
    titulo: "Fiesta",
    lugar: "Estancia La Alameda",
    direccion: "Ruta 25 Km 8, Pilar, Buenos Aires",
    hora: "20:30 h",
    maps: "https://www.google.com/maps/search/?api=1&query=Estancia+La+Alameda+Pilar+Buenos+Aires",
  } as Evento,

  dressCode: {
    titulo: "Dress code",
    detalle: "Elegante / Formal",
    nota: "Sugerimos evitar el color blanco (reservado para la novia).",
  },

  // --- Información práctica ---------------------------------------------------
  alojamiento: [
    {
      nombre: "Hotel del Pilar",
      detalle: "A 10 min de la fiesta. Tarifa especial con el código VYM2026.",
      link: "https://www.google.com/maps/search/?api=1&query=Hotel+del+Pilar",
    },
    {
      nombre: "Cabañas Los Álamos",
      detalle: "Opción tranquila para el fin de semana, ideal para grupos.",
      link: "https://www.google.com/maps/search/?api=1&query=Caba%C3%B1as+Los+%C3%81lamos+Pilar",
    },
  ] as Alojamiento[],

  transporte: {
    titulo: "Transporte",
    texto:
      "Vamos a coordinar combis desde el centro de Pilar hacia la estancia y de regreso al finalizar la fiesta.",
    detalle: "Salida: 20:00 h · Regreso: 04:00 h. Confirmá tu lugar en el formulario.",
  },

  regalos: {
    titulo: "Regalos",
    mensaje:
      "Tu presencia es nuestro mejor regalo. Si además querés ayudarnos a empezar esta nueva etapa, te dejamos los datos para un obsequio.",
    alias: "VALE.MATEO.BODA",
    cbu: "0000003100010000000001",
    titular: "Valentina Gómez",
  },

  faq: [
    {
      pregunta: "¿Puedo llevar niños?",
      respuesta:
        "Amamos a los peques, pero la fiesta está pensada para adultos. Si necesitás una excepción, escribinos.",
    },
    {
      pregunta: "¿Hasta cuándo confirmo asistencia?",
      respuesta:
        "Te pedimos confirmar antes del 30 de septiembre de 2026 para organizar todo con tiempo.",
    },
    {
      pregunta: "¿Hay estacionamiento?",
      respuesta: "Sí, la estancia cuenta con estacionamiento gratuito dentro del predio.",
    },
    {
      pregunta: "¿Puedo sugerir una canción?",
      respuesta: "¡Obvio! Hay un campo en el formulario para que dejes tu tema para bailar.",
    },
  ] as FaqItem[],

  // --- Footer ----------------------------------------------------------------
  footer: {
    hashtag: "#ValentinaYMateo2026",
    firma: "Con amor, Valentina & Mateo",
  },
} as const;

export type SiteConfig = typeof siteConfig;
