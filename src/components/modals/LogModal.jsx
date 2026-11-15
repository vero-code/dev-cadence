import { useState, useEffect, useRef } from "react";
import {
  getInitialFormState,
  validateAndFormatUrl,
  computeDatesFromCalendarClick,
} from "../../utils/logFormUtils";
import { ColorEmojiPicker } from "./ColorEmojiPicker";
import { LogDateFields } from "./LogDateFields";

export const LogModal = ({
  isOpen,
  onClose,
  onSave,
  editingHackathon,
  initialYear,
  initialMonth,
  prefillDates,
  avgTurnaroundDays = 10,
  onDatesChange,
  calendarPickedDate,
}) => {
  const formCardRef = useRef(null);
  const clickStepRef = useRef(0);
  const lastProcessedClickRef = useRef(null);
  const prevBroadcastRef = useRef(null);
  const currentValuesRef = useRef({});

  const [initial] = useState(() =>
    getInitialFormState({
      editingHackathon,
      prefillDates,
      initialYear,
      initialMonth,
      avgTurnaroundDays,
    }),
  );

  const [name, setName] = useState(initial.name);
  const [url, setUrl] = useState(initial.url);
  const [deadline, setDeadline] = useState(initial.deadline);
  const [status, setStatus] = useState(initial.status);
  const [startDate, setStartDate] = useState(initial.startDate);
  const [endDate, setEndDate] = useState(initial.endDate);
  const [color, setColor] = useState(initial.color);
  const [emoji, setEmoji] = useState(initial.emoji);
  const [error, setError] = useState("");
  const [activeDateField, setActiveDateField] = useState(null);

  // Keep a fresh reference to current form values to avoid stale closures and redundant effect triggers
  useEffect(() => {
    currentValuesRef.current = {
      startDate,
      endDate,
      deadline,
      activeDateField,
    };
  });

  useEffect(() => {
    if (!isOpen || !calendarPickedDate?.date || !calendarPickedDate?.timestamp)
      return;
    if (lastProcessedClickRef.current === calendarPickedDate.timestamp) return;
    lastProcessedClickRef.current = calendarPickedDate.timestamp;

    const patch = computeDatesFromCalendarClick(
      calendarPickedDate.date,
      currentValuesRef.current,
      avgTurnaroundDays,
    );
    if (patch.startDate !== undefined) setStartDate(patch.startDate);
    if (patch.endDate !== undefined) setEndDate(patch.endDate);
    if (patch.deadline !== undefined) setDeadline(patch.deadline);
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
      prev.url === url &&
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
      url,
      status,
      id: editingHackathon?.id,
    };
    prevBroadcastRef.current = currentPayload;
    onDatesChange(currentPayload);
  }, [
    startDate,
    endDate,
    deadline,
    color,
    emoji,
    name,
    url,
    status,
    isOpen,
    onDatesChange,
    editingHackathon,
  ]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (formCardRef.current && !formCardRef.current.contains(e.target)) {
        if (
          e.target.closest(".btn-primary") ||
          e.target.closest(".calendar-day-cell") ||
          e.target.closest(".action-btn")
        ) {
          return;
        }
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("mousedown", handleOutsideClick);
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide a sprint title.");
      return;
    }
    if (!startDate || !endDate) {
      setError("Please provide both work start and end dates.");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError("End date cannot be earlier than start date.");
      return;
    }

    const { url: formattedUrl, error: urlError } = validateAndFormatUrl(url);
    if (urlError) {
      setError(urlError);
      return;
    }

    const payload = {
      id: editingHackathon ? editingHackathon.id : Date.now().toString(),
      name: name.trim(),
      url: formattedUrl,
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
    <div
      className="popup-form-card"
      ref={formCardRef}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-header">
        <h2 className="modal-title">
          <span>{editingHackathon ? "✏️" : "🚀"}</span>
          {editingHackathon ? "Edit Sprint" : "Log Sprint"}
        </h2>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close form"
        >
          &times;
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            type="text"
            className={`form-input ${!name.trim() && error ? "error" : ""}`}
            placeholder="e.g. Firebase AI Logic Sprint"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            autoFocus
          />
        </div>

        <div className="form-group">
          <div className="label-with-hint">
            <label className="form-label">URL</label>
          </div>
          <input
            type="text"
            className={`form-input ${error && (error.toLowerCase().includes("url") || error.toLowerCase().includes("website")) ? "error" : ""}`}
            placeholder="e.g. https://console.firebase.google.com/project/..."
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError("");
            }}
          />
        </div>

        <LogDateFields
          startDate={startDate}
          endDate={endDate}
          deadline={deadline}
          status={status}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onDeadlineChange={setDeadline}
          onStatusChange={setStatus}
          onFocusField={setActiveDateField}
          onInteraction={() => {
            clickStepRef.current = 0;
            setError("");
          }}
        />

        <ColorEmojiPicker
          color={color}
          onChangeColor={setColor}
          emoji={emoji}
          onChangeEmoji={setEmoji}
        />

        {error && <div className="form-error">⚠️ {error}</div>}

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {editingHackathon ? "Save" : "Add Sprint"}
          </button>
        </div>
      </form>
    </div>
  );
};
