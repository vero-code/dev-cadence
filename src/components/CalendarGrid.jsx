import { useState, useEffect, useRef } from 'react';
import { generateCalendarDays } from '../utils/calendarUtils';
import { WEEKDAYS } from '../constants';
import { MonthNavigator } from './MonthNavigator';
import { ScheduleBadgeIcon } from './Icons';
import { computeTooltipPosition } from '../utils/calendarRangeUtils';
import { CalendarDayTooltip } from './CalendarDayTooltip';
import { CalendarDayCell } from './CalendarDayCell';

export const CalendarGrid = ({
  year,
  month,
  hackathons,
  selectedDate,
  dateRange,
  modalActiveRange,
  avgTurnaroundDays = 10,
  onDateRangeClick,
  onCancelDateRange,
  onCancelModalRange,
  onOpenAdd,
  isSelectingOnCalendar,
  onPrevMonth,
  onNextMonth,
  onEdit,
  hoveredHackathonId,
}) => {
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [hoveredRangeDate, setHoveredRangeDate] = useState(null);
  const calendarCardRef = useRef(null);
  const days = generateCalendarDays(year, month, hackathons);
  const hoveredHackathon = hoveredHackathonId
    ? (hackathons || []).find((h) => h.id === hoveredHackathonId)
    : null;

  const totalScheduledDays = days.filter((d) => !d.isPadding && d.events.length > 0).length;

  // Close tooltip or cancel date booking when clicking on another area or pressing escape key
  useEffect(() => {
    const handleOutsideClick = (e) => {
      // If tooltip is open and clicked outside the calendar card
      if (activeTooltip && !e.target.closest('.calendar-card')) {
        setActiveTooltip(null);
      }

      // If date range booking is active and user clicks on another area (outside day cells and banner)
      if (dateRange?.start && !dateRange?.end) {
        const clickedDayCell = e.target.closest('.calendar-day-cell:not(.padding-cell)');
        const clickedBanner = e.target.closest('.calendar-selection-banner');
        const clickedTooltip = e.target.closest('.calendar-day-tooltip');

        if (!clickedDayCell && !clickedBanner && !clickedTooltip) {
          setHoveredRangeDate(null);
          onCancelDateRange && onCancelDateRange();
        }
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveTooltip(null);
        if (dateRange?.start && !dateRange?.end) {
          setHoveredRangeDate(null);
          onCancelDateRange && onCancelDateRange();
        }
      }
    };

    window.addEventListener('click', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTooltip, dateRange, onCancelDateRange]);

  // Reset tooltip and preview when month changes or on window resize
  const [prevPeriod, setPrevPeriod] = useState(`${year}-${month}`);
  const currentPeriod = `${year}-${month}`;
  if (prevPeriod !== currentPeriod) {
    setPrevPeriod(currentPeriod);
    setActiveTooltip(null);
    setHoveredRangeDate(null);
  }

  useEffect(() => {
    const handleResize = () => {
      setActiveTooltip(null);
      setHoveredRangeDate(null);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleBookFromTooltip = (dateString) => {
    setActiveTooltip(null);
    if (onOpenAdd) {
      onOpenAdd(dateString);
    } else if (onDateRangeClick) {
      onDateRangeClick(dateString);
    }
  };

  const handleCellClick = (e, day) => {
    e.stopPropagation();

    // If create/edit modal is actively open (calendar has dashed range highlight)
    if (modalActiveRange) {
      // Repeat click on the start day itself: cancel selection / close modal
      if (modalActiveRange.startDate && day.dateString === modalActiveRange.startDate) {
        setActiveTooltip(null);
        setHoveredRangeDate(null);
        if (onCancelModalRange) {
          onCancelModalRange();
        } else if (onCancelDateRange) {
          onCancelDateRange();
        }
        return;
      }
      // Clicking any other day (inside or outside range) dynamically updates form dates
      setActiveTooltip(null);
      setHoveredRangeDate(null);
      onDateRangeClick && onDateRangeClick(day.dateString);
      return;
    }

    // If user is actively selecting a date range (e.g. from banner or picking dates for LogModal)
    if (isSelectingOnCalendar || (dateRange?.start && !dateRange?.end)) {
      if (dateRange?.start === day.dateString) {
        // Repeat click on dashed start day: cancel selection
        setActiveTooltip(null);
        setHoveredRangeDate(null);
        onCancelDateRange && onCancelDateRange();
        return;
      }
      setActiveTooltip(null);
      setHoveredRangeDate(null);
      onDateRangeClick && onDateRangeClick(day.dateString);
      return;
    }

    const hasEvents = day.events && day.events.length > 0;
    const hasDeadlines = day.deadlines && day.deadlines.length > 0;

    // If day is not empty, show or toggle the tooltip anchored to this cell
    if (hasEvents || hasDeadlines) {
      if (activeTooltip?.dateString === day.dateString) {
        setActiveTooltip(null);
      } else {
        const cellEl = e.currentTarget;
        const cardEl = calendarCardRef.current;
        if (!cellEl || !cardEl) return;

        const position = computeTooltipPosition(cellEl, cardEl);
        setActiveTooltip({
          ...day,
          ...position,
        });
      }
    } else {
      // Empty day: open creation modal prefilled with this date
      setActiveTooltip(null);
      setHoveredRangeDate(null);
      if (onOpenAdd) {
        onOpenAdd(day.dateString);
      } else if (onDateRangeClick) {
        onDateRangeClick(day.dateString);
      }
    }
  };

  return (
    <div className="calendar-card" ref={calendarCardRef}>
      <div className="calendar-header-row">
        <h2 className="calendar-section-title">
          <ScheduleBadgeIcon className="schedule-badge-icon" size={16} />
          <span>Schedule</span>
        </h2>
        <div className="calendar-month-nav">
          <MonthNavigator
            currentYear={year}
            currentMonth={month}
            onPrevMonth={onPrevMonth}
            onNextMonth={onNextMonth}
          />
        </div>
      </div>

      {totalScheduledDays === 0 && !dateRange?.start && (
        <span className="calendar-empty-hint">
          Click days to log dates
        </span>
      )}

      <div className="calendar-grid" onMouseLeave={() => setHoveredRangeDate(null)}>
        {WEEKDAYS.map((w) => (
          <div key={w} className="calendar-weekday-cell">
            {w}
          </div>
        ))}

        {days.map((day, idx) => (
          <CalendarDayCell
            key={day.isPadding ? `pad-${idx}` : day.dateString}
            day={day}
            selectedDate={selectedDate}
            dateRange={dateRange}
            hoveredRangeDate={hoveredRangeDate}
            avgTurnaroundDays={avgTurnaroundDays}
            modalActiveRange={modalActiveRange}
            hoveredHackathonId={hoveredHackathonId}
            hoveredHackathon={hoveredHackathon}
            isTooltipActive={activeTooltip?.dateString === day.dateString}
            onClick={handleCellClick}
            onHoverDate={(dateString) => {
              if (dateRange?.start && !dateRange?.end) {
                setHoveredRangeDate(dateString);
              }
            }}
          />
        ))}
      </div>

      <CalendarDayTooltip
        tooltip={activeTooltip}
        onBook={handleBookFromTooltip}
        onClose={() => setActiveTooltip(null)}
        onEdit={onEdit}
      />
    </div>
  );
};
