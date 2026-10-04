# All-Star Studio: Four Themes and Preference Discovery

Coding-agent handoff, October 4, 2026

## Objective

Build the next iteration of the existing All-Star Studio website as a visual prototype gallery and a short preference-discovery flow. Help the primary user compare actual designs before deciding which editor capabilities to build.

Deliver **four prototype themes, each with two visual interpretations: eight star designs total**. Follow the gallery with questions grounded in those designs. This iteration is a design experiment, not the complete generator.

## Existing project and constraints

- Inspect the existing repository, README, project instructions, and documentation before editing. Follow its established implementation and deployment workflow.
- Application URL: `https://polarispixels.github.io/all-star-studio/`.
- Documentation URL: `https://polarispixels.github.io/all-star-studio/docs/`.
- The observed landing page contains the product name, a patterned star, the tagline “Turn an idea into a star,” a design-ideas link, and a project-documentation link.
- Preserve existing content and useful routes. Integrate this work with the actual repository structure rather than assuming the original proposed file layout was implemented.
- Keep the site static and compatible with GitHub Pages repository-subpath hosting. Use relative asset links. Do not introduce a server, accounts, database, paid service, hosted AI, CDN, or mandatory third-party runtime dependency.
- Prefer native SVG, HTML, CSS, and JavaScript. If an existing suitable framework is already in use, keep it rather than rewriting the project.
- The earlier broad project specification remains the long-term direction. This brief defines the next iteration and takes precedence where its narrower scope differs.

## Evidence behind the iteration

The primary user supplied these ideas:

1. “I am an All-Star. I enjoy outdoor activities like camping, kayaking, snorkeling & skiing. I love nature and try to think outside the box.”
2. A teammate wants a star showing support for breast cancer.
3. A teammate uses a dumpster-fire emoji to identify her quick responses and would enjoy incorporating it into a star.
4. Another teammate chose a phoenix rising.

These examples require testing recognizable imagery alongside semantic colors and patterns. They do not establish a final palette, official CVS symbolism, or a requirement to fit every hobby into a single design.

## Scope

### Build now

- Eight original vector prototype designs across four themes.
- Side-by-side abstract and illustrated comparisons.
- A larger inspection view and a small-size preview.
- A favorite choice for each theme.
- A brief preference questionnaire with conditional follow-ups.
- Local feedback persistence, a readable summary, copy/download controls, and JSON export.
- Individual prototype SVG downloads.
- Updated documentation explaining what was built and what remains undecided.

### Defer

- General star generation, prompt interpretation, and AI integration.
- Full vector editing, dragging, arbitrary uploads, or an expansive symbol library.
- Cloud feedback collection, analytics, accounts, or automatic message sending.
- Production print packages, PNG export, mockup generation, and full design history.

Do not expand the existing generator if one already exists merely to produce this gallery. Reuse appropriate rendering pieces, but keep the prototype experiment small.

## Design experiment

Use the same five-point star silhouette and consistent presentation across all eight designs. Every design must look intentional and be recognizable as a star. The illustrated versions must be polished enough that users are comparing approaches rather than finished artwork against rough placeholders.

| Theme | Option A: Colors and patterns | Option B: Pictures and symbols |
|---|---|---|
| Outdoor All-Star | Greens, blues, snow white, warm sunlight; geometric mountain-like facets and wave patterns | A simplified mountain, evergreen trees, water, and a clear kayak motif inside the star |
| Support and Care | Pink shades with gentle bands or interwoven areas suggesting connection | A clear pink awareness ribbon against a restrained, supportive background |
| Quick Response | Angular flame-colored shapes, urgent upward movement, a grounded dark area | A playful original dumpster with stylized flames, clearly legible inside the star |
| Phoenix Rising | Upward feather/flame-like geometry in gold, orange, red, and deep violet | A recognizable bird silhouette with rising wings and a flame-inspired lower body |

### Theme-specific notes

**Outdoor All-Star:** Do not crowd Option B with four separate sport icons. Mountains can suggest skiing; water and a kayak represent outdoor adventure. Capture a coherent nature scene. Ask later which activities deserve explicit inclusion, including camping and snorkeling.

**Support and Care:** Keep the design warm and respectful. Present pink as a proposed design choice. Make the ribbon recognizable without adding medical claims or implying organizational affiliation.

**Quick Response:** Keep the humor friendly. Preserve the user's association with quick responses instead of labeling the teammate chaotic or incompetent. Draw original SVG artwork; do not paste a platform-specific emoji image. Keep flames stylized.

**Phoenix Rising:** Communicate upward motion. Present renewal and resilience as proposed interpretations for review, not meanings already confirmed by the user.

### Fair comparisons

