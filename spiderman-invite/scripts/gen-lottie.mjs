// Genera assets Lottie (.json) por código — coherentes con la paleta.
// Salida: public/lottie/web-emblem.json y public/lottie/sparks.json
// No requiere After Effects ni descargas. Renderiza con el runtime Lottie.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "..", "public", "lottie");
fs.mkdirSync(OUT, { recursive: true });

const hex = (h) => {
  const n = parseInt(h.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255, 1];
};
const BRAND = hex("#D81F26");
const GLOW = hex("#FF3D45");
const WEB = hex("#5FA8FF");

const C = 200; // centro
const FR = 60;
const OP = 180; // 3s loop

// ---- helpers de shapes ----
const linePath = (x1, y1, x2, y2) => ({
  ty: "sh",
  ks: { a: 0, k: { i: [[0, 0], [0, 0]], o: [[0, 0], [0, 0]], v: [[x1, y1], [x2, y2]], c: false } },
});
const polyPath = (pts) => ({
  ty: "sh",
  ks: {
    a: 0,
    k: { i: pts.map(() => [0, 0]), o: pts.map(() => [0, 0]), v: pts, c: true },
  },
});
const stroke = (col, w) => ({ ty: "st", c: { a: 0, k: col }, o: { a: 0, k: 100 }, w: { a: 0, k: w }, lc: 2, lj: 2 });
const fill = (col) => ({ ty: "fl", c: { a: 0, k: col }, o: { a: 0, k: 100 } });
const trGroup = (o = 100) => ({
  ty: "tr",
  p: { a: 0, k: [0, 0] },
  a: { a: 0, k: [0, 0] },
  s: { a: 0, k: [100, 100] },
  r: { a: 0, k: 0 },
  o: { a: 0, k: o },
});

// ===================== WEB EMBLEM =====================
function webEmblem() {
  const spokes = 12;
  const rings = [46, 86, 126, 166];
  const angles = Array.from({ length: spokes }, (_, i) => (Math.PI * 2 * i) / spokes);

  const shapes = [];
  // radiales
  angles.forEach((a) => {
    shapes.push(linePath(C, C, C + Math.cos(a) * 176, C + Math.sin(a) * 176));
  });
  // anillos
  rings.forEach((r) => {
    shapes.push(polyPath(angles.map((a) => [C + Math.cos(a) * r, C + Math.sin(a) * r])));
  });

  // trim path: se teje (0→100) y se destejen en bucle continuo
  const trim = {
    ty: "tm",
    s: {
      a: 1,
      k: [
        { t: 0, s: [0], i: { x: [0.5], y: [1] }, o: { x: [0.5], y: [0] } },
        { t: OP * 0.55, s: [0], i: { x: [0.5], y: [1] }, o: { x: [0.5], y: [0] } },
        { t: OP, s: [100] },
      ],
    },
    e: {
      a: 1,
      k: [
        { t: 0, s: [0], i: { x: [0.5], y: [1] }, o: { x: [0.5], y: [0] } },
        { t: OP * 0.45, s: [100] },
      ],
    },
    o: { a: 0, k: 0 },
    m: 1,
  };

  const webGroup = {
    ty: "gr",
    it: [...shapes, trim, stroke(WEB, 1.5), trGroup()],
  };

  const webLayer = {
    ddd: 0,
    ty: 4,
    nm: "web",
    sr: 1,
    ks: {
      o: { a: 0, k: 70 },
      r: {
        a: 1,
        k: [
          { t: 0, s: [0], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
          { t: OP, s: [12] },
        ],
      },
      p: { a: 0, k: [C, C, 0] },
      a: { a: 0, k: [C, C, 0] },
      s: { a: 0, k: [100, 100, 100] },
    },
    ao: 0,
    shapes: [webGroup],
    ip: 0,
    op: OP,
    st: 0,
    bm: 0,
  };

  // nodos que titilan
  const nodeGroups = [];
  rings.forEach((r, ri) => {
    angles.forEach((a, ai) => {
      const x = C + Math.cos(a) * r;
      const y = C + Math.sin(a) * r;
      const phase = ((ri * spokes + ai) % 7) / 7;
      const t0 = Math.round(phase * OP);
      nodeGroups.push({
        ty: "gr",
        it: [
          { ty: "el", p: { a: 0, k: [x, y] }, s: { a: 0, k: [4.5, 4.5] } },
          fill(GLOW),
          {
            ty: "tr",
            p: { a: 0, k: [0, 0] },
            a: { a: 0, k: [0, 0] },
            s: { a: 0, k: [100, 100] },
            r: { a: 0, k: 0 },
            o: {
              a: 1,
              k: [
                { t: 0, s: [(phase * 80) % 80] },
                { t: (t0 + OP / 2) % OP, s: [90] },
                { t: OP, s: [(phase * 80) % 80] },
              ].sort((p, q) => p.t - q.t),
            },
          },
        ],
      });
    });
  });
  const nodesLayer = {
    ddd: 0,
    ty: 4,
    nm: "nodes",
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [0, 0, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    },
    ao: 0,
    shapes: nodeGroups,
    ip: 0,
    op: OP,
    st: 0,
    bm: 0,
  };

  // núcleo (glow central que late)
  const coreLayer = {
    ddd: 0,
    ty: 4,
    nm: "core",
    sr: 1,
    ks: {
      o: { a: 1, k: [{ t: 0, s: [80] }, { t: OP / 2, s: [40] }, { t: OP, s: [80] }] },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [C, C, 0] },
      a: { a: 0, k: [C, C, 0] },
      s: { a: 1, k: [{ t: 0, s: [100, 100, 100] }, { t: OP / 2, s: [130, 130, 100] }, { t: OP, s: [100, 100, 100] }] },
    },
    ao: 0,
    shapes: [
      { ty: "gr", it: [{ ty: "el", p: { a: 0, k: [C, C] }, s: { a: 0, k: [16, 16] } }, fill(BRAND), trGroup()] },
    ],
    ip: 0,
    op: OP,
    st: 0,
    bm: 0,
  };

  return {
    v: "5.7.6",
    fr: FR,
    ip: 0,
    op: OP,
    w: 400,
    h: 400,
    nm: "web-emblem",
    ddd: 0,
    assets: [],
    layers: [coreLayer, nodesLayer, webLayer],
  };
}

