import React from 'react';
import { CapacityBar } from './CapacityBar';
import { GITHUB_REPO_URL } from '../constants';

export const Footer = ({
  year,
  month,
  hackathons,
  settings,
  onOpenSettings,
  onOpenLegal,
  onOpenContact,
}) => {
  return (
    <footer className="app-footer">
      <CapacityBar
        year={year}
        month={month}
        hackathons={hackathons}
        settings={settings}
        onOpenSettings={onOpenSettings}
      />
      <div className="footer-credits">
        <div className="footer-credits-group">
          <span>&copy; {new Date().getFullYear()}</span>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-author-link"
          >
            Dev Cadence
          </a>
        </div>
        <div className="footer-credits-group">
          <button
            type="button"
            className="footer-legal-btn"
            onClick={() => onOpenLegal && onOpenLegal('privacy')}
          >
            Privacy Policy
          </button>
          <span className="credits-dot">&bull;</span>
          <button
            type="button"
            className="footer-legal-btn"
            onClick={() => onOpenLegal && onOpenLegal('terms')}
          >
            Terms of Use
          </button>
          <span className="credits-dot">&bull;</span>
          <button
            type="button"
            className="footer-legal-btn"
            onClick={() => onOpenContact && onOpenContact()}
          >
            Contact
          </button>
        </div>
      </div>
    </footer>
  );
};
