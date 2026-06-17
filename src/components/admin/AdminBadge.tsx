interface AdminBadgeProps {
  active?: boolean;
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'muted';
}

const VARIANT_CLASSES: Record<NonNullable<AdminBadgeProps['variant']>, string> = {
  default: 'bg-dashboard-military/15 text-dashboard-military',
  success: 'bg-green-500/15 text-green-400',
  warning: 'bg-amber-500/15 text-amber-400',
  danger: 'bg-red-500/15 text-red-400',
  muted: 'bg-dashboard-neutral/10 text-dashboard-neutral/50',
};

/** 管理后台状态徽章 */
export function AdminBadge({ active, label, variant }: AdminBadgeProps) {
  const resolved =
    variant ?? (active === undefined ? 'default' : active ? 'success' : 'muted');

  return (
    <span className={['rounded-full px-2 py-0.5 text-xs', VARIANT_CLASSES[resolved]].join(' ')}>
      {label}
    </span>
  );
}
