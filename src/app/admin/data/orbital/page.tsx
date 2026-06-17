import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTleRefreshSection } from '@/components/admin/AdminTleRefreshSection';
import { AdminMetaBox } from '@/components/admin/AdminMetaBox';
import { formatDateTime } from '@/lib/admin/format';
import { getAdminStats } from '@/lib/admin/stats';

const CATEGORY_LABELS = {
  station: '空间站',
  satellite: '卫星',
  debris: '碎片',
} as const;

export default function AdminOrbitalPage() {
  const { orbital } = getAdminStats();

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="轨道 TLE 数据"
        description="本地 TLE 数据库 data/orbital/tle.json，用于宇宙空间层在轨物体 SGP4 传播与展示。"
        breadcrumbs={[
          { label: '管理后台', href: '/admin' },
          { label: '数据管理' },
          { label: '轨道 TLE' },
        ]}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <AdminMetaBox label="物体总数" value={String(orbital.total)} accent />
        <AdminMetaBox label="数据源" value={orbital.source} />
        <AdminMetaBox label="抓取时间" value={formatDateTime(orbital.fetchedAt)} />
        <AdminMetaBox
          label="数据年龄"
          value={orbital.ageLabel}
          sub={orbital.stale ? `超过 ${orbital.staleThresholdHours}h 建议刷新` : '数据较新'}
        />
        <AdminMetaBox
          label="空间站 / 卫星 / 碎片"
          value={`${orbital.counts.station} / ${orbital.counts.satellite} / ${orbital.counts.debris}`}
        />
      </div>

      <AdminTleRefreshSection showAge />

      <section>
        <h2 className="mb-3 text-sm font-medium text-white">分类统计</h2>
        <div className="overflow-x-auto rounded-xl border border-dashboard-neutral/15">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-dashboard-neutral/15 bg-white/[0.03] text-xs text-dashboard-neutral/60">
              <tr>
                <th className="px-4 py-2 font-medium">类别</th>
                <th className="px-4 py-2 font-medium">数量</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashboard-neutral/10">
              {(Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>).map(
                (key) => (
                  <tr key={key} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-2 text-white">{CATEGORY_LABELS[key]}</td>
                    <td className="px-4 py-2 tabular-nums text-dashboard-military">
                      {orbital.counts[key]}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
