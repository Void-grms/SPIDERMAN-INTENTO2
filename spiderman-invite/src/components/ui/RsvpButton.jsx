import { Suspense, lazy, useEffect, useState } from "react";
import Button from "./Button";
import { useReducedMotion } from "../../hooks/useReducedMotion";

// Wrapper inteligente para el CTA principal (Capa 3).
// Detecta si existe /rive/rsvp.riv ANTES de cargar el runtime de Rive:
//   · no existe / reduced-motion / error  → botón GSAP de respaldo (coste cero de Rive)
//   · existe                               → carga lazy el RiveButton (fuera de ruta crítica)
const RiveButton = lazy(() => import("../motion/RiveButton"));

export default function RsvpButton({ onConfirm, children }) {
  const reduced = useReducedMotion();
  const [mode, setMode] = useState("checking"); // checking | rive | fallback

  useEffect(() => {
    if (reduced) {
      setMode("fallback");
      return;
    }
    let alive = true;
    // Verifica la FIRMA del archivo, no sólo el status: un servidor con SPA
    // fallback devuelve index.html (200) para rutas inexistentes. Los .riv
    // empiezan con los bytes mágicos "RIVE".
    fetch("/rive/rsvp.riv")
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject()))
      .then((buf) => {
        const sig = String.fromCharCode(...new Uint8Array(buf.slice(0, 4)));
        if (alive) setMode(sig === "RIVE" ? "rive" : "fallback");
      })
      .catch(() => alive && setMode("fallback"));
    return () => {
      alive = false;
    };
  }, [reduced]);

  // Respaldo GSAP (también se usa como fallback de Suspense y durante el chequeo)
  const fallback = (
    <Button magnetic onClick={onConfirm} className="text-lg">
      {children}
    </Button>
  );

  if (mode === "rive") {
    return (
      <Suspense fallback={fallback}>
        <RiveButton onConfirm={onConfirm} onError={() => setMode("fallback")} />
      </Suspense>
    );
  }

  return fallback;
}
