import React, { useState, useEffect, useMemo } from 'react';
import {
  TrackerBadgeIcon,
  CardsViewIcon,
  TableViewIcon,
  FilterArrowsIcon,
  ChevronDownIcon,
  PlusIcon,
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
  if (s.includes('registered') || s.includes('submitted')) return 'chip-registered';
  if (s.includes('early')) return 'chip-early';
  if (s.includes('wait') || s.includes('api')) return 'chip-waiting';
  if (s.includes('consider')) return 'chip-considering';
  return 'chip-custom';
};

export const PipelineTable = ({
  hackathons,
  onEdit,
  onDelete,
  onAddNew,
}) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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

  const availableStatuses = useMemo(() => {
    const set = new Set();
    (hackathons || []).forEach((h) => {
      if (h.status && h.status.trim()) {
        set.add(h.status.trim());
      }
    });
    return Array.from(set);
  }, [hackathons]);

  const displayedHackathons = useMemo(() => {
    if (!hackathons) return [];
    if (statusFilter === 'ALL') return hackathons;
    const filterLower = statusFilter.toLowerCase();
    return hackathons.filter((h) => (h.status || '').toLowerCase().includes(filterLower));
  }, [hackathons, statusFilter]);

  const isEmpty = !hackathons || hackathons.length === 0;

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.pipeline-menu-container')) {
        setOpenMenuId(null);
      }
      if (!e.target.closest('.tracker-filter-container')) {
        setIsFilterOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpenMenuId(null);
        setIsFilterOpen(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="table-card pipeline-list-container">
      <div className="pipeline-header-row">
        <div className="tracker-heading-group">
          <h2 className="section-heading">
            <TrackerBadgeIcon className="tracker-badge-icon" size={17} />
            <span>Tracker</span>
          </h2>

          <div className="tracker-filter-container">
            <button
              type="button"
              className={`tracker-filter-btn ${statusFilter !== 'ALL' ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsFilterOpen((prev) => !prev);
              }}
              title="Filter hackathons by status"
              aria-label="Filter hackathons by status"
            >
              <FilterArrowsIcon size={12} className="tracker-filter-arrows" />
              <span className="tracker-filter-label">
                {statusFilter === 'ALL' ? 'Filter' : statusFilter}
              </span>
              <ChevronDownIcon size={9} className={`tracker-filter-chevron ${isFilterOpen ? 'open' : ''}`} />
            </button>

            {isFilterOpen && (
              <div className="tracker-filter-dropdown" onClick={(e) => e.stopPropagation()}>
                <div className="tracker-filter-dropdown-title">Status Filter</div>
                <button
                  type="button"
                  className={`tracker-filter-option ${statusFilter === 'ALL' ? 'selected' : ''}`}
                  onClick={() => {
                    setStatusFilter('ALL');
                    setIsFilterOpen(false);
                  }}
                >
                  <span>All</span>
                  <span className="filter-count-badge">{(hackathons || []).length}</span>
                </button>
                {availableStatuses.map((st) => {
                  const count = (hackathons || []).filter((h) =>
                    (h.status || '').toLowerCase().includes(st.toLowerCase())
                  ).length;
                  return (
                    <button
                      key={st}
                      type="button"
                      className={`tracker-filter-option ${statusFilter === st ? 'selected' : ''}`}
                      onClick={() => {
                        setStatusFilter(st);
                        setIsFilterOpen(false);
                      }}
                    >
                      <span>{st}</span>
                      <span className="filter-count-badge">{count}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
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
            <span className="tracker-add-label">Hackathon</span>
          </button>
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
        <div className="pipeline-table-wrapper">
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

                return (
                  <tr key={h.id}>
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
        <div className="pipeline-list">
          {displayedHackathons.map((h, idx) => {
            const isMenuOpen = openMenuId === h.id;
            const openUpward = idx === displayedHackathons.length - 1 && displayedHackathons.length > 1;

            return (
              <div
                key={h.id}
                className={`pipeline-item ${isMenuOpen ? 'menu-open' : ''}`}
                style={{ zIndex: isMenuOpen ? 100 : 'auto' }}
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
