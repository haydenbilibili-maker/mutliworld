'use client';

/**
 * 中东态势面板 — LIFEOS-005（已纳入面板停靠系统）
 * 阵营图例 + 监测点列表。
 */

import { useMapStore } from '@/store/useMapStore';
import { useRegionData } from '@/hooks/useRegionData';
import { DockPanel } from '@/components/region/DockPanel';

interface MideastPanelProps {
  className?: string;
}

export function MideastPanel({ className = '' }: MideastPanelProps) {
  const region = useMapStore((s) => s.activeRegion);
  const selectEvent = useMapStore((s) => s.selectEvent);
  const { events, factions } = useRegionData();

  if (region !== 'middleeast') return null;

  // 数据驱动（区域无关）：有阵营或监测点即显示
  if (!factions && events.length === 0) return null;

  return (
    <DockPanel id="overview" title="中东态势" className={`w-60 max-h-[60vh] ${className}`}>
      <div className="space-y-3">
        {factions && (
          <div className="space-y-1.5">
            <div className="text-xs text-dashboard-neutral">阵营</div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(factions.label).map((k) => (
                <span key={k} className="flex items-center gap-1.5 text-xs text-white">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: factions.color[k] }}
                  />
                  {factions.label[k]}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <div className="text-xs text-dashboard-neutral">
            关键监测点（{events.length}）
          </div>
          <ul className="space-y-1">
            {events.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => selectEvent(e)}
                  className="w-full text-left text-xs text-dashboard-neutral hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                    style={{
                      backgroundColor:
                        e.impact_level === 'high'
                          ? '#f59e0b'
                          : e.impact_level === 'critical'
                            ? '#ef4444'
                            : '#3b82f6',
                    }}
                  />
                  {e.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-[10px] text-dashboard-neutral/60 pt-1 border-t border-dashboard-neutral/10">
          ⚠ 种子示例数据 · 阶段3 接 Iran 真实数据层
        </div>
      </div>
    </DockPanel>
  );
}
