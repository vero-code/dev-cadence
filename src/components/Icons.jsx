import React from 'react';

/**
 * Antique aged mechanical cogwheel with center hub, clockwork spokes, and machine teeth.
 */
export const AgedGearIcon = ({ className = '', size = 18 }) => (
  <svg
    className={`aged-gear-icon ${className}`}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Antique mechanical gear outline */}
    <path
      d="M12 2c.55 0 1 .45 1 1v.55c.78.16 1.52.44 2.2.82l.39-.39a1 1 0 0 1 1.41 0l1.41 1.41a1 1 0 0 1 0 1.41l-.39.39c.38.68.66 1.42.82 2.2H19c.55 0 1 .45 1 1v2c0 .55-.45 1-1 1h-.55c-.16.78-.44 1.52-.82 2.2l.39.39a1 1 0 0 1 0 1.41l-1.41 1.41a1 1 0 0 1-1.41 0l-.39-.39c-.68.38-1.42.66-2.2.82V19c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1v-.55c-.78-.16-1.52-.44-2.2-.82l-.39.39a1 1 0 0 1-1.41 0l-1.41-1.41a1 1 0 0 1 0-1.41l.39-.39c-.38-.68-.66-1.42-.82-2.2H5c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1h.55c.16-.78.44-1.52.82-2.2l-.39-.39a1 1 0 0 1 0-1.41l1.41-1.41a1 1 0 0 1 1.41 0l.39.39c.68-.38 1.42-.66 2.2-.82V3c0-.55.45-1 1-1h2Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    {/* Inner gear rim */}
    <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.5" />
    {/* Center mechanical hub */}
    <circle cx="12" cy="12" r="1.8" fill="currentColor" />
    {/* Mechanical spokes */}
    <line x1="12" y1="7.8" x2="12" y2="10.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <line x1="12" y1="13.8" x2="12" y2="16.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <line x1="7.8" y1="12" x2="10.2" y2="12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <line x1="13.8" y1="12" x2="16.2" y2="12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

/**
 * Clean vector clipboard/checklist badge icon replacing the raw emoji
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
 * Modern cards layout icon replacing raw 🗂️ emoji
 */
export const CardsViewIcon = ({ size = 14, className = '' }) => (
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
export const TableViewIcon = ({ size = 14, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <rect x="2" y="2" width="12" height="3" rx="1" />
    <rect x="2" y="6.5" width="12" height="3" rx="1" />
    <rect x="2" y="11" width="12" height="3" rx="1" />
  </svg>
);

/**
 * Filter funnel icon for filter actions
 */
export const FilterFunnelIcon = ({ size = 13, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 3h12L9.5 8.5V13l-3-1.5V8.5L2 3z" />
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
