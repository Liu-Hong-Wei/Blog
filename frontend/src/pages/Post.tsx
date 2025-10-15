import MainContentLayout from '../layouts/MainContentLayout';
import usePosts from '../hooks/usePosts';
import { useParams } from 'react-router';
import { ReactElement, useEffect, useState } from 'react';
import markdownToHtml from '../utils/markdownToHtml';

function Post() {
    const posts = usePosts();
    const { slug } = useParams();
    const post = posts?.find(post => post.slug === slug);

    const [renderedContent, setRenderedContent] = useState<ReactElement | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!post?.content) {
            setRenderedContent(null);
            return;
        }

        setIsProcessing(true);
        markdownToHtml(post.content)
            .then((result) => {
                setRenderedContent(result.success ? result.content || null : null);
            })
            .catch((error) => {
                console.error('Markdown processing failed:', error);
                setRenderedContent(null);
            })
            .finally(() => {
                setIsProcessing(false);
            });
    }, [post?.content]);

    return (
        <MainContentLayout>
            {/* 加载中状态（仅 markdown 处理） */}
            {isProcessing && (
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">处理内容...</span>
                </div>
            )}

            {/* 文章未找到 */}
            {!isProcessing && !post && (
                <div className="p-6 text-center text-gray-600">
                    <p>文章不存在</p>
                </div>
            )}

            {/* 文章内容 */}
            {!isProcessing && post && (
                <article className="space-y-6 w-full">
                    {/* 文章标题和元信息 */}
                    <header>
                        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <span>{post.views} 次浏览</span>
                            <span>{new Date(post.created_at).toLocaleDateString('zh-CN')}</span>
                        </div>
                    </header>

                    {/* 文章内容 */}
                    <main className="prose prose-gray max-w-none">
                        {renderedContent || (
                            <div className="text-gray-500 italic">
                                暂无内容
                            </div>
                        )}
                    </main>
                </article>
            )}
        </MainContentLayout>
    );
}

export default Post;