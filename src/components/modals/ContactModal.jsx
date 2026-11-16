import { useState, useEffect } from 'react';
import { CONTACT_TOPICS, DISCORD_WEBHOOK_URL } from '../../constants';
import { ChevronDownIcon } from '../Icons';

export const ContactModal = ({ isOpen, onClose }) => {
  const [topic, setTopic] = useState(CONTACT_TOPICS[0]);
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (status !== 'sent') return undefined;
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [status, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorText('Please enter a message.');
      return;
    }
    if (!DISCORD_WEBHOOK_URL) {
      setErrorText('Webhook URL is not configured.');
      return;
    }

    setStatus('sending');
    setErrorText('');

    try {
      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [
            {
              title: `${topic}`,
              description: message.trim(),
              color: 0x06b6d4,
              fields: contact.trim()
                ? [{ name: 'Reply to', value: contact.trim() }]
                : [],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setStatus('sent');
      setMessage('');
      setContact('');
    } catch {
      setStatus('error');
      setErrorText('Failed to send message. Please try again later.');
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ marginBottom: '0.85rem' }}>
          <h2 className="modal-title">Contact Support</h2>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {status === 'sent' ? (
          <div>
            <div className="legal-badge-pill" style={{ marginBottom: '0.4rem' }}>
              Message sent! Thank you for your feedback.
            </div>
            <span className="modal-footer-hint">Closing automatically...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="select-wrapper">
                <select
                  className="form-select"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                >
                  {CONTACT_TOPICS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="select-chevron" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Reply Contact (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Email or Discord handle"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea
                className={`form-input ${errorText ? 'error' : ''}`}
                rows={4}
                placeholder="Describe your question, bug, or idea..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setErrorText('');
                }}
              />
              {errorText && <div className="form-error">{errorText}</div>}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Close
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};