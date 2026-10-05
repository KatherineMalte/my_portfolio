/**
 * Geometría pura del avatar (sin Angular): dado el estado de la cara
 * devuelve todos los paths del SVG. Así el componente queda mínimo.
 */

export interface FaceState {
  /** -1 (izquierda) … 1 (derecha): hacia dónde mira */
  lookX: number;
  /** -1 (arriba) … 1 (abajo) */
  lookY: number;
  /** 0 (neutra) … 1 (risa amplia con dientes) */
  smile: number;
  /** 0 (ojos abiertos) … 1 (ojos cerrados) */
  blink: number;
}

interface Pt {
  x: number;
  y: number;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const n = (v: number) => String(Math.round(v * 100) / 100);
const P = (x: number, y: number) => `${n(x)} ${n(y)}`;

/** Punto de una curva cuadrática en t (0..1) */
function quad(p0: Pt, c: Pt, p2: Pt, t: number): Pt {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * c.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * c.y + t * t * p2.y,
  };
}

/* ───────────────────────── OJOS ───────────────────────── */

function buildEye(cx: number, cy: number, side: 1 | -1, st: FaceState) {
  // side: -1 = ojo izquierdo (esquina externa a la izquierda), 1 = derecho
  const open = (1 - st.blink) * (1 - 0.2 * st.smile); // al sonreír se entrecierran un poco

  const outer: Pt = { x: cx + side * 13, y: cy - 1 };
  const inner: Pt = { x: cx - side * 12, y: cy + 1 };
  const up: Pt = { x: cx - side * 1.5, y: cy - 13.5 * open };
  const low: Pt = { x: cx - side * 0.5, y: cy + (7 - 4.4 * st.smile) * open }; // mejilla sube con la sonrisa

  const upper = `M${P(outer.x, outer.y)} Q${P(up.x, up.y)} ${P(inner.x, inner.y)}`;
  const lower = `M${P(inner.x, inner.y)} Q${P(low.x, low.y)} ${P(outer.x, outer.y)}`;
  const shape = `${upper} Q${P(low.x, low.y)} ${P(outer.x, outer.y)} Z`;

  // pliegue del párpado
  const crease = `M${P(cx + side * 11, cy - 4)} Q${P(cx - side * 1, cy - 13 * open - 3.4)} ${P(cx - side * 10, cy - 3.5)}`;

  // pestañas (apuntan hacia abajo cuando el ojo está cerrado)
  const lashDir = clamp(open * 2 - 1, -1, 1);
  const lashes = [
    [0.03, 2.4, 3.0],
    [0.12, 1.8, 3.4],
    [0.22, 1.1, 3.4],
    [0.33, 0.5, 3.0],
  ]
    .map(([t, dx, dy]) => {
      const p = quad(outer, up, inner, t);
      return `M${P(p.x, p.y)} l${n(side * dx)} ${n(-dy * lashDir)}`;
    })
    .join(' ');

  // ojera / bolsa que sube con la sonrisa
  const bagY = cy + 11.5;
  const bag = `M${P(cx - 8, bagY)} Q${P(cx, bagY + 2.4 - st.smile * 2.2)} ${P(cx + 8, bagY)}`;

  return {
    upper,
    lower,
    shape,
    crease,
    creaseOpacity: clamp(open, 0, 1),
    lashes,
    bag,
    bagOpacity: 0.2 + st.smile * 0.4,
    irisX: cx + st.lookX * 3.2,
    irisY: cy - 0.5 + st.lookY * 1.6,
  };
}

/* ───────────────────────── CEJAS ───────────────────────── */

function buildBrow(side: 1 | -1, st: FaceState) {
  const raise = st.smile * 1.8 + clamp(-st.lookY, 0, 1) * 1.8;
  const lower = clamp(st.lookY, 0, 1) * 0.8;

  const outer: Pt = { x: 160 + side * 34, y: 167 - raise * 0.7 + lower };
  const inner: Pt = { x: 160 + side * 7, y: 164 - raise + lower };
  const ctrl: Pt = { x: 160 + side * 22, y: 155 - raise * 1.3 + lower };

  const main = `M${P(outer.x, outer.y)} Q${P(ctrl.x, ctrl.y)} ${P(inner.x, inner.y)}`;

  // vellos de la ceja
  const hairs = [0.08, 0.22, 0.36, 0.5, 0.64, 0.78, 0.92]
    .map((t) => {
      const p = quad(outer, ctrl, inner, t);
      return `M${P(p.x, p.y + 1.3)} l${n(-side * -2.6)} ${n(-2.3)}`;
    })
    .join(' ');

  return { main, hairs };
}

/* ───────────────────────── BOCA ───────────────────────── */

