import { useEffect } from 'react';

import { LightboxProvider, useLightbox } from '../components/Lightbox';
import useIdeas from '../hooks/useIdeas';
import LinkPreviewCard from '../components/LinkPreviewCard';
import useLinkPreview from '../hooks/useLinkPreview';
import { extractUrls } from '../utils/extractUrls';
import MainContentLayout from '../layouts/MainContentLayout';
import type { Idea } from '../types/types';

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

function LinkPreviewItem({ url }: { url: string }) {
  const preview = useLinkPreview(url);
  if (!preview) return null;
  return <LinkPreviewCard {...preview} />;
}

function LinkPreviewsList({ urls }: { urls: string[] }) {
  if (!urls || urls.length === 0) return null;
  return (
    <div className="mt-3 space-y-2">
      {urls.map(url => (
        <LinkPreviewItem key={url} url={url} />
      ))}
    </div>
  );
}

function IdeaImageGrid({ images }: { images: string[] }) {
  const { registerImage, openLightbox } = useLightbox();

  useEffect(() => {
    images.forEach(img => registerImage(img));
  }, [images, registerImage]);

  if (!images || images.length === 0) return null;

  const count = images.length;

  if (count === 1) {
    return (
      <div
        className="mt-3 inline-block max-w-[80%] cursor-zoom-in overflow-hidden rounded-lg bg-bgsecondary/20"
        onClick={() => openLightbox(images[0])}
        onKeyDown={e => {
          if (e.key === 'Enter') openLightbox(images[0]);
        }}
        role="button"
        tabIndex={0}
      >
        <img
          src={images[0]}
          alt="附图 1"
          className="h-auto max-h-80 min-h-[200px] w-auto min-w-[200px] object-contain transition-transform hover:scale-[1.02]"
          loading="lazy"
        />
      </div>
    );
  }

  let gridClass = 'grid gap-1.5 mt-3';
  let imageItems = images;

  if (count === 2 || count === 4) {
    gridClass += ' grid-cols-2 max-w-[70%] sm:max-w-[60%]';
  } else {
    gridClass += ' grid-cols-3 max-w-[100%] sm:max-w-[90%]';
    if (count > 9) {
      imageItems = images.slice(0, 9);
    }
  }

  return (
    <div className={gridClass}>
      {imageItems.map((img, index) => (
        <div
          key={index}
          className="relative aspect-square cursor-zoom-in overflow-hidden rounded-md bg-bgsecondary/20"
          onClick={() => openLightbox(img)}
          onKeyDown={e => {
            if (e.key === 'Enter') openLightbox(img);
          }}
          role="button"
          tabIndex={0}
        >
          <img
            src={img}
            alt={`附图 ${index + 1}`}
            className="absolute inset-0 h-full w-full object-cover transition-transform hover:scale-105"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}

function IdeaCard({ idea }: { idea: Idea }) {
  const urls = extractUrls(idea.content);

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
        <div className="max-w-none text-sm leading-relaxed break-words whitespace-pre-wrap text-primary/85">
          {idea.content}
        </div>

        <LinkPreviewsList urls={urls} />

        {idea.images && idea.images.length > 0 && <IdeaImageGrid images={idea.images} />}
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
