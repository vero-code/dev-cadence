import React from 'react';

export const ModalFooter = ({
  onClose,
  closeLabel = 'Close',
  showAutoSaved = false,
  leftContent = null,
}) => {
  return (
    <div
      className="modal-footer"
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
    >
      <div>
        {showAutoSaved ? (
          <span
            style={{
              fontSize: '0.74rem',
              color: 'var(--text-dim)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span style={{ color: 'var(--emerald)', fontSize: '0.65rem' }}>●</span> Auto-saved
          </span>
        ) : (
          leftContent
        )}
      </div>
      <button
        type="button"
        className="btn-primary"
        onClick={onClose}
        style={{ minWidth: '90px', justifyContent: 'center' }}
      >
        {closeLabel}
      </button>
    </div>
  );
};