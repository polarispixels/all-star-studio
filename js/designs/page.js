// Star Designs page: renders the gallery and questions from content.js and wires feedback.
import {
  THEMES, QUESTIONS, FOLLOW_UPS, DIRECTION_CHOICES, MODE_LABEL, LIMITS, allDesigns, svgPath,
} from './content.js';
import {
  visibleFollowUps, outdoorMostChoices, answeredThemeCount, toExportJson, toSummaryText, loadCompatible,
} from './feedback.js';
import { readRaw, writeRaw, PREVIOUS_KEY } from './store.js';

const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, attrs = {}, ...children) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === false || v === null || v === undefined) continue;
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else node.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children) if (c) node.append(c);
  return node;
};

// ---------- state ----------

const loaded = loadCompatible(readRaw());
const state = loaded.feedback;
let saveTimer = null;

function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const ok = writeRaw(JSON.stringify(state));
    const status = $('#save-status');
    status.textContent = ok ? 'Saved on this device ✓' : "Couldn't save on this device. Use Copy or Download before closing.";
    status.classList.toggle('warn', !ok);
  }, 250);
}

function changed() {
  save();
  refreshFollowUps();
  refreshProgress();
  refreshSummary();
}

// ---------- SVG artwork ----------

const svgCache = new Map();
let instanceCount = 0;

async function svgText(designId) {
  if (!svgCache.has(designId)) {
    svgCache.set(designId, fetch(svgPath(designId)).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.text();
    }));
  }
  return svgCache.get(designId);
}

