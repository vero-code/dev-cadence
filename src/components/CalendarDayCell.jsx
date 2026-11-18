import { getDayCellBackground } from '../utils/calendarUtils';
import {
  isDayInActiveRange,
  isDayInRangePreview,
  isDayInModalRange,
  isModalStart,
  isModalEnd,
  isModalDeadline,
} from '../utils/calendarRangeUtils';

export const CalendarDayCell = ({
  day,
  selectedDate,
  dateRange,
  hoveredRangeDate,
  avgTurnaroundDays,
  modalActiveRange,
  hoveredHackathonId,
  hoveredHackathon,
  isTooltipActive,
  onClick,
  onHoverDate,
}) => {
  if (day.isPadding) {
    return <div className="calendar-day-cell padding-cell" />;
  }

  const hasEvents = day.events.length > 0;
  const hasDeadlines = day.deadlines.length > 0;
  const isSelected = selectedDate === day.dateString;
  const isRangeStart = dateRange?.start === day.dateString;
  const inRangePreview = isDayInRangePreview(dateRange, hoveredRangeDate, avgTurnaroundDays, day.dateString);
  const inActiveRange = isDayInActiveRange(dateRange, day.dateString);
  const inModalRange = isDayInModalRange(modalActiveRange, day.dateString);
  const isModalStartDay = isModalStart(modalActiveRange, day.dateString);
  const isModalEndDay = isModalEnd(modalActiveRange, day.dateString);
  const isModalDeadlineDay = isModalDeadline(modalActiveRange, day.dateString);

  // Tracker hover highlighting
  const isHoveredEvent = Boolean(hoveredHackathonId && day.events.some((e) => e.id === hoveredHackathonId));
  const isHoveredDeadline = Boolean(hoveredHackathonId && day.deadlines.some((d) => d.id === hoveredHackathonId));
  const isHoveredHackathon = isHoveredEvent || isHoveredDeadline;
  const isDimmedByHover = Boolean(hoveredHackathonId && !isHoveredHackathon);
  const isHoveredStartDay = Boolean(hoveredHackathon && day.dateString === hoveredHackathon.startDate);
  const isHoveredEndDay = Boolean(hoveredHackathon && day.dateString === hoveredHackathon.endDate);

  let bgStyle = getDayCellBackground(day.events);
  if (inModalRange) {
    if (modalActiveRange?.color) {
      bgStyle = day.events.length === 0
        ? `${modalActiveRange.color}33`
        : `linear-gradient(rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0.32)), ${bgStyle}`;
    }
  } else if (isHoveredHackathon && hoveredHackathon?.color) {
    bgStyle = day.events.length === 0 && isHoveredDeadline
      ? `${hoveredHackathon.color}25`
      : `linear-gradient(rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.05)), ${bgStyle}`;
  }

  const cellInlineStyle = {
    background: bgStyle,
    ...(isHoveredHackathon && hoveredHackathon?.color ? {
      '--hover-hack-color': hoveredHackathon.color,
      '--hover-hack-glow': `${hoveredHackathon.color}66`,
    } : {}),
  };

  const cellTitle = isRangeStart
    ? 'Selected Start Date'
    : hasEvents || hasDeadlines
    ? `Click to view events for ${day.dateString}`
    : `Click to select ${day.dateString}`;

  const cellClasses = [
    'calendar-day-cell',
    day.isToday && 'today-cell',
    hasEvents && 'active-day',
    (isSelected || isTooltipActive) && 'selected-day',
    isRangeStart && 'range-start-cell',
    inRangePreview && 'range-preview-cell',
    inActiveRange && 'range-active-cell',
    inModalRange && 'modal-dashed-cell',
    isHoveredHackathon && 'hackathon-hover-highlight',
    isHoveredDeadline && !isHoveredEvent && 'hackathon-hover-deadline',
    isDimmedByHover && 'hackathon-dimmed-by-hover',
  ].filter(Boolean).join(' ');

  const showDraftStart = isModalStartDay && !isRangeStart;
  const showDraftEnd = isModalEndDay && !isRangeStart;
  const showHoverStart = isHoveredStartDay && !isRangeStart && !isModalStartDay;
  const showHoverEnd =
    isHoveredEndDay &&
    hoveredHackathon?.endDate !== hoveredHackathon?.startDate &&
    !isRangeStart &&
    !isModalEndDay;
  const hasRangeBadge =
    isRangeStart || showDraftStart || showDraftEnd || showHoverStart || showHoverEnd;

  const hasEmojis =
    day.events.some((e) => e.emoji) ||
    Boolean(inModalRange && modalActiveRange?.emoji);

  return (
    <div
      className={cellClasses}
      style={cellInlineStyle}
      onClick={(e) => onClick(e, day)}
      onMouseEnter={() => onHoverDate(day.dateString)}
      title={cellTitle}
    >
      <div className="day-top-bar">
        <span className="day-number">{day.dayNumber}</span>
        {(hasDeadlines || isModalDeadlineDay) && (
          <span
            className={`deadline-flag ${isModalDeadlineDay ? 'draft-deadline-flag' : ''} ${isHoveredDeadline ? 'highlighted-deadline-flag' : ''}`}
            title={
              isModalDeadlineDay
                ? `Draft Deadline: ${modalActiveRange?.name || 'Hackathon'}`
                : `Deadline: ${day.deadlines.map((d) => d.name).join(', ')}`
            }
          >
            🏁
          </span>
        )}
      </div>

      <div className="day-badges-wrap">
        {hasRangeBadge ? (
          <>
            {isRangeStart && <span className="range-badge">START</span>}
            {showDraftStart && (
              <span className="range-badge draft-start-badge" title="Draft Start Date">
                {modalActiveRange?.startDate === modalActiveRange?.endDate ? '1 DAY' : 'START'}
              </span>
            )}
            {showDraftEnd && (
              <span className="range-badge draft-end-badge" title="Draft End Date">END</span>
            )}
            {showHoverStart && (
              <span
                className="range-badge hover-start-badge"
                style={{ backgroundColor: hoveredHackathon?.color || 'var(--amber-gear)' }}
                title={`${hoveredHackathon?.name || 'Hackathon'} Start`}
              >
                {hoveredHackathon?.startDate === hoveredHackathon?.endDate ? '1 DAY' : 'START'}
              </span>
            )}
            {showHoverEnd && (
              <span
                className="range-badge hover-end-badge"
                style={{ backgroundColor: hoveredHackathon?.color || 'var(--amber-gear)' }}
                title={`${hoveredHackathon?.name || 'Hackathon'} End`}
              >
                END
              </span>
            )}
          </>
        ) : hasEmojis ? (
          <>
            {day.events.map((e) => (
              e.emoji ? (
                <span
                  key={e.id}
                  className={`day-event-emoji ${hoveredHackathonId === e.id ? 'highlighted-event-emoji' : ''}`}
                  title={`${e.name} (${e.status})`}
                  style={{ color: e.color }}
                >
                  {e.emoji}
                </span>
              ) : null
            ))}
            {inModalRange && modalActiveRange?.emoji && (
              <span
                className="day-event-emoji draft-event-emoji"
                title={`Draft: ${modalActiveRange.name || 'Hackathon'}`}
                style={modalActiveRange.color ? { color: modalActiveRange.color } : undefined}
              >
                {modalActiveRange.emoji}
              </span>
            )}
          </>
        ) : day.isToday ? (
          <span className="today-badge" title="Today">Today</span>
        ) : null}
      </div>
    </div>
  );
};