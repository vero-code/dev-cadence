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
    const deadline = prefillDates.deadline || '';

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
    deadline: '',
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

export const computeDatesFromCalendarClick = (clickedDate, currentValues, avgTurnaroundDays) => {
  const avgDays = Number(avgTurnaroundDays) || 10;
  const { startDate: curStart, endDate: curEnd, deadline: curDead, activeDateField: curField } = currentValues;

  if (curField === 'startDate') {
    if (curEnd && clickedDate > curEnd) {
      const newEnd = addDaysToDateString(clickedDate, avgDays - 1);
      return {
        startDate: clickedDate,
        endDate: newEnd,
        ...(curDead ? { deadline: newEnd } : {}),
      };
    }
    return { startDate: clickedDate };
  }

  if (curField === 'deadline') {
    const patch = { deadline: clickedDate };
    if (curEnd && clickedDate < curEnd) {
      patch.endDate = clickedDate;
      if (curStart && clickedDate < curStart) {
        patch.startDate = clickedDate;
      }
    }
    return patch;
  }

  if (!curStart) {
    const newEnd = addDaysToDateString(clickedDate, avgDays - 1);
    return { startDate: clickedDate, endDate: newEnd };
  }

  if (clickedDate >= curStart) {
    const patch = { endDate: clickedDate };
    if (curDead && (curDead === curEnd || curDead < clickedDate)) {
      patch.deadline = clickedDate;
    }
    return patch;
  }

  const patch = { startDate: clickedDate };
  if (!curEnd || curEnd < clickedDate) {
    const newEnd = addDaysToDateString(clickedDate, avgDays - 1);
    patch.endDate = newEnd;
    if (curDead) {
      patch.deadline = newEnd;
    }
  }
  return patch;
};