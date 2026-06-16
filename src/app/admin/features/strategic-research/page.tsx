import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { getAdminStats } from '@/lib/admin/stats';

export default function AdminStrategicResearchPage() {
  const { strategicResearch } = getAdminStats();

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="战略研究专题"
        description="STRATEGIC_RESEARCH_PANELS 注册表：研究主题启用状态、适用区域与模块数量。"
      />

      <div className="overflow-x-auto rounded-xl border border-dashboard-neutral/15">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-dashboard-neutral/15 bg-white/[0.03] text-xs text-dashboard-neutral/60">
            <tr>
              <th className="px-3 py-2 font-medium">主题</th>
              <th className="px-3 py-2 font-medium">ID</th>
              <th className="px-3 py-2 font-medium">状态</th>
              <th className="px-3 py-2 font-medium">模块数</th>
              <th className="px-3 py-2 font-medium">适用区域</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dashboard-neutral/10">
            {strategicResearch.map((panel) => (
              <tr key={panel.id} className="hover:bg-white/[0.02]">
                <td className="px-3 py-2">
                  <span className="mr-1.5" aria-hidden>
                    {panel.icon}
                  </span>
                  <span className="text-white">{panel.title}</span>
                  <p className="mt-0.5 text-xs text-dashboard-neutral/55">{panel.subtitle}</p>
                </td>
                <td className="px-3 py-2 font-mono text-xs text-dashboard-neutral/60">
                  {panel.id}
                </td>
                <td className="px-3 py-2">
                  {panel.enabled ? (
                    <span className="text-green-400">已启用</span>
                  ) : (
                    <span className="text-dashboard-neutral/45">筹备中</span>
                  )}
                </td>
                <td className="px-3 py-2 tabular-nums text-dashboard-military">
                  {panel.moduleCount}
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {panel.regions.map((regionId) => (
                      <span
                        key={regionId}
                        className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[10px] text-dashboard-neutral/70"
                      >
                        {regionId}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-dashboard-neutral/50">
        新增主题：在 src/regions/strategic-research/registry.ts 的 STRATEGIC_RESEARCH_PANELS 中追加注册项。
      </p>
    </div>
  );
}
