export const ModalFooter = ({
  showAutoSaved = false,
  leftContent = null,
}) => {
  return (
    <div className="modal-footer modal-footer-row">
      <div>
        {showAutoSaved ? (
          <span className="modal-autosaved">
            <span className="modal-autosaved-dot">●</span> Auto-saved
          </span>
        ) : (
          leftContent
        )}
      </div>
    </div>
  );
};