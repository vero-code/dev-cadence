import React from 'react';
import { MONTH_NAMES } from '../constants';

export const Header = ({ currentYear, currentMonth, onPrevMonth, onNextMonth, onOpenSettings, theme, onToggleTheme }) => {
  const monthName = MONTH_NAMES[currentMonth] || '';

  return (
    <header className="panel-header">
      <div className="brand-row">
        <div className="brand-left">
          <img src="/logo.jpg" alt="Dev Cadence Automaton" className="brand-logo" />
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
            title={theme === 'parchment' ? 'Switch to Rich Automaton Dark theme' : 'Switch to Light Parchment & Brass theme'}
            aria-label="Toggle theme"
          >
            {theme === 'parchment' ? '🌙' : '📜'}
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
