interface AdminLoadingSkeletonProps {
  rows?: number;
  className?: string;
}

/** 管理后台加载骨架 */
export function AdminLoadingSkeleton({ rows = 4, className = '' }: AdminLoadingSkeletonProps) {
  return (
    <div className={['animate-pulse space-y-3', className].join(' ')}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-10 rounded-lg bg-white/[0.04]"
          style={{ width: `${88 - i * 8}%` }}
        />
      ))}
    </div>
  );
}

/** 表格行骨架 */
export function AdminTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-dashboard-neutral/15">
      <div className="border-b border-dashboard-neutral/15 bg-white/[0.03] px-3 py-3">
        <div className="h-4 w-32 animate-pulse rounded bg-white/[0.06]" />
      </div>
      <div className="divide-y divide-dashboard-neutral/10">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 px-3 py-3">
            <div className="h-4 flex-1 animate-pulse rounded bg-white/[0.04]" />
            <div className="h-4 w-16 animate-pulse rounded bg-white/[0.04]" />
            <div className="h-4 w-24 animate-pulse rounded bg-white/[0.04]" />
          </div>
        ))}
      </div>
    </div>
  );
}
