/* eslint-disable jsx-a11y/heading-has-content */
// components/MarkdownComponents.tsx
import type { ComponentProps, ElementType } from 'react';

const mergeClassName = (base: string, className?: string) =>
  className ? `${base} ${className}` : base;

export const markdownComponents: Partial<Record<string, ElementType>> = {
  h1: ({ className, ...props }: ComponentProps<'h1'>) => (
    <h1
      {...props}
      className={mergeClassName(
        'mt-8 mb-4 border-b-2 border-bgsecondary pb-2 text-4xl font-bold',
        className
      )}
    />
  ),
  h2: ({ className, ...props }: ComponentProps<'h2'>) => (
    <h2
      {...props}
      className={mergeClassName(
        'border-gsecondary mt-6 mb-3 border-b-2 pb-2 text-3xl font-semibold',
        className
      )}
    />
  ),
  h3: ({ className, ...props }: ComponentProps<'h3'>) => (
    <h3 {...props} className={mergeClassName('mt-6 mb-3 text-2xl font-medium', className)} />
  ),
  h4: ({ className, ...props }: ComponentProps<'h4'>) => (
    <h4 {...props} className={mergeClassName('mt-5 mb-3 text-xl font-semibold', className)} />
  ),
  h5: ({ className, ...props }: ComponentProps<'h5'>) => (
    <h5
      {...props}
      className={mergeClassName(
        'mt-5 mb-3 text-lg font-semibold tracking-wide text-secondary uppercase',
        className
      )}
    />
  ),
  h6: ({ className, ...props }: ComponentProps<'h6'>) => (
    <h6
      {...props}
      className={mergeClassName(
        'mt-4 mb-2 text-base font-semibold tracking-widest text-secondary/80 uppercase',
        className
      )}
    />
  ),
  p: ({ className, ...props }: ComponentProps<'p'>) => (
    <p
      {...props}
      className={mergeClassName('my-4 text-base leading-relaxed text-primary', className)}
    />
  ),
  a: ({ className, ...props }: ComponentProps<'a'>) => (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      {...props}
      className={mergeClassName(
        'text-secondary underline decoration-secondary/50 util-transition hover:decoration-secondary dark:text-secondary',
        className
      )}
    />
  ),
  blockquote: ({ className, ...props }: ComponentProps<'blockquote'>) => (
    <blockquote
      {...props}
      className={mergeClassName(
        'my-6 rounded-xl border-l-4 border-secondary/40 bg-bgsecondary/20 px-4 py-3 text-lg text-primary italic shadow-sm',
        className
      )}
    />
  ),
  ul: ({ className, ...props }: ComponentProps<'ul'>) => (
    <ul
      {...props}
      className={mergeClassName('my-4 list-disc space-y-2 pl-6 marker:text-secondary', className)}
    />
  ),
  ol: ({ className, ...props }: ComponentProps<'ol'>) => (
    <ol
      {...props}
      className={mergeClassName(
        'my-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-secondary',
        className
      )}
    />
  ),
  li: ({ className, ...props }: ComponentProps<'li'>) => (
    <li {...props} className={mergeClassName('pl-1 leading-relaxed', className)} />
  ),
  img: ({ className, loading = 'lazy', ...props }: ComponentProps<'img'>) => (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      {...props}
      loading={loading}
      className={mergeClassName(
        'my-6 max-h-[480px] w-full rounded-xl border border-bgsecondary object-cover shadow-md',
        className
      )}
    />
  ),
  table: ({ className, ...props }: ComponentProps<'table'>) => (
    <table
      {...props}
      className={mergeClassName(
        'my-6 w-full table-auto overflow-hidden rounded-xl border border-bgsecondary/60 text-left text-sm shadow-sm',
        className
      )}
    />
  ),
  thead: ({ className, ...props }: ComponentProps<'thead'>) => (
    <thead
      {...props}
      className={mergeClassName(
        'bg-bgsecondary/40 text-xs tracking-wide text-primary/70 uppercase',
        className
      )}
    />
  ),
  tbody: ({ className, ...props }: ComponentProps<'tbody'>) => (
    <tbody {...props} className={mergeClassName('divide-y divide-bgsecondary/50', className)} />
  ),
  tr: ({ className, ...props }: ComponentProps<'tr'>) => (
    <tr
      {...props}
      className={mergeClassName(
        'util-transition odd:bg-bgsecondary/20 hover:bg-bgsecondary/30',
        className
      )}
    />
  ),
  th: ({ className, ...props }: ComponentProps<'th'>) => (
    <th {...props} className={mergeClassName('px-4 py-3 font-semibold text-primary', className)} />
  ),
  td: ({ className, ...props }: ComponentProps<'td'>) => (
    <td {...props} className={mergeClassName('px-4 py-3 align-top text-primary', className)} />
  ),
  hr: ({ className, ...props }: ComponentProps<'hr'>) => (
    <hr
      {...props}
      className={mergeClassName(
        'my-8 h-0.5 rounded-xl border-none bg-linear-to-r from-bgprimary via-secondary/40 to-bgprimary',
        className
      )}
    />
  ),
  em: ({ className, ...props }: ComponentProps<'em'>) => (
    <em {...props} className={mergeClassName('text-secondary italic', className)} />
  ),
  strong: ({ className, ...props }: ComponentProps<'strong'>) => (
    <strong {...props} className={mergeClassName('font-bold text-secondary', className)} />
  ),
  del: ({ className, ...props }: ComponentProps<'del'>) => (
    <del {...props} className={mergeClassName('text-secondary/70 line-through', className)} />
  ),
  // TODO: strikethrough: ({ className, ...props }: ComponentProps<'s'>) => (
  //   <s {...props} className={mergeClassName('text-secondary/70 line-through', className)} />
  // ),
  small: ({ className, ...props }: ComponentProps<'small'>) => (
    <small {...props} className={mergeClassName('text-sm text-primary/70', className)} />
  ),
  sup: ({ className, ...props }: ComponentProps<'sup'>) => (
    <sup {...props} className={mergeClassName('ml-0.5 align-super text-xs', className)} />
  ),
  sub: ({ className, ...props }: ComponentProps<'sub'>) => (
    <sub {...props} className={mergeClassName('ml-0.5 align-sub text-xs', className)} />
  ),
  kbd: ({ className, ...props }: ComponentProps<'kbd'>) => (
    <kbd
      {...props}
      className={mergeClassName(
        'rounded-xl border border-bgsecondary bg-bgsecondary/30 px-2 py-1 text-xs font-semibold text-primary shadow-inner',
        className
      )}
    />
  ),
  figure: ({ className, ...props }: ComponentProps<'figure'>) => (
    <figure {...props} className={mergeClassName('my-6 flex flex-col items-center', className)} />
  ),
  figcaption: ({ className, ...props }: ComponentProps<'figcaption'>) => (
    <figcaption
      {...props}
      className={mergeClassName('mt-2 text-sm text-primary/70 italic', className)}
    />
  ),
  details: ({ className, ...props }: ComponentProps<'details'>) => (
    <details
      {...props}
      className={mergeClassName(
        'my-4 overflow-hidden rounded-xl border border-bgsecondary/60 bg-bgsecondary/10',
        className
      )}
    />
  ),
  summary: ({ className, ...props }: ComponentProps<'summary'>) => (
    <summary
      {...props}
      className={mergeClassName(
        'cursor-pointer px-4 py-2 text-primary util-transition hover:text-secondary',
        className
      )}
    />
  ),
  mark: ({ className, ...props }: ComponentProps<'mark'>) => (
    <mark
      {...props}
      className={mergeClassName(
        'rounded-xl bg-yellow-200 px-1 py-0.5 text-primary shadow-sm',
        className
      )}
    />
  ),
  // iframe: ResponsiveIframe, // 实现响应式视频

  // pre 和 code 标签由 rehype-pretty-code 处理，
  // 你可以通过 CSS Modules 或全局 CSS 来定制它的 class
  // 例如：[data-rehype-pretty-code-fragment] { ... }
  // rehype-pretty-code 输出的 HTML 结构是固定的，非常适合用 CSS 定制
  // 你不需要在这里映射 pre 或 code
};
