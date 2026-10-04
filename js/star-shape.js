// Star silhouette geometry: five-point stars with rounded (fillet) or flattened (chamfer) corners.
// Shared by the shape generator (tools/build-shapes.mjs) and later member/team stars.
// All shapes use a 0 0 1000 1000 viewBox centered at (500, 500) with outer radius 440.
// DEFAULT_SHAPE_ID is the house silhouette (chosen 2026-10-04): every star artwork uses it.

export const CENTER = { x: 500, y: 500 };
export const OUTER_RADIUS = 440;

export const DEFAULT_SHAPE_ID = 'blend';

export const SHAPES = [
  { id: 'classic', name: 'Classic', ratio: 0.45, tip: 0, valley: 0 },
  { id: 'soft', name: 'Softened points', ratio: 0.45, tip: 34, valley: 22 },
  { id: 'chunky', name: 'Chunky and round', ratio: 0.48, tip: 95, valley: 40 },
  { id: 'plump', name: 'Plump', ratio: 0.56, tip: 70, valley: 34 },
  { id: 'boxy', name: 'Squared-off', ratio: 0.5, tip: 18, valley: 16, chamfer: 100 },
  { id: 'blend', name: 'Squared and softened', ratio: 0.5, tip: 30, valley: 30, chamfer: 70 },
];

const round = (n) => Math.round(n * 10) / 10;

// Ten alternating outer/inner vertices, clockwise from the top point.
export function starVertices(ratio, radius = OUTER_RADIUS, center = CENTER) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = ((-90 + i * 36) * Math.PI) / 180;
    const r = i % 2 === 0 ? radius : radius * ratio;
    pts.push({ x: center.x + r * Math.cos(a), y: center.y + r * Math.sin(a), outer: i % 2 === 0 });
  }
  return pts;
}

// Replace each outer tip with two points `size` along its edges, giving a flat end.
function chamferTips(pts, size) {
  const out = [];
  pts.forEach((p, i) => {
    if (!p.outer) { out.push(p); return; }
    for (const n of [pts[(i + 9) % 10], pts[(i + 1) % 10]]) {
      const dx = n.x - p.x, dy = n.y - p.y, len = Math.hypot(dx, dy);
      out.push({ x: p.x + (dx / len) * size, y: p.y + (dy / len) * size, outer: true });
    }
  });
  return out;
}

// SVG path for a closed polygon with a circular fillet of radii[i] at each vertex.
export function roundedPath(pts, radii) {
  const n = pts.length;
  const parts = [];
  for (let i = 0; i < n; i++) {
    const v = pts[i], p = pts[(i + n - 1) % n], q = pts[(i + 1) % n];
    const r = radii[i];
    if (!r) { parts.push(`${i ? 'L' : 'M'}${round(v.x)},${round(v.y)}`); continue; }
    const l1 = Math.hypot(p.x - v.x, p.y - v.y), l2 = Math.hypot(q.x - v.x, q.y - v.y);
    const u1 = { x: (p.x - v.x) / l1, y: (p.y - v.y) / l1 };
    const u2 = { x: (q.x - v.x) / l2, y: (q.y - v.y) / l2 };
    const theta = Math.acos(Math.max(-1, Math.min(1, u1.x * u2.x + u1.y * u2.y)));
    const d = Math.min(r / Math.tan(theta / 2), 0.45 * Math.min(l1, l2));
    const rr = d * Math.tan(theta / 2);
    const t1 = { x: v.x + u1.x * d, y: v.y + u1.y * d };
    const t2 = { x: v.x + u2.x * d, y: v.y + u2.y * d };
    const cross = (v.x - p.x) * (q.y - v.y) - (v.y - p.y) * (q.x - v.x);
    parts.push(`${i ? 'L' : 'M'}${round(t1.x)},${round(t1.y)}`);
    parts.push(`A${round(rr)},${round(rr)} 0 0 ${cross > 0 ? 1 : 0} ${round(t2.x)},${round(t2.y)}`);
  }
  return parts.join(' ') + ' Z';
}

// `scale` shrinks or grows the whole silhouette about the center (corners scale with it).
export function shapePath(shape, scale = 1) {
  let pts = starVertices(shape.ratio, OUTER_RADIUS * scale);
  if (shape.chamfer) pts = chamferTips(pts, shape.chamfer * scale);
  return roundedPath(pts, pts.map((p) => (p.outer ? shape.tip : shape.valley) * scale));
}

export const defaultShape = () => SHAPES.find((s) => s.id === DEFAULT_SHAPE_ID);
export const defaultStarPath = (scale = 1) => shapePath(defaultShape(), scale);
