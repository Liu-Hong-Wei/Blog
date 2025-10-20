import MainContentLayout from '../layouts/MainContentLayout';
import { lazy } from 'react';

// 懒加载 PostsList 组件
const PostsList = lazy(() => import('../components/PostsList'));

const Posts: React.FC = () => {
  return (
    <MainContentLayout>
        <PostsList />
    </MainContentLayout>
  );
};

export default Posts;