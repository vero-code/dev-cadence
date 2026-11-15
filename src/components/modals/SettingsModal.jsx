import { useState } from "react";
import { AgedGearIcon } from "../Icons";
import { GeneralSettingsTab } from "./GeneralSettingsTab";
import { AiSettingsTab } from "./AiSettingsTab";
import { ModalFooter } from "./ModalFooter";

export const SettingsModal = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  currentTheme,
  onSelectTheme,
  onClearAllHackathons,
  onResetAllData,
}) => {
  const [activeTab, setActiveTab] = useState("general");

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <AgedGearIcon className="modal-title-gear" size={16} />
            <span>Settings</span>
          </h2>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Settings Tabs */}
        <div className="legal-tabs-bar">
          <button
            type="button"
            className={`legal-tab-btn ${activeTab === "general" ? "active" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            General
          </button>
          <button
            type="button"
            className={`legal-tab-btn ${activeTab === "ai" ? "active" : ""}`}
            onClick={() => setActiveTab("ai")}
          >
            AI
          </button>
        </div>

        <div className="modal-body-content">
          {activeTab === "general" ? (
            <GeneralSettingsTab
              settings={settings}
              onUpdateSettings={onUpdateSettings}
              currentTheme={currentTheme}
              onSelectTheme={onSelectTheme}
              onClearAllHackathons={onClearAllHackathons}
              onResetAllData={onResetAllData}
            />
          ) : (
            <AiSettingsTab />
          )}

          <ModalFooter
            showAutoSaved={activeTab === "general"}
            leftContent={
              <span className="modal-footer-hint">
                To disable or remove the model, turn off &ldquo;On-device
                AI&rdquo; in Chrome Settings.
              </span>
            }
          />
        </div>
      </div>
    </div>
  );
};
