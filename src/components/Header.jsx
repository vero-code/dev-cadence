import React from 'react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const Header = ({ currentYear, currentMonth, onPrevMonth, onNextMonth, onOpenSettings }) => {
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
            className="icon-btn" 
            title="Configure Capacity Settings"
            onClick={onOpenSettings}
          >
            ⚙️
          </button>
        </div>
      </div>

      <div className="month-nav-row">
        <button 
          type="button" 
          className="nav-arrow-btn" 
          onClick={onPrevMonth}
          title="Previous Month"
        >
          &larr;
        </button>
        <span className="month-label">
          {monthName} {currentYear} Goals
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
    </header>
  );
};
