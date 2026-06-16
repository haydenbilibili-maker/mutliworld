import Link from 'next/link';

interface StatCardProps {
  title: string;
  description?: string;
  value?: string | number;
  href: string;
  icon?: string;
}

/** 管理后台概览卡片 */
export function StatCard({ title, description, value, href, icon }: StatCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl border border-dashboard-neutral/20 bg-dashboard-bg/80 p-4 transition-colors hover:border-dashboard-military/40 hover:bg-white/[0.03] sm:p-5"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium text-white sm:text-base">{title}</h3>
        {icon && (
          <span className="shrink-0 text-lg opacity-80" aria-hidden>
            {icon}
          </span>
        )}
      </div>
      {description && (
        <p className="mb-3 flex-1 text-xs leading-relaxed text-dashboard-neutral/70 sm:text-sm">
          {description}
        </p>
      )}
      {value !== undefined && (
        <p className="text-2xl font-semibold tabular-nums text-dashboard-military sm:text-3xl">
          {value}
        </p>
      )}
      <span className="mt-3 text-xs text-dashboard-military/80 group-hover:text-dashboard-military">
        查看详情 →
      </span>
    </Link>
  );
}
