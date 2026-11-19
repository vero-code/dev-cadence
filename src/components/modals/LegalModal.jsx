import { useState, useEffect } from 'react';
import { GITHUB_REPO_URL, LEGAL_DATES } from '../../constants';

export const LegalModal = ({
  isOpen,
  initialTab = 'privacy',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card legal-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            Legal
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            &times;
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="legal-tabs-bar">
          <button
            type="button"
            className={`legal-tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy Policy
          </button>
          <button
            type="button"
            className={`legal-tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
            onClick={() => setActiveTab('terms')}
          >
            Terms of Use
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="legal-modal-body">
          {activeTab === 'privacy' && (
            <div className="legal-content-section">
              <div className="legal-block">
                <h3 className="legal-heading">1. Zero Data Collection Architecture</h3>
                <p>
                  <strong>Dev Cadence</strong> is developed by{' '}
                  <a
                    href={GITHUB_REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-author-link"
                  >
                    Veronika Kashtanova
                  </a>{' '}
                  on a strict local-first philosophy. We do not collect, track, store, or
                  transmit any personal information, browsing history, or user identity.
                  There are no remote user databases, tracking pixels, or cloud
                  synchronization endpoints.
                </p>
              </div>
              <div className="legal-block">
                <h3 className="legal-heading">2. Local Storage & Permissions</h3>
                <p>
                  All your hackathons, sprint dates, tags, notes, and custom preferences (such as themes, typography,
                  and target rest capacity) are stored purely on your local machine using:
                </p>
                <ul className="legal-list">
                  <li><strong>Chrome Storage API (<code>chrome.storage.local</code>):</strong> To persist your planner data offline across browser restarts when running as a Chrome Extension.</li>
                  <li><strong>Browser <code>localStorage</code>:</strong> Used as an automatic fallback when running in standard web environments.</li>
                </ul>
                <p>
                  The extension uses <code>storage</code> and <code>sidePanel</code> for local persistence and UI, plus <code>activeTab</code>, <code>scripting</code>, and host permissions strictly to read the current page text when you explicitly click to extract sprint details. It never reads pages in the background, tracks browsing history, or logs keystrokes.
                </p>
              </div>

              <div className="legal-block">
                <h3 className="legal-heading">3. Hybrid AI Processing & Zero Telemetry</h3>
                <p>
                  Dev Cadence contains zero advertising trackers and zero analytics telemetry (such as Google Analytics or Mixpanel).
                  When you explicitly trigger AI features, prompts run locally on your device via Chrome&apos;s built-in <strong>Gemini Nano</strong> model whenever available, and fall back to <strong>Firebase AI Logic (Gemini 4 Hydrogen)</strong> secured by <strong>Firebase App Check</strong> only when on-device inference is unavailable.
                </p>
                <p>
                  If you voluntarily submit the Contact form, the message you enter is sent to the developer via a Discord webhook solely to handle your feedback or support request.
                </p>
              </div>

              <div className="legal-block">
                <h3 className="legal-heading">4. Data Ownership & One-Click Deletion</h3>
                <p>
                  You have full and permanent ownership over your data. You may export, import, modify, or permanently wipe your data
                  at any time directly from <strong>Settings &rarr; Data Management</strong>:
                </p>
                <ul className="legal-list">
                  <li><strong>Export / Import JSON:</strong> Back up or restore your sprints and preferences locally.</li>
                  <li><strong>Clear Sprints:</strong> Instantly wipes all saved sprints while preserving your preferences.</li>
                  <li><strong>Factory Reset:</strong> Completely purges all local storage and resets the app to its original clean state.</li>
                </ul>
              </div>

              <div className="legal-block">
                <h3 className="legal-heading">5. Open Source Transparency</h3>
                <p>
                  Dev Cadence is an open-source project. Its source code is publicly accessible on GitHub, allowing
                  anyone to independently inspect, audit, and verify our local-only privacy guarantees.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="legal-content-section">
              <div className="legal-block">
                <h3 className="legal-heading">1. Acceptance of Terms</h3>
                <p>
                  By installing, downloading, or using <strong>Dev Cadence</strong> (including the Chrome Extension
                  and web application), you agree to these Terms of Use. If you do not agree to these terms, you
                  may discontinue use and uninstall the extension at any time.
                </p>
              </div>

              <div className="legal-block">
                <h3 className="legal-heading">2. Permitted Use & Apache 2.0 License</h3>
                <p>
                  Dev Cadence is created by{' '}
                  <a
                    href={GITHUB_REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-author-link"
                  >
                    Veronika Kashtanova
                  </a>{' '}
                  and distributed under the terms of the <strong>Apache License 2.0</strong>.
                  You are granted permission to use, reproduce, modify, and distribute copies
                  of the software for personal, educational, or commercial purposes, subject to
                  the license terms and attribution notices.
                </p>
              </div>

              <div className="legal-block">
                <h3 className="legal-heading">3. Advisory Decision-Support Disclaimer</h3>
                <p>
                  Dev Cadence provides visual scheduling tools, capacity indicators (e.g. Work vs. Target Rest Days),
                  and sprint overlap detection solely for informational, productivity, and organizational pacing purposes.
                </p>
                <p>
                  The software does not provide medical, occupational health, or binding legal advice. You remain
                  solely responsible for managing your physical well-being, work-life balance, and ensuring compliance
                  with official hackathon competition rules, team commitments, and submission deadlines.
                </p>
              </div>

              <div className="legal-block">
                <h3 className="legal-heading">4. "As-Is" Provision & Limitation of Liability</h3>
                <p>
                  The software is provided <em>"as is"</em>, without warranty of any kind, express or implied,
                  including but not limited to the warranties of merchantability, fitness for a particular purpose,
                  and non-infringement.
                </p>
                <p>
                  In no event shall the authors or copyright holders be liable for any claims, lost hackathon submissions,
                  data loss, or direct/indirect damages arising from the use of this software.
                </p>
              </div>

              <div className="legal-block">
                <h3 className="legal-heading">5. Updates & Changes</h3>
                <p>
                  We may periodically refine these terms as new features or browser APIs are added. Continued use
                  of the application constitutes acceptance of any updated terms.
                </p>
              </div>
            </div>
          )}

        </div>

        <div className="modal-footer modal-footer-row" style={{ marginTop: '0.85rem' }}>
          <span className="modal-footer-hint">
            {activeTab === 'privacy' ? 'Local-First Hybrid AI' : 'Advisory Decision-Support'} &bull; Updated {LEGAL_DATES[activeTab]}
          </span>
          <button type="button" className="btn-primary" onClick={onClose} style={{ minWidth: '85px' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
