import { useState, useEffect } from 'react';
import {
  getStoredData,
  saveHackathons,
  saveSettings,
  saveTheme,
  clearAllHackathons,
  clearAllData,
} from '../utils/storage';

const DEFAULT_SETTINGS = {
  targetRestDays: 8,
  avgTurnaroundDays: 10,
  fontPreset: 'bahnschrift',
  fontSize: 'normal',
};

const DEFAULT_THEME = 'parchment';

const applyAppearance = (settings) => {
  document.documentElement.setAttribute('data-font', settings?.fontPreset || DEFAULT_SETTINGS.fontPreset);
  document.documentElement.setAttribute('data-font-size', settings?.fontSize || DEFAULT_SETTINGS.fontSize);
};

export const useCadenceStorage = () => {
  const [hackathons, setHackathons] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [theme, setTheme] = useState(DEFAULT_THEME);

  useEffect(() => {
    const initData = async () => {
      const data = await getStoredData();
      setHackathons(data.hackathons);
      setSettings(data.settings);
      setTheme(data.theme || DEFAULT_THEME);
      applyAppearance(data.settings);
    };
    initData();
  }, []);

  const selectTheme = async (newTheme) => {
    setTheme(newTheme);
    await saveTheme(newTheme);
  };

  const upsertHackathon = async (item) => {
    const exists = hackathons.some((h) => h.id === item.id);
    const updated = exists
      ? hackathons.map((h) => (h.id === item.id ? item : h))
      : [...hackathons, item];
    setHackathons(updated);
    await saveHackathons(updated);
  };

  const removeHackathon = async (id) => {
    const updated = hackathons.filter((h) => h.id !== id);
    setHackathons(updated);
    await saveHackathons(updated);
  };

  const updateSettings = async (partialSettings) => {
    const updated = { ...settings, ...partialSettings };
    setSettings(updated);
    await saveSettings(updated);
    applyAppearance(updated);
  };

  const clearHackathons = async () => {
    setHackathons([]);
    await clearAllHackathons();
  };

  const resetAllData = async () => {
    await clearAllData();
    setHackathons([]);
    setSettings(DEFAULT_SETTINGS);
    setTheme(DEFAULT_THEME);
    applyAppearance(DEFAULT_SETTINGS);
  };

  const importData = async (data) => {
    const nextHackathons = Array.isArray(data.hackathons) ? data.hackathons : [];
    const nextSettings = { ...DEFAULT_SETTINGS, ...(data.settings || {}) };
    const nextTheme = data.theme || DEFAULT_THEME;
    await saveHackathons(nextHackathons);
    await saveSettings(nextSettings);
    await saveTheme(nextTheme);
    setHackathons(nextHackathons);
    setSettings(nextSettings);
    setTheme(nextTheme);
    applyAppearance(nextSettings);
  };

  return {
    hackathons,
    settings,
    theme,
    selectTheme,
    upsertHackathon,
    removeHackathon,
    updateSettings,
    clearHackathons,
    resetAllData,
    importData,
  };
};