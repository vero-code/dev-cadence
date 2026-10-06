import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PipelineTable } from './components/PipelineTable';
import { LogModal } from './components/LogModal';
import { getStoredData, saveHackathons, saveSettings } from './utils/storage';

export const App = () => {
  const [hackathons, setHackathons] = useState([]);
  const [settings, setSettings] = useState({ targetRestDays: 8, avgTurnaroundDays: 10 });
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // October (0-indexed)
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
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
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
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
  };

  const handleDeleteHackathon = async (id) => {
    const updated = hackathons.filter((h) => h.id !== id);
    setHackathons(updated);
    await saveHackathons(updated);
  };

  const handleOpenEdit = (hackathon) => {
    setEditingHackathon(hackathon);
    setIsLogModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingHackathon(null);
    setIsLogModalOpen(true);
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

  return (
    <div className="app-container">
      <div className="panel-content">
        <Header
          currentYear={currentYear}
          currentMonth={currentMonth}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onOpenSettings={() => alert(`Capacity Settings:\nMinimum target rest days: ${settings.targetRestDays} days\nAverage project turnaround: ${settings.avgTurnaroundDays} days\n(Full settings dialog implemented in Slice 3)`)}
        />

        <div className="action-bar">
          <h2 className="section-heading">
            <span>📋</span> Pipeline Tracker
          </h2>
          <button type="button" className="btn-primary" onClick={handleOpenAdd}>
            <span>+</span> Log Hackathon
          </button>
        </div>

        <PipelineTable
          hackathons={visibleHackathons}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteHackathon}
          onAddNew={handleOpenAdd}
        />

        <LogModal
          isOpen={isLogModalOpen}
          onClose={() => {
            setIsLogModalOpen(false);
            setEditingHackathon(null);
          }}
          onSave={handleSaveHackathon}
          editingHackathon={editingHackathon}
          initialYear={currentYear}
          initialMonth={currentMonth}
        />
      </div>
    </div>
  );
};
