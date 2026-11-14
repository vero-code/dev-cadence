export const filterHackathonsByMonth = (hackathons, year, month) => {
  const monthPadded = String(month + 1).padStart(2, '0');
  const monthPrefix = `${year}-${monthPadded}`;
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0, 23, 59, 59);

  return hackathons.filter((h) => {
    if (!h.startDate || !h.endDate) {
      return (
        (h.startDate && h.startDate.startsWith(monthPrefix)) ||
        (h.endDate && h.endDate.startsWith(monthPrefix)) ||
        (h.deadline && h.deadline.startsWith(monthPrefix))
      );
    }

    const start = new Date(h.startDate);
    const end = new Date(h.endDate);
    const spansMonth = start <= monthEnd && end >= monthStart;
    const deadlineInMonth = Boolean(h.deadline && h.deadline.startsWith(monthPrefix));
    return spansMonth || deadlineInMonth;
  });
};

export const buildCapacityHackathons = (
  visibleHackathons,
  isLogModalOpen,
  modalDates,
  editingHackathon,
) => {
  if (!isLogModalOpen || !modalDates?.startDate || !modalDates?.endDate) {
    return visibleHackathons;
  }

  const draftItem = {
    id: editingHackathon ? editingHackathon.id : '__draft__',
    startDate: modalDates.startDate,
    endDate: modalDates.endDate,
    deadline: modalDates.deadline,
  };

  if (editingHackathon) {
    return visibleHackathons.map((h) =>
      h.id === editingHackathon.id ? { ...h, ...draftItem } : h,
    );
  }

  return [...visibleHackathons, draftItem];
};