/**
 * 一个将 Promise 包装成 Suspense 兼容资源的辅助函数。
 * 这个函数是无状态的，并且不包含任何缓存逻辑。
 * @param promise - 等待被解析的 Promise。
 * @returns 一个包含 read() 方法的资源对象。
 */
function createResource<T>(promise: Promise<T>) {
  let status: 'pending' | 'success' | 'error' = 'pending';
  let result: T;
  let error: Error;

  const suspender = promise.then(
    (data) => {
      status = 'success';
      result = data;
    },
    (err) => {
      status = 'error';
      error = err;
    }
  );

  return {
    /**
     * 读取资源。
     * - 如果在 pending 状态，它会抛出 Promise，由 Suspense 捕获。
     * - 如果在 error 状态，它会抛出错误，由 ErrorBoundary 捕获。
     * - 如果在 success 状态，它会返回数据。
     */
    read(): T {
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw error;
      } else if (status === 'success') {
        return result;
      }
      // 理论上不会执行到这里
      throw new Error('Invalid resource status');
    }
  };
}


export default createResource;