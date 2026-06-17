interface AdminMetaBoxProps {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}

/** 管理后台指标卡片 */
export function AdminMetaBox({ label, value, sub, accent }: AdminMetaBoxProps) {
  return (
    <div className="rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4">
      <p className="text-xs text-dashboard-neutral/55">{label}</p>
      <p
        className={[
          'mt-1 text-lg font-semibold',
          accent ? 'text-dashboard-military' : 'text-white',
        ].join(' ')}
      >
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-dashboard-neutral/50">{sub}</p>}
    </div>
  );
}
