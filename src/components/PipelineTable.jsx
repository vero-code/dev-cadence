import React from 'react';

const formatDisplayDate = (isoDate) => {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length === 3) {
    return `${parts[1]}/${parts[2]}`;
  }
  return isoDate;
};

const formatWorkRange = (startIso, endIso) => {
  if (!startIso || !endIso) return '';
  const startParts = startIso.split('-');
  const endParts = endIso.split('-');
  if (startParts.length === 3 && endParts.length === 3) {
    return `${startParts[2]} – ${endParts[2]}`;
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
    <div className="table-card">
      <table className="pipeline-table">
        <thead>
          <tr>
            <th>Hackathon</th>
            <th>Deadline</th>
            <th>Status</th>
            <th>Work Dates</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hackathons.map((h) => (
            <tr key={h.id}>
              <td>
                <div className="table-event-name">
                  <span className="color-dot" style={{ backgroundColor: h.color || '#06b6d4' }} />
                  <span>{h.emoji ? `${h.emoji} ` : ''}{h.name}</span>
                </div>
              </td>
              <td className="table-date">
                by {formatDisplayDate(h.deadline)}
              </td>
              <td>
                <span className={`status-chip ${getStatusChipClass(h.status)}`}>
                  {h.status}
                </span>
              </td>
              <td className="table-date">
                {formatWorkRange(h.startDate, h.endDate)}
              </td>
              <td style={{ textAlign: 'right' }}>
                <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
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
                    onClick={() => onDelete(h.id)}
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
