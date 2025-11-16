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
                        <li className='w-full p-4 rounded-xl hover:bg-bgsecondary group hover:text-secondary util-transition-colors' key={post.id}>
                            <NavLink
                                to={`/posts/${post.slug}`}
                            >
                                <h2 className="text-xl">{post.title}</h2>
                                <p className="text-md">{new Date(post.created_at).toLocaleDateString()}</p>
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