// Give every id in one inline copy a unique prefix so several copies can share the page.
function uniquify(text, prefix) {
  return text
    .replace(/\sid="([^"]+)"/g, ` id="${prefix}-$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${prefix}-$1)`)
    .replace(/href="#([^"]+)"/g, `href="#${prefix}-$1"`)
    .replace(/aria-labelledby="([^"]+)"/g, `aria-labelledby="${prefix}-$1"`);
}

function artSlot(designId, { decorative = false } = {}) {
  const slot = el('div', { class: 'art' });
  svgText(designId).then((text) => {
    const tpl = document.createElement('template');
    tpl.innerHTML = uniquify(text, `i${++instanceCount}`);
    const svg = tpl.content.querySelector('svg');
    if (decorative) {
      svg.setAttribute('aria-hidden', 'true');
      svg.removeAttribute('role');
      svg.removeAttribute('aria-labelledby');
    }
    slot.replaceChildren(svg);
  }).catch(() => {
    slot.replaceChildren(el('p', { class: 'art-error', text: 'This picture could not load. Check your connection and reload the page.' }));
  });
  return slot;
}

// ---------- downloads ----------

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = el('a', { href: url, download: filename });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function downloadSvg(designId, statusEl) {
  try {
    const text = await svgText(designId);
    downloadBlob(new Blob([text], { type: 'image/svg+xml' }), `all-star-${designId}.svg`);
    statusEl.textContent = `Downloaded all-star-${designId}.svg`;
  } catch {
    statusEl.textContent = "Couldn't download this star. Check your connection and try again.";
  }
}

// ---------- tiles ----------

function tile({ type, name, value, label, checked, art }) {
  const input = el('input', { type, name, value, checked: checked || false });
  const body = el('span', { class: 'tile-body' },
    el('span', { class: 'tile-check', 'aria-hidden': 'true', text: '✓' }),
    art || null,
    el('span', { class: 'tile-label', text: label }),
    el('span', { class: 'tile-chosen', 'aria-hidden': 'true', text: 'Chosen' }),
  );
  const lab = el('label', { class: `tile${art ? ' tile-art' : ''}` }, input, body);
  input.addEventListener('change', () => {
    if (input.checked && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      lab.classList.remove('pop');
      void lab.offsetWidth;
      lab.classList.add('pop');
    }
  });
  return lab;
}

function tileGroup({ legend, name, type, choices, selected, onChange, artFor, hint }) {
  const fs = el('fieldset', { class: `choices${artFor ? ' choices-art' : ''}` },
    el('legend', { text: legend }));
  if (hint) fs.append(el('p', { class: 'hint', text: hint }));
  const grid = el('div', { class: 'tiles' });
  for (const c of choices) {
    const checked = type === 'checkbox' ? selected.includes(c.id) : selected === c.id;
    grid.append(tile({ type, name, value: c.id, label: c.label, checked, art: artFor ? artFor(c) : null }));
  }
  fs.append(grid);
  fs.addEventListener('change', () => {
    if (type === 'checkbox') onChange([...fs.querySelectorAll('input:checked')].map((i) => i.value));
    else onChange(fs.querySelector('input:checked')?.value ?? null);
  });
  return fs;
}

function textBox({ id, label, value, max, hint, rows = 3, onInput }) {
  const area = el('textarea', { id, rows, maxlength: max });
  area.value = value;
  const count = el('span', { class: 'count', 'aria-hidden': 'true' });
  const update = () => { count.textContent = `${area.value.length} / ${max}`; };
  update();
  area.addEventListener('input', () => { update(); onInput(area.value.slice(0, max)); });
  const wrap = el('div', { class: 'textbox' }, el('label', { for: id, text: label }));
  if (hint) wrap.append(el('p', { class: 'hint', id: `${id}-hint`, text: hint }));
  if (hint) area.setAttribute('aria-describedby', `${id}-hint`);
  wrap.append(area, count);
  return wrap;
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

function setStatus(msg) {
  const s = $('#send-status');
  s.textContent = '';
  requestAnimationFrame(() => { s.textContent = msg; });
}

function selectSummary() {
  const range = document.createRange();
  range.selectNodeContents($('#summary'));
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

function wireSend() {
  $('#view-feedback').open = true;
  const share = $('#share');
  if (navigator.share) {
    share.hidden = false;
    share.addEventListener('click', async () => {
      try {
        await navigator.share({ title: 'My All-Star Studio feedback', text: toSummaryText(state) });
        setStatus('Shared. Thank you!');
      } catch (err) {
        if (err?.name !== 'AbortError') setStatus("Couldn't open sharing. Use Copy or Download instead.");
      }
    });
  }
  $('#copy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(toSummaryText(state));
      setStatus('Copied! Paste it into a message to Ryan.');
    } catch {
      $('#view-feedback').open = true;
      selectSummary();
      setStatus("Couldn't copy automatically. The summary is now selected. Use your device's Copy command.");
    }
  });
  $('#download-text').addEventListener('click', () => {
    downloadBlob(new Blob([toSummaryText(state)], { type: 'text/plain;charset=utf-8' }), 'all-star-studio-feedback.txt');
    setStatus('Downloaded all-star-studio-feedback.txt');
  });
  $('#download-json').addEventListener('click', () => {
    const json = JSON.stringify(toExportJson(state), null, 2) + '\n';
    downloadBlob(new Blob([json], { type: 'application/json;charset=utf-8' }), 'all-star-studio-feedback.json');
    setStatus('Downloaded all-star-studio-feedback.json');
  });
}

function handleVersionChange() {
  if (loaded.status !== 'mismatch') return;
  writeRaw(loaded.oldRaw, PREVIOUS_KEY);
  const banner = $('#version-banner');
  banner.hidden = false;
  $('#download-old').addEventListener('click', () => {
    downloadBlob(new Blob([loaded.oldRaw], { type: 'application/json;charset=utf-8' }), 'all-star-studio-feedback-earlier.json');
    $('#version-status').textContent = 'Downloaded your earlier answers.';
  });
  $('#start-fresh').addEventListener('click', () => {
    banner.hidden = true;
    changed();
  });
}

renderThemes();
renderQuestions();
wireSend();
handleVersionChange();
refreshFollowUps();
refreshProgress();
refreshSummary();
$('#save-status').textContent = loaded.status === 'ok' ? 'Your earlier answers are back ✓' : '';
