import { MONTH_ABBR } from '../constants';

const STATUS_MATCHERS = {
  interest: (s) => s.includes('interest') || s.includes('consider'),
  join: (s) => s.includes('join') || s.includes('registered'),
  early: (s) => s.includes('early'),
  draft: (s) => s.includes('draft') || s.includes('wait') || s.includes('progress'),
  done: (s) => s.includes('done') || s.includes('submitted'),
};

export const formatDisplayDate = (isoDate) => {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length === 3) {
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    return `${MONTH_ABBR[m] || parts[1]} ${d}`;
  }
  return isoDate;
};

export const formatWorkRange = (startIso, endIso) => {
  if (!startIso || !endIso) return '';
  if (startIso === endIso) return formatDisplayDate(startIso);
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

export const getStatusChipClass = (status) => {
  const s = (status || '').toLowerCase();
  if (STATUS_MATCHERS.interest(s)) return 'chip-interest';
  if (STATUS_MATCHERS.join(s)) return 'chip-join';
  if (STATUS_MATCHERS.early(s)) return 'chip-early';
  if (STATUS_MATCHERS.draft(s)) return 'chip-draft';
  if (STATUS_MATCHERS.done(s)) return 'chip-done';
  return 'chip-custom';
};

export const countHackathonsByStatus = (hackathons) => {
  const counts = { interest: 0, join: 0, early: 0, draft: 0, done: 0 };
  (hackathons || []).forEach((h) => {
    const s = (h.status || '').toLowerCase();
    if (STATUS_MATCHERS.interest(s)) counts.interest += 1;
    else if (STATUS_MATCHERS.join(s)) counts.join += 1;
    else if (STATUS_MATCHERS.early(s)) counts.early += 1;
    else if (s.includes('draft') || s.includes('wait')) counts.draft += 1;
    else if (STATUS_MATCHERS.done(s)) counts.done += 1;
  });
  return counts;
};

export const filterAndSortHackathons = (hackathons, statusFilter) => {
  if (!hackathons) return [];
  let list = hackathons;

  if (statusFilter !== 'ALL') {
    const filterLower = statusFilter.toLowerCase();
    const matcher = Object.entries(STATUS_MATCHERS).find(([key]) => filterLower.includes(key))?.[1];
    list = hackathons.filter((h) => {
      const s = (h.status || '').toLowerCase();
      if (filterLower.includes('draft') || filterLower.includes('wait')) {
        return s.includes('draft') || s.includes('wait');
      }
      return matcher ? matcher(s) : s.includes(filterLower);
    });
  }

  return [...list].sort((a, b) => {
    const dateA = a.startDate || a.deadline || '9999-99-99';
    const dateB = b.startDate || b.deadline || '9999-99-99';
    if (dateA !== dateB) return dateA.localeCompare(dateB);

    const deadlineA = a.deadline || '9999-99-99';
    const deadlineB = b.deadline || '9999-99-99';
    if (deadlineA !== deadlineB) return deadlineA.localeCompare(deadlineB);

    return (a.name || '').localeCompare(b.name || '');
  });
};