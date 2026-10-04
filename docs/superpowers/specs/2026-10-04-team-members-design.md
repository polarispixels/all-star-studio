# Team Members: Design

Date: 2026-10-04. Ships as **v0.6.0** (MINOR: new pages). This is Track 2 of the two-track plan: each teammate gets a personal avatar star. Track 1, the Team Star contest logo, follows.

## Decisions (from review with Ryan)

| Topic | Decision |
|---|---|
| Silhouette | Every member star uses house shape F (`defaultStarPath()`). |
| Names | First names only. No login, no security; the site is public. |
| Members at launch | **Becky** (outdoors illustrated: mountains and kayak), **Scott** (illustrated Phoenix), **Detective** (new: for Becky's boss, "All-Star detective at your service" 🔍), plus placeholder cards **Quick Response** and **Support and Care** for teammates not yet named. Placeholders get renamed later. |
| Quick Response star | Starts with Becky's suggestion applied: the dumpster picture, with **turquoise blue** added, the red/yellow flames kept, and a few of the abstract version's sharp flame shapes for "a mix of both". |
| Edits | Request and redraw. A member types what they'd change and taps Send to Ryan. Ryan passes it to Claude, the star is redrawn and published. No AI in the site, no backend. |
| Avatar download | **PNG on a white square** (1024×1024; a 512×512 fallback is offered if the larger one fails), plus SVG. |
| New members | A "Want your own star?" card: first name and idea → Send to Ryan. |

## Pages

**Homepage:** **Team Members** becomes the big primary button. Star Shapes, Star Designs, and Heart Examples become secondary outline buttons under a small "Earlier ideas" label. The invitation line reads: "Every All-Star gets their own star. Find yours in Team Members."

**`members/`:**
- Header with "← Home". Title "Team Members". One line: "Each All-Star has their own star. Tap a name to see it, download it for Teams or Outlook, or ask for changes."
- A grid of large tappable cards. Each card is a link to the member page and shows the star, the first name, and a one-line description. Placeholder cards say "Teammate's name coming soon".
- Last card: "Want your own star?" leads to `member/?id=new`.

**`member/?id=<id>`** (one page, data-driven; an unknown id shows "We couldn't find that star" plus a link back):
- "← Team Members". The name as the title, a one-line description, and the star large.
- **Avatar size** row: 32 px, 64 px, and inside a 96 px circle (centered, as in Star Shapes).
- Buttons:
  - **Download for Teams / Outlook** (PNG, white square, 1024).
  - **Download SVG**.
  - Each shows a text confirmation; on failure it offers 512 px.
- **"What would you change about your star?"** (1,000 characters), then **Send to Ryan** (Share where supported, Copy with select fallback). The message is plain text: "All-Star Studio star change request / For: Becky / Star: becky (version 1) / Request: …".
- The draft is saved in the browser under `all-star-studio.member-request.v1.<id>`.
- `?id=new`: the same layout with no star, a "Your first name" field (40 characters), and "Describe your star idea" (1,000 characters). It sends "All-Star Studio new star request / Name: … / Idea: …".

## Art

- `assets/members/<id>.svg`, one file per member, so personal changes never touch the Star Designs examples. Becky's and Scott's start as copies of `outdoors-illustrated` and `phoenix-illustrated`. Support and Care starts as a copy of `support-illustrated`.
- **Detective** (new) and **Quick Response** (the mix) are drawn by two parallel agents on shape F. Same rules as before: no gradients, text, rasters or scripts; ids prefixed with the member id; readable at 64 px; checked large, at 64 px, and in a circle.
- Each member file must pass the SVG checker (house silhouette, self-contained).

## Data and code

- `js/members/roster.js`: `ROSTER = [{ id, name, blurb, star, starVersion, placeholder? }]`. Adding a person is one entry plus one SVG.
- `js/members/request.js`: pure functions `changeRequestText(member, text)` and `newStarRequestText(name, idea)` with bounded inputs. Tests cover the content, trimming, and empty-input handling (Send is disabled until there's text).
- `js/png.js`: `svgToPngBlob(svgText, size, background)`, which renders through Image → Canvas → `toBlob` with a white fill and revokes object URLs. Used by member pages and later by Team Star.
- `js/members/list.js` and `js/members/page.js` handle the DOM. Both reuse `js/ui.js`.
- **Send for a single request:** `js/ui.js` gets a small `wireRequestSend({ getText, statusEl })` for Share/Copy without the JSON or text-file buttons.

## Testing

- Unit tests for request text and the roster (unique ids, existing star files, first names only, no spaces in ids).
- `tests/svgs.test.mjs` extended to `assets/members/*.svg`.
- Browser check:
  - the members list renders all cards and links;
  - a member page renders the star, the circle is centered, and the PNG is generated (blob type `image/png`, 1024×1024 when decoded);
  - the request draft survives a reload;
  - an unknown id shows the not-found message;
  - `?id=new` shows the name field.
- Screenshots at 360 px and desktop.

## Release

v0.6.0: CHANGELOG, docs page (what's live, releases, current direction: Team Members live, Team Star next), version badge, tag, push, and a live check.

## Out of scope

Team Star contest candidates (next), editing in the browser, AI, uploads, and real team roster data beyond what's listed.
