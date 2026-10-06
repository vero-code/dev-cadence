import React, { useState } from 'react';
import { generateCalendarDays, getDayCellBackground } from '../utils/calendarUtils';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const CalendarGrid = ({ year, month, hackathons, selectedDate, onSelectDate }) => {
  const [hoveredDay, setHoveredDay] = useState(null);
  const days = generateCalendarDays(year, month, hackathons);

  const totalScheduledDays = days.filter((d) => !d.isPadding && d.events.length > 0).length;

  return (
    <div className="calendar-card">
      <div className="calendar-header-row">
        <h2 className="calendar-section-title">
          <span>📅</span> Monthly Schedule Grid
        </h2>
        {totalScheduledDays === 0 && (
          <span className="calendar-empty-hint">
            Add a hackathon to start planning
          </span>
        )}
      </div>

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
          const bgStyle = getDayCellBackground(day.events);

          return (
            <div
              key={day.dateString}
              className={`calendar-day-cell ${day.isOverlap ? 'overlap-cell' : ''} ${hasEvents ? 'active-day' : ''} ${isSelected ? 'selected-day' : ''}`}
              style={{ background: bgStyle }}
              onClick={() => onSelectDate && onSelectDate(day.dateString === selectedDate ? null : day.dateString)}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
              title={day.events.map((e) => `${e.emoji} ${e.name}`).join(' | ')}
            >
              <div className="day-top-bar">
                <span className="day-number">{day.dayNumber}</span>
                {hasDeadlines && (
                  <span className="deadline-flag" title={`Deadline: ${day.deadlines.map((d) => d.name).join(', ')}`}>
                    🏁
                  </span>
                )}
              </div>

              <div className="day-badges-wrap">
                {day.events.map((e) => (
                  <span
                    key={e.id}
                    className="day-event-emoji"
                    title={`${e.name} (${e.status})`}
                    style={{ color: e.color }}
                  >
                    {e.emoji}
                  </span>
                ))}
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

      {hoveredDay && hoveredDay.events.length > 0 && (
        <div className="calendar-hover-tooltip">
          <div className="tooltip-title">
            <span>📅 {hoveredDay.dateString}</span>
            {hoveredDay.isOverlap && (
              <span className="tooltip-overlap-warning">⚠️ Overlap Collision</span>
            )}
          </div>
          <div className="tooltip-events-list">
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
