// Unified storage bridge for Chrome Extension (chrome.storage.local) and local Vite dev (localStorage)

const STORAGE_KEYS = {
  HACKATHONS: 'dev_cadence_hackathons',
  SETTINGS: 'dev_cadence_settings',
  THEME: 'dev_cadence_theme',
};

const DEFAULT_SETTINGS = {
  targetRestDays: 8,
  avgTurnaroundDays: 10,
  fontPreset: 'bahnschrift',
  fontSize: 'normal',
};

const isChromeStorageAvailable = () => {
  return typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;
};

const sanitizeTheme = (t) => {
  if (t === 'dark') return 'devpost';
  return t || 'devpost';
};

const sanitizeSettings = (s) => {
  const merged = { ...DEFAULT_SETTINGS, ...(s || {}) };
  if (merged.fontPreset === 'mono') {
    merged.fontPreset = 'bahnschrift';
  }
  return merged;
};

export const getStoredData = async () => {
  try {
    if (isChromeStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.local.get([STORAGE_KEYS.HACKATHONS, STORAGE_KEYS.SETTINGS, STORAGE_KEYS.THEME], (result) => {
          resolve({
            hackathons: result[STORAGE_KEYS.HACKATHONS] || [],
            settings: sanitizeSettings(result[STORAGE_KEYS.SETTINGS]),
            theme: sanitizeTheme(result[STORAGE_KEYS.THEME]),
          });
        });
      });
    } else {
      // LocalStorage fallback for web preview
      const rawHackathons = localStorage.getItem(STORAGE_KEYS.HACKATHONS);
      const rawSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const rawTheme = localStorage.getItem(STORAGE_KEYS.THEME);
      return {
        hackathons: rawHackathons ? JSON.parse(rawHackathons) : [],
        settings: sanitizeSettings(rawSettings ? JSON.parse(rawSettings) : null),
        theme: sanitizeTheme(rawTheme),
      };
    }
  } catch (err) {
    console.error('Failed to load from storage, using defaults:', err);
    return { hackathons: [], settings: DEFAULT_SETTINGS, theme: 'devpost' };
  }
};

export const saveHackathons = async (hackathons) => {
  try {
    if (isChromeStorageAvailable()) {
      await chrome.storage.local.set({ [STORAGE_KEYS.HACKATHONS]: hackathons });
    } else {
      localStorage.setItem(STORAGE_KEYS.HACKATHONS, JSON.stringify(hackathons));
    }
  } catch (err) {
    console.error('Failed to save hackathons to storage:', err);
  }
};

export const saveSettings = async (settings) => {
  try {
    if (isChromeStorageAvailable()) {
      await chrome.storage.local.set({ [STORAGE_KEYS.SETTINGS]: settings });
    } else {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    }
  } catch (err) {
    console.error('Failed to save settings to storage:', err);
  }
};

export const saveTheme = async (theme) => {
  try {
    if (isChromeStorageAvailable()) {
      await chrome.storage.local.set({ [STORAGE_KEYS.THEME]: theme });
    } else {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    }
  } catch (err) {
    console.error('Failed to save theme to storage:', err);
  }
};

export const clearAllHackathons = async () => {
  try {
    await saveHackathons([]);
  } catch (err) {
    console.error('Failed to clear hackathons:', err);
  }
};

export const clearAllData = async () => {
  try {
    if (isChromeStorageAvailable()) {
      await chrome.storage.local.clear();
    } else {
      localStorage.removeItem(STORAGE_KEYS.HACKATHONS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.THEME);
      localStorage.removeItem('dev_cadence_tracker_view_mode');
    }
  } catch (err) {
    console.error('Failed to clear all data from storage:', err);
  }
};
