import { useRef } from "react";
import { gsap, useGSAP, SplitText, ScrollTrigger } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";

// Revela texto por líneas con máscara (SplitText). a11y: SplitText conserva el
// texto accesible. En reduced-motion aparece estático.
// as: etiqueta ("h1","h2","p"...). split: "lines" | "words" | "chars".
export default function RevealText({
  as: Tag = "p",
  children,
  className = "",
  split = "lines",
  stagger = 0.12,
  duration = 0.85,
  delay = 0,
  start = "top 85%",
  trigger = true,
  ...rest
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const st = SplitText.create(ref.current, {
        type: split,
        linesClass: "rt-line",
        mask: split === "lines" ? "lines" : undefined,
      });
      const targets =
        split === "lines" ? st.lines : split === "words" ? st.words : st.chars;
      gsap.set(targets, { yPercent: 110 });
      gsap.to(targets, {
        yPercent: 0,
        duration,
        delay,
        stagger,
        ease: "expo.out",
        scrollTrigger: trigger
          ? { trigger: ref.current, start, once: true }
          : undefined,
      });
      return () => st.revert();
    },
    { scope: ref, dependencies: [reduced] }
  );

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
