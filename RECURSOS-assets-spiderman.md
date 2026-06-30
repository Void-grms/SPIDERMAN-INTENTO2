# Manifiesto de Recursos (Assets) — "Spider-Man, 31 de julio" · v2 (generación con IA + GSAP-ready)

> Companion del `PLAN-invitacion-spiderman.md`.
> **v2:** cada recurso incluye **prompt de IA listo para pegar**, **specs para que reaccione a GSAP**
> (cómo debe estar estructurado para animarse) y el **post-proceso** necesario.

---

## 0. Cómo leer este manifiesto

Cada asset tiene:
- **Uso / Reacciona a GSAP con:** qué animación lo mueve (DrawSVG, MorphSVG, MotionPath, parallax, Physics2D…).
- **Specs GSAP-ready:** cómo debe estar construido para que esa animación funcione.
- **Prompt IA:** texto para pegar en tu generador.
- **Post-proceso:** lo que hay que hacer al output de la IA (quitar fondo, vectorizar, limpiar).

> **Verdad importante sobre la IA:** los generadores de imagen dan **raster (PNG/JPG)**, no SVG real.
> Para los assets que se animan con **DrawSVG/MorphSVG** (telarañas, morphs, íconos) necesitas un paso
> de **vectorización + limpieza** en Illustrator/Inkscape/Figma. Lo detallo en cada caso. No esperes
> SVG animable perfecto saliendo directo de un prompt.

---

## 1. Generación con IA — guía general

