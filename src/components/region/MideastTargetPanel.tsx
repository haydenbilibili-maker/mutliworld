'use client';

/**
 * 中东高价值目标人物面板 — LIFEOS-005（已纳入面板停靠系统）
 * 阵营筛选(置于 header 右侧) + 人物卡(状态着色) + 展开看关联行动。
 */

import { useMemo, useState } from 'react';
import { useRegionData } from '@/hooks/useRegionData';
import { DockPanel } from '@/components/region/DockPanel';
import { MIDEAST_FACTION_LABEL } from '@/regions/middleeast.factions';
import type { MideastFaction } from '@/regions/middleeast.factions';

interface MideastTargetPanelProps {
  className?: string;
}

const STATUS_LABEL: Record<string, string> = {
  active: '活跃',
  restricted: '受限',
  deceased: '已故',
};
const STATUS_COLOR: Record<string, string> = {
  active: '#22c55e',
  restricted: '#f59e0b',
  deceased: '#94a3b8',
};
const FACTION_COLOR: Record<string, string> = {
  us: '#3b82f6',
  israel: '#e2e8f0',
  iran: '#ef4444',
  ru: '#ef4444',
  ua: '#3b82f6',
  nato: '#22d3ee',
};
const factionColor = (f: string) => FACTION_COLOR[f] ?? '#94a3b8';

type FilterKey = 'all' | MideastFaction;

export function MideastTargetPanel({ className = '' }: MideastTargetPanelProps) {
  const { targets } = useRegionData();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const list = useMemo(
    () => (targets ?? []).filter((t) => filter === 'all' || t.faction === filter),
    [targets, filter],
  );

  if (!targets || targets.length === 0) return null;

  const filters: FilterKey[] = ['all', 'iran', 'israel', 'us'];
  const filterChips = (
    <div className="flex gap-1 text-[10px]">
      {filters.map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => setFilter(f)}
          className={`px-1.5 py-0.5 rounded ${filter === f ? 'bg-white/15 text-white' : 'text-dashboard-neutral'}`}
        >
          {f === 'all' ? '全部' : MIDEAST_FACTION_LABEL[f]}
        </button>
      ))}
    </div>
  );

  return (
    <DockPanel
      id="targets"
      title="目标人物"
      count={list.length}
      headerRight={filterChips}
      className={`w-72 max-h-[60vh] ${className}`}
    >
      <ul className="space-y-1.5">
        {list.map((t) => {
          const open = openId === t.id;
          return (
            <li key={t.id} className="rounded-md border border-dashboard-neutral/15">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : t.id)}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left hover:bg-white/5"
              >
                <span
                  className="inline-block w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: factionColor(t.faction) }}
                />
                <span className="flex-1 min-w-0">
                  <span className="text-xs text-white">{t.name}</span>
                  <span className="block text-[10px] text-dashboard-neutral truncate">
                    {t.role}
                  </span>
                </span>
                <span
                  className="text-[10px] shrink-0"
                  style={{ color: STATUS_COLOR[t.status] }}
                >
                  {STATUS_LABEL[t.status] ?? t.status}
                </span>
              </button>

              {open && (
                <div className="px-2.5 pb-2 space-y-1.5">
                  {t.brief && (
                    <div className="text-[11px] text-dashboard-neutral/85 leading-snug">
                      {t.brief}
                    </div>
                  )}
                  {t.actions.length > 0 && (
                    <div className="space-y-1">
                      {t.actions.map((a, i) => (
                        <div key={i} className="text-[10px] leading-snug">
                          <span className="text-white">{a.codeName}</span>
                          <span className="text-dashboard-neutral/60 ml-1">{a.date}</span>
                          <div className="text-dashboard-neutral/80">{a.description}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="text-[10px] text-dashboard-neutral/60 pt-2 mt-1 border-t border-dashboard-neutral/10">
        数据迁自 Iran 中东大屏 · 公开信息与估算
      </div>
    </DockPanel>
  );
}
