import Postslist from '../components/Postslist';
import MainContentLayout from '../layouts/MainContentLayout';

const Posts: React.FC = () => {
  return (
    <MainContentLayout>
      <Postslist />
    </MainContentLayout>
  );
};

export default Posts;