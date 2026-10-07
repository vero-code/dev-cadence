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
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="footer-author-link"
        >
          vero-code
        </a>
        <span>&copy; {new Date().getFullYear()}</span>
        <span className="credits-dot">&bull;</span>
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
      </div>
    </footer>
  );
};
