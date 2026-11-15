import { useState, useEffect, useRef } from "react";
import {
  getInitialFormState,
  computeDatesFromCalendarClick,
  validateAndBuildLogPayload,
  isSameDraftPayload,
} from "../../utils/logFormUtils";
import { ColorEmojiPicker } from "./ColorEmojiPicker";
import { LogDateFields } from "./LogDateFields";
import { EditPenIcon, LogSprintIcon } from "../FormIcons";

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
  const [errors, setErrors] = useState({});
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

  useEffect(() => {
    if (!isOpen || !onDatesChange) return;
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
    if (isSameDraftPayload(prevBroadcastRef.current, currentPayload)) {
      return;
    }
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
    const { errors: nextErrors, payload } = validateAndBuildLogPayload({
      editingHackathon,
      name,
      url,
      deadline,
      status,
      startDate,
      endDate,
      color,
      emoji,
    });

    if (nextErrors) {
      setErrors(nextErrors);
      return;
    }

    onSave(payload);
    onClose();
  };

  return (
    <div
      className="table-card popup-form-card"
      ref={formCardRef}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-header">
        <h2 className="modal-title">
          {editingHackathon ? <EditPenIcon size={16} /> : <LogSprintIcon size={16} />}
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
            className={`form-input ${errors.name ? "error" : ""}`}
            placeholder="e.g. Firebase AI Logic Sprint"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: "" }));
            }}
            autoFocus
          />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>

        <div className="form-group">
          <div className="label-with-hint">
            <label className="form-label">URL</label>
          </div>
          <input
            type="text"
            className={`form-input ${errors.url ? "error" : ""}`}
            placeholder="e.g. https://console.firebase.google.com/project/..."
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setErrors((prev) => ({ ...prev, url: "" }));
            }}
          />
          {errors.url && <div className="form-error">⚠️ {errors.url}</div>}
        </div>

        <LogDateFields
          startDate={startDate}
          endDate={endDate}
          deadline={deadline}
          status={status}
          errors={errors}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onDeadlineChange={setDeadline}
          onStatusChange={setStatus}
          onFocusField={setActiveDateField}
          onInteraction={() => {
            clickStepRef.current = 0;
            setErrors((prev) => ({ ...prev, startDate: "", endDate: "" }));
          }}
        />

        <ColorEmojiPicker
          color={color}
          onChangeColor={setColor}
          emoji={emoji}
          onChangeEmoji={setEmoji}
        />

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
