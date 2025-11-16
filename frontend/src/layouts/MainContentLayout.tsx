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
    ? widthSize === 'narrow'
      ? 'w-5xl'
      : widthSize === 'wide'
        ? 'w-3/5'
        : widthSize === 'screen'
          ? 'w-screen'
          : 'w-7xl'
    : (asideContent ? 'w-7xl' : 'w-5xl');

  return (
    <div
      className={`${className || ''} mx-auto ${widthClass} flex flex-col gap-8 px-4 pb-6 md:flex-row md:items-start md:gap-12 md:px-6`}
    >
      <main className="min-w-0 flex-1 min-h-full">{children}</main>
      {asideContent ? <Aside>{asideContent}</Aside> : null}
    </div>
  );
}

export default MainContentLayout;
