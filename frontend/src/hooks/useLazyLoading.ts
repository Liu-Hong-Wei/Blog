import { useState, useEffect, useRef } from 'react';

/**
 * @description 视窗内懒加载 Hook.
 * 当组件进入视窗时，才将其加载，以优化初始加载性能。
 * @param {number} [threshold=0.1] - Intersection Observer 的阈值，表示目标元素可见度达到多少时触发回调。
 * @returns {{
 *   elementRef: React.RefObject<HTMLDivElement>; // 需要被观察的元素的 ref
 *   isInView: boolean; // 元素是否进入视窗
 *   hasLoaded: boolean; // 元素是否已经加载过
 * }}
 */
export const useInViewLazyLoading = (threshold = 0.1) => {
  const [isInView, setIsInView] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentElement = elementRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // 当元素进入视窗且尚未加载时
        if (entry.isIntersecting && !hasLoaded) {
          setIsInView(true);
          setHasLoaded(true);
          // 一旦加载，就停止观察以节省资源
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

    // 组件卸载时清理观察器
    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, hasLoaded]);

  return { elementRef, isInView, hasLoaded };
};

/**
 * @description 预加载 Hook.
 * 允许在用户交互（如鼠标悬停）时预先加载组件或数据。
 * @returns {{
 *   prefetch: (importFn: () => Promise<unknown>, key: string) => Promise<void>; // 预加载函数
 *   isPrefetched: (key: string) => boolean; // 检查是否已预加载
 * }}
 */
export const usePrefetch = () => {
  const [prefetchedModules, setPrefetchedModules] = useState<Set<string>>(new Set());

  /**
   * @description 预加载一个模块。
   * @param {() => Promise<unknown>} importFn - 动态导入函数的包装器，例如 `() => import('./MyComponent')`。
   * @param {string} key - 唯一标识该模块的键。
   */
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

  /**
   * @description 检查一个模块是否已经被预加载。
   * @param {string} key - 模块的唯一键。
   * @returns {boolean} - 如果模块已预加载，则返回 true。
   */
  const isPrefetched = (key: string) => prefetchedModules.has(key);

  return { prefetch, isPrefetched };
};

/**
 * @description 网络状态感知懒加载 Hook.
 * 根据用户的在线状态决定是否执行懒加载策略。
 * @returns {{
 *   isOnline: boolean; // 用户是否在线
 *   shouldLazyLoad: () => boolean; // 是否应该启用懒加载
 * }}
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

  /**
   * @description 判断是否应该启用懒加载。
   * 目前的逻辑是，只有当用户在线时才启用。
   * @returns {boolean}
   */
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
