// App metadata and links
export const APP_VERSION = 'v0.3.0';
export const APP_RELEASE_DATE = 'November 17, 2026';

export const LEGAL_DATES = {
  privacy: 'November 16, 2026',
  terms: 'November 16, 2026',
};

export const DEVPOST_PROFILE_URL = 'https://devpost.com/software/dev-cadence';
export const GITHUB_REPO_URL = 'https://github.com/vero-code/dev-cadence';

// Calendar and capacity
export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const CAPACITY_LIMITS = {
  rest: { min: 0, max: 31, fallback: 0 },
  sprint: { min: 1, max: 31, fallback: 10 },
};

export const MAX_SPRINTS_PER_DAY = 2;

// Sprint fields and tracker
export const COLOR_PALETTE = [
  { hex: '#4285F4', label: 'Blue' },
  { hex: '#DB4437', label: 'Red' },
  { hex: '#F4B400', label: 'Yellow' },
  { hex: '#0F9D58', label: 'Green' },
  { hex: '#AB47BC', label: 'Purple' },
];

export const EMOJI_OPTIONS = [
  { value: '🔷', label: 'Blue diamond' },
  { value: '🔴', label: 'Red circle' },
  { value: '⭐', label: 'Star' },
  { value: '🟩', label: 'Green square' },
  { value: '🫟', label: 'Paint splatter' },
];

export const STATUS_OPTIONS = [
  { value: 'Interest', description: 'Considering for later' },
  { value: 'Join', description: 'Committed and scheduled' },
  { value: 'Early', description: 'Early stage, just getting started' },
  { value: 'Draft', description: 'Active work, finalizing details' },
  { value: 'Done', description: 'Completed or submitted' },
];

export const STATUS_FILTER_PILLS = [
  { key: 'interest', filter: 'Interest', label: 'Int' },
  { key: 'join', filter: 'Join', label: 'Join' },
  { key: 'early', filter: 'Early', label: 'Earl' },
  { key: 'draft', filter: 'Draft', label: 'Draft' },
  { key: 'done', filter: 'Done', label: 'Done' },
];

// Appearance

export const THEMES = [
  {
    id: 'devpost',
    name: 'Ocean Slate',
    icon: '🌊',
    desc: 'Deep navy slate & electric cyan glow',
  },
  {
    id: 'steampunk',
    name: 'Obsidian Brass',
    icon: '⚙️',
    desc: 'Clockwork brass, rich mahogany & warm glow',
  },
  {
    id: 'parchment',
    name: 'Warm Vellum',
    icon: '📜',
    desc: 'Warm archival paper & crisp ink contrast',
  },
];

export const FONT_PRESETS = [
  {
    id: 'bahnschrift',
    name: 'Bahnschrift',
    preview: 'Clean DIN Geometric',
  },
  {
    id: 'sans',
    name: 'Geometric',
    preview: 'Plus Jakarta Sans',
  },
  {
    id: 'marcellus',
    name: 'Marcellus',
    preview: 'Roman Engraving Serif',
  },
];

export const FONT_SIZES = [
  { id: 'compact', label: '90%' },
  { id: 'normal', label: '100%' },
  { id: 'spacious', label: '110%' },
];

// Hybrid AI
export const CLOUD_FALLBACK_MODEL = 'gemini-4-hydrogen';

export const ADVISOR_TEMPERATURE = 0.4;

export const ADVISOR_SYSTEM_PROMPT =
  'You are a friendly, caring developer buddy watching out for burnout. Use only the provided facts, keep it brief, warm, and encouraging, and remind the user to take a breather when needed. No emojis, no greeting.';

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

// Contact form
export const DISCORD_WEBHOOK_URL = import.meta.env.VITE_DISCORD_WEBHOOK_URL || '';

export const CONTACT_TOPICS = [
  'Question',
  'Bug Report',
  'Feature Request',
];