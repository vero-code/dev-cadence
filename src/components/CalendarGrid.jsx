import React, { useState } from 'react';
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
  const [hoveredDay, setHoveredDay] = useState(null);
  const days = generateCalendarDays(year, month, hackathons);

  const totalScheduledDays = days.filter((d) => !d.isPadding && d.events.length > 0).length;

  // Calculate range preview between dateRange.start and hovered day
  const isDayInRangePreview = (dateString) => {
    if (!dateRange?.start || dateRange?.end || !hoveredDay?.dateString || !dateString) return false;
    const [start, end] = [dateRange.start, hoveredDay.dateString].sort();
    return dateString >= start && dateString <= end;
  };

  const isDayInActiveRange = (dateString) => {
    if (!dateRange?.start || !dateRange?.end || !dateString) return false;
    return dateString >= dateRange.start && dateString <= dateRange.end;
  };

  return (
    <div className="calendar-card">
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
          const inRangePreview = isDayInRangePreview(day.dateString);
          const inActiveRange = isDayInActiveRange(day.dateString);
          const bgStyle = getDayCellBackground(day.events);

          return (
            <div
              key={day.dateString}
              className={`calendar-day-cell ${day.isOverlap ? 'overlap-cell' : ''} ${hasEvents ? 'active-day' : ''} ${isSelected ? 'selected-day' : ''} ${isRangeStart ? 'range-start-cell' : ''} ${inRangePreview ? 'range-preview-cell' : ''} ${inActiveRange ? 'range-active-cell' : ''}`}
              style={{ background: bgStyle }}
              onClick={() => onDateRangeClick && onDateRangeClick(day.dateString)}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
              title={
                isRangeStart
                  ? 'Selected Start Date'
                  : day.events.map((e) => `${e.emoji} ${e.name}`).join(' | ') || `Click to select ${day.dateString}`
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

      {hoveredDay && (
        <div className="calendar-hover-tooltip">
          <div className="tooltip-title">
            <span>📅 {hoveredDay.dateString}</span>
            {dateRange?.start && !dateRange?.end && hoveredDay.dateString && (
              <span className="tooltip-range-action">
                {hoveredDay.dateString === dateRange.start
                  ? 'Click to set 1-day hackathon'
                  : `Click to set as End Date`}
              </span>
            )}
            {hoveredDay.isOverlap && (
              <span className="tooltip-overlap-warning">⚠️ Overlap Collision</span>
            )}
          </div>
          <div className="tooltip-events-list">
            {hoveredDay.events.length === 0 && hoveredDay.deadlines.length === 0 && (
              <div className="tooltip-empty-day">
                {dateRange?.start && !dateRange?.end
                  ? 'Click to set this day as your hackathon end date'
                  : '✨ Free day — available for new hackathon work'}
              </div>
            )}
            {hoveredDay.events.map((e) => (
              <div key={e.id} className="tooltip-event-row">
                <span className="color-dot" style={{ backgroundColor: e.color }} />
                <strong>{e.emoji} {e.name}</strong>
                <span className="tooltip-event-status">({e.status})</span>
              </div>
            ))}
            {hoveredDay.deadlines.map((d) => (
              <div key={`dl-${d.id}`} className="tooltip-deadline-row">
                🏁 <em>Submission deadline for: {d.name}</em>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
