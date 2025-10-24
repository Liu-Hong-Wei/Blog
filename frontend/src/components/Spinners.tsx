// 加载状态组件 - 使用统一的设计系统
export const PageLoadingSpinner = () => (
  <div className="grow bg-bgprimary flex items-center justify-center w-full" role="status" aria-label="Loading">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-bgsecondary border-t-secondary" />
      <p className="text-primary text-sm font-medium">Loading...</p>
    </div>
  </div>
);

export const ComponentLoadingSpinner = ({ componentName = "" }: { componentName?: string }) => (
  <div className="grow bg-bgprimary flex items-center justify-center size-full" role="status" aria-label="Loading component">
    <div className="flex items-center space-x-3">
      <div className="animate-spin rounded-full h-6 w-6 border-4 border-bgsecondary border-t-secondary" />
      <span className="text-primary text-sm">Loading {componentName}...</span>
    </div>
  </div>
);

export const InlineLoadingSpinner = () => (
  <div className="grow bg-bgprimary flex items-center justify-center size-full" role="status" aria-label="Loading">
    <div className="animate-spin rounded-full h-4 w-4 border-4 border-bgsecondary border-t-secondary" />
  </div>
);

export default {
  PageLoadingSpinner,
  ComponentLoadingSpinner,
  InlineLoadingSpinner,
};
