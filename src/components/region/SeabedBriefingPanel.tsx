'use client';

/**
 * 洋底空间简报 — 三位一体 Phase 1 收尾
 * 仅在 🌊 洋底空间层（subsurface tier）显示；从洋底各数据集结构化合成态势摘要。
 * 诚实合成、不编造；带真实日期与出处。
 */

import { useMemo } from 'react';
import { useMapStore } from '@/store/useMapStore';
import { useGeodataContext } from '@/context/GeodataContext';
import { DockPanel } from '@/components/region/DockPanel';
import { GLOBAL_INFRASTRUCTURE } from '@/regions/global.infrastructure';
import { GLOBAL_SUBMARINE_CABLES } from '@/regions/global.submarineCables';
import { GLOBAL_CABLE_INCIDENTS } from '@/regions/global.cableIncidents';
import { GLOBAL_DEEP_SEA_MINING } from '@/regions/global.deepSeaMining';
import { GLOBAL_TECTONICS } from '@/regions/global.tectonics';
import { QUAKE_DEPTH_HALO } from '@/lib/geodata/seismicStyle';
import type { EventDetail } from '@/types/geo';

interface SeabedBriefingPanelProps {
  className?: string;
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-white/5 px-2 py-1.5 text-center">
      <div className="text-sm font-semibold tabular-nums text-white">{value}</div>
      <div className="text-[10px] text-dashboard-neutral/50">{label}</div>
    </div>
  );
}

export function SeabedBriefingPanel({ className = '' }: SeabedBriefingPanelProps) {
  const activeTier = useMapStore((s) => s.activeTier);
  const setViewport = useMapStore((s) => s.setViewport);
  const selectEvent = useMapStore((s) => s.selectEvent);
  const focusOnMap = useMapStore((s) => s.focusOnMap);
  const { data, isLoading: geodataLoading, error: geodataError } = useGeodataContext();

  const cableLandings = useMemo(
    () => GLOBAL_INFRASTRUCTURE.filter((p) => p.layerId === 'cables').length,
    [],
  );

  const dsmByResource = useMemo(() => {
    const m = { nodules: 0, sulphides: 0, crusts: 0 } as Record<string, number>;
    for (const a of GLOBAL_DEEP_SEA_MINING) m[a.resource] = (m[a.resource] ?? 0) + 1;
    return m;
  }, []);

  const recentIncidents = useMemo(
    () =>
      [...GLOBAL_CABLE_INCIDENTS]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 3),
    [],
  );

  // 实时震源深度（来自 /api/geodata 的 quake_depth 要素）
  const quakeDepth = useMemo(() => {
    let shallow = 0;
    let intermediate = 0;
    let deep = 0;
    for (const f of data?.features ?? []) {
      if (String(f.properties?.layerId ?? '') !== 'quake_depth') continue;
      const k = String(f.properties?.subKind ?? '');
      if (k === 'shallow') shallow += 1;
      else if (k === 'intermediate') intermediate += 1;
      else if (k === 'deep') deep += 1;
    }
    return { shallow, intermediate, deep, total: shallow + intermediate + deep };
  }, [data]);

  if (activeTier !== 'subsurface') return null;

  const flyToIncident = (id: string, name: string, lng: number, lat: number, desc: string) => {
    setViewport([lng, lat], 5);
    const ev: EventDetail = {
      id,
      title: name,
      source: '',
      timestamp: '',
      location: [lng, lat],
      impact_level: 'high',
      category: 'cable_incidents',
      description: desc,
    };
    focusOnMap(ev);
    selectEvent(null);
  };

  return (
    <DockPanel
      id="seabed-briefing"
      icon="🌊"
      title="洋底空间 · 态势简报"
      className={`w-[min(18rem,calc(100vw-2rem))] border-cyan-500/25 bg-dashboard-bg/95 shadow-xl backdrop-blur-md ${className}`}
    >
      <div className="space-y-2.5">
        <div className="grid grid-cols-4 gap-1.5">
          <Stat label="海缆登陆" value={cableLandings} />
          <Stat label="海缆路由" value={GLOBAL_SUBMARINE_CABLES.length} />
          <Stat label="采矿区" value={GLOBAL_DEEP_SEA_MINING.length} />
          <Stat label="板块断层" value={GLOBAL_TECTONICS.length} />
        </div>

        <div className="text-[11px] text-dashboard-neutral/70">
          深海采矿：结核 {dsmByResource.nodules} · 硫化物 {dsmByResource.sulphides} · 钴结壳{' '}
          {dsmByResource.crusts}
        </div>

        <div>
          <div className="mb-1 text-[10px] uppercase tracking-wide text-dashboard-neutral/40">
            近期海缆中断
          </div>
          <ul className="space-y-1">
            {recentIncidents.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => flyToIncident(c.id, c.name, c.lng, c.lat, `${c.date.slice(0, 10)} · ${c.note}`)}
                  className="flex w-full items-start gap-1.5 rounded px-1 py-0.5 text-left hover:bg-white/5"
                >
                  <span className="mt-0.5 text-[10px] text-rose-400" aria-hidden>✂️</span>
                  <span className="min-w-0">
                    <span className="block truncate text-[11px] leading-tight text-dashboard-neutral hover:text-white">
                      {c.name}
                    </span>
                    <span className="block text-[10px] text-dashboard-neutral/45">
                      {c.date.slice(0, 10)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-1 text-[10px] uppercase tracking-wide text-dashboard-neutral/40">
            实时震源深度（USGS）
          </div>
          {geodataLoading && !data ? (
            <div className="text-[11px] text-dashboard-neutral/45">正在加载震源数据…</div>
          ) : geodataError ? (
            <div className="text-[11px] text-dashboard-conflict/80">震源数据暂不可用</div>
          ) : quakeDepth.total > 0 ? (
            <div className="flex items-center gap-2 text-[11px] text-dashboard-neutral/80">
              <span>
                <span
                  className="mr-1 inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: QUAKE_DEPTH_HALO.shallow }}
                />
                浅 {quakeDepth.shallow}
              </span>
              <span>
                <span
                  className="mr-1 inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: QUAKE_DEPTH_HALO.intermediate }}
                />
                中 {quakeDepth.intermediate}
              </span>
              <span>
                <span
                  className="mr-1 inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: QUAKE_DEPTH_HALO.deep }}
                />
                深 {quakeDepth.deep}
              </span>
            </div>
          ) : (
            <div className="text-[11px] text-dashboard-neutral/45">
              开启「震源深度」图层后显示
            </div>
          )}
        </div>

        <div className="text-[9px] text-dashboard-neutral/30">
          结构化合成 · 非编造 · 海缆/采矿/板块为公开资料示意，断缆事件带日期来源
        </div>
      </div>
    </DockPanel>
  );
}
