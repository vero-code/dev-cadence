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

/**
 * Vector warning triangle icon
 */
export const WarningIcon = ({ className = '', size = 16 }) => (
  <svg
    className={className}
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
    <path d="M8 2.25 1.75 13.25h12.5L8 2.25z" />
    <line x1="8" y1="6.5" x2="8" y2="9.75" />
    <line x1="8" y1="11.5" x2="8.01" y2="11.5" />
  </svg>
);

/**
 * Vector trash bin icon
 */
export const TrashIcon = ({ className = '', size = 16 }) => (
  <svg
    className={className}
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
    <path d="M2.5 4.25h11" />
    <path d="M6 2.5h4" />
    <path d="M4 4.25l.75 9.25h6.5l.75-9.25" />
    <line x1="6.75" y1="6.75" x2="6.75" y2="11" />
    <line x1="9.25" y1="6.75" x2="9.25" y2="11" />
  </svg>
);

/**
 * Vector reset arrow icon
 */
export const ResetIcon = ({ className = '', size = 16 }) => (
  <svg
    className={className}
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
    <path d="M2.75 8a5.25 5.25 0 1 0 1.4-3.57L2.5 6" />
    <path d="M2.5 2.75V6h3.25" />
  </svg>
);

/**
 * Vector info circle icon
 */
export const InfoIcon = ({ className = '', size = 13 }) => (
  <svg
    className={className}
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
    <circle cx="8" cy="8" r="6.25" />
    <line x1="8" y1="7.25" x2="8" y2="11.25" />
    <line x1="8" y1="4.75" x2="8.01" y2="4.75" />
  </svg>
);

/**
 * Vector download icon for JSON export
 */
export const ExportIcon = ({ className = '', size = 16 }) => (
  <svg
    className={className}
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
    <path d="M8 2.5v7.5" />
    <path d="M5 7.25 8 10.25l3-3" />
    <path d="M2.75 11.5v1.75h10.5V11.5" />
  </svg>
);

/**
 * Vector upload icon for JSON import
 */
export const ImportIcon = ({ className = '', size = 16 }) => (
  <svg
    className={className}
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
    <path d="M8 10V2.5" />
    <path d="M5 5.25 8 2.25l3 3" />
    <path d="M2.75 11.5v1.75h10.5V11.5" />
  </svg>
);

/**
 * Vector sparkle icon for AI actions
 */
export const SparkleIcon = ({ className = '', size = 14 }) => (
  <svg
    className={className}
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
    <path d="M8 1.75 9.6 6.4 14.25 8 9.6 9.6 8 14.25 6.4 9.6 1.75 8 6.4 6.4 8 1.75z" />
  </svg>
);

/**
 * Vector left arrow icon for back navigation
 */
export const ArrowLeftIcon = ({ className = '', size = 16 }) => (
  <svg
    className={className}
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
    <path d="M10 12.5 5.5 8 10 3.5" />
  </svg>
);