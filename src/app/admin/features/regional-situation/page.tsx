import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { getAdminStats } from '@/lib/admin/stats';
import { listRegions } from '@/regions';

export default function AdminRegionalSituationPage() {
  const { regionalSituation } = getAdminStats();
  const regions = listRegions();

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="区域态势"
        description="regional-situation 模块：社媒热度、趋势话题与态势快讯，注入 RegionalSituationPanel 与高热度地图标记。"
        breadcrumbs={[
          { label: '管理后台', href: '/admin' },
          { label: '功能配置' },
          { label: '区域态势' },
        ]}
      />

      <div className="mb-6 rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4">
        <p className="text-xs text-dashboard-neutral/55">全区域条目合计</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums text-white">
          {regionalSituation.total}
        </p>
        <p className="mt-2 text-xs text-dashboard-neutral/50">
          API：<code className="text-dashboard-military">GET /api/regional-situation?region=china</code>
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-dashboard-neutral/15">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-dashboard-neutral/15 bg-white/[0.03] text-xs text-dashboard-neutral/60">
            <tr>
              <th className="px-3 py-2 font-medium">区域</th>
              <th className="px-3 py-2 font-medium">条目数</th>
              <th className="px-3 py-2 font-medium">社媒</th>
              <th className="px-3 py-2 font-medium">趋势</th>
              <th className="px-3 py-2 font-medium">态势</th>
              <th className="px-3 py-2 font-medium">地图</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dashboard-neutral/10">
            {regions.map((region) => {
              const types = regionalSituation.typeByRegion[region.id] ?? {};
              return (
                <tr key={region.id} className="hover:bg-white/[0.02]">
                  <td className="px-3 py-2 text-white">{region.name}</td>
                  <td className="px-3 py-2 tabular-nums text-dashboard-military">
                    {regionalSituation.byRegion[region.id] ?? 0}
                  </td>
                  <td className="px-3 py-2 tabular-nums text-dashboard-neutral/75">{types['社媒'] ?? 0}</td>
                  <td className="px-3 py-2 tabular-nums text-dashboard-neutral/75">{types['趋势'] ?? 0}</td>
                  <td className="px-3 py-2 tabular-nums text-dashboard-neutral/75">{types['态势'] ?? 0}</td>
                  <td className="px-3 py-2">
                    <Link
                      href={`/?region=${region.id}`}
                      className="text-xs text-dashboard-military hover:underline"
                    >
                      预览
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-dashboard-neutral/50">
        高热度（heat ≥ 75）条目会同步至 hotspots 图层标记。
      </p>
    </div>
  );
}
