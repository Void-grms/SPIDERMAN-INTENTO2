import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "../../lib/gsap";
import { useMousePosition } from "../../hooks/useMousePosition";
import { useReducedMotion } from "../../hooks/useReducedMotion";

// Fondo cinematográfico del hero: 3 planos PNG con parallax a distinta
// velocidad (mouse + scroll) + bokeh + light leak + mesh + viñeta.
const planes = [
  { src: "/generated/plane-back.png", depth: 14, scrub: 40 },
  { src: "/generated/hero-plate.png", depth: 26, scrub: 90 },
  { src: "/generated/plane-mid.png", depth: 46, scrub: 150 },
  { src: "/generated/plane-front.png", depth: 70, scrub: 220 },
];

export default function WebBackdrop() {
  const root = useRef(null);
  const layers = useRef([]);
  const mouse = useMousePosition();
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const els = layers.current.filter(Boolean);
      gsap.set(els, { scale: 1.14 });
      if (reduced) return;

      // Parallax al scroll (yPercent — independiente del x/y del mouse)
      els.forEach((el, i) => {
        gsap.to(el, {
          yPercent: planes[i].scrub / 10,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Parallax al mouse (lerp suave vía quickTo sobre x/y)
      const setters = els.map((el) => ({
        x: gsap.quickTo(el, "x", { duration: 0.8, ease: "power2.out" }),
        y: gsap.quickTo(el, "y", { duration: 0.8, ease: "power2.out" }),
      }));
      const tick = () => {
        els.forEach((el, i) => {
          const d = planes[i].depth;
          setters[i].x(-mouse.current.x * d);
          setters[i].y(-mouse.current.y * d * 0.6);
        });
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <div ref={root} className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {planes.map((p, i) => (
        <div
          key={p.src}
          ref={(el) => (layers.current[i] = el)}
          className="absolute inset-0 will-change-transform"
          style={{
            backgroundImage: `url(${p.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}

      {/* bokeh + light leak (blend screen) */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{ backgroundImage: "url(/generated/bokeh.png)", backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div
        className="absolute inset-0 opacity-30 mix-blend-screen"
        style={{ backgroundImage: "url(/generated/light-leak.png)", backgroundSize: "cover", backgroundPosition: "center" }}
      />

      <div className="mesh-brand" />
      <div className="halftone" />
      <div className="vignette" />
      {/* fundido inferior hacia el bg para empalmar con la siguiente sección */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
    </div>
  );
}
