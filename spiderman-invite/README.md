# 🕷️ Invitación web — "Spider-Man, 31 de julio"

Invitación web premium de una sola pantalla (scroll narrativo), estética cómic→cine,
React + Vite + GSAP. Construida según `../PLAN-invitacion-spiderman.md`.

## Arrancar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
npm run preview  # previsualiza el build
```

## ✏️ Lo que TIENES que editar (1 solo archivo)

Abre **`src/content/copy.js`** y rellena lo marcado con `◀ EDITAR`:

- `nombreElla`, `tuNombre`
- `whatsapp` — tu número con código de país, sin `+` ni espacios (ej. `51999888777`)
- `hora`, `lugar`

Ahí también está **todo el texto** (hero, reconexión, ticket, RSVP, cierre) y las
variantes de copy por si quieres cambiar el tono.

## 🎬 Tu video (pieza central)

Coloca `invitacion.mp4` en **`public/video/`** (ver `public/video/LEEME.txt`).
Sin video, la sección muestra un marcador elegante; no se rompe.

## 🖼️ Imágenes (ya generadas con IA)

Están en `public/generated/` (plate del hero, planos multiplano, bokeh, light leak,
cine, poster de respaldo). La tarjeta social está en `public/og-image.jpg`.

Para regenerar (necesita tu key en `.env`):

```bash
node scripts/gen-image.mjs --manifest          # set completo
node scripts/gen-image.mjs <slug> "<prompt>"   # una imagen
node scripts/build-og.mjs                       # recompone la tarjeta OG
```

> ⚠️ **Seguridad:** la key de OpenRouter está en `.env` (ignorado por git).
> **Rótala en openrouter.ai** cuando termines, ya que se compartió por chat.

## 🕸️ Capa 3 · Rive (opcional, plug-and-play)

El botón "Sí, voy" está listo para una pieza interactiva en **Rive** (idle→hover→
disparo→éxito). Coloca tu `rsvp.riv` en **`public/rive/`** y se activa solo
(lazy-load, fuera de la ruta crítica). Sin archivo, funciona el botón GSAP.
El contrato (State Machine + inputs) está en `public/rive/LEEME.txt`.

## 🚀 Deploy (Vercel / Netlify)

1. Sube el repo (sin `.env` — ya está en `.gitignore`).
2. Importa en Vercel/Netlify. Build: `npm run build`. Output: `dist`.
3. Verifica en un **celular real** y la **preview al compartir por WhatsApp**
   (debe salir la tarjeta `og-image.jpg`).

## ✅ Calidad incluida

- Smooth scroll (Lenis) sincronizado con GSAP/ScrollTrigger.
- Motion graphics con GSAP gratis: **DrawSVG** (telarañas, scroll-thread),
  **SplitText** (reveals), **Physics2D** (confeti del RSVP), micro-springs.
- `prefers-reduced-motion` respetado (todo aparece estático).
- Cursor custom (solo desktop), sonido opt-in (off por defecto, sintetizado).
- Mobile-first, foco visible, contraste cuidado, sin CLS.

## 🔎 Verificación headless (opcional)

```bash
node scripts/check.mjs          # desktop: screenshots + errores de consola
node scripts/check-mobile.mjs   # móvil + flujo de RSVP/confeti
```
