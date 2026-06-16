'use client';

/**
 * 轨道物体列表面板 — 宇宙空间层（可折叠浮层）
 * 展示空间站 / 卫星 / 碎片统计与空间站实时参数（TLE+SGP4）
 */

import { useMemo } from 'react';
import { useMapStore } from '@/store/useMapStore';
import { useOrbitalObjects } from '@/hooks/useOrbitalObjects';
import { useOrbitalPanelStore } from '@/store/useOrbitalPanelStore';
import type { EventDetail } from '@/types/geo';

interface OrbitalObjectsPanelProps {
  className?: string;
}

function fmt(n: number, d = 2): string {
  return n.toFixed(d);
}

export function OrbitalObjectsPanel({ className = '' }: OrbitalObjectsPanelProps) {
  const open = useOrbitalPanelStore((s) => s.open);
  const setOpen = useOrbitalPanelStore((s) => s.setOpen);
  const inSpace = useMapStore((s) => s.activeTier === 'space');
  const activeLayers = useMapStore((s) => s.activeLayers);
  const setCenter = useMapStore((s) => s.setCenter);
  const setZoom = useMapStore((s) => s.setZoom);
  const selectEvent = useMapStore((s) => s.selectEvent);

  const stationsOn = activeLayers.includes('space_stations');
  const { geojson, meta, isLoading } = useOrbitalObjects(inSpace && open);

  const stations = useMemo(() => {
    const list = geojson.features.filter(
      (f) => (f.properties as { category?: string })?.category === 'station',
    );
    return [...list].sort((a, b) => {
      const ah = (a.properties as { highlight?: boolean })?.highlight ? 0 : 1;
      const bh = (b.properties as { highlight?: boolean })?.highlight ? 0 : 1;
      if (ah !== bh) return ah - bh;
      const an = (a.properties as { name?: string })?.name ?? '';
      const bn = (b.properties as { name?: string })?.name ?? '';
      return an.localeCompare(bn);
    });
  }, [geojson]);

  if (!open || !inSpace) return null;

  const counts = meta?.counts ?? { station: 0, satellite: 0, debris: 0 };

  const flyToStation = (
    noradId: number,
    name: string,
    lng: number,
    lat: number,
    altKm: number,
    velocityKmh: number,
    operator?: string | null,
  ) => {
    setCenter([lng, lat]);
    setZoom(3.5);
    const ev: EventDetail = {
      id: `orbital-${noradId}`,
      title: name,
      source: 'TLE/SGP4（近实时）',
      timestamp: new Date().toISOString(),
      location: [lng, lat],
      impact_level: noradId === 25544 || noradId === 48274 ? 'high' : 'medium',
      category: 'space_stations',
      description: `${operator ?? ''} · 高度 ${Math.round(altKm)} km · 速度 ${Math.round(velocityKmh).toLocaleString()} km/h · NORAD ${noradId}`,
    };
    selectEvent(ev);
  };

  return (
    <div
      className={[
        'flex w-full flex-col overflow-hidden rounded-lg border border-violet-500/25',
        'bg-dashboard-bg/95 shadow-xl backdrop-blur-md',
        className,
      ].join(' ')}
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-dashboard-neutral/10 px-3 py-2">
        <span className="text-base" aria-hidden>
          🛰️
        </span>
        <div className="text-sm font-medium text-white">轨道列表</div>
        <span className="ml-auto text-[9px] text-emerald-400/80">● TLE</span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="关闭轨道列表"
          className="rounded px-1 text-dashboard-neutral/60 hover:text-white"
        >
          ×
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
          <div className="rounded border border-cyan-500/20 bg-cyan-500/5 px-1 py-1.5">
            <div className="font-medium text-cyan-300">🏠 空间站</div>
            <div className="tabular-nums text-white">{counts.station}</div>
          </div>
          <div className="rounded border border-sky-500/20 bg-sky-500/5 px-1 py-1.5">
            <div className="font-medium text-sky-300">🛰️ 卫星</div>
            <div className="tabular-nums text-white">{counts.satellite}</div>
          </div>
          <div className="rounded border border-violet-500/20 bg-violet-500/5 px-1 py-1.5">
            <div className="font-medium text-violet-300">💫 碎片</div>
            <div className="tabular-nums text-white">{counts.debris}</div>
          </div>
        </div>

        {isLoading && stations.length === 0 ? (
          <div className="text-[11px] text-dashboard-neutral/50">传播轨道星历…</div>
        ) : !stationsOn ? (
          <div className="text-[11px] text-dashboard-neutral/50">
            开启「空间站（实时）」图层以高亮星下点
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-wide text-dashboard-neutral/40">
              空间站星下点
            </div>
            {stations.length === 0 ? (
              <div className="text-[11px] text-dashboard-neutral/50">暂无空间站数据</div>
            ) : (
              stations.map((f) => {
                const p = f.properties as {
                  noradId: number;
                  name: string;
                  alt_km: number;
                  velocity_kmh: number;
                  highlight?: boolean;
                  operator?: string | null;
                };
                const coords = f.geometry.type === 'Point' ? f.geometry.coordinates : [0, 0];
                const isISS = p.noradId === 25544;
                const isTiangong = p.noradId === 48274;
                return (
                  <button
                    key={p.noradId}
                    type="button"
                    onClick={() =>
                      flyToStation(
                        p.noradId,
                        p.name,
                        coords[0],
                        coords[1],
                        p.alt_km,
                        p.velocity_kmh,
                        p.operator,
                      )
                    }
                    className="w-full rounded-md border border-dashboard-neutral/10 bg-white/5 px-2.5 py-2 text-left hover:bg-white/10"
                  >
                    <div
                      className={[
                        'flex items-center gap-1.5 text-[12px] font-medium',
                        isISS ? 'text-cyan-300' : isTiangong ? 'text-rose-300' : 'text-dashboard-neutral',
                      ].join(' ')}
                    >
                      {p.highlight && (
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
                        </span>
                      )}
                      <span className="truncate">{p.name}</span>
                    </div>
                    <div className="mt-1 grid grid-cols-2 gap-x-2 text-[10px] text-dashboard-neutral/70 tabular-nums">
                      <span>纬度 {fmt(coords[1])}°</span>
                      <span>经度 {fmt(coords[0])}°</span>
                      <span>高度 {Math.round(p.alt_km)} km</span>
                      <span>速度 {Math.round(p.velocity_kmh).toLocaleString()} km/h</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}

        <div className="text-[9px] leading-snug text-dashboard-neutral/35">
          SGP4 传播 · CelesTrak TLE · 60s 刷新
          {meta?.tleFetchedAt
            ? ` · 星历 ${new Date(meta.tleFetchedAt).toLocaleDateString('zh-CN')}`
            : ' · 种子兜底'}
          {meta?.generatedAt
            ? ` · 位置 ${new Date(meta.generatedAt).toLocaleTimeString('zh-CN')}`
            : ''}
        </div>
      </div>
    </div>
  );
}
