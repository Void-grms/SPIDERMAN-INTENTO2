import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

// Loop decorativo Lottie (Capa 2). Carga perezosa: el runtime solo se importa
// y monta cuando el elemento entra en viewport (no penaliza el LCP).
// En reduced-motion no autoplay (frame estático).
const LottiePlayer = lazy(() => import("./LottiePlayer"));

export default function LottieLoop({
  src,
  className = "",
  style,
  speed = 1,
  loop = true,
  rootMargin = "250px",
}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className} style={style} aria-hidden="true">
      {inView && (
        <Suspense fallback={null}>
          <LottiePlayer
            src={src}
            autoplay={!reduced}
            loop={loop}
            speed={speed}
            style={{ width: "100%", height: "100%" }}
          />
        </Suspense>
      )}
    </div>
  );
}
