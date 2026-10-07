import React from 'react';
import { DEVPOST_PROFILE_URL } from '../constants';

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
          <button
            type="button"
            className="settings-icon-btn"
            onClick={onOpenSettings}
            title="Settings & Themes"
            aria-label="Settings and Themes"
          >
            <span className="settings-icon">⚙️</span>
          </button>
          <a
            href={DEVPOST_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="header-avatar-badge"
            title="Devpost Profile: @v_code"
            aria-label="Devpost Profile @v_code"
          >
            <img
              src="/avatar.png"
              alt="v_code Devpost Profile"
              className="header-avatar-img"
            />
          </a>
        </div>
      </div>
    </header>
  );
};
