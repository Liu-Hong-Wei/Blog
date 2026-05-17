import { motion } from 'motion/react';

import useLiveTime from '../hooks/useLiveTime';
import { formatLocalDate, formatLocalTime, getGreeting } from '../utils/timeGreeting';

function HeroSection() {
  const now = useLiveTime(30_000);
  const greeting = getGreeting(now);
  const timeStr = formatLocalTime(now);
  const dateStr = formatLocalDate(now);

  return (
    <section
      aria-label="Hero"
      className="relative overflow-hidden border-b border-bgsecondary/40 px-4 pt-16 pb-20 md:pt-24 md:pb-28"
    >
      {/* 极轻的背景网格点阵，营造杂志感 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] dark:opacity-[0.08]"
        style={{
          backgroundImage:
            'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative mx-auto max-w-4xl">
        {/* 顶部一小行：日期 · 时间 */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-10 flex items-center gap-3 font-mono text-xs tracking-widest text-primary/50 uppercase md:text-sm"
        >
          <time dateTime={now.toISOString()}>{dateStr}</time>
          <span className="text-primary/30">·</span>
          <span className="tabular-nums" aria-label="当前时间">
            {timeStr}
          </span>
        </motion.div>

        {/* 问候语 */}
        <motion.p
          key={greeting.text}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
          className="mb-2 text-sm font-medium tracking-wide text-secondary md:text-base"
        >
          {greeting.text}，欢迎来到
        </motion.p>

        {/* 主标题 */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.12 }}
          className="relative inline-block font-serif text-5xl leading-[1.05] font-bold tracking-tight text-primary md:text-7xl"
        >
          HongWei
          <span className="relative ml-1 inline-block text-secondary">
            &apos;s
            {/* 手绘风装饰线 */}
            <svg
              aria-hidden
              viewBox="0 0 120 14"
              preserveAspectRatio="none"
              className="absolute -bottom-2 left-0 h-3 w-full"
            >
              <motion.path
                d="M2 9 C 30 2, 70 14, 118 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.1, ease: 'easeInOut', delay: 0.7 }}
              />
            </svg>
          </span>{' '}
          Blog
        </motion.h1>

        {/* 副标题 / tagline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.25 }}
          className="mt-8 max-w-xl text-base leading-relaxed text-primary/70 md:text-lg"
        >
          记录代码、想法与生活，
          <br />
          <span className="text-primary/50">在这里慢慢写，也慢慢看。</span>
        </motion.p>
      </div>
    </section>
  );
}

export default HeroSection;
