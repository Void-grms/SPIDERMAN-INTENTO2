import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";

// Araña fotorrealista que rapela por su hilo según el scroll. Flipbook que
// cicla para mover las patas; la velocidad del ciclo sigue a la del scroll.
// Se omiten los frames 1 y 2 (araña ladeada) → usamos del 3 al 10.
const FRAMES = [3, 4, 5, 6, 7, 8, 9, 10].map((n) => `/spider-frames/frame-${n}.png`);
const LAST = FRAMES.length - 1;

export default function ScrollThread() {
  const wrap = useRef(null);
  const thread = useRef(null);
  const spider = useRef(null);
  const imgs = useRef([]);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const size = spider.current.offsetWidth || 56;
      const anchor = size * 0.22; // el hilo llega a la parte superior de la araña

      gsap.set(spider.current, { xPercent: -50 });
      gsap.set(thread.current, { xPercent: -50, transformOrigin: "top center", scaleY: 0 });
      const setY = gsap.quickSetter(spider.current, "y", "px");
      const setScale = gsap.quickSetter(thread.current, "scaleY");
      const place = (y, H) => {
        setY(y);
        setScale((y + anchor) / H);
      };

      if (reduced) {
        place(10, wrap.current.clientHeight);
        return;
      }

      // ----- Flipbook: cicla los frames (patas en movimiento) -----
      let cur = 0;
      const show = (i) => {
        if (i === cur) return;
        imgs.current[cur].style.opacity = "0";
        imgs.current[i].style.opacity = "1";
        cur = i;
      };
      const fb = { f: 0 };
      const cycle = gsap.to(fb, {
        f: LAST,
        duration: 1.05,
        ease: "none",
        repeat: -1,
        yoyo: true,
        onUpdate: () => show(Math.max(0, Math.min(LAST, Math.round(fb.f)))),
      });

      // velocidad del ciclo reactiva a la del scroll (con inercia)
      let targetTS = 0.5;
      const tick = () => {
        targetTS += (0.5 - targetTS) * 0.04;
        cycle.timeScale(cycle.timeScale() + (targetTS - cycle.timeScale()) * 0.2);
      };
      gsap.ticker.add(tick);

      // posición ligada al progreso global del scroll
      const st = ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const H = wrap.current.clientHeight;
          place(self.progress * (H - size), H);
          targetTS = gsap.utils.clamp(0.5, 3.2, Math.abs(self.getVelocity()) / 260 + 0.5);
        },
      });
      place(0, wrap.current.clientHeight);

      return () => {
        gsap.ticker.remove(tick);
        cycle.kill();
        st.kill();
      };
    },
    { dependencies: [reduced] }
  );

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className="pointer-events-none fixed left-0.5 top-0 z-40 h-[100svh] w-14 md:left-2 md:w-20"
    >
      {/* hilo (escala vertical, sin reflow) */}
      <div
        ref={thread}
        className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-brand/20 via-brand to-brand will-change-transform"
      />
      {/* araña: 10 frames apilados, se alterna la opacidad */}
      <div
        ref={spider}
        className="absolute left-1/2 top-0 aspect-square w-12 will-change-transform md:w-16"
      >
        {FRAMES.map((src, i) => (
          <img
            key={src}
            ref={(el) => (imgs.current[i] = el)}
            src={src}
            alt=""
            draggable="false"
            className="absolute inset-0 h-full w-full object-contain"
            style={{ opacity: i === 0 ? 1 : 0 }}
          />
        ))}
      </div>
    </div>
  );
}
