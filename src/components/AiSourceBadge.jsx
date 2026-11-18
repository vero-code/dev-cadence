/**
 * Badge displaying whether AI inference ran on-device or in cloud fallback
 */
export const AiSourceBadge = ({ source }) => {
  if (!source) return null;

  const isOnDevice = source === 'on_device' || source === 'ON_DEVICE';
  const label = isOnDevice ? 'On-Device' : 'Cloud';

  return (
    <span className={`ai-source-badge ${isOnDevice ? 'on-device' : 'in-cloud'}`}>
      {label}
    </span>
  );
};