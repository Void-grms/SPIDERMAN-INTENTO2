import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";

// Araña que rapela por su hilo según el scroll. Anatomía: el par de patas IV
// (traseras) son las protagonistas — jalan/guían la seda en movimiento
// ALTERNADO (hand-over-hand), como escalar la cuerda al revés. Las demás patas
// hacen un meneo sutil. La velocidad sigue a la del scroll.
// Perf: SOLO se animan transform/opacity (sin height ni filtros) → sin lag.
const SIZE = 46;

export default function ScrollThread() {
  const wrap = useRef(null);
  const thread = useRef(null);
  const spider = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const idle = spider.current.querySelectorAll(".leg-idle");
      const rearR = spider.current.querySelector(".leg-rear-r");
      const rearL = spider.current.querySelector(".leg-rear-l");
      const size = spider.current.offsetWidth || SIZE;
      const anchor = size * 0.36; // alto del cefalotórax (donde se une el hilo)

      // GSAP es dueño del transform (evita conflicto con clases de Tailwind)
      gsap.set(spider.current, { xPercent: -50 });
      gsap.set(thread.current, { xPercent: -50, transformOrigin: "top center", scaleY: 0 });

      const setY = gsap.quickSetter(spider.current, "y", "px");
      const setScale = gsap.quickSetter(thread.current, "scaleY");

      const place = (y, H) => {
        setY(y);
        setScale((y + anchor) / H); // hilo = escala vertical (sin reflow)
      };

      if (reduced) {
        place(8, wrap.current.clientHeight);
        return;
      }

      // ----- Meneo de patas (una sola timeline → un timeScale lo controla) -----
      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      // patas frontales (I–III): meneo leve
      tl.fromTo(
        idle,
        { rotation: -4, svgOrigin: "40 38" },
        {
          rotation: 4,
          svgOrigin: "40 38",
          duration: 0.5,
          ease: "sine.inOut",
          stagger: { each: 0.05, from: "center" },
        },
        0
      );
      // patas IV traseras: protagonistas, amplias y en fase OPUESTA (alternan)
      tl.fromTo(
        rearR,
        { rotation: -16, svgOrigin: "42 42" },
        { rotation: 16, svgOrigin: "42 42", duration: 0.5, ease: "sine.inOut" },
        0
      );
      tl.fromTo(
        rearL,
        { rotation: 16, svgOrigin: "38 42" },
        { rotation: -16, svgOrigin: "38 42", duration: 0.5, ease: "sine.inOut" },
        0
      );

      // timeScale reactivo a la velocidad de scroll (con inercia)
      let targetTS = 0.7;
      const tick = () => {
        targetTS += (0.7 - targetTS) * 0.05;
        tl.timeScale(tl.timeScale() + (targetTS - tl.timeScale()) * 0.2);
      };
      gsap.ticker.add(tick);

      // posición ligada al progreso global
      const st = ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const H = wrap.current.clientHeight;
          place(self.progress * (H - size), H);
          targetTS = gsap.utils.clamp(0.7, 5, Math.abs(self.getVelocity()) / 220 + 0.7);
        },
      });
      place(0, wrap.current.clientHeight);

      return () => {
        gsap.ticker.remove(tick);
        tl.kill();
        st.kill();
      };
    },
    { dependencies: [reduced] }
  );

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className="pointer-events-none fixed left-1 top-0 z-40 h-[100svh] w-12 md:left-3 md:w-16"
    >
      {/* hilo: altura completa, se escala con transform (origen arriba) */}
      <div
        ref={thread}
        className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-brand/20 via-brand to-brand will-change-transform"
      />
      {/* araña */}
      <div
        ref={spider}
        className="absolute left-1/2 top-0 w-11 will-change-transform md:w-14"
      >
        {/* glow estático (sin filtro animado) detrás del cuerpo */}
        <div
          className="absolute left-1/2 top-[42%] h-7 w-7 -translate-x-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(216,31,38,0.45), transparent 70%)" }}
        />
        <svg viewBox="0 0 80 96" fill="none" className="relative w-full">
          {/* patas dobladas: base → rodilla (arriba/afuera) → punta (abajo) */}
          <g
            stroke="var(--color-brand-glow)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* lado derecho */}
            <path className="leg-idle" d="M43 36 L60 24 L72 38" />
            <path className="leg-idle" d="M43 38 L64 34 L79 52" />
            <path className="leg-idle" d="M43 40 L62 48 L76 66" />
            <path className="leg-rear-r" strokeWidth="2.6" d="M42 42 L54 54 L64 80" />
            {/* lado izquierdo (espejo) */}
            <path className="leg-idle" d="M37 36 L20 24 L8 38" />
            <path className="leg-idle" d="M37 38 L16 34 L1 52" />
            <path className="leg-idle" d="M37 40 L18 48 L4 66" />
            <path className="leg-rear-l" strokeWidth="2.6" d="M38 42 L26 54 L16 80" />
          </g>
          {/* cuerpo: cefalotórax (arriba) + abdomen (abajo, más grande) */}
          <g fill="var(--color-brand)">
            <ellipse cx="40" cy="37" rx="4.4" ry="3.8" />
            <ellipse cx="40" cy="51" rx="5.6" ry="7.6" />
          </g>
          {/* ojitos */}
          <g fill="#08080A">
            <circle cx="38.4" cy="36" r="0.9" />
            <circle cx="41.6" cy="36" r="0.9" />
          </g>
        </svg>
      </div>
    </div>
  );
}
