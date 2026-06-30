import { useEffect, useRef, useState } from "react";

// IntersectionObserver: marca el video como "listo para cargar" cuando entra
// en viewport (preload="none" hasta entonces) para no penalizar el LCP móvil.
export function useInViewVideo(rootMargin = "200px") {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);

  return [ref, inView];
}
