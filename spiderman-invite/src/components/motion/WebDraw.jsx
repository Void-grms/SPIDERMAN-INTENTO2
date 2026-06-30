import { useRef } from "react";
import { gsap, useGSAP, DrawSVGPlugin, ScrollTrigger } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";

// Telaraña de esquina generada por geometría (trazos abiertos → DrawSVG la
// "dibuja"). corner: "tl" | "tr" | "bl" | "br". Se anima al entrar en viewport.
const SIZE = 320;

function buildWeb({ spokes = 7, rings = 6 }) {
  const origin = { x: 0, y: 0 };
  const maxR = SIZE * 1.18;
  const a0 = 0;
  const a1 = Math.PI / 2;
  const angles = Array.from(
    { length: spokes },
    (_, i) => a0 + ((a1 - a0) * i) / (spokes - 1)
  );

  const radials = angles.map((a) => {
    const x = origin.x + Math.cos(a) * maxR;
    const y = origin.y + Math.sin(a) * maxR;
    return `M${origin.x} ${origin.y} L${x.toFixed(1)} ${y.toFixed(1)}`;
  });

  const arcs = [];
  for (let r = 1; r <= rings; r++) {
    const rad = (maxR / (rings + 0.4)) * r;
    let d = "";
    angles.forEach((a, i) => {
      const x = (origin.x + Math.cos(a) * rad).toFixed(1);
      const y = (origin.y + Math.sin(a) * rad).toFixed(1);
      d += i === 0 ? `M${x} ${y}` : ` L${x} ${y}`;
    });
    arcs.push(d);
  }
  return { radials, arcs };
}

const transforms = {
  tl: "",
  tr: `translate(${SIZE} 0) scale(-1 1)`,
  bl: `translate(0 ${SIZE}) scale(1 -1)`,
  br: `translate(${SIZE} ${SIZE}) scale(-1 -1)`,
};

export default function WebDraw({
  corner = "tl",
  className = "",
  scrub = false,
  delay = 0,
  spokes = 7,
  rings = 6,
  opacity = 0.55,
}) {
  const root = useRef(null);
  const reduced = useReducedMotion();
  const { radials, arcs } = buildWeb({ spokes, rings });

  useGSAP(
    () => {
      const paths = root.current.querySelectorAll("path");
      if (reduced) {
        gsap.set(paths, { drawSVG: "100%" });
        return;
      }
      gsap.set(paths, { drawSVG: "0%" });
      const tl = gsap.timeline({
        delay,
        scrollTrigger: scrub
          ? { trigger: root.current, start: "top 85%", end: "bottom 40%", scrub: 0.6 }
          : { trigger: root.current, start: "top 88%", once: true },
      });
      tl.to(root.current.querySelectorAll(".radial"), {
        drawSVG: "100%",
        duration: 1.2,
        stagger: 0.06,
        ease: "power2.out",
      }).to(
        root.current.querySelectorAll(".arc"),
        { drawSVG: "100%", duration: 1.1, stagger: 0.08, ease: "power1.inOut" },
        "-=0.8"
      );
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <svg
      ref={root}
      className={className}
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      fill="none"
      aria-hidden="true"
      style={{ opacity, overflow: "visible" }}
    >
      <g
        transform={transforms[corner]}
        stroke="var(--color-accent-web)"
        strokeWidth="0.8"
        strokeLinecap="round"
      >
        {radials.map((d, i) => (
          <path key={`r${i}`} className="radial" d={d} />
        ))}
        {arcs.map((d, i) => (
          <path key={`a${i}`} className="arc" d={d} opacity={0.7} />
        ))}
      </g>
    </svg>
  );
}
