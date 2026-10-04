import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { checkSvg } from './check-svgs.mjs';
import { allDesigns } from '../js/designs/content.js';
import { SHAPES, shapePath } from '../js/star-shape.js';

for (const d of allDesigns()) {
  test(`prototype SVG ${d.id} is self-contained and valid`, () => {
    const src = readFileSync(new URL(`../assets/prototypes/${d.id}.svg`, import.meta.url), 'utf8');
    assert.deepEqual(checkSvg(src), []);
  });
}

for (const shape of SHAPES) {
  for (const file of [`${shape.id}.svg`, `${shape.id}-kayak.svg`]) {
    test(`shape SVG ${file} is valid and matches the generator`, () => {
      const src = readFileSync(new URL(`../assets/shapes/${file}`, import.meta.url), 'utf8');
      assert.deepEqual(checkSvg(src, { sharedStar: false }), []);
      assert.ok(src.includes(`d="${shapePath(shape)}"`), 'out of date: run node tools/build-shapes.mjs');
    });
  }
}

test('homepage star uses the house silhouette', () => {
  const src = readFileSync(new URL('../assets/star.svg', import.meta.url), 'utf8');
  assert.deepEqual(checkSvg(src), []);
});

test('classic shape path traces the original star polygon', () => {
  const classic = SHAPES.find((s) => s.id === 'classic');
  assert.match(shapePath(classic), /^M500,60 L616\.4,339\.8/);
});
