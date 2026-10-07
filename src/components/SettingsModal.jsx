import React, { useState, useEffect } from 'react';
import { THEMES, FONT_PRESETS, FONT_SIZES } from '../constants';

export const SettingsModal = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  currentTheme,
  onSelectTheme,
  onClearAllHackathons,
  onResetAllData,
}) => {
  const [targetRestDays, setTargetRestDays] = useState(8);
  const [avgTurnaroundDays, setAvgTurnaroundDays] = useState(10);
  const [confirmClearHackathons, setConfirmClearHackathons] = useState(false);
  const [confirmResetAll, setConfirmResetAll] = useState(false);
  const [resetMessage, setResetMessage] = useState(null);

  useEffect(() => {
    if (settings) {
      setTargetRestDays(settings.targetRestDays ?? 8);
      setAvgTurnaroundDays(settings.avgTurnaroundDays ?? 10);
    }
    setConfirmClearHackathons(false);
    setConfirmResetAll(false);
    setResetMessage(null);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleThemeClick = (themeId) => {
    if (onSelectTheme) {
      onSelectTheme(themeId);
    }
  };

  const handleFontClick = (presetId) => {
    if (onUpdateSettings) {
      onUpdateSettings({ fontPreset: presetId });
    }
  };

  const handleFontSizeClick = (sizeId) => {
    if (onUpdateSettings) {
      onUpdateSettings({ fontSize: sizeId });
    }
  };

  const handleRestDaysChange = (val) => {
    setTargetRestDays(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 28) {
      if (onUpdateSettings) onUpdateSettings({ targetRestDays: parsed });
    }
  };

  const handleRestDaysBlur = () => {
    const parsed = Math.max(0, Math.min(28, parseInt(targetRestDays, 10) || 0));
    setTargetRestDays(parsed);
    if (onUpdateSettings) onUpdateSettings({ targetRestDays: parsed });
  };

  const handleAvgDaysChange = (val) => {
    setAvgTurnaroundDays(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 60) {
      if (onUpdateSettings) onUpdateSettings({ avgTurnaroundDays: parsed });
    }
  };

  const handleAvgDaysBlur = () => {
    const parsed = Math.max(1, Math.min(60, parseInt(avgTurnaroundDays, 10) || 10));
    setAvgTurnaroundDays(parsed);
    if (onUpdateSettings) onUpdateSettings({ avgTurnaroundDays: parsed });
  };

  const handleClearHackathonsClick = async () => {
    if (!confirmClearHackathons) {
      setConfirmClearHackathons(true);
      setConfirmResetAll(false);
      return;
    }
    if (onClearAllHackathons) {
      await onClearAllHackathons();
      setConfirmClearHackathons(false);
      setResetMessage('All hackathons have been cleared.');
      setTimeout(() => setResetMessage(null), 3000);
    }
  };

  const handleResetAllClick = async () => {
    if (!confirmResetAll) {
      setConfirmResetAll(true);
      setConfirmClearHackathons(false);
      return;
    }
    if (onResetAllData) {
      await onResetAllData();
      setConfirmResetAll(false);
      setResetMessage('All data and preferences have been reset to factory defaults.');
      setTimeout(() => setResetMessage(null), 3000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <span>⚙️</span> Settings
          </h2>
          <button type="button" className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body-content">
          {/* Theme Selector */}
          <div className="form-group">
            <label className="form-label">Theme</label>
            <div className="theme-options-grid">
              {THEMES.map((t) => {
                const isSelected = currentTheme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    className={`theme-option-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => handleThemeClick(t.id)}
                  >
                    <span className="theme-option-icon">{t.icon}</span>
                    <div className="theme-option-text">
                      <div className="theme-option-name">{t.name}</div>
                    </div>
                    {isSelected && <span className="theme-option-check">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typography Settings */}
          <div className="form-group">
            <label className="form-label">Typography</label>
            <div className="font-options-grid">
              {FONT_PRESETS.map((f) => {
                const isSelected = (settings?.fontPreset || 'bahnschrift') === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    className={`font-option-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => handleFontClick(f.id)}
                    data-font-preview={f.id}
                  >
                    <span className="font-option-title">{f.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="font-size-row">
              {FONT_SIZES.map((s) => {
                const isSelected = (settings?.fontSize || 'normal') === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    className={`font-size-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => handleFontSizeClick(s.id)}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Capacity Goals in one row */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Rest Days / Month</label>
              <input
                type="number"
                min="0"
                max="28"
                className="form-input"
                value={targetRestDays}
                onChange={(e) => handleRestDaysChange(e.target.value)}
                onBlur={handleRestDaysBlur}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Work Days / Hackathon</label>
              <input
                type="number"
                min="1"
                max="60"
                className="form-input"
                value={avgTurnaroundDays}
                onChange={(e) => handleAvgDaysChange(e.target.value)}
                onBlur={handleAvgDaysBlur}
              />
            </div>
          </div>

          {/* Danger Zone: Full Wipe / Reset Actions */}
          <div className="settings-danger-zone">
            <div className="danger-zone-title">
              Data Management & Reset
            </div>
            <p className="danger-zone-desc">
              Clear logged events or reset the extension to defaults.
            </p>
            <div className="danger-actions-row">
              <button
                type="button"
                className={`danger-btn-outline ${confirmClearHackathons ? 'confirming' : ''}`}
                onClick={handleClearHackathonsClick}
              >
                {confirmClearHackathons ? '⚠️ Confirm Clear Events' : '🗑️ Clear Hackathons'}
              </button>
              <button
                type="button"
                className={`danger-btn-outline ${confirmResetAll ? 'confirming' : ''}`}
                onClick={handleResetAllClick}
              >
                {confirmResetAll ? '⚠️ Confirm Factory Reset' : '🔄 Reset All Data'}
              </button>
            </div>
            {resetMessage && (
              <div style={{ color: 'var(--rose)', fontSize: '0.74rem', marginTop: '0.5rem', fontWeight: 600 }}>
                ✓ {resetMessage}
              </div>
            )}
          </div>

          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ color: 'var(--emerald)', fontSize: '0.65rem' }}>●</span> Auto-saved
            </span>
            <button type="button" className="btn-primary" onClick={onClose} style={{ minWidth: '90px', justifyContent: 'center' }}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
