// Generates assets/shapes/<id>.svg (plain silhouette) and <id>-kayak.svg (Becky's kayak scene on that shape).
// Run: node tools/build-shapes.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { SHAPES, shapePath } from '../js/star-shape.js';

const root = new URL('../', import.meta.url);
const outDir = new URL('assets/shapes/', root);
mkdirSync(outDir, { recursive: true });

const OUTLINE = 'fill="none" stroke="#243447" stroke-width="10" stroke-linejoin="round"';
const kayak = readFileSync(new URL('assets/prototypes/outdoors-illustrated.svg', root), 'utf8');
const art = kayak.match(/<g clip-path="url\(#outdoors-illustrated-clip\)">([\s\S]*?)\n  <\/g>/)[1];

for (const s of SHAPES) {
  const d = shapePath(s);
  const plain = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" role="img" aria-labelledby="shape-${s.id}-title">
  <title id="shape-${s.id}-title">Star shape: ${s.name}</title>
  <path d="${d}" fill="#F4C95D" stroke="#243447" stroke-width="10" stroke-linejoin="round"/>
</svg>
`;
  const filled = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" role="img" aria-labelledby="shape-${s.id}-kayak-title">
  <title id="shape-${s.id}-kayak-title">Becky's kayak star on the ${s.name} shape</title>
  <defs>
    <clipPath id="shape-${s.id}-kayak-clip"><path d="${d}"/></clipPath>
  </defs>
  <g clip-path="url(#shape-${s.id}-kayak-clip)">${art}
  </g>
  <path d="${d}" ${OUTLINE}/>
</svg>
`;
  writeFileSync(new URL(`${s.id}.svg`, outDir), plain);
  writeFileSync(new URL(`${s.id}-kayak.svg`, outDir), filled);
  console.log(`wrote ${s.id}.svg, ${s.id}-kayak.svg`);
}
