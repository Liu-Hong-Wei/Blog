import React, { Suspense, lazy } from 'react';
import { useInViewLazyLoading, usePrefetch } from '../hooks/useLazyLoading';
import { ComponentLoadingSpinner } from '../utils/lazyLoading';

// 使用现有组件进行懒加载示例
const PostsList = lazy(() => import('./PostsList'));
const ProfileCard = lazy(() => import('./ProfileCard'));

interface InViewLazyComponentProps {
  componentType: 'posts' | 'profile';
  threshold?: number;
}

/**
 * 视窗内懒加载组件示例
 * 只有当组件进入视窗时才开始加载
 */
export const InViewLazyComponent: React.FC<InViewLazyComponentProps> = ({
  componentType,
  threshold = 0.1
}) => {
  const { elementRef, isInView } = useInViewLazyLoading(threshold);
  const { prefetch, isPrefetched } = usePrefetch();

  // 预加载逻辑
  const handleMouseEnter = () => {
    if (!isPrefetched(componentType)) {
      const importFn = componentType === 'posts' 
        ? () => import('./PostsList')
        : () => import('./ProfileCard');
      
      prefetch(importFn, componentType);
    }
  };

  return (
    <div 
      ref={elementRef}
      onMouseEnter={handleMouseEnter}
      className="min-h-[300px] w-full"
    >
      {isInView ? (
        <Suspense fallback={<ComponentLoadingSpinner />}>
          {componentType === 'posts' ? (
            <PostsList />
          ) : (
            <ProfileCard />
          )}
        </Suspense>
      ) : (
        <div className="flex items-center justify-center h-[300px] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
              {componentType === 'posts' ? '📝' : '�'}
            </div>
            <p className="text-gray-500 text-sm">滚动到这里加载{componentType === 'posts' ? '文章列表' : '个人资料'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InViewLazyComponent;
