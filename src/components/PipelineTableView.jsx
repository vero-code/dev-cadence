import { ExternalLinkIcon } from './Icons';
import { PipelineActionMenu } from './PipelineActionMenu';
import { formatDisplayDate, formatWorkRange, getStatusChipClass } from '../utils/pipelineUtils';

export const PipelineTableView = ({
  hackathons,
  openMenuId,
  hoveredHackathonId,
  onToggleMenu,
  onEdit,
  onDelete,
  onHover,
}) => (
  <div className="pipeline-table-wrapper" onMouseLeave={() => onHover && onHover(null)}>
    <table className="pipeline-table">
      <colgroup>
        <col style={{ width: '38%' }} />
        <col style={{ width: '30%' }} />
        <col style={{ width: '23%' }} />
        <col style={{ width: '9%' }} />
      </colgroup>
      <thead>
        <tr>
          <th className="table-th-name">Hackathon</th>
          <th className="table-th-dates">Dates &amp; Deadline</th>
          <th className="table-th-status">Status</th>
          <th className="table-th-actions" style={{ textAlign: 'right' }}></th>
        </tr>
      </thead>
      <tbody>
        {hackathons.map((h, idx) => {
          const isMenuOpen = openMenuId === h.id;
          const openUpward = idx >= hackathons.length - 2 && hackathons.length > 2;
          const isHovered = hoveredHackathonId === h.id;

          return (
            <tr
              key={h.id}
              className={isHovered ? 'row-hovered' : ''}
              onMouseEnter={() => onHover && onHover(h.id)}
              onMouseLeave={() => onHover && onHover(null)}
            >
              <td className="table-col-name">
                <div className="table-event-name" title={h.name}>
                  <span className="table-event-text">{h.name}</span>
                  {h.url && (
                    <a
                      href={h.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hackathon-link-icon-btn"
                      title={`Open hackathon link: ${h.url}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLinkIcon size={11} />
                    </a>
                  )}
                </div>
              </td>
              <td className="table-col-dates">
                <div className="table-dates-group">
                  <span className="table-work-range" title={`Work range: ${formatWorkRange(h.startDate, h.endDate)}`}>
                    {formatWorkRange(h.startDate, h.endDate)}
                  </span>
                  {h.deadline && (
                    <span className="table-deadline-sub" title={`Deadline: ${formatDisplayDate(h.deadline)}`}>
                      by {formatDisplayDate(h.deadline)}
                    </span>
                  )}
                </div>
              </td>
              <td className="table-col-status">
                <span className={`status-chip table-status-chip ${getStatusChipClass(h.status)}`} title={h.status}>
                  {h.status}
                </span>
              </td>
              <td className="table-col-actions" style={{ textAlign: 'right' }}>
                <PipelineActionMenu
                  isOpen={isMenuOpen}
                  openUpward={openUpward}
                  onToggle={() => onToggleMenu(isMenuOpen ? null : h.id)}
                  onEdit={() => onEdit(h)}
                  onDelete={() => onDelete(h)}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);