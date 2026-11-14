import { STATUS_OPTIONS } from '../constants';
import { addDaysToDateString } from './calendarUtils';

export const getInitialFormState = ({
  editingHackathon,
  prefillDates,
  initialYear,
  initialMonth,
  avgTurnaroundDays,
}) => {
  const avgDays = Number(avgTurnaroundDays) || 10;

  if (editingHackathon) {
    return {
      name: editingHackathon.name || '',
      url: editingHackathon.url || '',
      deadline: editingHackathon.deadline || '',
      status: editingHackathon.status || STATUS_OPTIONS[0],
      startDate: editingHackathon.startDate || '',
      endDate: editingHackathon.endDate || '',
      color: editingHackathon.color || '',
      emoji: editingHackathon.emoji || '',
    };
  }

  if (prefillDates) {
    const start = prefillDates.startDate || '';
    const end =
      prefillDates.endDate && prefillDates.endDate !== prefillDates.startDate
        ? prefillDates.endDate
        : start
        ? addDaysToDateString(start, avgDays - 1)
        : '';
    const deadline =
      prefillDates.deadline && prefillDates.deadline !== prefillDates.startDate
        ? prefillDates.deadline
        : end;

    return {
      name: '',
      url: '',
      startDate: start,
      endDate: end,
      deadline,
      status: STATUS_OPTIONS[0],
      color: '',
      emoji: '',
    };
  }

  const monthPadded = String(initialMonth + 1).padStart(2, '0');
  const defaultStart = `${initialYear}-${monthPadded}-05`;
  const defaultEnd = addDaysToDateString(defaultStart, avgDays - 1);

  return {
    name: '',
    url: '',
    startDate: defaultStart,
    endDate: defaultEnd,
    deadline: defaultEnd,
    status: STATUS_OPTIONS[0],
    color: '',
    emoji: '',
  };
};

export const validateAndFormatUrl = (rawUrl) => {
  let formatted = rawUrl.trim();
  if (!formatted) return { url: '', error: null };

  if (!/^https?:\/\//i.test(formatted)) {
    formatted = `https://${formatted}`;
  }

  try {
    const parsed = new URL(formatted);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { url: '', error: 'Please enter a valid website URL (http or https).' };
    }
    const hostname = parsed.hostname;
    const isLocal = hostname === 'localhost';
    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
    const domainRegex =
      /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*\.(?:[a-z]{2,}|xn--[a-z0-9]+)$/i;

    if (!isLocal && (isIp || !domainRegex.test(hostname))) {
      return { url: '', error: 'Please enter a valid website URL (e.g. devpost.com or https://...)' };
    }
    return { url: formatted, error: null };
  } catch {
    return { url: '', error: 'Please enter a valid website URL (e.g. devpost.com or https://...)' };
  }
};