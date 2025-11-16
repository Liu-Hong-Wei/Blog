// 加载状态组件 - 使用统一的设计系统
export const PageLoadingSpinner = ({ loading = 'Loading...' }: { loading?: string | null }) => (
  <div
    className="flex w-full grow items-center justify-center bg-bgprimary"
    role="status"
    aria-label="Loading"
  >
    {loading && <p className="text-sm font-medium text-primary">{loading}</p>}
  </div>
);

export const ComponentLoadingSpinner = ({ loading }: { loading?: string | null }) => (
  <div
    className="flex size-full grow items-center justify-center bg-bgprimary"
    role="status"
    aria-label="Loading component"
  >
    {loading && <span className="text-sm text-primary">{loading}</span>}
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
