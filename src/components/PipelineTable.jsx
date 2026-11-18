import { useState, useEffect, useMemo } from 'react';
import { MonthNavigator } from './MonthNavigator';
import { PipelineTableView } from './PipelineTableView';
import { PipelineCardsView } from './PipelineCardsView';
import { STATUS_FILTER_PILLS } from '../constants';
import { countHackathonsByStatus, filterAndSortHackathons } from '../utils/pipelineUtils';
import {
  TrackerBadgeIcon,
  CardsViewIcon,
  TableViewIcon,
  FilterArrowsIcon,
  PlusIcon,
  CloseIcon,
} from './Icons';

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
    } catch (err) {
      console.warn('Failed to save view mode:', err);
    }
  };

  const displayedHackathons = useMemo(
    () => filterAndSortHackathons(hackathons, statusFilter),
    [hackathons, statusFilter],
  );

  const statusCounts = useMemo(
    () => countHackathonsByStatus(hackathons),
    [hackathons],
  );

  const handleToggleStatusFilter = (targetStatus) => {
    setStatusFilter((prev) => (targetStatus === 'ALL' || prev === targetStatus ? 'ALL' : targetStatus));
  };

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

  const isEmpty = !hackathons || hackathons.length === 0;

  return (
    <div className="table-card pipeline-list-container">
      <div className="pipeline-header-row">
        <div className="tracker-heading-group">
          <h2 className="section-heading">
            <span>Tracker</span>
            <button type="button" className="btn-primary tracker-add-btn" onClick={onAddNew} title="Log Hackathon">
              <PlusIcon size={11} strokeWidth={2.4} />
            </button>
          </h2>
        </div>

        <div className="pipeline-header-actions">
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

      <div className="tracker-status-row">
        <div className="tracker-status-pills">
          {STATUS_FILTER_PILLS.map(({ key, filter, label }) => {
            const isActive = statusFilter === filter;
            const count = statusCounts[key];
            return (
              <button
                key={key}
                type="button"
                className={`tracker-status-pill pill-${key} ${isActive ? 'active' : ''} ${count === 0 ? 'zero' : ''}`}
                onClick={() => handleToggleStatusFilter(filter)}
                title={isActive ? `Clear ${filter} filter` : `Filter by ${filter} (${count})`}
                aria-label={isActive ? `Clear ${filter} filter` : `Filter by ${filter} (${count})`}
              >
                <span className={`status-pill-dot dot-${key}`} />
                <span className="status-pill-label">{label}</span>
                <span className="status-pill-count">{count}</span>
                {isActive && (
                  <span className="status-pill-clear" aria-hidden="true">
                    <CloseIcon />
                  </span>
                )}
              </button>
            );
          })}
        </div>

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
      </div>

      {isEmpty ? (
        <div className="empty-table-state">
          <TrackerBadgeIcon size={28} className="empty-tracker-icon" />
          <div className="empty-title">No hackathons logged yet</div>
          <div className="empty-desc">
            Click &quot;+ Hackathon&quot; to start pacing your work dates.
          </div>
        </div>
      ) : displayedHackathons.length === 0 ? (
        <div className="empty-table-state">
          <FilterArrowsIcon size={26} className="empty-tracker-icon" />
          <div className="empty-title">No hackathons match &quot;{statusFilter}&quot;</div>
          <button
            type="button"
            className="filter-reset-link-btn"
            onClick={() => setStatusFilter('ALL')}
          >
            Show all hackathons
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <PipelineTableView
          hackathons={displayedHackathons}
          openMenuId={openMenuId}
          hoveredHackathonId={hoveredHackathonId}
          onToggleMenu={setOpenMenuId}
          onEdit={(h) => { setOpenMenuId(null); onEdit(h); }}
          onDelete={(h) => { setOpenMenuId(null); onDelete(h); }}
          onHover={onHoverHackathon}
        />
      ) : (
        <PipelineCardsView
          hackathons={displayedHackathons}
          openMenuId={openMenuId}
          hoveredHackathonId={hoveredHackathonId}
          onToggleMenu={setOpenMenuId}
          onEdit={(h) => { setOpenMenuId(null); onEdit(h); }}
          onDelete={(h) => { setOpenMenuId(null); onDelete(h); }}
          onHover={onHoverHackathon}
        />
      )}
    </div>
  );
};