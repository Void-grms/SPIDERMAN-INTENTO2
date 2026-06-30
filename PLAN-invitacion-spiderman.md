# Plan de Implementación — Invitación Web "Spider-Man, 31 de julio" · v5 (premium · IA · GSAP-ready)

> Documento de planificación. Listo para revisión y para implementación directa.
> **Companion:** `RECURSOS-assets-spiderman.md` (v2) — manifiesto con **prompts de IA listos para pegar** y **specs GSAP-ready** por cada recurso (cómo debe estar construido para animarse).
> **v5:** todos los recursos (PNG, SVG, etc.) se **generan con IA** y se entregan **estructurados para reaccionar a GSAP** (SVG con trazo abierto para DrawSVG, nodos compatibles para MorphSVG, planos PNG con alpha para parallax multiplano).
> **v4:** dirección premium con **recursos reales** (imágenes, lockup de título, planos multiplano, tarjeta social, set de íconos a medida — sin emojis en la UI).
> **v3:** integra una capa de **motion graphics** con análisis de factibilidad y recomendación por rutas.
> **v2:** UI/UX a nivel Awwwards (dirección de arte, coreografía de motion, micro-interacciones, performance, a11y).

---

## 1. Spec / Contexto

**Qué es:** Página web de una sola pantalla (scroll narrativo) — invitación personal para ir al cine a ver Spider-Man el **31 de julio**.

**Para quién:** Una persona con la que no hablas hace ~8 meses; se distanciaron. Es un puente para reconectar.

**Tono (no negociable):** Sincero, cálido, con humor ligero. **No** presuntuoso, **no** abrumador, **no** dramático. Ella debe tener una salida fácil para decir que sí, sin presión.

**Concepto en una frase:**
> _"Una invitación que se abre como una película de Spider-Man y se cierra como una carta honesta: espectáculo en los bordes, sinceridad en el centro."_

**Requisitos explícitos:** React + Vite + GSAP · debe verse espectacular (calidad Awwwards) · incluir **video propio** como pieza central · evento el 31 de julio.

**Acción principal (CTA):** que ella responda "Sí, voy" → deep-link a WhatsApp (sin backend).

---

## 2. Concepto y dirección de arte — "De viñeta a cine"

La idea que eleva esto de "bonito" a "memorable": **la página evoluciona de cómic a cine y de vuelta**.

- **Apertura (preloader + hero):** estética de cómic — trama de medios tonos (*halftone*), rojo Spidey, aberración cromática — que **se revela** en una escena cinematográfica oscura.
- **Centro (reconexión + video):** el ruido de cómic se retira. Todo se vuelve **íntimo, calmo, con aire**. Spotlight, viñeta, foco. Aquí vive la sinceridad.
- **Cierre (invitación + RSVP):** la energía de cómic regresa para **celebrar** (web-shot de confeti).

Ese contraste de densidad **es** una decisión de diseño premium (alternar secciones cargadas y respiradas). Los **motion graphics** sirven a esa dirección: tejido de telarañas, transiciones cómic→cine, sello del ticket, web-shot del RSVP. El espectáculo enmarca; no compite con el mensaje.

**Dualidad cromática:** rojo cinematográfico dominante + azul telaraña profundo secundario + acento cian puntual.

**Calibración:** promo de Spider-Verse (Sony) · Active Theory · Resn · Cuberto (cursor) · Locomotive · Awwwards SOTD.

---

## 3. Decisiones de arquitectura

