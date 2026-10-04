// Pure feedback model for the Star Designs gallery: create, normalize, follow-up rules, exports.
// No DOM access, so it runs under `node --test`.
import {
  PROTOTYPE_VERSION, THEMES, QUESTIONS, FOLLOW_UPS, DIRECTION_CHOICES, LIMITS, allDesigns,
} from './content.js';

export const SCHEMA_VERSION = 1;
const NOT_ANSWERED = 'Not answered';

const question = (id) => QUESTIONS.find((q) => q.id === id);
const designIds = () => allDesigns().map((d) => d.id);
const choiceIds = (q) => {
  if (q.type === 'favorite') return [...designIds(), ...q.extra.map((e) => e.id)];
  return (q.choices || []).map((c) => c.id);
};
const textLimit = (q) => q.maxLength ?? LIMITS.comment;

const pickOne = (value, allowed) => (allowed.includes(value) ? value : null);
const pickMany = (value, allowed) =>
  Array.isArray(value) ? allowed.filter((id) => value.includes(id)) : [];
const clampText = (value, max) => (typeof value === 'string' ? value.slice(0, max) : '');

export function createEmptyFeedback() {
  const answers = {};
  for (const q of QUESTIONS) answers[q.id] = q.type === 'multi' ? [] : q.type === 'text' ? '' : null;
  return {
    schemaVersion: SCHEMA_VERSION,
    prototypeVersion: PROTOTYPE_VERSION,
    themePreferences: Object.fromEntries(THEMES.map((t) => [t.id, { choice: null, comment: '' }])),
    answers,
    followUps: {
      outdoor_recognizable: [],
      outdoor_most: null,
      picture_feel: null,
      use_context_other: '',
      contest_rules: '',
    },
  };
}

// Rebuild from untrusted data, keeping only known ids, allowed choices, and bounded text.
export function normalizeFeedback(raw) {
  const f = createEmptyFeedback();
  const src = raw && typeof raw === 'object' ? raw : {};
  const directionIds = DIRECTION_CHOICES.map((c) => c.id);
  for (const t of THEMES) {
    const p = src.themePreferences?.[t.id] ?? {};
    f.themePreferences[t.id] = {
      choice: pickOne(p.choice, directionIds),
      comment: clampText(p.comment, LIMITS.comment),
    };
  }
  for (const q of QUESTIONS) {
    const v = src.answers?.[q.id];
    if (q.type === 'multi') f.answers[q.id] = pickMany(v, choiceIds(q));
    else if (q.type === 'text') f.answers[q.id] = clampText(v, textLimit(q));
    else f.answers[q.id] = pickOne(v, choiceIds(q));
  }
  const fu = src.followUps ?? {};
  const activityIds = FOLLOW_UPS.outdoor_recognizable.choices.map((c) => c.id);
  f.followUps.outdoor_recognizable = pickMany(fu.outdoor_recognizable, activityIds);
  f.followUps.outdoor_most = pickOne(fu.outdoor_most, activityIds);
  f.followUps.picture_feel = pickOne(fu.picture_feel, FOLLOW_UPS.picture_feel.choices.map((c) => c.id));
  f.followUps.use_context_other = clampText(fu.use_context_other, FOLLOW_UPS.use_context_other.maxLength);
  f.followUps.contest_rules = clampText(fu.contest_rules, FOLLOW_UPS.contest_rules.maxLength);
  return f;
}

// Follow-up ids that should be shown, in display order.
export function visibleFollowUps(f) {
  const out = [];
  if (f.answers.favorite_design?.startsWith('outdoors-')) {
    out.push('outdoor_recognizable');
    if (f.followUps.outdoor_recognizable.length >= 2) out.push('outdoor_most');
  }
  if (['illustrated', 'mix'].includes(f.answers.overall_direction)) out.push('picture_feel');
  if (f.answers.use_context.includes('other')) out.push('use_context_other');
  if (f.answers.use_context.includes('contest')) out.push('contest_rules');
  return out;
}

export const outdoorMostChoices = (f) =>
  FOLLOW_UPS.outdoor_recognizable.choices.filter((c) => f.followUps.outdoor_recognizable.includes(c.id));

export const answeredThemeCount = (f) =>
  THEMES.filter((t) => f.themePreferences[t.id].choice !== null).length;

