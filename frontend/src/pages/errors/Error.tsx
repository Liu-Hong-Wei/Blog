import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router';

const Error = ({
  emoji = '👾',
  content = 'Oops, something went wrong',
  error = '',
  showRefresh = true,
  showGoHome = true,
  showGoBack = false,
}: {
  emoji?: string;
  content?: string;
  error?: string;
  showRefresh?: boolean;
  showGoBack?: boolean;
  showGoHome?: boolean;
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex size-full flex-col items-center justify-center px-6 py-20"
    >
      <div className="mb-6 text-7xl">{emoji}</div>
      <h1 className="mb-3 text-center text-3xl font-bold text-primary md:text-4xl">{content}</h1>
      {error && <p className="mb-6 max-w-md text-center text-lg text-primary/60">{error}</p>}

      <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
        {showRefresh && (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-xl bg-bgsecondary px-5 py-2.5 text-sm font-medium text-primary transition-all duration-200 hover:bg-bgsecondary/80 hover:shadow-sm"
          >
            🔄 Refresh
          </button>
        )}
        {showGoBack && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl border border-bgsecondary px-5 py-2.5 text-sm font-medium text-primary transition-all duration-200 hover:bg-bgsecondary/50"
          >
            ← Go Back
          </button>
        )}
        {showGoHome && (
          <Link
            to="/"
            className="rounded-xl bg-secondary px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-secondary/90 hover:shadow-sm"
          >
            🏠 Go Home
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default Error;
