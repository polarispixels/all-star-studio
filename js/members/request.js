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

// Where requests go. Published on purpose (Ryan asked for it on the page).
export const REQUEST_EMAIL = 'ryan@polarispixels.com';

// mailto: link for a request message: the first line is the subject, the whole message is the body.
// CRLF line breaks, because Outlook and some other mail apps ignore a bare %0A.
export function requestMailto(text) {
  const subject = text.split('\n')[0];
  const body = text.replace(/\r?\n/g, '\r\n');
  return `mailto:${REQUEST_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
