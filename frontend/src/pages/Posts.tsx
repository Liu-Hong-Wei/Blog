import MainContentLayout from '../layouts/MainContentLayout';
import { lazy } from 'react';
import { SuspenseWrapper } from '../components/SuspenseErrorBoundary';

// 懒加载 PostsList 组件
const PostsList = lazy(() => import('../components/PostsList'));

const Posts: React.FC = () => {
  return (
    <MainContentLayout>
      <SuspenseWrapper>
        <PostsList />
      </SuspenseWrapper>
    </MainContentLayout>
  );
};

export default Posts;