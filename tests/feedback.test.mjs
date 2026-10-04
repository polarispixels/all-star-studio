import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createEmptyFeedback, normalizeFeedback, visibleFollowUps, outdoorMostChoices,
  toExportJson, toSummaryText, loadCompatible, answeredThemeCount,
} from '../js/designs/feedback.js';
import { PROTOTYPE_VERSION } from '../js/designs/content.js';

test('empty feedback matches the brief shape with nothing answered', () => {
  const json = toExportJson(createEmptyFeedback());
  assert.equal(json.schemaVersion, 1);
  assert.equal(json.prototypeVersion, PROTOTYPE_VERSION);
  assert.deepEqual(json.themePreferences, {
    outdoors: { choice: null, comment: '' },
    support: { choice: null, comment: '' },
    'quick-response': { choice: null, comment: '' },
    phoenix: { choice: null, comment: '' },
  });
  assert.deepEqual(json.answers, {
    favorite_design: null, overall_direction: null, detail_level: null, boundary: null,
    color_control: null, starting_method: null, use_context: [], open_feedback: '',
  });
  assert.deepEqual(json.followUps, {});
});

test('summary marks every skipped item "Not answered"', () => {
  const text = toSummaryText(createEmptyFeedback());
  assert.equal((text.match(/Not answered/g) || []).length, 4 + 8);
  assert.doesNotMatch(text, /null|undefined/);
});

test('summary reports actual choices and comments', () => {
  const f = createEmptyFeedback();
  f.themePreferences.support = { choice: 'illustrated', comment: 'Make the ribbon bigger' };
  f.answers.favorite_design = 'phoenix-illustrated';
  f.answers.use_context = ['shirt', 'badge'];
  const text = toSummaryText(f);
  assert.match(text, /Support and Care: Pictures and symbols/);
  assert.match(text, /Make the ribbon bigger/);
  assert.match(text, /Phoenix Rising: Pictures and symbols/);
  assert.match(text, /Button or badge, Shirt/);
});

test('follow-ups appear only when triggered', () => {
  const f = createEmptyFeedback();
  assert.deepEqual(visibleFollowUps(f), []);
  f.answers.favorite_design = 'outdoors-abstract';
  assert.deepEqual(visibleFollowUps(f), ['outdoor_recognizable']);
  f.followUps.outdoor_recognizable = ['kayaking', 'skiing'];
  assert.deepEqual(visibleFollowUps(f), ['outdoor_recognizable', 'outdoor_most']);
  f.answers.overall_direction = 'mix';
  f.answers.use_context = ['contest', 'other'];
  assert.deepEqual(visibleFollowUps(f), ['outdoor_recognizable', 'outdoor_most', 'picture_feel', 'use_context_other', 'contest_rules']);
  f.answers.overall_direction = 'abstract';
  assert.ok(!visibleFollowUps(f).includes('picture_feel'));
});

test('"which matters most" only offers checked activities', () => {
  const f = createEmptyFeedback();
  f.followUps.outdoor_recognizable = ['camping', 'snorkeling'];
  assert.deepEqual(outdoorMostChoices(f).map((c) => c.id), ['camping', 'snorkeling']);
});

test('hidden follow-ups are kept in state but left out of exports', () => {
  const f = createEmptyFeedback();
  f.answers.favorite_design = 'outdoors-illustrated';
  f.followUps.outdoor_recognizable = ['kayaking'];
  f.followUps.contest_rules = 'Must be round';
  let json = toExportJson(f);
  assert.deepEqual(json.followUps, { outdoor_recognizable: ['kayaking'] });
  f.answers.favorite_design = 'phoenix-abstract';
  json = toExportJson(f);
  assert.deepEqual(json.followUps, {});
  assert.deepEqual(f.followUps.outdoor_recognizable, ['kayaking']);
  assert.doesNotMatch(toSummaryText(f), /Must be round/);
});

test('a stale "matters most" answer is not exported', () => {
  const f = createEmptyFeedback();
  f.answers.favorite_design = 'outdoors-abstract';
  f.followUps.outdoor_recognizable = ['kayaking', 'skiing'];
  f.followUps.outdoor_most = 'camping';
  assert.equal(toExportJson(f).followUps.outdoor_most, null);
});

test('normalize drops unknown values and clamps text', () => {
  const f = normalizeFeedback({
    prototypeVersion: PROTOTYPE_VERSION,
    themePreferences: { outdoors: { choice: 'bogus', comment: 'x'.repeat(900) }, evil: { choice: 'mix' } },
    answers: { favorite_design: 'not-a-design', use_context: ['shirt', 'shirt', 'rocket'], detail_level: 'rich', open_feedback: 42 },
    followUps: { picture_feel: 'clean', outdoor_recognizable: ['kayaking', '<script>'] },
  });
  assert.equal(f.themePreferences.outdoors.choice, null);
  assert.equal(f.themePreferences.outdoors.comment.length, 500);
  assert.ok(!('evil' in f.themePreferences));
  assert.equal(f.answers.favorite_design, null);
  assert.deepEqual(f.answers.use_context, ['shirt']);
  assert.equal(f.answers.detail_level, 'rich');
  assert.equal(f.answers.open_feedback, '');
  assert.equal(f.followUps.picture_feel, 'clean');
  assert.deepEqual(f.followUps.outdoor_recognizable, ['kayaking']);
});

test('loadCompatible handles empty, matching, mismatched, and invalid data', () => {
  assert.equal(loadCompatible(null).status, 'empty');
  assert.equal(loadCompatible('not json{').status, 'invalid');
  const good = createEmptyFeedback();
  good.answers.boundary = 'inside';
  const ok = loadCompatible(JSON.stringify(good));
  assert.equal(ok.status, 'ok');
  assert.equal(ok.feedback.answers.boundary, 'inside');
  const old = { ...good, prototypeVersion: '0.9.0' };
  const mm = loadCompatible(JSON.stringify(old));
  assert.equal(mm.status, 'mismatch');
  assert.equal(mm.feedback.answers.boundary, null, 'old choices must not attach to new artwork');
  assert.equal(JSON.parse(mm.oldRaw).prototypeVersion, '0.9.0', 'old answers stay exportable');
});

test('answeredThemeCount counts theme choices', () => {
  const f = createEmptyFeedback();
  f.themePreferences.outdoors.choice = 'mix';
  f.themePreferences.phoenix.choice = 'neither';
  assert.equal(answeredThemeCount(f), 2);
});
