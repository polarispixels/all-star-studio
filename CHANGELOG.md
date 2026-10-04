# Changelog

All notable changes to All-Star Studio are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning: [Semantic Versioning](https://semver.org/).

Policy: **MAJOR** = breaks saved data (`localStorage` keys or format) or the documented project data format;
**MINOR** = new user-visible page, feature, or theme; **PATCH** = fixes and small tweaks. The project stays
at 0.x until the full star maker from `docs/project-spec.md` ships as 1.0.0. Every release bumps `APP_VERSION`
in `js/version.js`, adds an entry here, updates the version badge in `docs/index.html`, and gets a git tag
`vX.Y.Z`. Data-format versions (`schemaVersion`, `rendererVersion`, `prototypeVersion`) are versioned separately.

## [Unreleased]

### Added
- Design spec for the Star Designs gallery and preference questions, plus the iteration brief, in `docs/`.

## [0.2.2] - 2026-10-04

### Added
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

[Unreleased]: https://github.com/polarispixels/all-star-studio/compare/v0.2.2...HEAD
[0.2.2]: https://github.com/polarispixels/all-star-studio/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/polarispixels/all-star-studio/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/polarispixels/all-star-studio/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/polarispixels/all-star-studio/releases/tag/v0.1.0
