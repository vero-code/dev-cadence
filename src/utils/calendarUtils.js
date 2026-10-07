// Calendar calculations, day-grid generation, and date collision detection

/**
 * Returns the number of days in a given month (0-indexed: 0 = Jan, 11 = Dec)
 */
export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * Returns the day of the week for the 1st of the month (0 = Sun, 1 = Mon, ..., 6 = Sat)
 * Normalized to Monday-first: 0 = Mon, 1 = Tue, ..., 6 = Sun
 */
export const getFirstDayOfWeek = (year, month) => {
  const day = new Date(year, month, 1).getDay();
  // Convert Sunday (0) to 6, Monday (1) to 0, etc.
  return (day + 6) % 7;
};

/**
 * Generates the full calendar matrix for a month (including padding days)
 */
export const generateCalendarDays = (year, month, hackathons = []) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const days = [];

  // Pad previous month days
  for (let i = 0; i < firstDay; i++) {
    days.push({
      dayNumber: null,
      isPadding: true,
      dateString: null,
      events: [],
      deadlines: [],
      isOverlap: false,
    });
  }

  const monthPadded = String(month + 1).padStart(2, '0');

  const now = new Date();
  const todayString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // Populate month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dayPadded = String(d).padStart(2, '0');
    const dateString = `${year}-${monthPadded}-${dayPadded}`;
    const targetDate = new Date(dateString);

    // Find hackathons active on this day (targetDate >= startDate and targetDate <= endDate)
    const activeEvents = hackathons.filter((h) => {
      if (!h.startDate || !h.endDate) return false;
      const start = new Date(h.startDate);
      const end = new Date(h.endDate);
      return targetDate >= start && targetDate <= end;
    });

    // Find deadlines on this day
    const deadlines = hackathons.filter((h) => h.deadline === dateString);

    days.push({
      dayNumber: d,
      isPadding: false,
      dateString,
      events: activeEvents,
      deadlines,
      isOverlap: false,
      isToday: dateString === todayString,
    });
  }

  return days;
};

/**
 * Computes split-cell gradient styling for multi-event days
 */
export const getDayCellBackground = (events) => {
  if (!events || events.length === 0) return 'rgba(255, 255, 255, 0.03)';

  const coloredEvents = events.filter((e) => Boolean(e.color));
  if (coloredEvents.length === 0) {
    return 'rgba(255, 255, 255, 0.03)';
  }

  if (coloredEvents.length === 1) {
    const c = coloredEvents[0].color;
    return `${c}33`; // 20% opacity
  }

  // 2 events: diagonal split
  if (coloredEvents.length === 2) {
    const c1 = coloredEvents[0].color;
    const c2 = coloredEvents[1].color;
    return `linear-gradient(135deg, ${c1}66 50%, ${c2}66 50%)`;
  }

  // 3+ events: multi-stop split
  const colors = coloredEvents.map((e) => e.color);
  const step = 100 / colors.length;
  const stops = colors.map((col, idx) => {
    return `${col}66 ${idx * step}%, ${col}66 ${(idx + 1) * step}%`;
  }).join(', ');

  return `linear-gradient(135deg, ${stops})`;
};
