import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { getAdminStats } from '@/lib/admin/stats';
import { LAYER_LABELS } from '@/lib/constants';
import type { LayerId } from '@/types/geo';

export default function AdminTiersPage() {
  const { tiers } = getAdminStats();

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="空间层配置"
        description="三位一体空间态势：地表 / 洋底 / 宇宙三层模块注册表与默认图层。"
      />

      <div className="space-y-6">
        {tiers.map((tier) => (
          <article
            key={tier.id}
            className="rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4 sm:p-5"
          >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="text-xl" aria-hidden>
                {tier.icon}
              </span>
              <h2 className="text-base font-medium text-white">{tier.name}</h2>
              <span className="font-mono text-xs text-dashboard-neutral/50">{tier.id}</span>
              <span className="rounded bg-dashboard-neutral/10 px-2 py-0.5 text-[10px] text-dashboard-neutral/60">
                {tier.renderMode}
              </span>
            </div>
            <p className="mb-4 text-sm text-dashboard-neutral/70">{tier.tagline}</p>

            <div className="mb-4">
              <p className="mb-2 text-xs text-dashboard-neutral/55">
                全部图层（{tier.layerCount}）
              </p>
              <div className="flex flex-wrap gap-1.5">
                {tier.layers.map((layerId) => (
                  <span
                    key={layerId}
                    className="rounded-md border border-dashboard-neutral/20 bg-black/20 px-2 py-0.5 text-xs text-dashboard-neutral/80"
                    title={layerId}
                  >
                    {LAYER_LABELS[layerId as LayerId] ?? layerId}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs text-dashboard-neutral/55">默认开启</p>
              <div className="flex flex-wrap gap-1.5">
                {tier.defaultLayers.map((layerId) => (
                  <span
                    key={layerId}
                    className="rounded-md border border-dashboard-military/30 bg-dashboard-military/10 px-2 py-0.5 text-xs text-dashboard-military"
                  >
                    {LAYER_LABELS[layerId as LayerId] ?? layerId}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
