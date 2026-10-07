import React from 'react';
import { MONTH_NAMES } from '../constants';

export const Header = ({ currentYear, currentMonth, onPrevMonth, onNextMonth, onOpenSettings, theme, onToggleTheme }) => {
  const monthName = MONTH_NAMES[currentMonth] || '';

  const getThemeDetails = () => {
    switch (theme) {
      case 'parchment':
        return {
          icon: '📜',
          title: 'Current theme: Light Parchment & Brass. Click for Rich Automaton Dark (⚙️)',
        };
      case 'steampunk':
        return {
          icon: '⚙️',
          title: 'Current theme: Rich Automaton Dark. Click for Midnight Dark (🌙)',
        };
      case 'dark':
      default:
        return {
          icon: '🌙',
          title: 'Current theme: Midnight Dark. Click for Light Parchment & Brass (📜)',
        };
    }
  };

  const themeInfo = getThemeDetails();

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
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            title={themeInfo.title}
            aria-label="Toggle theme"
          >
            {themeInfo.icon}
          </button>
          <button 
          type="button" 
          className="nav-arrow-btn" 
          onClick={onPrevMonth}
          title="Previous Month"
        >
          &larr;
        </button>
        <span className="month-label">
          {monthName} {currentYear}
        </span>
        <button 
          type="button" 
          className="nav-arrow-btn" 
          onClick={onNextMonth}
          title="Next Month"
        >
          &rarr;
        </button>
        </div>
      </div>
    </header>
  );
};
