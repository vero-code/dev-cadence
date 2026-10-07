import React from 'react';
import { MONTH_NAMES } from '../constants';

export const MonthNavigator = ({ currentYear, currentMonth, onPrevMonth, onNextMonth }) => {
  const monthName = MONTH_NAMES[currentMonth] || '';

  return (
    <>
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
    </>
  );
};
