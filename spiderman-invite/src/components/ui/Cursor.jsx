import { useRef } from "react";
import { gsap, useGSAP } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";

// Cursor custom (reticle de telaraña). Solo desktop, off en touch/reduced-motion.
// Escala sobre elementos interactivos (a, button, [data-cursor]).
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || window.matchMedia("(pointer: coarse)").matches) return;
      document.body.classList.add("has-custom-cursor");

      const xDot = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
      const yDot = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
      const xRing = gsap.quickTo(ring.current, "x", { duration: 0.4, ease: "power3" });
      const yRing = gsap.quickTo(ring.current, "y", { duration: 0.4, ease: "power3" });

      const move = (e) => {
        xDot(e.clientX);
        yDot(e.clientY);
        xRing(e.clientX);
        yRing(e.clientY);
      };
      const grow = () => gsap.to(ring.current, { scale: 1.9, opacity: 0.6, duration: 0.3, ease: "power3" });
      const shrink = () => gsap.to(ring.current, { scale: 1, opacity: 1, duration: 0.3, ease: "power3" });

      window.addEventListener("mousemove", move, { passive: true });
      const interactive = () =>
        document.querySelectorAll('a, button, [data-cursor="grow"]');
      const bind = () =>
        interactive().forEach((el) => {
          el.addEventListener("mouseenter", grow);
          el.addEventListener("mouseleave", shrink);
        });
      bind();

      return () => {
        window.removeEventListener("mousemove", move);
        document.body.classList.remove("has-custom-cursor");
      };
    },
    { dependencies: [reduced] }
  );

  if (reduced) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80] hidden md:block">
      <div
        ref={ring}
        className="absolute -ml-4 -mt-4 h-8 w-8 rounded-full border border-brand-glow/70"
        style={{ top: 0, left: 0, mixBlendMode: "difference" }}
      />
      <div
        ref={dot}
        className="absolute -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-brand-glow"
        style={{ top: 0, left: 0 }}
      />
    </div>
  );
}
