import { APP_VERSION, APP_RELEASE_DATE } from '../../constants';

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
          <span className="modal-footer-hint" title={`Release: ${APP_RELEASE_DATE}`}>
            {APP_VERSION}
          </span>
        </>
      ) : (
        <div>{leftContent}</div>
      )}
    </div>
  );
};