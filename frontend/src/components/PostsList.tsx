import { NavLink } from 'react-router';

import usePosts from '../hooks/usePosts';
import type { Post } from '../types/types';
import { extractExcerpt } from '../utils/excerpt';
import { estimateReadingTime } from '../utils/readingTime';

function PostCard({ post }: { post: Post }) {
  const excerpt = post.tldr || extractExcerpt(post.content, 140);
  const readingTime = estimateReadingTime(post.content);

  return (
    <article className="group w-full rounded-xl border border-bgsecondary/30 bg-bgprimary p-5 transition-all duration-300 hover:border-bgsecondary/60 hover:bg-bgsecondary/10 hover:shadow-sm">
      <NavLink
        to={`/posts/${post.slug}`}
        className="block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-secondary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bgprimary"
      >
        <h2 className="mb-1.5 text-lg font-bold text-primary transition-colors duration-300 group-hover:text-secondary">
          {post.title}
        </h2>

        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-primary/60">
          <time dateTime={post.created_at}>
            {new Date(post.created_at).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <span>·</span>
          <span>{readingTime}</span>
          {post.views > 0 && (
            <>
              <span>·</span>
              <span>{post.views} views</span>
            </>
          )}
        </div>

        {excerpt && (
          <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-primary/70">{excerpt}</p>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map(tag => (
              <span
                key={tag.id}
                className="rounded-full bg-bgsecondary/60 px-2.5 py-0.5 text-xs font-medium text-secondary transition-colors duration-200 hover:bg-bgsecondary"
              >
                {tag.name}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="rounded-full bg-bgsecondary/40 px-2.5 py-0.5 text-xs text-primary/50">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </NavLink>
    </article>
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
    <div className="w-full space-y-4">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default PostsList;
