// Re-shapes star artwork to the house silhouette (DEFAULT_SHAPE_ID in js/star-shape.js).
// Converts star outlines to the default shape at the same size:
//  - any <polygon> forming a classic five-point star centered at (500,500), at any size;
//  - any path d="..." that is exactly one of the SHAPES paths at a known scale (so switching the
//    house shape later re-shapes everything again).
// Clip paths, outlines and inner frames all follow. Idempotent.
// Run: node tools/apply-default-shape.mjs [files...]   (defaults to assets/star.svg + assets/prototypes/*.svg)
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { starVertices, defaultStarPath, shapePath, OUTER_RADIUS, SHAPES } from '../js/star-shape.js';

// Scales used for star outlines so far: full size, and the Support designs' inner frame (369.6 / 440).
const KNOWN_SCALES = [1, 0.84];

const classicRatio = SHAPES.find((s) => s.id === 'classic').ratio;

function classicScale(pointsAttr) {
  const pts = pointsAttr.trim().split(/\s+/).map((p) => p.split(',').map(Number));
  if (pts.length !== 10 || pts.some((p) => p.length !== 2 || p.some(Number.isNaN))) return null;
  const r = 500 - pts[0][1];
  if (Math.abs(pts[0][0] - 500) > 0.5 || r <= 0) return null;
  const ideal = starVertices(classicRatio, r);
  const fits = ideal.every((v, i) => Math.hypot(v.x - pts[i][0], v.y - pts[i][1]) < 1);
  return fits ? r / OUTER_RADIUS : null;
}

export function applyDefaultShape(src) {
  let count = 0;
  const out = src.replace(/<polygon points="([^"]+)"/g, (m, pts) => {
    const scale = classicScale(pts);
    if (scale === null) return m;
    count++;
    return `<path d="${defaultStarPath(Math.round(scale * 10000) / 10000)}"`;
  });
  const target = new Map(KNOWN_SCALES.map((k) => [k, defaultStarPath(k)]));
  const known = new Map();
  for (const shape of SHAPES) for (const k of KNOWN_SCALES) known.set(shapePath(shape, k), k);
  const out2 = out.replace(/ d="([^"]+)"/g, (m, d) => {
    if (!known.has(d)) return m;
    const next = target.get(known.get(d));
    if (next !== d) count++;
    return ` d="${next}"`;
  });
  return { out: out2, count };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const root = new URL('../', import.meta.url);
  const files = process.argv.slice(2).length ? process.argv.slice(2)
    : ['assets/star.svg', ...readdirSync(new URL('assets/prototypes/', root)).filter((f) => f.endsWith('.svg')).map((f) => `assets/prototypes/${f}`)];
  for (const f of files) {
    const path = new URL(f, root);
    const { out, count } = applyDefaultShape(readFileSync(path, 'utf8'));
    writeFileSync(path, out);
    console.log(`${count ? 'reshaped' : 'unchanged'} ${f}${count ? ` (${count} star outline${count > 1 ? 's' : ''})` : ''}`);
  }
}
