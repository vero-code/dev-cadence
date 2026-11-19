import { getDaysInMonth, getDateRangeArray } from './calendarUtils';
import { compareSprintsByDeadline } from './pipelineUtils';

// Converts "2026-11-30" -> "November 30, 2026"
const formatReadableDate = (dateStr) => {
    if (!dateStr) return 'none';
    return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

// Returns all dates where two ranges overlap
export const getDateRangeOverlap = (startA, endA, startB, endB) => {
  if (!startA || !endA || !startB || !endB) return [];
  const overlapStart = startA > startB ? startA : startB;
  const overlapEnd = endA < endB ? endA : endB;
  if (overlapStart > overlapEnd) return [];
  return getDateRangeArray(overlapStart, overlapEnd);
};

// Finds all sprints with overlapping dates
export const findSprintOverlaps = (sprints = []) => {
  const overlaps = [];
  for (let i = 0; i < sprints.length; i++) {
    for (let j = i + 1; j < sprints.length; j++) {
      const a = sprints[i];
      const b = sprints[j];
      const dates = getDateRangeOverlap(a.startDate, a.endDate, b.startDate, b.endDate);
      if (dates.length > 0) {
        overlaps.push({
          first: a.name,
          firstDeadline: a.deadline,
          second: b.name,
          dates,
        });
      }
    }
  }
  return overlaps;
};

export const buildScheduleAdvicePrompt = ({ sprints, year, month }) => {
  const daysInMonth = getDaysInMonth(year, month);
  const monthPadded = String(month + 1).padStart(2, '0');
  const monthStart = `${year}-${monthPadded}-01`;
  const monthEnd = `${year}-${monthPadded}-${String(daysInMonth).padStart(2, '0')}`;

  const now = new Date();
  const todayStr = formatReadableDate(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`);

  const activeSprints = sprints
    .filter(
      (s) =>
        s.startDate &&
        s.endDate &&
        s.status !== 'Done' &&
        s.startDate <= monthEnd &&
        s.endDate >= monthStart,
    )
    .sort(compareSprintsByDeadline);

  const overlaps = findSprintOverlaps(activeSprints);
  const overlapLines = overlaps
    .map(
      (o) =>
        `Sprints overlap on ${o.dates.map(formatReadableDate).join(', ')}: "${o.first}" and "${o.second}". "${o.first}" has higher priority because its deadline is closer (${formatReadableDate(o.firstDeadline)}).`,
    )
    .join('\n');

    return [
      overlapLines ? `${overlapLines}` : 'Overlaps: none.',
      '',
      'Present this information to the user in an attractive way.',
    ].join('\n');
};