| Decisión | Elección | Por qué |
|---|---|---|
| Framework | Vite + React + React Router (1 ruta) | Tu stack; build rápido; deploy directo |
| Estilos | Tailwind v4 con `@theme` (tokens) | Tokens centralizados, consistencia |
| Smooth scroll | Lenis (sync con GSAP ticker + ScrollTrigger) | Sensación "cara" tipo Framer/Linear |
| Scroll + timelines | **GSAP** + ScrollTrigger + `@gsap/react` (`useGSAP`) | Coreografía cinematográfica con cleanup automático en React |
| **Motion graphics (núcleo)** | **Plugins GSAP — ahora 100% gratis**: DrawSVG, MorphSVG, MotionPath, Physics2D, SplitText | Vector animado en código, sin pipeline AE, sin dependencia nueva |
| Motion graphics (opcional, loops) | dotLottie (`@lottiefiles/dotlottie-react`) | Loops decorativos prehechos del marketplace, ligeros (.lottie) |
| Motion graphics (stretch, interactivo) | Rive (`@rive-app/react-canvas`) | Una pieza interactiva con máquina de estados (cursor-araña o botón RSVP) |
| Micro-interacciones | Framer Motion | Hover, entrada de componentes, transiciones de estado |
| Cursor custom | Componente propio (o Rive opcional) | Detalle de firma — **solo desktop**, off en touch/reduced-motion |
| Sonido | Howler/`<audio>` ambiental + SFX | Inmersión — **off por defecto**, toggle visible |
| Video | `<video>` self-hosted (MP4 H.264 + WebM) | Es tu video; control total |
| Estado RSVP | Sin backend → deep-link `wa.me` | Simple, personal, instantáneo |
| Deploy | Vercel o Netlify | Link compartible al instante |
| Responsive | **Mobile-first** | Ella abrirá desde el celular |

**Estructura de carpetas:**
```
src/
  components/
    Preloader.jsx        VideoSection.jsx     Closing.jsx
    Hero.jsx             Invitation.jsx       ui/ (Button, RevealText, Magnetic, WebBackdrop, SoundToggle, Cursor, ScrollThread)
    Reconnect.jsx        Rsvp.jsx             motion/ (WebDraw.jsx, ComicWipe.jsx, ConfettiWebShot.jsx, LottieLoop.jsx, RiveScene.jsx)
  hooks/
    useLenis.js          useReducedMotion.js  useInViewVideo.js   useMousePosition.js
  styles/  (tokens vía Tailwind @theme, global.css)
  content/ (copy.js  ← TODO el texto en un solo lugar)
  assets/  (texturas halftone, web SVG, .lottie, .riv, sfx)
  App.jsx  main.jsx
public/
  video/invitacion.mp4   video/invitacion.webm   video/poster.jpg
  audio/ambient.mp3       audio/click.mp3         audio/web-shot.mp3
  og-image.jpg
```

---

## 4. Sistema de diseño (tokens reales)

> Definir **antes** de la primera sección. Escala tipográfica **1.333** (expresiva/editorial). Color por roles. Profundidad con elevación + glow.

```css
:root {
  /* === TIPOGRAFÍA (escala 1.333) === */
  --font-display: 'Clash Display', 'PP Neue Montreal', sans-serif;
  --font-body:    'Satoshi', 'General Sans', sans-serif;
  --text-sm: 0.75rem;  --text-base: 1rem;   --text-lg: 1.333rem;
  --text-xl: 1.777rem; --text-2xl: 2.369rem; --text-3xl: 3.157rem;
  --text-4xl: 4.209rem; --text-5xl: 5.61rem;
  --hero: clamp(2.75rem, 9vw, 7.5rem);
  --leading-tight: 1.06; --leading-snug: 1.2; --leading-normal: 1.6;
  --tracking-tight: -0.02em; --tracking-wide: 0.12em;

  /* === COLOR (dark cinemático + dualidad Spider-Man) === */
  --bg: #08080A;  --surface-1: #121217;  --surface-2: #1A1A22;
  --text-primary: #F5F4F7; --text-secondary: #9C9CA8; --text-tertiary: #5A5A66;
  --border: rgba(255,255,255,0.07); --border-strong: rgba(255,255,255,0.14);
  --brand: #D81F26; --brand-deep: #9E141A; --brand-glow: #FF3D45;
  --web-blue: #1B2A4A; --accent-web: #5FA8FF;

  /* === ESPACIADO (escala 4/8) === */
  --space-2: .5rem; --space-4: 1rem; --space-6: 1.5rem; --space-8: 2rem;
  --space-12: 3rem; --space-16: 4rem; --space-24: 6rem; --space-32: 8rem; --space-40: 10rem;

  /* === FORMA, ELEVACIÓN Y GLOW === */
  --radius-md: 10px; --radius-lg: 16px; --radius-xl: 24px; --radius-full: 9999px;
  --shadow-md: 0 4px 12px rgba(0,0,0,.30);
  --shadow-lg: 0 16px 48px rgba(0,0,0,.45);
  --shadow-xl: 0 28px 72px rgba(0,0,0,.55);
  --glow-brand: 0 0 40px rgba(216,31,38,.35);

  /* === MOTION === */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-soft: cubic-bezier(0.33, 1, 0.68, 1);
  --ease-in-out:   cubic-bezier(0.65, 0, 0.35, 1);
  --ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast: 180ms; --duration-base: 320ms; --duration-slow: 640ms;
}
```

