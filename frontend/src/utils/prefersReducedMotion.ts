import { useEffect, useState } from 'react';

const MEDIA_QUERY = '(prefers-reduced-motion: reduce)';

function getMediaQueryList(): MediaQueryList | undefined {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return undefined;
  }

  return window.matchMedia(MEDIA_QUERY);
}

export function prefersReducedMotion(): boolean {
  const mediaQueryList = getMediaQueryList();
  return mediaQueryList ? mediaQueryList.matches : false;
}

export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(prefersReducedMotion);

  useEffect(() => {
    const mediaQueryList = getMediaQueryList();
    if (!mediaQueryList) {
      return undefined;
    }

    const handleChange = () => {
      setPrefersReduced(mediaQueryList.matches);
    };

    handleChange();
    mediaQueryList.addEventListener('change', handleChange);

    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReduced;
}
