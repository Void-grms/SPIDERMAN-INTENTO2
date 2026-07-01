import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { IconPin, IconClock, IconCalendar } from "./ui/Icons";
import FakeQR from "./ui/FakeQR";
import Stamp from "./ui/Stamp";
import { copy } from "../content/copy";

const iconFor = { Fecha: IconCalendar, Hora: IconClock, Lugar: IconPin };

// Código de barras decorativo (anchos deterministas)
function Barcode() {
  const widths = "13231221312312132213122131231221".split("").map(Number);
  let x = 0;
  return (
    <svg viewBox="0 0 64 16" className="h-6 w-28 max-w-full sm:w-40" preserveAspectRatio="none" aria-hidden="true">
      {widths.map((w, i) => {
        const rect = i % 2 === 0 ? <rect key={i} x={x} y="0" width={w} height="16" fill="currentColor" /> : null;
        x += w + 0.6;
        return rect;
      })}
    </svg>
  );
}

export default function Invitation() {
  const root = useRef(null);
  const reduced = useReducedMotion();

  // "31 JUL" → día + mes para el sello
  const [selloDay = "31", selloMonth = "JUL"] = (copy.invitation.sello || "").split(" ");

  useGSAP(
    () => {
      const card = root.current.querySelector("[data-ticket]");
      const stamp = root.current.querySelector("[data-stamp]");
      const rows = root.current.querySelectorAll("[data-row]");
      const qr = root.current.querySelector("[data-qr]");
      const title = root.current.querySelector("[data-movie]");

      if (reduced) {
        gsap.set([card, stamp, rows, qr, title], { opacity: 1, y: 0, x: 0, scale: 1, rotate: 0 });
        return;
      }

      gsap.set(card, { y: 60, opacity: 0 });
      gsap.set(title, { y: 18, opacity: 0 });
      gsap.set(rows, { x: -16, opacity: 0 });
      gsap.set(stamp, { scale: 2.4, opacity: 0, rotate: -18 });
      gsap.set(qr, { scale: 0.6, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 62%", once: true },
      });
      tl.to(card, { y: 0, opacity: 1, duration: 0.8, ease: "expo.out" })
        .to(title, { y: 0, opacity: 1, duration: 0.6, ease: "expo.out" }, "-=0.45")
        .to(rows, { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }, "-=0.35")
        .to(qr, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }, "-=0.4")
        .to(stamp, { scale: 1, opacity: 1, rotate: -8, duration: 0.5, ease: "back.out(2.5)" }, "-=0.35");
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section
      ref={root}
      id="invitation"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg py-20 sm:py-28"
    >
      {/* Fondo: sala de cine (atenuada) para dar contexto, el ticket flota encima */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 scale-105 opacity-35 blur-[2px]"
          style={{ backgroundImage: "url(/generated/cinema.png)", backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 bg-bg/70" />
        <div className="vignette" />
      </div>
      <div className="halftone opacity-25" />

      <div className="container-page relative z-10 flex justify-center">
        <div
          data-ticket
          data-cursor="grow"
          className="relative grid w-full max-w-3xl overflow-hidden rounded-2xl border border-border-strong bg-surface-2 shadow-[var(--shadow-xl)] transition-transform duration-500 hover:-translate-y-1 md:grid-cols-[1fr_230px]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(18,18,23,0.78), rgba(18,18,23,0.82)), url(/generated/ticket-texture.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* brillo superior sutil */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          {/* ===== A · Header + título — (móvil: 1º · desktop: col1/fila1) ===== */}
          <div className="order-1 p-6 sm:p-8 md:col-start-1 md:row-start-1 md:p-10 md:pb-0">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">
                  {copy.invitation.kicker}
                </p>
                <p className="mt-1 text-sm text-text-secondary">{copy.invitation.titulo}</p>
              </div>
              {/* sello de tinta (fecha) */}
              <span
                data-stamp
                className="block h-16 w-16 shrink-0 text-brand sm:h-[4.75rem] sm:w-[4.75rem]"
              >
                <Stamp day={selloDay} month={selloMonth} className="h-full w-full" />
              </span>
            </div>

            {/* Título de la película — protagonista */}
            <div data-movie>
              <p className="mb-2 text-xs uppercase tracking-[0.25em] text-text-tertiary">
                Película
              </p>
              <h2 className="movie-title font-display font-bold uppercase leading-[0.92] text-text-primary">
                {copy.invitation.peliculaTitulo}
              </h2>
              <p className="mt-1 font-display text-lg font-medium tracking-[0.1em] text-brand-glow sm:text-2xl sm:tracking-[0.18em]">
                {copy.invitation.peliculaSub}
              </p>
            </div>
          </div>

          {/* ===== C · Talón con QR — (móvil: 2º, debajo del título · desktop: col2 full) ===== */}
          <div className="relative order-2 flex flex-col items-center justify-center gap-3 border-y border-dashed border-border-strong bg-surface-1/50 p-6 sm:p-8 md:order-none md:col-start-2 md:row-span-2 md:row-start-1 md:border-y-0 md:border-l">
            {/* notches del perforado (sólo desktop, en la costura vertical) */}
            <span className="absolute -left-3 -top-3 hidden h-6 w-6 rounded-full bg-surface-1 md:block" />
            <span className="absolute -bottom-3 -left-3 hidden h-6 w-6 rounded-full bg-surface-1 md:block" />

            <p className="text-center text-[0.65rem] uppercase tracking-[0.2em] text-text-tertiary">
              Escanea para entrar
            </p>
            <div data-qr className="rounded-xl bg-white p-2.5 shadow-lg">
              <FakeQR size={140} color="#9E141A" bg="#FFFFFF" />
            </div>
            <p className="max-w-[12rem] text-center text-[0.65rem] leading-snug text-text-tertiary">
              {copy.invitation.qrNota}
            </p>
          </div>

          {/* ===== B · Datos + barcode — (móvil: 3º · desktop: col1/fila2) ===== */}
          <div className="order-3 p-6 sm:p-8 md:col-start-1 md:row-start-2 md:border-t md:border-dashed md:border-border-strong md:p-10 md:pt-6">
            <dl className="space-y-4">
              {copy.invitation.filas.map((row) => {
                const Icon = iconFor[row.label] || IconCalendar;
                return (
                  <div key={row.label} data-row className="flex items-center gap-3 sm:gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Icon width={20} height={20} />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-xs uppercase tracking-wider text-text-tertiary">
                        {row.label}
                      </dt>
                      <dd className="font-display text-base leading-snug text-text-primary [overflow-wrap:anywhere] sm:text-lg">
                        {row.value}
                      </dd>
                    </div>
                  </div>
                );
              })}
            </dl>

            <div className="mt-6 flex items-center justify-between gap-3 text-text-tertiary sm:mt-8">
              <span className="min-w-0 shrink text-brand/70">
                <Barcode />
              </span>
              <span className="shrink-0 font-mono text-[0.7rem] tracking-wider sm:text-xs">{copy.invitation.paseId}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
