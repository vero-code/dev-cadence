import { useState, useEffect } from "react";
import { CHROME_AI_SETUP_URLS, AI_STATUS_INFO } from "../../constants";
import { ExternalLinkIcon, CopyIcon, CheckIcon } from "../Icons";
import {
  subscribeNanoModel,
  checkNanoStatus,
  downloadNanoModel,
  cancelNanoDownload,
} from "../../utils/nanoModel";

export const AiSettingsTab = () => {
  const [modelState, setModelState] = useState({
    status: "checking",
    progress: null,
    error: "",
  });
  const [setupError, setSetupError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const statusInfo =
    AI_STATUS_INFO[modelState.status] || AI_STATUS_INFO.unavailable;

  const handleOpenUrl = (id, url) => {
    setSetupError(null);
    if (typeof chrome !== "undefined" && chrome.tabs?.create) {
      chrome.tabs.create({ url });
      return;
    }
    setSetupError({
      id,
      message:
        "Browser blocks chrome:// links in web preview. Use Copy instead.",
    });
  };

  const handleCopyUrl = async (id, url) => {
    setSetupError(null);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setSetupError({ id, message: "Failed to copy URL." });
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeNanoModel(setModelState);
    checkNanoStatus();
    window.addEventListener("focus", checkNanoStatus);
    return () => {
      unsubscribe();
      window.removeEventListener("focus", checkNanoStatus);
    };
  }, []);

  return (
    <div className="ai-settings-tab">
      {/* Top Status Banner */}
      <div
        className="form-group settings-toggle-group ai-status-banner"
        style={{ "--status-color": statusInfo.color }}
      >
        <div className="ai-status-header">
          <span className="ai-status-dot">●</span>
          <span className="form-label ai-status-label">
            Model status: {statusInfo.label}
          </span>
        </div>
        <p className="settings-toggle-desc ai-no-margin">{statusInfo.hint}</p>
      </div>

      {/* Step 1: Chrome Setup */}
      <div className="form-group settings-toggle-group">
        <label className="form-label">
          Step 1. Enable "On-device AI" in Chrome
        </label>
        <div className="ai-setup-list">
          {CHROME_AI_SETUP_URLS.map((item) => (
            <div key={item.id}>
              <div className="ai-url-row">
                <input
                  type="text"
                  readOnly
                  className="form-input ai-url-input"
                  value={item.url}
                />
                <button
                  type="button"
                  className="btn-secondary btn-icon-square"
                  onClick={() => handleOpenUrl(item.id, item.url)}
                  title="Open in new tab"
                  aria-label="Open in new tab"
                >
                  <ExternalLinkIcon size={14} />
                </button>
                <button
                  type="button"
                  className="btn-secondary btn-icon-square"
                  onClick={() => handleCopyUrl(item.id, item.url)}
                  title={copiedId === item.id ? "Copied" : "Copy URL"}
                  aria-label="Copy URL"
                >
                  {copiedId === item.id ? (
                    <CheckIcon size={14} />
                  ) : (
                    <CopyIcon size={14} />
                  )}
                </button>
              </div>
              {setupError?.id === item.id && (
                <div className="ai-error-text">{setupError.message}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 2: Download Model */}
      <div className="form-group settings-toggle-group">
        <label className="form-label">Step 2. Download On-Device Model</label>
        <p className="settings-toggle-desc ai-step-desc">
          Pre-download the local model before your first request to avoid
          delays.
        </p>

        <div className="ai-actions-row">
          <button
            type="button"
            className="btn-primary"
            onClick={downloadNanoModel}
            disabled={modelState.status !== "downloadable"}
          >
            {modelState.status === "available"
              ? "Downloaded"
              : modelState.status === "downloading"
                ? `Downloading ${modelState.progress !== null ? `${modelState.progress}%` : "..."}`
                : "Download Gemini Nano"}
          </button>
          {modelState.status === "downloading" && (
            <button
              type="button"
              className="btn-secondary"
              onClick={cancelNanoDownload}
            >
              Cancel
            </button>
          )}
        </div>

        {modelState.error && (
          <div className="ai-error-text">{modelState.error}</div>
        )}
      </div>
    </div>
  );
};
