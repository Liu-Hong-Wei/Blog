function SkeletonLine({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded bg-bgsecondary/60 ${className}`} aria-hidden="true" />
  );
}

export default function PostsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="w-full space-y-6" role="status" aria-label="Loading posts">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-full rounded-2xl border border-bgsecondary/40 bg-bgprimary p-6">
          <SkeletonLine className="mb-3 h-7 w-3/4" />
          <div className="mb-4 flex items-center gap-3">
            <SkeletonLine className="h-4 w-20" />
            <SkeletonLine className="h-4 w-24" />
          </div>
          <SkeletonLine className="mb-2 h-4 w-full" />
          <SkeletonLine className="mb-4 h-4 w-5/6" />
          <div className="flex gap-2">
            <SkeletonLine className="h-6 w-14 rounded-full" />
            <SkeletonLine className="h-6 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
