import React from 'react';

export const Header = ({ onOpenSettings }) => {
  return (
    <header className="panel-header">
      <div className="brand-row">
        <div className="brand-left">
          <div className="brand-logo-frame">
            <img src="/logo.jpg" alt="Dev Cadence Automaton" className="brand-logo" />
          </div>
          <div className="brand-title-wrap">
            <h1 className="brand-title">Dev Cadence</h1>
            <span className="brand-subtitle">Smart Pacing for Devpost</span>
          </div>
        </div>
        <div className="header-actions">
          <div
            className="header-avatar-badge"
            title="Engineer Profile (Coming Soon)"
            tabIndex={0}
            role="button"
            aria-label="User Profile"
          >
            <span className="avatar-icon">👤</span>
          </div>
          <button
            type="button"
            className="settings-icon-btn"
            onClick={onOpenSettings}
            title="Settings & Themes"
            aria-label="Settings and Themes"
          >
            ⚙️
          </button>
        </div>
      </div>
    </header>
  );
};
