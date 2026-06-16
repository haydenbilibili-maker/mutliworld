'use client';

/**
 * 中东能源经济面板 — LIFEOS-005（已纳入面板停靠系统）
 * 价格/影响 双标签页（标签置于 DockPanel header 右侧）。
 */

import { useState } from 'react';
import { useRegionData } from '@/hooks/useRegionData';
import { DockPanel } from '@/components/region/DockPanel';

interface MideastEnergyPanelProps {
  className?: string;
}

function trendColor(changePercent?: number): string {
  if (changePercent == null) return '#94a3b8';
  if (changePercent > 0) return '#ef4444';
  if (changePercent < 0) return '#22c55e';
  return '#94a3b8';
}

export function MideastEnergyPanel({ className = '' }: MideastEnergyPanelProps) {
  const { energy } = useRegionData();
  const [tab, setTab] = useState<'price' | 'impact'>('price');

  // 数据驱动（区域无关）
  if (!energy) return null;

  const tabs = (
    <div className="flex gap-1 text-[11px]">
      <button
        type="button"
        onClick={() => setTab('price')}
        className={`px-2 py-0.5 rounded ${tab === 'price' ? 'bg-white/15 text-white' : 'text-dashboard-neutral'}`}
      >
        价格
      </button>
      <button
        type="button"
        onClick={() => setTab('impact')}
        className={`px-2 py-0.5 rounded ${tab === 'impact' ? 'bg-white/15 text-white' : 'text-dashboard-neutral'}`}
      >
        影响
      </button>
    </div>
  );

  return (
    <DockPanel
      id="energy"
      title="能源经济"
      headerRight={tabs}
      className={`w-72 max-h-[55vh] ${className}`}
    >
      {tab === 'price' && (
        <ul className="space-y-1.5">
          {energy.points.map((p) => (
            <li key={p.id} className="text-[11px]">
              <div className="flex justify-between gap-2">
                <span className="text-dashboard-neutral">{p.name}</span>
                <span className="text-white">
                  {p.value}
                  <span className="text-dashboard-neutral/70 ml-0.5">{p.unit}</span>
                  {p.changePercent != null && (
                    <span className="ml-1.5" style={{ color: trendColor(p.changePercent) }}>
                      {p.changePercent > 0 ? '▲' : p.changePercent < 0 ? '▼' : '—'}
                      {Math.abs(p.changePercent)}%
                    </span>
                  )}
                </span>
              </div>
              {p.description && (
                <div className="text-dashboard-neutral/60 text-[10px]">
                  {p.description}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {tab === 'impact' && (
        <ul className="space-y-2">
          {energy.regions.map((r) => (
            <li key={r.id} className="text-[11px]">
              <div className="text-white">
                {r.flag} {r.name}
              </div>
              <div className="text-dashboard-neutral/80 leading-snug">{r.impact}</div>
            </li>
          ))}
        </ul>
      )}

      <div className="text-[10px] text-dashboard-neutral/60 pt-2 mt-1 border-t border-dashboard-neutral/10">
        数据迁自 Iran 中东大屏 · 含估算
      </div>
    </DockPanel>
  );
}
