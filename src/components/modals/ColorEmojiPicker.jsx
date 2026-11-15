import { COLOR_PALETTE, EMOJI_OPTIONS } from "../../constants";

export const ColorEmojiPicker = ({
  color,
  onChangeColor,
  emoji,
  onChangeEmoji,
}) => (
  <>
    <div className="form-row-2">
      <div className="form-group">
        <div className="label-with-hint">
          <label className="form-label">Color</label>
        </div>
        <div className="color-picker-row" role="group" aria-label="Color">
          {COLOR_PALETTE.map(({ hex, label }) => {
            const isSelected = color === hex;
            return (
              <button
                key={hex}
                type="button"
                className={`color-option ${isSelected ? "selected" : ""}`}
                style={{ backgroundColor: hex }}
                onClick={() => onChangeColor(isSelected ? "" : hex)}
                aria-label={`Color: ${label}`}
                aria-pressed={isSelected}
                title={isSelected ? `${label} (click to deselect)` : label}
              />
            );
          })}
        </div>
      </div>

      <div className="form-group">
        <div className="label-with-hint">
          <label className="form-label">Emoji</label>
        </div>
        <div className="emoji-picker-row" role="group" aria-label="Emoji">
          {EMOJI_OPTIONS.map(({ value, label }) => {
            const isSelected = emoji === value;
            return (
              <button
                key={value}
                type="button"
                className={`emoji-option ${isSelected ? "selected" : ""}`}
                onClick={() => onChangeEmoji(isSelected ? "" : value)}
                aria-label={`Emoji: ${label}`}
                aria-pressed={isSelected}
                title={isSelected ? `${label} (click to deselect)` : label}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>
    </div>
    <p className="picker-deselect-hint">Click again to remove selected color or emoji.</p>
  </>
);