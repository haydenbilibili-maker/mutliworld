'use client';

/**
 * 中东军力对比面板 — LIFEOS-005（已纳入面板停靠系统）
 * 可折叠区块；按阵营（伊朗红 / 美以蓝）着色。
 */

import { useState } from 'react';
import { useRegionData } from '@/hooks/useRegionData';
import { DockPanel } from '@/components/region/DockPanel';

interface MideastMilitaryPanelProps {
  className?: string;
}

// 通用化：中东 + 俄乌 + 兜底
const SIDE_LABEL: Record<string, string> = {
  iran: '伊朗方',
  us_israel: '美以方',
  ru: '俄方',
  ua: '乌方',
  nato: '北约',
};
const SIDE_COLOR: Record<string, string> = {
  iran: '#ef4444',
  us_israel: '#3b82f6',
  ru: '#ef4444',
  ua: '#3b82f6',
  nato: '#22d3ee',
};
const sideLabel = (s: string) => SIDE_LABEL[s] ?? s;
const sideColor = (s: string) => SIDE_COLOR[s] ?? '#94a3b8';

export function MideastMilitaryPanel({
  className = '',
}: MideastMilitaryPanelProps) {
  const { military } = useRegionData();
  const [openId, setOpenId] = useState<string | null>(null);

  if (!military || military.length === 0) return null;

  return (
    <DockPanel id="military" title="军力对比" className={`w-72 max-h-[60vh] ${className}`}>
      <div className="space-y-2">
        {military.map((sec) => {
          const open = openId === sec.id;
          return (
            <div
              key={sec.id}
              className="rounded-md border border-dashboard-neutral/15 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenId(open ? null : sec.id)}
                className="w-full flex items-center gap-2 px-2.5 py-2 text-left hover:bg-white/5 transition-colors"
              >
                <span
                  className="inline-block w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: sideColor(sec.side) }}
                />
                <span className="text-xs text-white flex-1">{sec.title}</span>
                <span className="text-[10px] text-dashboard-neutral">
                  {sideLabel(sec.side)}
                </span>
                <span className="text-dashboard-neutral text-xs">
                  {open ? '−' : '+'}
                </span>
              </button>

              {open && (
                <div className="px-2.5 pb-2.5 space-y-1.5">
                  {sec.summary && (
                    <div className="text-[11px] text-dashboard-neutral/80">
                      {sec.summary}
                    </div>
                  )}
                  {sec.items.map((it, i) => (
                    <div key={i} className="text-[11px] leading-snug">
                      <div className="flex justify-between gap-2">
                        <span className="text-dashboard-neutral">{it.label}</span>
                        <span className="text-white text-right">{it.value}</span>
                      </div>
                      {it.sub && (
                        <div className="text-dashboard-neutral/60 text-[10px]">
                          {it.sub}
                        </div>
                      )}
                    </div>
                  ))}
                  {sec.updatedAt && (
                    <div className="text-[10px] text-dashboard-neutral/50 pt-1">
                      更新 {sec.updatedAt}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        <div className="text-[10px] text-dashboard-neutral/60 pt-1 border-t border-dashboard-neutral/10">
          数据迁自 Iran 中东大屏（含估算，标注更新时间）
        </div>
      </div>
    </DockPanel>
  );
}
