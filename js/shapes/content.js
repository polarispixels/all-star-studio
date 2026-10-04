// Star Shapes page content. Geometry lives in js/star-shape.js; this adds the words.
// Bump SHAPES_VERSION whenever an existing shape changes, so old answers aren't attached to changed shapes.
// Adding a new shape doesn't need a bump: saved answers for the other shapes stay valid.
import { SHAPES } from '../star-shape.js';

export const SHAPES_VERSION = '1.0.0';

const BLURBS = {
  classic: "Today's sharp star, for comparison.",
  soft: 'The same star with gently rounded points.',
  chunky: 'Big, round points, like the soft corners of the company heart.',
  plump: "Shorter, wider arms with rounded corners. The closest match to the heart's chunky proportions.",
  boxy: 'Points cut flat with softened corners, for a blocky look.',
  blend: 'A shorter flat cut on each point, with gently rounded corners everywhere. A blend of squared-off and soft, made to match the heart.',
};

export const SHAPE_OPTIONS = SHAPES.map((s) => ({ id: s.id, name: s.name, blurb: BLURBS[s.id] }));
export const NONE_OPTION = { id: 'none', name: 'None of these yet' };
export const LIMITS = { comment: 500, other: 1000 };

export const plainPath = (id) => `../assets/shapes/${id}.svg`;
export const kayakPath = (id) => `../assets/shapes/${id}-kayak.svg`;
