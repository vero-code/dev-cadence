// Unified storage bridge for Chrome Extension (chrome.storage.local) and local Vite dev (localStorage)

const STORAGE_KEYS = {
  HACKATHONS: 'dev_cadence_hackathons',
  SETTINGS: 'dev_cadence_settings',
  THEME: 'dev_cadence_theme',
};

const DEFAULT_SETTINGS = {
  targetRestDays: 8,
  avgTurnaroundDays: 10,
};

const isChromeStorageAvailable = () => {
  return typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;
};

export const getStoredData = async () => {
  try {
    if (isChromeStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.local.get([STORAGE_KEYS.HACKATHONS, STORAGE_KEYS.SETTINGS, STORAGE_KEYS.THEME], (result) => {
          resolve({
            hackathons: result[STORAGE_KEYS.HACKATHONS] || [],
            settings: result[STORAGE_KEYS.SETTINGS] || DEFAULT_SETTINGS,
            theme: result[STORAGE_KEYS.THEME] || 'steampunk',
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
        settings: rawSettings ? JSON.parse(rawSettings) : DEFAULT_SETTINGS,
        theme: rawTheme || 'steampunk',
      };
    }
  } catch (err) {
    console.error('Failed to load from storage, using defaults:', err);
    return { hackathons: [], settings: DEFAULT_SETTINGS, theme: 'steampunk' };
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
