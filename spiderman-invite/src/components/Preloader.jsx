import { useRef, useState } from "react";
import { gsap, useGSAP, DrawSVGPlugin } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { copy } from "../content/copy";

// Apertura cómic→cine. Bloquea scroll, máx ~3.5s. Llama onDone al terminar.
export default function Preloader({ onDone }) {
  const root = useRef(null);
  const [count, setCount] = useState(0);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const counter = { v: 0 };
      const finish = () => onDone?.();

      if (reduced) {
        gsap.to(counter, {
          v: 100,
          duration: 0.6,
          onUpdate: () => setCount(Math.round(counter.v)),
        });
        gsap.to(root.current, { opacity: 0, duration: 0.5, delay: 0.7, onComplete: finish });
        return;
      }

      const paths = root.current.querySelectorAll(".pl-web path");
      gsap.set(paths, { drawSVG: "0%" });

      const tl = gsap.timeline({ onComplete: finish });
      tl.to(counter, {
        v: 100,
        duration: 2.2,
        ease: "power1.inOut",
        onUpdate: () => setCount(Math.round(counter.v)),
      })
        .to(paths, { drawSVG: "100%", duration: 1.8, stagger: 0.04, ease: "power2.out" }, 0)
        .to(".pl-halftone", { opacity: 0.6, duration: 1.4, ease: "power2.out" }, 0)
        // wipe de salida: descubre el hero (cómic → cine)
        .to(".pl-content", { opacity: 0, scale: 1.1, duration: 0.6, ease: "power2.in" }, "+=0.15")
        .to(
          root.current,
          { clipPath: "inset(0 0 100% 0)", duration: 0.8, ease: "expo.inOut" },
          "-=0.2"
        );
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-bg"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <div className="pl-halftone halftone" style={{ opacity: 0 }} />

      <div className="pl-content relative flex flex-col items-center">
        {/* telaraña radial que se dibuja */}
        <svg
          className="pl-web absolute -z-0 h-64 w-64 opacity-50"
          viewBox="0 0 200 200"
          fill="none"
          aria-hidden="true"
        >
          <g stroke="var(--color-brand)" strokeWidth="0.6" strokeLinecap="round">
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (Math.PI * 2 * i) / 12;
              return (
                <path
                  key={`s${i}`}
                  d={`M100 100 L${(100 + Math.cos(a) * 100).toFixed(1)} ${(100 + Math.sin(a) * 100).toFixed(1)}`}
                />
              );
            })}
            {[26, 46, 66, 86].map((r, ri) => {
              let d = "";
              for (let i = 0; i <= 12; i++) {
                const a = (Math.PI * 2 * i) / 12;
                const x = (100 + Math.cos(a) * r).toFixed(1);
                const y = (100 + Math.sin(a) * r).toFixed(1);
                d += i === 0 ? `M${x} ${y}` : ` L${x} ${y}`;
              }
              return <path key={`r${ri}`} d={d} opacity={0.7} />;
            })}
          </g>
        </svg>

        <div className="relative z-10 flex flex-col items-center gap-3">
          <span className="font-display text-6xl font-bold tabular-nums text-text-primary">
            {count}
          </span>
          <span className="text-xs uppercase tracking-[0.3em] text-text-tertiary">
            {copy.preloader.kicker}
          </span>
        </div>
      </div>
    </div>
  );
}
