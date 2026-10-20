// Cadence Analytics & Statistics Utility
// Computes empirical duration statistics based strictly on elapsed past days (< today)

import { MONTH_NAMES } from '../constants';
import { getDaysInMonth } from './calendarUtils';

/**
 * Returns today's ISO date string 'YYYY-MM-DD' based on local system time
 */
export const getTodayDateString = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Returns an array of date strings between startDate and endDate inclusive
 */
export const getDateRangeArray = (startIso, endIso) => {
  if (!startIso || !endIso) return [];
  const dates = [];
  let curr = new Date(startIso + 'T00:00:00');
  const end = new Date(endIso + 'T00:00:00');
  while (curr <= end) {
    const y = curr.getFullYear();
    const m = String(curr.getMonth() + 1).padStart(2, '0');
    const d = String(curr.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${d}`);
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
};

/**
 * Calculates Cadence Statistics across all hackathons and grouped by month
 * Following the rule: strictly include dates < today (excluding today and future)
 */
export const calculateCadenceStats = (hackathons = [], referenceDate = getTodayDateString()) => {
  const todayStr = referenceDate;
  const now = new Date(todayStr + 'T00:00:00');
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  // 1. Process each hackathon for past elapsed days
  const pastHackathonEntries = [];
  const allUniquePastWorkDaysSet = new Set();

  (hackathons || []).forEach((h) => {
    if (!h.startDate || !h.endDate) return;
    // If entire hackathon starts on or after today, it's future work -> skip for past stats
    if (h.startDate >= todayStr) return;

    // Dates active strictly in the past (< today)
    const allDates = getDateRangeArray(h.startDate, h.endDate);
    const pastDates = allDates.filter((d) => d < todayStr);

    if (pastDates.length > 0) {
      pastDates.forEach((d) => allUniquePastWorkDaysSet.add(d));

      const isCompleted = h.endDate < todayStr;
      pastHackathonEntries.push({
        ...h,
        pastDaysCount: pastDates.length,
        totalPlannedDays: allDates.length,
        pastDates,
        isCompleted,
      });
    }
  });

  // Overall metrics
  const totalPastHackathonsCount = pastHackathonEntries.length;
  const totalPastWorkDaysSum = pastHackathonEntries.reduce((acc, h) => acc + h.pastDaysCount, 0);
  const totalUniqueCalendarDays = allUniquePastWorkDaysSet.size;

  const overallAvgDaysPerHackathon = totalPastHackathonsCount > 0
    ? Number((totalPastWorkDaysSum / totalPastHackathonsCount).toFixed(1))
    : 0;

  // Completed-only average (for hackathons fully finished in the past)
  const completedEntries = pastHackathonEntries.filter((h) => h.isCompleted);
  const completedAvgDays = completedEntries.length > 0
    ? Number((completedEntries.reduce((acc, h) => acc + h.pastDaysCount, 0) / completedEntries.length).toFixed(1))
    : 0;

  // Shortest hackathon (minimum days spent on a hackathon)
  let shortestHackathon = null;
  let minDaysSpent = 0;

  if (pastHackathonEntries.length > 0) {
    // Prefer completed hackathons for definitive duration; if none completed yet, use active past
    const pool = completedEntries.length > 0 ? completedEntries : pastHackathonEntries;
    shortestHackathon = pool.reduce((min, curr) => {
      if (!min) return curr;
      return curr.pastDaysCount < min.pastDaysCount ? curr : min;
    }, null);

    if (shortestHackathon) {
      minDaysSpent = shortestHackathon.pastDaysCount;
    }
  }

  // 2. Group statistics by Month (YYYY-MM)
  // Discover all months that have past hackathon days
  const monthMap = new Map();

  allUniquePastWorkDaysSet.forEach((dateStr) => {
    const monthKey = dateStr.slice(0, 7); // 'YYYY-MM'
    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, {
        monthKey,
        uniqueDaysSet: new Set(),
        hackathonsSet: new Set(),
        hackathonDaysMap: new Map(), // hackathonId -> count of past days in this month
      });
    }
    monthMap.get(monthKey).uniqueDaysSet.add(dateStr);
  });

  // Also account for hackathons spanning months
  pastHackathonEntries.forEach((h) => {
    h.pastDates.forEach((dateStr) => {
      const monthKey = dateStr.slice(0, 7);
      if (monthMap.has(monthKey)) {
        const mObj = monthMap.get(monthKey);
        mObj.hackathonsSet.add(h.id);
        const prevCount = mObj.hackathonDaysMap.get(h.id) || 0;
        mObj.hackathonDaysMap.set(h.id, prevCount + 1);
      }
    });
  });

  // Format monthly breakdown sorted descending (newest first)
  const sortedMonthKeys = Array.from(monthMap.keys()).sort().reverse();
  const monthlyBreakdown = sortedMonthKeys.map((mKey) => {
    const [yStr, mStr] = mKey.split('-');
    const year = parseInt(yStr, 10);
    const monthIndex = parseInt(mStr, 10) - 1;
    const mObj = monthMap.get(mKey);

    const uniqueWorkDays = mObj.uniqueDaysSet.size;
    const hackathonCount = mObj.hackathonsSet.size;

    // Total days logged for all hackathons in this month
    let totalHackathonDaysInMonth = 0;
    mObj.hackathonDaysMap.forEach((days) => {
      totalHackathonDaysInMonth += days;
    });

    const avgDaysPerHackathon = hackathonCount > 0
      ? Number((totalHackathonDaysInMonth / hackathonCount).toFixed(1))
      : 0;

    const isCurrentMonth = year === currentYear && monthIndex === currentMonth;
    const daysInThisMonth = new Date(year, monthIndex + 1, 0).getDate();

    // Elapsed days in month (if current month, up to yesterday; if past month, all days in month)
    const elapsedDaysInMonth = isCurrentMonth
      ? Math.max(0, now.getDate() - 1)
      : daysInThisMonth;

    const monthName = MONTH_NAMES[monthIndex] || mKey;

    return {
      monthKey: mKey,
      year,
      monthIndex,
      monthName,
      displayName: `${monthName} ${year}`,
      isCurrentMonth,
      uniqueWorkDays,
      hackathonCount,
      totalHackathonDaysInMonth,
      avgDaysPerHackathon,
      elapsedDaysInMonth,
      totalDaysInMonth: daysInThisMonth,
      // Cadence load percentage in this month so far
      cadenceLoadPercent: elapsedDaysInMonth > 0
        ? Math.min(100, Math.round((uniqueWorkDays / elapsedDaysInMonth) * 100))
        : 0,
    };
  });

  // Current month specific stats (for quick glance)
  const currentMonthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  const currentMonthStats = monthlyBreakdown.find((m) => m.monthKey === currentMonthKey) || {
    monthKey: currentMonthKey,
    year: currentYear,
    monthIndex: currentMonth,
    monthName: MONTH_NAMES[currentMonth] || 'This Month',
    displayName: `${MONTH_NAMES[currentMonth]} ${currentYear}`,
    isCurrentMonth: true,
    uniqueWorkDays: 0,
    hackathonCount: 0,
    totalHackathonDaysInMonth: 0,
    avgDaysPerHackathon: 0,
    elapsedDaysInMonth: Math.max(0, now.getDate() - 1),
    totalDaysInMonth: new Date(currentYear, currentMonth + 1, 0).getDate(),
    cadenceLoadPercent: 0,
  };

  return {
    todayStr,
    currentDayNumber: now.getDate(),
    totalPastHackathonsCount,
    totalPastWorkDaysSum,
    totalUniqueCalendarDays,
    overallAvgDaysPerHackathon,
    completedAvgDays,
    minDaysSpent,
    shortestHackathon: shortestHackathon
      ? {
          id: shortestHackathon.id,
          name: shortestHackathon.name,
          emoji: shortestHackathon.emoji,
          days: minDaysSpent,
          isCompleted: shortestHackathon.isCompleted,
        }
      : null,
    completedCount: completedEntries.length,
    inProgressCount: totalPastHackathonsCount - completedEntries.length,
    currentMonthStats,
    monthlyBreakdown,
    pastHackathonEntries,
  };
};
