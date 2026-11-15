import { useState, useCallback } from 'react';
import { addDaysToDateString } from '../utils/calendarUtils';
import { useMonthNavigation } from './useMonthNavigation';

export const useLogCalendarFlow = (avgTurnaroundDays) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [prefillDates, setPrefillDates] = useState(null);
  const [isSelectingOnCalendar, setIsSelectingOnCalendar] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [editingHackathon, setEditingHackathon] = useState(null);
  const [modalDates, setModalDates] = useState(null);
  const [calendarPickedDate, setCalendarPickedDate] = useState(null);

  const clearSelection = () => {
    setSelectedDate(null);
    setDateRange({ start: null, end: null });
  };

  const {
    currentYear,
    currentMonth,
    handlePrevMonth,
    handleNextMonth,
    handleJumpToMonth,
  } = useMonthNavigation(clearSelection);

  const resetAllFlowState = () => {
    clearSelection();
    setPrefillDates(null);
    setEditingHackathon(null);
  };

  const completeSaveFlow = () => {
    setEditingHackathon(null);
    setPrefillDates(null);
    setDateRange({ start: null, end: null });
  };

  const handleOpenEdit = (hackathon) => {
    setEditingHackathon(hackathon);
    setPrefillDates(null);
    setIsLogModalOpen(true);
  };

  const handleOpenAdd = (targetDate = null) => {
    const avgDays = Number(avgTurnaroundDays) || 10;
    if (typeof targetDate === 'string' && targetDate) {
      const end = addDaysToDateString(targetDate, avgDays - 1);
      setPrefillDates({ startDate: targetDate, endDate: end });
    } else if (dateRange.start) {
      const end = dateRange.end || addDaysToDateString(dateRange.start, avgDays - 1);
      setPrefillDates({ startDate: dateRange.start, endDate: end });
    } else {
      const monthPadded = String(currentMonth + 1).padStart(2, '0');
      const start = `${currentYear}-${monthPadded}-05`;
      const end = addDaysToDateString(start, avgDays - 1);
      setPrefillDates({ startDate: start, endDate: end });
    }
    setEditingHackathon(null);
    setIsSelectingOnCalendar(false);
    setIsLogModalOpen(true);
  };

  const handleDateRangeClick = (dateString) => {
    // When form is open, calendar clicks update form dates directly
    if (isLogModalOpen) {
      setCalendarPickedDate({ date: dateString, timestamp: Date.now() });
      return;
    }

    if (!dateRange.start) {
      setDateRange({ start: dateString, end: null });
      setSelectedDate(dateString);
    } else if (!dateRange.end) {
      const [start, end] = [dateRange.start, dateString].sort();
      setDateRange({ start, end });
      setSelectedDate(null);
      setPrefillDates({ startDate: start, endDate: end });
      setEditingHackathon(null);
      setIsSelectingOnCalendar(false);
      setIsLogModalOpen(true);
    } else {
      setDateRange({ start: dateString, end: null });
      setSelectedDate(dateString);
    }
  };

  const handleCancelDateRange = () => {
    clearSelection();
    if (isSelectingOnCalendar) {
      setIsSelectingOnCalendar(false);
      setIsLogModalOpen(true);
    }
  };

  const handleCloseLogModal = () => {
    setIsLogModalOpen(false);
    setEditingHackathon(null);
    setPrefillDates(null);
    setDateRange({ start: null, end: null });
    setIsSelectingOnCalendar(false);
    setModalDates(null);
    setCalendarPickedDate(null);
  };

  const handlePickOnCalendar = () => {
    setIsLogModalOpen(false);
    setIsSelectingOnCalendar(true);
    setDateRange({ start: null, end: null });
  };

  const handleDatesChange = useCallback((dates) => {
    setModalDates((prev) => {
      if (
        prev &&
        prev.startDate === dates?.startDate &&
        prev.endDate === dates?.endDate &&
        prev.deadline === dates?.deadline &&
        prev.color === dates?.color &&
        prev.emoji === dates?.emoji &&
        prev.name === dates?.name &&
        prev.status === dates?.status &&
        prev.id === dates?.id
      ) {
        return prev;
      }
      return dates;
    });

    if (dates?.startDate && /^\d{4}-\d{2}-\d{2}$/.test(dates.startDate)) {
      handleJumpToMonth(dates.startDate);
    }
  }, [handleJumpToMonth]);

  return {
    currentYear,
    currentMonth,
    selectedDate,
    dateRange,
    prefillDates,
    isSelectingOnCalendar,
    isLogModalOpen,
    editingHackathon,
    modalDates,
    calendarPickedDate,
    handlePrevMonth,
    handleNextMonth,
    handleJumpToMonth,
    handleOpenEdit,
    handleOpenAdd,
    handleDateRangeClick,
    handleCancelDateRange,
    handleCloseLogModal,
    handlePickOnCalendar,
    handleDatesChange,
    clearSelection,
    completeSaveFlow,
    resetAllFlowState,
  };
};