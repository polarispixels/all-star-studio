// Validates prototype SVGs: self-contained, house star silhouette, every url(#id)/href="#id" resolves.
// Usage: node tests/check-svgs.mjs [file.svg ...]   (defaults to all of assets/prototypes/*.svg)
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { defaultStarPath } from '../js/star-shape.js';

export const STAR_PATH = defaultStarPath();

export function checkSvg(src, { sharedStar = true } = {}) {
  const errors = [];
  if (!/<svg[^>]*viewBox="0 0 1000 1000"/.test(src)) errors.push('viewBox must be "0 0 1000 1000"');
  if (!/<title[^>]*>[^<]+<\/title>/.test(src)) errors.push('missing <title>');
  if (sharedStar && !src.includes(`d="${STAR_PATH}"`)) errors.push('house star silhouette (default shape path) not found: run node tools/apply-default-shape.mjs');
  if (/<script|<image|<foreignObject|<text|<style[^>]*>[^<]*@import/i.test(src)) errors.push('contains script, image, foreignObject, text, or @import');
  if (/(?:href|src)="(?!#)[^"]+"/.test(src.replace(/xmlns(:\w+)?="[^"]*"/g, ''))) errors.push('external href/src reference');
  if (/url\((?!#)/.test(src)) errors.push('url() not pointing to a local #id');
  if (/Gradient/.test(src)) errors.push('gradients are not allowed in this iteration');
  const ids = [...src.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dup.length) errors.push(`duplicate ids: ${[...new Set(dup)].join(', ')}`);
  const refs = [...src.matchAll(/url\(#([^)]+)\)|href="#([^"]+)"/g)].map((m) => m[1] || m[2]);
  for (const r of new Set(refs)) if (!ids.includes(r)) errors.push(`reference to undefined id #${r}`);
  return errors;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dir = new URL('../assets/prototypes/', import.meta.url).pathname;
  const files = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync(dir).filter((f) => f.endsWith('.svg')).map((f) => join(dir, f));
  let bad = 0;
  for (const f of files) {
    const errs = checkSvg(readFileSync(f, 'utf8'), { sharedStar: !f.includes('/shapes/') });
    console.log(`${errs.length ? 'FAIL' : 'ok  '} ${f}${errs.map((e) => `\n     - ${e}`).join('')}`);
    bad += errs.length ? 1 : 0;
  }
  if (!files.length) { console.log('no SVG files found'); process.exit(1); }
  process.exit(bad ? 1 : 0);
}
