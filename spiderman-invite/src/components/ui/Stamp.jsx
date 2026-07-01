import { useId } from "react";

// Sello de tinta realista: doble aro + texto curvo, con textura desgastada
// (feTurbulence → feDisplacementMap para bordes irregulares y erosión en
// parches donde "falta tinta") y salpicaduras alrededor. Color = currentColor.
export default function Stamp({ day = "31", month = "JUL", className = "" }) {
  const uid = useId().replace(/[:]/g, "");
  const grunge = `stamp-grunge-${uid}`;
  const topArc = `stamp-top-${uid}`;
  const botArc = `stamp-bot-${uid}`;

  // Salpicaduras deterministas [cx, cy, r] repartidas alrededor del aro (r≈50,
  // centro 60,60). Se pasan por el mismo filtro → gotas irregulares, no círculos.
  const splats = [
    [96, 90, 2.7], [105, 97, 1.4], [90, 102, 1.0], [110, 75, 1.1],
    [22, 96, 2.1], [13, 84, 1.2], [31, 105, 0.9], [16, 42, 1.3],
    [100, 25, 1.7], [109, 41, 0.9], [60, 112, 1.2], [49, 8, 1.0],
    [86, 109, 0.7], [112, 86, 0.7], [9, 66, 0.7],
  ];

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label={`Sello de entrada: ${day} ${month}`}
      style={{ filter: "drop-shadow(0 0 8px rgba(216,31,38,0.35))" }}
    >
      <defs>
        <filter id={grunge} x="-25%" y="-25%" width="150%" height="150%">
          {/* Bordes de tinta irregulares */}
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="edge" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="edge"
            scale="2.6"
            xChannelSelector="R"
            yChannelSelector="G"
            result="disp"
          />
          {/* Erosión en parches: zonas donde "falta tinta" (~20%) */}
          <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="11" result="patch" />
          <feColorMatrix
            in="patch"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 5 -1.05"
            result="mask"
          />
          <feComposite in="disp" in2="mask" operator="in" />
        </filter>

        {/* Arcos para el texto curvo (superior e inferior, ambos legibles) */}
        <path id={topArc} d="M 20 60 A 40 40 0 0 1 100 60" fill="none" />
        <path id={botArc} d="M 100 60 A 40 40 0 0 1 20 60" fill="none" />
      </defs>

      <g
        fill="currentColor"
        stroke="currentColor"
        filter={`url(#${grunge})`}
        opacity="0.92"
        style={{ fontFamily: "var(--font-display, 'Clash Display', sans-serif)" }}
      >
        {/* Doble aro */}
        <circle cx="60" cy="60" r="50" fill="none" strokeWidth="3.4" />
        <circle cx="60" cy="60" r="40" fill="none" strokeWidth="1.5" />

        {/* Texto curvo superior */}
        <text fontSize="8" fontWeight="700" letterSpacing="1.6" stroke="none">
          <textPath href={`#${topArc}`} startOffset="50%" textAnchor="middle">
            ★ ADMIT ONE ★
          </textPath>
        </text>
        {/* Texto curvo inferior */}
        <text fontSize="7" fontWeight="700" letterSpacing="1.4" stroke="none">
          <textPath href={`#${botArc}`} startOffset="50%" textAnchor="middle">
            SPIDER-MAN
          </textPath>
        </text>

        {/* Día + mes al centro */}
        <text x="60" y="60" textAnchor="middle" fontSize="30" fontWeight="800" stroke="none">
          {day}
        </text>
        <text
          x="60"
          y="75"
          textAnchor="middle"
          fontSize="10.5"
          fontWeight="700"
          letterSpacing="2.5"
          stroke="none"
        >
          {month}
        </text>
        {/* Rayas finas que enmarcan el mes (detalle de sello) */}
        <rect x="30" y="48.5" width="60" height="1.1" stroke="none" />

        {/* Salpicaduras de tinta */}
        <g stroke="none">
          {splats.map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} />
          ))}
        </g>
      </g>
    </svg>
  );
}
