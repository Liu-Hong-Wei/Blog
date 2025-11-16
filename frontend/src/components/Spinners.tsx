// 加载状态组件 - 使用统一的设计系统
export const PageLoadingSpinner = ({ loading = 'Loading...' }: { loading?: string | null }) => (
  <div
    className="flex w-full grow items-center justify-center bg-bgprimary"
    role="status"
    aria-label="Loading"
  >
    <div className="flex flex-col items-center space-y-4">
      {loading && <p className="text-sm font-medium text-primary">{loading}</p>}
    </div>
  </div>
);

export const ComponentLoadingSpinner = ({ loading }: { loading?: string | null }) => (
  <div
    className="flex size-full grow items-center justify-center bg-bgprimary"
    role="status"
    aria-label="Loading component"
  >
    <div className="flex items-center space-x-3">
      {loading && <span className="text-sm text-primary">{loading}</span>}
    </div>
  </div>
);

export const InlineLoadingSpinner = ({ loading }: { loading?: string | null }) => (
  <div
    className="flex size-full grow items-center justify-center bg-bgprimary"
    role="status"
    aria-label="Loading"
  >
    {loading}
  </div>
);

export default {
  PageLoadingSpinner,
  ComponentLoadingSpinner,
  InlineLoadingSpinner,
};
