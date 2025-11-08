import { animate, easeOut, type AnimationPlaybackControls } from 'motion';

// Shared helper to animate the window scroll position with Motion. Duration scales with travel
// distance so short hops feel snappy while longer jumps ease in smoothly.
export interface ScrollAnimationOptions {
  duration?: number;
  min_duration?: number;
  max_duration?: number;
  duration_divisor?: number;
  onUpdate?: (latest: number) => void;
  onComplete?: () => void;
}

export function animateScrollTo(
  targetTop: number,
  options: ScrollAnimationOptions = {}
): AnimationPlaybackControls | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const currentTop = window.scrollY || window.pageYOffset || 0;
  if (Math.abs(currentTop - targetTop) <= 1) {
    window.scrollTo({ top: targetTop });
    options.onUpdate?.(targetTop);
    options.onComplete?.();
    return null;
  }

  const distance = Math.abs(targetTop - currentTop);
  const duration =
    options.duration ?? Math.min(options.max_duration ?? 1.2, Math.max(options.min_duration ?? 0.2, distance / (options.duration_divisor ?? 3000)));

  return animate(currentTop, targetTop, {
    duration,
    ease: easeOut,
    onUpdate(latest) {
      window.scrollTo({ top: latest });
      options.onUpdate?.(latest);
    },
    onComplete() {
      options.onComplete?.();
    },
  });
}
