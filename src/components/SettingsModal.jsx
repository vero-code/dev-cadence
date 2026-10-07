import React, { useState, useEffect } from 'react';

const THEMES = [
  {
    id: 'steampunk',
    name: 'Rich Automaton Dark',
    icon: '⚙️',
    desc: 'Clockwork brass, rich mahogany & warm glow',
  },
  {
    id: 'parchment',
    name: 'Light Parchment & Brass',
    icon: '📜',
    desc: 'Devpost parchment paper & brass accents',
  },
  {
    id: 'dark',
    name: 'Midnight Dark',
    icon: '🌙',
    desc: 'Deep obsidian & electric cyan glow',
  },
];

export const SettingsModal = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  currentTheme,
  onSelectTheme,
}) => {
  const [targetRestDays, setTargetRestDays] = useState(8);
  const [avgTurnaroundDays, setAvgTurnaroundDays] = useState(10);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setTargetRestDays(settings.targetRestDays ?? 8);
      setAvgTurnaroundDays(settings.avgTurnaroundDays ?? 10);
    }
    setSavedSuccess(false);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      targetRestDays: Math.max(0, Math.min(28, parseInt(targetRestDays, 10) || 0)),
      avgTurnaroundDays: Math.max(1, parseInt(avgTurnaroundDays, 10) || 1),
    };
    onSaveSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 400);
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

          {savedSuccess && (
            <div style={{ color: 'var(--emerald)', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 600 }}>
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
