import { useEffect, useState, useCallback } from 'react';

import type { HeadingItem } from '../utils/extractHeadings';

interface TableOfContentsProps {
  headings: HeadingItem[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerOffset,
        behavior: 'smooth',
      });
      window.history.replaceState(null, '', `#${id}`);
    }
  }, []);

  useEffect(() => {
    if (headings.length === 0) return undefined;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      }
    );

    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden w-48 flex-none lg:block" aria-label="Table of contents">
      <div className="sticky top-20 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-lg border border-bgsecondary/30 bg-bgprimary/50 p-3 backdrop-blur-sm">
        <h3 className="mb-2 text-xs font-bold tracking-wider text-primary/60 uppercase">
          On this page
        </h3>
        <ul className="space-y-0.5">
          {headings.map(heading => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={e => handleClick(e, heading.id)}
                className={`block rounded-md px-2 py-1 text-xs transition-all duration-200 ${
                  activeId === heading.id
                    ? 'bg-bgsecondary/60 font-semibold text-secondary'
                    : 'text-primary/70 hover:bg-bgsecondary/30 hover:text-primary'
                }`}
                style={{ paddingLeft: `${(heading.level - 1) * 10 + 6}px` }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
