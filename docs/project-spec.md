# All-Star Studio

Project specification, version 1.0, October 4, 2026

**Tagline:** Turn an idea into a star.

## 1. Purpose

Build a browser-based design tool that creates five-point stars whose colors and patterns represent ideas, teams, causes, or values. The initial user is Ryan's mother, who wants to explore designs for a logo contest.

The inspiration is the use of thematic colors and patterns inside CVS heart designs. The application creates its own star artwork. Do not copy proprietary artwork or assume that any particular color has an official CVS meaning. Users define the meanings themselves.

The central principle is: **Meaning becomes structured data. Code draws the star.**

The deliverable is usable design software, with reproducible vector artwork, editable meanings, and downloadable files. This specification does not authorize deployment or create a repository.

## 2. Decisions

| Area | Decision |
|---|---|
| Product name | All-Star Studio |
| Repository slug | `all-star-studio` |
| Hosting | GitHub Pages, matching the existing Block Buddies project URL convention |
| Application | `https://polarispixels.github.io/all-star-studio/` |
| Documentation | `https://polarispixels.github.io/all-star-studio/docs/` |
| Runtime | Static HTML, CSS, and modern JavaScript ES modules |
| Artwork | Native SVG, generated deterministically |
| Raster exports | Browser Canvas API |
| Persistence | Browser local storage plus explicit JSON downloads |
| Runtime dependencies | None required for V1 |
| Paid services | None |
| Backend and accounts | None |
| Description interpretation | Limited local parsing plus editable controls |
| General AI interpretation | Optional later enhancement, never required for core functionality |

GitHub Pages serves static HTML, CSS, and JavaScript. A project site uses the repository name beneath the account domain. The proposed addresses follow the same public URL structure as Block Buddies; this is not a claim about its underlying source layout.

Hosting is an external service dependency. “Self-contained” here means that after loading, generation, editing, saving, and exporting happen locally without calls to a design service, AI API, CDN, or backend. Do not promise offline reopening in V1; an installable offline cache is a later feature.

## 3. Technology recommendation

Use plain JavaScript with ES modules, native SVG, CSS, and HTML forms. This application does not initially justify Laravel, a database, a frontend framework, a drawing library, or a bundler. Keep the design engine independent of the UI so a framework can be introduced later if needed.

Use system fonts and locally stored assets. Do not load fonts, scripts, or images from third-party CDNs. Development tools may be open source and locally installed, but published application assets must be self-contained. Track licenses for any added library and pin its version.

Native SVG supports scalable geometry, clipping paths, reusable patterns, and editable vector output. Canvas converts the exported SVG to PNG. Render the same SVG in the interface and export it; do not maintain separate artwork renderers.

### AI constraint

An arbitrary prose description is not reliably interpreted by a few keyword rules. V1 must be honest about this limitation. The description helper extracts supported instructions and presents them for review. The structured editor always works without it.

Do not quietly introduce a paid model API, expose API keys in the browser, depend on an unreliable free endpoint, or download a large local model by default. A browser-local open-source model can be evaluated later, with explicit download consent, licensing review, performance checks, and a fallback for unsupported devices.

For richer interpretation before that integration exists, users can manually obtain StarSpec JSON from an external assistant and import it. The application itself remains independent of that assistant.

## 4. Users and core journey

The main user understands what the star should represent but may not know design terminology. Favor large previews, clear labels, plain language, and useful starting presets.

1. Open the app and see six example stars immediately.
2. Enter a title and description, or choose a preset.
3. Choose four to eight concepts and their meanings, colors, and patterns.
4. Generate six interpretations of those same concepts.
5. Select a favorite and adjust its palette, composition, or complexity.
6. Read and edit the Star Story.
7. Download SVG, PNG, and the editable project JSON.

Make the app useful before the user types a description. Start with an editable example such as “Different strengths, one team.”

## 5. V1 scope

### Included

- One consistent five-point star silhouette.
- Four to eight semantic concepts.
- Editable title, description, concept names, meanings, colors, and patterns.
- Four composition families: mosaic, facets, rays, and bands.
- Three patterns: solid, diagonal stripes, and dots.
- Six deterministic variants per generation.
- Selected-design editor with live preview.
- Simple description helper with visible interpretation results.
- Seed-based reproduction and “Shuffle layout.”
- Template-generated, editable Star Story.
- Browser autosave and a small local saved-design gallery.
- Export SVG, transparent PNG, white-background PNG, project JSON, and story text.
- JSON import with validation.
- Responsive desktop and phone interface.
- Published documentation under `/docs/`.

