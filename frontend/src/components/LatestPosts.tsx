import { NavLink } from 'react-router';

import usePosts from '../hooks/usePosts';
import type { Post } from '../types/types';
import { extractExcerpt } from '../utils/excerpt';
import { estimateReadingTime } from '../utils/readingTime';

function LatestPostCard({ post }: { post: Post }) {
  const excerpt = post.tldr || extractExcerpt(post.content, 120);
  const readingTime = estimateReadingTime(post.content);

  return (
    <article className="group">
      <NavLink
        to={`/posts/${post.slug}`}
        className="block rounded-lg border border-bgsecondary/20 bg-bgprimary p-4 transition-all duration-300 hover:border-bgsecondary/50 hover:bg-bgsecondary/10 hover:shadow-sm"
      >
        <div className="mb-1.5 flex items-center gap-2 text-xs text-primary/50">
          <time dateTime={post.created_at}>
            {new Date(post.created_at).toLocaleDateString('zh-CN', {
              month: 'short',
              day: 'numeric',
            })}
          </time>
          <span>·</span>
          <span>{readingTime}</span>
        </div>
        <h3 className="mb-1 text-base font-semibold text-primary transition-colors duration-200 group-hover:text-secondary">
          {post.title}
        </h3>
        {excerpt && (
          <p className="line-clamp-2 text-sm leading-relaxed text-primary/60">{excerpt}</p>
        )}
      </NavLink>
    </article>
  );
}

export default function LatestPosts({ limit = 5 }: { limit?: number }) {
  const posts = usePosts();
  const latest = posts.slice(0, limit);

  if (latest.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-primary/50">
        <span className="mb-3 text-2xl">📝</span>
        <p className="text-sm">No posts published yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {latest.map(post => (
        <LatestPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
