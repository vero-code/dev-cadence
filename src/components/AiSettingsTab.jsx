import { useState, useEffect } from 'react';
import { CHROME_AI_SETUP_URLS, AI_STATUS_INFO } from '../constants';
import { ExternalLinkIcon, CopyIcon, CheckIcon } from './Icons';

export const AiSettingsTab = () => {
  const [status, setStatus] = useState('checking');
  const [progress, setProgress] = useState(null);
  const [modelError, setModelError] = useState('');
  const [setupError, setSetupError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const statusInfo = AI_STATUS_INFO[status] || AI_STATUS_INFO.unavailable;

  const checkModelStatus = async () => {
    setModelError('');
    if (!('LanguageModel' in self)) {
      setStatus('unavailable');
      return;
    }
    try {
      const availability = await LanguageModel.availability({
        expectedInputs: [{ type: 'text', languages: ['en'] }],
        expectedOutputs: [{ type: 'text', languages: ['en'] }],
      });
      setStatus(availability);
    } catch (err) {
      setStatus('unavailable');
      setModelError(err.message);
    }
  };

  const handleOpenUrl = (id, url) => {
    setSetupError(null);
    if (typeof chrome !== 'undefined' && chrome.tabs?.create) {
      chrome.tabs.create({ url });
      return;
    }
    setSetupError({
      id,
      message: 'Browser blocks chrome:// links in web preview. Use Copy instead.',
    });
  };

  const handleCopyUrl = async (id, url) => {
    setSetupError(null);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      setSetupError({ id, message: 'Failed to copy URL.' });
    }
  };

  const handleDownloadModel = async () => {
    setModelError('');
    try {
      setStatus('downloading');
      const session = await LanguageModel.create({
        monitor(m) {
          m.addEventListener('downloadprogress', (e) => {
            console.log(`Downloaded ${e.loaded * 100}%`);
            setProgress(Math.round(e.loaded * 100));
          });
        },
      });
      session.destroy();
      await checkModelStatus();
    } catch (err) {
      setModelError(err.message);
      await checkModelStatus();
    }
  };

  useEffect(() => {
    checkModelStatus();
    window.addEventListener('focus', checkModelStatus);
    return () => window.removeEventListener('focus', checkModelStatus);
  }, []);

  return (
    <div className="ai-settings-tab">
      {/* Top Status Banner */}
      <div
        className="form-group settings-toggle-group"
        style={{ borderColor: statusInfo.color }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
          <span style={{ color: statusInfo.color, fontSize: '0.75rem' }}>●</span>
          <span className="form-label" style={{ margin: 0, color: statusInfo.color }}>
            Gemini Nano: {statusInfo.label}
          </span>
        </div>
        <p className="settings-toggle-desc" style={{ margin: 0 }}>
          {statusInfo.hint}
        </p>
      </div>
      
      <div className="form-group settings-toggle-group">
        {/* Step 1: Chrome Setup */}
        <label className="form-label">Step 1. Enable "On-device AI" in Chrome</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {CHROME_AI_SETUP_URLS.map((item) => (
            <div key={item.id}>
              <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                <input
                  type="text"
                  readOnly
                  className="form-input"
                  value={item.url}
                  style={{ fontSize: '0.75rem' }}
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
                  title={copiedId === item.id ? 'Copied' : 'Copy URL'}
                  aria-label="Copy URL"
                >
                  {copiedId === item.id ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                </button>
              </div>
              {setupError?.id === item.id && (
                <div style={{ color: 'var(--rose)', fontSize: '0.72rem', marginTop: '0.25rem' }}>
                  {setupError.message}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 2: Download On-Device Model */}
      <div className="form-group settings-toggle-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
          <label className="form-label" style={{ margin: 0 }}>Step 2. Download On-Device Model</label>
        </div>
        <p className="settings-toggle-desc" style={{ marginBottom: '0.6rem' }}>
          Pre-download the local model before your first request to avoid delays.
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            type="button"
            className="btn-primary"
            onClick={handleDownloadModel}
            disabled={status !== 'downloadable'}
          >
            {status === 'available'
              ? 'Available'
              : status === 'downloading'
              ? `Downloading ${progress !== null ? `${progress}%` : '...'}`
              : 'Download Model'}
          </button>
        </div>

        {modelError && (
          <div style={{ color: 'var(--rose)', fontSize: '0.74rem', marginTop: '0.5rem' }}>
            {modelError}
          </div>
        )}
      </div>
    </div>
  );
};