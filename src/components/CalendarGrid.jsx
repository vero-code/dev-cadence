import React, { useState, useEffect, useRef } from 'react';
import { generateCalendarDays, getDayCellBackground } from '../utils/calendarUtils';
import { WEEKDAYS } from '../constants';

export const CalendarGrid = ({
  year,
  month,
  hackathons,
  selectedDate,
  dateRange,
  onDateRangeClick,
  onCancelDateRange,
  isSelectingOnCalendar,
}) => {
  const [activeTooltip, setActiveTooltip] = useState(null);
  const calendarCardRef = useRef(null);
  const days = generateCalendarDays(year, month, hackathons);

  const totalScheduledDays = days.filter((d) => !d.isPadding && d.events.length > 0).length;

  const isDayInActiveRange = (dateString) => {
    if (!dateRange?.start || !dateRange?.end || !dateString) return false;
    return dateString >= dateRange.start && dateString <= dateRange.end;
  };

  // Close tooltip on click outside or escape key
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (activeTooltip && !e.target.closest('.calendar-card')) {
        setActiveTooltip(null);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveTooltip(null);
    };
    window.addEventListener('click', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTooltip]);

  // Reset tooltip when month changes or on window resize
  useEffect(() => {
    setActiveTooltip(null);
  }, [year, month]);

  useEffect(() => {
    const handleResize = () => setActiveTooltip(null);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCellClick = (e, day, idx) => {
    e.stopPropagation();

    // If user is actively selecting a date range (e.g. from banner or picking dates for LogModal)
    if (isSelectingOnCalendar || (dateRange?.start && !dateRange?.end)) {
      setActiveTooltip(null);
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
      // Empty day: close tooltip and trigger range selection
      setActiveTooltip(null);
      onDateRangeClick && onDateRangeClick(day.dateString);
    }
  };

  return (
    <div className="calendar-card" ref={calendarCardRef}>
      <div className="calendar-header-row">
        <h2 className="calendar-section-title">
          <span>📅</span> Monthly Schedule
        </h2>
        {totalScheduledDays === 0 && !dateRange?.start && (
          <span className="calendar-empty-hint">
            Click days to log dates
          </span>
        )}
      </div>

      {(isSelectingOnCalendar || dateRange?.start) && (
        <div className="calendar-selection-banner">
          <div className="banner-text">
            {!dateRange?.start ? (
              <span>👉 <strong>Click a start day</strong> on the calendar to begin</span>
            ) : (
              <span>
                📍 <strong>Start:</strong> {dateRange.start} — <em>Click an end day to finish (or click same day for 1 day)</em>
              </span>
            )}
          </div>
          <button
            type="button"
            className="banner-cancel-btn"
            onClick={onCancelDateRange}
            title="Cancel selection"
          >
            ✕ Cancel
          </button>
        </div>
      )}

      <div className="calendar-grid">
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
          const inActiveRange = isDayInActiveRange(day.dateString);
          const bgStyle = getDayCellBackground(day.events);
          const isTooltipActive = activeTooltip?.dateString === day.dateString;

          return (
            <div
              key={day.dateString}
              className={`calendar-day-cell ${day.isOverlap ? 'overlap-cell' : ''} ${hasEvents ? 'active-day' : ''} ${isSelected || isTooltipActive ? 'selected-day' : ''} ${isRangeStart ? 'range-start-cell' : ''} ${inActiveRange ? 'range-active-cell' : ''}`}
              style={{ background: bgStyle }}
              onClick={(e) => handleCellClick(e, day, idx)}
              title={
                isRangeStart
                  ? 'Selected Start Date'
                  : hasEvents || hasDeadlines
                  ? `Click to view events for ${day.dateString}`
                  : `Click to select ${day.dateString}`
              }
            >
              <div className="day-top-bar">
                <span className="day-number">{day.dayNumber}</span>
                {isRangeStart && <span className="range-badge">START</span>}
                {hasDeadlines && !isRangeStart && (
                  <span className="deadline-flag" title={`Deadline: ${day.deadlines.map((d) => d.name).join(', ')}`}>
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
              </div>

              {day.isOverlap && (
                <span className="overlap-indicator-pill" title="Multiple overlapping commitments!">
                  ⚡
                </span>
              )}
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
              {activeTooltip.isOverlap && (
                <span className="tooltip-overlap-badge">⚠️ Overlap</span>
              )}
            </div>
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

          <div className="tooltip-events-list">
            {activeTooltip.events.map((e) => (
              <div key={e.id} className="tooltip-event-row">
                <span
                  className="tooltip-color-dot"
                  style={{ backgroundColor: e.color || 'var(--cyan-primary)' }}
                />
                <strong className="tooltip-event-name">
                  {e.emoji ? `${e.emoji} ` : ''}{e.name}
                </strong>
                <span className="tooltip-status-pill">{e.status}</span>
              </div>
            ))}

            {activeTooltip.deadlines && activeTooltip.deadlines.map((d) => (
              <div key={`dl-${d.id}`} className="tooltip-deadline-row">
                <span>🏁</span>
                <em>Deadline: {d.name}</em>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
