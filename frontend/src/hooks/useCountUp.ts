import { useEffect, useRef, useState } from 'react';

import { prefersReducedMotion } from '../utils/prefersReducedMotion';

interface UseCountUpOptions {
  target: number;
  durationMs?: number;
  startOnVisible?: boolean;
  rootMargin?: string;
}

// easeOutCubic — feels lively early, gently settles at the end
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

export function useCountUp({
  target,
  durationMs = 1200,
  startOnVisible = true,
  rootMargin = '0px 0px -10% 0px',
}: UseCountUpOptions): {
  value: number;
  ref: (node: HTMLElement | null) => void;
} {
  const [value, setValue] = useState(0);
  const elementRef = useRef<HTMLElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const begin = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - begin) / durationMs);
        const eased = easeOutCubic(t);
        setValue(Math.round(eased * target));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (!startOnVisible || typeof IntersectionObserver === 'undefined') {
      start();
      return;
    }

    const node = elementRef.current;
    if (!node) {
      start();
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            start();
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin, threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [target, durationMs, startOnVisible, rootMargin]);

  const ref = (node: HTMLElement | null) => {
    elementRef.current = node;
  };

  return { value, ref };
}
