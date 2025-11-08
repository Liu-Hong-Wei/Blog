import type { ReactNode } from 'react';

interface AsideProps {
  children?: ReactNode;
  className?: string;
  innerClassName?: string;
}

function Aside({ children, className, innerClassName }: AsideProps) {
  if (!children) {
    return null;
  }

  return (
    <aside
      className={`sticky bottom-4 z-20 flex w-full flex-none justify-end md:sticky md:top-16 md:bottom-auto md:z-auto md:w-16 md:justify-start ${className || ''}`}
    >
      <div
        className={`flex w-full justify-end md:flex-col md:justify-start md:gap-6 ${innerClassName || ''}`}
      >
        {children}
      </div>
    </aside>
  );
}

export default Aside;
