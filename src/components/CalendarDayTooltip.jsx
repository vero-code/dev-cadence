import { ExternalLinkIcon, PlusIcon } from './Icons';

const TooltipItemActions = ({ item, onEdit, onClose }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
    {item.url && (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="tooltip-event-link-btn"
        title={`Open ${item.url}`}
        onClick={(ev) => ev.stopPropagation()}
      >
        <ExternalLinkIcon size={11} />
      </a>
    )}
    <button
      type="button"
      className="tooltip-event-edit-btn"
      title={`Edit ${item.name}`}
      aria-label={`Edit ${item.name}`}
      onClick={(ev) => {
        ev.stopPropagation();
        onClose();
        onEdit && onEdit(item);
      }}
    >
      ✏️
    </button>
  </div>
);

export const CalendarDayTooltip = ({
  tooltip,
  onBook,
  onClose,
  onEdit,
}) => {
  if (!tooltip) return null;

  return (
    <div
      className={`calendar-day-tooltip ${tooltip.showAbove ? 'tooltip-above' : ''}`}
      style={tooltip.style}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="tooltip-header">
        <div className="tooltip-title-wrap">
          <span className="tooltip-date">📅 {tooltip.dateString}</span>
        </div>
        <div className="tooltip-header-actions">
          <button
            type="button"
            className="tooltip-add-btn"
            onClick={() => onBook(tooltip.dateString)}
            title="Book hackathon starting from this date"
            aria-label="Book date"
          >
            <PlusIcon size={10} />
          </button>
          <button
            type="button"
            className="tooltip-close-btn"
            onClick={onClose}
            aria-label="Close tooltip"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="tooltip-events-list">
        {tooltip.events.map((e) => (
          <div key={e.id} className="tooltip-event-row">
            <div className="tooltip-event-info">
              {e.color && (
                <span
                  className="tooltip-color-dot"
                  style={{ backgroundColor: e.color }}
                />
              )}
              <strong className="tooltip-event-name" title={e.name}>
                {e.emoji ? `${e.emoji} ` : ''}{e.name}
              </strong>
            </div>
            <TooltipItemActions item={e} onEdit={onEdit} onClose={onClose} />
          </div>
        ))}

        {tooltip.deadlines && tooltip.deadlines.map((d) => (
          <div key={`dl-${d.id}`} className="tooltip-deadline-row">
            <div className="tooltip-deadline-info">
              <span>🏁</span>
              <em>Deadline: {d.name}</em>
            </div>
            <TooltipItemActions item={d} onEdit={onEdit} onClose={onClose} />
          </div>
        ))}
      </div>
    </div>
  );
};