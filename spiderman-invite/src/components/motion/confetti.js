import { gsap, Physics2DPlugin } from "../../lib/gsap";

// Web-shot de confeti: dispara partículas (fragmentos rojos + trozos de
// telaraña blancos) desde un punto con Physics2D + gravedad. Sin assets:
// las partículas son nodos DOM. Se autolimpian.
export function fireWebShot(x, y, { count = 70, reduced = false } = {}) {
  if (reduced) return; // sin animación de partículas en reduced-motion

  const layer = document.createElement("div");
  layer.style.cssText =
    "position:fixed;inset:0;pointer-events:none;z-index:75;overflow:hidden";
  document.body.appendChild(layer);

  const colors = ["#D81F26", "#FF3D45", "#F5F4F7", "#5FA8FF"];
  const nodes = [];

  for (let i = 0; i < count; i++) {
    const p = document.createElement("i");
    const size = gsap.utils.random(4, 9);
    const isStrand = Math.random() > 0.6;
    p.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${
      isStrand ? 1.5 : size
    }px;height:${isStrand ? size * 2.4 : size}px;background:${gsap.utils.random(
      colors
    )};border-radius:${isStrand ? "2px" : "1px"};will-change:transform,opacity`;
    layer.appendChild(p);
    nodes.push(p);
  }

  gsap.to(nodes, {
    duration: () => gsap.utils.random(0.9, 1.6),
    physics2D: {
      velocity: () => gsap.utils.random(420, 820),
      angle: () => gsap.utils.random(200, 340), // hacia arriba (en abanico)
      gravity: 1400,
    },
    rotation: () => gsap.utils.random(-360, 360),
    opacity: 0,
    ease: "power1.out",
    onComplete: () => layer.remove(),
  });
}
