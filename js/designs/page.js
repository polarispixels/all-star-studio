// Star Designs page: renders the gallery and questions from content.js and wires feedback.
import {
  THEMES, QUESTIONS, FOLLOW_UPS, DIRECTION_CHOICES, MODE_LABEL, LIMITS, allDesigns, svgPath,
} from './content.js';
import {
  visibleFollowUps, outdoorMostChoices, answeredThemeCount, toExportJson, toSummaryText, loadCompatible,
} from './feedback.js';
import {
  $, el, svgText as svgTextAt, artSlot as artSlotAt, downloadBlob, tileGroup, textBox,
  createSaver, handleVersionChange, wireSend, loadRaw,
} from '../ui.js';

const STORAGE_KEY = 'all-star-studio.prototype-feedback.v1';
const PREVIOUS_KEY = 'all-star-studio.prototype-feedback.v1.previous';

// ---------- state ----------

const loaded = loadCompatible(loadRaw(STORAGE_KEY));
const state = loaded.feedback;
const save = createSaver(STORAGE_KEY, () => state);

function changed() {
  save();
  refreshFollowUps();
  refreshProgress();
  refreshSummary();
}

const svgText = (designId) => svgTextAt(svgPath(designId));
const artSlot = (designId, opts) => artSlotAt(svgPath(designId), opts);

async function downloadSvg(designId, statusEl) {
  try {
    const text = await svgText(designId);
    downloadBlob(new Blob([text], { type: 'image/svg+xml' }), `all-star-${designId}.svg`);
    statusEl.textContent = `Downloaded all-star-${designId}.svg`;
  } catch {
    statusEl.textContent = "Couldn't download this star. Check your connection and try again.";
  }
}



// ---------- look closer dialog ----------

const dialog = $('#closer');
let dialogDesign = null;
let dialogOpener = null;

function openCloser(design, opener) {
  dialogDesign = design;
  dialogOpener = opener;
  $('#closer-title').textContent = `${design.themeTitle}: ${design.label}`;
  $('#closer-large').replaceChildren(artSlot(design.id, { decorative: true }));
  $('#closer-small').replaceChildren(artSlot(design.id, { decorative: true }));
  $('#badge-toggle').checked = false;
  syncBadge();
  $('#closer-status').textContent = '';
  dialog.showModal();
}

function syncBadge() {
  const small = $('#badge-toggle').checked;
  $('#closer-large').hidden = small;
  $('#closer-small-wrap').hidden = !small;
}

$('#badge-toggle').addEventListener('change', syncBadge);
$('#closer-close').addEventListener('click', () => dialog.close());
$('#closer-download').addEventListener('click', () => downloadSvg(dialogDesign.id, $('#closer-status')));
dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => { dialogOpener?.focus(); });

// ---------- themes ----------

function renderThemes() {
  const host = $('#themes');
  for (const theme of THEMES) {
    const section = el('section', { class: 'theme', id: theme.id, 'aria-labelledby': `${theme.id}-title` });
    section.append(
      el('h2', { id: `${theme.id}-title`, text: theme.title }),
      el('blockquote', { class: 'idea' }, el('p', { text: `“${theme.idea}”` })),
    );
    const pair = el('div', { class: 'pair' });
    for (const d of theme.designs) {
      const design = { ...d, themeId: theme.id, themeTitle: theme.title, label: MODE_LABEL[d.mode] };
      const status = el('p', { class: 'card-status', role: 'status' });
      const closer = el('button', { type: 'button', class: 'btn', text: 'Look closer' });
      closer.addEventListener('click', () => openCloser(design, closer));
      const dl = el('button', { type: 'button', class: 'btn btn-quiet', text: 'Download' });
      dl.addEventListener('click', () => downloadSvg(d.id, status));
      pair.append(el('article', { class: 'card', id: d.id, 'aria-labelledby': `${d.id}-label` },
        artSlot(d.id),
        el('h3', { id: `${d.id}-label`, text: design.label }),
        el('p', { class: 'rationale', text: d.rationale }),
        el('div', { class: 'card-actions' }, closer, dl),
        status,
      ));
    }
    section.append(pair);

    const legend = el('div', { class: 'legend' }, el('h3', { text: 'Proposed colors for both designs' }));
    const list = el('ul', { class: 'swatches' });
    for (const c of theme.palette) {
      const chip = el('span', { class: 'chip', 'aria-hidden': 'true' });
      chip.style.background = c.hex;
      list.append(el('li', {}, chip, el('span', { text: c.name })));
    }
    legend.append(list);
    section.append(legend);

    const pref = state.themePreferences[theme.id];
    section.append(
      tileGroup({
        legend: 'Which direction do you prefer for this idea?',
        name: `pref-${theme.id}`,
        type: 'radio',
        choices: DIRECTION_CHOICES,
        selected: pref.choice,
        onChange: (v) => { pref.choice = v; changed(); },
      }),
      textBox({
        id: `comment-${theme.id}`,
        label: 'What would you change? (optional)',
        value: pref.comment,
        max: LIMITS.comment,
        onInput: (v) => { pref.comment = v; changed(); },
      }),
    );
    host.append(section);
  }
}

