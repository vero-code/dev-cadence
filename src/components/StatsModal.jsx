import React, { useEffect, useState } from 'react';
import { calculateCadenceStats } from '../utils/statsUtils';
import { AnalyticsIcon, CloseIcon } from './Icons';

export const StatsModal = ({
  isOpen,
  onClose,
  hackathons,
  settings,
  onUpdateSettings,
}) => {
  const [syncMessage, setSyncMessage] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const stats = calculateCadenceStats(hackathons);

  const handleApplyAverageToDefault = () => {
    const roundedAvg = Math.max(1, Math.min(60, Math.round(stats.overallAvgDaysPerHackathon)));
    if (onUpdateSettings && roundedAvg > 0) {
      onUpdateSettings({ avgTurnaroundDays: roundedAvg });
      setSyncMessage(`Applied ${roundedAvg} days to your default hackathon turnaround setting!`);
      setTimeout(() => setSyncMessage(null), 3500);
    }
  };

  const hasPastData = stats.totalPastHackathonsCount > 0;

  return (
    <div className="table-card stats-panel-card">
      {/* Header matching Tracker header row */}
      <div className="pipeline-header-row stats-panel-header">
        <div className="tracker-heading-group">
          <h2 className="section-heading">
            <AnalyticsIcon size={16} className="stats-header-icon" />
            <span>Analytics</span>
          </h2>
        </div>
        <div className="stats-header-actions">
          <button
            type="button"
            className="stats-close-btn"
            onClick={onClose}
            title="Close Analytics and return to Tracker (Esc)"
            aria-label="Close Analytics"
          >
            <CloseIcon size={11} strokeWidth={2.4} />
          </button>
        </div>
      </div>

      {/* Panel Scrollable Content */}
      <div className="stats-panel-content">
        {syncMessage && (
          <div className="stats-sync-banner">
            <span>✓ {syncMessage}</span>
          </div>
        )}

        {/* Primary Metric KPI Cards */}
        <div className="stats-kpi-grid">
          {/* Card 1: Shortest Hackathon (Minimum Days Spent All-Time) */}
          <div className="stats-kpi-card shortest-card">
            <div className="stats-kpi-top">
              <div className="stats-kpi-badge stats-kpi-value-badge">
                <span className="stats-kpi-number">
                  {stats.minDaysSpent > 0 ? stats.minDaysSpent : '—'}
                </span>
                {stats.minDaysSpent > 0 && <span className="stats-kpi-unit">days</span>}
              </div>
              <span className="stats-kpi-label">Shortest Event</span>
            </div>
            <div className="stats-kpi-footer-row" title={stats.shortestHackathon?.name || ''}>
              <span className="stats-kpi-event-name">
                {stats.shortestHackathon
                  ? `${stats.shortestHackathon.emoji ? stats.shortestHackathon.emoji + ' ' : ''}${stats.shortestHackathon.name || 'Fastest event'}`
                  : 'No past dates logged yet'}
              </span>
            </div>
          </div>

          {/* Card 2: Longest Hackathon (Maximum Days Spent All-Time) */}
          <div className="stats-kpi-card longest-card">
            <div className="stats-kpi-top">
              <div className="stats-kpi-badge stats-kpi-value-badge">
                <span className="stats-kpi-number">
                  {stats.maxDaysSpent > 0 ? stats.maxDaysSpent : '—'}
                </span>
                {stats.maxDaysSpent > 0 && <span className="stats-kpi-unit">days</span>}
              </div>
              <span className="stats-kpi-label">Longest Event</span>
            </div>
            <div className="stats-kpi-footer-row" title={stats.longestHackathon?.name || ''}>
              <span className="stats-kpi-event-name">
                {stats.longestHackathon
                  ? `${stats.longestHackathon.emoji ? stats.longestHackathon.emoji + ' ' : ''}${stats.longestHackathon.name || 'Longest event'}`
                  : 'No past dates logged yet'}
              </span>
            </div>
          </div>
        </div>

        {/* Monthly Cadence Breakdown */}
        <div className="stats-section-header">
          <h3 className="stats-section-title">Monthly Breakdown</h3>
          <span className="stats-section-badge">
            Total: {stats.monthlyBreakdown.length} {stats.monthlyBreakdown.length === 1 ? 'month' : 'months'}
          </span>
        </div>

        {stats.monthlyBreakdown.length === 0 ? (
          <div className="stats-empty-state">
            <span className="stats-empty-icon">📅</span>
            <div className="stats-empty-title">No past work dates recorded yet</div>
            <div className="stats-empty-desc">
              Log your hackathons on the calendar. Once dates pass, your monthly averages and workload percentages will automatically appear here.
            </div>
          </div>
        ) : (
          <div className="stats-table-wrapper">
            <table className="stats-table">
              <thead>
                <tr>
                  <th className="stats-th-month">Month</th>
                  <th className="stats-th-done">Done</th>
                  <th className="stats-th-total">Total</th>
                  <th className="stats-th-days">Devposter's Days</th>
                  <th className="stats-th-avg">Avg / Event</th>
                </tr>
              </thead>
              <tbody>
                {stats.monthlyBreakdown.map((m) => (
                  <tr key={m.monthKey} className={m.isCurrentMonth ? 'row-current-month' : ''}>
                    <td className="stats-td-month">
                      <span className="month-name-text">{m.displayName}</span>
                    </td>
                    <td className="stats-td-done">
                      <span className="stats-pill-num stats-pill-completed">{m.completedCount}</span>
                    </td>
                    <td className="stats-td-total">
                      <span className="stats-pill-num">{m.totalCount}</span>
                    </td>
                    <td className="stats-td-days">
                      <strong>{m.uniqueWorkDays}</strong>
                      {/* <span className="stats-sub-dim">/{m.elapsedDaysInMonth}d</span> */}
                    </td>
                    <td className="stats-td-avg">
                      <span className="stats-avg-badge">
                        {m.avgDaysPerHackathon > 0 ? `${m.avgDaysPerHackathon}d` : '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Panel Footer */}
      <div className="stats-panel-footer">
        <div className="stats-footer-hint-group">
          <span className="stats-footer-hint">
            Avg. work days in settings: <strong>{settings?.avgTurnaroundDays || 10} days</strong>
          </span>
          {hasPastData && stats.overallAvgDaysPerHackathon > 0 && Math.round(stats.overallAvgDaysPerHackathon) !== (settings?.avgTurnaroundDays || 10) && (
            <button
              type="button"
              className="stats-footer-sync-btn"
              onClick={handleApplyAverageToDefault}
              title={`Sync settings default to empirical all-time average (${Math.round(stats.overallAvgDaysPerHackathon)} days)`}
            >
              Sync to avg ({Math.round(stats.overallAvgDaysPerHackathon)}d)
            </button>
          )}
        </div>
        <button
          type="button"
          className="btn-secondary stats-return-btn"
          onClick={onClose}
          title="Return to Tracker table"
        >
          Return to Tracker
        </button>
      </div>
    </div>
  );
};
