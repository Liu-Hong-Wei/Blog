import usePosts from '../hooks/usePosts';
import ContainerLayout from '../layouts/ContainerLayout';

function Postslist() {
    const { posts, loading, error } = usePosts();

    if (loading) {
        return <div className="p-4">Loading posts...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600">Error: {error.message}</div>;
    }

    return (
            <div className="space-y-6">
                {posts.length === 0 ? (
                    <p>No posts found.</p>
                ) : (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <ContainerLayout className='border-y-1 border-gray-300 p-2 rounded-none'>
                                <article key={post.id}>
                                    <h2 className="text-xl font-semibold">{post.title}</h2>
                                    <p className="text-sm">{new Date(post.created_at).toLocaleDateString()}</p>
                                    <p className="text-md mt-2">{post.content.substring(0, 150)}...</p>
                                </article>
                            </ContainerLayout>
                        ))}
                    </div>
                )}
            </div>
    );
}

export default Postslist;