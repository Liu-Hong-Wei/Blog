import MainContentLayout from '../layouts/MainContentLayout';
import usePosts from '../hooks/usePosts';

function Post() {
    const { posts, loading, error } = usePosts();
    // 假设当前只展示第一篇文章，后续可根据路由参数优化
    const post = posts && posts.length > 0 ? posts[0] : null;

    return (
        <MainContentLayout>
            {loading && <div className="p-4">加载中...</div>}
            {error && <div className="p-4 text-red-600">出错了: {error.message}</div>}
            {!loading && !error && !post && <div className="p-4">未找到文章。</div>}
            {!loading && !error && post && (
                <article className="space-y-4">
                    <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
                    <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
                    <div className="prose max-w-none mt-4">{post.content}</div>
                </article>
            )}
        </MainContentLayout>
    );
}

export default Post;