// ===================== SPARKS (partículas en órbita) =====================
function sparks() {
  const N = 14;
  const layers = [];
  for (let i = 0; i < N; i++) {
    const ang = (Math.PI * 2 * i) / N;
    const r = 60 + (i % 3) * 22;
    const x = C + Math.cos(ang) * r;
    const y = C + Math.sin(ang) * r;
    const t0 = Math.round((i / N) * OP);
    const col = i % 3 === 0 ? GLOW : i % 3 === 1 ? WEB : BRAND;
    layers.push({
      ddd: 0,
      ty: 4,
      nm: `s${i}`,
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [0] }, { t: (t0 + 20) % OP, s: [90] }, { t: (t0 + 70) % OP, s: [0] }, { t: OP, s: [0] }].sort((p, q) => p.t - q.t) },
        r: { a: 0, k: 0 },
        p: {
          a: 1,
          k: [
            { t: 0, s: [x, y, 0], i: { x: 0.4, y: 1 }, o: { x: 0.6, y: 0 } },
            { t: OP, s: [C + Math.cos(ang) * (r + 40), C + Math.sin(ang) * (r + 40), 0] },
          ],
        },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [{ ty: "gr", it: [{ ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [5, 5] } }, fill(col), trGroup()] }],
      ip: 0,
      op: OP,
      st: 0,
      bm: 0,
    });
  }
  return { v: "5.7.6", fr: FR, ip: 0, op: OP, w: 400, h: 400, nm: "sparks", ddd: 0, assets: [], layers };
}

fs.writeFileSync(path.join(OUT, "web-emblem.json"), JSON.stringify(webEmblem()));
fs.writeFileSync(path.join(OUT, "sparks.json"), JSON.stringify(sparks()));
console.log("Lottie generado: public/lottie/web-emblem.json, sparks.json");
