import { type AnimationPlaybackControls } from 'motion';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import ArrowUpIcon from './icons/ArrowUpIcon';
import useIsScrolling from '../hooks/useIsScrolling';
import { usePrefersReducedMotion } from '../utils/prefersReducedMotion';
import { animateScrollTo } from '../utils/scrollAnimation';
import { addScrollInterruptionListeners } from '../utils/scrollInterruption';

// Pixels scrolled before the control fades in; tuned so it only shows up on longer reads.
const SCROLL_TRIGGER_Y = 480;

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
  useEffect(() => addScrollInterruptionListeners(cancelScrollAnimation), [cancelScrollAnimation]);

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

    // Drive the scroll position with the shared Motion helper so duration scales with distance and
    // cancellation stays consistent across features.
    scrollAnimationRef.current = animateScrollTo(0, {
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
            className="pointer-events-auto z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-bgsecondary text-secondary shadow-lg backdrop-blur-md util-transition hover:shadow-xl focus-visible:ring-2 focus-visible:ring-secondary/80 focus-visible:ring-offset-2 focus-visible:ring-offset-bgprimary focus-visible:outline-none"
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
