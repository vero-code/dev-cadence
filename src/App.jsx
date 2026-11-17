import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CalendarGrid } from './components/CalendarGrid';
import { PipelineTable } from './components/PipelineTable';
import { LogModal } from './components/modals/LogModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { StatsModal } from './components/modals/StatsModal';
import { ConfirmModal } from './components/modals/ConfirmModal';
import { LegalModal } from './components/modals/LegalModal';
import { ContactModal } from './components/modals/ContactModal';
import { useCadenceStorage } from './hooks/useCadenceStorage';
import { filterHackathonsByMonth, buildCapacityHackathons } from './utils/hackathonFilters';
import { useLogCalendarFlow } from './hooks/useLogCalendarFlow';

export const App = () => {
  const {
    hackathons,
    settings,
    theme,
    selectTheme,
    upsertHackathon,
    removeHackathon,
    updateSettings,
    clearHackathons,
    resetAllData,
    importData,
  } = useCadenceStorage();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [legalModalTab, setLegalModalTab] = useState(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [hoveredHackathonId, setHoveredHackathonId] = useState(null);

  const {
    currentYear,
    currentMonth,
    setYearAndMonth,
    selectedDate,
    dateRange,
    prefillDates,
    isSelectingOnCalendar,
    isLogModalOpen,
    editingHackathon,
    modalDates,
    calendarPickedDate,
    handlePrevMonth,
    handleNextMonth,
    handleJumpToMonth,
    handleOpenEdit,
    handleOpenAdd,
    handleDateRangeClick,
    handleCancelDateRange,
    handleCloseLogModal,
    handlePickOnCalendar,
    handleDatesChange,
    clearSelection,
    completeSaveFlow,
    resetAllFlowState,
  } = useLogCalendarFlow(settings?.avgTurnaroundDays);

  const handleSaveHackathon = async (newOrUpdated) => {
    await upsertHackathon(newOrUpdated);
    completeSaveFlow();
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
    await removeHackathon(deleteCandidate.id);
    setDeleteCandidate(null);
  };

  const handleCancelDelete = () => setDeleteCandidate(null);
  const handleOpenSettings = () => setIsSettingsOpen(true);
  const handleCloseSettings = () => setIsSettingsOpen(false);

  const handleClearAllHackathons = async () => {
    await clearHackathons();
    clearSelection();
  };

  const handleResetAllData = async () => {
    await resetAllData();
    resetAllFlowState();
  };

  const handleResetToHome = () => {
    const now = new Date();
    handleCloseLogModal();
    setIsStatsOpen(false);
    setIsSettingsOpen(false);
    setDeleteCandidate(null);
    setLegalModalTab(null);
    setIsContactOpen(false);
    setHoveredHackathonId(null);
    setYearAndMonth(now.getFullYear(), now.getMonth());
  };

  const visibleHackathons = filterHackathonsByMonth(hackathons, currentYear, currentMonth);

  // Exclude active item so draft highlight is clean while editing
  const calendarHackathons = isLogModalOpen && editingHackathon
    ? visibleHackathons.filter((h) => h.id !== editingHackathon.id)
    : visibleHackathons;

  const capacityHackathons = React.useMemo(
    () => buildCapacityHackathons(visibleHackathons, isLogModalOpen, modalDates, editingHackathon),
    [visibleHackathons, isLogModalOpen, modalDates, editingHackathon],
  );

  return (
    <div
      className="app-container"
      data-theme={theme}
      data-font={settings?.fontPreset || 'bahnschrift'}
      data-font-size={settings?.fontSize || 'normal'}
    >
      <Header
        onOpenSettings={handleOpenSettings}
        onOpenStats={() => setIsStatsOpen((prev) => !prev)}
        isStatsOpen={isStatsOpen}
        onResetHome={handleResetToHome}
        />
      <div className="panel-content">
        {isStatsOpen ? (
          <StatsModal
            isOpen={isStatsOpen}
            onClose={() => setIsStatsOpen(false)}
            hackathons={hackathons}
            settings={settings}
            onUpdateSettings={updateSettings}
          />
        ) : (
          <>
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
              {isLogModalOpen ? (
                  <LogModal
                    key={editingHackathon?.id || 'new'}
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
          </>
        )}
        {isSettingsOpen && (
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={handleCloseSettings}
            settings={settings}
            onUpdateSettings={updateSettings}
            currentTheme={theme}
            onSelectTheme={selectTheme}
            onClearAllHackathons={handleClearAllHackathons}
            onResetAllData={handleResetAllData}
            onImportData={importData}
          />
        )}

        <ConfirmModal
          isOpen={Boolean(deleteCandidate)}
          hackathon={deleteCandidate}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />

        {legalModalTab && (
          <LegalModal
            isOpen={Boolean(legalModalTab)}
            initialTab={legalModalTab || 'privacy'}
            onClose={() => setLegalModalTab(null)}
          />
        )}

        {isContactOpen && (
          <ContactModal
            isOpen={isContactOpen}
            onClose={() => setIsContactOpen(false)}
          />
        )}
      </div>

      <Footer
        year={currentYear}
        month={currentMonth}
        hackathons={capacityHackathons}
        settings={settings}
        onOpenSettings={handleOpenSettings}
        onOpenLegal={(tab) => setLegalModalTab(tab)}
        onOpenContact={() => setIsContactOpen(true)}
      />
    </div>
  );
};
