// Plain-text request messages a member sends to Ryan (request-and-redraw). Pure, testable.
export const LIMITS = { request: 1000, name: 40, idea: 1000 };

const clean = (s, max) => (typeof s === 'string' ? s.trim().slice(0, max) : '');

// `star` is one of memberStars(member); defaults to the member's main star.
export function changeRequestText(member, text, star = { file: member.id, starVersion: member.starVersion }) {
  const request = clean(text, LIMITS.request);
  if (!request) return null;
  return [
    'All-Star Studio: star change request',
    `For: ${member.name}`,
    `Star: ${star.file} (version ${star.starVersion})${star.label && member.extraStars?.length ? `, "${star.label}"` : ''}`,
    '',
    'Request:',
    request,
    '',
  ].join('\n');
}

export function newStarRequestText(name, idea) {
  const n = clean(name, LIMITS.name);
  const i = clean(idea, LIMITS.idea);
  if (!n || !i) return null;
  return ['All-Star Studio: new star request', `Name: ${n}`, '', 'Idea:', i, ''].join('\n');
}

// Asks Ryan to make `star` the member's main star (the roster's `primary`).
export function primaryRequestText(member, star) {
  return [
    'All-Star Studio: main star request',
    `For: ${member.name}`,
    `Make my main star: ${star.file} (version ${star.starVersion}), "${star.label}"`,
    '',
  ].join('\n');
}
