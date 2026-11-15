import { addDaysToDateString } from './calendarUtils';

const isValidDate = (d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d);

export const isDayInActiveRange = (dateRange, dateString) => {
  if (!dateRange?.start || !dateRange?.end || !dateString) return false;
  return dateString >= dateRange.start && dateString <= dateRange.end;
};

export const isDayInRangePreview = (dateRange, hoveredRangeDate, avgTurnaroundDays, dateString) => {
  if (!dateRange?.start || dateRange?.end || !dateString) return false;
  const defaultEnd = addDaysToDateString(dateRange.start, (avgTurnaroundDays || 10) - 1);
  const targetEnd = hoveredRangeDate || defaultEnd;
  const [start, end] = [dateRange.start, targetEnd].sort();
  return dateString >= start && dateString <= end;
};

export const isDayInModalRange = (modalActiveRange, dateString) => {
  if (!modalActiveRange?.startDate || !dateString || !isValidDate(modalActiveRange.startDate)) {
    return false;
  }
  const end = isValidDate(modalActiveRange.endDate)
    ? modalActiveRange.endDate
    : modalActiveRange.startDate;
  const [startD, endD] = [modalActiveRange.startDate, end].sort();
  return dateString >= startD && dateString <= endD;
};

export const isModalStart = (modalActiveRange, dateString) => (
  Boolean(modalActiveRange?.startDate && modalActiveRange.startDate === dateString)
);

export const isModalEnd = (modalActiveRange, dateString) => (
  Boolean(
    modalActiveRange?.endDate &&
    modalActiveRange.endDate === dateString &&
    modalActiveRange.endDate !== modalActiveRange.startDate,
  )
);

export const isModalDeadline = (modalActiveRange, dateString) => (
  Boolean(modalActiveRange?.deadline && modalActiveRange.deadline === dateString)
);

export const computeTooltipPosition = (cellEl, cardEl) => {
  const cellRect = cellEl.getBoundingClientRect();
  const cardRect = cardEl.getBoundingClientRect();

  const cellTop = cellRect.top - cardRect.top;
  const cellLeft = cellRect.left - cardRect.left;
  const cellCenterX = cellLeft + cellRect.width / 2;

  const tooltipWidth = Math.min(250, cardRect.width - 20);
  const maxLeft = cardRect.width - tooltipWidth - 10;
  const left = Math.max(10, Math.min(maxLeft, cellCenterX - tooltipWidth / 2));
  const arrowLeft = Math.max(12, Math.min(tooltipWidth - 12, cellCenterX - left));
  const showAbove = cellTop > cardRect.height * 0.52;

  return {
    showAbove,
    style: {
      left: `${left}px`,
      width: `${tooltipWidth}px`,
      ...(showAbove
        ? { bottom: `${cardRect.height - cellTop + 6}px` }
        : { top: `${cellTop + cellRect.height + 6}px` }),
      '--arrow-left': `${arrowLeft}px`,
    },
  };
};