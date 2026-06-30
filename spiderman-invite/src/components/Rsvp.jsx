import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "./ui/Button";
import RsvpButton from "./ui/RsvpButton";
import LottieLoop from "./motion/LottieLoop";
import { IconSpider } from "./ui/Icons";
import { fireWebShot } from "./motion/confetti";
import { sfx } from "../lib/sound";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { config, whatsappMsg, copy } from "../content/copy";

const wa = (msg) =>
  `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(msg)}`;

export default function Rsvp() {
  const [confirmed, setConfirmed] = useState(false);
  const reduced = useReducedMotion();

  const onYes = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    fireWebShot(r.left + r.width / 2, r.top + r.height / 2, { reduced });
    sfx.webShot();
    if (navigator.vibrate) navigator.vibrate([20, 40, 20]);
    setConfirmed(true);
    setTimeout(() => window.open(wa(whatsappMsg.si), "_blank"), 650);
  };

  const onTalk = () => {
    sfx.click();
    window.open(wa(whatsappMsg.hablemos), "_blank");
  };

  return (
    <section
      id="rsvp"
      className="relative flex min-h-screen items-center justify-center overflow-hidden py-28"
    >
      <div className="mesh-brand opacity-80" />
      <div className="absolute left-1/2 top-1/2 h-[50vmin] w-[50vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/[0.08] blur-[120px]" />

      {/* Capa 2 · Lottie — destellos en órbita (ambiente de celebración) */}
      {!confirmed && (
        <LottieLoop
          src="/lottie/sparks.json"
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 opacity-60"
        />
      )}

      <div className="container-page relative z-10 max-w-2xl text-center">
        <AnimatePresence mode="wait">
          {!confirmed ? (
            <motion.div
              key="ask"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2
                className="font-display font-semibold text-text-primary"
                style={{ fontSize: "clamp(2.5rem, 7vw, 4.5rem)", lineHeight: "1" }}
              >
                {copy.rsvp.pregunta}
              </h2>
              <p className="mx-auto mt-6 max-w-md text-lg text-text-secondary">
                {copy.rsvp.sub}
              </p>

              <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <RsvpButton onConfirm={onYes}>
                  {copy.rsvp.primario}
                  <IconSpider width={22} height={22} />
                </RsvpButton>
                <Button variant="ghost" onClick={onTalk}>
                  {copy.rsvp.secundario}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-brand text-brand" style={{ boxShadow: "var(--glow-brand)" }}>
                <IconSpider width={36} height={36} />
              </div>
              <h2
                className="font-display font-semibold text-text-primary"
                style={{ fontSize: "clamp(2.5rem, 7vw, 4.5rem)", lineHeight: "1" }}
              >
                {copy.rsvp.confirmado}
              </h2>
              <p className="mt-5 text-lg text-text-secondary">
                {copy.rsvp.confirmadoSub}
              </p>
              <p className="mt-8 text-sm text-text-tertiary">
                Abriendo WhatsApp…{" "}
                <button onClick={() => window.open(wa(whatsappMsg.si), "_blank")} className="underline decoration-brand underline-offset-4 hover:text-text-primary">
                  ¿no se abrió? toca aquí
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