**Atmósfera:** halftone (puntos rojos `rgba(216,31,38,.06)`, denso en bordes/ausente en el centro) · grano/noise 4–6% · telaraña SVG de líneas finas · mesh gradient rojo tenue + viñeta · bordes 1px y sombras como sistema de elevación.

**Capa de recursos reales (lo que sube el "premium"):** además de los tokens, la experiencia se apoya en assets reales — un **lockup de título a medida** (no texto plano), **fotografía cinematográfica** de fondo, **planos multiplano** (3 capas PNG con parallax, estilo Spider-Verse), texturas reales (grano de película, halftone, light leaks, bokeh), un **set de íconos a medida** (cero emojis en la UI) y una **tarjeta social diseñada** para el preview del link. Todo esto está especificado, con formatos y dónde conseguirlo, en el **manifiesto `RECURSOS-assets-spiderman.md`**.

> Consultar `references/design-systems.md`, `references/motion.md`, `references/tailwind-setup.md` al implementar, y el **manifiesto de recursos** para los assets.

---

## 5. Narrativa y ritmo de scroll

| # | Sección | Densidad | Fondo | Rol |
|---|---|---|---|---|
| 1 | Preloader / apertura | Alta (cómic) | `--bg` + halftone | Crear expectativa, revelar |
| 2 | Hero | Media-alta | `--bg` + web + mesh | Gancho, "algo especial" |
| 3 | Reconexión | **Baja (aire)** | `--bg` viñeta | El alma — honestidad |
| 4 | Video | Baja (foco) | `--surface-1`, cinema dim | Pieza central emocional |
| 5 | Invitación (ticket) | Media | `--surface-1` + halftone leve | El qué/cuándo/dónde |
| 6 | RSVP | Alta (celebración) | `--bg` + glow | La conversión, baja presión |
| 7 | Cierre | Baja | `--bg` | Despedida cálida |

Regla: cada sección debe responder _"¿por qué sigo scrolleando?"_.

---

## 6. Coreografía de motion por sección

> **Una entrada orquestada por escena**, no 20 micro-animaciones dispersas. Solo `transform`/`opacity`. Easing natural. Cada animación con su variante `reduced-motion`. (MG = motion graphic.)

| Sección | Animación clave | Técnica | Duración · easing |
|---|---|---|---|
| **Preloader** | Contador 0→100 + halftone que revela + **MG: hilos de telaraña dibujándose** + salida wipe que descubre el hero | GSAP timeline + **DrawSVG** (stroke) / **MorphSVG** (wipe cómic→cine); bloquea scroll; **máx 3.5s** | reveal 600–800ms · expo |
| **Hero** | Titular revelado **línea por línea** con máscara; entrada escalonada | **SplitText** (masking nativo, +a11y) + Framer stagger | 600–700ms/elem · expo |
| **Hero** | **MG: telaraña que se teje** de fondo + parallax de profundidad con mouse (**3 planos PNG multiplano**, ver D2 del manifiesto) | **DrawSVG** + `useMousePosition`→transform (lerp) | line-draw 1.2s; parallax al cursor |
| **Hero** | Parallax al scroll + aberración cromática del título que asienta | Framer `useScroll`/`useTransform` | ligado al scroll |
| **Reconexión** | Texto frase por frase al entrar, mucho aire; spotlight suave | ScrollTrigger reveal `once` | 700–800ms · expo |
| **Video** | Marco escala-in con glow; play **pulsa**; al reproducir, el entorno **se atenúa** (modo cine) | Framer scale/opacity + estado `isPlaying` | in 600ms; dim 400ms |
| **Invitación** | Ticket "se imprime" + **MG: sello que estampa la fecha** (31 jul) + perforaciones | ScrollTrigger + micro-spring (CustomWiggle/spring) | in 600ms; sello spring |
| **RSVP** | Botón **magnético**; al click → **MG: web-shot de confeti** + título muta a confirmación + haptic | Magnetic + **Physics2D/Inertia** (partículas) o Rive state machine | click<200ms; confeti 800ms |
| **Cierre** | Fade-up calmo; firma con reveal "escritura" (opcional) | Framer whileInView / **DrawSVG** en firma | 700ms · expo |

