# Changelog

All notable changes to All-Star Studio are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning: [Semantic Versioning](https://semver.org/).

Policy: **MAJOR** = breaks saved data (`localStorage` keys or format) or the documented project data format;
**MINOR** = new user-visible page, feature, or theme; **PATCH** = fixes and small tweaks. The project stays
at 0.x until the full star maker from `docs/project-spec.md` ships as 1.0.0. Every release bumps `APP_VERSION`
in `js/version.js`, adds an entry here, updates the version badge in `docs/index.html`, and gets a git tag
`vX.Y.Z`. Data-format versions (`schemaVersion`, `rendererVersion`, `prototypeVersion`) are versioned separately.

## [Unreleased]

## [0.9.1] - 2026-10-07

### Changed
- Becky's Groovy 70s star (now version 2): a second peace sign in the lower-right point, matching the upper-left
  one, per her change request.

## [0.9.0] - 2026-10-07

### Added
- **Becky's groovy 70s star** (from her first "Want your own star?" request: "Hippie 70's theme. Groovy"):
  a big smiling daisy over 70s sunset rainbow stripes, with a peace sign and two small daisies, on house shape B.
- **Members can have more than one star.** The roster's `extraStars` lists them. A member page shows every
  star with its own avatar previews and downloads. For a change request, the page asks "Which star is this
  about?", and the message names that star.

### Changed
- Becky's page is now "Becky's stars": Mountains and kayak, plus Groovy 70s.

## [0.8.0] - 2026-10-04

### Added
- **Team Star page** (`team/`): four lettered candidate logos for the whole team, for the contest due
  2026-10-22, all on house shape B:
  - **A. Colorful rays:** the homepage star.
  - **B. Pieces of everyone:** one symbol per arm (Becky's mountain, Scott's phoenix wing, Dixie's flame, the
    Detective's magnifying glass, the Support ribbon) around a gold center star.
  - **C. Puzzle mosaic:** 18 interlocking jigsaw pieces in the team colors.
  - **D. Five-piece puzzle:** one piece per arm, with knobs all turning the same way (exact five-fold symmetry).
- Each option shows real-use previews (email signature, Teams, circle, dark mode), Download PNG/SVG, an
  "Option X is my favorite" pick with notes, and the Send to Ryan section.
- `tools/build-team.mjs` generates A, C and D (seeded jigsaw edges, no `Math.random()`). Tests check D's
  symmetry, C's piece count and colors, and that the generated files are up to date.
- `js/pick-feedback.js`: a shared pick-one feedback model, now used by Star Shapes and Team Star.

### Changed
- Homepage: **Team Star** is the first big button, above Team Members.
- Star Shapes summary text uses the shared model's wording ("Notes:" and "Version").

## [0.7.1] - 2026-10-04

### Changed
- The Quick Response placeholder belongs to **Dixie**. The card and page now show her name, and the star moved to
  `assets/members/dixie.svg` with the page at `member/?id=dixie`. Old `?id=quick-response` links still work
  (roster `aliases`).

## [0.7.0] - 2026-10-04

### Added
- Three new placeholder member stars, on house shape B, waiting for teammates to claim them:
  - **Carousel:** a prancing carousel horse on a gold pole under a striped canopy (requested by Ryan; name is a
    placeholder).
  - **Lighthouse:** a striped lighthouse with beams fanning across the arms, a guiding light for mentors
    (inspired by the "rays from a center" heart style).
  - **Sprout:** a seedling in a pot held by cupped hands, for helping others grow (inspired by the Green Team and
    Mental Well-Being hearts).

## [0.6.0] - 2026-10-04

### Added
- **Team Members** (`members/`): a card per All-Star with their star. **Becky** (mountains and kayak), **Scott**
  (phoenix), **Detective** (new magnifying-glass star for Becky's boss), plus placeholders **Quick Response**
  (redrawn per Becky's note: turquoise added, red and yellow flames kept, a mix of picture and pattern) and
  **Support and Care**. A "Want your own star?" card leads to a new-star request.
- **Member page** (`member/?id=…`): the star large, avatar previews (tiny, small, in a circle),
  **Download for Teams / Outlook** (1024px PNG on a white square, with a 512px fallback), Download SVG, and
  "What would you change about your star?" with Share or Copy to Ryan (request and redraw). Drafts are saved
  in the browser.
- `js/png.js` (SVG to PNG), `js/members/roster.js`, `js/members/request.js`, member tests, and Team Members
  browser checks.

### Changed
- **House star shape is now B, "Softened points"** (Becky's pick), replacing F from v0.5.0. Every star was
  re-shaped: homepage, Star Designs, and member stars. `tools/apply-default-shape.mjs` now converts any known
  shape path, so a future house-shape change is one setting plus one command. Star Designs
  `PROTOTYPE_VERSION` is now 1.2.0.
- Homepage: **Team Members** is the main button, and the earlier pages sit under "Earlier ideas".

## [0.5.0] - 2026-10-04

### Changed
- **Shape F, "Squared and softened," is the house star silhouette.** The homepage star, the favicon, and all
  eight Star Designs stars (including the Support designs' inner frames) now use it. `DEFAULT_SHAPE_ID` in
  `js/star-shape.js` controls it, and `tools/apply-default-shape.mjs` re-shapes star artwork.
- Star Designs `PROTOTYPE_VERSION` is now 1.1.0 because the artwork changed. Answers saved on 1.0.0 are kept
  and offered as a download, never attached to the new art.
- Star Shapes page notes the decision. Homepage line: "Our star shape is chosen. Team Members is coming next."
- The SVG checker now requires the house silhouette instead of the original sharp star.

## [0.4.2] - 2026-10-04

### Changed
- Star Shapes are lettered **A–F** (badge on each card, "Shape D is my favorite" tiles, A–F jump links, and
  letters in the summary, e.g. "Favorite shape: D. Plump"), so they're easy to name over the phone.

### Fixed
- The star in the "In a circle" avatar preview was about 4px right and down of center: the art was sized to
  the circle's outer width and overflowed its 2px border. It now fills the inner circle and is centered
  (a browser check verifies within 0.5px).

## [0.4.1] - 2026-10-04

### Added
- Sixth star shape, **Squared and softened** (`blend`): a shorter flat cut on each point than Squared-off
  (70 vs 100 units back along the edges), with a gentle 30-unit radius on every corner, to match the
  company heart's style. Requested by Ryan. Saved shape answers stay valid.

## [0.4.0] - 2026-10-04

### Added
- **Star Shapes page** (`shapes/`): five star silhouettes in the friendly, rounded style of the company heart
  (Classic, Softened points, Chunky and round, Plump, Squared-off). Each is shown plain, with Becky's kayak star,
  and at avatar sizes, including a circle crop. She picks a favorite, can add notes, and sends answers with the
  same Share/Copy/Download flow.
- `js/star-shape.js`: reusable rounded/chamfered star geometry. `tools/build-shapes.mjs` generates
  `assets/shapes/*.svg` from it.
- Tests for the shape feedback model and shape assets (including a check that the assets match the generator),
  and Star Shapes checks in `tools/browser-check.html`.

### Changed
- Homepage: **Star Shapes** is now the main button. Star Designs and Heart Examples are secondary.
- Shared page helpers moved to `js/ui.js`, and storage to `js/store.js`. Star Designs behavior is unchanged.

## [0.3.1] - 2026-10-04

### Changed
- Docs page rewritten as a current-state page for people and agents: what is live, recent releases,
  feedback from the v0.3.0 review, open decisions, a document index with statuses, and development notes.
- `docs/project-spec.md` gets a status note: long-term direction, not yet built.
- Release checklist now includes updating the docs page; a test checks that every release is listed there.

## [0.3.0] - 2026-10-04

### Added
- **Star Designs page** (`designs/`): four ideas (Outdoor All-Star, Support and Care, Quick Response,
  Phoenix Rising), each drawn two ways as original SVG stars, "Colors and patterns" and "Pictures and
  symbols", with a one-sentence rationale and proposed colors.
- Per-idea preference choice and "What would you change?" comments.
- Look closer view with a 64px "Small badge preview" switch, and SVG download for every star.
- Short optional questionnaire with conditional follow-ups (outdoor activities, picture style, contest rules).
- Send to Ryan: live summary, Share (on supporting devices), Copy with a select-text fallback, and text and
  JSON downloads. Answers save in the browser under a versioned key. Changed designs start a fresh review
  and keep earlier answers downloadable.
- Tests for feedback serialization, follow-ups, version handling, and SVG self-containment, plus
  `tools/svg-preview.sh` and the local `tools/browser-check.html` interaction check.

### Changed
- Homepage: the coming-soon line is now an invitation, with **Star Designs** and **Heart Examples** buttons.
- Docs page: links to the iteration brief and design spec, and a status section listing open decisions.

## [0.2.2] - 2026-10-04

### Added
- Design spec for the Star Designs gallery and preference questions, plus the iteration brief, in `docs/`.
- Versioning policy, this changelog, `js/version.js`, a small version stamp on the homepage, a version badge on
  the docs page, and a test that keeps them in sync.

## [0.2.1] - 2026-10-04

### Changed
- The homepage link to the heart examples is now a large **Ideas** button.

## [0.2.0] - 2026-10-04

### Added
- Heart examples page (`ideas/`): CVS Health heart pin photos grouped by color-and-pattern technique, under a
  prominent "for brainstorming only" disclaimer, linked from the homepage.

## [0.1.0] - 2026-10-04

### Added
- Coming-soon homepage with a colorful star logo, docs landing page, project spec, and GitHub Pages deployment.

[Unreleased]: https://github.com/polarispixels/all-star-studio/compare/v0.9.1...HEAD
[0.9.1]: https://github.com/polarispixels/all-star-studio/compare/v0.9.0...v0.9.1
[0.9.0]: https://github.com/polarispixels/all-star-studio/compare/v0.8.0...v0.9.0
[0.8.0]: https://github.com/polarispixels/all-star-studio/compare/v0.7.1...v0.8.0
[0.7.1]: https://github.com/polarispixels/all-star-studio/compare/v0.7.0...v0.7.1
[0.7.0]: https://github.com/polarispixels/all-star-studio/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/polarispixels/all-star-studio/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/polarispixels/all-star-studio/compare/v0.4.2...v0.5.0
[0.4.2]: https://github.com/polarispixels/all-star-studio/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/polarispixels/all-star-studio/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/polarispixels/all-star-studio/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/polarispixels/all-star-studio/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/polarispixels/all-star-studio/compare/v0.2.2...v0.3.0
[0.2.2]: https://github.com/polarispixels/all-star-studio/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/polarispixels/all-star-studio/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/polarispixels/all-star-studio/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/polarispixels/all-star-studio/releases/tag/v0.1.0
