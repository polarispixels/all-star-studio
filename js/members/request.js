// Plain-text request messages a member sends to Ryan (request-and-redraw). Pure, testable.
export const LIMITS = { request: 1000, name: 40, idea: 1000 };

const clean = (s, max) => (typeof s === 'string' ? s.trim().slice(0, max) : '');

export function changeRequestText(member, text) {
  const request = clean(text, LIMITS.request);
  if (!request) return null;
  return [
    'All-Star Studio: star change request',
    `For: ${member.name}`,
    `Star: ${member.id} (version ${member.starVersion})`,
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
