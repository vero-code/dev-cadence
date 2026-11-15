export const PipelineActionMenu = ({
  isOpen,
  openUpward,
  onToggle,
  onEdit,
  onDelete,
}) => (
  <div className="pipeline-menu-container">
    <button
      type="button"
      className="kebab-btn"
      title="Actions"
      aria-label="Actions menu"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      &#x22EE;
    </button>
    {isOpen && (
      <div
        className={`pipeline-dropdown-menu ${openUpward ? 'dropdown-upward' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="pipeline-menu-item"
          onClick={onEdit}
        >
          <span className="menu-item-icon">✏️</span>
          <span>Edit</span>
        </button>
        <button
          type="button"
          className="pipeline-menu-item delete-item"
          onClick={onDelete}
        >
          <span className="menu-item-icon">🗑️</span>
          <span>Delete</span>
        </button>
      </div>
    )}
  </div>
);