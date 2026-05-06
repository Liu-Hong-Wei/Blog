import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';

import { LightboxProvider } from '../components/Lightbox';
import useIdeas from '../hooks/useIdeas';
import MainContentLayout from '../layouts/MainContentLayout';
import type { Idea } from '../types/types';
import markdownToHtml from '../utils/markdownToHtml';

function formatIdeaDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const timeStr = date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isToday) {
    return `今天 ${timeStr}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  if (isYesterday) {
    return `昨天 ${timeStr}`;
  }

  return (
    date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) + ` ${timeStr}`
  );
}

function IdeaCard({ idea }: { idea: Idea }) {
  const [content, setContent] = useState<ReactElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    markdownToHtml(idea.content)
      .then(result => {
        if (!cancelled && result.success && result.content) {
          setContent(result.content);
        }
      })
      .catch(error => {
        if (!cancelled) {
          console.error('Markdown rendering failed:', error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [idea.content]);

  return (
    <article className="group relative">
      {/* 时间线节点 */}
      <div className="absolute top-1.5 -left-[26px] h-2.5 w-2.5 rounded-full bg-secondary ring-[3px] ring-bgprimary" />

      {/* 时间戳 */}
      <time
        dateTime={idea.created_at}
        className="text-xs font-medium tracking-wide text-primary/50"
      >
        {formatIdeaDate(idea.created_at)}
      </time>

      {/* 内容卡片 */}
      <div className="mt-2 overflow-hidden rounded-xl border border-bgsecondary/30 bg-bgprimary p-5 transition-all duration-300 hover:border-bgsecondary/60 hover:shadow-sm">
        {content ? (
          <div className="max-w-none text-sm leading-relaxed text-primary/85">{content}</div>
        ) : (
          <div className="space-y-2">
            <div className="h-4 w-3/4 animate-pulse rounded bg-bgsecondary/50" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-bgsecondary/50" />
          </div>
        )}
      </div>
    </article>
  );
}

function IdeasList() {
  const ideas = useIdeas();

  if (ideas.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center py-20 text-primary/60">
        <span className="mb-3 text-3xl">💭</span>
        <p className="text-base">还没有记录任何想法</p>
        <p className="mt-1.5 text-xs">灵感来临时，记得写下来</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-10 pl-6">
      {/* 时间线竖线 */}
      <div className="absolute top-2 bottom-2 left-0 w-px bg-bgsecondary/40" />

      {ideas.map(idea => (
        <IdeaCard key={idea.id} idea={idea} />
      ))}
    </div>
  );
}

function Ideas() {
  return (
    <MainContentLayout widthSize="narrow">
      <LightboxProvider>
        <IdeasList />
      </LightboxProvider>
    </MainContentLayout>
  );
}

export default Ideas;
