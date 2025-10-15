import { NavLink } from 'react-router';
import usePosts from '../hooks/usePosts';

function PostsList() {
    const posts = usePosts();

    return (
        <div className="w-full">
            {posts.length === 0 ? (
                <p>No posts found.</p>
            ) : (
                <ul className="space-y-4 w-full">
                    {posts.map((post) => (
                        <li className='w-full p-4 rounded-2xl hover:bg-primary/5 transition-all group hover:text-secondary' key={post.id}>
                            <NavLink
                                to={`/posts/${post.slug}`}
                            >
                                <h2 className="text-xl font-medium group-hover:font-bold transition-all duration-300">{post.title}</h2>
                                <p className="text-md group-hover:font-bold transition-all duration-300">{new Date(post.created_at).toLocaleDateString()}</p>
                                {/* TODO: add preivew of the article */}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default PostsList;