import { useEffect, useRef } from "react";

// Posición del mouse normalizada a [-0.5, 0.5] desde el centro de la ventana.
// Devuelve un ref (no provoca re-render); ideal para parallax con rAF/lerp.
export function useMousePosition() {
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return; // solo desktop
    const onMove = (e) => {
      pos.current.x = e.clientX / window.innerWidth - 0.5;
      pos.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return pos;
}
