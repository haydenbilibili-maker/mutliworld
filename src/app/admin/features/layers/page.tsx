import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminLayersTable } from '@/components/admin/AdminLayersTable';
import { getAdminStats } from '@/lib/admin/stats';
import { LAYER_LABELS } from '@/lib/constants';
import { listRegions } from '@/regions';
import type { LayerId } from '@/types/geo';

export default function AdminLayersPage() {
  const { layers } = getAdminStats();
  const regions = listRegions();

  const liveCount = layers.details.filter((l) => l.sourceKind === 'live_api').length;
  const seedCount = layers.details.filter((l) => l.sourceKind === 'seed').length;
  const staticCount = layers.details.filter((l) => l.sourceKind === 'static_embed').length;

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="图层配置"
        description="全部 LayerId 定义：空间层分组、数据来源（实时 API / 静态内嵌 / 种子缓存）及各区域启用计数。"
        breadcrumbs={[
          { label: '管理后台', href: '/admin' },
          { label: '数据管理' },
          { label: '图层配置' },
        ]}
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <SummaryPill label="实时 API" value={liveCount} accent />
        <SummaryPill label="种子/缓存" value={seedCount} />
        <SummaryPill label="静态内嵌" value={staticCount} />
      </div>

      <AdminLayersTable layers={layers.details} />

      <section className="mt-10">
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
                    {LAYER_LABELS[layerId as LayerId]}
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

function SummaryPill({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-dashboard-neutral/15 bg-white/[0.02] px-4 py-3">
      <p className="text-xs text-dashboard-neutral/55">{label}</p>
      <p
        className={[
          'text-xl font-semibold tabular-nums',
          accent ? 'text-dashboard-military' : 'text-white',
        ].join(' ')}
      >
        {value}
      </p>
    </div>
  );
}
