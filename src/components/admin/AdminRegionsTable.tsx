'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AdminSearchInput, filterTableRows } from '@/components/admin/AdminSearchInput';
import { AdminBadge } from '@/components/admin/AdminBadge';
import type { LayerId } from '@/types/geo';
import type { RegionId } from '@/types/region';

interface RegionRow {
  regionId: RegionId;
  name: string;
  enabled: boolean;
  layers: LayerId[];
  totalFeatures: number;
  layerCounts: Record<string, number>;
  dataNamespace: string;
  hasDataset: boolean;
}

interface AdminRegionsTableProps {
  regions: RegionRow[];
}

/** 可搜索的区域数据集列表 */
export function AdminRegionsTable({ regions }: AdminRegionsTableProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () =>
      filterTableRows(regions, query, (row) =>
        [row.regionId, row.name, row.dataNamespace].join(' '),
      ),
    [regions, query],
  );

  return (
    <div>
      <div className="mb-4">
        <AdminSearchInput placeholder="搜索区域名称或 ID…" value={query} onChange={setQuery} />
        <p className="mt-2 text-xs text-dashboard-neutral/50">
          共 {regions.length} 个区域 · 显示 {filtered.length} 条
        </p>
      </div>

      <div className="space-y-4">
        {filtered.map((region) => (
          <article
            key={region.regionId}
            className="rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4 sm:p-5"
          >
            <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="text-base font-medium text-white">{region.name}</h2>
                <p className="mt-0.5 font-mono text-xs text-dashboard-neutral/55">{region.regionId}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <AdminBadge active={region.enabled} label={region.enabled ? '已启用' : '未启用'} />
                <AdminBadge
                  active={region.hasDataset}
                  label={region.hasDataset ? '有 dataset' : '无 dataset'}
                />
                <Link
                  href={`/?region=${region.regionId}`}
                  className="rounded border border-dashboard-military/30 px-2 py-0.5 text-xs text-dashboard-military hover:bg-dashboard-military/10"
                >
                  地图预览 →
                </Link>
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

        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-dashboard-neutral/50">无匹配区域</p>
        )}
      </div>
    </div>
  );
}
