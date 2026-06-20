'use client';

import { useMemo, useState } from 'react';
import { AdminSearchInput, filterTableRows } from '@/components/admin/AdminSearchInput';
import { AdminBadge } from '@/components/admin/AdminBadge';
import type { LayerId } from '@/types/geo';
import type { SpatialTier } from '@/types/tier';

const TIER_LABELS: Record<SpatialTier, string> = {
  surface: '地表',
  subsurface: '洋底',
  space: '宇宙',
  near_earth: '近地',
};

interface LayerRow {
  layerId: LayerId;
  label: string;
  tier: SpatialTier;
  sourceKind: 'live_api' | 'static_embed' | 'seed';
  sourceLabel: string;
  enabledRegionCount: number;
  hint?: string;
}

interface AdminLayersTableProps {
  layers: LayerRow[];
}

function sourceVariant(kind: LayerRow['sourceKind']) {
  if (kind === 'live_api') return 'success' as const;
  if (kind === 'static_embed') return 'warning' as const;
  return 'muted' as const;
}

/** 可搜索的图层配置表 */
export function AdminLayersTable({ layers }: AdminLayersTableProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () =>
      filterTableRows(layers, query, (row) =>
        [row.layerId, row.label, row.sourceLabel, TIER_LABELS[row.tier], row.hint ?? ''].join(' '),
      ),
    [layers, query],
  );

  return (
    <div>
      <div className="mb-4">
        <AdminSearchInput
          placeholder="搜索 LayerId、标签、空间层…"
          value={query}
          onChange={setQuery}
        />
        <p className="mt-2 text-xs text-dashboard-neutral/50">
          共 {layers.length} 个图层 · 显示 {filtered.length} 条
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-dashboard-neutral/15">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-dashboard-neutral/15 bg-white/[0.03] text-xs text-dashboard-neutral/60">
            <tr>
              <th className="px-3 py-2 font-medium">LayerId</th>
              <th className="px-3 py-2 font-medium">中文标签</th>
              <th className="px-3 py-2 font-medium">空间层</th>
              <th className="px-3 py-2 font-medium">数据来源</th>
              <th className="px-3 py-2 font-medium">启用区域数</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dashboard-neutral/10">
            {filtered.map((row) => (
              <tr key={row.layerId} className="hover:bg-white/[0.02]">
                <td className="px-3 py-2 font-mono text-xs text-dashboard-military">{row.layerId}</td>
                <td className="px-3 py-2">
                  <span className="text-white">{row.label}</span>
                  {row.hint && (
                    <p className="mt-0.5 text-[10px] text-dashboard-neutral/50">{row.hint}</p>
                  )}
                </td>
                <td className="px-3 py-2 text-dashboard-neutral/75">{TIER_LABELS[row.tier]}</td>
                <td className="px-3 py-2">
                  <AdminBadge variant={sourceVariant(row.sourceKind)} label={row.sourceLabel} />
                </td>
                <td className="px-3 py-2 tabular-nums text-dashboard-military">
                  {row.enabledRegionCount}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-dashboard-neutral/50">
                  无匹配图层
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
