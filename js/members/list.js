// Team Members list: one large card per member, plus "Want your own star?".
import { ROSTER, NEW_ID, memberStarPath } from './roster.js';
import { $, el, artSlot } from '../ui.js';

const grid = $('#member-grid');
for (const m of ROSTER) {
  grid.append(el('a', { class: 'member-card', href: `../member/?id=${m.id}` },
    artSlot(memberStarPath(m.id), { decorative: true }),
    el('span', { class: 'member-name', text: m.name }),
    el('span', { class: 'member-blurb', text: m.placeholder ? `${m.blurb} Teammate's name coming soon.` : m.blurb }),
  ));
}
grid.append(el('a', { class: 'member-card member-new', href: `../member/?id=${NEW_ID}` },
  el('span', { class: 'art art-new', 'aria-hidden': 'true', text: '+' }),
  el('span', { class: 'member-name', text: 'Want your own star?' }),
  el('span', { class: 'member-blurb', text: 'Tell Ryan your idea and he will draw it.' }),
));
