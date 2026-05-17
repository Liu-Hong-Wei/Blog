import { motion } from 'motion/react';
import { NavLink } from 'react-router';

import usePosts from '../hooks/usePosts';
import type { Post } from '../types/types';
import { extractExcerpt } from '../utils/excerpt';
import { estimateReadingTime } from '../utils/readingTime';

function PostRow({ post, index }: { post: Post; index: number }) {
  const excerpt = post.tldr || extractExcerpt(post.content, 160);
  const readingTime = estimateReadingTime(post.content);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: Math.min(index * 0.04, 0.25) }}
      className="group border-b border-bgsecondary/40 py-8 last:border-b-0 md:py-10"
    >
      <NavLink
        to={`/posts/${post.slug}`}
        className="block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-secondary/60"
      >
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
          {post.views > 0 && (
            <>
              <span className="text-primary/25">·</span>
              <span>{post.views} views</span>
            </>
          )}
        </div>

        <h2 className="font-serif text-2xl leading-snug font-bold text-primary transition-colors duration-300 group-hover:text-secondary md:text-3xl">
          {post.title}
          <span
            aria-hidden
            className="ml-2 inline-block opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
          >
            →
          </span>
        </h2>

        {excerpt && (
          <p className="mt-3 line-clamp-2 text-base leading-relaxed text-primary/70">{excerpt}</p>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {post.tags.slice(0, 4).map(tag => (
              <span
                key={tag.id}
                className="text-secondary/80 transition-colors duration-200 group-hover:text-secondary"
              >
                #{tag.name}
              </span>
            ))}
            {post.tags.length > 4 && (
              <span className="text-primary/40">+{post.tags.length - 4}</span>
            )}
          </div>
        )}
      </NavLink>
    </motion.article>
  );
}

function PostsList() {
  const posts = usePosts();

  if (posts.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center py-20 text-primary/60">
        <span className="mb-3 text-3xl">📝</span>
        <p className="text-base">No posts found yet.</p>
        <p className="mt-1.5 text-xs">Stay tuned for upcoming articles!</p>
      </div>
    );
  }

  return (
    <div className="w-full border-t border-bgsecondary/40">
      {posts.map((post, idx) => (
        <PostRow key={post.id} post={post} index={idx} />
      ))}
    </div>
  );
}

export default PostsList;
