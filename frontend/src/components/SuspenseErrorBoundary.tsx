import React, { Component, ReactNode, Suspense } from 'react';
import { PageLoadingSpinner } from '../utils/lazyLoading';
import Error from '../pages/errors/Error';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * 简化的错误边界
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Error caught:', error);
    return error;
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Error />
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
