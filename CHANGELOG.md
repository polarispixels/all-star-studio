# Changelog

All notable changes to All-Star Studio are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning: [Semantic Versioning](https://semver.org/).

Policy: **MAJOR** = breaks saved data (`localStorage` keys or format) or the documented project data format;
**MINOR** = new user-visible page, feature, or theme; **PATCH** = fixes and small tweaks. The project stays
at 0.x until the full star maker from `docs/project-spec.md` ships as 1.0.0. Every release bumps `APP_VERSION`
in `js/version.js`, adds an entry here, updates the version badge in `docs/index.html`, and gets a git tag
`vX.Y.Z`. Data-format versions (`schemaVersion`, `rendererVersion`, `prototypeVersion`) are versioned separately.

## [Unreleased]

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

[Unreleased]: https://github.com/polarispixels/all-star-studio/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/polarispixels/all-star-studio/compare/v0.2.2...v0.3.0
[0.2.2]: https://github.com/polarispixels/all-star-studio/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/polarispixels/all-star-studio/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/polarispixels/all-star-studio/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/polarispixels/all-star-studio/releases/tag/v0.1.0
