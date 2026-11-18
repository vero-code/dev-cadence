import React, { useState, useRef, useEffect } from 'react';
import { getDaysInMonth } from '../utils/calendarUtils';
import { adviseScheduleWithAi } from '../utils/hybridAi';
import { SparkleIcon } from './FormIcons';
import { ChevronDownIcon } from './Icons';
import { AiSourceBadge } from './AiSourceBadge';

export const CapacityBar = ({ year, month, hackathons, settings, onOpenSettings }) => {
  const daysInMonth = getDaysInMonth(year, month);
  const targetRest = settings?.targetRestDays ?? 8;

  const monthPadded = String(month + 1).padStart(2, '0');

  let committedDaysCount = 0;
  let overlapDaysCount = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const dayPadded = String(d).padStart(2, '0');
    const dateString = `${year}-${monthPadded}-${dayPadded}`;
    const targetDate = new Date(dateString);

    const activeCount = hackathons.filter((h) => {
      if (!h.startDate || !h.endDate) return false;
      const start = new Date(h.startDate);
      const end = new Date(h.endDate);
      return targetDate >= start && targetDate <= end;
    }).length;

    if (activeCount > 0) committedDaysCount++;
    if (activeCount > 1) overlapDaysCount++;
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

  const [advice, setAdvice] = useState(null);
  const [isAdviceOpen, setIsAdviceOpen] = useState(true);
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const showAdvisorTrigger = isOvercommitted || overlapDaysCount > 0;

  const handleGetAdvice = async () => {
    if (loading) {
      abortRef.current?.abort();
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError('');

    try {
      const res = await adviseScheduleWithAi(
        {
          sprints: hackathons,
          year,
          month,
          targetRest,
          freeDays,
          overlapDaysCount,
        },
        { signal: controller.signal },
      );
      setAdvice(res.text);
      setSource(res.inferenceSource);
      setIsAdviceOpen(true);
    } catch (err) {
      if (err?.name === 'AbortError' || controller.signal.aborted) return;
      setError(err?.message || 'Failed to generate schedule advice.');
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  return (
    <div className="capacity-card">
      <div className="capacity-metrics-grid">
        <div className="capacity-metric-box">
          <span className="metric-label">Build</span>
          <span className="metric-value committed-val">
            {committedDaysCount}d
          </span>
        </div>
        <div className="capacity-metric-box">
          <span className="metric-label">Free</span>
          <span className="metric-value free-val">
            {surplusDays}d
          </span>
        </div>
        <div
          className="capacity-metric-box"
          style={onOpenSettings ? { cursor: 'pointer' } : undefined}
          onClick={onOpenSettings}
          title={onOpenSettings ? `Target Rest: ${targetRest}d (click to configure)` : undefined}
        >
          <span className="metric-label">Rest</span>
          <span className="metric-value rest-val">
            {restDays}/{targetRest}d
          </span>
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
          className="progress-segment rest-seg"
          style={{ width: `${restPercent}%` }}
          title={
            isOvercommitted
              ? `Warning: Only ${freeDays} free days remaining (short of ${targetRest}d target by ${shortageDays}d)`
              : `Target Rest: ${targetRest} days (${restPercent}%)`
          }
        />
      </div>

      {showAdvisorTrigger && (
        <div className="capacity-advisor-wrap">
          <div className="capacity-advisor-bar">
            <span className="capacity-advisor-hint">
              {overlapDaysCount > 0
                ? `${overlapDaysCount}d overlap`
                : `${shortageDays}d rest deficit`}
            </span>
            {advice && (
              <div className="capacity-source-group">
                <AiSourceBadge source={source} />
                <button
                  type="button"
                  className="capacity-collapse-btn"
                  onClick={() => setIsAdviceOpen((prev) => !prev)}
                  title={isAdviceOpen ? 'Collapse advice' : 'Expand advice'}
                  aria-expanded={isAdviceOpen}
                >
                  <ChevronDownIcon
                    size={14}
                    className={isAdviceOpen ? 'chevron-rotated' : ''}
                  />
                </button>
              </div>
            )}
            <button
              type="button"
              className="btn-secondary ai-extract-btn"
              onClick={handleGetAdvice}
              title={loading ? 'Click to stop AI analysis' : 'Analyze schedule with Hybrid AI'}
            >
              <SparkleIcon size={12} />
              {loading ? (
                <>
                  Analyzing<span className="ai-loading-dots" aria-hidden="true" />
                </>
              ) : (
                'AI Pace Advisor'
              )}
            </button>
          </div>

          {error && <div className="form-error">{error}</div>}

          {advice && isAdviceOpen && (
            <div className="capacity-advice-box">
              <div className="capacity-advice-text">{advice}</div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => {
                  setAdvice(null);
                  setSource(null);
                }}
                aria-label="Close advice"
              >
                &times;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