function buildMouth(s: number) {
  const cy = 245;
  const w = 14 + s * 5; // media anchura
  const lift = s * 4.5; // comisuras suben
  const lx = 160 - w;
  const rx = 160 + w;
  const ey = cy - lift;

  const open = Math.max(0, s - 0.35) * 10.5; // apertura (dientes) a partir de ~35 %
  const seamCtrl = cy + 1 + s * 7;
  const seamMid = 0.5 * ey + 0.5 * seamCtrl;

  // labio superior (arco de cupido)
  const topY = seamMid - 5.5;
  const upperLip =
    `M${P(lx, ey)} Q${P(160 - w * 0.5, topY + 2)} ${P(155.5, topY)} ` +
    `Q${P(160, topY + 2.6)} ${P(164.5, topY)} ` +
    `Q${P(160 + w * 0.5, topY + 2)} ${P(rx, ey)}`;

  // línea de unión de los labios
  const seam = `M${P(lx, ey)} Q${P(160, seamCtrl)} ${P(rx, ey)}`;

  // labio inferior
  const target = seamMid + open + 6.5;
  const llY = ey + 2.5;
  const lowerLip = `M${P(lx + 5, llY)} Q${P(160, 2 * target - llY)} ${P(rx - 5, llY)}`;
  const lowerHighlight = `M${P(153, target - 3)} Q${P(160, target - 1.2)} ${P(167, target - 3)}`;
  const chinCrease = `M${P(154, target + 5)} Q${P(160, target + 7)} ${P(166, target + 5)}`;

  // interior de la boca y dientes
  const openShape = `M${P(lx, ey)} Q${P(160, seamCtrl)} ${P(rx, ey)} Q${P(160, seamCtrl + 2 * open)} ${P(lx, ey)} Z`;
  const biteCtrl = seamCtrl + 2 * open * 0.85; // los dientes ocupan casi toda la apertura
  const teethShape = `M${P(lx, ey)} Q${P(160, seamCtrl)} ${P(rx, ey)} Q${P(160, biteCtrl)} ${P(lx, ey)} Z`;

  let teethLines = '';
  for (let k = -4; k <= 4; k++) {
    const x = 160 + k * w * 0.2;
    const t = (x - lx) / (rx - lx);
    const ySeam = ey + 2 * t * (1 - t) * (seamCtrl - ey);
    const yBite = ey + 2 * t * (1 - t) * (biteCtrl - ey);
    teethLines += `M${P(x, ySeam)} L${P(x, yBite)} `;
  }

  // hoyuelos en las comisuras
  const creaseL = `M${P(lx - 3.5, ey - 3)} Q${P(lx - 6, ey)} ${P(lx - 3.5, ey + 3)}`;
  const creaseR = `M${P(rx + 3.5, ey - 3)} Q${P(rx + 6, ey)} ${P(rx + 3.5, ey + 3)}`;

  return {
    upperLip,
    seam,
    lowerLip,
    lowerHighlight,
    chinCrease,
    openShape,
    teethShape,
    teethLines,
    openOpacity: clamp((open - 0.1) / 0.8, 0, 1),
    creaseL,
    creaseR,
    creaseOpacity: clamp((s - 0.2) * 1.5, 0, 1),
  };
}

/* ───────────────────────── TODO JUNTO ───────────────────────── */

export function buildFace(input: FaceState) {
  const st: FaceState = {
    lookX: clamp(input.lookX, -1, 1),
    lookY: clamp(input.lookY, -1, 1),
    smile: clamp(input.smile, 0, 1),
    blink: clamp(input.blink, 0, 1),
  };

  return {
    // la cabeza gira y se desplaza un poco hacia el cursor
    head: `rotate(${n(st.lookX * 2.4)} 160 295) translate(${n(st.lookX * 1.6)} ${n(st.lookY * 0.9)})`,

    // parallax: los rasgos se deslizan un poco más que el contorno
    shiftEyes: `translate(${n(st.lookX * 0.8)} ${n(st.lookY * 0.4)})`,
    shiftNose: `translate(${n(st.lookX * 1.4)} ${n(st.lookY * 0.5)})`,
    shiftMouth: `translate(${n(st.lookX * 0.9)} ${n(st.lookY * 0.3)})`,

    leftEye: buildEye(140, 181, -1, st),
    rightEye: buildEye(180, 181, 1, st),
    leftBrow: buildBrow(-1, st),
    rightBrow: buildBrow(1, st),
    mouth: buildMouth(st.smile),

    nasoOpacity: 0.1 + st.smile * 0.55,
    mole: { x: 188 + st.smile * 0.8, y: 226 - st.smile * 1.2 },
  };
}

export type Face = ReturnType<typeof buildFace>;