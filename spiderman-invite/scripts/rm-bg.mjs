// Quita el fondo de un frame usando edición de imagen (OpenRouter / Gemini).
// Uso: node scripts/rm-bg.mjs <input.png> <output.png>
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
function loadEnv() {
  const p = path.join(ROOT, ".env");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
loadEnv();
const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.OPENROUTER_IMAGE_MODEL || "google/gemini-3-pro-image";

const [, , inPath, outPath] = process.argv;
if (!inPath || !outPath) {
  console.log('Uso: node scripts/rm-bg.mjs <input.png> <output.png>');
  process.exit(1);
}

const b64 = fs.readFileSync(inPath).toString("base64");
const prompt =
  "Replace the entire background with a SOLID, UNIFORM, FLAT pure chroma-green color (#00FF00), edge to edge. Keep ONLY the red orb-weaver spider exactly as it is — same shape, pose, colors, scale and position in the frame. Remove the gray background, the web mesh, the vignette and the silk thread. The result must be the spider over a perfectly solid green screen, no gradients, no checkerboard, no other elements.";

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
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: `data:image/png;base64,${b64}` } },
        ],
      },
    ],
    modalities: ["image", "text"],
  }),
});

if (!res.ok) {
  console.error("HTTP", res.status, (await res.text()).slice(0, 400));
  process.exit(1);
}
const data = await res.json();
const url = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
if (!url?.startsWith("data:")) {
  console.error("Sin imagen:", JSON.stringify(data).slice(0, 400));
  process.exit(1);
}
fs.writeFileSync(outPath, Buffer.from(url.split(",")[1], "base64"));
console.log("OK ->", outPath, (fs.statSync(outPath).size / 1024).toFixed(0), "KB");
