# Star Designs Gallery and Preference Questions: Design

Date: 2026-10-04. Source brief: `docs/prototype-iteration-brief.md`, which holds the full requirements, question IDs, feedback JSON shape and acceptance criteria. This document records the decisions made on top of that brief. Where the two differ, this document wins.

## Decisions from review with Ryan

| Topic | Decision |
|---|---|
| Who answers | Only Ryan's mother. No name field and no teammate details. |
| Deploy | Push to `main` (which goes live) once all checks pass. Then confirm the live URL. |
| Homepage buttons | A big primary **Star Designs** button (to `designs/`) and an outlined **Heart Examples** button (to `ideas/`). The small "About this project" docs link stays. |
| Layout | One scrolling page at `designs/`, with a sticky jump bar: Outdoor · Support · Quick Response · Phoenix · Questions · Send. |
| Simplicity | Big tap targets, plain one- or two-word button labels, and no forced order. |

## Homepage

Replace the "Coming soon" line with: "Help shape All-Star Studio. Explore four ideas, then tell us what feels right." Then show the two buttons above. Everything else stays.

## `designs/` page

1. **Header:** a "← Home" button, a one-line welcome, and the jump bar.
2. **Four idea sections** (`outdoors`, `support`, `quick-response`, `phoenix`). Each contains:
   - The title and the original idea in quotation marks.
   - Two equal cards, labeled "Colors and patterns" and "Pictures and symbols". They sit side by side when the screen is at least about 700px wide and stack below that.
   - On each card: the star art, a one-sentence rationale, and proposed colors as labeled swatches with plain color names, under the heading "Proposed colors". Buttons: **Look closer** and **Download**.
   - "Which direction do you prefer for this idea?" with four large radio tiles. A chosen tile shows a check icon, the word "Chosen" and a thicker border.
   - An optional "What would you change?" textarea (max 500 characters).
3. **Look closer dialog:** uses native `<dialog>` with `showModal()`, which provides the focus trap and closes with Escape. It shows the large art, a **Small badge preview** switch that renders the same SVG at 64 CSS px, **Download** and **Close**. Focus returns to the button that opened it.
4. **Questions:** "A few choices will help us build the right tools for you." These are the brief's eight questions, all optional and all with large tiles. `favorite_design` shows the eight star thumbnails plus "Not sure yet". `detail_level`, `color_control` and `starting_method` also offer "Not sure yet". `overall_direction` ("Depends on the idea") and `boundary` ("Either could work") already have a neutral choice. Follow-ups appear inline under the question that triggers them:
   - `favorite_design` is an outdoors design → "Which should be recognizable?" (camping, kayaking, snorkeling, skiing, nature generally). If two or more are checked → "Which matters most?" (choose from the checked ones).
   - `overall_direction` is pictures or a mix → "What should the pictures feel like?" (clean symbols, playful illustrations, small scenes).
   - `use_context` includes contest entry → an optional "Paste any contest rules you know" textarea (max 2,000 characters) with a reminder to paste only what she's allowed to share.
   - Hidden follow-ups are not exported. Their saved values are kept, so they come back if the trigger is re-selected.
5. **Send to Ryan:**
   - The text "Your answers stay in this browser. Copy or download the summary to share it with Ryan."
   - A live summary under a **View my feedback** disclosure that is open by default once anything has been answered.
   - Buttons: **Share** (shown only when `navigator.share` exists), **Copy** (falls back to selecting a read-only textarea), **Download summary** (`.txt`, UTF-8) and **Download data file (JSON)**.
   - Each button confirms in words in a live region.
6. **Status touches:** "Saved on this device ✓" (or "Couldn't save on this device. Use Copy or Download before closing." if storage fails), "You've picked N of 4 ideas", and a small scale pop on selection that is disabled under `prefers-reduced-motion`.
7. **Version change:** if stored feedback has a different `prototypeVersion`, show a banner with "Start fresh" and "Download old answers". Old choices are never applied to the current art.

Visuals: cream ground in light mode with a matching dark mode, system fonts, visible focus rings, no horizontal scroll at 360px, and nothing that depends on hover.

## Art

Eight standalone SVGs in `assets/prototypes/`. Each uses viewBox `0 0 1000 1000` and the shared star polygon (the same geometry as `assets/star.svg`). Artwork is clipped to the star in a group with a consistent outline. There are no scripts, rasters, fonts, external references or gradients, and every `url(#…)` points to a definition in the same file. Each file has a `<title>`.

IDs: `outdoors-abstract`, `outdoors-illustrated`, `support-abstract`, `support-illustrated`, `quick-response-abstract`, `quick-response-illustrated`, `phoenix-abstract`, `phoenix-illustrated`. Each theme's two designs share one palette. The themes follow the brief's art table and notes. In particular: an original, friendly dumpster with stylized flames (not an emoji copy), a ribbon with no medical or organizational claims, and an outdoor scene that is one coherent picture rather than four sport icons.

Four parallel agents draw the art, one per theme. Each checks its own work at large size and 64px. A final review compares all eight together for consistency before integration.

## Code

| File | Responsibility |
|---|---|
| `js/designs/content.js` | Theme, design and question data (`PROTOTYPE_VERSION = "1.0.0"`) |
| `js/designs/feedback.js` | Pure functions: `createEmptyFeedback`, `visibleFollowUps`, `toExportJson`, `toSummaryText`, `loadCompatible` (version check). Unanswered values are `null` or `[]` in JSON and "Not answered" in text |
| `js/designs/store.js` | `localStorage` key `all-star-studio.prototype-feedback.v1`. Every access is wrapped in try/catch and reports success or failure |
| `js/designs/page.js` | DOM rendering, events, the dialog, inline SVG loading with per-instance ID prefixing, and share/copy/download |
| `designs/index.html`, `css/designs.css` | Page shell and styles |

Inline SVG: `fetch` the file and rewrite every `id` and its `url(#…)`/`href="#…"` references with a unique per-instance prefix before inserting it. Download sends the unmodified file as a Blob.

## Testing

- `node --test tests/`: covers feedback serialization, unanswered values, follow-up visibility, the version mismatch path, and a summary that matches its choices. Tests use no dependencies.
- `node tests/check-svgs.mjs`: for each prototype, checks for no external references, scripts or images, that every `url(#)` resolves, that the viewBox is correct, and that the star polygon is present.
- Headless Chrome screenshots of the homepage and `designs/` at 360px and desktop width in light and dark, plus all eight SVGs at large and 64px sizes.
- Serve the parent directory and load `/all-star-studio/designs/` to check that links work under the repository subpath.
- Manual checks: keyboard through the page and the dialog, Copy fallback, and both downloads.

## Docs

The docs page links to the brief and to a short "Prototype iteration status" section listing what was built and the open decisions from the brief. CLAUDE.md gets the test commands.

## Out of scope

Everything the brief defers: star generation, editing, uploads, PNG export, cloud feedback, analytics.
