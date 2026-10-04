// Star Shapes page: one card per shape (plain + Becky's kayak star + avatar sizes), favorite pick, notes, Send.
import { SHAPE_OPTIONS, NONE_OPTION, LIMITS, plainPath, kayakPath, shapeLabel } from './content.js';
import { loadShapeFeedback, shapeSummaryText, shapeExportJson } from './feedback.js';
import { $, el, artSlot, tile, textBox, createSaver, handleVersionChange, wireSend, loadRaw } from '../ui.js';

const STORAGE_KEY = 'all-star-studio.shape-feedback.v1';
const PREVIOUS_KEY = 'all-star-studio.shape-feedback.v1.previous';

const loaded = loadShapeFeedback(loadRaw(STORAGE_KEY));
const state = loaded.feedback;
const save = createSaver(STORAGE_KEY, () => state);

function changed() {
  save();
  $('#summary').textContent = shapeSummaryText(state);
  refreshProgress();
}

function refreshProgress() {
  const fav = [...SHAPE_OPTIONS, NONE_OPTION].find((s) => s.id === state.favorite);
  $('#progress').textContent = fav ? `Your favorite: ${shapeLabel(fav)}.` : 'No favorite picked yet.';
}

function favoriteTile(id, label) {
  const t = tile({ type: 'radio', name: 'favorite', value: id, label, checked: state.favorite === id });
  t.querySelector('input').addEventListener('change', (e) => {
    if (e.target.checked) { state.favorite = id; changed(); }
  });
  return t;
}

function renderCards() {
  const host = $('#shape-list');
  const jump = $('#jump-send');
  for (const s of SHAPE_OPTIONS) {
    jump.before(el('li', {}, el('a', { href: `#shape-${s.id}`, 'aria-label': `Shape ${s.letter}: ${s.name}`, text: s.letter })));
  }
  for (const s of SHAPE_OPTIONS) {
    const card = el('article', { class: 'shape-card', id: `shape-${s.id}`, 'aria-labelledby': `shape-${s.id}-name` },
      el('h2', { id: `shape-${s.id}-name`, class: 'shape-title' },
        el('span', { class: 'shape-letter', text: s.letter }), el('span', { text: s.name })),
      el('p', { class: 'rationale', text: s.blurb }),
      el('div', { class: 'shape-pair' },
        el('figure', {}, artSlot(plainPath(s.id), { decorative: true }), el('figcaption', { text: 'The shape' })),
        el('figure', {}, artSlot(kayakPath(s.id)), el('figcaption', { text: 'With your kayak star' })),
      ),
      el('div', { class: 'sizes' },
        el('p', { class: 'sizes-label', text: 'Avatar size' }),
        el('div', { class: 'sizes-row' },
          el('figure', {}, artSlot(kayakPath(s.id), { decorative: true, className: 'art art-48' }), el('figcaption', { text: 'Small' })),
          el('figure', {}, artSlot(kayakPath(s.id), { decorative: true, className: 'art art-96' }), el('figcaption', { text: 'Medium' })),
          el('figure', {}, el('div', { class: 'circle' }, artSlot(kayakPath(s.id), { decorative: true, className: 'art art-96' })), el('figcaption', { text: 'In a circle' })),
        ),
      ),
      el('div', { class: 'tiles fav' }, favoriteTile(s.id, `Shape ${s.letter} is my favorite`)),
      textBox({
        id: `comment-${s.id}`,
        label: 'What would you change about this shape? (optional)',
        value: state.comments[s.id],
        max: LIMITS.comment,
        rows: 2,
        onInput: (v) => { state.comments[s.id] = v; changed(); },
      }),
    );
    host.append(card);
  }
  $('#none-slot').append(favoriteTile(NONE_OPTION.id, NONE_OPTION.name));
  $('#other-slot').append(textBox({
    id: 'other', label: 'Anything else? (optional)', value: state.other, max: LIMITS.other, rows: 3,
    onInput: (v) => { state.other = v; changed(); },
  }));
}

renderCards();
wireSend({
  getText: () => shapeSummaryText(state),
  getJson: () => shapeExportJson(state),
  baseName: 'all-star-studio-shape-feedback',
  shareTitle: 'My All-Star Studio star shape',
});
handleVersionChange(loaded, {
  previousKey: PREVIOUS_KEY,
  filename: 'all-star-studio-shape-feedback-earlier.json',
  onStartFresh: changed,
});
$('#summary').textContent = shapeSummaryText(state);
refreshProgress();
$('#save-status').textContent = loaded.status === 'ok' ? 'Your earlier answers are back ✓' : '';
