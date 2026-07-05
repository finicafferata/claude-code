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
    novia: "Cata",
    novio: "Santos",
    ampersand: "&",
    hashtag: "#CataYSantos2026",
  },

  // --- Fecha del casamiento --------------------------------------------------
  fecha: {
    // ISO con zona horaria de Argentina (-03:00). El countdown usa este valor.
    iso: "2026-03-06T17:00:00-03:00",
    dia: "Viernes",
    textoLargo: "6 de marzo de 2026",
    ciudad: "Buenos Aires, Argentina",
  },

  // --- Hero ------------------------------------------------------------------
  hero: {
    imagen: "/images/hero.jpg", // <- colocá tu foto acá (recomendado 2000px de ancho)
    alt: "Cata y Santos",
    frase: "¡Nos casamos!",
  },

  // --- Nuestra historia ------------------------------------------------------
  // TODO: personalizar este texto con la historia real de Cata y Santos.
  historia: {
    titulo: "Nuestra historia",
    parrafos: [
      "Nos conocimos una tarde de otoño, sin apuro y sin saber que ese café se iba a transformar en todo. Desde entonces caminamos juntos: aprendimos, viajamos y construimos un hogar hecho de cosas simples.",
      "Hoy queremos dar el siguiente paso rodeados de la gente que amamos. Gracias por ser parte de nuestra historia y por acompañarnos en el día más importante.",
    ],
    fotos: [
      { src: "/images/historia-1.jpg", alt: "Cata y Santos" },
      { src: "/images/historia-2.jpg", alt: "Cata y Santos" },
    ] as Foto[],
  },

  // --- Detalles del evento ---------------------------------------------------
  ceremonia: {
    titulo: "Ceremonia religiosa",
    lugar: "Iglesia del Colegio Marín",
    direccion: "San Isidro, Buenos Aires", // TODO: confirmar dirección exacta
    hora: "17:00 h",
    maps: "https://www.google.com/maps/search/?api=1&query=Iglesia+del+Colegio+Mar%C3%ADn+San+Isidro",
  } as Evento,

  fiesta: {
    titulo: "Fiesta",
    lugar: "Espacio Tigre",
    direccion: "Tigre, Buenos Aires", // TODO: confirmar dirección exacta
    hora: "19:00 h",
    maps: "https://www.google.com/maps/search/?api=1&query=Espacio+Tigre",
  } as Evento,

  dressCode: {
    titulo: "Dress code",
    detalle: "Elegante",
    nota: "Sugerimos evitar el color blanco (reservado para la novia).",
  },

  // --- Información práctica ---------------------------------------------------
  // TODO: completar con opciones reales de alojamiento cerca de Tigre / San Isidro.
  alojamiento: [
    {
      nombre: "TODO: alojamiento sugerido",
      detalle: "Completar con hoteles/hospedajes cercanos y, si hay, código de descuento.",
      link: "",
    },
  ] as Alojamiento[],

  transporte: {
    titulo: "Transporte",
    texto:
      "Vamos a coordinar combis hacia Espacio Tigre y de regreso al finalizar la fiesta. Si querés sumarte, marcá la opción de traslado en el formulario.",
    detalle: "TODO: confirmar horarios y punto de salida de las combis.",
  },

  regalos: {
    titulo: "Regalos",
    mensaje:
      "Tu presencia es nuestro mejor regalo. Si además querés ayudarnos a empezar esta nueva etapa, te dejamos los datos para un obsequio.",
    alias: "santosycata",
    cbu: "", // opcional; el alias alcanza
    titular: "Santos Cafferata",
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
        "Te pedimos confirmar antes del 6 de febrero de 2026 para organizar todo con tiempo.",
    },
    {
      pregunta: "¿Cómo llego a la fiesta?",
      respuesta:
        "La fiesta es en Espacio Tigre. Vamos a coordinar combis; si querés sumarte, marcá la opción de traslado en el formulario.",
    },
    {
      pregunta: "¿Puedo sugerir una canción?",
      respuesta: "¡Obvio! Hay un campo en el formulario para que dejes tu tema para bailar.",
    },
  ] as FaqItem[],

  // --- RSVP ------------------------------------------------------------------
  rsvp: {
    fechaLimite: "6 de febrero de 2026", // TODO: ajustar fecha límite si hace falta
  },

  // --- Footer ----------------------------------------------------------------
  footer: {
    hashtag: "#CataYSantos2026",
    firma: "Con amor, Cata & Santos",
  },
} as const;

export type SiteConfig = typeof siteConfig;
