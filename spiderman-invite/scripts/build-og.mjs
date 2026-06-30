// Compone la tarjeta social (OG) 1200×630: fondo IA + capa oscura + título +
// fecha + emblema de telaraña. Salida: public/og-image.jpg
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const W = 1200;
const H = 630;

const overlay = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="dark" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#08080A" stop-opacity="0.30"/>
      <stop offset="55%" stop-color="#08080A" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#08080A" stop-opacity="0.92"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#dark)"/>

  <!-- emblema telaraña -->
  <g transform="translate(600 235)" fill="none" stroke="#D81F26" stroke-width="2" stroke-linecap="round" opacity="0.95">
    <path d="M0 -60 V60 M-60 0 H60 M-42 -42 L42 42 M42 -42 L-42 42"/>
    <path d="M0 -34 L34 0 L0 34 L-34 0 Z"/>
    <path d="M0 -56 L56 0 L0 56 L-56 0 Z"/>
  </g>

  <text x="600" y="400" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="78" font-weight="700" fill="#F5F4F7" letter-spacing="-1">¿Vienes conmigo?</text>

  <text x="600" y="470" text-anchor="middle" font-family="Arial, sans-serif"
        font-size="30" fill="#9C9CA8" letter-spacing="6">UNA PELÍCULA · 31 DE JULIO</text>

  <g transform="translate(600 530)">
    <rect x="-90" y="0" width="180" height="2" fill="#D81F26" opacity="0.6"/>
  </g>
</svg>`;

const bg = path.join(ROOT, "public", "generated", "og-bg.png");
const out = path.join(ROOT, "public", "og-image.jpg");

await sharp(bg)
  .resize(W, H, { fit: "cover", position: "centre" })
  .composite([{ input: Buffer.from(overlay), top: 0, left: 0 }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(out);

const stat = (await import("node:fs")).statSync(out);
console.log(`OG listo: public/og-image.jpg (${(stat.size / 1024).toFixed(0)} KB)`);
