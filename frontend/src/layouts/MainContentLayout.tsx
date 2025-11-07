import type { ReactNode } from 'react';

import Aside from '../components/Aside.tsx';

interface MainContentLayoutProps {
  children: ReactNode;
  asideContent?: ReactNode;
  className?: string;
}

function MainContentLayout({ children, asideContent, className }: MainContentLayoutProps) {
  return (
    <div
      className={`mx-auto w-full ${asideContent ? 'max-w-7xl' : 'max-w-5xl'} flex flex-col gap-8 px-4 pb-6 md:flex-row md:items-start md:gap-12 md:px-6 ${className || ''}`}
    >
      <main className="min-w-0 flex-1">{children}</main>
      {asideContent ? <Aside>{asideContent}</Aside> : null}
    </div>
  );
}

export default MainContentLayout;
