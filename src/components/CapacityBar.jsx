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

  // Percentage calculations for capacity progress bar
  const committedPercent = Math.min(100, Math.round((committedDaysCount / daysInMonth) * 100));
  const restPercent = Math.min(100 - committedPercent, Math.round((targetRest / daysInMonth) * 100));

  return (
    <div className="capacity-card">
      <div className="capacity-header-row">
        <div className="capacity-title-wrap">
          <span className="capacity-gear-icon">⚙️</span>
          <span className="capacity-title">Workload & Rest Guardrail</span>
        </div>
        <button
          type="button"
          className="capacity-edit-btn"
          onClick={onOpenSettings}
          title="Adjust Target Rest Days"
        >
          Target: {targetRest} days off ✏️
        </button>
      </div>

      <div className="capacity-metrics-grid">
        <div className="capacity-metric-box">
          <span className="metric-label">Committed Work</span>
          <span className="metric-value committed-val">{committedDaysCount} days</span>
        </div>
        <div className="capacity-metric-box">
          <span className="metric-label">Available Free Days</span>
          <span className={`metric-value ${isOvercommitted ? 'warning-val' : 'free-val'}`}>
            {freeDays} days
          </span>
        </div>
        <div className="capacity-metric-box">
          <span className="metric-label">Target Rest</span>
          <span className="metric-value rest-val">{targetRest} days</span>
        </div>
      </div>

      {/* Visual Capacity Bar */}
      <div className="capacity-progress-track" title={`${committedDaysCount} committed, ${targetRest} target rest, ${freeDays} free`}>
        <div
          className="progress-segment committed-seg"
          style={{ width: `${committedPercent}%` }}
        />
        <div
          className={`progress-segment ${isOvercommitted ? 'warning-seg' : 'rest-seg'}`}
          style={{ width: `${restPercent}%` }}
        />
      </div>

      {/* Dynamic Status / Overload Warning */}
      {isOvercommitted ? (
        <div className="capacity-warning-banner">
          <span className="warning-icon">⚠️</span>
          <div className="warning-text">
            <strong>Rest Buffer Exceeded:</strong> Only {freeDays} free days remaining—short of your {targetRest}-day rest goal by <strong>{shortageDays} {shortageDays === 1 ? 'day' : 'days'}</strong>! Consider pacing your work windows.
          </div>
        </div>
      ) : (
        <div className="capacity-healthy-banner">
          <span className="healthy-icon">✓</span>
          <div className="healthy-text">
            <strong>Healthy Cadence:</strong> You have {freeDays - targetRest} buffer days above your {targetRest}-day rest target.
          </div>
        </div>
      )}
    </div>
  );
};
