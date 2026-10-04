// Generates the Team Star options that are made by code, all on the house star shape:
//   assets/team/a-rays.svg   copy of the homepage star (ids prefixed team-a-)
//   assets/team/c-mosaic.svg puzzle mosaic: a jigsaw grid with seeded tab directions, clipped to the star
//   assets/team/d-five.svg   five-piece puzzle: one piece per arm, one knob per seam, five-fold symmetric
// Run: node tools/build-team.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { defaultStarPath, starVertices, defaultShape, CENTER } from '../js/star-shape.js';

const OUTLINE = 'fill="none" stroke="#243447" stroke-width="10" stroke-linejoin="round"';
const SEAM = 'fill="none" stroke="#243447" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"';
const r1 = (n) => Math.round(n * 10) / 10;
const pts = (list) => list.map((p) => `${r1(p.x)},${r1(p.y)}`).join(' ');

// Seeded PRNG (mulberry32), so the mosaic is reproducible.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function cubic(p0, p1, p2, p3, n) {
  const out = [];
  for (let i = 1; i <= n; i++) {
    const t = i / n, u = 1 - t;
    out.push({
      x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
      y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
    });
  }
  return out;
}

// Points along a jigsaw edge from a to b (a excluded, b included). sign: +1 knob toward the edge's
// clockwise-side normal, -1 the other way, 0 flat. `height` is the knob height as a fraction of length.
export function jigsawEdge(a, b, sign, height = 0.27) {
  if (!sign) return [b];
  const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy);
  const ux = dx / len, uy = dy / len, nx = -uy * sign, ny = ux * sign;
  const k = height / 0.27;
  const P = (u, v) => ({ x: a.x + ux * u * len + nx * v * k * len, y: a.y + uy * u * len + ny * v * k * len });
  const segs = [
    [P(0, 0), P(0.13, 0), P(0.26, 0), P(0.38, 0)],
    [P(0.38, 0), P(0.42, 0), P(0.43, 0.06), P(0.40, 0.10)],
    [P(0.40, 0.10), P(0.35, 0.18), P(0.42, 0.27), P(0.50, 0.27)],
    [P(0.50, 0.27), P(0.58, 0.27), P(0.65, 0.18), P(0.60, 0.10)],
    [P(0.60, 0.10), P(0.57, 0.06), P(0.58, 0), P(0.62, 0)],
    [P(0.62, 0), P(0.74, 0), P(0.87, 0), P(1, 0)],
  ];
  return segs.flatMap(([p0, p1, p2, p3]) => cubic(p0, p1, p2, p3, 10));
}

const reverseEdge = (a, edgePts) => [...edgePts.slice(0, -1).reverse(), a];

