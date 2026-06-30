// Set de íconos line-art a medida (sin emojis en UI). Grid 24px, stroke
// uniforme, caps redondos, trazos abiertos. Color heredado (currentColor).
const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const IconPlay = (p) => (
  <svg {...base} {...p}>
    <path d="M7 5.5v13l11-6.5L7 5.5Z" />
  </svg>
);

export const IconPause = (p) => (
  <svg {...base} {...p}>
    <path d="M8 5v14M16 5v14" />
  </svg>
);

export const IconSoundOn = (p) => (
  <svg {...base} {...p}>
    <path d="M4 9v6h4l5 4V5L8 9H4Z" />
    <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
  </svg>
);

export const IconSoundOff = (p) => (
  <svg {...base} {...p}>
    <path d="M4 9v6h4l5 4V5L8 9H4Z" />
    <path d="M17 9.5l4 5M21 9.5l-4 5" />
  </svg>
);

export const IconPin = (p) => (
  <svg {...base} {...p}>
    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const IconClock = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const IconTicket = (p) => (
  <svg {...base} {...p}>
    <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1 0 4 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2 2 2 0 0 0 0-4 2 2 0 0 1 0-4Z" />
    <path d="M14 6v12" strokeDasharray="2 2.4" />
  </svg>
);

export const IconPopcorn = (p) => (
  <svg {...base} {...p}>
    <path d="M6 9l1.5 11h9L18 9" />
    <path d="M6 9a2 2 0 0 1 .3-3.6 2.4 2.4 0 0 1 4-1.4 2.4 2.4 0 0 1 3.4 0 2.4 2.4 0 0 1 4 1.4A2 2 0 0 1 18 9" />
    <path d="M10 9v11M14 9v11" />
  </svg>
);

export const IconArrowDown = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v13M6.5 12.5 12 18l5.5-5.5" />
  </svg>
);

export const IconCalendar = (p) => (
  <svg {...base} {...p}>
    <rect x="4" y="5.5" width="16" height="15" rx="2" />
    <path d="M4 9.5h16M8 3.5v4M16 3.5v4" />
  </svg>
);

// Glifo de araña line-art (reemplaza el emoji 🕷️). 8 patas balanceadas.
export const IconSpider = (p) => (
  <svg {...base} {...p}>
    <ellipse cx="12" cy="12" rx="2.4" ry="3" />
    <circle cx="12" cy="8.2" r="1.3" />
    <path d="M10 10C7.5 9 6 7.5 4.5 8.2M10 12c-2.8 0-4.5-.4-6 .8M10 14c-2.4 .8-3.8 2-5 3.4" />
    <path d="M14 10c2.5-1 4-2.5 5.5-1.8M14 12c2.8 0 4.5-.4 6 .8M14 14c2.4 .8 3.8 2 5 3.4" />
    <path d="M11 6l-1-1.6M13 6l1-1.6" />
  </svg>
);
