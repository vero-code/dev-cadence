import React from 'react';
import { getDaysInMonth } from '../utils/calendarUtils';

export const CapacityBar = ({ year, month, hackathons, settings, onOpenSettings }) => {
  const daysInMonth = getDaysInMonth(year, month);
  const targetRest = settings?.targetRestDays ?? 8;

  const monthPadded = String(month + 1).padStart(2, '0');

  // Count distinct calendar days in this month that have at least one active hackathon
  let committedDaysCount = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const dayPadded = String(d).padStart(2, '0');
    const dateString = `${year}-${monthPadded}-${dayPadded}`;
    const targetDate = new Date(dateString);

    const isCommitted = hackathons.some((h) => {
      if (!h.startDate || !h.endDate) return false;
      const start = new Date(h.startDate);
      const end = new Date(h.endDate);
      return targetDate >= start && targetDate <= end;
    });

    if (isCommitted) {
      committedDaysCount++;
    }
  }

  const freeDays = Math.max(0, daysInMonth - committedDaysCount);
  const isOvercommitted = freeDays < targetRest;
  const shortageDays = targetRest - freeDays;

  // Split available days into flexible buffer and target rest
  const surplusDays = Math.max(0, freeDays - targetRest);
  const restDays = Math.min(targetRest, freeDays);

  // Percentage calculations for capacity progress bar
  const committedPercent = Math.min(100, Math.round((committedDaysCount / daysInMonth) * 100));
  const availablePercent = Math.min(100 - committedPercent, Math.round((surplusDays / daysInMonth) * 100));
  const restPercent = Math.max(0, 100 - committedPercent - availablePercent);

  return (
    <div className="capacity-card">
      <div className="capacity-metrics-grid">
        <div className="capacity-metric-box">
          <span className="metric-label">Work</span>
          <span className="metric-value committed-val">{committedDaysCount} days</span>
        </div>
        <div className="capacity-metric-box">
          <span className="metric-label">Available</span>
          <span className="metric-value free-val">
            {freeDays} days
          </span>
        </div>
        <div
          className="capacity-metric-box"
          style={onOpenSettings ? { cursor: 'pointer' } : undefined}
          onClick={onOpenSettings}
          title={onOpenSettings ? 'Click to configure Target Rest days' : undefined}
        >
          <span className="metric-label">Target Rest</span>
          <span className="metric-value rest-val">{targetRest} days</span>
        </div>
      </div>

      {/* Visual Capacity Bar */}
      <div
        className="capacity-progress-track"
        title={`Work: ${committedDaysCount}d (${committedPercent}%) | Available: ${freeDays}d (${surplusDays}d buffer + ${restDays}d rest) | Target Rest: ${targetRest}d`}
      >
        <div
          className="progress-segment committed-seg"
          style={{ width: `${committedPercent}%` }}
          title={`Work: ${committedDaysCount} days (${committedPercent}%)`}
        />
        {availablePercent > 0 && (
          <div
            className="progress-segment available-seg"
            style={{ width: `${availablePercent}%` }}
            title={`Available: ${freeDays} days (${surplusDays} days flexible buffer)`}
          />
        )}
        <div
          className={`progress-segment ${isOvercommitted ? 'warning-seg' : 'rest-seg'}`}
          style={{ width: `${restPercent}%` }}
          title={
            isOvercommitted
              ? `Warning: Only ${freeDays} free days remaining (short of ${targetRest}d target by ${shortageDays}d)`
              : `Target Rest: ${targetRest} days (${restPercent}%)`
          }
        />
      </div>
    </div>
  );
};
