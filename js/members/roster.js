// Team roster: one entry per member star. First names only (the site is public, no login).
// Adding someone = one entry here + assets/members/<id>.svg drawn on house shape F.
// Bump starVersion when a member's star is redrawn, so change requests name the version they refer to.
// A member can have more stars: `extraStars: [{ file, label, starVersion }]` (art in assets/members/<file>.svg).
// `primary: '<file>'` picks the main star (card picture, shown first). Default: the member's own <id> star.
export const ROSTER = [
  {
    id: 'becky', name: 'Becky', blurb: 'A groovy 70s flower-power star, plus mountains and a kayak on the lake.', starVersion: 1,
    starLabel: 'Mountains and kayak',
    extraStars: [{ file: 'groovy', label: 'Groovy 70s', starVersion: 2 }],
    primary: 'groovy',
  },
  { id: 'scott', name: 'Scott', blurb: 'A phoenix rising, wings raised.', starVersion: 1 },
  { id: 'detective', name: 'Detective', blurb: 'All-Star detective at your service: always investigating.', starVersion: 1 },
  { id: 'dixie', name: 'Dixie', blurb: 'A cheerful dumpster fire for lightning-fast answers, with a splash of turquoise.', starVersion: 1, aliases: ['quick-response'] },
  { id: 'support', name: 'Support and Care', blurb: 'A pink awareness ribbon at the heart of the star.', starVersion: 1, placeholder: true },
  { id: 'carousel', name: 'Carousel', blurb: 'A prancing carousel horse: round and round, lifting everyone up together.', starVersion: 1, placeholder: true },
  { id: 'lighthouse', name: 'Lighthouse', blurb: 'A guiding light that helps others find their way.', starVersion: 1, placeholder: true },
  { id: 'sprout', name: 'Sprout', blurb: 'A young sprout: helping others grow.', starVersion: 1, placeholder: true },
];

export const NEW_ID = 'new';
// `aliases` keep old links working after a placeholder is renamed (e.g. quick-response -> dixie).
export const findMember = (id) => ROSTER.find((m) => m.id === id || m.aliases?.includes(id)) ?? null;
export const memberStarPath = (id, prefix = '../') => `${prefix}assets/members/${id}.svg`;

// Every star a member has, main one first: [{ file, label, starVersion, primary }].
export function memberStars(m) {
  const all = [{ file: m.id, label: m.starLabel ?? `${m.name}'s star`, starVersion: m.starVersion }, ...(m.extraStars ?? [])];
  const main = all.find((s) => s.file === m.primary) ?? all[0];
  return [main, ...all.filter((s) => s !== main)].map((s) => ({ ...s, primary: s === main }));
}
export const primaryStar = (m) => memberStars(m)[0];
