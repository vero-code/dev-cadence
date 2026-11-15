import { ExternalLinkIcon } from './Icons';
import { PipelineActionMenu } from './PipelineActionMenu';
import { formatDisplayDate, formatWorkRange, getStatusChipClass } from '../utils/pipelineUtils';

export const PipelineCardsView = ({
  hackathons,
  openMenuId,
  hoveredHackathonId,
  onToggleMenu,
  onEdit,
  onDelete,
  onHover,
}) => (
  <div className="pipeline-list" onMouseLeave={() => onHover && onHover(null)}>
    {hackathons.map((h, idx) => {
      const isMenuOpen = openMenuId === h.id;
      const openUpward = idx === hackathons.length - 1 && hackathons.length > 1;
      const isHovered = hoveredHackathonId === h.id;

      return (
        <div
          key={h.id}
          className={`pipeline-item ${isMenuOpen ? 'menu-open' : ''} ${isHovered ? 'item-hovered' : ''}`}
          style={{ zIndex: isMenuOpen ? 100 : 'auto' }}
          onMouseEnter={() => onHover && onHover(h.id)}
          onMouseLeave={() => onHover && onHover(null)}
        >
          <div
            className="pipeline-item-color-bar"
            style={{ backgroundColor: h.color || 'var(--amber-gear)' }}
          />
          <div className="pipeline-item-content">
            <div className="pipeline-item-header">
              <div className="pipeline-item-title-wrap">
                {h.emoji && <span className="pipeline-item-emoji">{h.emoji}</span>}
                <span className="pipeline-item-name" title={h.name}>
                  {h.name}
                </span>
                {h.url && (
                  <a
                    href={h.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hackathon-link-icon-btn"
                    title={`Open hackathon link: ${h.url}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLinkIcon size={12} />
                  </a>
                )}
              </div>

              <PipelineActionMenu
                isOpen={isMenuOpen}
                openUpward={openUpward}
                onToggle={() => onToggleMenu(isMenuOpen ? null : h.id)}
                onEdit={() => onEdit(h)}
                onDelete={() => onDelete(h)}
              />
            </div>

            <div className="pipeline-item-meta">
              <div className="pipeline-meta-pills">
                <span className="pipeline-meta-pill" title="Work Dates">
                  <span className="meta-icon">🗓️</span>
                  <span>{formatWorkRange(h.startDate, h.endDate)}</span>
                </span>
                {h.deadline && (
                  <span className="pipeline-meta-pill deadline-pill" title="Submission Deadline">
                    <span className="meta-icon">🏁</span>
                    <span>Due {formatDisplayDate(h.deadline)}</span>
                  </span>
                )}
              </div>
              <span className={`status-chip ${getStatusChipClass(h.status)}`}>
                {h.status}
              </span>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);