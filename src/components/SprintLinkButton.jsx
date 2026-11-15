import { ExternalLinkIcon } from './Icons';

/**
 * External link button for sprint items
 */
export const SprintLinkButton = ({ url }) => {
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="hackathon-link-icon-btn"
      title={`Open link: ${url}`}
      onClick={(e) => e.stopPropagation()}
    >
      <ExternalLinkIcon />
    </a>
  );
};