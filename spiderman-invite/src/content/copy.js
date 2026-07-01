// =========================================================================
//  TODO EL TEXTO EN UN SOLO LUGAR.  Edita aquí — nada más.
//  Reemplaza los valores marcados con ◀ EDITAR.
// =========================================================================

export const config = {
  // — Datos personales (rellénalos) —
  nombreElla: "[Su nombre]", //            ◀ EDITAR
  tuNombre: "Fer", //              ◀ EDITAR
  whatsapp: "51970642671", //              ◀ EDITAR  (código país + número, sin +, sin espacios)

  // — Evento —
  pelicula: "Spider-Man: Brand New Day",
  peliculaTitulo: "Spider-Man", //         título grande del ticket
  peliculaSub: "Brand New Day", //         subtítulo del ticket
  fechaLarga: "sábado 31 de julio",
  fechaCorta: "31 JUL",
  hora: "[7:30 PM]", //                     ◀ EDITAR
  lugar: "[Cineplanet — Sala que elijas]", // ◀ EDITAR
  paseId: "BND-0731-A", //                  ◀ EDITAR (opcional) código del pase
};

// Mensajes que se abren en WhatsApp (se URL-encodean automáticamente).
export const whatsappMsg = {
  si: `¡Sí, voy! 🕷️ Nos vemos el ${config.fechaCorta} para ${config.pelicula}.`,
  hablemos: `Oye, vi lo que me mandaste... me encantó. ¿Hablamos? 🙂`,
};

export const copy = {
  // — 1. Preloader —
  preloader: {
    kicker: "Cargando algo que hice para ti",
  },

  // — 2. Hero —
  hero: {
    // Variante elegida: A (juguetón). Cambia por la B si prefieres directo.
    kicker: "31 · 07",
    titulo: ["Un héroe", "vuelve", "al cine"],
    sub: `Y yo quería que vinieras conmigo, ${config.nombreElla}.`,
    scrollHint: "desliza",
  },

  // — 3. Reconexión (la línea honesta — la más importante) —
  reconnect: {
    // Variante B (sincera). Alternativas en el PLAN sección 10.
    lineas: [
      "Sé que ha pasado un tiempo.",
      "Mmucho más que un tiempo, la verdad.",
      "Pero me acordé de ti, y pense que esto",
      "es mejor que un simple ''Hola'' de la nada",
    ],
  },

  // — 4. Video —
  video: {
    intro: "Es más fácil mostrártelo que escribirlo.",
    cue: "Dale play.",
  },

  // — 5. Invitación (ticket) —
  invitation: {
    kicker: "CINEMA TICKET",
    titulo: "ADMID TWO",
    peliculaTitulo: config.peliculaTitulo,
    peliculaSub: config.peliculaSub,
    sello: config.fechaCorta,
    filas: [
      { label: "Fecha", value: config.fechaLarga },
      { label: "Hora", value: config.hora },
      { label: "Lugar", value: config.lugar },
    ],
    paseId: config.paseId,
    qrLabel: "Tu pase — válido el día del estreno",
    qrNota: "QR de ejemplo · se reemplaza el 31",
    nota: "Admite: una persona importante.",
  },

  // — 6. RSVP —
  rsvp: {
    pregunta: "¿Vienes conmigo?",
    sub: "Sin presión. Solo una película y nosotros dos poniéndonos al día.",
    primario: "Sí, voy",
    secundario: "Nel",
    // Tras confirmar:
    confirmado: "Te veo el 31.",
    confirmadoSub: "Trae hambre de canchita. 🍿",
  },

  // — 7. Cierre —
  closing: {
    frase: "Pase lo que pase, me alegra haberte escrito.",
    firma: `— ${config.tuNombre}`,
  },
};

export default copy;
