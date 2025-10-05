import { NavLink } from 'react-router';
import usePosts from '../hooks/usePosts';

function Postslist() {
    const { posts, loading, error } = usePosts();

    if (loading) {
        return <div className="p-4">Loading posts...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600">Error: {error.message}</div>;
    }

    return (
        <>
            {posts.length === 0 ? (
                <p>No posts found.</p>
            ) : (
                <ul className="space-y-4 w-full">
                    {posts.map((post) => (
                        <NavLink
                            to={`/posts/${post.slug}`}
                        >
                            <li className='w-full p-4 rounded-2xl hover:bg-primary/5 transition-all group hover:text-secondary' key={post.id}>
                                <h2 className="text-xl font-light group-hover:font-bold transition-all duration-300">{post.title}</h2>
                                <p className="text-sm">{new Date(post.created_at).toLocaleDateString()}</p>
                                {/* TODO: add preivew of the article */}
                            </li>
                        </NavLink>
                    ))}
                </ul>
            )}
        </>
    );
}

export default Postslist;