import { STATUS_OPTIONS } from "../../constants";

export const LogDateFields = ({
  startDate,
  endDate,
  deadline,
  status,
  onStartDateChange,
  onEndDateChange,
  onDeadlineChange,
  onStatusChange,
  onFocusField,
  onInteraction,
}) => {
  const handleDateChange = (setter) => (e) => {
    setter(e.target.value);
    onInteraction();
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
            onChange={handleDateChange(onStartDateChange)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">End Date</label>
          <input
            type="date"
            className="form-input"
            value={endDate}
            onFocus={() => onFocusField("endDate")}
            onChange={handleDateChange(onEndDateChange)}
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
            onFocus={() => onFocusField("deadline")}
            onChange={handleDateChange(onDeadlineChange)}
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