function exportedFollowUps(f) {
  const out = {};
  for (const id of visibleFollowUps(f)) {
    let v = f.followUps[id];
    if (id === 'outdoor_most' && !f.followUps.outdoor_recognizable.includes(v)) v = null;
    out[id] = Array.isArray(v) ? [...v] : v;
  }
  return out;
}

export function toExportJson(f) {
  return {
    schemaVersion: SCHEMA_VERSION,
    prototypeVersion: PROTOTYPE_VERSION,
    themePreferences: Object.fromEntries(THEMES.map((t) => [t.id, { ...f.themePreferences[t.id] }])),
    answers: Object.fromEntries(QUESTIONS.map((q) => {
      const v = f.answers[q.id];
      return [q.id, Array.isArray(v) ? [...v] : v];
    })),
    followUps: exportedFollowUps(f),
  };
}

// Human-readable labels for stored ids.
function designLabel(id) {
  const d = allDesigns().find((x) => x.id === id);
  return d ? `${d.themeTitle}: ${d.label}` : null;
}
function labelFor(q, id) {
  if (q.type === 'favorite') return designLabel(id) ?? q.extra.find((e) => e.id === id)?.label ?? id;
  return (q.choices || []).find((c) => c.id === id)?.label ?? id;
}
const orNot = (s) => (s === null || s === undefined || s === '' ? NOT_ANSWERED : s);

export function toSummaryText(f) {
  const lines = ['All-Star Studio: star design feedback', `Designs version ${PROTOTYPE_VERSION}`, ''];
  lines.push('THE FOUR IDEAS');
  for (const t of THEMES) {
    const p = f.themePreferences[t.id];
    const choice = DIRECTION_CHOICES.find((c) => c.id === p.choice)?.label;
    lines.push(`- ${t.title}: ${orNot(choice)}`);
    if (p.comment.trim()) lines.push(`  What I'd change: ${p.comment.trim()}`);
  }
  lines.push('', 'QUESTIONS');
  const fu = exportedFollowUps(f);
  for (const q of QUESTIONS) {
    const v = f.answers[q.id];
    let answer;
    if (q.type === 'multi') answer = v.length ? q.choices.filter((c) => v.includes(c.id)).map((c) => c.label).join(', ') : null;
    else if (q.type === 'text') answer = v.trim() || null;
    else answer = v === null ? null : labelFor(q, v);
    lines.push(`- ${q.question}`, `  ${orNot(answer)}`);
    if (q.id === 'favorite_design' && 'outdoor_recognizable' in fu) {
      const acts = FOLLOW_UPS.outdoor_recognizable.choices;
      const picked = fu.outdoor_recognizable.map((id) => acts.find((c) => c.id === id).label);
      lines.push(`  ${FOLLOW_UPS.outdoor_recognizable.question} ${orNot(picked.join(', ') || null)}`);
      if ('outdoor_most' in fu) {
        lines.push(`  ${FOLLOW_UPS.outdoor_most.question} ${orNot(acts.find((c) => c.id === fu.outdoor_most)?.label)}`);
      }
    }
    if (q.id === 'overall_direction' && 'picture_feel' in fu) {
      const label = FOLLOW_UPS.picture_feel.choices.find((c) => c.id === fu.picture_feel)?.label;
      lines.push(`  ${FOLLOW_UPS.picture_feel.question} ${orNot(label)}`);
    }
    if (q.id === 'use_context') {
      if ('use_context_other' in fu) lines.push(`  ${FOLLOW_UPS.use_context_other.question} ${orNot(fu.use_context_other.trim() || null)}`);
      if ('contest_rules' in fu) lines.push('  Contest rules:', `  ${orNot(fu.contest_rules.trim() || null)}`);
    }
  }
  return lines.join('\n') + '\n';
}

// Parse stored JSON. A different prototypeVersion never attaches old choices to changed artwork.
export function loadCompatible(rawString) {
  if (rawString === null || rawString === undefined || rawString === '') return { status: 'empty', feedback: createEmptyFeedback() };
  let parsed;
  try { parsed = JSON.parse(rawString); } catch { return { status: 'invalid', feedback: createEmptyFeedback() }; }
  if (!parsed || typeof parsed !== 'object') return { status: 'invalid', feedback: createEmptyFeedback() };
  if (parsed.prototypeVersion !== PROTOTYPE_VERSION) {
    return { status: 'mismatch', feedback: createEmptyFeedback(), oldRaw: rawString };
  }
  return { status: 'ok', feedback: normalizeFeedback(parsed) };
}
