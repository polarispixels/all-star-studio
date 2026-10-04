// Shared page helpers for the All-Star Studio feedback pages (Star Designs, Star Shapes).
// DOM building, inline SVG instancing, choice tiles, text boxes, saving, and the Send section.
import { readRaw, writeRaw } from './store.js';

export const $ = (sel, root = document) => root.querySelector(sel);
export const el = (tag, attrs = {}, ...children) => {
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

// ---------- SVG artwork ----------

const svgCache = new Map();
let instanceCount = 0;

export async function svgText(url) {
  if (!svgCache.has(url)) {
    svgCache.set(url, fetch(url).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.text();
    }));
  }
  return svgCache.get(url);
}

// Give every id in one inline copy a unique prefix so several copies can share the page.
export function uniquify(text, prefix) {
  return text
    .replace(/\sid="([^"]+)"/g, ` id="${prefix}-$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${prefix}-$1)`)
    .replace(/href="#([^"]+)"/g, `href="#${prefix}-$1"`)
    .replace(/aria-labelledby="([^"]+)"/g, `aria-labelledby="${prefix}-$1"`);
}

// A container that fills with an inline copy of the SVG at `url`.
export function artSlot(url, { decorative = false, className = 'art' } = {}) {
  const slot = el('div', { class: className });
  svgText(url).then((text) => {
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

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = el('a', { href: url, download: filename });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ---------- tiles and text boxes ----------

export function tile({ type, name, value, label, checked, art }) {
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

export function tileGroup({ legend, name, type, choices, selected, onChange, artFor, hint }) {
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

export function textBox({ id, label, value, max, hint, rows = 3, onInput }) {
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

// ---------- saving ----------

// Debounced save of `getState()` to `key`, reporting success in #save-status.
export function createSaver(key, getState) {
  let timer = null;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const ok = writeRaw(JSON.stringify(getState()), key);
      const status = $('#save-status');
      status.textContent = ok ? 'Saved on this device ✓' : "Couldn't save on this device. Use Copy or Download before closing.";
      status.classList.toggle('warn', !ok);
    }, 250);
  };
}

// Version-mismatch banner: keep the old answers under `previousKey` and offer them as a download.
export function handleVersionChange(loaded, { previousKey, filename, onStartFresh }) {
  if (loaded.status !== 'mismatch') return;
  writeRaw(loaded.oldRaw, previousKey);
  const banner = $('#version-banner');
  banner.hidden = false;
  $('#download-old').addEventListener('click', () => {
    downloadBlob(new Blob([loaded.oldRaw], { type: 'application/json;charset=utf-8' }), filename);
    $('#version-status').textContent = 'Downloaded your earlier answers.';
  });
  $('#start-fresh').addEventListener('click', () => {
    banner.hidden = true;
    onStartFresh();
  });
}

export const loadRaw = readRaw;

// ---------- Send to Ryan ----------

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

// Wires #share, #copy, #download-text and #download-json to the current summary and JSON.
export function wireSend({ getText, getJson, baseName, shareTitle }) {
  $('#view-feedback').open = true;
  const share = $('#share');
  if (navigator.share) {
    share.hidden = false;
    share.addEventListener('click', async () => {
      try {
        await navigator.share({ title: shareTitle, text: getText() });
        setStatus('Shared. Thank you!');
      } catch (err) {
        if (err?.name !== 'AbortError') setStatus("Couldn't open sharing. Use Copy or Download instead.");
      }
    });
  }
  $('#copy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(getText());
      setStatus('Copied! Paste it into a message to Ryan.');
    } catch {
      $('#view-feedback').open = true;
      selectSummary();
      setStatus("Couldn't copy automatically. The summary is now selected. Use your device's Copy command.");
    }
  });
  $('#download-text').addEventListener('click', () => {
    downloadBlob(new Blob([getText()], { type: 'text/plain;charset=utf-8' }), `${baseName}.txt`);
    setStatus(`Downloaded ${baseName}.txt`);
  });
  $('#download-json').addEventListener('click', () => {
    const json = JSON.stringify(getJson(), null, 2) + '\n';
    downloadBlob(new Blob([json], { type: 'application/json;charset=utf-8' }), `${baseName}.json`);
    setStatus(`Downloaded ${baseName}.json`);
  });
}

// Share/Copy for a single request message. `getText()` returns the text or null when empty.
export function wireRequestSend({ shareBtn, copyBtn, statusEl, getText, shareTitle }) {
  const say = (msg) => { statusEl.textContent = ''; requestAnimationFrame(() => { statusEl.textContent = msg; }); };
  const empty = () => say('Type your request first, then send it.');
  if (navigator.share) {
    shareBtn.hidden = false;
    shareBtn.addEventListener('click', async () => {
      const text = getText();
      if (!text) return empty();
      try {
        await navigator.share({ title: shareTitle, text });
        say('Shared. Ryan will take it from here!');
      } catch (err) {
        if (err?.name !== 'AbortError') say("Couldn't open sharing. Use Copy instead.");
      }
    });
  }
  copyBtn.addEventListener('click', async () => {
    const text = getText();
    if (!text) return empty();
    try {
      await navigator.clipboard.writeText(text);
      say('Copied! Paste it into a message to Ryan.');
    } catch {
      const pre = $('#request-preview');
      pre.hidden = false;
      pre.textContent = text;
      const range = document.createRange();
      range.selectNodeContents(pre);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      say("Couldn't copy automatically. The message is selected below. Use your device's Copy command.");
    }
  });
}
