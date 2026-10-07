import React, { useState, useEffect } from 'react';
import { THEMES, FONT_PRESETS, FONT_SIZES } from '../constants';

export const SettingsModal = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  currentTheme,
  onSelectTheme,
  onClearAllHackathons,
  onResetAllData,
}) => {
  const [targetRestDays, setTargetRestDays] = useState(8);
  const [avgTurnaroundDays, setAvgTurnaroundDays] = useState(10);
  const [fontPreset, setFontPreset] = useState('bahnschrift');
  const [fontSize, setFontSize] = useState('normal');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [confirmClearHackathons, setConfirmClearHackathons] = useState(false);
  const [confirmResetAll, setConfirmResetAll] = useState(false);
  const [resetMessage, setResetMessage] = useState(null);

  useEffect(() => {
    if (settings) {
      setTargetRestDays(settings.targetRestDays ?? 8);
      setAvgTurnaroundDays(settings.avgTurnaroundDays ?? 10);
      setFontPreset(settings.fontPreset ?? 'bahnschrift');
      setFontSize(settings.fontSize ?? 'normal');
    }
    setSavedSuccess(false);
    setConfirmClearHackathons(false);
    setConfirmResetAll(false);
    setResetMessage(null);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      targetRestDays: Math.max(0, Math.min(28, parseInt(targetRestDays, 10) || 0)),
      avgTurnaroundDays: Math.max(1, parseInt(avgTurnaroundDays, 10) || 1),
      fontPreset,
      fontSize,
    };
    onSaveSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 400);
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
            <span>⚙️</span> Settings & Preferences
          </h2>
          <button type="button" className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Theme Selector */}
          <div className="form-group">
            <label className="form-label">Theme & Appearance</label>
            <div className="theme-options-grid">
              {THEMES.map((t) => {
                const isSelected = currentTheme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    className={`theme-option-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => onSelectTheme && onSelectTheme(t.id)}
                  >
                    <span className="theme-option-icon">{t.icon}</span>
                    <div className="theme-option-text">
                      <div className="theme-option-name">{t.name}</div>
                      <div className="theme-option-desc">{t.desc}</div>
                    </div>
                    {isSelected && <span className="theme-option-check">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typography Settings */}
          <div className="form-group">
            <label className="form-label">Typography & Font Style</label>
            <div className="font-options-grid">
              {FONT_PRESETS.map((f) => {
                const isSelected = fontPreset === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    className={`font-option-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => setFontPreset(f.id)}
                  >
                    <span className="font-option-title">{f.name}</span>
                    <span className="font-option-preview">{f.preview}</span>
                  </button>
                );
              })}
            </div>

            <div className="font-size-row">
              {FONT_SIZES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`font-size-btn ${fontSize === s.id ? 'active' : ''}`}
                  onClick={() => setFontSize(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Capacity Goals */}
          <div className="form-group">
            <label className="form-label">Desired Days Off Per Month (Rest Buffer)</label>
            <input
              type="number"
              min="0"
              max="28"
              className="form-input"
              value={targetRestDays}
              onChange={(e) => setTargetRestDays(e.target.value)}
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
              Triggers an overcommitment warning whenever remaining free days drop below this limit.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Average Project Turnaround (Days)</label>
            <input
              type="number"
              min="1"
              max="60"
              className="form-input"
              value={avgTurnaroundDays}
              onChange={(e) => setAvgTurnaroundDays(e.target.value)}
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
              Your estimated baseline sprint duration to complete and submit a hackathon.
            </span>
          </div>

          {/* Danger Zone: Full Wipe / Reset Actions */}
          <div className="settings-danger-zone">
            <div className="danger-zone-title">
              <span>⚠️</span> Data Management & Reset
            </div>
            <p className="danger-zone-desc">
              Clear logged events or reset the entire extension back to initial factory state.
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

          {savedSuccess && (
            <div style={{ color: 'var(--emerald)', fontSize: '0.8rem', marginTop: '0.65rem', fontWeight: 600 }}>
              ✓ Settings saved successfully!
            </div>
          )}

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
