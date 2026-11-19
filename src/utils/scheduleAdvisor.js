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

// Trims latest-deadline sprint to fix rest deficit
export const getRestDeficitInfo = (activeSprints, targetRest, freeDays, todayIso) => {
  const deficit = Math.max(0, targetRest - freeDays);
  if (deficit === 0) return null;

  const upcoming = activeSprints.filter((s) => s.endDate >= todayIso);
  const pool = upcoming.length > 0 ? upcoming : activeSprints;
  const candidate = pool[pool.length - 1] || null;

  return {
    deficit,
    freeDays,
    targetRest,
    candidateName: candidate?.name || null,
    candidateDeadline: candidate?.deadline || null,
  };
};

export const buildScheduleAdvicePrompt = ({ sprints, year, month, targetRest, freeDays }) => {
  const daysInMonth = getDaysInMonth(year, month);
  const monthPadded = String(month + 1).padStart(2, '0');
  const monthStart = `${year}-${monthPadded}-01`;
  const monthEnd = `${year}-${monthPadded}-${String(daysInMonth).padStart(2, '0')}`;

  const now = new Date();
  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

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

    const restInfo = getRestDeficitInfo(activeSprints, targetRest, freeDays, todayIso);
    const restLine = restInfo
    ? `Rest deficit: ${restInfo.deficit} days short of your ${restInfo.targetRest}-day rest target (${restInfo.freeDays} free days left).${
        restInfo.candidateName
          ? ` "${restInfo.candidateName}" has the furthest deadline (${formatReadableDate(restInfo.candidateDeadline)}), so it is the best sprint to shorten or simplify to an MVP.`
          : ''
      }`
    : '';

    const facts = [overlapLines, restLine].filter(Boolean).join('\n');
    const formatTemplate = [
      overlapLines
        ? '**Overlap:** <sprints & date> — prioritize <priority sprint> (deadline <date>).'
        : null,
      restLine
        ? '**Rest:** <deficit>d short (<free>d free) — simplify or shorten <candidate sprint> to MVP.'
        : null,
    ]
    .filter(Boolean)
    .join('\n');

    return [
      facts || 'Schedule looks balanced.',
      '',
      'Present these facts concisely using this exact markdown format:',
      formatTemplate || '- **Status:** <short summary>',
    ].join('\n');
};