# 简化的 React Suspense 懒加载指南

## 🎯 目标
只关注核心的懒加载和 Suspense 功能，保持简单易用。

## 📁 核心文件

### 1. `useSuspenseQuery.ts` - 简单的 Suspense 数据获取
```typescript
// 基本用法
const data = useSuspenseData('key', () => fetch('/api/data'));
```

### 2. `usePostsModern.ts` - Suspense 版本的 usePosts
```typescript
export default function usePosts() {
  const posts = useSuspenseData('posts', async () => {
    const data = await PostsAPI.getAll();
    return data.results;
  });

  const refetch = () => {
    clearCache();
    window.location.reload();
  };

  return { posts, refetch };
}
```

### 3. `SuspenseErrorBoundary.tsx` - 简单的错误处理
```tsx
export const SuspenseWrapper = ({ children, fallback = <Loading /> }) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};
```

### 4. `PostsList.tsx` - 简化的组件
```tsx
function PostsList() {
  const { posts, refetch } = usePosts();
  
  return (
    <div>
      <button onClick={refetch}>刷新</button>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

## 🚀 使用方式

### 1. 页面级懒加载
```tsx
// App.tsx
const Posts = lazy(() => import('./pages/Posts'));

// 在路由中使用
<Suspense fallback={<Loading />}>
  <Posts />
</Suspense>
```

### 2. 组件级懒加载
```tsx
// Posts.tsx
const PostsList = lazy(() => import('../components/PostsList'));

return (
  <SuspenseWrapper>
    <PostsList />
  </SuspenseWrapper>
);
```

### 3. 数据获取
```tsx
// 任何组件中
function MyComponent() {
  const data = useSuspenseData('my-data', () => fetchMyData());
  
  return <div>{data.title}</div>;
}
```

## ✨ 核心优势

1. **超简单** - 只有 3 个主要 API
2. **自动缓存** - 避免重复请求
3. **错误处理** - 内置错误边界
4. **类型安全** - 完整 TypeScript 支持

## 📝 关键点

- 组件会自动 suspend 直到数据加载完成
- 错误会自动被 ErrorBoundary 捕获
- 缓存会在请求完成后自动清理（允许重新请求）
- 刷新通过 `clearCache()` + 页面重载实现

这个方案比 React Query 简单得多，但提供了 Suspense 的核心好处！
