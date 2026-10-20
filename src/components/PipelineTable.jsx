import { useState, useEffect, useMemo } from 'react';
import { MonthNavigator } from './MonthNavigator';
import {
  TrackerBadgeIcon,
  CardsViewIcon,
  TableViewIcon,
  FilterArrowsIcon,
  PlusIcon,
  ExternalLinkIcon,
  CloseIcon,
} from './Icons';

const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDisplayDate = (isoDate) => {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length === 3) {
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const monthStr = MONTH_ABBR[m] || parts[1];
    return `${monthStr} ${d}`;
  }
  return isoDate;
};

const formatWorkRange = (startIso, endIso) => {
  if (!startIso || !endIso) return '';
  const startParts = startIso.split('-');
  const endParts = endIso.split('-');
  if (startParts.length === 3 && endParts.length === 3) {
    const sMonth = parseInt(startParts[1], 10) - 1;
    const eMonth = parseInt(endParts[1], 10) - 1;
    const sDay = parseInt(startParts[2], 10);
    const eDay = parseInt(endParts[2], 10);

    if (sMonth === eMonth) {
      return `${MONTH_ABBR[sMonth] || startParts[1]} ${sDay} – ${eDay}`;
    }
    return `${MONTH_ABBR[sMonth]} ${sDay} – ${MONTH_ABBR[eMonth]} ${eDay}`;
  }
  return `${startIso} – ${endIso}`;
};

const getStatusChipClass = (status) => {
  const s = (status || '').toLowerCase();
  if (s.includes('interest') || s.includes('consider')) return 'chip-interest';
  if (s.includes('join') || s.includes('registered')) return 'chip-join';
  if (s.includes('early')) return 'chip-early';
  if (s.includes('draft') || s.includes('wait') || s.includes('progress')) return 'chip-draft';
  if (s.includes('done') || s.includes('submitted')) return 'chip-done';
  return 'chip-custom';
};

