// Team Star page: lettered logo options, real-use size previews, downloads, pick + notes, Send to Ryan.
import { TEAM_OPTIONS, NONE_OPTION, LIMITS, teamPath } from './content.js';
import { teamModel } from './feedback.js';
import { $, el, artSlot, svgText, tile, textBox, downloadBlob, createSaver, handleVersionChange, wireSend, loadRaw } from '../ui.js';
import { svgToPngBlob } from '../png.js';

const STORAGE_KEY = 'all-star-studio.team-feedback.v1';
const PREVIOUS_KEY = 'all-star-studio.team-feedback.v1.previous';

const loaded = teamModel.load(loadRaw(STORAGE_KEY));
const state = loaded.feedback;
const save = createSaver(STORAGE_KEY, () => state);

function refresh() {
  $('#summary').textContent = teamModel.summaryText(state);
  const name = teamModel.findName(state.favorite);
  $('#progress').textContent = name ? `Your favorite: ${name}.` : 'No favorite picked yet.';
}
function changed() { save(); refresh(); }

function favoriteTile(id, label) {
  const t = tile({ type: 'radio', name: 'favorite', value: id, label, checked: state.favorite === id });
  t.querySelector('input').addEventListener('change', (e) => { if (e.target.checked) { state.favorite = id; changed(); } });
  return t;
}

function downloads(o) {
  const status = el('p', { class: 'dl-status', role: 'status' });
  const base = `all-stars-team-star-${o.letter.toLowerCase()}`;
  const png = el('button', { type: 'button', class: 'btn', text: 'Download PNG' });
  const svg = el('button', { type: 'button', class: 'btn btn-quiet', text: 'Download SVG' });
  png.addEventListener('click', async () => {
    status.textContent = 'Making the picture…';
    try {
      const text = await svgText(teamPath(o.id));
      let blob;
      try { blob = await svgToPngBlob(text, 1024); } catch { blob = await svgToPngBlob(text, 512); }
      downloadBlob(blob, `${base}.png`);
      status.textContent = `Downloaded ${base}.png`;
    } catch {
      status.textContent = "Couldn't make the picture on this device. Try Download SVG.";
    }
  });
  svg.addEventListener('click', async () => {
    try {
      downloadBlob(new Blob([await svgText(teamPath(o.id))], { type: 'image/svg+xml' }), `${base}.svg`);
      status.textContent = `Downloaded ${base}.svg`;
    } catch {
      status.textContent = "Couldn't download. Check your connection and try again.";
    }
  });
  return [el('div', { class: 'actions' }, png, svg), status];
}

function render() {
  const host = $('#option-list');
  const jump = $('#jump-send');
  for (const o of TEAM_OPTIONS) {
    jump.before(el('li', {}, el('a', { href: `#option-${o.id}`, 'aria-label': `Option ${o.letter}: ${o.name}`, text: o.letter })));
    const path = teamPath(o.id);
    host.append(el('article', { class: 'shape-card team-card', id: `option-${o.id}`, 'aria-labelledby': `option-${o.id}-name` },
      el('h2', { id: `option-${o.id}-name`, class: 'shape-title' }, el('span', { class: 'shape-letter', text: o.letter }), el('span', { text: o.name })),
      el('p', { class: 'rationale', text: o.blurb }),
      el('div', { class: 'team-hero' }, artSlot(path)),
      el('div', { class: 'sizes' },
        el('p', { class: 'sizes-label', text: 'Where it will show' }),
        el('div', { class: 'sizes-row' },
          el('figure', {}, el('div', { class: 'sig' }, artSlot(path, { decorative: true, className: 'art art-40' }), el('span', { class: 'sig-text', text: 'Becky · All-Stars Mentoring Team' })), el('figcaption', { text: 'Email signature' })),
          el('figure', {}, artSlot(path, { decorative: true, className: 'art art-32' }), el('figcaption', { text: 'Teams' })),
          el('figure', {}, el('div', { class: 'circle' }, artSlot(path, { decorative: true })), el('figcaption', { text: 'In a circle' })),
          el('figure', {}, el('div', { class: 'dark-chip' }, artSlot(path, { decorative: true, className: 'art art-64' })), el('figcaption', { text: 'Dark mode' })),
        ),
      ),
      ...downloads(o),
      el('div', { class: 'tiles fav' }, favoriteTile(o.id, `Option ${o.letter} is my favorite`)),
      textBox({
        id: `comment-${o.id}`, label: 'What would you change about this option? (optional)', value: state.comments[o.id],
        max: LIMITS.comment, rows: 2, onInput: (v) => { state.comments[o.id] = v; changed(); },
      }),
    ));
  }
  $('#none-slot').append(favoriteTile(NONE_OPTION.id, NONE_OPTION.name));
  $('#other-slot').append(textBox({
    id: 'other', label: 'Anything else? (optional)', value: state.other, max: LIMITS.other, rows: 3,
    onInput: (v) => { state.other = v; changed(); },
  }));
}

render();
wireSend({
  getText: () => teamModel.summaryText(state),
  getJson: () => teamModel.exportJson(state),
  baseName: 'all-star-studio-team-star-feedback',
  shareTitle: 'My All-Star Studio Team Star pick',
});
handleVersionChange(loaded, { previousKey: PREVIOUS_KEY, filename: 'all-star-studio-team-star-feedback-earlier.json', onStartFresh: changed });
refresh();
$('#save-status').textContent = loaded.status === 'ok' ? 'Your earlier answers are back ✓' : '';
