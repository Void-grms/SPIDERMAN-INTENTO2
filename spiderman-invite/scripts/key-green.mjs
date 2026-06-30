// Chroma key verde → alpha real. Quita verde, hace despill del borde.
// Uso: node scripts/key-green.mjs <in.png> <out.png>
import sharp from "sharp";

const [, , inPath, outPath] = process.argv;

const { data, info } = await sharp(inPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;

for (let i = 0; i < width * height; i++) {
  const o = i * 4;
  let r = data[o], g = data[o + 1], b = data[o + 2];
  const greenness = g - Math.max(r, b);
  if (g > 80 && greenness > 22) {
    data[o + 3] = 0; // fondo
  } else if (greenness > 6) {
    // despill: baja el verde sobrante del borde
    data[o + 1] = Math.round(Math.max(r, b) + (g - Math.max(r, b)) * 0.3);
  }
}

await sharp(data, { raw: { width, height, channels: 4 } })
  .median(2)
  .png()
  .toFile(outPath);

console.log("keyed ->", outPath);
