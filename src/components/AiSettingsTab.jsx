import React, { useState, useEffect } from 'react';
import { CHROME_AI_FLAG_URL } from '../constants';

export const AiSettingsTab = () => {
  const [status, setStatus] = useState('checking');
  const [progress, setProgress] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const checkModelStatus = async () => {
    setErrorMsg('');
    if (typeof window.LanguageModel === 'undefined') {
      setStatus('flag-disabled');
      return;
    }
    try {
      const availability = await window.LanguageModel.availability();
      setStatus(availability);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Failed to check model status.');
    }
  };

  useEffect(() => {
    checkModelStatus();
  }, []);

  const handleCopyFlag = async () => {
    try {
      await navigator.clipboard.writeText(CHROME_AI_FLAG_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setErrorMsg('Failed to copy URL.');
    }
  };

  const handleDownloadModel = async () => {
    setErrorMsg('');
    if (typeof window.LanguageModel === 'undefined') {
      setStatus('flag-disabled');
      setErrorMsg('Prompt API is not available. Enable the Chrome flag first.');
      return;
    }
    try {
      setStatus('downloading');
      setProgress(0);
      const session = await window.LanguageModel.create({
        monitor(m) {
          m.addEventListener('downloadprogress', (e) => {
            if (typeof e.loaded === 'number') {
              setProgress(Math.round(e.loaded * 100));
            }
          });
        },
      });
      if (session && typeof session.destroy === 'function') {
        session.destroy();
      }
      setProgress(100);
      await checkModelStatus();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Model download failed.');
    }
  };

  return (
    <div className="ai-settings-tab">
      {/* Step 1: Enable Chrome Flag */}
      <div className="form-group settings-toggle-group">
        <label className="form-label">1. Enable Chrome Flag (Chrome 139+)</label>
        <p className="settings-toggle-desc" style={{ marginBottom: '0.5rem' }}>
          Open the URL below in a new tab, set it to Enabled, and restart Chrome.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="text"
             readOnly
            className="form-input"
            value={CHROME_AI_FLAG_URL}
            style={{ fontSize: '0.75rem' }}
          />
          <button
            type="button"
            className="btn-secondary"
            onClick={handleCopyFlag}
            style={{ whiteSpace: 'nowrap' }}
          >
            {copied ? 'Copied' : 'Copy URL'}
          </button>
        </div>
      </div>

      {/* Step 2: Download On-Device Model */}
      <div className="form-group settings-toggle-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
          <label className="form-label" style={{ margin: 0 }}>2. On-Device Model (Gemini Nano)</label>
          <span className="settings-toggle-desc" style={{ fontWeight: 600 }}>
            Status: {status}
          </span>
        </div>
        <p className="settings-toggle-desc" style={{ marginBottom: '0.6rem' }}>
          Pre-download the local model before your first request to avoid delays.
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            type="button"
            className="btn-primary"
            onClick={handleDownloadModel}
            disabled={status === 'downloading' || status === 'available'}
          >
            {status === 'available'
              ? 'Model Ready'
              : status === 'downloading'
              ? `Downloading ${progress !== null ? `${progress}%` : '...'}`
              : 'Download Model'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={checkModelStatus}
          >
            Check Status
          </button>
        </div>

        {errorMsg && (
          <div style={{ color: 'var(--rose)', fontSize: '0.74rem', marginTop: '0.5rem' }}>
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
};