**Transiciones entre escenas:** ScrollTrigger con *pin* breve hero→reconexión para crossfade cinematográfico (sutil, no marear).

**Scroll progress:** **MG con DrawSVG** — un hilo de telaraña que se teje por el costado conforme bajas.

---

## 7. Motion graphics — análisis de factibilidad y recomendación

**Veredicto corto:** **Altamente factible**, y en su mayoría **gratis y dentro de tu stack**. Desde abril 2025 GSAP es 100% gratis incluyendo todos los plugins premium (SplitText, DrawSVG, MorphSVG, MotionPath, Physics2D, Inertia). Eso significa que el grueso del "look motion-graphics" se hace **en código, sin pipeline de After Effects**. Lottie y Rive entran solo como complementos puntuales.

### ¿Qué entendemos por "motion graphics" aquí?
1. **Vector animado por código** — telarañas que se dibujan, máscaras cómic→cine, sello del ticket, confeti. → **GSAP**.
2. **Loops decorativos prehechos** — un logo Spidey animado, una ilustración en bucle. → **Lottie (dotLottie)**.
3. **Pieza interactiva con estados** — cursor-araña que reacciona, botón RSVP idle→hover→disparo→éxito. → **Rive**.

### Matriz de decisión

| Ruta | Payoff visual | Costo en performance | Esfuerzo / skill | Dependencia | Veredicto |
|---|---|---|---|---|---|
| **GSAP (DrawSVG/MorphSVG/MotionPath/Physics2D/SplitText)** | Alto | **Mínimo** (ya está en stack, anima transform/opacity) | Bajo–medio (lo controlas en código) | **0 nueva** (gratis) | ✅ **Ruta principal** |
| **Lottie (dotLottie)** | Medio–alto | Bajo *si* el asset es simple y usas `.lottie`/canvas | Bajo *si* lo consigues hecho; alto si lo animas en AE | ~60KB runtime + JSON/.lottie | ☑️ **Opcional** (1–2 loops sourced) |
| **Rive** | **Muy alto** (interactivo) | Medio (WASM ~200KB gzip, GPU 60fps, `.riv` 10–15× < Lottie) | Alto (aprender editor Rive + autoría) | `@rive-app/react-canvas` | ⚠️ **Stretch** (1 sola pieza estrella) |
| Video alpha renderizado (AE→WebM/HEVC) | Alto | Alto (peso + códecs alpha frágiles en Safari/Chrome) | Alto | — | 🚫 Fuera de scope |
| 3D (Spline/Three.js) | Muy alto | Alto en mobile | Alto | pesado | 🚫 Fuera de scope (salvo que lo pidas) |

