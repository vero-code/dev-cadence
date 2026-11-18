import { getDaysInMonth } from './calendarUtils';

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

  const activeSprints = sprints.filter(
    (s) =>
      s.startDate &&
      s.endDate &&
      s.status !== 'Done' &&
      s.startDate <= monthEnd &&
      s.endDate >= monthStart,
  );

  const sprintLines = activeSprints
    .map((s) => `- Sprint: "${s.name}", Deadline: "${formatReadableDate(s.deadline) || 'none'}";`)
    .join('\n');

  return [
    `Today is ${todayStr}.`,
    'Given these sprint deadlines, which one is closest:',
    sprintLines,
    'In 1 short plain-text sentence (no markdown).',
  ].join('\n');
};