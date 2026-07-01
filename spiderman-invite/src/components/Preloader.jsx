import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { copy } from "../content/copy";

// Imágenes críticas (capas del hero) que deben estar listas antes de revelar.
const CRITICAL_IMAGES = [
  "/generated/hero-plate.png",
  "/generated/plane-back.png",
  "/generated/plane-mid.png",
  "/generated/plane-front.png",
  "/generated/bokeh.png",
  "/generated/light-leak.png",
];

// Apertura cómic→cine. La cuenta 0→100 avanza según la carga REAL (fuentes +
// imágenes clave + window.load); no un temporizador fijo. onDone al terminar.
export default function Preloader({ onDone }) {
  const root = useRef(null);
  const [count, setCount] = useState(0);
  const reduced = useReducedMotion();

  // onDone estable para no reejecutar el efecto si cambia su identidad.
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const el = root.current;
    const startedAt = performance.now();
    const MIN_MS = reduced ? 300 : 900; // no parpadear si está en caché
    const MAX_MS = 12000; // límite de seguridad si algún asset se cuelga
    let done = false;
    let raf = 0;
    let shown = 0; // valor mostrado (lerp suave hacia el objetivo real)

    // ---- señales de carga real ----
    let imgLoaded = 0;
    const imgTotal = CRITICAL_IMAGES.length;
    CRITICAL_IMAGES.forEach((src) => {
      const img = new Image();
      const bump = () => {
        imgLoaded += 1;
      };
      img.onload = bump;
      img.onerror = bump;
      img.src = src;
    });

    let fontsReady = false;
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      fontsReady = true;
    });

    let winLoaded = document.readyState === "complete";
    const onWin = () => {
      winLoaded = true;
    };
    if (!winLoaded) window.addEventListener("load", onWin, { once: true });

    // Estado visual inicial
    const paths = el?.querySelectorAll(".pl-web path");
    if (paths) gsap.set(paths, { drawSVG: "0%" });
    const halftone = el?.querySelector(".pl-halftone");
    if (halftone) gsap.to(halftone, { opacity: 0.6, duration: 1.2, ease: "power2.out" });

    const finish = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      setCount(100);
      if (paths) gsap.set(paths, { drawSVG: "100%" });

      if (reduced) {
        gsap.to(el, { opacity: 0, duration: 0.5, onComplete: () => onDoneRef.current?.() });
        return;
      }
      // wipe de salida: descubre el hero (cómic → cine)
      const tl = gsap.timeline({ onComplete: () => onDoneRef.current?.() });
      tl.to(".pl-content", { opacity: 0, scale: 1.1, duration: 0.5, ease: "power2.in" }, 0).to(
        el,
        { clipPath: "inset(0 0 100% 0)", duration: 0.8, ease: "expo.inOut" },
        "-=0.15"
      );
    };

    const tick = () => {
      const elapsed = performance.now() - startedAt;
      const imgFrac = imgTotal ? imgLoaded / imgTotal : 1;
      const allReady = imgFrac >= 1 && fontsReady && winLoaded;
      const minReached = elapsed >= MIN_MS;

      // objetivo por carga real (70% imágenes · 15% fuentes · 15% window.load)
      let target =
        100 * (0.7 * imgFrac + 0.15 * (fontsReady ? 1 : 0) + 0.15 * (winLoaded ? 1 : 0));
      // no llegar a 100 hasta que TODO esté listo y pase el tiempo mínimo
      if (!(allReady && minReached)) target = Math.min(target, 99);

      shown += (target - shown) * 0.09;
      if (target >= 100 && 100 - shown < 0.5) shown = 100;
      setCount(Math.round(shown));
      if (paths) gsap.set(paths, { drawSVG: `${Math.min(shown, 100)}%` });

      if ((allReady && minReached && shown >= 99.5) || elapsed >= MAX_MS) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onWin);
    };
  }, [reduced]);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-bg"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <div className="pl-halftone halftone" style={{ opacity: 0 }} />

      <div className="pl-content relative flex flex-col items-center">
        {/* telaraña radial que se dibuja con la carga */}
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
