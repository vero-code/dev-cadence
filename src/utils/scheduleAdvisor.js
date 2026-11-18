import { getDaysInMonth } from './calendarUtils';
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

  const sprintLines = activeSprints
    .map((s) => `- Sprint: "${s.name}", Work: ${formatReadableDate(s.startDate)} to ${formatReadableDate(s.endDate)}, Deadline: "${formatReadableDate(s.deadline) || 'none'}";`)
    .join('\n');

  return [
    `Today is ${todayStr}. \n`,
    "1. Given each sprint's work start and end dates, check if any sprints overlap (ignore deadlines).",
    '2. If they do, name the overlapping sprints, the overlapping date(s), and explain why.',
    '',
    `Sprints:`,
    sprintLines,
    '',
    'In 2 short plain-text sentences, do not start with "Yes" or "No". State it directly, e.g., "Sprint 1 and Sprint 2 overlap on Nov 1." or "No hackathon overlaps."',
  ].join('\n');
};