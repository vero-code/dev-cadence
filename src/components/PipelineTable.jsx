import React from 'react';

const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDisplayDate = (isoDate) => {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length === 3) {
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const monthStr = MONTH_ABBR[m] || parts[1];
    return `${monthStr} ${d}`;
  }
  return isoDate;
};

const formatWorkRange = (startIso, endIso) => {
  if (!startIso || !endIso) return '';
  const startParts = startIso.split('-');
  const endParts = endIso.split('-');
  if (startParts.length === 3 && endParts.length === 3) {
    const sMonth = parseInt(startParts[1], 10) - 1;
    const eMonth = parseInt(endParts[1], 10) - 1;
    const sDay = parseInt(startParts[2], 10);
    const eDay = parseInt(endParts[2], 10);

    if (sMonth === eMonth) {
      return `${MONTH_ABBR[sMonth] || startParts[1]} ${sDay} – ${eDay}`;
    }
    return `${MONTH_ABBR[sMonth]} ${sDay} – ${MONTH_ABBR[eMonth]} ${eDay}`;
  }
  return `${startIso} – ${endIso}`;
};

const getStatusChipClass = (status) => {
  const s = (status || '').toLowerCase();
  if (s.includes('registered') || s.includes('submitted')) return 'chip-registered';
  if (s.includes('early')) return 'chip-early';
  if (s.includes('wait') || s.includes('api')) return 'chip-waiting';
  if (s.includes('consider')) return 'chip-considering';
  return 'chip-custom';
};

export const PipelineTable = ({ hackathons, onEdit, onDelete, onAddNew }) => {
  if (!hackathons || hackathons.length === 0) {
    return (
      <div className="table-card">
        <div className="empty-table-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">No hackathons logged yet</div>
          <div className="empty-desc">
            Click "+ Log Hackathon" above to start pacing your work dates and deadlines.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="table-card pipeline-list-container">
      <div className="pipeline-list">
        {hackathons.map((h) => (
          <div key={h.id} className="pipeline-item">
            <div
              className="pipeline-item-color-bar"
              style={{
                backgroundColor: h.color || 'var(--amber-gear)',
                boxShadow: `0 0 8px ${h.color || 'var(--amber-gear)'}`,
              }}
            />
            <div className="pipeline-item-content">
              <div className="pipeline-item-header">
                <div className="pipeline-item-title-wrap">
                  {h.emoji && <span className="pipeline-item-emoji">{h.emoji}</span>}
                  <span className="pipeline-item-name" title={h.name}>
                    {h.name}
                  </span>
                </div>
                <div className="pipeline-item-actions">
                  <button
                    type="button"
                    className="action-icon-btn"
                    title="Edit Hackathon"
                    onClick={() => onEdit(h)}
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    className="action-icon-btn delete-btn"
                    title="Delete Hackathon"
                    onClick={() => onDelete(h)}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="pipeline-item-meta">
                <span className={`status-chip ${getStatusChipClass(h.status)}`}>
                  {h.status}
                </span>
                <span className="pipeline-meta-pill" title="Work Dates">
                  <span className="meta-icon">🗓️</span>
                  <span>{formatWorkRange(h.startDate, h.endDate)}</span>
                </span>
                {h.deadline && (
                  <span className="pipeline-meta-pill deadline-pill" title="Submission Deadline">
                    <span className="meta-icon">🏁</span>
                    <span>Due {formatDisplayDate(h.deadline)}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PipelineList = PipelineTable;
