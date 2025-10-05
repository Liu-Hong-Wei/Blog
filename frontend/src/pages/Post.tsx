import MainContentLayout from '../layouts/MainContentLayout';
import usePosts from '../hooks/usePosts';
import { useParams } from 'react-router';
import { ReactElement, useEffect, useState } from 'react';
import markdownToHtml, { MarkdownResult } from '../utils/markdownToHtml';

// 定义内容状态类型
interface ContentState {
    content: ReactElement | null;
    loading: boolean;
    error: string | null;
}

function Post() {
    const { posts, loading, error } = usePosts();
    const { slug } = useParams();
    const post = posts && posts.length > 0 ? posts.find(post => post.slug === slug) : null;

    // 使用新的状态管理
    const [contentState, setContentState] = useState<ContentState>({
        content: null,
        loading: false,
        error: null
    });

    useEffect(() => {
        if (!post?.content) {
            setContentState({
                content: null,
                loading: false,
                error: null
            });
            return;
        }

        // 开始处理 markdown
        setContentState(prev => ({
            ...prev,
            loading: true,
            error: null
        }));

        markdownToHtml(post.content)
            .then((result: MarkdownResult) => {
                if (result.success && result.content) {
                    setContentState({
                        content: result.content,
                        loading: false,
                        error: null
                    });
                } else {
                    setContentState({
                        content: null,
                        loading: false,
                        error: result.error || '内容处理失败'
                    });
                }
            })
            .catch((error) => {
                console.error('Markdown 处理异常:', error);
                setContentState({
                    content: null,
                    loading: false,
                    error: '内容处理时发生未知错误'
                });
            });
    }, [post]);

    return (
        <MainContentLayout>
            {/* 文章加载状态 */}
            {loading && <div className="p-4">加载中...</div>}
            {error && <div className="p-4 text-red-600">出错了: {error.message}</div>}
            {!loading && !error && !post && <div className="p-4">未找到文章。</div>}

            {/* 文章内容 */}
            {!loading && !error && post && (
                <article className="space-y-4 w-full">
                    <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                        <span className="font-extralight">{post.views} views</span>
                        <span className="mx-2">·</span>
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>

                    {/* Markdown 内容处理状态 */}
                    {contentState.loading && (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-gray-600">正在处理内容...</span>
                        </div>
                    )}

                    {contentState.error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="text-red-700 font-medium">内容处理失败</span>
                            </div>
                            <p className="text-red-600 mt-1">{contentState.error}</p>
                            <button
                                onClick={() => {
                                    if (post?.content) {
                                        setContentState(prev => ({ ...prev, loading: true, error: null }));
                                        markdownToHtml(post.content)
                                            .then((result: MarkdownResult) => {
                                                if (result.success && result.content) {
                                                    setContentState({
                                                        content: result.content,
                                                        loading: false,
                                                        error: null
                                                    });
                                                } else {
                                                    setContentState({
                                                        content: null,
                                                        loading: false,
                                                        error: result.error || '内容处理失败'
                                                    });
                                                }
                                            })
                                            .catch(() => {
                                                setContentState({
                                                    content: null,
                                                    loading: false,
                                                    error: '内容处理时发生未知错误'
                                                });
                                            });
                                    }
                                }}
                                className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                            >
                                重试
                            </button>
                        </div>
                    )}

                    {!contentState.loading && !contentState.error && contentState.content && (
                        <div className="prose max-w-none mt-4">
                            {contentState.content}
                        </div>
                    )}

                    {!contentState.loading && !contentState.error && !contentState.content && post?.content && (
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                            暂无内容显示
                        </div>
                    )}
                </article>
            )}
        </MainContentLayout>
    );
}

export default Post;