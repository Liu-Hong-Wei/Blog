import { useEffect, useRef, useState } from 'react';

interface ScrollState {
  isScrolling: boolean;
  isAtTop: boolean;
  hasScrolled: boolean;
  scrollDirection: 'up' | 'down' | 'idle';
  isScrollingUp: boolean;
  isScrollingDown: boolean;
}

const SCROLL_IDLE_DELAY = 300;
const DIRECTION_THRESHOLD = 5;

const useIsScrolling = (): ScrollState => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | 'idle'>('idle');
  const timeoutRef = useRef<number | null>(null);
  const lastScrollYRef = useRef(0);
  const directionDeltaRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY || window.pageYOffset;
      const delta = currentScrollY - lastScrollYRef.current;

      setIsAtTop(currentScrollY <= 0);
      setIsScrolling(Math.abs(delta) > 0);

      // Accumulate scroll delta and only flip direction when threshold is crossed
      directionDeltaRef.current += delta;
      const absAccumulated = Math.abs(directionDeltaRef.current);
      if (absAccumulated >= DIRECTION_THRESHOLD) {
        setScrollDirection(directionDeltaRef.current < 0 ? 'up' : 'down');
        directionDeltaRef.current = 0;
      }

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false);
        setScrollDirection('idle');
        directionDeltaRef.current = 0;
      }, SCROLL_IDLE_DELAY);

      lastScrollYRef.current = currentScrollY;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isScrolling,
    isAtTop,
    hasScrolled: !isAtTop,
    scrollDirection,
    isScrollingUp: scrollDirection === 'up',
    isScrollingDown: scrollDirection === 'down',
  };
};

export default useIsScrolling;
