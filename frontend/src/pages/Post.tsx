import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { useParams } from 'react-router';

import BackToTopButton from '../components/BackToTopButton';
import { ComponentLoadingSpinner } from '../components/Spinners';
import MainContentLayout from '../layouts/MainContentLayout';
import Error from './errors/Error';
import { ErrorBoundary } from '../components/SuspenseErrorBoundary';
import usePost from '../hooks/usePost';
import markdownToHtml from '../utils/markdownToHtml';

export function PostContent({ slug }: { slug: string }) {
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
      .then(result => {
        setRenderedContent(result.success ? result.content || null : null);
      })
      .catch(error => {
        console.error('Markdown processing failed:', error);
        setRenderedContent(null);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  }, [post?.content]);

  return (
    <>
      {/* 文章内容 */}
      {post && (
        <article className="w-full space-y-6">
          {/* 文章标题和元信息 */}
          <header className="max-w-none">
            <h1 className="text-4xl font-bold">{post.title}</h1>
            <div className="flex items-center space-x-4 text-lg text-primary">
              <span>{post.views} views</span>
              <span>{new Date(post.created_at).toLocaleDateString('zh-CN')}</span>
            </div>
            {/* 显示标签 */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span
                    key={tag.id}
                    className="text-md rounded-full bg-blue-100 px-2 py-1 text-blue-800"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
            {/* 显示 TLDR */}
            {post.tldr && (
              <div className="mt-4 border-l-4 border-secondary bg-secondary/5 p-4">
                <div className="mb-2 text-xl font-semibold text-secondary">TL;DR</div>
                <div className="text-lg text-secondary">{post.tldr}</div>
              </div>
            )}
          </header>

          {/* 文章内容 */}
          <main className="max-w-full">
            {isProcessing && <ComponentLoadingSpinner loading="Sit back and relax..." />}
            {!isProcessing && renderedContent}
            {/* 加载中状态（仅 markdown 处理） */}
            {!isProcessing && post && !post.content && (
              <Error emoji="🤔" content="This post is empty?!" />
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
    <MainContentLayout asideContent={<BackToTopButton />}>
      <ErrorBoundary>
        {!slug ? (
          <Error
            emoji="⚠️"
            content="Invalid Article Link"
            error="The article link is missing or invalid."
          />
        ) : (
          <PostContent slug={slug} />
        )}
      </ErrorBoundary>
    </MainContentLayout>
  );
}

export default Post;
