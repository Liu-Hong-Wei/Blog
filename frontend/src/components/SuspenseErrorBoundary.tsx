import React, { Component, ReactNode, Suspense } from 'react';
import { PageLoadingSpinner } from '../utils/lazyLoading';
import Error from '../pages/errors/Error';
import { NotFoundError, APIError } from '../utils/errors';
import NotFound from '../pages/errors/NotFound';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * 简化的错误边界
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('Error caught:', error);
    return error;
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const { error } = this.state;
      
      // 404 错误处理
      if (error instanceof NotFoundError) {
        return (
          <NotFound />
        );
      }
      
      // API 错误处理
      if (error instanceof APIError) {
        return (
          <Error 
            emoji="🚫" 
            content="API Error" 
            error={`${error.status}: ${error.message}`}
          />
        );
      }
      
      // 通用错误处理
      return (
        <Error 
          error={error?.message || 'An unexpected error occurred'}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * 简单的 Suspense 包装器
 */
export const SuspenseWrapper: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback = <PageLoadingSpinner /> 
}) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

export default SuspenseWrapper;