export const PipelineTable = ({
  hackathons,
  onEdit,
  onDelete,
  onAddNew,
  year,
  month,
  currentYear,
  currentMonth,
  onPrevMonth,
  onNextMonth,
  hoveredHackathonId,
  onHoverHackathon,
}) => {
  const activeYear = year ?? currentYear ?? 2026;
  const activeMonth = month ?? currentMonth ?? 9;
  const [openMenuId, setOpenMenuId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('devcadence_view_mode') || 'cards';
    } catch {
      return 'cards';
    }
  });

  const handleSetViewMode = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('devcadence_view_mode', mode);
    } catch {}
  };

  const displayedHackathons = useMemo(() => {
    if (!hackathons) return [];
    let list = hackathons;
    if (statusFilter !== 'ALL') {
      const filterLower = statusFilter.toLowerCase();
      if (filterLower.includes('interest') || filterLower.includes('consider')) {
        list = hackathons.filter((h) => {
          const s = (h.status || '').toLowerCase();
          return s.includes('interest') || s.includes('consider');
        });
      } else if (filterLower.includes('join') || filterLower.includes('registered')) {
        list = hackathons.filter((h) => {
          const s = (h.status || '').toLowerCase();
          return s.includes('join') || s.includes('registered');
        });
      } else if (filterLower.includes('early')) {
        list = hackathons.filter((h) => {
          const s = (h.status || '').toLowerCase();
          return s.includes('early');
        });
      } else if (filterLower.includes('draft') || filterLower.includes('wait')) {
        list = hackathons.filter((h) => {
          const s = (h.status || '').toLowerCase();
          return s.includes('draft') || s.includes('wait');
        });
      } else if (filterLower.includes('done') || filterLower.includes('submitted')) {
        list = hackathons.filter((h) => {
          const s = (h.status || '').toLowerCase();
          return s.includes('done') || s.includes('submitted');
        });
      } else {
        list = hackathons.filter((h) => (h.status || '').toLowerCase().includes(filterLower));
      }
    }

    // Default: chronological ordering by startDate ascending (fallback to deadline, then name)
    return [...list].sort((a, b) => {
      const dateA = a.startDate || a.deadline || '9999-99-99';
      const dateB = b.startDate || b.deadline || '9999-99-99';
      if (dateA !== dateB) {
        return dateA.localeCompare(dateB);
      }
      const deadlineA = a.deadline || '9999-99-99';
      const deadlineB = b.deadline || '9999-99-99';
      if (deadlineA !== deadlineB) {
        return deadlineA.localeCompare(deadlineB);
      }
      return (a.name || '').localeCompare(b.name || '');
    });
  }, [hackathons, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts = {
      interest: 0,
      join: 0,
      early: 0,
      draft: 0,
      done: 0,
    };
    (hackathons || []).forEach((h) => {
      const s = (h.status || '').toLowerCase();
      if (s.includes('interest') || s.includes('consider')) counts.interest += 1;
      else if (s.includes('join') || s.includes('registered')) counts.join += 1;
      else if (s.includes('early')) counts.early += 1;
      else if (s.includes('draft') || s.includes('wait')) counts.draft += 1;
      else if (s.includes('done') || s.includes('submitted')) counts.done += 1;
    });
    return counts;
  }, [hackathons]);

  const handleToggleStatusFilter = (targetStatus) => {
    if (targetStatus === 'ALL' || statusFilter === targetStatus) {
      setStatusFilter('ALL');
    } else {
      setStatusFilter(targetStatus);
    }
  };

  const isEmpty = !hackathons || hackathons.length === 0;

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.pipeline-menu-container')) {
        setOpenMenuId(null);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpenMenuId(null);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isInterestActive = statusFilter === 'Interest';
  const isJoinActive = statusFilter === 'Join';
  const isEarlyActive = statusFilter === 'Early';
  const isDraftActive = statusFilter === 'Draft';
  const isDoneActive = statusFilter === 'Done';

  return (
    <div className="table-card pipeline-list-container">
      <div className="pipeline-header-row">
        <div className="tracker-heading-group">
          <h2 className="section-heading">
            <TrackerBadgeIcon className="tracker-badge-icon" size={16} />
            <span>Tracker</span>
          </h2>
        </div>

        <div className="tracker-status-pills">
          <button
            type="button"
            className={`tracker-status-pill pill-interest ${isInterestActive ? 'active' : ''} ${statusCounts.interest === 0 ? 'zero' : ''}`}
            onClick={() => handleToggleStatusFilter('Interest')}
            title={isInterestActive ? 'Clear Interest filter' : `Filter by Interest (${statusCounts.interest})`}
            aria-label={isInterestActive ? 'Clear Interest filter' : `Filter by Interest (${statusCounts.interest})`}
          >
            <span className="status-pill-dot dot-interest" />
            <span className="status-pill-label">Interest</span>
            <span className="status-pill-count">{statusCounts.interest}</span>
            {isInterestActive && (
              <span className="status-pill-clear" aria-hidden="true">
                <CloseIcon />
              </span>
            )}
          </button>

          <button
            type="button"
            className={`tracker-status-pill pill-join ${isJoinActive ? 'active' : ''} ${statusCounts.join === 0 ? 'zero' : ''}`}
            onClick={() => handleToggleStatusFilter('Join')}
            title={isJoinActive ? 'Clear Join filter' : `Filter by Join (${statusCounts.join})`}
            aria-label={isJoinActive ? 'Clear Join filter' : `Filter by Join (${statusCounts.join})`}
          >
            <span className="status-pill-dot dot-join" />
            <span className="status-pill-label">Join</span>
            <span className="status-pill-count">{statusCounts.join}</span>
            {isJoinActive && (
              <span className="status-pill-clear" aria-hidden="true">
                <CloseIcon />
              </span>
            )}
          </button>

          <button
            type="button"
            className={`tracker-status-pill pill-early ${isEarlyActive ? 'active' : ''} ${statusCounts.early === 0 ? 'zero' : ''}`}
            onClick={() => handleToggleStatusFilter('Early')}
            title={isEarlyActive ? 'Clear Early filter' : `Filter by Early (${statusCounts.early})`}
            aria-label={isEarlyActive ? 'Clear Early filter' : `Filter by Early (${statusCounts.early})`}
          >
            <span className="status-pill-dot dot-early" />
            <span className="status-pill-label">Early</span>
            <span className="status-pill-count">{statusCounts.early}</span>
            {isEarlyActive && (
              <span className="status-pill-clear" aria-hidden="true">
                <CloseIcon />
              </span>
            )}
          </button>

          <button
            type="button"
            className={`tracker-status-pill pill-draft ${isDraftActive ? 'active' : ''} ${statusCounts.draft === 0 ? 'zero' : ''}`}
            onClick={() => handleToggleStatusFilter('Draft')}
            title={isDraftActive ? 'Clear Draft filter' : `Filter by Draft (${statusCounts.draft})`}
            aria-label={isDraftActive ? 'Clear Draft filter' : `Filter by Draft (${statusCounts.draft})`}
          >
            <span className="status-pill-dot dot-draft" />
            <span className="status-pill-label">Draft</span>
            <span className="status-pill-count">{statusCounts.draft}</span>
            {isDraftActive && (
              <span className="status-pill-clear" aria-hidden="true">
                <CloseIcon />
              </span>
            )}
          </button>

          <button
            type="button"
            className={`tracker-status-pill pill-done ${isDoneActive ? 'active' : ''} ${statusCounts.done === 0 ? 'zero' : ''}`}
            onClick={() => handleToggleStatusFilter('Done')}
            title={isDoneActive ? 'Clear Done filter' : `Filter by Done (${statusCounts.done})`}
            aria-label={isDoneActive ? 'Clear Done filter' : `Filter by Done (${statusCounts.done})`}
          >
            <span className="status-pill-dot dot-done" />
            <span className="status-pill-label">Done</span>
            <span className="status-pill-count">{statusCounts.done}</span>
            {isDoneActive && (
              <span className="status-pill-clear" aria-hidden="true">
                <CloseIcon />
              </span>
            )}
          </button>
        </div>

        <div className="pipeline-header-actions">
          <div className="view-mode-toggle" title="Switch layout">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => handleSetViewMode('cards')}
              title="Cards view"
              aria-label="Cards view"
            >
              <CardsViewIcon size={14} />
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => handleSetViewMode('table')}
              title="Table view"
              aria-label="Table view"
            >
              <TableViewIcon size={14} />
            </button>
          </div>
          <button type="button" className="btn-primary tracker-add-btn" onClick={onAddNew} title="Log Hackathon">
            <PlusIcon size={11} strokeWidth={2.4} />
          </button>
          <div className="calendar-month-nav">
            <MonthNavigator
              currentYear={activeYear}
              currentMonth={activeMonth}
              onPrevMonth={onPrevMonth}
              onNextMonth={onNextMonth}
            />
          </div>
        </div>
      </div>

      {isEmpty ? (
        <div className="empty-table-state">
          <TrackerBadgeIcon size={28} className="empty-tracker-icon" />
          <div className="empty-title">No hackathons logged yet</div>
          <div className="empty-desc">
            Click "+ Hackathon" to start pacing your work dates.
          </div>
        </div>
      ) : displayedHackathons.length === 0 ? (
        <div className="empty-table-state">
          <FilterArrowsIcon size={26} className="empty-tracker-icon" />
          <div className="empty-title">No hackathons match "{statusFilter}"</div>
          <button
            type="button"
            className="filter-reset-link-btn"
            onClick={() => setStatusFilter('ALL')}
          >
            Show all hackathons
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="pipeline-table-wrapper" onMouseLeave={() => onHoverHackathon && onHoverHackathon(null)}>
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
                <th className="table-th-dates">Dates & Deadline</th>
                <th className="table-th-status">Status</th>
                <th className="table-th-actions" style={{ textAlign: 'right' }}></th>
              </tr>
            </thead>
            <tbody>
              {displayedHackathons.map((h, idx) => {
                const isMenuOpen = openMenuId === h.id;
                const openUpward = idx >= displayedHackathons.length - 2 && displayedHackathons.length > 2;
                const isHovered = hoveredHackathonId === h.id;

                return (
                  <tr
                    key={h.id}
                    className={isHovered ? 'row-hovered' : ''}
                    onMouseEnter={() => onHoverHackathon && onHoverHackathon(h.id)}
                    onMouseLeave={() => onHoverHackathon && onHoverHackathon(null)}
                  >
                    <td className="table-col-name">
                      <div className="table-event-name" title={h.name}>
                        {h.color && (
                          <span
                            className="color-dot"
                            style={{
                              backgroundColor: h.color,
                            }}
                          />
                        )}
                        {h.emoji && <span className="table-event-emoji">{h.emoji}</span>}
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
                      <div className="pipeline-menu-container">
                        <button
                          type="button"
                          className="kebab-btn"
                          title="Actions"
                          aria-label="Actions menu"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(isMenuOpen ? null : h.id);
                          }}
                        >
                          &#x22EE;
                        </button>
                        {isMenuOpen && (
                          <div
                            className={`pipeline-dropdown-menu ${openUpward ? 'dropdown-upward' : ''}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              className="pipeline-menu-item"
                              onClick={() => {
                                setOpenMenuId(null);
                                onEdit(h);
                              }}
                            >
                              <span className="menu-item-icon">✏️</span>
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              className="pipeline-menu-item delete-item"
                              onClick={() => {
                                setOpenMenuId(null);
                                onDelete(h);
                              }}
                            >
                              <span className="menu-item-icon">🗑️</span>
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="pipeline-list" onMouseLeave={() => onHoverHackathon && onHoverHackathon(null)}>
          {displayedHackathons.map((h, idx) => {
            const isMenuOpen = openMenuId === h.id;
            const openUpward = idx === displayedHackathons.length - 1 && displayedHackathons.length > 1;
            const isHovered = hoveredHackathonId === h.id;

            return (
              <div
                key={h.id}
                className={`pipeline-item ${isMenuOpen ? 'menu-open' : ''} ${isHovered ? 'item-hovered' : ''}`}
                style={{ zIndex: isMenuOpen ? 100 : 'auto' }}
                onMouseEnter={() => onHoverHackathon && onHoverHackathon(h.id)}
                onMouseLeave={() => onHoverHackathon && onHoverHackathon(null)}
              >
                <div
                  className="pipeline-item-color-bar"
                  style={{
                    backgroundColor: h.color || 'var(--amber-gear)',
                  }}
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

                    <div className="pipeline-menu-container">
                      <button
                        type="button"
                        className="kebab-btn"
                        title="Actions"
                        aria-label="Actions menu"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === h.id ? null : h.id);
                        }}
                      >
                        &#x22EE;
                      </button>

                      {openMenuId === h.id && (
                        <div
                          className={`pipeline-dropdown-menu ${openUpward ? 'dropdown-upward' : ''}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            className="pipeline-menu-item"
                            onClick={() => {
                              setOpenMenuId(null);
                              onEdit(h);
                            }}
                          >
                            <span className="menu-item-icon">✏️</span>
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            className="pipeline-menu-item delete-item"
                            onClick={() => {
                              setOpenMenuId(null);
                              onDelete(h);
                            }}
                          >
                            <span className="menu-item-icon">🗑️</span>
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
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
      )}
    </div>
  );
};

export const PipelineList = PipelineTable;
