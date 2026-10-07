import React, { useEffect } from 'react';

export const ConfirmModal = ({
  isOpen,
  title = 'Delete Hackathon?',
  message = 'Are you sure you want to remove this hackathon?',
  hackathon,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card confirm-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title confirm-modal-title">
            <span>🗑️</span> {title}
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onCancel}
            aria-label="Close dialog"
          >
            &times;
          </button>
        </div>

        <div className="confirm-modal-body">
          <p className="confirm-modal-desc">{message}</p>

          {hackathon && (
            <div className="confirm-item-preview">
              <div className="confirm-item-header">
                {hackathon.color && (
                  <span
                    className="color-dot"
                    style={{ backgroundColor: hackathon.color }}
                  />
                )}
                <span className="confirm-item-name">
                  {hackathon.emoji ? `${hackathon.emoji} ` : ''}
                  {hackathon.name}
                </span>
              </div>
              <div className="confirm-item-details">
                {hackathon.deadline && (
                  <span className="confirm-item-meta">
                    🏁 Deadline: <strong>{hackathon.deadline}</strong>
                  </span>
                )}
                {hackathon.status && (
                  <span className="confirm-item-status">
                    {hackathon.status}
                  </span>
                )}
              </div>
            </div>
          )}

          <p className="confirm-warning-note">
            ⚠️ This action cannot be undone.
          </p>
        </div>

        <div className="modal-footer" style={{ marginTop: '1.25rem' }}>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={onConfirm}
            autoFocus
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
