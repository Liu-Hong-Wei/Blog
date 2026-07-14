import { useEffect, useState } from 'react';

import { LinkPreviewAPI } from '../services/api';
import type { LinkPreviewData } from '../types/types';

// Global caches shared across all hook instances:
// - promiseCache prevents duplicate in-flight requests
// - dataCache holds resolved values so re-mounts get instant data
const promiseCache = new Map<string, Promise<LinkPreviewData | null>>();
const dataCache = new Map<string, LinkPreviewData | null>();

/**
 * Fetch link preview metadata for a URL.
 * Returns null if the URL is invalid, the fetch fails, or
 * the page has no extractable metadata.
 *
 * Uses per-URL caching to avoid redundant network requests:
 * - In-flight deduplication via promiseCache
 * - Resolved values via dataCache for instant re-renders
 */
export default function useLinkPreview(url: string): LinkPreviewData | null {
  const [data, setData] = useState<LinkPreviewData | null>(
    () => dataCache.get(url) ?? null
  );

  useEffect(() => {
    // Already resolved — use cached value
    if (dataCache.has(url)) {
      setData(dataCache.get(url)!);
      return;
    }

    let cancelled = false;

    // Deduplicate in-flight requests
    if (!promiseCache.has(url)) {
      promiseCache.set(url, LinkPreviewAPI.get(url));
    }

    promiseCache.get(url)!.then(result => {
      if (!cancelled) {
        dataCache.set(url, result);
        setData(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return data;
}
