import type { ReactNode } from 'react';

import Aside from '../components/Aside.tsx';

interface MainContentLayoutProps {
  children: ReactNode;
  asideContent?: ReactNode;
  widthSize?: 'narrow' | 'normal' | 'wide' | 'screen';
  className?: string;
}

function MainContentLayout({
  children,
  asideContent,
  widthSize,
  className,
}: MainContentLayoutProps) {
  const widthClass = widthSize
    ? widthSize === 'normal'
      ? 'md:w-6xl'
      : widthSize === 'narrow'
        ? 'md:w-4xl'
        : widthSize === 'wide'
          ? 'md:w-3/5'
          : widthSize === 'screen'
            ? 'md:w-[90vw]'
            : 'md:w-6xl'
    : asideContent
      ? 'w-7xl'
      : 'w-5xl';

  return (
    <div
      className={`${className || ''} mx-auto max-w-full ${widthClass} flex flex-col gap-8 px-4 pb-6 md:flex-row md:items-start md:gap-12 md:px-6`}
    >
      <main className="min-h-full min-w-0 flex-1">{children}</main>
      {asideContent ? <Aside>{asideContent}</Aside> : null}
    </div>
  );
}

export default MainContentLayout;
