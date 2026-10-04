import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { TEAM_OPTIONS, TEAM_VERSION } from '../js/team/content.js';
import { teamModel } from '../js/team/feedback.js';
import { fivePieces, mosaicPieces, buildFive, buildMosaic, buildRays } from '../tools/build-team.mjs';
import { checkSvg } from './check-svgs.mjs';

const root = new URL('../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');

test('team options are lettered A, B, C, D in order', () => {
  assert.equal(TEAM_OPTIONS.map((o) => o.letter).join(''), 'ABCD');
});

for (const o of TEAM_OPTIONS) {
  test(`team option ${o.letter} (${o.id}) is a valid house-shape SVG`, () => {
    const url = new URL(`assets/team/${o.id}.svg`, root);
    assert.ok(existsSync(url), `missing assets/team/${o.id}.svg`);
    assert.deepEqual(checkSvg(readFileSync(url, 'utf8')), []);
  });
}

test('generated team options are up to date (run node tools/build-team.mjs)', () => {
  assert.equal(read('assets/team/a-rays.svg'), buildRays(root));
  assert.equal(read('assets/team/c-mosaic.svg'), buildMosaic());
  assert.equal(read('assets/team/d-five.svg'), buildFive());
});

test('option D is five-fold symmetric: each piece is the previous one turned 72 degrees', () => {
  const { pieces } = fivePieces();
  const turn = (p) => {
    const a = (72 * Math.PI) / 180, dx = p.x - 500, dy = p.y - 500;
    return { x: 500 + dx * Math.cos(a) - dy * Math.sin(a), y: 500 + dx * Math.sin(a) + dy * Math.cos(a) };
  };
  for (let k = 0; k < 5; k++) {
    const turned = pieces[k].map(turn), next = pieces[(k + 1) % 5];
    assert.equal(turned.length, next.length);
    turned.forEach((p, i) => assert.ok(Math.hypot(p.x - next[i].x, p.y - next[i].y) < 0.01, `piece ${k} point ${i}`));
  }
});

test('option C has 15-25 pieces inside the star, no two side neighbors the same color', () => {
  const { pieces } = mosaicPieces();
  const n = pieces.filter((p) => p.visible).length;
  assert.ok(n >= 15 && n <= 25, `got ${n}`);
  const at = (r, c) => pieces.find((p) => p.r === r && p.c === c);
  for (const p of pieces) {
    if (at(p.r, p.c + 1)) assert.notEqual(p.color, at(p.r, p.c + 1).color);
    if (at(p.r + 1, p.c)) assert.notEqual(p.color, at(p.r + 1, p.c).color);
  }
});

test('team feedback summary uses option letters and marks skips', () => {
  const f = teamModel.createEmpty();
  assert.match(teamModel.summaryText(f), /Favorite option: Not answered/);
  f.favorite = 'd-five';
  f.comments['c-mosaic'] = 'Fewer pieces';
  const t = teamModel.summaryText(f);
  assert.match(t, /Favorite option: D\. Five-piece puzzle/);
  assert.match(t, /- C\. Puzzle mosaic: Fewer pieces/);
  assert.equal(teamModel.exportJson(f).teamVersion, TEAM_VERSION);
});

test('team feedback ignores unknown options and starts fresh on version change', () => {
  assert.equal(teamModel.normalize({ favorite: 'z-nope' }).favorite, null);
  const mm = teamModel.load(JSON.stringify({ teamVersion: '0.0.1', favorite: 'a-rays' }));
  assert.equal(mm.status, 'mismatch');
  assert.equal(mm.feedback.favorite, null);
});
