import { useEffect, useRef } from 'react';
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
  const isRestoringRef = useRef(false);
  const restorationRafRef = useRef<number | null>(null);

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
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return undefined;
    }

    const key = getStorageKey(location.pathname, location.search, location.hash);
    const handleScroll = () => {
      if (isRestoringRef.current) {
        return;
      }

      sessionStorage.setItem(key, window.scrollY.toString());
    };

    const scrollElement = () =>
      document.scrollingElement ?? document.documentElement ?? document.body;

    const scheduleRestorationCheck = (targetTop: number) => {
      const monitor = () => {
        const currentTop = window.scrollY || window.pageYOffset;
        if (Math.abs(currentTop - targetTop) <= 1) {
          isRestoringRef.current = false;
          if (restorationRafRef.current !== null) {
            window.cancelAnimationFrame(restorationRafRef.current);
            restorationRafRef.current = null;
          }
          return;
        }

        restorationRafRef.current = window.requestAnimationFrame(monitor);
      };

      if (restorationRafRef.current !== null) {
        window.cancelAnimationFrame(restorationRafRef.current);
      }

      restorationRafRef.current = window.requestAnimationFrame(monitor);
    };

    let rafId = 0;
    let restored = false;
    let attempts = 0;
    const maxAttempts = 240; // ~4s at 60fps

    const restoreIfReady = () => {
      if (restored) {
        return;
      }

      const position = readStoredPosition(key);
      if (position === null) {
        restored = true;
        return;
      }

      const target = scrollElement();
      if (!target) {
        rafId = window.requestAnimationFrame(restoreIfReady);
        return;
      }

      const viewportHeight = window.innerHeight || target.clientHeight || 0;
      const maxScrollable = Math.max(0, (target.scrollHeight || 0) - viewportHeight);

      if (maxScrollable === 0 && attempts < maxAttempts) {
        attempts += 1;
        rafId = window.requestAnimationFrame(restoreIfReady);
        return;
      }

      if (position > maxScrollable && attempts < maxAttempts) {
        attempts += 1;
        rafId = window.requestAnimationFrame(restoreIfReady);
        return;
      }

      restored = true;
      const prefersReducedMotion =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
      const targetTop = Math.min(position, maxScrollable);

      if (behavior === 'smooth') {
        isRestoringRef.current = true;
        scheduleRestorationCheck(targetTop);
      }

      window.scrollTo({ top: targetTop, behavior });

      if (behavior !== 'smooth') {
        isRestoringRef.current = false;
      }
    };

    rafId = window.requestAnimationFrame(restoreIfReady);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('load', restoreIfReady);

    let observer: MutationObserver | undefined;
    if (typeof MutationObserver !== 'undefined' && document.body) {
      observer = new MutationObserver(restoreIfReady);
      observer.observe(document.body, { childList: true, subtree: true });
    }

    const fallbackTimeout = window.setTimeout(() => {
      if (!restored) {
        restoreIfReady();
      }
    }, 3000);

    return () => {
      restored = true;
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('load', restoreIfReady);
      observer?.disconnect();
      window.clearTimeout(fallbackTimeout);
      if (restorationRafRef.current !== null) {
        window.cancelAnimationFrame(restorationRafRef.current);
        restorationRafRef.current = null;
      }
      isRestoringRef.current = false;
    };
  }, [location.pathname, location.search, location.hash]);
}

export default useScrollRestoration;