# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status

A coming-soon page is live; the app itself isn't built yet. The authoritative specification is `docs/project-spec.md` (v1.0, 2026-10-04). Read the relevant section before building a feature. Follow the milestone order in spec §15: the rendering engine comes first, and language interpretation waits until clean stars can be generated.

The repo is `polarispixels/all-star-studio` (public). GitHub Pages builds from the `main` branch root, so **every push to `main` deploys to the live URL that Ryan's mother has bookmarked**. Keep `main` working and don't remove the entry page.

`ideas/` is a brainstorming page that shows CVS Health's heart pin photos (from their public merch store) under a red disclaimer banner. Those images are reference only. Never copy them, or derive artwork from them, into the app or `assets/`. The spec's "no CDN/third-party assets" rule applies to the app, and `ideas/` follows it too: its images are stored locally.

All-Star Studio is a browser tool that generates five-point star artwork. Each region's color and pattern represents a user-defined concept. The first user is Ryan's mother, who is designing for a logo contest and isn't a designer. Use plain-language labels and show useful presets before she types anything.

## Commands

No build step, bundler, or package manager is needed to run the app.

```bash
python3 -m http.server 8000   # then open http://localhost:8000/ (ES modules fail over file://)
```

No test runner has been chosen yet; tests live in `tests/`. When one is added, document how to run the suite and a single test here.

## Hard constraints

- **Stack:** plain HTML, CSS, and ES-module JavaScript with native SVG. Don't add a framework, bundler, drawing, triangulation, or clipping library, and don't add a backend.
- **No external runtime resources:** no CDN scripts, web fonts, analytics, or network calls during design operations. Use system fonts. Any vendored library must have its version pinned and its license tracked.
- **No AI API:** the description helper is a small, documented local parser. Never call it an "AI designer," and never fabricate an interpretation. If the text is ambiguous, ask the user to edit the concept rows.
- **No CVS artwork or symbolism:** don't copy proprietary artwork or claim official color meanings. Users define all meanings.
- **GitHub Pages subpath:** the app is served at `https://polarispixels.github.io/all-star-studio/` from the repo root on `main`, and docs at `/docs/` via `docs/index.html`. Use only relative links (`./js/app.js`) and never root-absolute ones (`/js/...`). Keep `.nojekyll`. Don't add a client-side router.
- **Equal concept emphasis:** V1 doesn't do area weighting, so never present unequal geometric areas as meaningful weights.

## Architecture

**"Meaning becomes structured data. Code draws the star."** The serializable **StarSpec** JSON (schema in spec §8) is the single source of truth. Never persist DOM nodes or SVG markup as project data.

The design engine (`spec.js`, `renderer.js`, `compositions.js`, `patterns.js`, `story.js`) must be pure and UI-independent. Its expected functions are `validateSpec`, `normalizeSpec`, `generateVariants`, `buildGeometry`, `renderSvg`, and `buildStory`. `app.js` handles interaction, and `storage.js` and `export.js` handle persistence and output. `description-parser.js` turns prose into *proposed* field changes that the user reviews before they apply.

Rules that span several modules:

- **Determinism:** the renderer uses a locally implemented, documented seeded PRNG, never `Math.random()`. The same normalized spec and `rendererVersion` must produce byte-identical SVG after canonical serialization, so keep timestamps and unstable IDs out of it. Engine changes must keep old renderer versions reproducible or offer an explicit migration with a warning that geometry may change.
- **One renderer:** the SVG shown in the UI is the same SVG that gets exported. PNG export rasterizes that SVG: Blob → Image → Canvas → `toBlob`. There is no second drawing path.
- **SVG ID collisions:** six previews share the page, so every `<clipPath>`/`<pattern>` ID must be unique per instance. These IDs are generated per render and must stay out of the canonical/determinism comparison.
- **Geometry:** viewBox is `0 0 1000 1000` with padding so outlines aren't clipped. The star has 10 alternating outer and inner vertices, and its clip path bounds every composition (mosaic, facets, rays, bands). Every concept needs a *visibly meaningful* region, checked by clipped area or deterministic sampling, with bounded retries and then a reproducible fallback. Tiny slivers don't count.
- **Seed semantics (spec §6):** a change to a color, meaning, or pattern keeps the seed. Shuffle changes only the seed. A composition change keeps the concepts, palette, and seed. "More like this" uses explicit derived seeds. Generation never overwrites saved designs, and the palette is never recolored implicitly.
- **Story:** it's generated from a template using only user meanings. Once `story.manuallyEdited` is true, never auto-overwrite it. Offer "Regenerate story" instead, and flag when the prose may be stale.
- **Untrusted input:** imported JSON is limited to 1 MiB and is validated and normalized to known fields before rendering (length and enum limits are in spec §8). All user text is rendered as text, never as HTML.
- **Storage:** use namespaced, versioned localStorage keys, autosave with a debounce, and keep at most 24 saved designs. A storage failure must never block editing or export. Other Pages projects share the `polarispixels.github.io` origin.

## Verification

Before calling a milestone done, check it against the acceptance criteria in spec §14. Automated tests should cover determinism, validation, concept visibility, variant semantics, story edit protection, and JSON round trips. Check exports and compositions visually. Test at both `localhost:8000/` and a repository subpath. Report which browsers were actually tested.
