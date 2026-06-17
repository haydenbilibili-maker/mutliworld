'use client';

/**
 * 中国周边态势简报面板 — 南海/台海/第一岛链/中日/朝鲜半岛分模块展示
 */

import { useMemo } from 'react';
import { useMapStore } from '@/store/useMapStore';
import { useRegionData } from '@/hooks/useRegionData';
import { focusEventOnMap, enableBriefingModuleLayers } from '@/lib/map/focusEvent';
import { CHINA_BRIEFING_MODULE_LAYERS } from '@/lib/map/briefingLayers';
import { DockPanel } from '@/components/region/DockPanel';

interface ChinaBriefingPanelProps {
  className?: string;
}

const MODULES = [
  { key: 'scs', label: '南海局势', prefix: ['scs-'] },
  { key: 'disputes', label: '岛礁争端与势力分布', prefix: ['cn-disp-'] },
  { key: 'island', label: '第一岛链', prefix: ['chain-'] },
  { key: 'taiwan', label: '台海局势', prefix: ['tw-'] },
  { key: 'japan', label: '中日局势', prefix: ['jp-'] },
  { key: 'korea', label: '朝鲜半岛', prefix: ['kr-'] },
] as const;

function matchesModule(id: string, prefixes: readonly string[]): boolean {
  return prefixes.some((p) => id.startsWith(p));
}

export function ChinaBriefingPanel({ className = '' }: ChinaBriefingPanelProps) {
  const region = useMapStore((s) => s.activeRegion);
  const selectEvent = useMapStore((s) => s.selectEvent);
  const setCenter = useMapStore((s) => s.setCenter);
  const setZoom = useMapStore((s) => s.setZoom);
  const activeLayers = useMapStore((s) => s.activeLayers);
  const toggleLayer = useMapStore((s) => s.toggleLayer);
  const data = useRegionData();

  const focusActions = {
    selectEvent,
    setCenter,
    setZoom,
    activeLayers,
    toggleLayer,
  };

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

  if (region !== 'china' || moduleStats.length === 0) return null;

  const totalFeatures =
    (data.events?.length ?? 0) +
    (data.incidents?.length ?? 0) +
    (data.facilities?.length ?? 0);

  return (
    <DockPanel
      id="china-briefing"
      title="中国周边专题简报"
      className={`w-80 max-h-[64vh] ${className}`}
    >
      <div className="space-y-3">
        <div className="text-[11px] leading-snug text-dashboard-neutral/90">
          <span className="text-white font-medium">专题简报</span> · 汇总地图监测点{' '}
          <span className="text-white">{totalFeatures}</span> 处 · 点击模块自动开启相关图层
        </div>

        {moduleStats.map((m) => (
          <div key={m.key}>
            <button
              type="button"
              onClick={() =>
                enableBriefingModuleLayers(
                  m.key,
                  CHINA_BRIEFING_MODULE_LAYERS,
                  activeLayers,
                  toggleLayer,
                )
              }
              className="mb-1 flex w-full items-center justify-between rounded px-0.5 text-left transition-colors hover:bg-white/5"
            >
              <span className="text-[10px] text-dashboard-neutral/70 hover:text-white">
                {m.label}
              </span>
              <span className="text-[10px] text-dashboard-neutral">
                事件 {m.eventCount} · 冲突 {m.incidentCount} · 设施 {m.facilityCount}
              </span>
            </button>
            {m.recent.length > 0 && (
              <ul className="space-y-0.5">
                {m.recent.map((e) => (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() =>
                        focusEventOnMap(
                          e,
                          focusActions,
                          5.2,
                          m.key,
                          CHINA_BRIEFING_MODULE_LAYERS,
                        )
                      }
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
          种子态势数据 · 南海/岛礁/岛链/台海/中日/半岛
        </div>
      </div>
    </DockPanel>
  );
}
