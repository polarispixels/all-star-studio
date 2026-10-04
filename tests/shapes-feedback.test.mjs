import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createEmptyShapeFeedback, normalizeShapeFeedback, shapeSummaryText, shapeExportJson, loadShapeFeedback } from '../js/shapes/feedback.js';
import { SHAPES_VERSION, SHAPE_OPTIONS } from '../js/shapes/content.js';

test('empty shape feedback exports nulls and blanks', () => {
  const json = shapeExportJson(createEmptyShapeFeedback());
  assert.equal(json.shapesVersion, SHAPES_VERSION);
  assert.equal(json.favorite, null);
  assert.deepEqual(Object.keys(json.comments), SHAPE_OPTIONS.map((s) => s.id));
  assert.ok(Object.values(json.comments).every((c) => c === ''));
  assert.equal(json.other, '');
});

test('summary says Not answered for a skipped favorite and lists only real notes', () => {
  const text = shapeSummaryText(createEmptyShapeFeedback());
  assert.match(text, /Favorite shape: Not answered/);
  assert.match(text, /Notes on shapes: Not answered/);
  assert.match(text, /Anything else: Not answered/);
  const f = createEmptyShapeFeedback();
  f.favorite = 'plump';
  f.comments.plump = 'A bit rounder';
  f.other = 'Love it';
  const t2 = shapeSummaryText(f);
  assert.match(t2, /Favorite shape: D\. Plump/);
  assert.match(t2, /- D\. Plump: A bit rounder/);
  assert.doesNotMatch(t2, /Classic:/);
  assert.match(t2, /Anything else: Love it/);
});

test('shapes are lettered A, B, C ... in display order', () => {
  assert.deepEqual(SHAPE_OPTIONS.map((s) => s.letter).join(''), 'ABCDEF'.slice(0, SHAPE_OPTIONS.length));
  assert.equal(SHAPE_OPTIONS[0].id, 'classic');
});

test('"None of these yet" is a valid answer', () => {
  const f = normalizeShapeFeedback({ shapesVersion: SHAPES_VERSION, favorite: 'none' });
  assert.equal(f.favorite, 'none');
  assert.match(shapeSummaryText(f), /Favorite shape: None of these yet/);
});

test('normalize drops unknown shapes and clamps text', () => {
  const f = normalizeShapeFeedback({ favorite: 'triangle', comments: { soft: 'x'.repeat(900), hex: 'hi' }, other: 5 });
  assert.equal(f.favorite, null);
  assert.equal(f.comments.soft.length, 500);
  assert.ok(!('hex' in f.comments));
  assert.equal(f.other, '');
});

test('version mismatch starts fresh and keeps the old raw text', () => {
  assert.equal(loadShapeFeedback(null).status, 'empty');
  assert.equal(loadShapeFeedback('{oops').status, 'invalid');
  const ok = loadShapeFeedback(JSON.stringify({ ...createEmptyShapeFeedback(), favorite: 'boxy' }));
  assert.equal(ok.status, 'ok');
  assert.equal(ok.feedback.favorite, 'boxy');
  const old = JSON.stringify({ shapesVersion: '0.1.0', favorite: 'boxy' });
  const mm = loadShapeFeedback(old);
  assert.equal(mm.status, 'mismatch');
  assert.equal(mm.feedback.favorite, null);
  assert.equal(mm.oldRaw, old);
});