### Recomendación por capas
- **Capa 1 — Hazlo con GSAP (recomendado).** Cubre ~80% del wow con el menor riesgo: DrawSVG para tejer telarañas y el scroll-thread; MorphSVG para el wipe cómic→cine del preloader; MotionPath para un swing puntual; Physics2D/Inertia para el web-shot del RSVP; SplitText para los reveals de titular. Cero peso nuevo, control total, sin editor que aprender.
- **Capa 2 — Lottie solo si encuentras el asset (opcional).** Para 1–2 loops que no quieras dibujar a mano (logo Spidey animado, swing en bucle): toma uno listo de LottieFiles, expórtalo `.lottie`, carga con `@lottiefiles/dotlottie-react` (renderer canvas/WASM, no SVG, para evitar jank en mobile) y **lazy-load**. Bajo esfuerzo si el asset existe; si toca animarlo en AE, sube mucho el costo → sáltalo.
- **Capa 3 — Rive para UNA pieza estrella (stretch, alto impacto).** Si quieres un elemento interactivo de firma — el **cursor-araña** que reacciona o el **botón RSVP** como máquina de estados (idle→hover→disparo→éxito) — Rive es la mejor herramienta. Pero cuesta ~200KB de WASM + aprender el editor + tiempo de autoría. Vale la pena para **exactamente una** pieza, no para todo. **Lazy-load + preload del WASM y del `.riv`**, fuera de la ruta crítica de render.
- **Evitar:** Lottie pesado multicapa con renderer SVG en mobile (jank); video alpha; 3D autoplay en mobile.

### Mapa elemento → herramienta
| Elemento motion-graphic | Herramienta | Capa |
|---|---|---|
| Telarañas que se dibujan (hero, scroll-thread) | GSAP **DrawSVG** | 1 |
| Wipe / transición cómic→cine (preloader) | GSAP **MorphSVG** | 1 |
| Swing de telaraña puntual | GSAP **MotionPath** | 1 |
| Web-shot de confeti (RSVP) | GSAP **Physics2D/Inertia** | 1 |
| Reveal de titular por líneas | GSAP **SplitText** | 1 |
| Logo Spidey animado / loop decorativo | **Lottie** (.lottie) | 2 (opcional) |
| Cursor-araña interactivo / botón RSVP con estados | **Rive** | 3 (stretch) |

### Decisión recomendada
**Arranca solo con la Capa 1 (GSAP).** Es lo más factible, ligero y rápido de entregar antes del 31 de julio. Deja Lottie y Rive como mejoras post-MVP: agrégalas únicamente si queda tiempo y un asset/pieza concreta lo justifica.

---

## 8. Catálogo de micro-interacciones y detalles de firma

- **Cursor custom (desktop):** nodo/reticle de telaraña que escala y cambia sobre interactivos; oculto en touch y reduced-motion; `mix-blend-mode` sutil. (Versión Rive = Capa 3 opcional.)
- **Botones magnéticos:** el CTA sigue al cursor dentro de un radio; vuelve con `--ease-spring`.
- **Hover de botón:** `translateY(-2px)` + glow rojo + escala 1.02. Active: 0.
- **Links:** subrayado que crece desde la izquierda.
- **Card/ticket hover:** elevación + borde que se ilumina + leve `rotateX`.
- **Reproductor de video:** controles custom minimalistas (play grande, progreso fino, mute); aparecen al hover/tap.
- **Sonido (opt-in):** toggle discreto, off por defecto; ambiental bajo + click + web-shot al confirmar. Persiste (`localStorage`).
- **Scroll progress:** hilo de telaraña que se teje (DrawSVG).
- **Haptic (mobile):** `navigator.vibrate` en la confirmación del RSVP.
- **Foco visible themed:** anillo rojo/cian para teclado.

---

## 9. Tareas

### Task 0 — Setup
- **0.0** **Recopilar/crear los recursos del manifiesto** (`RECURSOS-assets-spiderman.md`) — al menos los 🔴 imprescindibles antes de maquetar (fuentes, set de íconos, lockup A1, emblema A2, plate hero D1, grano D3, halftone D4, poster D9, tarjeta social G1). Colocarlos en `src/assets/` según la estructura del manifiesto.
- **0.1** `npm create vite@latest` (React); instalar `gsap`, `@gsap/react`, `lenis`, `framer-motion`, `tailwindcss@next`. (Opcionales: `@lottiefiles/dotlottie-react`, `@rive-app/react-canvas`, `howler`.)
- **0.2** Registrar plugins GSAP (`ScrollTrigger`, `DrawSVG`, `MorphSVG`, `MotionPath`, `Physics2D`, `SplitText`) — todos gratis. Configurar `useGSAP`.
- **0.3** Tailwind v4 `@theme` con **todos** los tokens de la sección 4.
- **0.4** Fuentes (Fontshare o tus PP) con `font-display: swap` + **preload** del display (evitar CLS).
- **0.5** `src/content/copy.js` con todo el texto (sección 10).
- **0.6** Hooks base: `useReducedMotion`, `useLenis`, `useMousePosition`. Respetar reduced-motion global (usar `gsap.matchMedia()`).
- **Done:** arranca, plugins registrados, tokens como utilidades, fuentes sin CLS, scroll suave activo.

