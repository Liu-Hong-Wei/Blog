/* eslint-disable jsx-a11y/heading-has-content */
// components/MarkdownComponents.tsx
import { Children, isValidElement, useMemo, type ComponentProps, type ElementType } from 'react';
import LinkPreviewCard from './LinkPreviewCard';
import useLinkPreview from '../hooks/useLinkPreview';

import MarkdownImage from './MarkdownImage';

const mergeClassName = (base: string, className?: string) =>
  className ? `${base} ${className}` : base;

function BareLinkCardLoader({ url }: { url: string }) {
  const preview = useLinkPreview(url);
  if (!preview) return null;
  return (
    <div className="mt-2">
      <LinkPreviewCard {...preview} />
    </div>
  );
}

function ParagraphWithLinkPreview({
  className,
  children,
  ...props
}: ComponentProps<'p'>) {
  const bareLinkInfo = useMemo(() => {
    const childArray = Children.toArray(children);
    if (childArray.length !== 1) return null;
    const child = childArray[0];
    if (!isValidElement(child)) return null;
    if (child.type !== 'a') return null;
    const aProps = child.props as ComponentProps<'a'>;
    // Bare link: the text content of the <a> equals its href
    if (!aProps.href || aProps.children !== aProps.href) return null;
    return { href: aProps.href, aProps };
  }, [children]);

  if (!bareLinkInfo) {
    return (
      <p
        {...props}
        className={mergeClassName('my-3 text-base leading-relaxed text-primary', className)}
      >
        {children}
      </p>
    );
  }

  return (
    <div className="my-3">
      <a
        href={bareLinkInfo.href}
        target="_blank"
        rel="noopener noreferrer"
        className={mergeClassName(
          'text-secondary underline decoration-secondary/50 util-transition hover:decoration-secondary dark:text-secondary',
          (bareLinkInfo.aProps as Record<string, string>).className
        )}
      >
        {bareLinkInfo.href}
      </a>
      <BareLinkCardLoader url={bareLinkInfo.href} />
    </div>
  );
}

export const markdownComponents: Partial<Record<string, ElementType>> = {
  h1: ({ className, ...props }: ComponentProps<'h1'>) => (
    <h1
      {...props}
      className={mergeClassName(
        'mt-6 mb-3 border-b-2 border-bgsecondary pb-2 text-3xl font-bold',
        className
      )}
    />
  ),
  h2: ({ className, ...props }: ComponentProps<'h2'>) => (
    <h2
      {...props}
      className={mergeClassName(
        'border-gsecondary mt-5 mb-2.5 border-b-2 pb-2 text-2xl font-semibold',
        className
      )}
    />
  ),
  h3: ({ className, ...props }: ComponentProps<'h3'>) => (
    <h3 {...props} className={mergeClassName('mt-5 mb-2 text-xl font-medium', className)} />
  ),
  h4: ({ className, ...props }: ComponentProps<'h4'>) => (
    <h4 {...props} className={mergeClassName('mt-4 mb-2 text-lg font-semibold', className)} />
  ),
  h5: ({ className, ...props }: ComponentProps<'h5'>) => (
    <h5
      {...props}
      className={mergeClassName(
        'mt-4 mb-2 text-base font-semibold tracking-wide text-secondary uppercase',
        className
      )}
    />
  ),
  h6: ({ className, ...props }: ComponentProps<'h6'>) => (
    <h6
      {...props}
      className={mergeClassName(
        'mt-3 mb-1.5 text-sm font-semibold tracking-widest text-secondary/80 uppercase',
        className
      )}
    />
  ),
  p: ParagraphWithLinkPreview,
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
        'my-5 rounded-lg border-l-4 border-secondary/40 bg-bgsecondary/20 px-3 py-2.5 text-base text-primary italic shadow-sm',
        className
      )}
    />
  ),
  ul: ({ className, ...props }: ComponentProps<'ul'>) => (
    <ul
      {...props}
      className={mergeClassName('my-3 list-disc space-y-1.5 pl-5 marker:text-secondary', className)}
    />
  ),
  ol: ({ className, ...props }: ComponentProps<'ol'>) => (
    <ol
      {...props}
      className={mergeClassName(
        'my-3 list-decimal space-y-1.5 pl-5 marker:font-semibold marker:text-secondary',
        className
      )}
    />
  ),
  li: ({ className, ...props }: ComponentProps<'li'>) => (
    <li {...props} className={mergeClassName('pl-1 leading-relaxed', className)} />
  ),
  img: MarkdownImage,
  table: ({ className, ...props }: ComponentProps<'table'>) => (
    <table
      {...props}
      className={mergeClassName(
        'my-5 w-full table-auto overflow-hidden rounded-lg border border-bgsecondary/60 text-left text-sm shadow-sm',
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
    <th
      {...props}
      className={mergeClassName('px-3 py-2.5 font-semibold text-primary', className)}
    />
  ),
  td: ({ className, ...props }: ComponentProps<'td'>) => (
    <td {...props} className={mergeClassName('px-3 py-2.5 align-top text-primary', className)} />
  ),
  hr: ({ className, ...props }: ComponentProps<'hr'>) => (
    <hr
      {...props}
      className={mergeClassName(
        'my-6 h-0.5 rounded-lg border-none bg-linear-to-r from-bgprimary via-secondary/40 to-bgprimary',
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
    <small {...props} className={mergeClassName('text-xs text-primary/70', className)} />
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
        'rounded-lg border border-bgsecondary bg-bgsecondary/30 px-1.5 py-0.5 text-xs font-semibold text-primary shadow-inner',
        className
      )}
    />
  ),
  figure: ({ className, ...props }: ComponentProps<'figure'>) => (
    <figure {...props} className={mergeClassName('my-5 flex flex-col items-center', className)} />
  ),
  figcaption: ({ className, ...props }: ComponentProps<'figcaption'>) => (
    <figcaption
      {...props}
      className={mergeClassName('mt-1.5 text-xs text-primary/70 italic', className)}
    />
  ),
  details: ({ className, ...props }: ComponentProps<'details'>) => (
    <details
      {...props}
      className={mergeClassName(
        'my-3 overflow-hidden rounded-lg border border-bgsecondary/60 bg-bgsecondary/10',
        className
      )}
    />
  ),
  summary: ({ className, ...props }: ComponentProps<'summary'>) => (
    <summary
      {...props}
      className={mergeClassName(
        'cursor-pointer px-3 py-1.5 text-primary util-transition hover:text-secondary',
        className
      )}
    />
  ),
  mark: ({ className, ...props }: ComponentProps<'mark'>) => (
    <mark
      {...props}
      className={mergeClassName(
        'rounded-lg bg-yellow-200 px-1 py-0.5 text-primary shadow-sm',
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
