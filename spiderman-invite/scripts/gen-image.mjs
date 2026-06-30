// Generador de imágenes vía OpenRouter (modelo de imagen de Google).
// Uso:
//   node scripts/gen-image.mjs <slug> "<prompt>" [aspect]
//   node scripts/gen-image.mjs --manifest        (genera todo el set del plan)
//
// Lee OPENROUTER_API_KEY de .env. Guarda PNG en public/generated/<slug>.png
// y registra cada generación en scripts/.gen-log.json para no repetir.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// --- cargar .env (sin dependencias) ---
function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
loadEnv();

const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.OPENROUTER_IMAGE_MODEL || "google/gemini-3-pro-image";
if (!API_KEY) {
  console.error("Falta OPENROUTER_API_KEY en .env");
  process.exit(1);
}

const OUT_DIR = path.join(ROOT, "public", "generated");
fs.mkdirSync(OUT_DIR, { recursive: true });
const LOG_PATH = path.join(__dirname, ".gen-log.json");
const log = fs.existsSync(LOG_PATH) ? JSON.parse(fs.readFileSync(LOG_PATH, "utf8")) : {};

// Estilo maestro del manifiesto — coherencia entre todos los assets.
const MASTER = `cinematic premium web asset, comic-book-to-cinema art direction, dark moody atmosphere, deep near-black background (#08080A), Spider-Man color duality cinematic crimson red (#D81F26) and deep web-blue (#1B2A4A), subtle red rim-glow, fine film grain, dramatic volumetric lighting, elegant and restrained, not garish, not cartoonish, ultra-detailed, high dynamic range, 8k. No text, no watermark, no logo, no people.`;

async function generate(slug, prompt, { force = false } = {}) {
  const dest = path.join(OUT_DIR, `${slug}.png`);
  if (!force && fs.existsSync(dest)) {
    console.log(`= ${slug}: ya existe, saltando (usa --force para regenerar)`);
    return { slug, skipped: true };
  }
  const fullPrompt = `${MASTER}\n\n${prompt}`;
  process.stdout.write(`→ ${slug}: generando... `);

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost",
      "X-Title": "Spiderman Invite",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: fullPrompt }],
      modalities: ["image", "text"],
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    console.log("ERROR");
    throw new Error(`HTTP ${res.status}: ${txt.slice(0, 500)}`);
  }
  const data = await res.json();
  const images = data?.choices?.[0]?.message?.images;
  const url = images?.[0]?.image_url?.url;
  if (!url || !url.startsWith("data:")) {
    console.log("SIN IMAGEN");
    throw new Error("Respuesta sin imagen base64. Payload: " + JSON.stringify(data).slice(0, 600));
  }
  const b64 = url.split(",")[1];
  fs.writeFileSync(dest, Buffer.from(b64, "base64"));
  log[slug] = { prompt, model: MODEL, at: new Date().toISOString() };
  fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2));
  console.log(`OK (${(fs.statSync(dest).size / 1024).toFixed(0)} KB)`);
  return { slug, ok: true };
}

// --- set de assets imprescindibles del plan (Capa 1 / MVP) ---
const MANIFEST = [
  ["hero-plate", `cinematic night cityscape seen from a rooftop, distant skyscrapers, hazy atmospheric depth, deep blue-black tones with a faint crimson glow on the horizon, light rain in the air, large empty negative space in the upper-center for a title, anamorphic lens feel, 21:9 wide composition.`],
  ["plane-back", `distant blurred city skyline silhouette, heavy atmospheric haze, deep blue-black, very soft, isolated on flat neutral dark background, 21:9 wide composition.`],
  ["plane-mid", `dark rooftop edges, antennas and water tanks in silhouette, framing the left and bottom edges, completely empty center, isolated on flat dark background, 21:9 wide composition.`],
  ["plane-front", `delicate thin spider-web strands stretching across the image corners, dark with faint red highlights, isolated on flat dark background, 21:9 wide composition.`],
  ["light-leak", `cinematic light leak, warm crimson and amber streaks bleeding across the frame, soft anamorphic flare, on pure black background for screen blending, 16:9.`],
  ["bokeh", `defocused bokeh light particles, small soft circles, crimson and cool blue, floating in dark space, isolated on flat black background, 16:9.`],
  ["cinema", `dark empty cinema auditorium, glowing screen, moody red seat lighting, deep cinematic depth, 16:9.`],
  ["og-bg", `cinematic social-share background, dark city night with crimson glow and subtle spider-web in the corners, large empty center for a title, balanced composition, 1.91:1 wide.`],
  ["poster-fallback", `cinematic dark frame, abstract crimson and blue light streaks over a near-black background, subtle film grain, moody, 16:9, suitable as a video poster placeholder.`],
];

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  if (args[0] === "--manifest") {
    console.log(`Generando ${MANIFEST.length} assets con ${MODEL}...\n`);
    for (const [slug, prompt] of MANIFEST) {
      try {
        await generate(slug, prompt, { force });
      } catch (e) {
        console.error(`  ✗ ${slug}: ${e.message}`);
      }
    }
    console.log("\nListo. Revisa public/generated/");
    return;
  }
  const [slug, prompt] = args.filter((a) => a !== "--force");
  if (!slug || !prompt) {
    console.log('Uso: node scripts/gen-image.mjs <slug> "<prompt>" | --manifest [--force]');
    process.exit(1);
  }
  await generate(slug, prompt, { force });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
