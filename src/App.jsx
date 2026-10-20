import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CalendarGrid } from './components/CalendarGrid';
import { PipelineTable } from './components/PipelineTable';
import { LogModal } from './components/LogModal';
import { SettingsModal } from './components/SettingsModal';
import { StatsModal } from './components/StatsModal';
import { ConfirmModal } from './components/ConfirmModal';
import { LegalModal } from './components/LegalModal';
import { getStoredData, saveHackathons, saveSettings, saveTheme, clearAllHackathons, clearAllData } from './utils/storage';
import { addDaysToDateString } from './utils/calendarUtils';
import { useMonthNavigation } from './hooks/useMonthNavigation';

export const App = () => {
  const [hackathons, setHackathons] = useState([]);
  const [settings, setSettings] = useState({ targetRestDays: 8, avgTurnaroundDays: 10, fontPreset: 'bahnschrift', fontSize: 'normal' });
  const [theme, setTheme] = useState('steampunk');
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [prefillDates, setPrefillDates] = useState(null);
  const [isSelectingOnCalendar, setIsSelectingOnCalendar] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [editingHackathon, setEditingHackathon] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [modalDates, setModalDates] = useState(null);
  const [calendarPickedDate, setCalendarPickedDate] = useState(null);
  const [legalModalTab, setLegalModalTab] = useState(null);
  const [hoveredHackathonId, setHoveredHackathonId] = useState(null);

  const {
    currentYear,
    currentMonth,
    setCurrentYear,
    setCurrentMonth,
    handlePrevMonth,
    handleNextMonth,
    handleJumpToMonth,
  } = useMonthNavigation(2026, 9, () => {
    setSelectedDate(null);
    setDateRange({ start: null, end: null });
  });

  useEffect(() => {
    const initData = async () => {
      const data = await getStoredData();
      setHackathons(data.hackathons);
      setSettings(data.settings);
      setTheme(data.theme || 'steampunk');
      document.documentElement.setAttribute('data-font', data.settings?.fontPreset || 'bahnschrift');
      document.documentElement.setAttribute('data-font-size', data.settings?.fontSize || 'normal');
    };
    initData();
  }, []);

  const handleSelectTheme = async (newTheme) => {
    setTheme(newTheme);
    await saveTheme(newTheme);
  };

  const handleSaveHackathon = async (newOrUpdated) => {
    let updated;
    const exists = hackathons.some((h) => h.id === newOrUpdated.id);
    if (exists) {
      updated = hackathons.map((h) => (h.id === newOrUpdated.id ? newOrUpdated : h));
    } else {
      updated = [...hackathons, newOrUpdated];
    }
    setHackathons(updated);
    await saveHackathons(updated);
    setEditingHackathon(null);
    setPrefillDates(null);
    setDateRange({ start: null, end: null });
  };

  const handleRequestDelete = (hackathonOrId) => {
    if (typeof hackathonOrId === 'object' && hackathonOrId !== null) {
      setDeleteCandidate(hackathonOrId);
    } else {
      const found = hackathons.find((h) => h.id === hackathonOrId);
      setDeleteCandidate(found || { id: hackathonOrId, name: 'this hackathon' });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    const id = deleteCandidate.id;
    const updated = hackathons.filter((h) => h.id !== id);
    setHackathons(updated);
    await saveHackathons(updated);
    setDeleteCandidate(null);
  };

  const handleCancelDelete = () => {
    setDeleteCandidate(null);
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  const handleUpdateSettings = async (partialSettings) => {
    const updated = { ...settings, ...partialSettings };
    setSettings(updated);
    await saveSettings(updated);
    if (partialSettings.fontPreset) {
      document.documentElement.setAttribute('data-font', partialSettings.fontPreset);
    }
    if (partialSettings.fontSize) {
      document.documentElement.setAttribute('data-font-size', partialSettings.fontSize);
    }
  };

  const handleClearAllHackathons = async () => {
    setHackathons([]);
    await clearAllHackathons();
    setSelectedDate(null);
    setDateRange({ start: null, end: null });
    setPrefillDates(null);
  };

  const handleResetAllData = async () => {
    await clearAllData();
    setHackathons([]);
    const defaultSet = { targetRestDays: 8, avgTurnaroundDays: 10, fontPreset: 'bahnschrift', fontSize: 'normal' };
    setSettings(defaultSet);
    setTheme('steampunk');
    document.documentElement.setAttribute('data-font', 'bahnschrift');
    document.documentElement.setAttribute('data-font-size', 'normal');
    setSelectedDate(null);
    setDateRange({ start: null, end: null });
    setPrefillDates(null);
    setEditingHackathon(null);
  };

  const handleOpenEdit = (hackathon) => {
    setEditingHackathon(hackathon);
    setPrefillDates(null);
    setIsLogModalOpen(true);
  };

  const handleOpenAdd = (targetDate = null) => {
    const avgDays = Number(settings?.avgTurnaroundDays) || 10;
    if (typeof targetDate === 'string' && targetDate) {
      const end = addDaysToDateString(targetDate, avgDays - 1);
      setPrefillDates({ startDate: targetDate, endDate: end, deadline: end });
    } else if (dateRange.start) {
      const end = dateRange.end || addDaysToDateString(dateRange.start, avgDays - 1);
      setPrefillDates({ startDate: dateRange.start, endDate: end, deadline: end });
    } else {
      const monthPadded = String(currentMonth + 1).padStart(2, '0');
      const start = `${currentYear}-${monthPadded}-05`;
      const end = addDaysToDateString(start, avgDays - 1);
      setPrefillDates({ startDate: start, endDate: end, deadline: end });
    }
    setEditingHackathon(null);
    setIsSelectingOnCalendar(false);
    setIsLogModalOpen(true);
  };

  const handleDateRangeClick = (dateString) => {
    // When creation/edit form is open, clicking any calendar cell immediately updates the form's dates
    if (isLogModalOpen) {
      setCalendarPickedDate({ date: dateString, timestamp: Date.now() });
      return;
    }

    if (!dateRange.start) {
      // First click: select start date
      setDateRange({ start: dateString, end: null });
      setSelectedDate(dateString);
    } else if (dateRange.start && !dateRange.end) {
      // Second click: complete range and open modal
      const [start, end] = [dateRange.start, dateString].sort();
      setDateRange({ start, end });
      setSelectedDate(null);
      setPrefillDates({ startDate: start, endDate: end, deadline: end });
      setEditingHackathon(null);
      setIsSelectingOnCalendar(false);
      setIsLogModalOpen(true);
    } else {
      // Reset and select fresh start date
      setDateRange({ start: dateString, end: null });
      setSelectedDate(dateString);
    }
  };

  const handleCancelDateRange = () => {
    setDateRange({ start: null, end: null });
    setSelectedDate(null);
    if (isSelectingOnCalendar) {
      setIsSelectingOnCalendar(false);
      setIsLogModalOpen(true);
    }
  };

  const handleCloseLogModal = () => {
    setIsLogModalOpen(false);
    setEditingHackathon(null);
    setPrefillDates(null);
    setDateRange({ start: null, end: null });
    setIsSelectingOnCalendar(false);
    setModalDates(null);
    setCalendarPickedDate(null);
  };

  const handlePickOnCalendar = () => {
    setIsLogModalOpen(false);
    setIsSelectingOnCalendar(true);
    setDateRange({ start: null, end: null });
  };

  // When user edits dates in the form, automatically navigate calendar to that month if needed
  const handleDatesChange = useCallback((dates) => {
    setModalDates((prev) => {
      if (
        prev &&
        prev.startDate === dates?.startDate &&
        prev.endDate === dates?.endDate &&
        prev.deadline === dates?.deadline &&
        prev.color === dates?.color &&
        prev.emoji === dates?.emoji &&
        prev.name === dates?.name &&
        prev.status === dates?.status &&
        prev.id === dates?.id
      ) {
        return prev;
      }
      return dates;
    });

    if (dates?.startDate && /^\d{4}-\d{2}-\d{2}$/.test(dates.startDate)) {
      handleJumpToMonth(dates.startDate);
    }
  }, [handleJumpToMonth]);

  // Only display hackathons that belong to or span across the active month
  const monthPadded = String(currentMonth + 1).padStart(2, '0');
  const monthPrefix = `${currentYear}-${monthPadded}`;
  const visibleHackathons = hackathons.filter((h) => {
    if (!h.startDate || !h.endDate) {
      return (h.startDate && h.startDate.startsWith(monthPrefix)) ||
             (h.endDate && h.endDate.startsWith(monthPrefix)) ||
             (h.deadline && h.deadline.startsWith(monthPrefix));
    }
    const start = new Date(h.startDate);
    const end = new Date(h.endDate);
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

    const spansMonth = start <= monthEnd && end >= monthStart;
    const deadlineInMonth = Boolean(h.deadline && h.deadline.startsWith(monthPrefix));
    return spansMonth || deadlineInMonth;
  });

  // If a hackathon is currently being edited, exclude its old static state so the draft highlight is pristine
  const calendarHackathons = isLogModalOpen && editingHackathon
    ? visibleHackathons.filter((h) => h.id !== editingHackathon.id)
    : visibleHackathons;

  // Live capacity calculation including the active draft hackathon
  const capacityHackathons = React.useMemo(() => {
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
      return visibleHackathons.map((h) => (h.id === editingHackathon.id ? { ...h, ...draftItem } : h));
    }
    return [...visibleHackathons, draftItem];
  }, [visibleHackathons, isLogModalOpen, modalDates, editingHackathon]);

  return (
    <div
      className="app-container"
      data-theme={theme}
      data-font={settings?.fontPreset || 'bahnschrift'}
      data-font-size={settings?.fontSize || 'normal'}
    >
      <div className="panel-content">
        <Header
          onOpenSettings={handleOpenSettings}
          onOpenStats={() => setIsStatsOpen((prev) => !prev)}
          isStatsOpen={isStatsOpen}
        />

        <CalendarGrid
          year={currentYear}
          month={currentMonth}
          hackathons={calendarHackathons}
          selectedDate={selectedDate}
          dateRange={dateRange}
          modalActiveRange={isLogModalOpen ? modalDates || prefillDates || (editingHackathon ? { ...editingHackathon, startDate: editingHackathon.startDate, endDate: editingHackathon.endDate } : null) : null}
          avgTurnaroundDays={settings?.avgTurnaroundDays || 10}
          onDateRangeClick={handleDateRangeClick}
          onCancelDateRange={handleCancelDateRange}
          onCancelModalRange={handleCloseLogModal}
          onOpenAdd={handleOpenAdd}
          isSelectingOnCalendar={isSelectingOnCalendar}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onEdit={handleOpenEdit}
          onJumpToMonth={handleJumpToMonth}
          hoveredHackathonId={settings?.highlightOnHover !== false ? hoveredHackathonId : null}
        />

        <div className="lower-content-section">
          {isLogModalOpen && (
            <div className="lower-popover-backdrop" onClick={handleCloseLogModal}>
              <LogModal
                isOpen={isLogModalOpen}
                onClose={handleCloseLogModal}
                onSave={handleSaveHackathon}
                editingHackathon={editingHackathon}
                initialYear={currentYear}
                initialMonth={currentMonth}
                prefillDates={prefillDates}
                avgTurnaroundDays={settings?.avgTurnaroundDays || 10}
                onPickOnCalendar={handlePickOnCalendar}
                onDatesChange={handleDatesChange}
                calendarPickedDate={calendarPickedDate}
              />
            </div>
          )}

          {isStatsOpen ? (
            <StatsModal
              isOpen={isStatsOpen}
              onClose={() => setIsStatsOpen(false)}
              hackathons={hackathons}
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
            />
          ) : (
            <PipelineTable
              hackathons={visibleHackathons}
              onEdit={handleOpenEdit}
              onDelete={handleRequestDelete}
              onAddNew={handleOpenAdd}
              year={currentYear}
              month={currentMonth}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              hoveredHackathonId={hoveredHackathonId}
              onHoverHackathon={setHoveredHackathonId}
            />
          )}
        </div>

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={handleCloseSettings}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          currentTheme={theme}
          onSelectTheme={handleSelectTheme}
          onClearAllHackathons={handleClearAllHackathons}
          onResetAllData={handleResetAllData}
        />

        <ConfirmModal
          isOpen={Boolean(deleteCandidate)}
          hackathon={deleteCandidate}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />

        <LegalModal
          isOpen={Boolean(legalModalTab)}
          initialTab={legalModalTab || 'privacy'}
          onClose={() => setLegalModalTab(null)}
        />
      </div>

      <Footer
        year={currentYear}
        month={currentMonth}
        hackathons={capacityHackathons}
        settings={settings}
        onOpenSettings={handleOpenSettings}
        onOpenLegal={(tab) => setLegalModalTab(tab)}
      />
    </div>
  );
};

