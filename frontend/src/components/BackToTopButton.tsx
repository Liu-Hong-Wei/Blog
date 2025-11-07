import { animate, type AnimationPlaybackControls } from 'motion';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import ArrowUpIcon from './icons/ArrowUpIcon';

// Pixels scrolled before the control fades in; tuned so it only shows up on longer reads.
const SCROLL_TRIGGER_Y = 800;

// Hook to detect if the user has requested reduced motion in their OS settings.
function usePrefersReducedMotion() {
  // Mirror the reader's operating system setting so we can gracefully fall back to instant jumps.
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    // We track changes so toggling the OS setting updates the component without a reload.
    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

export default function BackToTopButton() {
  // Button visibility state.
  const [isVisible, setIsVisible] = useState(false);
  // Reduced motion preference.
  const prefersReducedMotion = usePrefersReducedMotion();
  // Reference to any in-flight scroll animation.
  const scrollAnimationRef = useRef<AnimationPlaybackControls | null>(null);

  // Stop any in-flight Motion animation so user interactions always win.
  const cancelScrollAnimation = useCallback(() => {
    if (!scrollAnimationRef.current) {
      return;
    }

    scrollAnimationRef.current.stop();
    scrollAnimationRef.current = null;
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    // Throttle scroll handler work with rAF so we do not spam React state updates.
    let ticking = false;
    const handleScroll = () => {
      if (ticking) {
        return;
      }
      ticking = true;
      window.requestAnimationFrame(() => {
        setIsVisible(window.scrollY > SCROLL_TRIGGER_Y);
        ticking = false;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    // Any manual scroll or keyboard navigation should cancel the automated scroll.
    const cancelOnInteraction = () => {
      cancelScrollAnimation();
    };

    const cancelOnKeyDown = (event: KeyboardEvent) => {
      const interruptKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
      if (interruptKeys.includes(event.key)) {
        cancelScrollAnimation();
      }
    };

    window.addEventListener('wheel', cancelOnInteraction, { passive: true });
    window.addEventListener('touchstart', cancelOnInteraction, { passive: true });
    window.addEventListener('keydown', cancelOnKeyDown);

    return () => {
      window.removeEventListener('wheel', cancelOnInteraction);
      window.removeEventListener('touchstart', cancelOnInteraction);
      window.removeEventListener('keydown', cancelOnKeyDown);
    };
  }, [cancelScrollAnimation]);

  useEffect(() => () => cancelScrollAnimation(), [cancelScrollAnimation]);

  const scrollToTop = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const currentY = window.scrollY;
    if (currentY <= 0) {
      return;
    }

    cancelScrollAnimation();

    if (prefersReducedMotion) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    // Derive a natural-feeling duration based on how far the reader has scrolled.
    const duration = Math.min(0.9, Math.max(0.35, currentY / 2000));

    // Drive the scroll position with Motion so we get springy easing and cancellation support.
    scrollAnimationRef.current = animate(currentY, 0, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(latest) {
        window.scrollTo({ top: latest });
      },
      onComplete() {
        scrollAnimationRef.current = null;
      },
    });
  }, [cancelScrollAnimation, prefersReducedMotion]);

  return (
    <div className="pointer-events-none sticky bottom-6 flex w-full justify-end">
      <AnimatePresence>
        {isVisible && (
          <motion.button
            // AnimatePresence wraps the control so the exit animation completes before unmount.
            key="back-to-top"
            type="button"
            aria-label="Back to top"
            className="pointer-events-auto z-40 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-bgprimary shadow-lg backdrop-blur-md util-transition hover:shadow-xl focus-visible:ring-2 focus-visible:ring-secondary/80 focus-visible:ring-offset-2 focus-visible:ring-offset-bgprimary focus-visible:outline-none"
            // Motion variants give us a polished fade/slide when the control toggles.
            initial={{ opacity: 0, y: 16, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.85 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            onClick={scrollToTop}
          >
            <span className="flex items-center justify-center">
              <ArrowUpIcon />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