### Task 1 — Shell, scroll, `Preloader` + capa global
- **1.1** `App.jsx` con 7 `<section>` semánticas; `useLenis` sincronizado con `gsap.ticker`/ScrollTrigger.
- **1.2** `Preloader`: timeline GSAP (contador + halftone revela + **DrawSVG** hilos + **MorphSVG** wipe cómic→cine); bloquea scroll; **máx 3.5s**; variante reduced-motion (fade).
- **1.3** Capa global: `ScrollThread` (DrawSVG), `Cursor` (desktop), `SoundToggle` (off por defecto).
- **Done:** preloader entra/sale sin jank ni CLS; capa global operativa y desactivable.

### Task 2 — Hero
- **2.1** `WebBackdrop` premium: **plate fotográfico** (D1) + **planos multiplano** (D2, 3 capas PNG) + texturas reales (grano D3, halftone D4, light leaks/bokeh D5/D6) + mesh gradient + viñeta; **MG: DrawSVG** teje la telaraña (E1) al entrar.
- **2.2** **Lockup del título** (A1) + complemento con **SplitText** (reveal por líneas, masking) + entrada escalonada.
- **2.3** Parallax de profundidad con mouse (**3 planos multiplano D2**, lerp) + parallax al scroll + aberración cromática que asienta.
- **2.4** Indicador "desliza" (ícono custom B1). Variantes reduced-motion para todo.
- **Done:** comunica "algo especial" en 5s; jerarquía clara; impecable en mobile; 60fps.

### Task 3 — Reconexión
- **3.1** Layout editorial, mucho aire, 2–4 frases máximo, viñeta de foco.
- **3.2** Reveal frase por frase al entrar (ScrollTrigger `once`).
- **3.3** Copy honesto y ligero (sección 10 — variantes para elegir).
- **Done:** se lee en <15s, se siente sincero, no pesa.

### Task 4 — Video (pieza central)
- **4.1** `VideoSection` con `<video playsInline preload="none" poster>`; controles custom.
- **4.2** Tap-to-play; estados poster→play→playing→pausa; fallback si no carga.
- **4.3** `useInViewVideo` (IntersectionObserver): carga al entrar en viewport.
- **4.4** Encuadre cinematográfico: marco + glow + viñeta; **modo cine** (atenúa el entorno al reproducir).
- **4.5** (Opcional) pista `<track>` de subtítulos.
- **Done:** carga rápido en mobile, reproduce con un toque, poster + fallback + modo cine.

### Task 5 — Invitación (ticket)
- **5.1** Tarjeta tipo **ticket de cine** (perforaciones, código, halftone leve): Spider-Man, **sábado 31 de julio**, hora y lugar (editables en `copy.js`).
- **5.2** **MG: sello que estampa la fecha** (micro-spring) + ticket "se imprime".
- **5.3** Hover de profundidad.
- **Done:** info inequívoca y editable; entrada con carácter.

### Task 6 — RSVP / CTA
- **6.1** Pregunta cálida + botón primario **magnético** "Sí, voy 🕷️".
- **6.2** Click → `window.open('https://wa.me/<tu-numero>?text=<mensaje-URL-encoded>')`.
- **6.3** **MG: web-shot de confeti** (Physics2D) + título muta a "te veo el 31" + haptic.
- **6.4** Botón secundario de baja presión ("Hablemos primero") → WhatsApp con otro mensaje.
- **Done:** un toque abre WhatsApp con el mensaje listo; confirmación celebratoria pero ligera.

