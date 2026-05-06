import { type AnimationPlaybackControls } from 'motion';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router';

import { prefersReducedMotion } from '../utils/prefersReducedMotion';
import { animateScrollTo } from '../utils/scrollAnimation';
import { addScrollInterruptionListeners } from '../utils/scrollInterruption';

// Compose a unique key for storing the scroll position per location segment so every tab
// and route gets its own cache entry. We include search/hash so dynamic pages restore precisely.
function getStorageKey(pathname: string, search: string, hash: string) {
  return `scroll-position:${pathname}${search}${hash}`;
}

// Read the previously stored scroll position and guard against malformed values.
function readStoredPosition(key: string) {
  const stored = sessionStorage.getItem(key);
  if (stored === null) {
    return null;
  }

  const parsed = Number(stored);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Persists and restores window scroll position for the current route so the reader lands on the
 * same section after navigation events, reloads, or SPA transitions. Smoothly animates the
 * restoration when motion is permitted and gracefully cancels if the user starts interacting.
 */
function useScrollRestoration() {
  // Get the current location
  const location = useLocation();
  const navigationType = useNavigationType();
  // Ref to track if we are currently restoring scroll position
  const isRestoringRef = useRef(false);
  // Ref to track the current animation frame ID for scroll restoration
  const restorationRafRef = useRef<number | null>(null);
  // Ref to keep any in-flight Motion animation so we can cancel or clean it up
  const scrollAnimationRef = useRef<AnimationPlaybackControls | null>(null);

  // Set scroll restoration to manual and store scroll position on unload/pagehide
  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    // Opt-in to manual restoration so the browser does not fight our logic.
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

  // Restore scroll position on location change
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return undefined;
    }

    const key = getStorageKey(location.pathname, location.search, location.hash);
    // Persist the latest scroll offset as the user navigates. When restoration is in progress we
    // skip writes to avoid replacing the target value with intermediate positions from the motion.
    const handleScroll = () => {
      if (isRestoringRef.current) {
        return;
      }

      sessionStorage.setItem(key, window.scrollY.toString());
    };

    // Ensure any in-flight Motion animation is fully stopped so that manual input immediately
    // takes precedence. This mirrors the BackToTopButton behaviour for consistent UX.
    const cancelScrollAnimation = () => {
      if (!scrollAnimationRef.current) {
        return;
      }

      scrollAnimationRef.current.stop();
      scrollAnimationRef.current = null;
      isRestoringRef.current = false;
    };

    const scrollElement = () =>
      document.scrollingElement ?? document.documentElement ?? document.body;

    // Watch the ongoing animation via requestAnimationFrame so we can mark restoration complete
    // once the viewport reaches the intended target. This prevents stale restoring state from
    // blocking user-driven writes after smooth scrolling finishes.
    const scheduleRestorationCheck = (targetTop: number) => {
      const monitor = () => {
        const currentTop = window.scrollY || window.pageYOffset;
        // Check if we've reached the target position where we want to stop restoring
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

    // Determine the intended scroll target: restore cached position on POP (back/forward),
    // otherwise always scroll to top for fresh navigations.
    const cached = readStoredPosition(key);
    const isPop = navigationType === 'POP';
    const desiredTop = isPop && cached !== null ? cached : 0;

    // Attempt to restore the scroll position once the DOM is stable enough to scroll. We delay
    // restoring until the document height is sufficient, retrying while the page renders.
    const restoreIfReady = () => {
      if (restored) {
        return;
      }

      // Already at the target — nothing to do.
      if (Math.abs(window.scrollY - desiredTop) <= 1) {
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

      // When restoring a saved position, wait until the page is tall enough.
      if (isPop && cached !== null) {
        if (maxScrollable === 0 && attempts < maxAttempts) {
          attempts += 1;
          rafId = window.requestAnimationFrame(restoreIfReady);
          return;
        }

        if (cached > maxScrollable && attempts < maxAttempts) {
          attempts += 1;
          rafId = window.requestAnimationFrame(restoreIfReady);
          return;
        }
      }

      restored = true;
      const shouldReduceMotion = prefersReducedMotion();
      const behavior: ScrollBehavior = shouldReduceMotion ? 'auto' : 'smooth';
      const targetTop = Math.min(desiredTop, maxScrollable);

      if (behavior === 'smooth' && targetTop > 0) {
        cancelScrollAnimation();
        isRestoringRef.current = true;
        const controls = animateScrollTo(targetTop, {
          max_duration: 0.8,
          min_duration: 0.2,
          duration_divisor: 3000,
          onComplete() {
            isRestoringRef.current = false;
            scrollAnimationRef.current = null;
          },
        });
        scrollAnimationRef.current = controls;
        if (!controls) {
          isRestoringRef.current = false;
          return;
        }
        scheduleRestorationCheck(targetTop);
        return;
      }

      // Fallback for reduced motion or top-of-page: jump directly.
      window.scrollTo({ top: targetTop, behavior });
      isRestoringRef.current = false;
    };

    rafId = window.requestAnimationFrame(restoreIfReady);

    // Keep the cache warm while the reader scrolls, and retry restoration once the window loads.
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('load', restoreIfReady);
    const removeInterruptionListeners = addScrollInterruptionListeners(cancelScrollAnimation);

    let observer: MutationObserver | undefined;
    if (typeof MutationObserver !== 'undefined' && document.body) {
      observer = new MutationObserver(restoreIfReady);
      observer.observe(document.body, { childList: true, subtree: true });
    }

    // Safety valve in case none of the other triggers fire (e.g., heavy async content).
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
      cancelScrollAnimation();
      if (restorationRafRef.current !== null) {
        window.cancelAnimationFrame(restorationRafRef.current);
        restorationRafRef.current = null;
      }
      isRestoringRef.current = false;
      removeInterruptionListeners();
    };
  }, [location.pathname, location.search, location.hash, navigationType]);
}

export default useScrollRestoration;
