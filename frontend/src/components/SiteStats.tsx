import { motion } from 'motion/react';

import { useCountUp } from '../hooks/useCountUp';
import useIdeas from '../hooks/useIdeas';
import usePosts from '../hooks/usePosts';

interface StatItemProps {
  label: string;
  value: number;
  suffix?: string;
  delay?: number;
}

function StatItem({ label, value, suffix, delay = 0 }: StatItemProps) {
  const { value: animated, ref } = useCountUp({ target: value, durationMs: 1400 });

  return (
    <motion.div
      ref={ref as React.Ref<HTMLDivElement>}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
      className="flex flex-1 flex-col items-start gap-2"
    >
      <span className="font-serif text-4xl leading-none font-bold tracking-tight text-primary tabular-nums md:text-5xl">
        {animated.toLocaleString('en-US')}
        {suffix && (
          <span className="ml-1 text-2xl font-medium text-secondary md:text-3xl">{suffix}</span>
        )}
      </span>
      <span className="text-xs tracking-[0.18em] text-primary/50 uppercase">{label}</span>
    </motion.div>
  );
}

function SiteStats() {
  const posts = usePosts();
  const ideas = useIdeas();

  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

  return (
    <section
      aria-label="Site statistics"
      className="border-b border-bgsecondary/40 px-4 py-14 md:py-20"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-4">
          <span className="h-px w-8 bg-primary/30" />
          <span className="text-xs tracking-[0.2em] text-primary/50 uppercase">at a glance</span>
        </div>

        <div className="flex flex-col gap-10 md:flex-row md:gap-6">
          <StatItem label="Posts" value={posts.length} delay={0} />
          <div aria-hidden className="hidden w-px self-stretch bg-bgsecondary/50 md:block" />
          <StatItem label="Ideas" value={ideas.length} delay={0.1} />
          <div aria-hidden className="hidden w-px self-stretch bg-bgsecondary/50 md:block" />
          <StatItem label="Total Views" value={totalViews} delay={0.2} />
        </div>
      </div>
    </section>
  );
}

export default SiteStats;
