import { useState } from 'react';

import type { LinkPreviewData } from '../types/types';

function DomainBadge({ siteName }: { siteName: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-primary/45">
      <svg
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
        />
      </svg>
      {siteName}
    </span>
  );
}

export default function LinkPreviewCard({
  url,
  title,
  description,
  image,
  site_name: siteName,
}: LinkPreviewData) {
  const [imageError, setImageError] = useState(false);
  const showImage = image && !imageError;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex overflow-hidden rounded-xl border border-bgsecondary/30 bg-bgsecondary/15 p-3 no-underline transition-all duration-300 hover:border-bgsecondary/60 hover:bg-bgsecondary/25 hover:shadow-sm"
    >
      {/* Thumbnail */}
      <div className="mr-3 h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-bgsecondary/40">
        {showImage ? (
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-primary/30">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Text content */}
      <div className="min-w-0 flex-1">
        {title && (
          <p className="truncate text-sm font-medium leading-snug text-primary transition-colors group-hover:text-secondary">
            {title}
          </p>
        )}
        {description && (
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-primary/60">
            {description}
          </p>
        )}
        {siteName && (
          <div className="mt-1">
            <DomainBadge siteName={siteName} />
          </div>
        )}
      </div>
    </a>
  );
}
