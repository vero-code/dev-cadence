export const COLOR_PALETTE = [
  '#4285F4',
  '#DB4437',
  '#0F9D58',
  '#F4B400',
  '#AB47BC',
  '#FFFFFF',
  '#131921',
];

export const EMOJI_OPTIONS = ['🔷', '🔴', '🟩', '⭐', '🫟', '❕', '▪️'];

export const STATUS_OPTIONS = [
  'Interest',
  'Join',
  'Early',
  'Draft',
  'Done',
];

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const DEVPOST_PROFILE_URL = 'https://devpost.com/software/dev-cadence';
export const GITHUB_REPO_URL = 'https://github.com/vero-code/dev-cadence';

export const THEMES = [
  {
    id: 'devpost',
    name: 'Devpost Classic',
    icon: '🌐',
    desc: 'Original Devpost deep navy & electric cyan glow',
  },
  {
    id: 'steampunk',
    name: 'Rich Dark',
    icon: '⚙️',
    desc: 'Clockwork brass, rich mahogany & warm glow',
  },
  {
    id: 'parchment',
    name: 'Light Parchment',
    icon: '📜',
    desc: 'Devpost parchment paper',
  },
];

export const FONT_PRESETS = [
  {
    id: 'bahnschrift',
    name: 'Bahnschrift',
    preview: 'Clean DIN Geometric',
  },
  {
    id: 'cinzel',
    name: 'Cinzel Automaton',
    preview: 'Steampunk Engraving Serif',
  },
  {
    id: 'sans',
    name: 'Modern Geometric',
    preview: 'Plus Jakarta Sans',
  },
];

export const FONT_SIZES = [
  { id: 'compact', label: 'Compact (90%)' },
  { id: 'normal', label: 'Standard (100%)' },
  { id: 'spacious', label: 'Comfort (110%)' },
];

export const CHROME_AI_SETUP_URLS = [
  {
    id: 'settings',
    label: 'Enable "On-device AI" in Settings',
    url: 'chrome://settings/ai',
  },
];

export const AI_STATUS_INFO = {
  available: {
    label: 'Available',
    color: 'var(--emerald)',
    hint: 'Gemini Nano is ready for local on-device inference.',
  },
  downloadable: {
    label: 'Downloadable',
    color: 'var(--amber-gear)',
    hint: 'Ready to install. Complete Step 2 below.',
  },
  downloading: {
    label: 'Downloading',
    color: 'var(--cyan-primary)',
    hint: 'Downloading local model to your browser...',
  },
  unavailable: {
    label: 'Unavailable',
    color: 'var(--rose)',
    hint: 'Local model is turned off or unsupported. Complete Step 1 below.',
  },
  checking: {
    label: 'Checking...',
    color: 'var(--text-muted)',
    hint: 'Checking local model availability...',
  },
};

export const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const STATUS_FILTER_PILLS = [
  { key: 'interest', filter: 'Interest', label: 'Int' },
  { key: 'join', filter: 'Join', label: 'Join' },
  { key: 'early', filter: 'Early', label: 'Earl' },
  { key: 'draft', filter: 'Draft', label: 'Draft' },
  { key: 'done', filter: 'Done', label: 'Done' },
];