### Task 6.5 — (OPCIONAL · Capa 3) Pieza estrella en Rive
- **6.5.1** Solo si hay tiempo: autorar en Rive el **cursor-araña** o el **botón RSVP** como máquina de estados.
- **6.5.2** Integrar con `@rive-app/react-canvas`; **lazy-load + preload** del WASM y del `.riv`; fuera de la ruta crítica.
- **6.5.3** Fallback no-Rive si falla la carga o hay reduced-motion.
- **Done:** una pieza interactiva memorable sin penalizar el LCP.

### Task 7 — Cierre + footer
- **7.1** Frase final cálida firmada; reveal calmo (firma DrawSVG opcional).
- **7.2** Footer mínimo y discreto.
- **Done:** cierra con calidez, no con presión.

### Task 8 — Pase de coreografía (motion)
- **8.1** Una entrada orquestada por escena; easing/duraciones según tokens.
- **8.2** Afinar parallax, pins, crossfades y MG (DrawSVG/MorphSVG/Physics2D); medir 60fps; eliminar jank.
- **8.3** Confirmar que todo anima solo `transform`/`opacity`.
- **Done:** movimiento intencional y "caro", nunca distrae del mensaje.

### Task 9 — Detalles de firma + micro-interacciones
- **9.1** Pulir cursor, magnetismo, hovers, links, controles de video, scroll-thread, sonido.
- **9.2** Coherencia: el mismo patrón se comporta igual en toda la página.
- **Done:** detalles de la sección 8 finos y consistentes.

### Task 10 — Responsive, accesibilidad y performance
- **10.1** QA mobile-first real (360 → 768 → 1280+): tipografía fluida, video, ticket, CTA, cursor off en touch, MG ligeros.
- **10.2** A11y: contraste AA, foco themed visible, teclado, `reduced-motion` con camino alterno completo (`gsap.matchMedia()`), sonido off por defecto.
- **10.3** Performance: comprimir video (<15–25MB, H.264 720–1080p), poster WebP, lazy-load; **tree-shake GSAP** (importar solo plugins usados); **Lottie en `.lottie`/canvas + lazy**; **Rive WASM lazy + preload**; sin CLS.
- **10.4** Lighthouse: Performance ≥ 90, Accessibility ≥ 95.
- **Done:** carga rápido en 4G, accesible, impecable en celular.

### Task 11 — Deploy y compartir
- **11.1** Build; subir video/audio/`.lottie`/`.riv` a `public/`/`assets/`; colocar **favicon (A4)** y **tarjeta social (G1)** en `public/`.
- **11.2** Deploy en Vercel/Netlify.
- **11.3** Verificar en **celular real** y la **preview al compartir**: meta `og:image` → tarjeta diseñada **G1** (1200×630), `og:title`, `og:description`, `twitter:card=summary_large_image`. (La preview en WhatsApp es la primera impresión: debe verse premium.)
- **Done:** link funcional y con preview premium al compartir por WhatsApp.

---

## 10. Copy / Texto (borrador real — edítalo en `copy.js`)

> El texto carga el 50% del peso emocional. Variantes para las líneas sensibles — elige cómo le hablarías tú.

**Hero — gancho:**
- A (juguetón): _"Hay un héroe que vuelve a los cines el 31 de julio. Y yo quería invitarte a ti."_
- B (directo): _"[Su nombre]... ¿tienes plan el 31 de julio?"_

**Reconexión — la línea honesta (la más importante):**
- A (ligera): _"Sé que ha pasado un rato. Más de un rato, la verdad. Pero me acordé de ti y pensé que esto era mejor que un 'hola' de la nada."_
- B (sincera): _"Pasó el tiempo y nos perdimos un poco. No vengo con un discurso — solo con ganas de volver a verte, sin complicarlo."_
- C (mínima): _"Han pasado meses. Te extrañé. Esto es lo más simple que se me ocurrió para decírtelo."_

