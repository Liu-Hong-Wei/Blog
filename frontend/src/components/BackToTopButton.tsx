import { animate, easeOut, type AnimationPlaybackControls } from 'motion';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import ArrowUpIcon from './icons/ArrowUpIcon';
import useIsScrolling from '../hooks/useIsScrolling';

// Pixels scrolled before the control fades in; tuned so it only shows up on longer reads.
const SCROLL_TRIGGER_Y = 480;

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
  const { isScrollingUp, isScrollingDown } = useIsScrolling();

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
    // Variable to prevent multiple rAF calls in a single frame.
    let ticking = false;
    // Scroll event handler to determine if the button should be visible.
    const handleScroll = () => {
      // If already scheduled, skip this frame.
      if (ticking) {
        return;
      }
      ticking = true;
      // Use requestAnimationFrame to throttle updates and improve performance.
      window.requestAnimationFrame(() => {
        // Update visibility state based on scroll position.
        if (isScrollingUp) {
          setIsVisible(window.scrollY > SCROLL_TRIGGER_Y);
        } else if (isScrollingDown) {
          setIsVisible(false);
        }
        // Reset the ticking flag for the next scroll event.
        ticking = false;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrollingUp, isScrollingDown]);

  // Set up event listeners to cancel the scroll animation on user interaction.
  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    // Any manual scroll or keyboard navigation should cancel the automated scroll.
    const cancelOnKeyDown = (event: KeyboardEvent) => {
      const interruptKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
      if (interruptKeys.includes(event.key)) {
        cancelScrollAnimation();
      }
    };

    window.addEventListener('wheel', cancelScrollAnimation, { passive: true });
    window.addEventListener('touchstart', cancelScrollAnimation, { passive: true });
    window.addEventListener('keydown', cancelOnKeyDown);

    return () => {
      window.removeEventListener('wheel', cancelScrollAnimation);
      window.removeEventListener('touchstart', cancelScrollAnimation);
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
    const duration = Math.min(2, Math.max(0.5, currentY /3000));

    // Drive the scroll position with Motion so we get springy easing and cancellation support.
    scrollAnimationRef.current = animate(currentY, 0, {
      duration,
      ease: easeOut,
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
            className="cursor-pointer pointer-events-auto z-50 flex h-12 w-12 items-center justify-center rounded-full bg-bgsecondary text-secondary shadow-lg backdrop-blur-md util-transition hover:shadow-xl focus-visible:ring-2 focus-visible:ring-secondary/80 focus-visible:ring-offset-2 focus-visible:ring-offset-bgprimary focus-visible:outline-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.7 }}
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
