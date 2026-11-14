import React, { useState, useEffect } from 'react';
import { THEMES, FONT_PRESETS, FONT_SIZES } from '../constants';
import { AgedGearIcon, ChevronDownIcon } from './Icons';
import { AiSettingsTab } from './AiSettingsTab';
import { ModalFooter } from './ModalFooter';

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
  const [activeTab, setActiveTab] = useState('general');
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
            <AgedGearIcon className="modal-title-gear" size={16} />
            <span>Settings</span>
          </h2>
          <button type="button" className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        {/* Settings Tabs */}
        <div className="legal-tabs-bar">
          <button
            type="button"
            className={`legal-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            type="button"
            className={`legal-tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai')}
          >
            AI
          </button>
        </div>

        <div className="modal-body-content">
          {activeTab === 'general' ? (
            <>
              <div className="settings-columns-row">
                {/* Theme */}
                <div className="settings-column">
                  <label className="form-label" htmlFor="settings-theme-select">Theme</label>
                  <div className="select-wrapper">
                    <select
                      id="settings-theme-select"
                      className="form-select"
                      value={currentTheme}
                      onChange={(e) => handleThemeClick(e.target.value)}
                    >
                      {THEMES.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                  </select>
                  <ChevronDownIcon className="select-chevron" size={14} />
                  </div>
                </div>

                {/* Typography */}
                <div className="settings-column">
                  <label className="form-label" htmlFor="settings-font-select">Typography</label>
                  <div className="select-wrapper">
                    <select
                      id="settings-font-select"
                      className="form-select"
                      value={settings?.fontPreset || 'bahnschrift'}
                      onChange={(e) => handleFontClick(e.target.value)}
                    >
                      {FONT_PRESETS.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="select-chevron" size={14} />
                  </div>
                </div>

                {/* Scale / Font Size */}
                <div className="form-group">
                  <label className="form-label" htmlFor="settings-scale-select">Scale</label>
                  <div className="select-wrapper">
                    <select
                      id="settings-scale-select"
                      className="form-select"
                      value={settings?.fontSize || 'normal'}
                      onChange={(e) => handleFontSizeClick(e.target.value)}
                    >
                      {FONT_SIZES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="select-chevron" size={14} />
                  </div>
                </div>
              </div>

              {/* Capacity Goals */}
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
                  <label className="form-label">Avg. Work Days</label>
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

              {/* Schedule Highlight */}
              <div className="form-group settings-toggle-group">
                <div className="settings-toggle-row">
                  <div className="settings-toggle-info">
                    <label className="form-label settings-toggle-label" htmlFor="toggle-highlight-hover">
                      Highlight in Schedule on Hover
                    </label>
                    <span className="settings-toggle-desc">
                      Highlight dates in the calendar when hovering over hackathons in Tracker
                    </span>
                  </div>
                  <button
                    id="toggle-highlight-hover"
                    type="button"
                    role="switch"
                    aria-checked={settings?.highlightOnHover !== false}
                    className={`settings-switch-btn ${settings?.highlightOnHover !== false ? 'active' : ''}`}
                    onClick={() => {
                      const currentVal = settings?.highlightOnHover !== false;
                      if (onUpdateSettings) onUpdateSettings({ highlightOnHover: !currentVal });
                    }}
                  >
                    <span className="settings-switch-thumb" />
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
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
                  <div className="settings-reset-msg">
                    ✓ {resetMessage}
                  </div>
                )}
              </div>
            </>
          ) : (
            <AiSettingsTab />
          )}

          <ModalFooter
            showAutoSaved={activeTab === 'general'}
            leftContent={
              <span className="modal-footer-hint">
                To disable or remove the model, turn off &ldquo;On-device AI&rdquo; in Chrome Settings.
              </span>
            }
          />
        </div>
      </div>
    </div>
  );
};
