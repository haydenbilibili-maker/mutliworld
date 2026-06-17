import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { formatBytes, formatDateTime } from '@/lib/admin/format';
import { getAdminStats, getRegionFeatureStats } from '@/lib/admin/stats';
import { LAYER_LABELS } from '@/lib/constants';
import type { LayerId } from '@/types/geo';

export default function AdminGeodataPage() {
  const { geodataCache } = getAdminStats();
  const regionStats = getRegionFeatureStats();

  const globalLayerCounts: Record<string, number> = {};
  for (const region of regionStats) {
    for (const [layerId, count] of Object.entries(region.layerCounts)) {
      globalLayerCounts[layerId] = (globalLayerCounts[layerId] ?? 0) + count;
    }
  }

  const sortedLayers = Object.entries(globalLayerCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="Geodata 缓存状态"
        description="查看各区域种子数据要素统计，以及 npm run data:fetch 写入的静态缓存文件状态。"
        breadcrumbs={[
          { label: '管理后台', href: '/admin' },
          { label: '数据管理' },
          { label: 'Geodata 缓存' },
        ]}
      />

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-medium text-white">区域要素统计（种子数据）</h2>
        <p className="mb-3 text-xs text-dashboard-neutral/55">
          通过 buildRegionGeoJSON 服务端聚合，时间窗为各区域默认 timeRange。
        </p>
        <div className="overflow-x-auto rounded-xl border border-dashboard-neutral/15">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-dashboard-neutral/15 bg-white/[0.03] text-xs text-dashboard-neutral/60">
              <tr>
                <th className="px-3 py-2 font-medium">区域</th>
                <th className="px-3 py-2 font-medium">ID</th>
                <th className="px-3 py-2 font-medium">启用</th>
                <th className="px-3 py-2 font-medium">图层数</th>
                <th className="px-3 py-2 font-medium">要素总数</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashboard-neutral/10">
              {regionStats.map((region) => (
                <tr key={region.regionId} className="hover:bg-white/[0.02]">
                  <td className="px-3 py-2 text-white">{region.name}</td>
                  <td className="px-3 py-2 font-mono text-xs text-dashboard-neutral/70">
                    {region.regionId}
                  </td>
                  <td className="px-3 py-2">
                    {region.enabled ? (
                      <span className="text-green-400">是</span>
                    ) : (
                      <span className="text-dashboard-neutral/45">否</span>
                    )}
                  </td>
                  <td className="px-3 py-2 tabular-nums text-dashboard-neutral/80">
                    {region.layers.length}
                  </td>
                  <td className="px-3 py-2 tabular-nums font-medium text-dashboard-military">
                    {region.totalFeatures}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-medium text-white">图层要素汇总</h2>
        <div className="overflow-x-auto rounded-xl border border-dashboard-neutral/15">
          <table className="w-full min-w-[400px] text-left text-sm">
            <thead className="border-b border-dashboard-neutral/15 bg-white/[0.03] text-xs text-dashboard-neutral/60">
              <tr>
                <th className="px-3 py-2 font-medium">图层</th>
                <th className="px-3 py-2 font-medium">LayerId</th>
                <th className="px-3 py-2 font-medium">要素数</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashboard-neutral/10">
              {sortedLayers.map(([layerId, count]) => (
                <tr key={layerId} className="hover:bg-white/[0.02]">
                  <td className="px-3 py-2 text-white">
                    {LAYER_LABELS[layerId as LayerId] ?? layerId}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-dashboard-neutral/60">
                    {layerId}
                  </td>
                  <td className="px-3 py-2 tabular-nums text-dashboard-military">{count}</td>
                </tr>
              ))}
              {sortedLayers.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-3 py-8 text-center text-dashboard-neutral/50">
                    暂无要素
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-white">静态缓存文件</h2>
        <p className="mb-3 text-sm text-dashboard-neutral/70">
          刷新命令：<code className="text-dashboard-military">npm run data:fetch</code>
          {' · '}
          可选 <code className="text-dashboard-military">npm run data:fetch -- --region china</code>
        </p>
        <div className="overflow-x-auto rounded-xl border border-dashboard-neutral/15">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-dashboard-neutral/15 bg-white/[0.03] text-xs text-dashboard-neutral/60">
              <tr>
                <th className="px-3 py-2 font-medium">区域</th>
                <th className="px-3 py-2 font-medium">缓存</th>
                <th className="px-3 py-2 font-medium">抓取时间</th>
                <th className="px-3 py-2 font-medium">要素数</th>
                <th className="px-3 py-2 font-medium">大小</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashboard-neutral/10">
              {geodataCache.map((entry) => (
                <tr key={entry.regionId} className="hover:bg-white/[0.02]">
                  <td className="px-3 py-2 font-mono text-xs text-white">{entry.regionId}</td>
                  <td className="px-3 py-2">
                    {entry.exists ? (
                      <span className="text-green-400">存在</span>
                    ) : (
                      <span className="text-dashboard-neutral/45">缺失</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-dashboard-neutral/80">
                    {formatDateTime(entry.fetchedAt)}
                  </td>
                  <td className="px-3 py-2 tabular-nums text-dashboard-military">
                    {entry.featureCount}
                  </td>
                  <td className="px-3 py-2 text-dashboard-neutral/70">
                    {entry.fileSize ? formatBytes(entry.fileSize) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
