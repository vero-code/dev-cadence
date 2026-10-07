import React from 'react';

/**
 * Clean, symmetrical clockwork mechanical cogwheel icon.
 * Sharp precision teeth, center bore arbor hole.
 */
export const AgedGearIcon = ({ className = '', size = 18 }) => (
  <svg
    className={`aged-gear-icon ${className}`}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3.2" />
  </svg>
);

/**
 * Clean vector clipboard/checklist badge icon for Tracker
 */
export const TrackerBadgeIcon = ({ className = '', size = 16 }) => (
  <svg
    className={`tracker-badge-icon ${className}`}
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10.5 2.25h1.75a1.25 1.25 0 0 1 1.25 1.25v10a1.25 1.25 0 0 1-1.25 1.25H3.75A1.25 1.25 0 0 1 2.5 13.5V3.5A1.25 1.25 0 0 1 3.75 2.25H5.5" />
    <rect x="5.25" y="1" width="5.5" height="2.5" rx="0.75" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.2" />
    <line x1="5.25" y1="6.5" x2="10.75" y2="6.5" />
    <line x1="5.25" y1="9.5" x2="10.75" y2="9.5" />
    <line x1="5.25" y1="12.5" x2="8.5" y2="12.5" />
  </svg>
);

/**
 * Clean vector calendar badge icon for Schedule (matching TrackerBadgeIcon)
 */
export const ScheduleBadgeIcon = ({ className = '', size = 16 }) => (
  <svg
    className={`schedule-badge-icon ${className}`}
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2.5" width="12" height="11.5" rx="2" />
    <line x1="2" y1="6" x2="14" y2="6" />
    <line x1="4.75" y1="1.25" x2="4.75" y2="3.25" />
    <line x1="11.25" y1="1.25" x2="11.25" y2="3.25" />
    <circle cx="5" cy="8.75" r="0.75" fill="currentColor" stroke="none" />
    <circle cx="8" cy="8.75" r="0.75" fill="currentColor" stroke="none" />
    <circle cx="11" cy="8.75" r="0.75" fill="currentColor" stroke="none" />
    <circle cx="5" cy="11.5" r="0.75" fill="currentColor" stroke="none" />
    <circle cx="8" cy="11.5" r="0.75" fill="currentColor" stroke="none" />
    <circle cx="11" cy="11.5" r="0.75" fill="currentColor" stroke="none" />
  </svg>
);

/**
 * Modern cards layout icon replacing raw 🗂️ emoji
 */
export const CardsViewIcon = ({ size = 13, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <rect x="1.5" y="2" width="5.5" height="5" rx="1.5" />
    <rect x="9" y="2" width="5.5" height="5" rx="1.5" />
    <rect x="1.5" y="9" width="5.5" height="5" rx="1.5" />
    <rect x="9" y="9" width="5.5" height="5" rx="1.5" />
  </svg>
);

/**
 * Modern table layout icon replacing raw 📊 emoji
 */
export const TableViewIcon = ({ size = 13, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <rect x="2" y="2" width="12" height="3" rx="1" />
    <rect x="2" y="6.5" width="12" height="3" rx="1" />
    <rect x="2" y="11" width="12" height="3" rx="1" />
  </svg>
);

/**
 * Filter arrows icon ("стрелочки типа фильтра")
 */
export const FilterArrowsIcon = ({ size = 13, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2.5 3.5h11M4.5 8h7M6.5 12.5h3" />
  </svg>
);

/**
 * Small chevron down icon
 */
export const ChevronDownIcon = ({ size = 10, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="4 6 8 10 12 6" />
  </svg>
);

/**
 * Mathematically centered plus icon for buttons
 */
export const PlusIcon = ({ size = 11, className = '', strokeWidth = 2.4 }) => (
  <svg
    className={`tracker-plus-icon ${className}`}
    width={size}
    height={size}
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="6" y1="2" x2="6" y2="10" />
    <line x1="2" y1="6" x2="10" y2="6" />
  </svg>
);

