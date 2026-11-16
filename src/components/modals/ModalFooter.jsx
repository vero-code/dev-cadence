export const ModalFooter = ({
  showAutoSaved = false,
  leftContent = null,
}) => {
  return (
    <div className="modal-footer modal-footer-row">
      {showAutoSaved ? (
        <>
          <span className="modal-autosaved">
            <span className="modal-autosaved-dot">●</span> Auto-saved
          </span>
          <span className="modal-footer-hint" title="Release: October 20, 2026">
            v0.2.0
          </span>
        </>
      ) : (
        <div>{leftContent}</div>
      )}
    </div>
  );
};