/**
 * Contenido editable del sitio.
 *
 * TODO: reemplazar todos los placeholders por los datos reales.
 * No hace falta tocar código: solo cambiar los valores de este archivo.
 */

export const siteConfig = {
  // Novios
  novios: {
    persona1: "NOMBRE_1", // TODO
    persona2: "NOMBRE_2", // TODO
    hashtag: "#NUESTRO_HASHTAG", // TODO (opcional)
  },

  // Fecha y hora del casamiento (formato ISO, zona horaria Argentina -03:00)
  fecha: {
    iso: "2026-12-31T19:00:00-03:00", // TODO
    textoLargo: "31 de diciembre de 2026", // TODO
    hora: "19:00 hs", // TODO
  },

  // Ceremonia
  ceremonia: {
    lugar: "NOMBRE_DEL_LUGAR", // TODO
    direccion: "DIRECCIÓN COMPLETA", // TODO
    hora: "19:00 hs", // TODO
    mapsUrl: "https://maps.google.com/?q=DIRECCION", // TODO
  },

  // Fiesta
  fiesta: {
    lugar: "NOMBRE_DEL_SALÓN", // TODO
    direccion: "DIRECCIÓN COMPLETA", // TODO
    hora: "21:00 hs", // TODO
    mapsUrl: "https://maps.google.com/?q=DIRECCION", // TODO
  },

  // Dress code
  dressCode: {
    titulo: "Elegante", // TODO
    detalle: "Sugerencia de vestimenta para los invitados.", // TODO
  },

  // Nuestra historia
  historia: {
    titulo: "Nuestra historia",
    texto:
      "TODO: acá va un texto lindo sobre cómo se conocieron los novios y su camino hasta el casamiento.",
    // Poner las imágenes en /public y referenciarlas acá.
    fotos: ["/placeholder-1.jpg", "/placeholder-2.jpg"], // TODO
  },

  // Info práctica
  infoPractica: {
    alojamiento: [
      {
        nombre: "HOTEL_SUGERIDO", // TODO
        detalle: "Descripción / distancia / código de descuento.",
        url: "",
      },
    ],
    transporte:
      "TODO: info sobre cómo llegar, estacionamiento, traslados, etc.",
    regalos: {
      titulo: "Regalos",
      texto:
        "TODO: si quieren dejar un regalo, acá van los datos (alias/CBU o lista).",
      alias: "ALIAS.MP", // TODO (opcional)
      cbu: "", // TODO (opcional)
    },
    faq: [
      {
        pregunta: "¿Hasta cuándo puedo confirmar?",
        respuesta: "TODO: fecha límite para el RSVP.",
      },
      {
        pregunta: "¿Puedo llevar acompañante?",
        respuesta: "TODO: aclarar política de acompañantes.",
      },
    ],
  },

  // RSVP
  rsvp: {
    fechaLimite: "TODO: fecha límite", // TODO
  },
} as const;

export type SiteConfig = typeof siteConfig;
