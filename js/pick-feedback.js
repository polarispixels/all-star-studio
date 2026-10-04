// Shared "pick one option + optional notes" feedback model (Star Shapes, Team Star). Pure; runs under node --test.
// config: { title, versionKey, version, options: [{ id, letter?, name }], none: { id, name }, limits: { comment, other }, label }
export function createPickModel(config) {
  const { title, versionKey, version, options, none, limits, label = 'Favorite' } = config;
  const NOT_ANSWERED = 'Not answered';
  const nameOf = (o) => (o.letter ? `${o.letter}. ${o.name}` : o.name);
  const findName = (id) => {
    const o = [...options, none].find((x) => x.id === id);
    return o ? nameOf(o) : undefined;
  };
  const clamp = (v, max) => (typeof v === 'string' ? v.slice(0, max) : '');

  const createEmpty = () => ({
    schemaVersion: 1,
    [versionKey]: version,
    favorite: null,
    comments: Object.fromEntries(options.map((o) => [o.id, ''])),
    other: '',
  });

  function normalize(raw) {
    const f = createEmpty();
    const src = raw && typeof raw === 'object' ? raw : {};
    f.favorite = [...options.map((o) => o.id), none.id].includes(src.favorite) ? src.favorite : null;
    for (const o of options) f.comments[o.id] = clamp(src.comments?.[o.id], limits.comment);
    f.other = clamp(src.other, limits.other);
    return f;
  }

  const exportJson = (f) => ({ schemaVersion: 1, [versionKey]: version, favorite: f.favorite, comments: { ...f.comments }, other: f.other });

  function summaryText(f) {
    const lines = [title, `Version ${version}`, ''];
    lines.push(`${label}: ${findName(f.favorite) ?? NOT_ANSWERED}`);
    const notes = options.filter((o) => f.comments[o.id].trim());
    lines.push(`Notes: ${notes.length ? '' : NOT_ANSWERED}`.trimEnd());
    for (const o of notes) lines.push(`- ${nameOf(o)}: ${f.comments[o.id].trim()}`);
    lines.push(`Anything else: ${f.other.trim() || NOT_ANSWERED}`);
    return lines.join('\n') + '\n';
  }

  function load(rawString) {
    if (rawString === null || rawString === undefined || rawString === '') return { status: 'empty', feedback: createEmpty() };
    let parsed;
    try { parsed = JSON.parse(rawString); } catch { return { status: 'invalid', feedback: createEmpty() }; }
    if (!parsed || typeof parsed !== 'object') return { status: 'invalid', feedback: createEmpty() };
    if (parsed[versionKey] !== version) return { status: 'mismatch', feedback: createEmpty(), oldRaw: rawString };
    return { status: 'ok', feedback: normalize(parsed) };
  }

  return { createEmpty, normalize, exportJson, summaryText, load, findName };
}