function wrap(id, title, body) {
  const d = defaultStarPath();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" role="img" aria-labelledby="${id}-title">
  <title id="${id}-title">${title}</title>
  <defs>
    <clipPath id="${id}-clip"><path d="${d}"/></clipPath>
  </defs>
  <g clip-path="url(#${id}-clip)">
${body}
  </g>
  <path d="${d}" ${OUTLINE}/>
</svg>
`;
}

// ---------- D: five-piece puzzle ----------

export const FIVE_COLORS = ['#247BA0', '#1FB5C1', '#E0457B', '#F4C95D', '#E8702A'];

// Piece k contains tip k. Seam j runs center -> valley j; its knob points clockwise (into piece j+1).
export function fivePieces() {
  const shape = defaultShape();
  const verts = starVertices(shape.ratio);
  const valleys = [1, 3, 5, 7, 9].map((i) => verts[i]);
  const far = (p, r = 900) => {
    const dx = p.x - CENTER.x, dy = p.y - CENTER.y, l = Math.hypot(dx, dy);
    return { x: CENTER.x + (dx / l) * r, y: CENTER.y + (dy / l) * r };
  };
  const tips = [0, 2, 4, 6, 8].map((i) => verts[i]);
  const seams = valleys.map((v) => jigsawEdge(CENTER, v, 1, 0.34));
  const pieces = tips.map((tip, k) => {
    const prev = (k + 4) % 5;
    return [
      { ...CENTER },
      ...seams[prev],
      far(valleys[prev]),
      far(tip),
      far(valleys[k]),
      { x: valleys[k].x, y: valleys[k].y },
      ...reverseEdge(CENTER, seams[k]).slice(0, -1),
    ];
  });
  // Each piece starts at the center, goes out along its counter-clockwise seam and back along the clockwise one.
  return { pieces, seams };
}

export function buildFive() {
  const { pieces, seams } = fivePieces();
  const body = [
    '    <rect width="1000" height="1000" fill="#FFF6E6"/>',
    ...pieces.map((p, k) => `    <polygon points="${pts(p)}" fill="${FIVE_COLORS[k]}"/>`),
    ...seams.map((s) => `    <polyline points="${pts([CENTER, ...s])}" ${SEAM}/>`),
    `    <circle cx="${CENTER.x}" cy="${CENTER.y}" r="10" fill="#243447"/>`,
  ].join('\n');
  return wrap('team-d', 'All-Stars team star: five puzzle pieces', body);
}

// ---------- C: puzzle mosaic ----------

export const MOSAIC_COLORS = ['#247BA0', '#1FB5C1', '#E8702A', '#F4C95D', '#E0457B', '#4CAF50', '#6B3E75'];
export const MOSAIC_GRID = { x0: 140, y0: 120, cols: 6, rows: 6, w: 120, h: 117, seed: 20261022 };

function insideStar(p) {
  // Point-in-polygon against the classic-ratio vertices of the house shape (close enough for counting).
  const v = starVertices(defaultShape().ratio);
  let inside = false;
  for (let i = 0, j = v.length - 1; i < v.length; j = i++) {
    if ((v[i].y > p.y) !== (v[j].y > p.y) && p.x < ((v[j].x - v[i].x) * (p.y - v[i].y)) / (v[j].y - v[i].y) + v[i].x) inside = !inside;
  }
  return inside;
}

export function mosaicPieces() {
  const { x0, y0, cols, rows, w, h, seed } = MOSAIC_GRID;
  const rand = mulberry32(seed);
  const P = (r, c) => ({ x: x0 + c * w, y: y0 + r * h });
  // Horizontal edge (r, c): P(r,c) -> P(r,c+1). Vertical edge (r, c): P(r,c) -> P(r+1,c). Border edges are flat.
  const hSign = Array.from({ length: rows + 1 }, (_, r) => Array.from({ length: cols }, () => (r === 0 || r === rows ? 0 : rand() < 0.5 ? 1 : -1)));
  const vSign = Array.from({ length: rows }, () => Array.from({ length: cols + 1 }, (_, c) => (c === 0 || c === cols ? 0 : rand() < 0.5 ? 1 : -1)));
  const hEdge = (r, c) => jigsawEdge(P(r, c), P(r, c + 1), hSign[r][c]);
  const vEdge = (r, c) => jigsawEdge(P(r, c), P(r + 1, c), vSign[r][c]);
  const colors = [];
  const pieces = [];
  for (let r = 0; r < rows; r++) {
    colors.push([]);
    for (let c = 0; c < cols; c++) {
      const avoid = new Set([colors[r - 1]?.[c], colors[r][c - 1], colors[r - 1]?.[c + 1]]);
      const choices = MOSAIC_COLORS.filter((x) => !avoid.has(x));
      const color = choices[Math.floor(rand() * choices.length)];
      colors[r].push(color);
      const outline = [
        P(r, c),
        ...hEdge(r, c),
        ...vEdge(r, c + 1),
        ...reverseEdge(P(r + 1, c), hEdge(r + 1, c)),
        ...reverseEdge(P(r, c), vEdge(r, c)),
      ];
      const centerPt = { x: x0 + (c + 0.5) * w, y: y0 + (r + 0.5) * h };
      pieces.push({ r, c, color, outline, visible: insideStar(centerPt) });
    }
  }
  const seams = [];
  for (let r = 1; r < rows; r++) for (let c = 0; c < cols; c++) seams.push([P(r, c), ...hEdge(r, c)]);
  for (let r = 0; r < rows; r++) for (let c = 1; c < cols; c++) seams.push([P(r, c), ...vEdge(r, c)]);
  return { pieces, seams };
}

export function buildMosaic() {
  const { pieces, seams } = mosaicPieces();
  const body = [
    '    <rect width="1000" height="1000" fill="#FFF6E6"/>',
    ...pieces.map((p) => `    <polygon points="${pts(p.outline)}" fill="${p.color}"/>`),
    ...seams.map((s) => `    <polyline points="${pts(s)}" ${SEAM}/>`),
  ].join('\n');
  return wrap('team-c', 'All-Stars team star: puzzle mosaic', body);
}

// ---------- A: homepage star ----------

export function buildRays(root) {
  const src = readFileSync(new URL('assets/star.svg', root), 'utf8');
  return src
    .replace(/\sid="([^"]+)"/g, ' id="team-a-$1"')
    .replace(/url\(#([^)]+)\)/g, 'url(#team-a-$1)')
    .replace(/aria-labelledby="([^"]+)"/g, (m, ids) => `aria-labelledby="${ids.split(/\s+/).map((i) => `team-a-${i}`).join(' ')}"`)
    .replace(/<title([^>]*)>[^<]*<\/title>/, '<title$1>All-Stars team star: colorful rays</title>');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const root = new URL('../', import.meta.url);
  const out = new URL('assets/team/', root);
  mkdirSync(out, { recursive: true });
  writeFileSync(new URL('a-rays.svg', out), buildRays(root));
  writeFileSync(new URL('c-mosaic.svg', out), buildMosaic());
  writeFileSync(new URL('d-five.svg', out), buildFive());
  const vis = mosaicPieces().pieces.filter((p) => p.visible).length;
  console.log(`wrote a-rays.svg, c-mosaic.svg (${vis} pieces mostly inside), d-five.svg`);
}
