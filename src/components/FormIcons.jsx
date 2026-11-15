/**
 * Vector pencil icon for Edit Sprint title
 */
export const EditPenIcon = ({ className = '', size = 16 }) => (
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
    <path d="M11.5 2.5a1.5 1.5 0 0 1 2.12 2.12L5.5 12.75l-3 .75.75-3L11.5 2.5z" />
    <path d="M10 4l2 2" />
  </svg>
);

/**
 * Vector plus-square icon for Log Sprint title
 */
export const LogSprintIcon = ({ className = '', size = 16 }) => (
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
    <rect x="2.25" y="2.25" width="11.5" height="11.5" rx="2.5" />
    <line x1="8" y1="5.25" x2="8" y2="10.75" />
    <line x1="5.25" y1="8" x2="10.75" y2="8" />
  </svg>
);