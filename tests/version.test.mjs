// Keeps APP_VERSION, the newest CHANGELOG release, and the docs badge in sync.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { APP_VERSION } from '../js/version.js';

const root = new URL('../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');

test('APP_VERSION is plain SemVer', () => {
  assert.match(APP_VERSION, /^\d+\.\d+\.\d+$/);
});

test('newest CHANGELOG release matches APP_VERSION', () => {
  const m = read('CHANGELOG.md').match(/^## \[(\d+\.\d+\.\d+)\] - \d{4}-\d{2}-\d{2}$/m);
  assert.ok(m, 'no released version heading found in CHANGELOG.md');
  assert.equal(m[1], APP_VERSION);
});

test('CHANGELOG has a compare link for APP_VERSION', () => {
  assert.ok(read('CHANGELOG.md').includes(`[${APP_VERSION}]: https://github.com/`));
});

test('docs badge matches APP_VERSION', () => {
  const m = read('docs/index.html').match(/data-docs-version>v(\d+\.\d+\.\d+)</);
  assert.ok(m, 'no version badge found in docs/index.html');
  assert.equal(m[1], APP_VERSION);
});

test('homepage loads the version stamp', () => {
  const html = read('index.html');
  assert.ok(html.includes('data-app-version'));
  assert.ok(html.includes('./js/version.js'));
});
