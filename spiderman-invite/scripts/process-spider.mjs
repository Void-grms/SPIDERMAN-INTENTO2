// Key verde + normaliza los 10 frames a un lienzo común (araña centrada,
// tamaño consistente) → public/spider-frames/frame-N.png + montaje de control.
import sharp from "sharp";
import fs from "node:fs";

const SRC = ".tmp-frames";
const OUT = "public/spider-frames";
const CANVAS = 320; // lienzo cuadrado común
const FIT = 270; // tamaño al que se ajusta la araña dentro del lienzo
fs.mkdirSync(OUT, { recursive: true });

function keyGreen(data, width, height) {
  for (let i = 0; i < width * height; i++) {
    const o = i * 4;
    const r = data[o], g = data[o + 1], b = data[o + 2];
    const greenness = g - Math.max(r, b);
    if (g > 80 && greenness > 22) data[o + 3] = 0;
    else if (greenness > 6) data[o + 1] = Math.round(Math.max(r, b) + greenness * 0.25);
  }
  return data;
}

const thumbs = [];
for (let n = 1; n <= 10; n++) {
  const raw = `${SRC}/f${n}-green-raw.png`;
  if (!fs.existsSync(raw)) { console.log("falta", raw); continue; }

  const { data, info } = await sharp(raw).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  keyGreen(data, info.width, info.height);

  const keyed = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .median(3)
    .png()
    .toBuffer();

  const out = `${OUT}/frame-${n}.png`;
  await sharp(keyed)
    .trim({ threshold: 10 })
    .resize(FIT, FIT, { fit: "inside", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top: 0, bottom: 0, left: 0, right: 0,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .resize(CANVAS, CANVAS, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(out);

  thumbs.push(out);
  console.log("frame", n, "ok");
}

// montaje 5x2 sobre fondo oscuro para inspección
const cell = 150;
const composites = [];
for (let i = 0; i < thumbs.length; i++) {
  const buf = await sharp(thumbs[i]).resize(cell, cell, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  composites.push({ input: buf, left: (i % 5) * cell, top: Math.floor(i / 5) * cell });
}
await sharp({ create: { width: cell * 5, height: cell * 2, channels: 4, background: "#0b0b0e" } })
  .composite(composites)
  .png()
  .toFile(`${SRC}/montage.png`);
console.log("montaje ->", `${SRC}/montage.png`);
