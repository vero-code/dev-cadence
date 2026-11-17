import { useState, useRef } from 'react';
import { getStoredData } from '../../utils/storage';
import {
  WarningIcon,
  TrashIcon,
  ResetIcon,
  ExportIcon,
  ImportIcon,
} from '../FormIcons';

export const DataManagementSection = ({
  onClearAllHackathons,
  onResetAllData,
  onImportData,
}) => {
  const [confirmClearHackathons, setConfirmClearHackathons] = useState(false);
  const [confirmResetAll, setConfirmResetAll] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const fileInputRef = useRef(null);

  const showTempMessage = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleExportJson = async () => {
    const data = await getStoredData();
    const dateStr = new Date().toISOString().slice(0, 10);
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dev-cadence-backup-${dateStr}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showTempMessage('Backup exported to JSON.');
  };

  const handleImportFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.hackathons)) {
          showTempMessage('Invalid backup file format.');
          return;
        }
        await onImportData?.(parsed);
        showTempMessage('Backup restored successfully.');
      } catch {
        showTempMessage('Failed to parse JSON file.');
      } finally {
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleClearHackathonsClick = async () => {
    if (!confirmClearHackathons) {
      setConfirmClearHackathons(true);
      setConfirmResetAll(false);
      return;
    }
    if (onClearAllHackathons) {
      await onClearAllHackathons();
      setConfirmClearHackathons(false);
      showTempMessage('All sprints have been cleared.');
    }
  };

  const handleResetAllClick = async () => {
    if (!confirmResetAll) {
      setConfirmResetAll(true);
      setConfirmClearHackathons(false);
      return;
    }
    if (onResetAllData) {
      await onResetAllData();
      setConfirmResetAll(false);
      showTempMessage('All data and preferences have been reset.');
    }
  };

  return (
    <div className="settings-danger-zone">
      <div className="danger-zone-title">Data Management</div>
      <p className="danger-zone-desc">
        Export or restore a local JSON backup, or clear saved data.
      </p>

      <div className="danger-actions-row" style={{ marginBottom: '0.5rem' }}>
        <button
          type="button"
          className="btn-secondary"
          style={{ flex: 1, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          onClick={handleExportJson}
        >
          <ExportIcon />
          Export JSON
        </button>
        <button
          type="button"
          className="btn-secondary"
          style={{ flex: 1, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          onClick={() => fileInputRef.current?.click()}
        >
          <ImportIcon />
          Import JSON
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          style={{ display: 'none' }}
          onChange={handleImportFileChange}
        />
      </div>

      <div className="danger-actions-row">
        <button
          type="button"
          className={`danger-btn-outline ${confirmClearHackathons ? 'confirming' : ''}`}
          onClick={handleClearHackathonsClick}
        >
          {confirmClearHackathons ? (
            <>
              <WarningIcon />
              Confirm Clear Sprints
            </>
          ) : (
            <>
              <TrashIcon />
              Clear Sprints
            </>
          )}
        </button>
        <button
          type="button"
          className={`danger-btn-outline ${confirmResetAll ? 'confirming' : ''}`}
          onClick={handleResetAllClick}
        >
          {confirmResetAll ? (
            <>
              <WarningIcon />
              Confirm Factory Reset
            </>
          ) : (
            <>
              <ResetIcon />
              Reset All
            </>
          )}
        </button>
      </div>
      {statusMessage && (
        <div className="settings-reset-msg">✓ {statusMessage}</div>
      )}
    </div>
  );
};