### 1.1 Prompt maestro de estilo (PRE-PÉGALO en TODOS los prompts de imagen)
Esto es lo que mantiene coherencia entre assets (el error #1 es que cada imagen parezca de otro sitio):

```
cinematic premium web asset, comic-book-to-cinema art direction, dark moody atmosphere,
deep near-black background (#08080A), Spider-Man color duality — cinematic crimson red (#D81F26)
and deep web-blue (#1B2A4A), subtle red rim-glow, fine film grain, dramatic volumetric lighting,
elegant and restrained (NOT garish, NOT cartoonish), ultra-detailed, high dynamic range, 8k,
--no text, --no watermark, --no logo, --no people
```
Luego, por asset, agregas lo específico + el **aspect ratio** + "transparent/isolated" cuando aplique.

### 1.2 Consistencia (haz esto)
- **Fija una semilla** (`--seed`) y/o usa **style reference** (`--sref` / "image prompt") para que todos compartan look.
- Reutiliza **los mismos hex** (`#08080A`, `#D81F26`, `#1B2A4A`) en cada prompt.
- Genera los **fondos SIN texto** (la IA escribe basura). El título va aparte como lockup (A1).
- Mismo tono de iluminación y grano en toda la serie.

### 1.3 Workflow de TRANSPARENCIA (para planos y overlays con alpha)
La mayoría de generadores no dan alpha limpio. Dos rutas:
- **Ruta A (cohesión):** genera UNA escena completa y **sepárala en planos** en Photoshop/Photopea (recorta frente/medio/fondo, rellena huecos con relleno generativo/inpainting).
- **Ruta B (alpha limpio):** genera cada elemento "isolated on flat solid background" y **quítale el fondo** (Photopea, remove.bg, o "Remove Background" de tu editor). Exporta **PNG-24 con alpha**.

### 1.4 Workflow de SVG (para lo que anima con DrawSVG/MorphSVG)
1. Genera con un AI vectorial (Recraft, Illustrator AI, SVG.io) **o** genera raster y **vectoriza** (Illustrator Image Trace, Inkscape Trace Bitmap, vectorizer.ai).
2. **Limpia en Illustrator/Figma:** reduce nodos, nombra capas/IDs.
3. **Para DrawSVG:** convierte a **trazos (`stroke`) abiertos, sin relleno** (Object → Path → Outline si hace falta lo contrario). DrawSVG anima el `stroke`, así que **sin stroke no hay animación de dibujado**.
4. **Para MorphSVG:** las formas inicio/fin deben tener **complejidad comparable** (morph más limpio); idealmente número de nodos similar.
5. Exporta SVG optimizado (SVGO), con `viewBox`, IDs en los paths que vas a animar.

### 1.5 Caja de herramientas IA
- **Imagen raster:** Midjourney, Flux, Ideogram (mejor con texto), DALL·E, Stable Diffusion.
- **Vector/SVG:** Recraft (bueno en vector e íconos), Illustrator AI, SVG.io.
- **Vectorizar raster→SVG:** Illustrator Image Trace, Inkscape, vectorizer.ai.
- **Quitar fondo / inpainting:** Photopea (gratis), remove.bg, Photoshop (relleno generativo).
- **Limpieza vector / nombrado de capas:** Illustrator, Figma, Inkscape.

---

## 2. Mapa GSAP — qué anima cada cosa (para que "reaccionen")

| Animación GSAP | Assets que la usan | Qué necesita el asset |
|---|---|---|
| **DrawSVG** (dibujado de trazo) | E1 telarañas, A2 emblema, A3 araña, B1 íconos (hover), firma cierre | SVG con `stroke` abierto, sin fill |
| **MorphSVG** (morph de forma) | E2 wipe cómic→cine, B1 play↔pausa / sonido on↔off | 2 paths de complejidad similar |
| **MotionPath** (seguir ruta) | swing de telaraña puntual | un `<path>` guía |
| **Parallax** (scroll/mouse, `ScrollTrigger` + `useMousePosition`) | D1 plate, D2 multiplano (3 capas), D6 bokeh | capas separadas con alpha, mismas dimensiones |
| **Scale / "Ken Burns"** (zoom lento) | D1 plate, D7 cine | raster de alta resolución |
| **Opacity / position sweep** (timeline) | D3 grano, D4 halftone, D5 light leaks | overlay full-frame (blend `screen`/`overlay`) |
| **Physics2D / Inertia** (partículas) | E3 confeti web-shot | sprites PNG pequeños con alpha, o formas en canvas |
| **Stagger reveal + clip-path mask** | A1 lockup título, B1 set | SVG con letras/íconos en grupos con ID |

---

## 3. A — Identidad y marca

### A1 · Lockup del título "Spider-Man" (tratamiento a medida, NO el logo oficial)
- **Uso / GSAP:** preloader y hero. **Reacciona con** stagger reveal por letras + clip-path mask, y opcional DrawSVG en el contorno.
- **Specs GSAP-ready:** entregar como **SVG con cada letra en un `<path>`/grupo con ID** (`#l-s`, `#l-p`…) para escalonar la entrada. Alternativa: PNG@2x transparente (se anima con máscara, pero menos fino).
- **Prompt IA (genera la *textura/estilo*, el texto lo limpias tú):**
```
[ESTILO MAESTRO] + custom cinematic title treatment, bold condensed display lettering,
metallic crimson red with subtle brushed texture and dark edges, faint red glow,
comic-ink meets film-poster vibe, isolated on flat black background, --ar 21:9 --no extra text
```
- **Post-proceso:** como la IA deforma el texto, lo más confiable es **tipografiarlo tú** (Clash Display/PP en Illustrator) y aplicarle el tratamiento de color/textura del render IA. Vectoriza, separa letras, exporta SVG.

### A2 · Emblema / monograma personal (tus iniciales o sello tipo web-emblem)
- **Uso / GSAP:** preloader, ticket, favicon, tarjeta social. **Reacciona con** DrawSVG (se dibuja) + scale/rotate.
- **Specs GSAP-ready:** SVG **monocromo, trazo abierto** (para que DrawSVG lo dibuje), + versión rellena para favicon. ViewBox cuadrado.
- **Prompt IA:**
```
[ESTILO MAESTRO] + minimalist monogram emblem combining a spider-web motif with elegant
geometric initials, single thin line-art style, crimson red on transparent, centered, symmetrical,
--ar 1:1 --no text
```
- **Post-proceso:** vectoriza, asegúrate de que sean **trazos abiertos** (no fills), nombra el path.

### A3 · Glifo de araña custom (reemplaza el 🕷️)
- **Uso / GSAP:** botón RSVP, acentos. **Reacciona con** DrawSVG (dibujado) o micro-morph.
- **Specs GSAP-ready:** SVG, grid 24px, **stroke 1.5–2px abierto**, `linecap` redondo.
- **Prompt IA:**
```
[ESTILO MAESTRO] + minimalist line-art spider icon, single consistent stroke weight,
geometric, 8 legs balanced, crimson red on transparent, icon style, --ar 1:1 --no text
```
- **Post-proceso:** vectorizar, normalizar grosor de trazo, exportar SVG.

### A4 · Favicon + apple-touch-icon
- **Uso:** pestaña / "agregar a inicio". (No se anima.)
- **Specs:** SVG + PNG 32 / 180 / 192 / 512, derivados de A2/A3 (versión **rellena**, legible a 16px).
- **IA:** no hace falta generar; derívalo de A2. Usa un favicon generator para los tamaños.

---

## 4. B — Sistema de íconos (a medida, sin emojis)

### B1 · Set cohesivo de íconos
- **Necesarios:** play, pausa, sonido on, sonido off, ubicación (pin), reloj/calendario, ticket, popcorn, flecha "desliza", telaraña.
- **Uso / GSAP:** UI. **Reaccionan con** DrawSVG (dibujado en hover), scale, y **MorphSVG** en pares (play↔pausa, sonido on↔off).
- **Specs GSAP-ready:** SVG individuales, **grid 24px, stroke 1.5–2px uniforme**, `linecap`/`linejoin` redondo, **trazos abiertos**. Para los pares de morph, diseña ambos estados con **nodos comparables**.
- **Prompt IA (genera la base, luego normaliza):**
```
[ESTILO MAESTRO] + cohesive line-icon set: play, pause, sound-on, mute, location-pin, clock,
movie-ticket, popcorn, down-arrow, spider-web — single uniform stroke weight, 24px grid,
rounded caps, monochrome, transparent, flat, minimal, --no text
```
- **Post-proceso:** vectoriza, **iguala el grosor de TODOS a un solo valor** (lo que más delata "amateur" es la inconsistencia), exporta cada uno como SVG limpio. *(Alternativa rápida: partir de Phosphor/Lucide/Iconoir y re-estilizar — a veces más confiable que IA para íconos.)*

---

## 5. C — Tipografía (no es generación de imagen)
- **C1 Display:** Clash Display (Fontshare, gratis) o tu PP Neue Montreal. Pesos 500/700.
- **C2 Texto:** Satoshi / General Sans (Fontshare). Pesos 400/500.
- **C3 (opcional) Serif:** Instrument Serif (Google) o tu PP Editorial New.
- Self-host `woff2`, subset latino, `font-display: swap`, **preload** del display.
> **GSAP:** los titulares en **texto real** (no imagen) se animan con **SplitText** (líneas/palabras/letras). Por eso el hero usa fuente + SplitText, y el lockup A1 queda para el remate visual.

---

## 6. D — Imágenes y texturas (el grueso de la generación IA)

### D1 · Plate de fondo del hero (ciudad nocturna / azoteas)
- **Uso / GSAP:** fondo del hero. **Reacciona con** parallax (translate al scroll/mouse) + scale lento (Ken Burns).
- **Specs GSAP-ready:** raster **2560×1440** (o 21:9), oscuro, con **zona vacía** donde irá el título; AVIF+WebP <500KB. Es la **capa de fondo** del multiplano.
- **Prompt IA:**
```
[ESTILO MAESTRO] + cinematic night cityscape from a rooftop, distant skyscrapers, hazy depth,
deep blue-black tones with a faint crimson glow on the horizon, light rain in the air,
negative space in the upper-center for text, anamorphic lens feel, --ar 21:9 --no text --no people
```
- **Post-proceso:** corrige niveles para que sea oscuro y deje respirar el texto; exporta AVIF/WebP @1x y @2x.

### D2 · Planos multiplano para parallax (3 capas) — el mayor salto "premium"
- **Uso / GSAP:** profundidad del hero. **Reaccionan con** parallax a **distinta velocidad** (ScrollTrigger scrub) + lerp del mouse.
- **Specs GSAP-ready:** **3 PNG-24 con alpha**, **mismas dimensiones que D1**, alineados; cada capa con transparencia para ver las de atrás:
  - **Capa FONDO:** skyline lejano difuso.
  - **Capa MEDIO:** bordes de azoteas/antenas en silueta, dejando el centro libre.
  - **Capa FRENTE:** hilos de telaraña/partículas que cruzan las esquinas.
- **Prompts IA (genera cada capa "isolada" para keying limpio):**
```
FONDO:  [ESTILO MAESTRO] + distant blurred city skyline silhouette, atmospheric haze,
        deep blue-black, isolated on flat neutral background, --ar 21:9 --no text --no people
MEDIO:  [ESTILO MAESTRO] + dark rooftop edges, antennas and water tanks in silhouette,
        framing the left and bottom, empty center, isolated on flat green background, --ar 21:9 --no text
FRENTE: [ESTILO MAESTRO] + delicate spider-web strands stretching across image corners,
        thin, dark with faint red highlights, isolated on flat green background, --ar 21:9 --no text
```
- **Post-proceso:** quita el fondo de cada capa (PNG alpha), rellena huecos con inpainting si hace falta, **verifica que las 3 calcen** en el mismo lienzo.

### D3 · Textura de grano de película
- **Uso / GSAP:** overlay global (blend `screen`/`overlay`, 4–6%). **Reacciona con** leve flicker de opacity / shift de posición.
- **Specs:** PNG 1024px **tileable** (o WebM loop 2–4s).
- **Prompt IA:**
```
[ESTILO MAESTRO] + seamless tileable film grain / analog noise texture, monochrome,
fine 35mm grain, subtle, on flat gray, --ar 1:1 --no text
```
- **Post-proceso:** desatura, hazlo **seamless** (offset + clonar), exporta tileable. *(También se puede generar por código/CSS.)*

### D4 · Patrón halftone (puntos de cómic)
- **Uso / GSAP:** apertura, ticket, transiciones. **Reacciona con** opacity/scale reveal (denso en bordes, ausente en el centro).
- **Specs:** **SVG pattern** (preferido, escala sin pixelar) o PNG 512px transparente, tileable.
- **Prompt IA (o hazlo en SVG directo):**
```
[ESTILO MAESTRO] + seamless halftone dot pattern, crimson red dots on transparent,
comic print texture, even grid, --ar 1:1 --no text
```
- **Post-proceso:** mejor **generarlo como SVG** (patrón de círculos) para nitidez y para animar opacity/escala.

### D5 · Light leaks / destellos
- **Uso / GSAP:** transiciones, calidez. **Reacciona con** opacity + position sweep en timelines.
- **Specs:** PNG alpha o JPG (blend `screen`), 1920×1080.
- **Prompt IA:**
```
[ESTILO MAESTRO] + cinematic light leak, warm crimson and amber streaks bleeding across frame,
soft anamorphic flare, on pure black for screen-blend, --ar 16:9 --no text
```
- **Post-proceso:** si es JPG sobre negro, se usa con blend `screen` (no necesita alpha).

### D6 · Bokeh / partículas de luz
- **Uso / GSAP:** atmósfera del hero (capa frente). **Reacciona con** float/parallax sutil infinito.
- **Specs:** PNG alpha 1920×1080.
- **Prompt IA:**
```
[ESTILO MAESTRO] + defocused bokeh light particles, small soft circles, crimson and cool-blue,
floating in dark space, isolated on flat background, --ar 16:9 --no text
```
- **Post-proceso:** quitar fondo → PNG alpha.

### D7 · Imagen de cine / sala / popcorn / textura de papel (ticket)
- **Uso / GSAP:** sección invitación. **Reacciona con** reveal + parallax.
- **Specs:** raster ~1600px AVIF/WebP; o textura de papel para el ticket.
- **Prompt IA:**
```
[ESTILO MAESTRO] + dark empty cinema auditorium, glowing screen, moody red seat lighting,
cinematic depth, --ar 16:9 --no text --no people
```
- **Post-proceso:** ajustar a la paleta; exportar WebP.

### D8 · (Opcional, personal) Foto significativa
- **NO se genera con IA** (es tuya). **GSAP:** reveal con grano/duotono. *(Decisión personal.)*

### D9 · Poster del video
- **NO IA:** es un **frame de tu video**. **GSAP:** no se anima (es el `poster`). Exporta WebP 1920×1080 con un grade que combine con la paleta.

---

## 7. E — Motion graphics (SVG/recursos animables)

### E1 · SVG de telarañas (la estrella de DrawSVG)
- **Uso / GSAP:** hero y scroll-thread. **Reacciona con** DrawSVG (stroke-dashoffset → se dibuja sola).
- **Specs GSAP-ready:** SVG con **paths de `stroke` ABIERTOS, sin relleno**; varios patrones (esquina, radial, hilos). IDs por path para escalonar el dibujado. ViewBox limpio.
- **Prompt IA:**
```
[ESTILO MAESTRO] + elegant spider web line art, thin even strokes, corner web and radial web
variations, crimson on transparent, no fills (outlines only), --ar 1:1 --no text
```
- **Post-proceso (CRÍTICO):** vectoriza → en Illustrator **convierte todo a trazos abiertos sin fill** (si quedó como relleno, DrawSVG no lo dibuja) → reduce nodos → exporta SVG con IDs.

### E2 · Formas SVG inicio→fin (wipe cómic→cine)
- **Uso / GSAP:** transición del preloader. **Reacciona con** MorphSVG.
- **Specs GSAP-ready:** 2 (o más) `<path>` de **complejidad similar** (p. ej. estallido halftone irregular → rectángulo de pantalla). Nodos comparables = morph limpio.
- **Prompt IA:** genera referencias de las 2 formas; en realidad conviene **dibujarlas a medida** en Illustrator para controlar los nodos. *(La IA sirve de inspiración, no de output final aquí.)*

### E3 · Partículas del web-shot (confeti RSVP)
- **Uso / GSAP:** RSVP. **Reacciona con** Physics2D/Inertia.
- **Specs:** mini-PNG con alpha (fragmentos rojos / trozos de telaraña, ~64px) **o** formas dibujadas en canvas (sin asset).
- **Prompt IA:**
```
[ESTILO MAESTRO] + set of small confetti shards and tiny web fragments, crimson and white,
isolated on transparent, top-down, --ar 1:1 --no text
```
- **Post-proceso:** recortar individuales, PNG alpha pequeños. *(O sáltatelo y usa formas por código.)*

### E4 · (Opcional · Capa 2) Lottie — emblema araña / swing en bucle
- **GSAP/Lottie:** loop independiente; GSAP puede controlar play/scrub.
- Genera el arte con IA, anímalo (LottieFiles Creator / AE) y exporta `.lottie`. O toma uno hecho de LottieFiles.

### E5 · (Opcional · Capa 3) Rive — cursor-araña / botón RSVP con estados
- Autorar en el editor de Rive (estados idle→hover→disparo→éxito). La IA no genera `.riv`.

---

## 8. F — Audio (opcional, opt-in; off por defecto)
- **F1 Ambiente** (loop atmosférico, 20–40s): Uppbeat / Pixabay Music / Mixkit. *(Si usas IA de música, revisa licencia.)*
- **F2 SFX** (click, thwip/web-shot, whoosh): Freesound (CC) / Mixkit → unir en sprite.

---

## 9. G — Tarjeta social (OG image) — primera impresión
### G1 · Tarjeta de compartir 1200×630
- **Uso:** preview del link en WhatsApp (lo PRIMERO que ella ve). No se anima.
- **Specs:** **1200×630**, JPG/PNG <200KB. **Composición:** fondo IA + lockup A1 + emblema A2 + "31 de julio". 
- **Prompt IA (solo el FONDO; el texto/lockup lo montas tú en Figma):**
```
[ESTILO MAESTRO] + cinematic social-share background, dark city night with crimson glow and
subtle spider-web in the corners, empty center for a title, balanced composition,
--ar 1.91:1 --no text --no people
```
- **Post-proceso:** en Figma/Photopea monta lockup + emblema + fecha sobre el fondo; exporta 1200×630.

---

## 10. H — (Opcional) Color del video
- **H1 LUT/grade** en DaVinci Resolve (gratis) para igualar el video con la paleta (lift rojo / teal-orange). Opcional, sube el acabado.

---

## 11. Prioridades (qué generar primero)

**🔴 Imprescindibles (MVP · Capa 1):** C1/C2 (fuentes) · B1 (íconos core) · A1 (lockup) · A2 (emblema) ·
A4 (favicon) · E1 (telarañas SVG, GSAP-ready) · D1 (plate hero) · D3 (grano) · D4 (halftone) ·
D9 (poster) · G1 (tarjeta social).

**🟡 Premium-plus:** D2 (multiplano — 3 capas) · D5/D6 (light leaks/bokeh) · D7 (cine) · E2 (morph) ·
E3 (partículas) · A3 (glifo araña) · F1/F2 (audio) · C3 (serif).

**⚪ Opcionales (Capa 2/3):** D8 (foto personal) · E4 (Lottie) · E5 (Rive) · H1 (LUT).

---

## 12. Checklist de "GSAP-ready" (revisa antes de integrar)

- [ ] Telarañas / emblema / íconos = **SVG con `stroke` abierto, sin fill** (si no, DrawSVG no dibuja).
- [ ] Formas de morph = **nodos de complejidad similar**.
- [ ] Planos multiplano = **3 PNG alpha, mismas dimensiones, alineados**, con transparencia real.
- [ ] Overlays (grano/leaks/bokeh) = **full-frame** para blend `screen`/`overlay`.
- [ ] Paths que vas a animar = **con `id`** y `viewBox` correcto.
- [ ] Todo optimizado (SVGO para vector, AVIF/WebP para raster) y dentro del presupuesto de performance.
- [ ] Consistencia: misma semilla/style-ref, mismos hex, mismo grano en toda la serie.

---

## 13. Licencias (con IA)
- La mayoría de generadores conceden a su salida uso personal/comercial — **revisa los términos** de la tuya.
- **No promptees el logo oficial de Spider-Man** ni marcas registradas; genera un **lockup y emblema originales** inspirados en la estética (A1/A2). Es más premium y sin fricción legal.
- No generes rostros de personas reales. Para algo personal de un solo uso, esto es de bajo riesgo.

---

## 14. Estructura de carpetas

```
src/assets/
  fonts/        (C1, C2, C3 — .woff2)
  brand/        (A1 lockup.svg, A2 emblema.svg, A3 spider.svg)
  icons/        (B1 — set SVG, stroke abierto)
  img/          (D1 hero-plate, D2 plane-bg/mid/front.png, D7 cine, D8 personal, D9 poster)
  textures/     (D3 grain, D4 halftone.svg, D5 leaks, D6 bokeh)
  motion/       (E1 webs.svg, E2 morph-a.svg/morph-b.svg, E3 particles/, E4 *.lottie, E5 *.riv)
  audio/        (F1 ambient, F2 sfx-sprite)
public/
  favicon/      (A4)
  og-image.jpg  (G1)
```
