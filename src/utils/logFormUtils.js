import { STATUS_OPTIONS, MAX_SPRINTS_PER_DAY } from '../constants';
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
      status: editingHackathon.status || STATUS_OPTIONS[0].value,
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
      status: STATUS_OPTIONS[0].value,
      color: '',
      emoji: '',
    };
  }

  const now = new Date();
  const isCurrentMonth =
    initialYear === now.getFullYear() && initialMonth === now.getMonth();
  const dayPadded = String(isCurrentMonth ? now.getDate() : 1).padStart(2, '0');
  const monthPadded = String(initialMonth + 1).padStart(2, '0');
  const defaultStart = `${initialYear}-${monthPadded}-${dayPadded}`;
  const defaultEnd = addDaysToDateString(defaultStart, avgDays - 1);

  return {
    name: '',
    url: '',
    startDate: defaultStart,
    endDate: defaultEnd,
    deadline: '',
    status: STATUS_OPTIONS[0].value,
    color: '',
    emoji: '',
  };
};

const validateAndFormatUrl = (rawUrl) => {
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

const findOverloadedDay = (startDate, endDate, hackathons = [], editingId = null) => {
  let current = startDate;
  while (current <= endDate) {
    const count = hackathons.filter(
      (h) => h.id !== editingId && h.startDate <= current && current <= h.endDate,
    ).length;
    if (count >= MAX_SPRINTS_PER_DAY) return current;
    current = addDaysToDateString(current, 1);
  }
  return null;
};

export const validateAndBuildLogPayload = ({
  editingHackathon,
  hackathons = [],
  name,
  url,
  deadline,
  status,
  startDate,
  endDate,
  color,
  emoji,
}) => {
  const errors = {};

  if (!name.trim()) {
    errors.name = 'Please provide a sprint title.';
  }
  if (!startDate) {
    errors.startDate = 'Please provide a start date.';
  }
  if (!endDate) {
    errors.endDate = 'Please provide an end date.';
  } else if (startDate && new Date(endDate) < new Date(startDate)) {
    errors.endDate = 'End date cannot be earlier than start date.';
  }

  if (!errors.endDate && startDate && endDate) {
    const overloadedDay = findOverloadedDay(
      startDate,
      endDate,
      hackathons,
      editingHackathon?.id,
    );
    if (overloadedDay) {
      const msg = `Max ${MAX_SPRINTS_PER_DAY} sprints per day (limit reached on ${overloadedDay}).`;
      if (overloadedDay === startDate) {
        errors.startDate = msg;
      } else if (overloadedDay === endDate) {
        errors.endDate = msg;
      } else {
        errors.startDate = msg;
        errors.endDate = msg;
      }
    }
  }

  if (deadline && startDate && new Date(deadline) < new Date(startDate)) {
    errors.deadline = 'Deadline cannot be earlier than start date.';
  } else if (deadline && endDate && new Date(deadline) < new Date(endDate)) {
    errors.deadline = 'Deadline cannot be earlier than end date.';
  }

  const { url: formattedUrl, error: urlError } = validateAndFormatUrl(url);
  if (urlError) {
    errors.url = urlError;
  }

  if (Object.keys(errors).length > 0) {
    return { errors, payload: null };
  }

  return {
    errors: null,
    payload: {
      id: editingHackathon ? editingHackathon.id : Date.now().toString(),
      name: name.trim(),
      url: formattedUrl,
      deadline,
      status,
      startDate,
      endDate,
      color,
      emoji,
    },
  };
};

export const isSameDraftPayload = (prev, next) => (
  Boolean(prev) &&
  prev.startDate === next.startDate &&
  prev.endDate === next.endDate &&
  prev.deadline === next.deadline &&
  prev.color === next.color &&
  prev.emoji === next.emoji &&
  prev.name === next.name &&
  prev.url === next.url &&
  prev.status === next.status &&
  prev.id === next.id
);