// QR de marcador (falso pero realista): finder patterns en 3 esquinas, timing
// patterns y módulos pseudoaleatorios deterministas (no parpadea entre renders).
// Reemplázalo el día del estreno por el QR real:  <img src="/qr-real.png" />
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// color: rojo oscuro por defecto (buen contraste sobre fondo claro → escaneable).
// bg debe ser claro. Para el QR REAL usa color oscuro (#9E141A o #000) sobre blanco.
export default function FakeQR({
  size = 132,
  seed = 731,
  className = "",
  color = "#9E141A",
  bg = "#FFFFFF",
}) {
  const N = 25; // módulos por lado
  const rand = mulberry32(seed);

  const inBox = (r, c, R, C) => r >= R && r < R + 7 && c >= C && c < C + 7;
  const isFinderZone = (r, c) =>
    inBox(r, c, 0, 0) || inBox(r, c, 0, N - 7) || inBox(r, c, N - 7, 0);

  const finderOn = (r, c) => {
    let R = 0,
      C = 0;
    if (r < 7 && c >= N - 7) C = N - 7;
    else if (r >= N - 7 && c < 7) R = N - 7;
    const x = c - C,
      y = r - R;
    const border = x === 0 || x === 6 || y === 0 || y === 6;
    const center = x >= 2 && x <= 4 && y >= 2 && y <= 4;
    return border || center;
  };

  const cells = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      let on;
      if (isFinderZone(r, c)) on = finderOn(r, c);
      else if (r === 6 || c === 6) on = (r + c) % 2 === 0; // timing patterns
      else on = rand() > 0.52;
      if (on) cells.push(<rect key={`${r}-${c}`} x={c} y={r} width={1.02} height={1.02} />);
    }
  }

  const q = 2; // quiet zone
  return (
    <svg
      viewBox={`${-q} ${-q} ${N + q * 2} ${N + q * 2}`}
      width={size}
      height={size}
      className={className}
      shapeRendering="crispEdges"
      role="img"
      aria-label="Código QR de la entrada (de ejemplo)"
    >
      <rect x={-q} y={-q} width={N + q * 2} height={N + q * 2} fill={bg} />
      <g fill={color}>{cells}</g>
    </svg>
  );
}
