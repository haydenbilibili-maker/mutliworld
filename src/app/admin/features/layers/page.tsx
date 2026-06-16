import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { getAdminStats } from '@/lib/admin/stats';
import { LAYER_LABELS } from '@/lib/constants';
import { listRegions } from '@/regions';
import type { LayerId } from '@/types/geo';
import type { SpatialTier } from '@/types/tier';

const TIER_LABELS: Record<SpatialTier, string> = {
  surface: '地表',
  subsurface: '洋底',
  space: '宇宙',
};

export default function AdminLayersPage() {
  const { layers } = getAdminStats();
  const regions = listRegions();

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="区域与图层配置"
        description="全部 LayerId 常量定义（LAYER_LABELS）及按空间层分组；各区域声明的可用图层列表。"
      />

      {(Object.keys(layers.byTier) as SpatialTier[]).map((tierId) => {
        const tierLayers = layers.byTier[tierId];
        return (
          <section key={tierId} className="mb-8">
            <h2 className="mb-3 text-sm font-medium text-white">
              {TIER_LABELS[tierId]}层 · {tierLayers.length} 个图层
            </h2>
            <div className="overflow-x-auto rounded-xl border border-dashboard-neutral/15">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="border-b border-dashboard-neutral/15 bg-white/[0.03] text-xs text-dashboard-neutral/60">
                  <tr>
                    <th className="px-3 py-2 font-medium">LayerId</th>
                    <th className="px-3 py-2 font-medium">中文标签</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashboard-neutral/10">
                  {tierLayers.map((layerId) => (
                    <tr key={layerId} className="hover:bg-white/[0.02]">
                      <td className="px-3 py-2 font-mono text-xs text-dashboard-military">
                        {layerId}
                      </td>
                      <td className="px-3 py-2 text-white">
                        {LAYER_LABELS[layerId as LayerId]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}

      <section>
        <h2 className="mb-3 text-sm font-medium text-white">各区域启用图层</h2>
        <div className="space-y-4">
          {regions.map((region) => (
            <div
              key={region.id}
              className="rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h3 className="font-medium text-white">{region.name}</h3>
                <span className="font-mono text-xs text-dashboard-neutral/50">{region.id}</span>
                {!region.enabled && (
                  <span className="rounded bg-dashboard-neutral/15 px-1.5 py-0.5 text-[10px] text-dashboard-neutral/60">
                    未启用
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {region.layers.map((layerId) => (
                  <span
                    key={layerId}
                    className="rounded-md border border-dashboard-neutral/20 bg-black/20 px-2 py-0.5 text-xs text-dashboard-neutral/80"
                    title={layerId}
                  >
                    {LAYER_LABELS[layerId]}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
