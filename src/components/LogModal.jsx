import React, { useState, useEffect } from 'react';
import { COLOR_PALETTE, EMOJI_OPTIONS, STATUS_OPTIONS } from '../constants';

export const LogModal = ({
  isOpen,
  onClose,
  onSave,
  editingHackathon,
  initialYear,
  initialMonth,
  prefillDates,
  onPickOnCalendar,
}) => {
  const [name, setName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('Not registered');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [color, setColor] = useState(COLOR_PALETTE[0]);
  const [emoji, setEmoji] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingHackathon) {
      setName(editingHackathon.name || '');
      setDeadline(editingHackathon.deadline || '');
      setStatus(editingHackathon.status || 'Not registered');
      setStartDate(editingHackathon.startDate || '');
      setEndDate(editingHackathon.endDate || '');
      setColor(editingHackathon.color || COLOR_PALETTE[0]);
      setEmoji(editingHackathon.emoji || '');
    } else if (prefillDates) {
      setName('');
      setDeadline(prefillDates.deadline || prefillDates.endDate || '');
      setStatus('Not registered');
      setStartDate(prefillDates.startDate || '');
      setEndDate(prefillDates.endDate || '');
      setColor(COLOR_PALETTE[0]);
      setEmoji('');
    } else {
      // Default to current year & month for new entries
      const monthPadded = String(initialMonth + 1).padStart(2, '0');
      const defaultStart = `${initialYear}-${monthPadded}-05`;
      const defaultEnd = `${initialYear}-${monthPadded}-15`;
      const defaultDeadline = `${initialYear}-${monthPadded}-16`;

      setName('');
      setDeadline(defaultDeadline);
      setStatus('Not registered');
      setStartDate(defaultStart);
      setEndDate(defaultEnd);
      setColor(COLOR_PALETTE[0]);
      setEmoji('');
    }
    setError('');
  }, [editingHackathon, isOpen, initialYear, initialMonth, prefillDates]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a hackathon name.');
      return;
    }
    if (!deadline) {
      setError('Please provide a submission deadline.');
      return;
    }
    if (!startDate || !endDate) {
      setError('Please provide both work start and end dates.');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be earlier than start date.');
      return;
    }

    const payload = {
      id: editingHackathon ? editingHackathon.id : Date.now().toString(),
      name: name.trim(),
      deadline,
      status,
      startDate,
      endDate,
      color,
      emoji,
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <span>{editingHackathon ? '✏️' : '🚀'}</span>
            {editingHackathon ? 'Edit Hackathon' : 'Log Hackathon'}
          </h2>
          <button type="button" className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Hackathon Name</label>
            <input
              type="text"
              className={`form-input ${!name.trim() && error ? 'error' : ''}`}
              placeholder="e.g. AI Basics Hackathon"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              autoFocus
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Submission Deadline</label>
              <input
                type="date"
                className="form-input"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Application Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="date-header-group">
            <label className="form-label">Work Schedule</label>
            {onPickOnCalendar && !editingHackathon && (
              <button
                type="button"
                className="btn-pick-calendar"
                onClick={onPickOnCalendar}
                title="Select start and end dates directly on the calendar"
              >
                📅 Pick on Calendar
              </button>
            )}
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label-sub">Start Date</label>
              <input
                type="date"
                className="form-input"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setError(''); }}
              />
            </div>

            <div className="form-group">
              <label className="form-label-sub">End Date</label>
              <input
                type="date"
                className="form-input"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setError(''); }}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="label-with-hint">
              <label className="form-label">Theme Color</label>
              <span className="field-hint">optional</span>
            </div>
            <div className="color-picker-row">
              {COLOR_PALETTE.map((c) => (
                <div
                  key={c}
                  className={`color-option ${color === c ? 'selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(color === c ? '' : c)}
                  title={color === c ? 'Click to deselect' : 'Select color'}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <div className="label-with-hint">
              <label className="form-label">Badge Emoji</label>
              <span className="field-hint">optional</span>
            </div>
            <div className="emoji-picker-row">
              {EMOJI_OPTIONS.map((emo) => (
                <button
                  key={emo}
                  type="button"
                  className={`emoji-option ${emoji === emo ? 'selected' : ''}`}
                  onClick={() => setEmoji(emoji === emo ? '' : emo)}
                  title={emoji === emo ? 'Click to deselect' : emo}
                >
                  {emo}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="form-error">⚠️ {error}</div>}

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingHackathon ? 'Save Changes' : 'Add Hackathon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
