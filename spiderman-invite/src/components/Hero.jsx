import { useRef } from "react";
import { gsap, useGSAP, SplitText, ScrollTrigger } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";
import WebBackdrop from "./ui/WebBackdrop";
import WebDraw from "./motion/WebDraw";
import { IconArrowDown } from "./ui/Icons";
import { copy } from "../content/copy";

export default function Hero() {
  const root = useRef(null);
  const titleRef = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const lines = root.current.querySelectorAll("[data-title-line]");
      const kicker = root.current.querySelector("[data-kicker]");
      const sub = root.current.querySelector("[data-sub]");
      const hint = root.current.querySelector("[data-hint]");

      if (reduced) {
        gsap.set([kicker, sub, hint, lines], { opacity: 1, yPercent: 0 });
        return;
      }

      // Split por línea con máscara para reveal cinematográfico
      const splits = [...lines].map((l) =>
        SplitText.create(l, { type: "lines", mask: "lines", linesClass: "rt-line" })
      );
      const lineEls = splits.flatMap((s) => s.lines);

      gsap.set(lineEls, { yPercent: 115 });
      gsap.set([kicker, sub, hint], { opacity: 0, y: 24 });

      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(kicker, { opacity: 1, y: 0, duration: 0.7, ease: "expo.out" })
        .to(
          lineEls,
          { yPercent: 0, duration: 0.95, stagger: 0.12, ease: "expo.out" },
          "-=0.4"
        )
        .to(sub, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" }, "-=0.5")
        .to(hint, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" }, "-=0.4");

      // Aberración cromática que "asienta" al inicio
      gsap.fromTo(
        titleRef.current,
        { "--ab": "5px" },
        { "--ab": "0px", duration: 1.6, delay: 0.4, ease: "expo.out" }
      );

      // Parallax del bloque de texto al hacer scroll
      gsap.to(root.current.querySelector("[data-hero-content]"), {
        yPercent: -18,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      return () => splits.forEach((s) => s.revert());
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section
      ref={root}
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      <WebBackdrop />

      {/* telarañas de esquina (DrawSVG) — más discretas en móvil */}
      <WebDraw
        corner="tl"
        className="absolute left-0 top-0 z-10 origin-top-left scale-[0.55] opacity-70 md:scale-100 md:opacity-100"
        delay={0.6}
      />
      <WebDraw
        corner="br"
        className="absolute bottom-0 right-0 z-10 origin-bottom-right scale-[0.55] opacity-70 md:scale-100 md:opacity-100"
        delay={0.9}
      />

      <div data-hero-content className="container-page relative z-20 py-24">
        <p
          data-kicker
          className="mb-6 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.3em] text-brand"
        >
          <span className="h-px w-10 bg-brand/60" />
          {copy.hero.kicker}
        </p>

        <h1
          ref={titleRef}
          className="hero-title font-display font-semibold text-text-primary"
          style={{ fontSize: "var(--hero)", lineHeight: "0.95" }}
        >
          {copy.hero.titulo.map((line, i) => (
            <span key={i} data-title-line className="block overflow-hidden">
              {line === "vuelve" ? (
                <span className="text-brand">{line}</span>
              ) : (
                line
              )}
            </span>
          ))}
        </h1>

        <p
          data-sub
          className="mt-8 max-w-md text-lg text-text-secondary"
          style={{ lineHeight: "1.5" }}
        >
          {copy.hero.sub}
        </p>
      </div>

      {/* Indicador de scroll */}
      <div
        data-hint
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-text-tertiary"
      >
        <span className="text-xs uppercase tracking-[0.25em]">
          {copy.hero.scrollHint}
        </span>
        <IconArrowDown width={20} height={20} className="animate-bounce-slow" />
      </div>
    </section>
  );
}
