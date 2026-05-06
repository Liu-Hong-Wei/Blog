import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { useParams } from 'react-router';

import BackToTopButton from '../components/BackToTopButton';
import { LightboxProvider } from '../components/Lightbox';
import ReadingProgress from '../components/ReadingProgress';
import { ComponentLoadingSpinner } from '../components/Spinners';
import MainContentLayout from '../layouts/MainContentLayout';
import Error from './errors/Error';
import { ErrorBoundary } from '../components/SuspenseErrorBoundary';
import TableOfContents from '../components/TableOfContents';
import usePost from '../hooks/usePost';
import { extractHeadings } from '../utils/extractHeadings';
import markdownToHtml from '../utils/markdownToHtml';
import { estimateReadingTime } from '../utils/readingTime';

export function PostContent({ slug }: { slug: string }) {
  const post = usePost(slug);
  const [renderedContent, setRenderedContent] = useState<ReactElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const headings = extractHeadings(post?.content || '');
  const readingTime = post?.content ? estimateReadingTime(post.content) : '';

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
      <ReadingProgress />
      <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 md:px-6">
        {/* 主内容区 */}
        <article className="min-w-0 flex-1 space-y-5">
          {/* 文章标题和元信息 */}
          <header className="max-w-none border-b border-bgsecondary/40 pb-5">
            <h1 className="mb-3 text-2xl leading-tight font-bold md:text-3xl">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-primary/60 md:text-sm">
              <time dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span>·</span>
              <span>{readingTime}</span>
              <span>·</span>
              <span>{post.views} views</span>
            </div>
            {/* 显示标签 */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {post.tags.map(tag => (
                  <span
                    key={tag.id}
                    className="rounded-full bg-bgsecondary/50 px-2.5 py-0.5 text-xs font-medium text-secondary transition-colors duration-200 hover:bg-bgsecondary"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
            {/* 显示 TLDR */}
            {post.tldr && (
              <div className="mt-4 rounded-xl border-l-4 border-secondary bg-secondary/5 p-3">
                <div className="mb-1 text-xs font-bold tracking-wider text-secondary uppercase">
                  TL;DR
                </div>
                <div className="text-sm leading-relaxed text-secondary/90">{post.tldr}</div>
              </div>
            )}
          </header>

          {/* 文章内容 */}
          <main className="max-w-full">
            {isProcessing && <ComponentLoadingSpinner loading="Sit back and relax..." />}
            {!isProcessing && post && !post.content && (
              <Error emoji="🤔" content="This post is empty?!" />
            )}
            {!isProcessing && renderedContent && (
              <LightboxProvider>{renderedContent}</LightboxProvider>
            )}
          </main>
        </article>

        {/* 侧边栏：TOC + BackToTop */}
        <aside className="hidden flex-none flex-col items-end gap-6 lg:flex lg:w-48">
          <TableOfContents headings={headings} />
          <div className="sticky top-[calc(100vh-5rem)]">
            <BackToTopButton />
          </div>
        </aside>
      </div>

      {/* 移动端 BackToTop */}
      <div className="fixed right-5 bottom-5 lg:hidden">
        <BackToTopButton />
      </div>
    </>
  );
}

function Post() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <MainContentLayout widthSize="screen">
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
