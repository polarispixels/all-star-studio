// Prototype gallery content: four themes, two designs each, and the preference questions.
// Data only. Bump PROTOTYPE_VERSION whenever artwork or choices change meaning (see feedback.js).
export const PROTOTYPE_VERSION = '1.1.0'; // 1.1.0: all eight stars reshaped to house shape F

export const DIRECTION_CHOICES = [
  { id: 'abstract', label: 'Colors and patterns' },
  { id: 'illustrated', label: 'Pictures and symbols' },
  { id: 'mix', label: 'A mix of both' },
  { id: 'neither', label: 'Neither yet' },
];

export const THEMES = [
  {
    id: 'outdoors',
    nav: 'Outdoor',
    title: 'Outdoor All-Star',
    idea: 'I am an All-Star. I enjoy outdoor activities like camping, kayaking, snorkeling & skiing. I love nature and try to think outside the box.',
    palette: [
      { name: 'Forest green', hex: '#2D6A4F' },
      { name: 'Meadow green', hex: '#74A84A' },
      { name: 'Lake blue', hex: '#247BA0' },
      { name: 'Deep lake blue', hex: '#1A5674' },
      { name: 'Sky blue', hex: '#9ED0EA' },
      { name: 'Sunlight gold', hex: '#F4C95D' },
      { name: 'Snow white', hex: '#F7F7F2' },
    ],
    designs: [
      {
        id: 'outdoors-abstract',
        mode: 'abstract',
        rationale: 'Angular facets rise like mountain peaks above flowing wave bands, so the star reads as land, snow, and water without any pictures.',
      },
      {
        id: 'outdoors-illustrated',
        mode: 'illustrated',
        rationale: 'One calm scene: a snowy mountain for skiing, evergreen trees for camping, and a kayak on the lake, all under warm sunlight.',
      },
    ],
  },
  {
    id: 'support',
    nav: 'Support',
    title: 'Support and Care',
    idea: 'A teammate wants a star that shows support for breast cancer awareness.',
    palette: [
      { name: 'Ribbon pink', hex: '#E0457B' },
      { name: 'Deep ribbon pink', hex: '#C23468' },
      { name: 'Rose', hex: '#F28AAE' },
      { name: 'Soft pink', hex: '#F9C6D6' },
      { name: 'Berry', hex: '#9E2A5B' },
      { name: 'Warm cream', hex: '#FFF3E6' },
    ],
    designs: [
      {
        id: 'support-abstract',
        mode: 'abstract',
        rationale: 'A ring of pink and cream bands weaves over and under itself, suggesting people holding one another up.',
      },
      {
        id: 'support-illustrated',
        mode: 'illustrated',
        rationale: 'A clear pink awareness ribbon sits at the heart of the star on a calm, warm background.',
      },
    ],
  },
  {
    id: 'quick-response',
    nav: 'Quick Response',
    title: 'Quick Response',
    idea: 'A teammate uses a dumpster-fire emoji to mark her quick responses and would enjoy having it in her star.',
    palette: [
      { name: 'Flame red', hex: '#D7263D' },
      { name: 'Flame orange', hex: '#F46036' },
      { name: 'Spark yellow', hex: '#FFC93C' },
      { name: 'Dumpster green', hex: '#2F7A4A' },
      { name: 'Dark dumpster green', hex: '#1F5A35' },
      { name: 'Charcoal', hex: '#2E2E3A' },
    ],
    designs: [
      {
        id: 'quick-response-abstract',
        mode: 'abstract',
        rationale: 'Sharp flame shapes shoot upward from a steady dark base: fast energy on solid ground.',
      },
      {
        id: 'quick-response-illustrated',
        mode: 'illustrated',
        rationale: 'A cheerful green dumpster with stylized flames, a friendly nod to her signature quick-response emoji.',
      },
    ],
  },
  {
    id: 'phoenix',
    nav: 'Phoenix',
    title: 'Phoenix Rising',
    idea: 'A teammate chose a phoenix rising.',
    palette: [
      { name: 'Gold', hex: '#F6B93B' },
      { name: 'Ember orange', hex: '#E8702A' },
      { name: 'Fire red', hex: '#C0392B' },
      { name: 'Deep violet', hex: '#4A235A' },
      { name: 'Night violet', hex: '#2E1338' },
      { name: 'Pale flame', hex: '#FFE6A8' },
    ],
    designs: [
      {
        id: 'phoenix-abstract',
        mode: 'abstract',
        rationale: 'Feather-like shards sweep upward from deep violet into gold, suggesting renewal and resilience (a proposed reading).',
      },
      {
        id: 'phoenix-illustrated',
        mode: 'illustrated',
        rationale: 'A bird with wings raised and a flame-shaped tail rises through the star, suggesting renewal and resilience (a proposed reading).',
      },
    ],
  },
];

