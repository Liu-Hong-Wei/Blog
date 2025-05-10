import { usePosts } from '../hooks/usePosts';
import MainContentLayout from '../layouts/MainContentLayout';

const Posts: React.FC = () => {
  const { posts, loading, error } = usePosts();

  if (loading) {
    return <div className="p-4">Loading posts...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error.message}</div>;
  }

  return (
    <MainContentLayout>
      <div className="space-y-6">
        {posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <article key={post.id} className="p-4 border rounded-lg">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-gray-600 text-sm">{new Date(post.created_at).toLocaleDateString()}</p>
                <p className="mt-2">{post.content.substring(0, 150)}...</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </MainContentLayout>
  );
};

export default Posts;