**Video — intro:** _"Es más fácil mostrártelo que escribirlo. Dale play."_

**Invitación (ticket):** Película: **Spider-Man** · Fecha: **sábado 31 de julio** · Hora: **[editable]** · Lugar: **[editable]**

**RSVP — la pregunta:** _"¿Vienes conmigo? Sin presión, solo una película y nosotros dos poniéndonos al día."_
- Primario: **"Sí, voy 🕷️"** · Secundario: **"Hablemos primero"**

**Confirmación:** _"Te veo el 31. Trae hambre de canchita. 🍿"_

**Cierre:** _"Pase lo que pase, me alegra haberte escrito. — [Tu nombre]"_

---

## 11. Presupuesto de performance (premium ≠ lento)

| Métrica | Objetivo |
|---|---|
| LCP (4G mobile) | < 2.5s — el titular del hero es el LCP; **no** bloquear en fuentes ni en WASM |
| CLS | < 0.05 — preload de fuente display + métricas de fallback |
| INP | < 200ms — animar solo `transform`/`opacity`, listeners `passive` |
| Peso del video | < 15–25MB (H.264 720–1080p) + WebM opcional; `preload="none"` → al entrar en viewport |
| GSAP | Tree-shake; importar solo plugins usados; `useGSAP` para cleanup |
| Lottie (si se usa) | Formato `.lottie` + renderer canvas/WASM (no SVG); **lazy-load** |
| Rive (si se usa) | WASM ~200KB gzip → **lazy-load + preload**; nunca en la ruta crítica del hero |
| Lighthouse | Performance ≥ 90, Accessibility ≥ 95 |

---

## 12. Accesibilidad premium (parte del lujo)

- **`prefers-reduced-motion`:** camino alterno **completo** vía `gsap.matchMedia()` — sin parallax, sin cursor custom, sin MG pesados; el contenido aparece estático. SplitText añade `aria-label`/`aria-hidden` automáticamente; en reduced-motion, no animar el split.
- **Sonido off por defecto**, toggle visible y operable por teclado.
- **Contraste AA:** el rojo `--brand` solo en titulares/relleno de CTA (verificar blanco sobre rojo); cuerpo en `--text-primary`. Nunca rojo brillante en texto pequeño.
- **Teclado:** orden de tab lógico, foco themed visible, controles de video alcanzables.
- **MG accesibles:** Lottie/Rive con `aria-label`; respetar reduced-motion (pausar o mostrar estado estático).
- **Cursor custom:** nunca oculta el del sistema en touch ni con reduced-motion.

---

## 13. Riesgos

| Riesgo | Mitigación |
|---|---|
| El espectáculo ahoga el mensaje | Densidad: centro calmo; espectáculo solo en bordes (sección 2 y 6) |
| Tono presuntuoso / abrumador | Copy sobrio, botón "hablemos primero", cero drama |
| Premium / MG = lento | Presupuesto (sección 11): GSAP en-stack, Lottie/Rive lazy, video lazy, 60fps |
| Rive infla el bundle o retrasa el hero | Capa 3 = opcional, 1 pieza, lazy + preload WASM, fuera de ruta crítica |
| Animaciones que distraen o marean | Una entrada por escena; MG sutiles; pase de coreografía (Task 8) |
| Se ve mal en celular | Mobile-first desde Task 0; cursor off en touch; QA en celular real |
| Cursor/sonido rompen a11y | Ambos opt-out; sonido off por defecto; reduced-motion respetado |
| Scope creep por sumar MG | MVP = solo Capa 1 (GSAP); Lottie/Rive solo post-MVP si hay tiempo |
| Ella siente presión | CTA de baja presión, sin opciones que la hagan sentir mal |

---

## 14. Referencias de calibración

Promo de Spider-Verse (Sony) · Active Theory · Resn · Cuberto (cursor) · Locomotive · Awwwards SOTD.
Herramientas: GSAP (gsap.com — núcleo + plugins, gratis) · LottieFiles (assets) · Rive (rive.app, editor).
Estándar: movimiento con propósito y oficio, no efectos por efectos.