// ---------- questions ----------

const followUpHosts = {};

function followUpBlock(id) {
  const host = el('div', { class: 'follow-up', hidden: true });
  followUpHosts[id] = host;
  const def = FOLLOW_UPS[id];
  if (id === 'outdoor_most') return host; // filled in refreshFollowUps (choices depend on answers)
  if (def.type === 'text') {
    host.append(textBox({
      id: `fu-${id}`, label: def.question, hint: def.hint, value: state.followUps[id], max: def.maxLength,
      rows: id === 'contest_rules' ? 5 : 2,
      onInput: (v) => { state.followUps[id] = v; changed(); },
    }));
  } else {
    host.append(tileGroup({
      legend: def.question, name: `fu-${id}`, type: def.type === 'multi' ? 'checkbox' : 'radio',
      choices: def.choices, selected: state.followUps[id],
      onChange: (v) => { state.followUps[id] = v; changed(); },
    }));
  }
  return host;
}

function renderQuestions() {
  const host = $('#question-list');
  const designs = allDesigns();
  for (const q of QUESTIONS) {
    const item = el('div', { class: 'question', id: `q-${q.id}` });
    if (q.type === 'favorite') {
      const nav = Object.fromEntries(THEMES.map((t) => [t.id, t.nav]));
      const choices = [...designs.map((d) => ({ id: d.id, label: `${nav[d.themeId]}: ${d.label}` })), ...q.extra];
      item.append(tileGroup({
        legend: q.question, name: q.id, type: 'radio', choices, selected: state.answers[q.id],
        artFor: (c) => (designs.some((d) => d.id === c.id) ? artSlot(c.id, { decorative: true }) : el('span', { class: 'art art-none', 'aria-hidden': 'true', text: '?' })),
        onChange: (v) => { state.answers[q.id] = v; changed(); },
      }));
      item.append(followUpBlock('outdoor_recognizable'), followUpBlock('outdoor_most'));
    } else if (q.type === 'text') {
      item.append(textBox({
        id: `q-${q.id}-text`, label: q.question, value: state.answers[q.id], max: q.maxLength, rows: 4,
        onInput: (v) => { state.answers[q.id] = v; changed(); },
      }));
    } else {
      item.append(tileGroup({
        legend: q.question, name: q.id, type: q.type === 'multi' ? 'checkbox' : 'radio',
        choices: q.choices, selected: state.answers[q.id],
        hint: q.type === 'multi' ? 'Choose any that apply.' : null,
        onChange: (v) => { state.answers[q.id] = v; changed(); },
      }));
      if (q.id === 'overall_direction') item.append(followUpBlock('picture_feel'));
      if (q.id === 'use_context') item.append(followUpBlock('use_context_other'), followUpBlock('contest_rules'));
    }
    host.append(item);
  }
}

let lastMostKey = null;
function refreshFollowUps() {
  const visible = visibleFollowUps(state);
  for (const [id, host] of Object.entries(followUpHosts)) host.hidden = !visible.includes(id);
  const key = state.followUps.outdoor_recognizable.join(',');
  if (visible.includes('outdoor_most') && key !== lastMostKey) {
    lastMostKey = key;
    followUpHosts.outdoor_most.replaceChildren(tileGroup({
      legend: FOLLOW_UPS.outdoor_most.question, name: 'fu-outdoor_most', type: 'radio',
      choices: outdoorMostChoices(state), selected: state.followUps.outdoor_most,
      onChange: (v) => { state.followUps.outdoor_most = v; changed(); },
    }));
  }
}

// ---------- progress, summary, sharing ----------

function refreshProgress() {
  const n = answeredThemeCount(state);
  $('#progress').textContent = `You've picked ${n} of ${THEMES.length} ideas.`;
}

function refreshSummary() {
  $('#summary').textContent = toSummaryText(state);
}

renderThemes();
renderQuestions();
wireSend({
  getText: () => toSummaryText(state),
  getJson: () => toExportJson(state),
  baseName: 'all-star-studio-feedback',
  shareTitle: 'My All-Star Studio feedback',
});
handleVersionChange(loaded, {
  previousKey: PREVIOUS_KEY,
  filename: 'all-star-studio-feedback-earlier.json',
  onStartFresh: changed,
});
refreshFollowUps();
refreshProgress();
refreshSummary();
$('#save-status').textContent = loaded.status === 'ok' ? 'Your earlier answers are back ✓' : '';