### Deferred

- General natural-language AI interpretation.
- Exact weighted color-area allocation.
- Puzzle-piece composition, quilt composition, gradients, and additional patterns.
- Automatic palette optimization and formal color accessibility assessment.
- Cloud sync, accounts, collaboration, and server storage.
- Button, shirt, and presentation mockups.
- PDF contest presentation.
- Service worker, installation, and guaranteed offline reopening.

V1 uses equal conceptual emphasis. It does not expose an importance slider or claim that each concept occupies an exact percentage of the visible star. Unequal geometric areas must not be presented as semantic weighting.

## 6. Interface requirements

### Main workspace

At the top, show the name, tagline, and a short description: “Give each color a meaning. Make a star that tells your story.”

Use these sections:

| Section | Controls and behavior |
|---|---|
| Describe your star | Title, description, and “Apply description” |
| Choose your meanings | Four to eight editable concept rows |
| Choose a look | Composition selector, low/medium/high detail, outline toggle |
| Explore designs | Six previews with selection state and labels |
| Refine your favorite | Large preview, composition and palette controls, shuffle |
| Star Story | Editable explanation plus a color-and-pattern legend |
| Save and download | Local save and explicit export buttons |

Each concept row contains a stable ID, name, meaning, color picker with hexadecimal input, and pattern selector. Users can reorder rows. Show validation next to the affected field.

On desktop, place controls beside the selected preview. On phones, stack sections and avoid horizontal scrolling. Support keyboard navigation and distinguish selection with text and a border, not color alone.

### Refinement behavior

- Changing a color, meaning, or pattern preserves the layout seed.
- “Shuffle layout” changes the seed while preserving concepts and palette.
- Changing composition preserves concepts, palette, and seed, but changes geometry.
- “Simplify” reduces cell count or band count without dropping concepts.
- “More like this” produces six nearby variants in the selected composition family, with explicit derived seeds.
- Generation never overwrites explicitly saved designs.

Reserve “Change colors” for deliberate palette changes. Do not silently recolor concepts when shuffling geometry.

## 7. Description helper

Run entirely in the browser. Support simple, documented phrases for:

- Named colors and hexadecimal colors.
- Four to eight colors, when explicitly requested.
- Composition names and limited synonyms, such as “stripes” for bands.
- Pattern names.
- Explicit mappings such as “blue represents knowledge; gold represents teamwork.”

Display the proposed fields before applying them. Preserve user edits unless an explicit replacement is accepted. If the text is ambiguous, ask the user to edit the concept rows rather than fabricating an interpretation.

Store the original description even when extraction is incomplete. Show a message such as: “I found two color meanings. Add the others below.” Do not describe this helper as an AI designer.

Provide a help example:

> Six colors. Blue represents knowledge; gold represents teamwork; coral represents compassion; purple represents innovation; teal represents reliability; green represents community. Use mosaic with light detail.

## 8. Design data model

Keep a serializable StarSpec as the source of truth. Do not serialize browser DOM nodes or executable SVG markup as project data.

```json
{
  "schemaVersion": 1,
  "rendererVersion": "1.0.0",
  "id": "design-unique-id",
  "title": "Different strengths, one team",
  "description": "Our pharmacy team brings six strengths together.",
  "composition": "mosaic",
  "detail": "medium",
  "seed": 48392,
  "star": {
    "points": 5,
    "innerRadiusRatio": 0.45,
    "rotationDegrees": -90
  },
  "outline": {
    "enabled": false,
    "color": "#243447",
    "width": 2
  },
  "concepts": [
    { "id": "knowledge", "name": "Knowledge", "meaning": "Experience shared across teams", "color": "#24558A", "pattern": "solid" },
    { "id": "teamwork", "name": "Teamwork", "meaning": "Different strengths working together", "color": "#F2B21A", "pattern": "diagonal" },
    { "id": "compassion", "name": "Compassion", "meaning": "Care for every person", "color": "#E56B6F", "pattern": "solid" },
    { "id": "innovation", "name": "Innovation", "meaning": "Better ways to solve problems", "color": "#8056A6", "pattern": "dots" },
    { "id": "reliability", "name": "Reliability", "meaning": "People can count on us", "color": "#188C93", "pattern": "solid" },
    { "id": "community", "name": "Community", "meaning": "Supporting the people around us", "color": "#4C9653", "pattern": "diagonal" }
  ],
  "story": {
    "text": "Different strengths come together in one star.",
    "manuallyEdited": false
  }
}
```

