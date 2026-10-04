// Pure feedback model for the Star Shapes page. No DOM access, so it runs under `node --test`.
import { SHAPES_VERSION, SHAPE_OPTIONS, NONE_OPTION, LIMITS, shapeLabel } from './content.js';

export const SCHEMA_VERSION = 1;
const NOT_ANSWERED = 'Not answered';
const validFavorites = () => [...SHAPE_OPTIONS.map((s) => s.id), NONE_OPTION.id];
const clamp = (v, max) => (typeof v === 'string' ? v.slice(0, max) : '');

export function createEmptyShapeFeedback() {
  return {
    schemaVersion: SCHEMA_VERSION,
    shapesVersion: SHAPES_VERSION,
    favorite: null,
    comments: Object.fromEntries(SHAPE_OPTIONS.map((s) => [s.id, ''])),
    other: '',
  };
}

export function normalizeShapeFeedback(raw) {
  const f = createEmptyShapeFeedback();
  const src = raw && typeof raw === 'object' ? raw : {};
  f.favorite = validFavorites().includes(src.favorite) ? src.favorite : null;
  for (const s of SHAPE_OPTIONS) f.comments[s.id] = clamp(src.comments?.[s.id], LIMITS.comment);
  f.other = clamp(src.other, LIMITS.other);
  return f;
}

export const shapeExportJson = (f) => ({
  schemaVersion: SCHEMA_VERSION,
  shapesVersion: SHAPES_VERSION,
  favorite: f.favorite,
  comments: { ...f.comments },
  other: f.other,
});

const nameOf = (id) => {
  const s = [...SHAPE_OPTIONS, NONE_OPTION].find((x) => x.id === id);
  return s ? shapeLabel(s) : undefined;
};

export function shapeSummaryText(f) {
  const lines = ['All-Star Studio: star shape feedback', `Shapes version ${SHAPES_VERSION}`, ''];
  lines.push(`Favorite shape: ${nameOf(f.favorite) ?? NOT_ANSWERED}`);
  const notes = SHAPE_OPTIONS.filter((s) => f.comments[s.id].trim());
  lines.push(`Notes on shapes: ${notes.length ? '' : NOT_ANSWERED}`.trimEnd());
  for (const s of notes) lines.push(`- ${shapeLabel(s)}: ${f.comments[s.id].trim()}`);
  lines.push(`Anything else: ${f.other.trim() || NOT_ANSWERED}`);
  return lines.join('\n') + '\n';
}

export function loadShapeFeedback(rawString) {
  if (rawString === null || rawString === undefined || rawString === '') return { status: 'empty', feedback: createEmptyShapeFeedback() };
  let parsed;
  try { parsed = JSON.parse(rawString); } catch { return { status: 'invalid', feedback: createEmptyShapeFeedback() }; }
  if (!parsed || typeof parsed !== 'object') return { status: 'invalid', feedback: createEmptyShapeFeedback() };
  if (parsed.shapesVersion !== SHAPES_VERSION) return { status: 'mismatch', feedback: createEmptyShapeFeedback(), oldRaw: rawString };
  return { status: 'ok', feedback: normalizeShapeFeedback(parsed) };
}
