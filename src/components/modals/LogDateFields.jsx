import { STATUS_OPTIONS } from "../../constants";
import { addDaysToDateString } from "../../utils/calendarUtils";

export const LogDateFields = ({
  startDate,
  endDate,
  deadline,
  status,
  avgTurnaroundDays,
  onStartDateChange,
  onEndDateChange,
  onDeadlineChange,
  onStatusChange,
  onFocusField,
  onInteraction,
}) => {
  const handleStartChange = (val) => {
    onStartDateChange(val);
    onInteraction();
    if (val && endDate && val > endDate) {
      const avgDays = Number(avgTurnaroundDays) || 10;
      const newEnd = addDaysToDateString(val, avgDays - 1);
      onEndDateChange(newEnd);
      if (!deadline || deadline === endDate || deadline < newEnd) {
        onDeadlineChange(newEnd);
      }
    }
  };

  const handleEndChange = (val) => {
    onEndDateChange(val);
    onInteraction();
    if (val && startDate && val < startDate) {
      onStartDateChange(val);
    }
    if (val && (!deadline || deadline < val)) {
      onDeadlineChange(val);
    }
  };

  return (
    <>
      <div className="form-row-2">
        <div className="form-group">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-input"
            value={startDate}
            onFocus={() => onFocusField("startDate")}
            onChange={(e) => handleStartChange(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">End Date</label>
          <input
            type="date"
            className="form-input"
            value={endDate}
            min={startDate || undefined}
            onFocus={() => onFocusField("endDate")}
            onChange={(e) => handleEndChange(e.target.value)}
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
            onFocus={() => onFocusField("deadline")}
            onChange={(e) => {
              onDeadlineChange(e.target.value);
              onInteraction();
            }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};
