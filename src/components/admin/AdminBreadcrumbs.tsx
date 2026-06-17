import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminBreadcrumbsProps {
  items: BreadcrumbItem[];
}

/** 管理后台面包屑 */
export function AdminBreadcrumbs({ items }: AdminBreadcrumbsProps) {
  return (
    <nav aria-label="面包屑" className="mb-3 flex flex-wrap items-center gap-1.5 text-xs">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {index > 0 && <span className="text-dashboard-neutral/35">/</span>}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-dashboard-neutral/60 transition-colors hover:text-dashboard-military"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-dashboard-neutral/85' : 'text-dashboard-neutral/60'}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
