import { useEffect } from 'react';
import { useLocation } from 'react-router';

function getStorageKey(pathname: string, search: string, hash: string) {
  return `scroll-position:${pathname}${search}${hash}`;
}

function readStoredPosition(key: string) {
  const stored = sessionStorage.getItem(key);
  if (stored === null) {
    return null;
  }

  const parsed = Number(stored);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Persists and restores scroll position per route so a page refresh keeps the viewport location.
 */
function useScrollRestoration() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    window.history.scrollRestoration = 'manual';

    const storePosition = () => {
      const key = getStorageKey(
        window.location.pathname,
        window.location.search,
        window.location.hash
      );
      sessionStorage.setItem(key, window.scrollY.toString());
    };

    window.addEventListener('beforeunload', storePosition);
    window.addEventListener('pagehide', storePosition);
    return () => {
      window.removeEventListener('beforeunload', storePosition);
      window.removeEventListener('pagehide', storePosition);
      window.history.scrollRestoration = 'auto';
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const key = getStorageKey(location.pathname, location.search, location.hash);
    const handleScroll = () => {
      sessionStorage.setItem(key, window.scrollY.toString());
    };

    const frameId = window.requestAnimationFrame(() => {
      const position = readStoredPosition(key);
      if (position !== null) {
        window.scrollTo({ top: position, behavior: 'auto' });
      }
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname, location.search, location.hash]);
}

export default useScrollRestoration;
