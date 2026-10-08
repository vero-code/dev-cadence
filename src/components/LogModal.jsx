import React, { useState, useEffect, useRef } from 'react';
import { COLOR_PALETTE, EMOJI_OPTIONS, STATUS_OPTIONS } from '../constants';
import { addDaysToDateString } from '../utils/calendarUtils';

export const LogModal = ({
  isOpen,
  onClose,
  onSave,
  editingHackathon,
  initialYear,
  initialMonth,
  prefillDates,
  avgTurnaroundDays = 10,
  onPickOnCalendar,
  onDatesChange,
  calendarPickedDate,
}) => {
  const formCardRef = useRef(null);
  const clickStepRef = useRef(0);
  const lastProcessedClickRef = useRef(null);
  const prevBroadcastRef = useRef(null);
  const currentValuesRef = useRef({});
  const [name, setName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState(STATUS_OPTIONS[0] || 'Interested');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [color, setColor] = useState('');
  const [emoji, setEmoji] = useState('');
  const [error, setError] = useState('');
  const [activeDateField, setActiveDateField] = useState(null);

  // Keep a fresh reference to current form values to avoid stale closures and redundant effect triggers
  currentValuesRef.current = { startDate, endDate, deadline, activeDateField };

  useEffect(() => {
    const avgDays = Number(avgTurnaroundDays) || 10;
    clickStepRef.current = 0;
    lastProcessedClickRef.current = null;
    prevBroadcastRef.current = null;
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
      const start = prefillDates.startDate || '';
      // If only single date was selected, automatically extend by avgTurnaroundDays
      const end = prefillDates.endDate && prefillDates.endDate !== prefillDates.startDate
        ? prefillDates.endDate
        : (start ? addDaysToDateString(start, avgDays - 1) : '');
      const dead = prefillDates.deadline && prefillDates.deadline !== prefillDates.startDate
        ? prefillDates.deadline
        : end;

      setStartDate(start);
      setEndDate(end);
      setDeadline(dead);
      setStatus(STATUS_OPTIONS[0]);
      setColor('');
      setEmoji('');
    } else {
      // Default to current year & month, spanning avgTurnaroundDays
      const monthPadded = String(initialMonth + 1).padStart(2, '0');
      const defaultStart = `${initialYear}-${monthPadded}-05`;
      const defaultEnd = addDaysToDateString(defaultStart, avgDays - 1);
      const defaultDeadline = defaultEnd;

      setName('');
      setDeadline(defaultDeadline);
      setStatus(STATUS_OPTIONS[0]);
      setStartDate(defaultStart);
      setEndDate(defaultEnd);
      setColor('');
      setEmoji('');
    }
    setError('');
  }, [editingHackathon, isOpen, initialYear, initialMonth, prefillDates, avgTurnaroundDays]);

  // Handle direct date clicks from calendar while this form is open
  useEffect(() => {
    if (!isOpen || !calendarPickedDate?.date || !calendarPickedDate?.timestamp) return;
    if (lastProcessedClickRef.current === calendarPickedDate.timestamp) return;
    lastProcessedClickRef.current = calendarPickedDate.timestamp;

    const clickedDate = calendarPickedDate.date;
    const avgDays = Number(avgTurnaroundDays) || 10;
    const { startDate: curStart, endDate: curEnd, deadline: curDead, activeDateField: curField } = currentValuesRef.current;

    // 1. If user explicitly focused on Start Date input in the form
    if (curField === 'startDate') {
      setStartDate(clickedDate);
      if (curEnd && clickedDate > curEnd) {
        const newEnd = addDaysToDateString(clickedDate, avgDays - 1);
        setEndDate(newEnd);
        setDeadline(newEnd);
      }
      return;
    }

    // 2. If user explicitly focused on Deadline input in the form
    if (curField === 'deadline') {
      if (curEnd && clickedDate < curEnd) {
        setEndDate(clickedDate);
        if (curStart && clickedDate < curStart) {
          setStartDate(clickedDate);
        }
      }
      setDeadline(clickedDate);
      return;
    }

    // 3. Smart Anchor mode (default or when activeDateField is 'endDate')
    if (!curStart) {
      setStartDate(clickedDate);
      const newEnd = addDaysToDateString(clickedDate, avgDays - 1);
      setEndDate(newEnd);
      setDeadline(newEnd);
      return;
    }

    if (clickedDate >= curStart) {
      // Clicked on or after start date: adjusts the End Date (lengthens or shortens the sprint smoothly)
      setEndDate(clickedDate);
      if (!curDead || curDead === curEnd || curDead < clickedDate) {
        setDeadline(clickedDate);
      }
    } else {
      // Clicked before current start date: shifts the Start Date backward
      setStartDate(clickedDate);
      if (!curEnd || curEnd < clickedDate) {
        const newEnd = addDaysToDateString(clickedDate, avgDays - 1);
        setEndDate(newEnd);
        setDeadline(newEnd);
      }
    }
  }, [calendarPickedDate, isOpen, avgTurnaroundDays]);

  // Broadcast full draft state for real-time visual calendar preview (guarded against duplicate notifications)
  useEffect(() => {
    if (!isOpen || !onDatesChange) return;
    const prev = prevBroadcastRef.current;
    if (
      prev &&
      prev.startDate === startDate &&
      prev.endDate === endDate &&
      prev.deadline === deadline &&
      prev.color === color &&
      prev.emoji === emoji &&
      prev.name === name &&
      prev.status === status &&
      prev.id === editingHackathon?.id
    ) {
      return;
    }
    const currentPayload = {
      startDate,
      endDate,
      deadline,
      color,
      emoji,
      name,
      status,
      id: editingHackathon?.id,
    };
    prevBroadcastRef.current = currentPayload;
    onDatesChange(currentPayload);
  }, [startDate, endDate, deadline, color, emoji, name, status, isOpen, onDatesChange, editingHackathon]);

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
                onFocus={() => setActiveDateField('startDate')}
                onChange={(e) => {
                  const val = e.target.value;
                  setStartDate(val);
                  clickStepRef.current = 0;
                  setError('');
                  if (val && endDate && val > endDate) {
                    const avgDays = Number(avgTurnaroundDays) || 10;
                    const newEnd = addDaysToDateString(val, avgDays - 1);
                    setEndDate(newEnd);
                    if (!deadline || deadline === endDate || deadline < newEnd) {
                      setDeadline(newEnd);
                    }
                  }
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-input"
                value={endDate}
                min={startDate || undefined}
                onFocus={() => setActiveDateField('endDate')}
                onChange={(e) => {
                  const val = e.target.value;
                  setEndDate(val);
                  clickStepRef.current = 0;
                  setError('');
                  if (val && startDate && val < startDate) {
                    setStartDate(val);
                  }
                  if (val && (!deadline || deadline < val)) {
                    setDeadline(val);
                  }
                }}
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
                min={endDate || startDate || undefined}
                onFocus={() => setActiveDateField('deadline')}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  clickStepRef.current = 0;
                  setError('');
                }}
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
              {editingHackathon ? 'Save' : 'Add Hackathon'}
            </button>
          </div>
        </form>
    </div>
  );
};
