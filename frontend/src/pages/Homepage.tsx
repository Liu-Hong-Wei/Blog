import { Suspense, lazy } from 'react';
import { NavLink } from 'react-router';

import HeroSection from '../components/HeroSection';
import { ComponentLoadingSpinner } from '../components/Spinners';

const SiteStats = lazy(() => import('../components/SiteStats'));
const LatestPosts = lazy(() => import('../components/LatestPosts'));
const LatestIdeas = lazy(() => import('../components/LatestIdeas'));

function SiteStatsSkeleton() {
  return (
    <section aria-hidden="true" className="border-b border-bgsecondary/40 px-4 py-14 md:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-4">
          <span className="h-px w-8 bg-primary/30" />
          <span className="text-xs tracking-[0.2em] text-primary/50 uppercase">at a glance</span>
        </div>

        <div className="flex flex-col gap-10 md:flex-row md:gap-6">
          <div className="flex flex-1 flex-col items-start gap-2">
            <span className="h-9 w-16 animate-pulse rounded bg-bgsecondary/50 md:h-12 md:w-20" />
            <span className="h-4 w-12 animate-pulse rounded bg-bgsecondary/30" />
          </div>
          <div aria-hidden className="hidden w-px self-stretch bg-bgsecondary/50 md:block" />
          <div className="flex flex-1 flex-col items-start gap-2">
            <span className="h-9 w-16 animate-pulse rounded bg-bgsecondary/50 md:h-12 md:w-20" />
            <span className="h-4 w-12 animate-pulse rounded bg-bgsecondary/30" />
          </div>
          <div aria-hidden className="hidden w-px self-stretch bg-bgsecondary/50 md:block" />
          <div className="flex flex-1 flex-col items-start gap-2">
            <span className="h-9 w-20 animate-pulse rounded bg-bgsecondary/50 md:h-12 md:w-24" />
            <span className="h-4 w-20 animate-pulse rounded bg-bgsecondary/30" />
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  to,
  cta,
}: {
  eyebrow: string;
  title: string;
  to?: string;
  cta?: string;
}) {
  return (
    <div className="mb-10 flex items-end justify-between gap-4">
      <div>
        <div className="mb-3 flex items-center gap-3 text-xs tracking-[0.2em] text-primary/50 uppercase">
          <span className="h-px w-8 bg-primary/30" />
          <span>{eyebrow}</span>
        </div>
        <h2 className="font-serif text-3xl leading-tight font-bold tracking-tight text-primary md:text-4xl">
          {title}
        </h2>
      </div>
      {to && cta && (
        <NavLink
          to={to}
          className="group hidden shrink-0 items-center gap-1 text-sm font-medium text-secondary transition-colors hover:text-secondary/80 md:inline-flex"
        >
          {cta}
          <span
            aria-hidden
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          >
            →
          </span>
        </NavLink>
      )}
    </div>
  );
}

function Homepage() {
  return (
    <div>
      <HeroSection />

      <Suspense fallback={<SiteStatsSkeleton />}>
        <SiteStats />
      </Suspense>

      {/* 主体区：左侧 Latest Posts (主)，右侧 Latest Ideas (辅) */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-x-16 gap-y-16 md:grid-cols-[2fr_1fr]">
          {/* Latest Posts */}
          <div>
            <SectionHeading eyebrow="recent writing" title="最新文章" to="/posts" cta="所有文章" />
            <Suspense fallback={<ComponentLoadingSpinner loading="Loading posts..." />}>
              <LatestPosts limit={5} />
            </Suspense>
            <div className="mt-8 md:hidden">
              <NavLink
                to="/posts"
                className="group inline-flex items-center gap-1 text-sm font-medium text-secondary"
              >
                所有文章
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </NavLink>
            </div>
          </div>

          {/* Latest Ideas */}
          <aside>
            <SectionHeading eyebrow="recent thoughts" title="最近想法" />
            <Suspense fallback={<ComponentLoadingSpinner loading="Loading..." />}>
              <LatestIdeas />
            </Suspense>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default Homepage;
