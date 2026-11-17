import { useState } from "react";
import { THEMES, FONT_PRESETS, FONT_SIZES, CAPACITY_LIMITS } from "../../constants";
import { ChevronDownIcon } from "../Icons";
import { InfoIcon } from "../FormIcons";
import { DataManagementSection } from "./DataManagementSection";

export const GeneralSettingsTab = ({
  settings,
  onUpdateSettings,
  currentTheme,
  onSelectTheme,
  onClearAllHackathons,
  onResetAllData,
  onImportData,
}) => {
  const [targetRestDays, setTargetRestDays] = useState(
    settings?.targetRestDays ?? 8,
  );
  const [avgTurnaroundDays, setAvgTurnaroundDays] = useState(
    settings?.avgTurnaroundDays ?? 10,
  );

  const handleNumberChange = (setter, key, { min, max }) => (e) => {
    const val = e.target.value;
    setter(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= min && parsed <= max) {
      onUpdateSettings?.({ [key]: parsed });
    }
  };

  const handleNumberBlur = (value, setter, key, { min, max, fallback }) => () => {
    const parsed = Math.max(min, Math.min(max, parseInt(value, 10) || fallback));
    setter(parsed);
    onUpdateSettings?.({ [key]: parsed });
  };

  return (
    <>
      <div className="settings-columns-row">
        {/* Theme */}
        <div className="settings-column">
          <label className="form-label" htmlFor="settings-theme-select">
            Theme
          </label>
          <div className="select-wrapper">
            <select
              id="settings-theme-select"
              className="form-select"
              value={currentTheme}
              onChange={(e) => onSelectTheme?.(e.target.value)}
            >
              {THEMES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="select-chevron" size={14} />
          </div>
        </div>

        {/* Typography */}
        <div className="settings-column">
          <label className="form-label" htmlFor="settings-font-select">
            Typography
          </label>
          <div className="select-wrapper">
            <select
              id="settings-font-select"
              className="form-select"
              value={settings?.fontPreset || "bahnschrift"}
              onChange={(e) =>
                onUpdateSettings?.({ fontPreset: e.target.value })
              }
            >
              {FONT_PRESETS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="select-chevron" size={14} />
          </div>
        </div>

        {/* Scale */}
        <div className="form-group">
          <label className="form-label" htmlFor="settings-scale-select">
            Scale
          </label>
          <div className="select-wrapper">
            <select
              id="settings-scale-select"
              className="form-select"
              value={settings?.fontSize || "normal"}
              onChange={(e) => onUpdateSettings?.({ fontSize: e.target.value })}
            >
              {FONT_SIZES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="select-chevron" size={14} />
          </div>
        </div>
      </div>

      {/* Capacity Goals & Hover Highlight */}
      <div className="settings-columns-row">
        <div className="form-group">
          <div className="settings-label-row">
            <label className="form-label">Build Days</label>
            <span
              className="settings-info-icon"
              title="Default sprint duration when clicking a start date in Schedule"
            >
              <InfoIcon />
            </span>
          </div>
          <input
            type="number"
            min={CAPACITY_LIMITS.sprint.min}
            max={CAPACITY_LIMITS.sprint.max}
            className="form-input"
            value={avgTurnaroundDays}
            onChange={handleNumberChange(setAvgTurnaroundDays, 'avgTurnaroundDays', CAPACITY_LIMITS.sprint)}
            onBlur={handleNumberBlur(avgTurnaroundDays, setAvgTurnaroundDays, 'avgTurnaroundDays', CAPACITY_LIMITS.sprint)}
          />
        </div>

        <div className="form-group">
          <div className="settings-label-row">
            <label className="form-label">Rest Days</label>
            <span
              className="settings-info-icon"
              title="Target rest days per month used in the Capacity bar"
            >
              <InfoIcon />
            </span>
          </div>
          <input
            type="number"
            min={CAPACITY_LIMITS.rest.min}
            max={CAPACITY_LIMITS.rest.max}
            className="form-input"
            value={targetRestDays}
            onChange={handleNumberChange(setTargetRestDays, 'targetRestDays', CAPACITY_LIMITS.rest)}
            onBlur={handleNumberBlur(targetRestDays, setTargetRestDays, 'targetRestDays', CAPACITY_LIMITS.rest)}
          />
        </div>

        <div className="form-group">
          <div className="settings-label-row">
            <label className="form-label">
              Hover
            </label>
            <span
              className="settings-info-icon"
              title="Highlight dates in the calendar when hovering over sprints in Tracker"
            >
              <InfoIcon />
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', height: '38px' }}>
            <button
              id="toggle-highlight-hover"
              type="button"
              role="switch"
              aria-checked={settings?.highlightOnHover !== false}
              className={`settings-switch-btn ${settings?.highlightOnHover !== false ? "active" : ""}`}
              onClick={() => {
                const currentVal = settings?.highlightOnHover !== false;
                onUpdateSettings?.({ highlightOnHover: !currentVal });
              }}
            >
              <span className="settings-switch-thumb" />
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <DataManagementSection
        onClearAllHackathons={onClearAllHackathons}
        onResetAllData={onResetAllData}
        onImportData={onImportData}
      />
    </>
  );
};
