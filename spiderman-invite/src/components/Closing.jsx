import { motion } from "framer-motion";
import LottieLoop from "./motion/LottieLoop";
import { copy, config } from "../content/copy";

// Despedida cálida, sin presión.
export default function Closing() {
  return (
    <footer
      id="closing"
      className="relative flex min-h-[70svh] flex-col items-center justify-center overflow-hidden py-28 text-center"
    >
      <div className="vignette" />

      {/* Capa 2 · Lottie — emblema de telaraña que se teje y late */}
      <LottieLoop
        src="/lottie/web-emblem.json"
        className="pointer-events-none absolute left-1/2 top-[18%] z-0 h-56 w-56 -translate-x-1/2 opacity-80 md:h-72 md:w-72"
      />

      <div className="container-page relative z-10 max-w-2xl">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-2xl leading-snug text-text-primary md:text-3xl"
        >
          {copy.closing.frase}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-8 font-display text-xl text-brand"
        >
          {copy.closing.firma}
        </motion.p>
      </div>

      <div className="container-page relative z-10 mt-24 flex w-full items-center justify-between border-t border-border pt-6 text-xs text-text-tertiary">
        <span>{config.pelicula} · {config.fechaCorta}</span>
        <span>Hecho con cariño 🕷️</span>
      </div>
    </footer>
  );
}
