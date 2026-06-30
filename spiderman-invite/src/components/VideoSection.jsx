import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInViewVideo } from "../hooks/useInViewVideo";
import { IconPlay, IconPause } from "./ui/Icons";
import { copy } from "../content/copy";

// Pieza central. Controles minimalistas, carga al entrar en viewport, modo cine.
export default function VideoSection() {
  const [ref, inView] = useInViewVideo();
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setPlaying(true)).catch(() => setError(true));
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const onTime = () => {
    const v = videoRef.current;
    if (v?.duration) setProgress((v.currentTime / v.duration) * 100);
  };

  const seek = (e) => {
    const v = videoRef.current;
    if (!v?.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - rect.left) / rect.width) * v.duration;
  };

  return (
    <section
      ref={ref}
      id="video"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-1 py-28"
    >
      {/* Atenuador modo cine */}
      <AnimatePresence>
        {playing && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      <div className="container-page relative z-10 w-full max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-3 text-text-secondary">{copy.video.intro}</p>
          <p className="mb-10 font-display text-xl text-brand">{copy.video.cue}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="group relative mx-auto aspect-video w-full overflow-hidden rounded-xl border border-border-strong bg-black shadow-[var(--shadow-xl)]"
          style={{ boxShadow: playing ? "var(--glow-brand), var(--shadow-xl)" : undefined }}
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            poster="/generated/poster-fallback.png"
            preload="none"
            playsInline
            onTimeUpdate={onTime}
            onEnded={() => setPlaying(false)}
            onError={() => setError(true)}
          >
            {inView && <source src="/video/invitacion.webm" type="video/webm" />}
            {inView && <source src="/video/invitacion.mp4" type="video/mp4" />}
          </video>

          {/* Botón play central */}
          {!playing && (
            <button
              onClick={toggle}
              aria-label="Reproducir video"
              className="absolute inset-0 z-20 flex items-center justify-center"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md transition-transform duration-300 hover:scale-110 hover:border-brand">
                <span className="absolute inline-flex h-20 w-20 animate-ping rounded-full bg-brand/20" />
                <IconPlay width={30} height={30} className="ml-1" />
              </span>
            </button>
          )}

          {/* Controles inferiores (aparecen al hover/tap) */}
          <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-3 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button onClick={toggle} aria-label={playing ? "Pausar" : "Reproducir"} className="text-white">
              {playing ? <IconPause width={22} height={22} /> : <IconPlay width={22} height={22} />}
            </button>
            <div
              onClick={seek}
              className="h-1 flex-1 cursor-pointer overflow-hidden rounded-full bg-white/20"
            >
              <div className="h-full bg-brand" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Fallback si no hay video aún */}
          {error && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 bg-surface-1/95 px-6 text-center">
              <p className="font-display text-lg text-text-primary">Tu video va aquí 🎬</p>
              <p className="max-w-xs text-sm text-text-secondary">
                Coloca <code className="text-brand">invitacion.mp4</code> en{" "}
                <code className="text-brand">public/video/</code> y aparecerá en este marco.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
