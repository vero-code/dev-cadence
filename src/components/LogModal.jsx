import React, { useState, useEffect, useRef } from 'react';
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
  const formCardRef = useRef(null);
  const [name, setName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState(STATUS_OPTIONS[0] || 'Interested');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [color, setColor] = useState('');
  const [emoji, setEmoji] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingHackathon) {
      setName(editingHackathon.name || '');
      setDeadline(editingHackathon.deadline || '');
      setStatus(editingHackathon.status || STATUS_OPTIONS[0]);
      setStartDate(editingHackathon.startDate || '');
      setEndDate(editingHackathon.endDate || '');
      setColor(editingHackathon.color || '');
      setEmoji(editingHackathon.emoji || '');
    } else if (prefillDates) {
      setName('');
      setDeadline(prefillDates.deadline || prefillDates.endDate || '');
      setStatus(STATUS_OPTIONS[0]);
      setStartDate(prefillDates.startDate || '');
      setEndDate(prefillDates.endDate || '');
      setColor('');
      setEmoji('');
    } else {
      // Default to current year & month for new entries
      const monthPadded = String(initialMonth + 1).padStart(2, '0');
      const defaultStart = `${initialYear}-${monthPadded}-05`;
      const defaultEnd = `${initialYear}-${monthPadded}-15`;
      const defaultDeadline = `${initialYear}-${monthPadded}-16`;

      setName('');
      setDeadline(defaultDeadline);
      setStatus(STATUS_OPTIONS[0]);
      setStartDate(defaultStart);
      setEndDate(defaultEnd);
      setColor('');
      setEmoji('');
    }
    setError('');
  }, [editingHackathon, isOpen, initialYear, initialMonth, prefillDates]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (formCardRef.current && !formCardRef.current.contains(e.target)) {
        if (e.target.closest('.btn-primary') || e.target.closest('.calendar-day-cell') || e.target.closest('.action-btn')) {
          return;
        }
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('mousedown', handleOutsideClick);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

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
    <div className="popup-form-card" ref={formCardRef} onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h2 className="modal-title">
          <span>{editingHackathon ? '✏️' : '🚀'}</span>
          {editingHackathon ? 'Edit Hackathon' : 'Log Hackathon'}
        </h2>
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close form">&times;</button>
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
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-input"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setError(''); }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-input"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setError(''); }}
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Deadline</label>
              <input
                type="date"
                className="form-input"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
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

          

          <div className="form-group">
            <div className="label-with-hint">
              <label className="form-label">Color</label>
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
              <label className="form-label">Emoji</label>
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
  );
};
