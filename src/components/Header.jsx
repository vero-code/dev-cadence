import { DEVPOST_PROFILE_URL } from '../constants';
import { AgedGearIcon, AnalyticsIcon } from './Icons';

export const Header = ({
  onOpenSettings,
  onOpenStats,
  isStatsOpen,
  onResetHome,
}) => {
  const handleLogoClick = () => {
    onResetHome?.();
  };
  return (
    <header className="panel-header">
      <div className="brand-row">
        <div className="brand-left">
          <div
            className="brand-logo-frame"
            onClick={handleLogoClick}
            role="button"
            tabIndex={0}
            title="Return to home view"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleLogoClick();
              }
            }}
          >
            <img src="/avatar.png" alt="Dev Cadence Automaton" className="brand-logo" />
          </div>
          <div className="brand-title-wrap">
            <h1 className="brand-title">Dev Cadence</h1>
            <span className="brand-subtitle">Capacity Planner</span>
          </div>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className={`settings-icon-btn stats-icon-btn ${isStatsOpen ? 'active' : ''}`}
            onClick={onOpenStats}
            title={isStatsOpen ? "Close Analytics (return to Tracker)" : "Cadence Analytics & History"}
            aria-label={isStatsOpen ? "Close Analytics" : "Cadence Analytics and History"}
          >
            <AnalyticsIcon size={19} />
          </button>
          <button
            type="button"
            className="settings-icon-btn"
            onClick={onOpenSettings}
            title="Settings & Themes"
            aria-label="Settings and Themes"
          >
            <AgedGearIcon className="settings-gear-svg" size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
