import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { getRegionFeatureStats } from '@/lib/admin/stats';

export default function AdminRegionsPage() {
  const regions = getRegionFeatureStats();

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="区域数据集"
        description="ALL_REGION_IDS 注册表：各区域 dataNamespace、dataset 挂载状态及种子要素统计。"
      />

      <div className="space-y-4">
        {regions.map((region) => (
          <article
            key={region.regionId}
            className="rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4 sm:p-5"
          >
            <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="text-base font-medium text-white">{region.name}</h2>
                <p className="mt-0.5 font-mono text-xs text-dashboard-neutral/55">
                  {region.regionId}
                </p>
              </div>
              <div className="flex gap-2 text-xs">
                <Badge active={region.enabled} label={region.enabled ? '已启用' : '未启用'} />
                <Badge active={region.hasDataset} label={region.hasDataset ? '有 dataset' : '无 dataset'} />
              </div>
            </div>

            <dl className="mb-4 grid gap-2 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-dashboard-neutral/55">数据命名空间</dt>
                <dd className="font-mono text-dashboard-neutral/80">{region.dataNamespace}</dd>
              </div>
              <div>
                <dt className="text-xs text-dashboard-neutral/55">可用图层</dt>
                <dd className="tabular-nums text-white">{region.layers.length}</dd>
              </div>
              <div>
                <dt className="text-xs text-dashboard-neutral/55">种子要素总数</dt>
                <dd className="tabular-nums font-semibold text-dashboard-military">
                  {region.totalFeatures}
                </dd>
              </div>
            </dl>

            {Object.keys(region.layerCounts).length > 0 && (
              <div>
                <p className="mb-2 text-xs text-dashboard-neutral/55">按图层要素分布</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(region.layerCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([layerId, count]) => (
                      <span
                        key={layerId}
                        className="rounded border border-dashboard-neutral/15 px-2 py-0.5 text-xs text-dashboard-neutral/75"
                      >
                        <span className="font-mono text-dashboard-neutral/50">{layerId}</span>
                        <span className="ml-1.5 tabular-nums text-dashboard-military">{count}</span>
                      </span>
                    ))}
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

function Badge({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={[
        'rounded-full px-2 py-0.5',
        active ? 'bg-green-500/15 text-green-400' : 'bg-dashboard-neutral/10 text-dashboard-neutral/50',
      ].join(' ')}
    >
      {label}
    </span>
  );
}
