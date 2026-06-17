import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { getAdminStats } from '@/lib/admin/stats';
import { listRegions } from '@/regions';

const PANEL_LABELS: Record<string, string> = {
  news: '新闻',
  markets: '市场',
  marquee: '跑马灯',
};

export default function AdminContentHierarchyPage() {
  const { contentHierarchy } = getAdminStats();
  const regions = listRegions();

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="分级展示"
        description="contentFilter 模块：一级区域切换 → 二级 Dock 面板过滤 → 三级地图图层全局。"
        breadcrumbs={[
          { label: '管理后台', href: '/admin' },
          { label: '功能配置' },
          { label: '分级展示' },
        ]}
      />

      <section className="mb-8 space-y-4">
        {contentHierarchy.levels.map((level) => (
          <div
            key={level.id}
            className="rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4"
          >
            <h2 className="text-sm font-medium text-dashboard-military">{level.label}</h2>
            <p className="mt-1 text-xs leading-relaxed text-dashboard-neutral/70">{level.description}</p>
          </div>
        ))}
      </section>

      <section className="mb-8 rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4">
        <h2 className="mb-2 text-sm font-medium text-white">二级过滤面板</h2>
        <p className="mb-3 text-xs text-dashboard-neutral/55">{contentHierarchy.regionSwitcherTooltip}</p>
        <div className="flex flex-wrap gap-2">
          {contentHierarchy.filteredPanels.map((id) => (
            <span
              key={id}
              className="rounded-lg border border-dashboard-military/30 bg-dashboard-military/10 px-3 py-1.5 text-xs text-dashboard-military"
            >
              {PANEL_LABELS[id] ?? id}
              <span className="ml-1 font-mono text-dashboard-neutral/50">({id})</span>
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-white">各区域过滤后条数示例</h2>
        <div className="overflow-x-auto rounded-xl border border-dashboard-neutral/15">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-dashboard-neutral/15 bg-white/[0.03] text-xs text-dashboard-neutral/60">
              <tr>
                <th className="px-3 py-2 font-medium">区域</th>
                <th className="px-3 py-2 font-medium">新闻种子</th>
                <th className="px-3 py-2 font-medium">市场股指</th>
                <th className="px-3 py-2 font-medium">人物</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashboard-neutral/10">
              {regions.map((region) => (
                <tr key={region.id} className="hover:bg-white/[0.02]">
                  <td className="px-3 py-2 text-white">{region.name}</td>
                  <td className="px-3 py-2 tabular-nums text-dashboard-neutral/80">
                    {contentHierarchy.newsFilteredByRegion[region.id] ?? 0}
                  </td>
                  <td className="px-3 py-2 tabular-nums text-dashboard-neutral/80">
                    {contentHierarchy.marketQuotesFilteredByRegion[region.id] ?? 0}
                  </td>
                  <td className="px-3 py-2 tabular-nums text-dashboard-military">
                    {contentHierarchy.personsFilteredByRegion[region.id] ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-dashboard-neutral/50">
          global 区域展示全部内容；具体区域按 regionIds 过滤。FX/加密货币市场项在各区域均可见。
        </p>
      </section>
    </div>
  );
}
