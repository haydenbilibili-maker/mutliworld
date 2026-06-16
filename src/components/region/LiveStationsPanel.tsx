'use client';

/**
 * 空间站实时位置面板 — 宇宙空间层（三位一体）
 * 展示 ISS 与 天宫 等的 TLE/SGP4 星下点（每 60 秒刷新）
 */

import { useMemo } from 'react';
import { useMapStore } from '@/store/useMapStore';
import { useOrbitalObjects } from '@/hooks/useOrbitalObjects';

interface LiveStationsPanelProps {
  className?: string;
}

function fmt(n: number, d = 2): string {
  return n.toFixed(d);
}

export function LiveStationsPanel({ className = '' }: LiveStationsPanelProps) {
  const inSpace = useMapStore((s) => s.activeTier === 'space');
  const activeLayers = useMapStore((s) => s.activeLayers);
  const setCenter = useMapStore((s) => s.setCenter);
  const setZoom = useMapStore((s) => s.setZoom);

  const stationsOn = activeLayers.includes('space_stations');
  const satsOn = activeLayers.includes('satellites');
  const debrisOn = activeLayers.includes('space_debris');
  const { geojson, meta, isLoading } = useOrbitalObjects(inSpace && (stationsOn || satsOn || debrisOn));

  const stations = useMemo(
    () =>
      geojson.features.filter((f) => (f.properties as { category?: string })?.category === 'station'),
    [geojson],
  );

  const counts = meta?.counts;

  if (!inSpace) return null;

  return (
    <div
      className={`w-64 rounded-lg border border-cyan-500/25 bg-dashboard-bg/95 shadow-xl backdrop-blur-md ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-dashboard-neutral/10 px-3 py-2">
        <span className="text-base" aria-hidden>🛰️</span>
        <div className="text-sm font-medium text-white">轨道物体 · 实时</div>
        <span className="ml-auto text-[9px] text-emerald-400/80">● TLE</span>
      </div>

      <div className="space-y-2 p-3">
        {counts && (
          <div className="flex gap-2 text-[9px] text-dashboard-neutral/55 tabular-nums">
            <span>🏠 {counts.station}</span>
            <span>🛰️ {counts.satellite}</span>
            <span>💫 {counts.debris}</span>
          </div>
        )}

        {isLoading && stations.length === 0 ? (
          <div className="text-[11px] text-dashboard-neutral/50">传播轨道星历…</div>
        ) : !stationsOn ? (
          <div className="text-[11px] text-dashboard-neutral/50">开启「空间站（实时）」图层查看</div>
        ) : stations.length === 0 ? (
          <div className="text-[11px] text-dashboard-neutral/50">暂未获取到空间站位置</div>
        ) : (
          stations.map((f) => {
            const p = f.properties as {
              noradId: number;
              name: string;
              alt_km: number;
              velocity_kmh: number;
            };
            const coords = f.geometry.type === 'Point' ? f.geometry.coordinates : [0, 0];
            const isISS = p.noradId === 25544;
            return (
              <button
                key={p.noradId}
                type="button"
                onClick={() => {
                  setCenter([coords[0], coords[1]]);
                  setZoom(3.5);
                }}
                className="w-full rounded-md border border-dashboard-neutral/10 bg-white/5 px-2.5 py-2 text-left hover:bg-white/10"
              >
                <div className={`flex items-center gap-1.5 text-[12px] font-medium ${isISS ? 'text-cyan-300' : 'text-rose-300'}`}>
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
                  </span>
                  {p.name}
                </div>
                <div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] text-dashboard-neutral/70 tabular-nums">
                  <span>纬度 {fmt(coords[1])}°</span>
                  <span>经度 {fmt(coords[0])}°</span>
                  <span>高度 {Math.round(p.alt_km)} km</span>
                  <span>速度 {Math.round(p.velocity_kmh).toLocaleString()} km/h</span>
                </div>
              </button>
            );
          })
        )}
        <div className="text-[9px] text-dashboard-neutral/35">
          SGP4 星下点 · CelesTrak TLE · 60s 刷新
        </div>
      </div>
    </div>
  );
}
