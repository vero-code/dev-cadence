import { COLOR_PALETTE, EMOJI_OPTIONS } from "../../constants";

export const ColorEmojiPicker = ({
  color,
  onChangeColor,
  emoji,
  onChangeEmoji,
}) => (
  <>
    <div className="form-group">
      <div className="label-with-hint">
        <label className="form-label">Color</label>
        <span className="field-hint">optional</span>
      </div>
      <div className="color-picker-row">
        {COLOR_PALETTE.map((c) => (
          <div
            key={c}
            className={`color-option ${color === c ? "selected" : ""}`}
            style={{ backgroundColor: c }}
            onClick={() => onChangeColor(color === c ? "" : c)}
            title={color === c ? "Click to deselect" : "Select color"}
          />
        ))}
      </div>
    </div>

    <div className="form-group">
      <div className="label-with-hint">
        <label className="form-label">Emoji</label>
        <span className="field-hint">optional</span>
      </div>
      <div className="emoji-picker-row">
        {EMOJI_OPTIONS.map((emo) => (
          <button
            key={emo}
            type="button"
            className={`emoji-option ${emoji === emo ? "selected" : ""}`}
            onClick={() => onChangeEmoji(emoji === emo ? "" : emo)}
            title={emoji === emo ? "Click to deselect" : emo}
          >
            {emo}
          </button>
        ))}
      </div>
    </div>
  </>
);