Validation: require four to eight concepts, unique IDs, nonempty names, valid six-digit hex colors, allowed enum values, a finite unsigned 32-bit seed, and supported schema and renderer versions. Bound title and name lengths to 120 characters, meanings to 500, description and story to 5,000, and imported file size to 1 MiB. Reject invalid geometry, unknown required versions, and excessive data before rendering. Unknown optional fields may be ignored with a warning.

Normalize imported objects into known fields. Render user text as text, never HTML. Duplicate colors are permitted but should produce a useful advisory. Keep timestamps and export settings outside the artwork specification because they do not affect geometry.

## 9. Rendering engine

Expose pure functions such as `validateSpec`, `normalizeSpec`, `generateVariants`, `buildGeometry`, `renderSvg`, and `buildStory`. UI code owns interaction and persistence.

### Geometry

Use a fixed SVG viewBox, for example `0 0 1000 1000`, with enough padding to avoid clipping outlines. Compute ten alternating outer and inner vertices for the star. Use a clip path for internal shapes and patterns. Every preview must use unique internal SVG IDs to prevent collisions between six designs.

| Composition | V1 construction |
|---|---|
| Mosaic | Jittered triangular grid, deterministic cell grouping, clipped to the star |
| Facets | Angular triangles subdivided from the center and star boundary |
| Rays | Radial sectors from a near-central origin, clipped to the star |
| Bands | Parallel bands with seed-selected angle and phase, clipped to the star |

Do not require a third-party triangulation or clipping library for these initial constructions. Prefer bounded procedural geometry to arbitrary polygon operations.

Assign concepts deterministically. Ensure every concept has a visibly meaningful region inside the star. Validate visibility using clipped area measurement or deterministic interior sampling; retry with bounded attempts or use a known-valid fallback. Tiny fragments do not count as a represented concept. The fallback must remain reproducible.

Use fixed pattern scales in viewBox coordinates. Pattern marks use a consistent light or dark overlay selected for contrast against their base color. The legend shows both color and pattern. Do not claim formal accessibility compliance merely because patterns exist.

### Determinism

Use a documented seeded pseudorandom generator implemented locally. Avoid `Math.random()` in the renderer. Identical normalized specs and renderer versions must produce identical geometry, colors, and SVG bytes after canonical serialization. Exclude timestamps and unstable generated IDs from that serialization.

Retain renderer version compatibility when the engine changes. On importing an unsupported renderer version, offer an explicit migration with a warning that geometry may change. A previously exported SVG always remains the exact artwork record.

## 10. Variants and story

Generate six previews: initially one for each composition plus two additional mosaic/facet variants. Share concept IDs, meanings, and palette across them. Store the actual seed and composition of each selected design.

Generate the Star Story through a local template using user-provided meanings. Example:

> Knowledge is represented by blue and stands for experience shared across teams. Teamwork is represented by gold and stands for different strengths working together. Each part contributes to one star.

Avoid invented corporate claims or color symbolism. Users can edit the complete story. Once edited, do not overwrite it automatically; provide “Regenerate story.” Keep the current legend synchronized with concept colors and patterns, and flag when concept edits may have made the custom prose outdated.

## 11. Export requirements

| Export | Requirements |
|---|---|
| SVG | Standalone SVG with viewBox, local defs, embedded styles, title and description; no external resources or scripts |
| Transparent PNG | Default 2,048 × 2,048, optional 4,096 × 4,096; preserved alpha |
| White PNG | Same artwork, rendered onto a white background |
| Project JSON | Complete validated StarSpec, suitable for exact supported-version reproduction |
| Story text | Title, explanation, and human-readable color/pattern legend |

Export the selected design, not an arbitrary thumbnail. Keep the star artwork separate from title and legend; downloaded SVG and PNG contain only the star. Offer accessible metadata inside SVG without placing explanatory text in the graphic.

Serialize SVG to a Blob, decode it as an image, draw it on Canvas, and download PNG via `toBlob`. Avoid external resources that taint Canvas. Release temporary object URLs. Show actionable export errors, including memory limits on phones; offer a lower resolution if needed.

Pixels do not establish a print size by themselves. Explain that a 4,096-pixel PNG supports about 13.7 inches at 300 pixels per inch. Recommend SVG for vector production workflows. Use filenames such as `team-star-mosaic-48392.svg`.

## 12. Saving and privacy

Autosave the current project after a short debounce. Allow up to 24 explicitly saved designs with a name, date, and preview generated from their specs. Use a project-specific storage key and version the storage format. Handle storage failures without blocking editing or export.

State clearly: “Saved designs stay in this browser. Download the project file to keep a backup or move it to another device.” Local storage may be cleared and is not a reliable permanent backup.

