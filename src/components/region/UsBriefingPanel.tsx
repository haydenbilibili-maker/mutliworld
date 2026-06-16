'use client';

/**
 * 美国战略态势简报面板 — 核力量/全球部署/本土/印太/北约/供应链/国内热点/地表层
 */

import { useMemo } from 'react';
import { useMapStore } from '@/store/useMapStore';
import { useRegionData } from '@/hooks/useRegionData';
import { DockPanel } from '@/components/region/DockPanel';

interface UsBriefingPanelProps {
  className?: string;
}

const MODULES = [
  { key: 'nuclear', label: '战略核力量', prefix: ['us-nuc-'] },
  { key: 'garrisons', label: '全球军事部署', prefix: ['us-gar-'] },
  { key: 'homeland', label: '本土安全与基础设施', prefix: ['us-hom-'] },
  { key: 'indo', label: '印太战略', prefix: ['us-ipp-'] },
  { key: 'nato', label: '大西洋/北约枢纽', prefix: ['us-nato-'] },
  { key: 'supply', label: '战略资源与供应链', prefix: ['us-sup-'] },
  { key: 'domestic', label: '国内政治与安全热点', prefix: ['us-dom-'] },
  { key: 'surface', label: '地表层信息', prefix: ['us-surf-'] },
] as const;

function matchesModule(id: string, prefixes: readonly string[]): boolean {
  return prefixes.some((p) => id.startsWith(p));
}

export function UsBriefingPanel({ className = '' }: UsBriefingPanelProps) {
  const region = useMapStore((s) => s.activeRegion);
  const selectEvent = useMapStore((s) => s.selectEvent);
  const data = useRegionData();

  const moduleStats = useMemo(() => {
    const events = data.events ?? [];
    const incidents = data.incidents ?? [];
    const facilities = data.facilities ?? [];

    return MODULES.map((m) => {
      const ev = events.filter((e) => matchesModule(e.id, m.prefix));
      const inc = incidents.filter((i) => matchesModule(i.id, m.prefix));
      const fac = facilities.filter((f) => matchesModule(f.id, m.prefix));
      const recent = [...ev]
        .filter((e) => e.timestamp)
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
        .slice(0, 2);
      return {
        ...m,
        eventCount: ev.length,
        incidentCount: inc.length,
        facilityCount: fac.length,
        total: ev.length + inc.length + fac.length,
        recent,
      };
    }).filter((m) => m.total > 0);
  }, [data]);

  if (region !== 'north_america' || moduleStats.length === 0) return null;

  const usFeatures = moduleStats.reduce((sum, m) => sum + m.total, 0);
  const totalFeatures =
    (data.events?.length ?? 0) +
    (data.incidents?.length ?? 0) +
    (data.facilities?.length ?? 0);

  return (
    <DockPanel
      id="us-briefing"
      title="美国战略态势"
      className={`w-80 max-h-[64vh] ${className}`}
    >
      <div className="space-y-3">
        <div className="text-[11px] leading-snug text-dashboard-neutral/90">
          <span className="text-white font-medium">战略研究对象</span> · 美国模块{' '}
          <span className="text-white">{usFeatures}</span> 处 · 全区域{' '}
          <span className="text-white">{totalFeatures}</span> 处
        </div>

        {moduleStats.map((m) => (
          <div key={m.key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-dashboard-neutral/70">{m.label}</span>
              <span className="text-[10px] text-dashboard-neutral">
                事件 {m.eventCount} · 冲突 {m.incidentCount} · 设施 {m.facilityCount}
              </span>
            </div>
            {m.recent.length > 0 && (
              <ul className="space-y-0.5">
                {m.recent.map((e) => (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => selectEvent(e)}
                      className="w-full text-left text-[11px] text-dashboard-neutral hover:text-white transition-colors"
                    >
                      {e.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {data.factions && (
          <div>
            <div className="text-[10px] text-dashboard-neutral/70 mb-1">势力分布</div>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(data.factions.label).map((k) => (
                <span
                  key={k}
                  className="flex items-center gap-1 text-[10px] text-white"
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: data.factions!.color[k] }}
                  />
                  {data.factions!.label[k]}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="text-[10px] text-dashboard-neutral/50 pt-1 border-t border-dashboard-neutral/10">
          种子态势数据 · 核力量/驻军/印太/北约/供应链/地表层/地表信息
        </div>
      </div>
    </DockPanel>
  );
}
