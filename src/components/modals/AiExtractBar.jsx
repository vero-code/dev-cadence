import { useState } from 'react';
import { extractSprintFromActiveTab } from '../../utils/hybridAi';
import { SparkleIcon } from '../FormIcons';
import { AiSourceBadge } from '../AiSourceBadge';

export const AiExtractBar = ({ onExtracted }) => {
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState(null);
  const [error, setError] = useState('');

  const handleExtract = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, inferenceSource } = await extractSprintFromActiveTab();
      setSource(inferenceSource);
      onExtracted(data);
    } catch (err) {
      setError(err?.message || 'Failed to extract sprint details from page.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-extract-wrap">
      <div className="ai-extract-row">
        <AiSourceBadge source={source} />
        <button
          type="button"
          className="btn-secondary ai-extract-btn"
          onClick={handleExtract}
          disabled={loading}
          title="Extract title, URL, and deadline from the active browser tab"
        >
          <SparkleIcon />
          {loading ? 'Extracting...' : 'Extract from Page'}
        </button>
      </div>
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};