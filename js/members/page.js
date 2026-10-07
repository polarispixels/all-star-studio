// One member's page (member/?id=...): their star, avatar previews, PNG/SVG downloads, change request.
import { findMember, NEW_ID, memberStarPath, memberStars } from './roster.js';
import { changeRequestText, newStarRequestText, LIMITS } from './request.js';
import { $, el, artSlot, svgText, downloadBlob, wireRequestSend, tileGroup } from '../ui.js';
import { readRaw, writeRaw } from '../store.js';
import { svgToPngBlob } from '../png.js';

const id = new URLSearchParams(location.search).get('id') ?? '';
const member = findMember(id);
const isNew = id === NEW_ID;
const draftKey = `all-star-studio.member-request.v1.${isNew ? NEW_ID : id}`;

function loadDraft() {
  try { return JSON.parse(readRaw(draftKey) ?? '{}') ?? {}; } catch { return {}; }
}
const draft = { text: '', name: '', star: null, ...loadDraft() };
let saveTimer = null;
function saveDraft() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => writeRaw(JSON.stringify(draft), draftKey), 250);
}

function field({ id: fid, label, max, rows, value, onInput, input = false }) {
  const ctl = input ? el('input', { id: fid, type: 'text', maxlength: max, autocomplete: 'given-name' }) : el('textarea', { id: fid, rows, maxlength: max });
  ctl.value = value;
  const count = el('span', { class: 'count', 'aria-hidden': 'true' });
  const upd = () => { count.textContent = `${ctl.value.length} / ${max}`; };
  upd();
  ctl.addEventListener('input', () => { upd(); onInput(ctl.value); });
  return el('div', { class: 'textbox' }, el('label', { for: fid, text: label }), ctl, count);
}

function render() {
  const main = $('#member-main');
  if (!member && !isNew) {
    document.title = 'Star not found · All-Star Studio';
    main.append(el('h1', { text: "We couldn't find that star" }),
      el('p', { text: 'The link may be out of date.' }),
      el('a', { class: 'btn', href: '../members/', text: 'See all Team Members' }));
    return;
  }

  if (isNew) {
    document.title = 'Your own star · All-Star Studio';
    main.append(
      el('h1', { text: 'Want your own star?' }),
      el('p', { class: 'lede', text: 'Tell Ryan your first name and what your star should be about: hobbies, values, a favorite place, a fun nickname. He will draw it on the All-Star shape and add you to Team Members.' }),
      field({ id: 'new-name', label: 'Your first name', max: LIMITS.name, value: draft.name, input: true, onInput: (v) => { draft.name = v; saveDraft(); } }),
      field({ id: 'request', label: 'Describe your star idea', max: LIMITS.idea, rows: 5, value: draft.text, onInput: (v) => { draft.text = v; saveDraft(); } }),
    );
  } else {
    document.title = `${member.name}'s star · All-Star Studio`;
    const stars = memberStars(member);
    const multi = stars.length > 1;
    main.append(
      el('h1', { text: member.placeholder ? member.name : multi ? `${member.name}'s stars` : `${member.name}'s star` }),
      el('p', { class: 'lede', text: member.placeholder ? `${member.blurb} Teammate's name coming soon.` : member.blurb }),
    );
    for (const star of stars) {
      const path = memberStarPath(star.file);
      const status = el('p', { class: 'dl-status', role: 'status' });
      const png = el('button', { type: 'button', class: 'btn btn-big', text: 'Download for Teams / Outlook' });
      const svg = el('button', { type: 'button', class: 'btn btn-quiet', text: 'Download SVG' });
      const fname = `all-star-${star.file === member.id ? member.id : `${member.id}-${star.file}`}`;
      png.addEventListener('click', async () => {
        status.textContent = 'Making your picture…';
        try {
          const text = await svgText(path);
          let blob;
          try { blob = await svgToPngBlob(text, 1024); } catch { blob = await svgToPngBlob(text, 512); }
          downloadBlob(blob, `${fname}.png`);
          status.textContent = `Downloaded ${fname}.png. Use it as your profile picture in Teams or Outlook.`;
        } catch {
          status.textContent = "Couldn't make the picture on this device. Try Download SVG, or ask Ryan to send you the PNG.";
        }
      });
      svg.addEventListener('click', async () => {
        try {
          downloadBlob(new Blob([await svgText(path)], { type: 'image/svg+xml' }), `${fname}.svg`);
          status.textContent = `Downloaded ${fname}.svg`;
        } catch {
          status.textContent = "Couldn't download the star. Check your connection and try again.";
        }
      });
      main.append(el('section', { class: 'member-star', id: `star-${star.file}`, 'aria-label': star.label },
        multi ? el('h2', { class: 'star-label', text: star.label }) : null,
        el('div', { class: 'member-hero' }, artSlot(path)),
        el('div', { class: 'sizes' },
          el('p', { class: 'sizes-label', text: 'Avatar size' }),
          el('div', { class: 'sizes-row' },
            el('figure', {}, artSlot(path, { decorative: true, className: 'art art-32' }), el('figcaption', { text: 'Tiny' })),
            el('figure', {}, artSlot(path, { decorative: true, className: 'art art-64' }), el('figcaption', { text: 'Small' })),
            el('figure', {}, el('div', { class: 'circle' }, artSlot(path, { decorative: true })), el('figcaption', { text: 'In a circle' })),
          ),
        ),
        el('div', { class: 'actions' }, png, svg),
        status,
      ));
    }
    main.append(el('h2', { class: 'request-title', text: 'Want a change?' }));
    if (multi) {
      if (!stars.some((x) => x.file === draft.star)) draft.star = stars[0].file;
      main.append(tileGroup({
        legend: 'Which star is this about?', name: 'which-star', type: 'radio',
        choices: stars.map((x) => ({ id: x.file, label: x.label })), selected: draft.star,
        onChange: (v) => { draft.star = v; saveDraft(); },
      }));
    }
    main.append(field({ id: 'request', label: multi ? 'What would you change about it?' : 'What would you change about your star?', max: LIMITS.request, rows: 4, value: draft.text, onInput: (v) => { draft.text = v; saveDraft(); } }));
  }

  const shareBtn = el('button', { type: 'button', class: 'btn btn-big', hidden: true, text: 'Share' });
  const copyBtn = el('button', { type: 'button', class: 'btn btn-big', text: 'Copy' });
  const sendStatus = el('p', { class: 'send-status', role: 'status', 'aria-live': 'polite' });
  main.append(el('section', { class: 'send', 'aria-labelledby': 'send-title' },
    el('h2', { id: 'send-title', text: 'Send to Ryan' }),
    el('p', { class: 'privacy', text: 'Nothing is sent automatically. Tap Share (or Copy) and send the message to Ryan, and he will redraw your star.' }),
    el('div', { class: 'actions send-actions' }, shareBtn, copyBtn),
    sendStatus,
    el('pre', { id: 'request-preview', class: 'request-preview', hidden: true }),
  ));
  wireRequestSend({
    shareBtn, copyBtn, statusEl: sendStatus,
    shareTitle: 'All-Star Studio star request',
    getText: () => (isNew ? newStarRequestText(draft.name, draft.text)
      : changeRequestText(member, draft.text, memberStars(member).find((x) => x.file === draft.star) ?? memberStars(member)[0])),
  });
}

render();
