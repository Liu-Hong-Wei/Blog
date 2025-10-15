import { Suspense, ReactNode } from 'react';

// 加载状态组件 - 使用统一的设计系统
export const PageLoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[60vh]" role="status" aria-label="Loading">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600" />
      <p className="text-gray-600 text-sm font-medium">Loading...</p>
    </div>
  </div>
);

export const ComponentLoadingSpinner = () => (
  <div className="flex items-center justify-center p-6" role="status" aria-label="Loading component">
    <div className="flex items-center space-x-3">
      <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-t-blue-600" />
      <span className="text-gray-600 text-sm">Loading component...</span>
    </div>
  </div>
);

export const InlineLoadingSpinner = () => (
  <div className="flex items-center justify-center p-2" role="status" aria-label="Loading">
    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-200 border-t-blue-600" />
  </div>
);

// 懒加载包装器组件 - 更好的类型安全
interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const LazyWrapper = ({ 
  children, 
  fallback = <ComponentLoadingSpinner />, 
}: LazyWrapperProps) => {
  return  <Suspense fallback={fallback}>{children}</Suspense>;
};

// 导出所有加载组件和工具
export default {
  PageLoadingSpinner,
  ComponentLoadingSpinner,
  InlineLoadingSpinner,
  LazyWrapper,
};
