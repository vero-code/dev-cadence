import React, { useState, useEffect, useRef } from 'react';
import { generateCalendarDays, getDayCellBackground, addDaysToDateString } from '../utils/calendarUtils';
import { WEEKDAYS } from '../constants';
import { MonthNavigator } from './MonthNavigator';
import { ScheduleBadgeIcon } from './Icons';

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
  onJumpToMonth,
}) => {
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [hoveredRangeDate, setHoveredRangeDate] = useState(null);
  const calendarCardRef = useRef(null);
  const days = generateCalendarDays(year, month, hackathons);

  const totalScheduledDays = days.filter((d) => !d.isPadding && d.events.length > 0).length;

  const isDayInActiveRange = (dateString) => {
    if (!dateRange?.start || !dateRange?.end || !dateString) return false;
    return dateString >= dateRange.start && dateString <= dateRange.end;
  };

  // Calculate range preview between dateRange.start and hovered day, defaulting to avgTurnaroundDays span
  const isDayInRangePreview = (dateString) => {
    if (!dateRange?.start || dateRange?.end || !dateString) return false;
    const defaultEnd = addDaysToDateString(dateRange.start, (avgTurnaroundDays || 10) - 1);
    const targetEnd = hoveredRangeDate || defaultEnd;
    const [start, end] = [dateRange.start, targetEnd].sort();
    return dateString >= start && dateString <= end;
  };

  const isValidDate = (d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d);

  // Check if day falls within the active create/edit form date range
  const isDayInModalRange = (dateString) => {
    if (!modalActiveRange?.startDate || !dateString || !isValidDate(modalActiveRange.startDate)) return false;
    const end = (modalActiveRange.endDate && isValidDate(modalActiveRange.endDate)) ? modalActiveRange.endDate : modalActiveRange.startDate;
    const [startD, endD] = [modalActiveRange.startDate, end].sort();
    return dateString >= startD && dateString <= endD;
  };

  const isModalStart = (dateString) => {
    return Boolean(modalActiveRange?.startDate && modalActiveRange.startDate === dateString);
  };

  const isModalEnd = (dateString) => {
    return Boolean(
      modalActiveRange?.endDate &&
      modalActiveRange.endDate === dateString &&
      modalActiveRange.endDate !== modalActiveRange.startDate
    );
  };

  const isModalDeadline = (dateString) => {
    return Boolean(modalActiveRange?.deadline && modalActiveRange.deadline === dateString);
  };

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
  useEffect(() => {
    setActiveTooltip(null);
    setHoveredRangeDate(null);
  }, [year, month]);

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

  const handleCellClick = (e, day, idx) => {
    e.stopPropagation();

    // If create/edit modal is actively open (calendar has dashed range highlight)
    if (modalActiveRange) {
      // Repeat click on cell with dashed outline: deselects / closes creation screen
      if (isDayInModalRange(day.dateString)) {
        setActiveTooltip(null);
        setHoveredRangeDate(null);
        if (onCancelModalRange) {
          onCancelModalRange();
        } else if (onCancelDateRange) {
          onCancelDateRange();
        }
        return;
      }
      // Clicking another day while modal is open updates form dates to that day
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

        const cellRect = cellEl.getBoundingClientRect();
        const cardRect = cardEl.getBoundingClientRect();

        const cellTop = cellRect.top - cardRect.top;
        const cellLeft = cellRect.left - cardRect.left;
        const cellWidth = cellRect.width;
        const cellHeight = cellRect.height;
        const cardWidth = cardRect.width;
        const cardHeight = cardRect.height;

        const cellCenterX = cellLeft + cellWidth / 2;

        // Tooltip compact width
        const tooltipWidth = Math.min(250, cardWidth - 20);

        // Clamped horizontal position inside card
        let left = cellCenterX - tooltipWidth / 2;
        if (left < 10) left = 10;
        if (left + tooltipWidth > cardWidth - 10) {
          left = cardWidth - tooltipWidth - 10;
        }

        const arrowLeft = Math.max(12, Math.min(tooltipWidth - 12, cellCenterX - left));

        // If cell is in lower half of card, position tooltip immediately above it; otherwise immediately below it
        const showAbove = cellTop > cardHeight * 0.52;

        setActiveTooltip({
          ...day,
          style: {
            left: `${left}px`,
            width: `${tooltipWidth}px`,
            ...(showAbove
              ? { bottom: `${cardHeight - cellTop + 6}px` }
              : { top: `${cellTop + cellHeight + 6}px` }),
            '--arrow-left': `${arrowLeft}px`,
          },
          showAbove,
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
          <ScheduleBadgeIcon className="schedule-badge-icon" size={17} />
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

        {days.map((day, idx) => {
          if (day.isPadding) {
            return <div key={`pad-${idx}`} className="calendar-day-cell padding-cell" />;
          }

          const hasEvents = day.events.length > 0;
          const hasDeadlines = day.deadlines.length > 0;
          const isSelected = selectedDate === day.dateString;
          const isRangeStart = dateRange?.start === day.dateString;
          const inRangePreview = isDayInRangePreview(day.dateString);
          const inActiveRange = isDayInActiveRange(day.dateString);
          const inModalRange = isDayInModalRange(day.dateString);
          const isModalStartDay = isModalStart(day.dateString);
          const isModalEndDay = isModalEnd(day.dateString);
          const isModalDeadlineDay = isModalDeadline(day.dateString);

          let bgStyle = getDayCellBackground(day.events);
          if (inModalRange) {
            if (modalActiveRange?.color) {
              if (day.events.length === 0) {
                bgStyle = `${modalActiveRange.color}33`;
              } else {
                bgStyle = `linear-gradient(rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0.32)), ${bgStyle}`;
              }
            } else if (day.events.length === 0) {
              bgStyle = 'rgba(245, 158, 11, 0.16)';
            }
          }

          const cellInlineStyle = {
            background: bgStyle,
            ...(inModalRange && modalActiveRange?.color
              ? {
                  '--draft-outline-color': modalActiveRange.color,
                  '--draft-shadow-color': `${modalActiveRange.color}44`,
                }
              : {}),
          };

          const isTooltipActive = activeTooltip?.dateString === day.dateString;

          const cellTitle = isRangeStart
            ? 'Selected Start Date'
            : hasEvents || hasDeadlines
            ? `Click to view events for ${day.dateString}`
            : `Click to select ${day.dateString}`;

          return (
            <div
              key={day.dateString}
              className={`calendar-day-cell ${day.isToday ? 'today-cell' : ''} ${hasEvents ? 'active-day' : ''} ${isSelected || isTooltipActive ? 'selected-day' : ''} ${isRangeStart ? 'range-start-cell' : ''} ${inRangePreview ? 'range-preview-cell' : ''} ${inActiveRange ? 'range-active-cell' : ''} ${inModalRange ? 'modal-dashed-cell' : ''}`}
              style={cellInlineStyle}
              onClick={(e) => handleCellClick(e, day, idx)}
              onMouseEnter={() => {
                if (dateRange?.start && !dateRange?.end) {
                  setHoveredRangeDate(day.dateString);
                }
              }}
              title={cellTitle}
            >
              <div className="day-top-bar">
                <span className="day-number">{day.dayNumber}</span>
                {day.isToday && <span className="today-badge" title="Today">TODAY</span>}
                {isRangeStart && <span className="range-badge">START</span>}
                {isModalStartDay && !isRangeStart && (
                  <span
                    className="range-badge draft-start-badge"
                    style={modalActiveRange?.color ? { backgroundColor: modalActiveRange.color, color: '#fff' } : undefined}
                    title="Draft Start Date"
                  >
                    START
                  </span>
                )}
                {isModalEndDay && !isRangeStart && (
                  <span
                    className="range-badge draft-end-badge"
                    style={modalActiveRange?.color ? { backgroundColor: modalActiveRange.color, color: '#fff' } : undefined}
                    title="Draft End Date"
                  >
                    END
                  </span>
                )}
                {(hasDeadlines || isModalDeadlineDay) && (
                  <span
                    className={`deadline-flag ${isModalDeadlineDay ? 'draft-deadline-flag' : ''}`}
                    title={
                      isModalDeadlineDay
                        ? `Draft Deadline: ${modalActiveRange?.name || 'Hackathon'}`
                        : `Deadline: ${day.deadlines.map((d) => d.name).join(', ')}`
                    }
                  >
                    🏁
                  </span>
                )}
              </div>

              <div className="day-badges-wrap">
                {day.events.map((e) =>
                  e.emoji ? (
                    <span
                      key={e.id}
                      className="day-event-emoji"
                      title={`${e.name} (${e.status})`}
                      style={{ color: e.color }}
                    >
                      {e.emoji}
                    </span>
                  ) : null
                )}
                {inModalRange && modalActiveRange?.emoji && (
                  <span
                    className="day-event-emoji draft-event-emoji"
                    title={`Draft: ${modalActiveRange.name || 'Hackathon'}`}
                    style={modalActiveRange.color ? { color: modalActiveRange.color } : undefined}
                  >
                    {modalActiveRange.emoji}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {activeTooltip && (
        <div
          className={`calendar-day-tooltip ${activeTooltip.showAbove ? 'tooltip-above' : ''}`}
          style={activeTooltip.style}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="tooltip-header">
            <div className="tooltip-title-wrap">
              <span className="tooltip-date">📅 {activeTooltip.dateString}</span>
            </div>
            <div className="tooltip-header-actions">
              <button
                type="button"
                className="tooltip-add-btn"
                onClick={() => handleBookFromTooltip(activeTooltip.dateString)}
                title="Book hackathon starting from this date"
                aria-label="Book date"
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <path d="M6 1.5v9M1.5 6h9" />
                </svg>
              </button>
              <button
                type="button"
                className="tooltip-close-btn"
                onClick={() => setActiveTooltip(null)}
                aria-label="Close tooltip"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="tooltip-events-list">
            {activeTooltip.events.map((e) => (
              <div key={e.id} className="tooltip-event-row">
                <div className="tooltip-event-info">
                  {e.color && (
                    <span
                      className="tooltip-color-dot"
                      style={{ backgroundColor: e.color }}
                    />
                  )}
                  <strong className="tooltip-event-name" title={e.name}>
                    {e.emoji ? `${e.emoji} ` : ''}{e.name}
                  </strong>
                </div>
                <button
                  type="button"
                  className="tooltip-event-edit-btn"
                  title={`Edit ${e.name}`}
                  aria-label={`Edit ${e.name}`}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setActiveTooltip(null);
                    onEdit && onEdit(e);
                  }}
                >
                  ✏️
                </button>
              </div>
            ))}

            {activeTooltip.deadlines && activeTooltip.deadlines.map((d) => (
              <div key={`dl-${d.id}`} className="tooltip-deadline-row">
                <div className="tooltip-deadline-info">
                  <span>🏁</span>
                  <em>Deadline: {d.name}</em>
                </div>
                <button
                  type="button"
                  className="tooltip-event-edit-btn"
                  title={`Edit ${d.name}`}
                  aria-label={`Edit ${d.name}`}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setActiveTooltip(null);
                    onEdit && onEdit(d);
                  }}
                >
                  ✏️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