GitHub Pages projects under the same account share an origin. Namespaced keys prevent accidental collisions but do not provide security isolation from other scripts served on that origin. Do not encourage storing sensitive workplace information.

No analytics, tracking pixels, authentication, or uploading user descriptions in V1. Network access during initial page loading is expected; design operations must not send data off-device.

## 13. Repository and hosting structure

```text
all-star-studio/
  index.html
  .nojekyll
  README.md
  LICENSE
  css/styles.css
  js/app.js
  js/spec.js
  js/renderer.js
  js/compositions.js
  js/patterns.js
  js/description-parser.js
  js/story.js
  js/export.js
  js/storage.js
  assets/
  docs/index.html
  docs/project-spec.md
  docs/user-guide.md
  docs/architecture.md
  docs/backlog.md
  tests/
```

Publish the repository root from the main branch with GitHub Pages. `.nojekyll` ensures assets are served without Jekyll processing. The nested `docs/index.html` creates the requested documentation address. Do not publish only the source `docs` directory, which would put the documentation at the application root.

Use relative asset links, such as `./js/app.js`, and relative documentation links appropriate to their directory. Avoid root-absolute paths such as `/js/app.js`; those would bypass `/all-star-studio/`. Use no client-side router in V1. Test direct navigation and refresh at both the app and documentation URLs.

The documentation landing page should be readable HTML with links to downloadable Markdown. Raw Markdown is not automatically a polished documentation site under this no-build setup. A locally vendored Markdown converter can be added later if needed.

For local development, serve the repository with a static HTTP server, for example `python3 -m http.server 8000`. Do not rely on opening ES modules through `file://`. Verify deployment beneath a repository subpath as well as local development at the server root.

## 14. Quality and acceptance criteria

V1 is complete when:

1. App and docs load at their proposed project paths with no broken asset links.
2. A first-time user can start from a preset, select a star, and download it without instructions.
3. Users can create, edit, reorder, add, and remove concepts within the four-to-eight limits.
4. Six variants preserve all concepts and their defined meanings and colors.
5. Every concept has a visible region in every valid generated design.
6. Same spec plus supported renderer version produces the same artwork after reload and JSON import.
7. Color and pattern edits preserve geometry; layout shuffling preserves the palette and meanings.
8. All SVG artwork stays within the star boundary and outlines are not clipped.
9. SVG opens independently; PNG exports have correct dimensions and background treatment.
10. Saved designs restore after reload; storage failure still permits project download.
11. Malformed or oversized imports fail with clear errors and cannot inject HTML or scripts.
12. Editing a story protects it from automatic replacement.
13. Core design operations make no network requests after initial assets load.
14. The interface works with keyboard input and on a typical Android phone and desktop browser.

Target a six-preview generation time under one second on a representative current desktop, and under two seconds on a typical phone at default detail. Measure before adding complexity. Limit detail levels to bounded geometry counts.

Use focused automated tests for seeded determinism, validation, concept visibility, variant semantics, story edit protection, and JSON round trips. Verify exports and representative compositions visually. Exercise current Chrome/Android Chrome, Edge, Firefox, and Safari where available; report actual coverage rather than claiming untested compatibility.

## 15. Implementation sequence

| Milestone | Deliverable |
|---|---|
| 1. Rendering foundation | Validated StarSpec, seeded geometry, one star, four composition families, self-contained SVG |
| 2. Working editor | Concept controls, six previews, selection, patterns, live refinement |
| 3. Durable output | PNG export, JSON import/export, local saves, story text |
| 4. Ease of use | Presets, limited description helper, mobile and keyboard improvements |
| 5. Release preparation | Focused checks, readable docs, repository-subpath verification, deployment instructions |

Build and evaluate the rendering engine before investing in language interpretation. The first milestone must already produce clean stars suitable for evaluating the contest idea.

## 16. Later decisions

- Confirm contest requirements: dimensions, permitted shape, official palette, pattern restrictions, text, and accepted file formats.
- Ask the user to supply official meanings if CVS-specific presets are requested.
- Determine whether approximate emphasis or exact visible-area weights are actually needed before expanding the geometry engine.
- Assess whether browser-local AI improves the user experience enough to justify its download and hardware requirements.
- Add button mockups and a contest presentation only after the artwork generation is satisfactory.

## 17. Technical references

- GitHub Pages overview and project-site URL structure: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- GitHub Pages quickstart: https://docs.github.com/en/pages/quickstart

These references describe the hosting platform. The application behavior and scope above are project design decisions.
