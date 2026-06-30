import { useRef } from "react";
import { gsap, useGSAP, SplitText, ScrollTrigger } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { copy } from "../content/copy";

// El alma de la página: honestidad, mucho aire, reveal frase por frase.
export default function Reconnect() {
  const root = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const lines = root.current.querySelectorAll("[data-line]");
      if (reduced) {
        gsap.set(lines, { opacity: 1, y: 0 });
        return;
      }
      const splits = [...lines].map((l) =>
        SplitText.create(l, { type: "lines", mask: "lines" })
      );
      const lineEls = splits.flatMap((s) => s.lines);
      gsap.set(lineEls, { yPercent: 110 });
      gsap.to(lineEls, {
        yPercent: 0,
        duration: 0.9,
        stagger: 0.14,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 65%", once: true },
      });
      return () => splits.forEach((s) => s.revert());
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section
      ref={root}
      id="reconnect"
      className="relative flex min-h-[90svh] items-center justify-center overflow-hidden py-32"
    >
      {/* viñeta de foco — concentra la atención en el centro */}
      <div className="vignette" />
      <div className="absolute left-1/2 top-1/2 -z-0 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/[0.06] blur-[100px]" />

      <div className="container-page relative z-10 max-w-3xl text-center">
        <p className="mb-10 text-sm uppercase tracking-[0.3em] text-text-tertiary">
          Antes de nada
        </p>
        <div className="space-y-3">
          {copy.reconnect.lineas.map((linea, i) => (
            <p
              key={i}
              data-line
              className={`font-display text-2xl leading-snug md:text-3xl ${
                i === copy.reconnect.lineas.length - 1
                  ? "text-text-primary"
                  : "text-text-secondary"
              }`}
            >
              {linea}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