export const MODE_LABEL = { abstract: 'Colors and patterns', illustrated: 'Pictures and symbols' };

export const svgPath = (designId) => `../assets/prototypes/${designId}.svg`;

export const allDesigns = () =>
  THEMES.flatMap((t) => t.designs.map((d) => ({ ...d, themeId: t.id, themeTitle: t.title, label: MODE_LABEL[d.mode] })));

export const QUESTIONS = [
  {
    id: 'favorite_design',
    type: 'favorite',
    question: 'Which example would you most like to develop further?',
    extra: [{ id: 'not_sure', label: 'Not sure yet' }],
  },
  {
    id: 'overall_direction',
    type: 'single',
    question: 'What should your star mainly use to tell its story?',
    choices: [
      { id: 'abstract', label: 'Colors and patterns' },
      { id: 'illustrated', label: 'Pictures and symbols' },
      { id: 'mix', label: 'A mix' },
      { id: 'depends', label: 'Depends on the idea' },
    ],
  },
  {
    id: 'detail_level',
    type: 'single',
    question: 'How much detail feels right?',
    choices: [
      { id: 'simple', label: 'Simple and bold' },
      { id: 'few', label: 'A few clear details' },
      { id: 'rich', label: 'Rich and detailed' },
      { id: 'not_sure', label: 'Not sure yet' },
    ],
  },
  {
    id: 'boundary',
    type: 'single',
    question: 'Should the design stay inside the star?',
    choices: [
      { id: 'inside', label: 'Entirely inside' },
      { id: 'small_outside', label: 'A small part may extend outside' },
      { id: 'either', label: 'Either could work' },
    ],
  },
  {
    id: 'color_control',
    type: 'single',
    question: 'How would you like to choose colors?',
    choices: [
      { id: 'pick_own', label: 'Pick my own' },
      { id: 'suggest_adjust', label: 'Start with suggested colors and adjust' },
      { id: 'suggested', label: 'Use suggested colors' },
      { id: 'not_sure', label: 'Not sure yet' },
    ],
  },
  {
    id: 'starting_method',
    type: 'single',
    question: 'How would you like to start a new design?',
    choices: [
      { id: 'describe', label: 'Describe my idea' },
      { id: 'example', label: 'Choose an example and customize' },
      { id: 'symbols_colors', label: 'Choose symbols and colors' },
      { id: 'not_sure', label: 'Not sure yet' },
    ],
  },
  {
    id: 'use_context',
    type: 'multi',
    question: 'Where do you expect to use the finished star?',
    choices: [
      { id: 'contest', label: 'Contest entry' },
      { id: 'badge', label: 'Button or badge' },
      { id: 'shirt', label: 'Shirt' },
      { id: 'digital', label: 'Digital image' },
      { id: 'other', label: 'Other' },
    ],
  },
  {
    id: 'open_feedback',
    type: 'text',
    question: 'What should we add, remove, or change?',
    maxLength: 1000,
  },
];

export const FOLLOW_UPS = {
  outdoor_recognizable: {
    question: 'Which should be recognizable?',
    type: 'multi',
    choices: [
      { id: 'camping', label: 'Camping' },
      { id: 'kayaking', label: 'Kayaking' },
      { id: 'snorkeling', label: 'Snorkeling' },
      { id: 'skiing', label: 'Skiing' },
      { id: 'nature', label: 'Nature generally' },
    ],
  },
  outdoor_most: { question: 'Which matters most?', type: 'single' },
  picture_feel: {
    question: 'What should the pictures feel like?',
    type: 'single',
    choices: [
      { id: 'clean', label: 'Clean symbols' },
      { id: 'playful', label: 'Playful illustrations' },
      { id: 'scenes', label: 'Small scenes' },
    ],
  },
  use_context_other: { question: 'Where else?', type: 'text', maxLength: 200 },
  contest_rules: {
    question: 'Paste any contest rules you know (shape, colors, size, allowed pictures).',
    hint: 'Optional. Only paste information you are allowed to share.',
    type: 'text',
    maxLength: 2000,
  },
};

export const LIMITS = { comment: 500 };
