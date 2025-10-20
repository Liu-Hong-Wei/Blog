import React, { Component, ErrorInfo, ReactNode, Suspense } from 'react';
import { PageLoadingSpinner } from './Spinners';
import Error from '../pages/errors/Error';
import { NotFoundError, APIError } from '../utils/errors';
import NotFound from '../pages/errors/NotFound';
import Button from './buttons/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * 统一的错误边界组件
 * 结合了 Suspense 和多种错误类型的处理
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const { error } = this.state;
      
      // 404 Not Found Error
      if (error instanceof NotFoundError) {
        return <NotFound />;
      }
      
      // API Error
      if (error instanceof APIError) {
        return (
          <Error 
            emoji="🚫" 
            content="API Error" 
            error={`${error.status}: ${error.message}`}
          />
        );
      }
      
      // 自定义 fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 通用错误处理
      return (
        <div className="flex flex-col justify-center items-center space-y-4">
          <Error emoji="⚠️" content={`Oops, Something went wrong: ${this.state.error?.message || 'An unexpected error occurred'}`} />
          <Button onClick={this.handleRetry}>
            Try Again;0
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Suspense 和 ErrorBoundary 的包装器
 */
export const SuspenseErrorBoundary: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
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

export default SuspenseErrorBoundary;
