import { motion } from 'motion/react';
import { Suspense, lazy } from 'react';
import { NavLink } from 'react-router';

import ProfileCard from '../components/ProfileCard';
import { ComponentLoadingSpinner } from '../components/Spinners';
import MainContentLayout from '../layouts/MainContentLayout';

const LatestPosts = lazy(() => import('../components/LatestPosts'));

function Homepage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section>
        <MainContentLayout widthSize="screen">
          <ProfileCard compact />
        </MainContentLayout>
      </section>

      {/* Latest Posts Section */}
      <section className="pb-8">
        <MainContentLayout widthSize="narrow">
          <div className="mb-8 flex items-center justify-between">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="text-2xl font-bold text-primary md:text-3xl"
            >
              Latest Posts
            </motion.h2>
            <NavLink
              to="/posts"
              className="group flex items-center gap-1 text-sm font-medium text-secondary transition-colors hover:text-secondary/80"
            >
              View all
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </NavLink>
          </div>
          <Suspense fallback={<ComponentLoadingSpinner loading="Loading posts..." />}>
            <LatestPosts limit={5} />
          </Suspense>
        </MainContentLayout>
      </section>
    </div>
  );
}

export default Homepage;
