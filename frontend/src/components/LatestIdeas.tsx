import { motion } from 'motion/react';
import { NavLink } from 'react-router';

import useIdeas from '../hooks/useIdeas';
import { formatRelativeTime } from '../utils/relativeTime';

const PREVIEW_LIMIT = 3;
const EXCERPT_LIMIT = 80;

function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}

function LatestIdeas() {
  const ideas = useIdeas();
  const preview = ideas.slice(0, PREVIEW_LIMIT);

  if (preview.length === 0) {
    return (
      <div className="py-8 text-sm text-primary/50">还没有想法记录。</div>
    );
  }

  return (
    <ul className="relative space-y-7 pl-5">
      {/* 时间线竖线 */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-2 bottom-2 left-0 w-px bg-bgsecondary/60"
      />
      {preview.map((idea, idx) => (
        <motion.li
          key={idea.id}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-5%' }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: idx * 0.07 }}
          className="relative"
        >
          <span
            aria-hidden
            className="absolute top-1.5 -left-[22px] h-2 w-2 rounded-full bg-secondary ring-[3px] ring-bgprimary"
          />
          <time
            dateTime={idea.created_at}
            className="block text-xs tracking-wide text-primary/45"
          >
            {formatRelativeTime(idea.created_at)}
          </time>
          <p className="mt-1.5 text-sm leading-relaxed text-primary/80">
            {truncate(idea.content, EXCERPT_LIMIT)}
          </p>
        </motion.li>
      ))}
      <li className="pl-0">
        <NavLink
          to="/ideas"
          className="group inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-secondary transition-colors hover:text-secondary/80"
        >
          所有想法
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </NavLink>
      </li>
    </ul>
  );
}

export default LatestIdeas;
