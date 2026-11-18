import { useState, useRef, useEffect } from 'react';
import { extractSprintFromActiveTab } from '../../utils/hybridAi';
import { SparkleIcon } from '../FormIcons';
import { AiSourceBadge } from '../AiSourceBadge';

export const AiExtractBar = ({ source, onSourceChange, onExtracted, onError }) => {
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const handleExtract = async () => {
    if (loading) {
      abortRef.current?.abort();
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    onError?.('');

    try {
      const { data, inferenceSource } = await extractSprintFromActiveTab({
        signal: controller.signal,
      });
      onSourceChange?.(inferenceSource);
      onExtracted(data);
    } catch (err) {
      if (err?.name === 'AbortError' || controller.signal.aborted) return;
      onError?.(err?.message || 'Failed to extract sprint details from page.');
    } finally {
      setLoading(false);
      abortRef.current = null;
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
          title={loading ? 'Click to stop AI extraction' : 'Extract title, URL, and deadline from the active browser tab'}
        >
          <SparkleIcon />
          {loading ? (
            <>
              Extracting<span className="ai-loading-dots" aria-hidden="true" />
            </>
          ) : (
            'Extract from Page'
          )}
        </button>
      </div>
    </div>
  );
};