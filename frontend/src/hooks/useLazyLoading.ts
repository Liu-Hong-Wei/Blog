import { useState, useEffect, useRef } from 'react';

/**
 * 视窗懒加载 Hook
 * 只有当组件进入视窗时才加载
 */
export const useInViewLazyLoading = (threshold = 0.1) => {
  const [isInView, setIsInView] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentElement = elementRef.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsInView(true);
          setHasLoaded(true);
          // 一旦加载就取消观察
          if (currentElement) {
            observer.unobserve(currentElement);
          }
        }
      },
      { threshold }
    );

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, hasLoaded]);

  return { elementRef, isInView, hasLoaded };
};

/**
 * 预加载 Hook
 * 在鼠标悬停或其他交互时预加载组件
 */
export const usePrefetch = () => {
  const [prefetchedModules, setPrefetchedModules] = useState<Set<string>>(new Set());

  const prefetch = async (importFn: () => Promise<unknown>, key: string) => {
    if (prefetchedModules.has(key)) {
      return;
    }

    try {
      await importFn();
      setPrefetchedModules(prev => new Set(prev).add(key));
    } catch (error) {
      console.warn(`Failed to prefetch module ${key}:`, error);
    }
  };

  const isPrefetched = (key: string) => prefetchedModules.has(key);

  return { prefetch, isPrefetched };
};

/**
 * 简单的网络状态 Hook
 * 根据在线状态决定是否懒加载
 */
export const useNetworkAwareLazyLoading = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 判断是否应该启用懒加载
  const shouldLazyLoad = () => {
    return isOnline;
  };

  return { isOnline, shouldLazyLoad };
};

export default {
  useInViewLazyLoading,
  usePrefetch,
  useNetworkAwareLazyLoading,
};
