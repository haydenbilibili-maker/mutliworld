import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminBadge } from '@/components/admin/AdminBadge';
import { getAdminStats } from '@/lib/admin/stats';

const INTENSITY_LABELS = {
  high: '高',
  medium: '中',
} as const;

export default function AdminConflictZonesPage() {
  const { conflictZones } = getAdminStats();

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="冲突区"
        description="GLOBAL_CONFLICT_ZONES 静态注册表：11 个全球主要军事冲突区示意多边形（只读展示）。"
        breadcrumbs={[
          { label: '管理后台', href: '/admin' },
          { label: '数据管理' },
          { label: '冲突区' },
        ]}
      />

      <p className="mb-6 text-xs text-dashboard-neutral/55">
        对应地图图层 <code className="text-dashboard-military">conflict_zones</code> ·
        数据内嵌于 src/regions/global.conflict-zones.ts，非实时测绘精度
      </p>

      <div className="overflow-x-auto rounded-xl border border-dashboard-neutral/15">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-dashboard-neutral/15 bg-white/[0.03] text-xs text-dashboard-neutral/60">
            <tr>
              <th className="px-3 py-2 font-medium">中文名</th>
              <th className="px-3 py-2 font-medium">ID</th>
              <th className="px-3 py-2 font-medium">强度</th>
              <th className="px-3 py-2 font-medium">状态</th>
              <th className="px-3 py-2 font-medium">起始</th>
              <th className="px-3 py-2 font-medium">说明</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dashboard-neutral/10">
            {conflictZones.map((zone) => (
              <tr key={zone.id} className="hover:bg-white/[0.02]">
                <td className="px-3 py-2">
                  <span className="text-white">{zone.nameZh}</span>
                  <p className="mt-0.5 text-[10px] text-dashboard-neutral/50">{zone.name}</p>
                </td>
                <td className="px-3 py-2 font-mono text-xs text-dashboard-neutral/60">{zone.id}</td>
                <td className="px-3 py-2">
                  <AdminBadge
                    variant={zone.intensity === 'high' ? 'danger' : 'warning'}
                    label={INTENSITY_LABELS[zone.intensity]}
                  />
                </td>
                <td className="px-3 py-2 text-dashboard-neutral/75">{zone.status}</td>
                <td className="px-3 py-2 tabular-nums text-dashboard-neutral/70">{zone.since}</td>
                <td className="max-w-md px-3 py-2 text-xs leading-relaxed text-dashboard-neutral/65">
                  {zone.description}
                  {zone.dashed && (
                    <span className="ml-1 text-dashboard-neutral/40">（虚线敏感区）</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-dashboard-neutral/50">
        在地图上预览：{' '}
        <Link href="/?region=global&layers=conflict_zones" className="text-dashboard-military hover:underline">
          全球视图 + 冲突区图层
        </Link>
      </p>
    </div>
  );
}
