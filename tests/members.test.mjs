import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { ROSTER, findMember, NEW_ID } from '../js/members/roster.js';
import { changeRequestText, newStarRequestText, LIMITS } from '../js/members/request.js';
import { checkSvg } from './check-svgs.mjs';

test('roster ids are unique, url-safe, and not reserved', () => {
  const ids = ROSTER.map((m) => m.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ids) assert.match(id, /^[a-z0-9-]+$/);
  assert.ok(!ids.includes(NEW_ID));
});

test('roster uses first names only (no surnames)', () => {
  for (const m of ROSTER.filter((x) => !x.placeholder)) assert.match(m.name, /^[A-Z][a-z]+$/, m.name);
});

for (const m of ROSTER) {
  test(`member star ${m.id} exists and uses the house silhouette`, () => {
    const url = new URL(`../assets/members/${m.id}.svg`, import.meta.url);
    assert.ok(existsSync(url), `missing assets/members/${m.id}.svg`);
    assert.deepEqual(checkSvg(readFileSync(url, 'utf8')), []);
  });
}

test('renamed members keep their old links', () => {
  assert.equal(findMember('quick-response')?.id, 'dixie');
  const all = ROSTER.flatMap((m) => [m.id, ...(m.aliases ?? [])]);
  assert.equal(new Set(all).size, all.length, 'ids and aliases must not collide');
});

test('change request names the member, star version, and request', () => {
  const text = changeRequestText(findMember('becky'), '  Make the lake turquoise  ');
  assert.equal(text, 'All-Star Studio: star change request\nFor: Becky\nStar: becky (version 1)\n\nRequest:\nMake the lake turquoise\n');
});

test('empty requests produce nothing to send', () => {
  assert.equal(changeRequestText(findMember('scott'), '   '), null);
  assert.equal(newStarRequestText('', 'idea'), null);
  assert.equal(newStarRequestText('Pat', ' '), null);
});

test('request text is bounded', () => {
  const long = changeRequestText(findMember('scott'), 'x'.repeat(5000));
  assert.ok(long.includes('x'.repeat(LIMITS.request)) && !long.includes('x'.repeat(LIMITS.request + 1)));
  const n = newStarRequestText('A'.repeat(100), 'Hiking');
  assert.ok(n.includes(`Name: ${'A'.repeat(LIMITS.name)}\n`));
});

test('new star request includes name and idea', () => {
  assert.equal(newStarRequestText(' Pat ', 'A lighthouse'), 'All-Star Studio: new star request\nName: Pat\n\nIdea:\nA lighthouse\n');
});
