import React from 'react';
import { CapacityBar } from './CapacityBar';

export const Footer = ({
  year,
  month,
  hackathons,
  settings,
  onOpenSettings,
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
        <span>&copy; {new Date().getFullYear()}</span>
        <span className="credits-dot">&bull;</span>
        <span>Crafted by</span>
        <a
          href="https://devpost.com/v_code"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-author-link"
        >
          vero-code
        </a>
      </div>
    </footer>
  );
};