- Both options within a theme use the same palette, silhouette, approximate visual detail, and display size.
- Put titles and explanations outside the star artwork.
- Start with all artwork contained inside the silhouette.
- Defer boundary-breaking artwork until the user answers the relevant question. “Thinking outside the box” does not automatically authorize a broken star outline.
- Use stable IDs such as `outdoors-abstract` and `outdoors-illustrated`.
- Avoid gradients and tiny decorative details in this iteration unless essential to readability.
- Avoid using color alone to show selection.
- Every prototype includes a one-sentence design rationale and a color legend described as a proposal.

## Gallery experience

Replace the main “Coming soon” block with an invitation:

> Help shape All-Star Studio. Explore four ideas, then tell us what feels right.

Provide a “See the four ideas” action. Keep the existing design-inspiration and documentation links available.

Show each theme as a distinct section with:

1. Theme title and a short statement of the original idea.
2. Two equally sized artwork cards, labeled “Colors and patterns” and “Pictures and symbols.”
3. A one-sentence rationale for each.
4. A selection group: “Which direction do you prefer for this idea?”
5. Choices: “Colors and patterns,” “Pictures and symbols,” “A mix of both,” and “Neither yet.”
6. Optional text: “What would you change?”

Let users inspect a large preview and toggle a small preview at approximately 64 CSS pixels. Label the small view “Small badge preview”; it is a readability check, not a physical print proof. Any modal must manage focus, close with Escape, and return focus to its opener.

Display the pairs in two columns on desktop and stacked on phones. Keep the choices next to their theme. Do not force users through a slideshow or require all answers before browsing.

## Preference questions

After the four comparisons, provide a short form introduced by:

> A few choices will help us build the right tools for you.

All questions are optional. Do not require names, email addresses, or teammate information.

| ID | Question | Choices or input |
|---|---|---|
| `favorite_design` | Which example would you most like to develop further? | Eight labeled artwork thumbnails, plus “Not sure yet” |
| `overall_direction` | What should your star mainly use to tell its story? | Colors and patterns; Pictures and symbols; A mix; Depends on the idea |
| `detail_level` | How much detail feels right? | Simple and bold; A few clear details; Rich and detailed |
| `boundary` | Should the design stay inside the star? | Entirely inside; A small part may extend outside; Either could work |
| `color_control` | How would you like to choose colors? | Pick my own; Start with suggested colors and adjust; Use suggested colors |
| `starting_method` | How would you like to start a new design? | Describe my idea; Choose an example and customize; Choose symbols and colors |
| `use_context` | Where do you expect to use the finished star? | Checkboxes: Contest entry; Button or badge; Shirt; Digital image; Other with text |
| `open_feedback` | What should we add, remove, or change? | Optional free text |

Use “Not sure yet” where useful rather than forcing a premature preference.

### Conditional follow-ups

Show at most a small number of relevant follow-ups:

- If outdoors is the favorite theme: “Which should be recognizable?” Checkboxes for camping, kayaking, snorkeling, skiing, and nature generally. Follow with “Which matters most?” if several are selected.
- If the overall direction is illustrated or mixed: “What should the pictures feel like?” Choices: clean symbols, playful illustrations, or small scenes.
- If contest entry is selected: offer an optional box to paste known rules about shape, colors, dimensions, and permitted imagery. Do not treat unprovided rules as known.

Do not ask for exact technical dimensions, file formats, or SVG terminology in the main questionnaire.

## Feedback summary and transfer

The site has no backend. Answers stay in the user's browser until she explicitly copies or downloads them. Say so plainly:

> Your answers stay in this browser. Copy or download the summary to share it with Ryan.

Provide:

- “View my feedback” with a readable summary.
- “Copy feedback” using the Clipboard API with a selectable-text fallback.
- “Download feedback” as a UTF-8 text file.
- “Download feedback JSON” for the coding agent.

Include theme preferences, favorite design, overall preferences, conditional answers, and free-text feedback. Mark skipped answers “Not answered.” Never invent selections or automatically submit them anywhere.

Summaries should report user choices directly. Do not collapse them into an opaque score or declare that a single answer proves what the final product should be. Mixed answers across themes are useful findings.

Use bounded text inputs and safely render all answers as text. For an optional contest-rules field, remind the user to paste only information she is allowed to share.

## Data structure

Keep prototype content separate from interface code. Suggested shape:

```json
{
  "prototypeVersion": "1.0.0",
  "themes": [
    {
      "id": "outdoors",
      "title": "Outdoor All-Star",
      "idea": "Outdoor adventure, nature, and creative thinking",
      "designs": [
        {
          "id": "outdoors-abstract",
          "mode": "abstract",
          "label": "Colors and patterns",
          "svgAsset": "assets/prototypes/outdoors-abstract.svg",
          "rationale": "Mountain facets and flowing water patterns suggest outdoor adventure.",
          "palette": ["#2D6A4F", "#247BA0", "#F4C95D", "#F7F7F2"]
        }
      ]
    }
  ]
}
```

