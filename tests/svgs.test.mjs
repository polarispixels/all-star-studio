import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { checkSvg } from './check-svgs.mjs';
import { allDesigns } from '../js/designs/content.js';

for (const d of allDesigns()) {
  test(`prototype SVG ${d.id} is self-contained and valid`, () => {
    const src = readFileSync(new URL(`../assets/prototypes/${d.id}.svg`, import.meta.url), 'utf8');
    assert.deepEqual(checkSvg(src), []);
  });
}
