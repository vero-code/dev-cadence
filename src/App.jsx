import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CapacityBar } from './components/CapacityBar';
import { CalendarGrid } from './components/CalendarGrid';
import { PipelineTable } from './components/PipelineTable';
import { LogModal } from './components/LogModal';
import { SettingsModal } from './components/SettingsModal';
import { getStoredData, saveHackathons, saveSettings } from './utils/storage';

export const App = () => {
  const [hackathons, setHackathons] = useState([]);
  const [settings, setSettings] = useState({ targetRestDays: 8, avgTurnaroundDays: 10 });
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // October (0-indexed)
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [prefillDates, setPrefillDates] = useState(null);
  const [isSelectingOnCalendar, setIsSelectingOnCalendar] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingHackathon, setEditingHackathon] = useState(null);

  useEffect(() => {
    const initData = async () => {
      const data = await getStoredData();
      setHackathons(data.hackathons);
      setSettings(data.settings);
    };
    initData();
  }, []);

  const handlePrevMonth = () => {
    setSelectedDate(null);
    setDateRange({ start: null, end: null });
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    setSelectedDate(null);
    setDateRange({ start: null, end: null });
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
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

  const handleDeleteHackathon = async (id) => {
    const updated = hackathons.filter((h) => h.id !== id);
    setHackathons(updated);
    await saveHackathons(updated);
  };

  const handleSaveSettings = async (newSettings) => {
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const handleOpenEdit = (hackathon) => {
    setEditingHackathon(hackathon);
    setPrefillDates(null);
    setIsLogModalOpen(true);
  };

  const handleOpenAdd = (targetDate = null) => {
    if (typeof targetDate === 'string' && targetDate) {
      setPrefillDates({ startDate: targetDate, endDate: targetDate, deadline: targetDate });
    } else if (dateRange.start) {
      const end = dateRange.end || dateRange.start;
      setPrefillDates({ startDate: dateRange.start, endDate: end, deadline: end });
    } else {
      setPrefillDates(null);
    }
    setEditingHackathon(null);
    setIsSelectingOnCalendar(false);
    setIsLogModalOpen(true);
  };

  const handleDateRangeClick = (dateString) => {
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
  };

  const handlePickOnCalendar = () => {
    setIsLogModalOpen(false);
    setIsSelectingOnCalendar(true);
    setDateRange({ start: null, end: null });
  };

  // Filter hackathons relevant to the current displayed month
  const monthPadded = String(currentMonth + 1).padStart(2, '0');
  const monthPrefix = `${currentYear}-${monthPadded}`;
  const visibleHackathons = hackathons.filter((h) => {
    return (
      (h.startDate && h.startDate.startsWith(monthPrefix)) ||
      (h.endDate && h.endDate.startsWith(monthPrefix)) ||
      (h.deadline && h.deadline.startsWith(monthPrefix))
    );
  });

  // Filter by selected day if user clicked a calendar cell
  const tableHackathons = selectedDate
    ? visibleHackathons.filter((h) => {
        const target = new Date(selectedDate);
        return target >= new Date(h.startDate) && target <= new Date(h.endDate);
      })
    : visibleHackathons;

  return (
    <div className="app-container">
      <div className="panel-content">
        <Header
          currentYear={currentYear}
          currentMonth={currentMonth}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        

        <CalendarGrid
          year={currentYear}
          month={currentMonth}
          hackathons={visibleHackathons}
          selectedDate={selectedDate}
          dateRange={dateRange}
          onDateRangeClick={handleDateRangeClick}
          onCancelDateRange={handleCancelDateRange}
          isSelectingOnCalendar={isSelectingOnCalendar}
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
                onPickOnCalendar={handlePickOnCalendar}
              />
            </div>
          )}

          <div className="action-bar">
            <h2 className="section-heading">
              <span>📋</span> Pipeline Tracker
              {selectedDate && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--cyan-light)',
                    fontWeight: 500,
                    cursor: 'pointer',
                    marginLeft: '0.5rem',
                    background: 'rgba(6, 182, 212, 0.15)',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    border: '1px solid rgba(6, 182, 212, 0.3)'
                  }}
                  onClick={() => setSelectedDate(null)}
                  title="Click to clear day filter"
                >
                  Filtered: {selectedDate} ✕
                </span>
              )}
            </h2>
            <button type="button" className="btn-primary" onClick={handleOpenAdd}>
              <span>+</span> Log Hackathon
            </button>
          </div>

          <PipelineTable
            hackathons={tableHackathons}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteHackathon}
            onAddNew={handleOpenAdd}
          />

          <CapacityBar
            year={currentYear}
            month={currentMonth}
            hackathons={visibleHackathons}
            settings={settings}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        </div>

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onSaveSettings={handleSaveSettings}
        />
      </div>
    </div>
  );
};

