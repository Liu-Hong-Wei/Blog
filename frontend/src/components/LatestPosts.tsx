import { motion } from 'motion/react';
import { NavLink } from 'react-router';

import usePosts from '../hooks/usePosts';
import type { Post } from '../types/types';
import { extractExcerpt } from '../utils/excerpt';
import { estimateReadingTime } from '../utils/readingTime';

function LatestPostRow({ post, index }: { post: Post; index: number }) {
  const excerpt = post.tldr || extractExcerpt(post.content, 130);
  const readingTime = estimateReadingTime(post.content);

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.05 }}
      className="group border-b border-bgsecondary/40 py-7 last:border-b-0 md:py-8"
    >
      <NavLink
        to={`/posts/${post.slug}`}
        className="block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-secondary/60"
      >
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-xs text-primary/40 tabular-nums">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-primary/50">
              <time dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span className="text-primary/25">·</span>
              <span>{readingTime}</span>
              {post.tags && post.tags.length > 0 && (
                <>
                  <span className="text-primary/25">·</span>
                  <span className="flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag.id} className="text-secondary/80">
                        #{tag.name}
                      </span>
                    ))}
                  </span>
                </>
              )}
            </div>

            <h3 className="font-serif text-xl leading-snug font-bold text-primary transition-colors duration-300 group-hover:text-secondary md:text-2xl">
              {post.title}
              <span
                aria-hidden
                className="ml-2 inline-block translate-x-0 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
              >
                →
              </span>
            </h3>

            {excerpt && (
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-primary/65">
                {excerpt}
              </p>
            )}
          </div>
        </div>
      </NavLink>
    </motion.li>
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
    <ul className="border-t border-bgsecondary/40">
      {latest.map((post, idx) => (
        <LatestPostRow key={post.id} post={post} index={idx} />
      ))}
    </ul>
  );
}
