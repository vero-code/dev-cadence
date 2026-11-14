import { useState, useCallback } from 'react';

/**
 * Custom hook to manage active year/month calendar state and navigation.
 * Handles next/prev month transitions, year rollovers, jumping to dates, and resetting selection.
 */
export const useMonthNavigation = (
  onMonthChange,
  initialYear = new Date().getFullYear(),
  initialMonth = new Date().getMonth()
) => {
  const [currentYear, setCurrentYear] = useState(initialYear);
  const [currentMonth, setCurrentMonth] = useState(initialMonth);

  const handlePrevMonth = useCallback(() => {
    if (typeof onMonthChange === 'function') {
      onMonthChange();
    }
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }, [currentMonth, onMonthChange]);

  const handleNextMonth = useCallback(() => {
    if (typeof onMonthChange === 'function') {
      onMonthChange();
    }
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }, [currentMonth, onMonthChange]);

  const handleJumpToMonth = useCallback((dateString) => {
    if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return;
    const [yStr, mStr] = dateString.split('-');
    const y = parseInt(yStr, 10);
    const m = parseInt(mStr, 10) - 1;
    if (!isNaN(y) && !isNaN(m) && m >= 0 && m <= 11) {
      setCurrentYear(y);
      setCurrentMonth(m);
    }
  }, []);

  const setYearAndMonth = useCallback((year, month) => {
    if (typeof year === 'number' && !isNaN(year)) setCurrentYear(year);
    if (typeof month === 'number' && !isNaN(month) && month >= 0 && month <= 11) setCurrentMonth(month);
  }, []);

  return {
    currentYear,
    currentMonth,
    setCurrentYear,
    setCurrentMonth,
    handlePrevMonth,
    handleNextMonth,
    handleJumpToMonth,
    setYearAndMonth,
  };
};
