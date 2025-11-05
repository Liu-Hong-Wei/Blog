import { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { PageLoadingSpinner } from '../components/Spinners';
import MainContentLayout from '../layouts/MainContentLayout';
import Error from './errors/Error';
import markdownToHtml from '../utils/markdownToHtml';
import usePost from '../hooks/usePost';

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
                    <header className="max-w-none">
                        <h1 className='text-4xl font-bold'>{post.title}</h1>
                        <div className="flex items-center text-lg text-primary space-x-4">
                            <span>{post.views} views</span>
                            <span>{new Date(post.created_at).toLocaleDateString('zh-CN')}</span>
                        </div>
                        {/* 显示标签 */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="px-2 py-1 bg-blue-100 text-blue-800 text-md rounded-full"
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        )}
                        {/* 显示 TLDR */}
                        {post.tldr && (
                            <div className="mt-4 p-4 bg-secondary/5 border-l-4 border-secondary">
                                <div className="text-xl font-semibold text-secondary mb-2">TL;DR</div>
                                <div className="text-lg text-secondary">{post.tldr}</div>
                            </div>
                        )}
                    </header>

                    {/* 文章内容 */}
                    <main className="max-w-full">
                        {renderedContent}
                        {!isProcessing && post && !post.content && (
                            <Error emoji='🤔' content='This post is empty?!' />
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
                {!slug ? (
                    <Error 
                        emoji="⚠️" 
                        content="Invalid Article Link" 
                        error="The article link is missing or invalid."
                    />
                ) : (
                    <PostContent slug={slug} />
                )}
        </MainContentLayout>
    );
}

export default Post;