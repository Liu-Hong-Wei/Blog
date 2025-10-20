import MainContentLayout from '../layouts/MainContentLayout';
import { useParams } from 'react-router';
import { ReactElement, useEffect, useState } from 'react';
import markdownToHtml from '../utils/markdownToHtml';
import usePost from '../hooks/usePost';
import { PageLoadingSpinner } from '../components/Spinners';
import Error from './errors/Error';
import { SuspenseWrapper } from '../components/SuspenseErrorBoundary';

function PostContent({ slug }: { slug: string }) {
    const post = usePost(slug);
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
        <>
            {/* 加载中状态（仅 markdown 处理） */}
            {isProcessing && (<PageLoadingSpinner />)}

            {/* 文章内容 */}
            {!isProcessing && post && (
                <article className="space-y-6 w-full">
                    {/* 文章标题和元信息 */}
                    <header>
                        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <span>{post.views} views</span>
                            <span>{new Date(post.created_at).toLocaleDateString('zh-CN')}</span>
                        </div>
                        {/* 显示标签 */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        )}
                        {/* 显示 TLDR */}
                        {post.tldr && (
                            <div className="mt-4 p-4 bg-secondary/5 border-l-4 border-secondary">
                                <h3 className="text-sm font-semibold text-secondary mb-2">TL;DR</h3>
                                <p className="text-sm text-secondary">{post.tldr}</p>
                            </div>
                        )}
                    </header>

                    {/* 文章内容 */}
                    <main className="prose prose-gray max-w-none">
                        {renderedContent}
                        {!isProcessing && post && !post.content && (
                            <Error emoji='🤔' content='Nothing here' />
                        )}
                    </main>
                </article>
            )}
        </>
    );
}

function Post() {
    const { slug } = useParams<{ slug: string }>();

    return (
        <MainContentLayout>
            <SuspenseWrapper>
                {!slug ? (
                    <Error 
                        emoji="⚠️" 
                        content="Invalid Article Link" 
                        error="The article link is missing or invalid."
                    />
                ) : (
                    <PostContent slug={slug} />
                )}
            </SuspenseWrapper>
        </MainContentLayout>
    );
}

export default Post;