Include both designs for every theme in real data. Colors above are illustrative, not mandatory.

Feedback JSON:

```json
{
  "schemaVersion": 1,
  "prototypeVersion": "1.0.0",
  "themePreferences": {
    "outdoors": { "choice": null, "comment": "" },
    "support": { "choice": null, "comment": "" },
    "quick-response": { "choice": null, "comment": "" },
    "phoenix": { "choice": null, "comment": "" }
  },
  "answers": {
    "favorite_design": null,
    "overall_direction": null,
    "detail_level": null,
    "boundary": null,
    "color_control": null,
    "starting_method": null,
    "use_context": [],
    "open_feedback": ""
  },
  "followUps": {}
}
```

Version local persistence and use a namespaced key such as `all-star-studio.prototype-feedback.v1`. On version mismatch, do not silently associate old choices with changed artwork. Offer a fresh review and keep an export path for older feedback. Browser storage failure must not prevent completing or downloading the form.

## SVG implementation requirements

- Create original, reusable vector assets for all eight prototypes.
- Use the same star geometry and viewBox.
- Use native paths, polygons, clipping paths, and patterns. No embedded raster art, external fonts, script elements, or external dependencies.
- Ensure inline SVG IDs are unique per rendered instance, including inspection previews.
- All downloaded SVGs must open independently and include their own pattern/clip definitions.
- Provide meaningful accessible names without duplicating verbose descriptions in every screen-reader interaction.
- Download the exact selected prototype artwork. Include no card title, questionnaire, or web controls in the SVG.
- Keep style and theme separate enough to expand later, but do not build a general composition engine solely for eight fixed prototypes.

## Visual and accessibility requirements

- Preserve the current page's welcoming tone, cream background, clear type, and generous space where practical.
- Artwork is the main content; give it enough size to compare.
- Use readable text contrast and visible keyboard focus.
- Use labeled form fields, radio groups, and checkboxes with large touch targets.
- No horizontal scrolling on a 360-pixel-wide viewport.
- Keep the comparison usable without hover.
- Provide explicit text confirmation after copying or downloading feedback.
- Do not include internal implementation details in the user-facing flow.

## Acceptance criteria

1. The live app displays all four themes and all eight SVG designs.
2. Each theme has a visibly different abstract and illustrated interpretation with a shared palette and silhouette.
3. The ribbon, dumpster with flames, phoenix, and outdoor scene are recognizable at the large preview size.
4. Small previews expose loss of detail honestly instead of substituting different art.
5. Users can choose preferences and write comments without creating an account.
6. Feedback survives a normal reload in the same browser where storage is available.
7. Skipped questions remain unanswered in text and JSON exports.
8. Copy and download output accurately reflect current choices and comments.
9. Feedback makes no off-device submission and the interface explains the manual sharing step.
10. Every individual SVG download opens correctly with no missing definitions or external resources.
11. Existing ideas and documentation routes remain accessible.
12. App assets work beneath `/all-star-studio/`, not only at a local server root.
13. Gallery, questions, and inspection controls work by keyboard and on a phone-sized viewport.
14. Storage or clipboard failure has a usable fallback.

Use focused checks for feedback serialization, unanswered values, conditional fields, and persistence version handling. Visually inspect all eight SVGs and their small previews. Verify the interface and downloads in a browser. Report checks actually performed and any remaining limitations.

## Execution order

1. Inspect the existing code and confirm how it is published.
2. Draw and visually verify the eight SVG prototypes.
3. Build the paired gallery and inspection views.
4. Add the preference groups and short questionnaire.
5. Add local persistence, feedback summary, copy, and downloads.
6. Update documentation with this milestone and unresolved decisions.
7. Run focused checks and verify repository-subpath behavior.
8. Follow the project's existing authorization rules for committing and deployment. Do not infer permission to publish from this specification alone.

## Coding-agent completion report

Report the implemented routes, eight prototype IDs, verification performed, remaining issues, and how Ryan can get the feedback from his mother. Include the actual preview or deployed URL when available. Avoid presenting the complete generator as finished.

## Decision after user feedback

The next development brief should use her actual answers to decide:

- Whether abstract, emblem, and scene modes all belong in the product.
- Which symbols and themes deserve reusable assets first.
- Whether the star outline should permit elements outside it.
- Whether to prioritize presets, symbol selection, or prose-based starting points.
- What detail level remains readable for her intended uses.

The success of this iteration is useful evidence and a pleasant review experience, not the number of editor controls built.
