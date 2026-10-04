// Team Star options: candidate logos for the whole All-Stars team (contest due 2026-10-22).
// Bump TEAM_VERSION whenever an existing option's artwork changes meaningfully.
export const TEAM_VERSION = '1.0.0';

export const TEAM_OPTIONS = [
  { id: 'a-rays', letter: 'A', name: 'Colorful rays', blurb: 'The homepage star: bright rays from the center, with stripes and dots. Simple, cheerful, and bold.' },
  { id: 'b-pieces', letter: 'B', name: 'Pieces of everyone', blurb: "One symbol per arm from the team's own stars: Becky's mountain, Scott's phoenix wing, Dixie's flame, the Detective's magnifying glass, and the Support ribbon." },
  { id: 'c-mosaic', letter: 'C', name: 'Puzzle mosaic', blurb: 'Many small puzzle pieces in the team colors, fitting together into one star. Many pieces, one team.' },
  { id: 'd-five', letter: 'D', name: 'Five-piece puzzle', blurb: 'Five big puzzle pieces, one per arm, each a different color, locking together around the center like a pinwheel.' },
];
export const NONE_OPTION = { id: 'none', name: 'None of these yet' };
export const LIMITS = { comment: 500, other: 1000 };
export const teamPath = (id) => `../assets/team/${id}.svg`;
