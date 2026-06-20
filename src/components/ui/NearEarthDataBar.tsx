'use client';

/**
 * 近地数据条 — 置于底部控制栏上方，醒目展示当前标量叠加的浓度色阶图例 + 鼠标悬停实时读数。
 * 替代原左下角弹窗：动画流场入「视图」菜单、标量叠加入「图层」模块，本条专注「数据 + 图例」。
 * 仅在近地空间层显示；挂载于 MapContainer（持有地图上下文，监听 mousemove 取真实数据）。
 */

import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import type maplibregl from 'maplibre-gl';
import { useMapContext } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { useNearEarthStore, SCALAR_META, type ScalarRamp } from '@/store/useNearEarthStore';

interface VecGrid { nx: number; ny: number; lon0: number; lat0: number; dLon: number; dLat: number; u: number[]; v: number[]; }
interface ScalarGrid { nx: number; ny: number; lon0: number; lat0: number; dLon: number; dLat: number; params: Record<string, number[]>; }
const fetcher = (url: string) => fetch(url).then((r) => r.json());

const RAMP_CSS: Record<ScalarRamp, string> = {
  aqi: 'linear-gradient(90deg,#38bdf8,#4ade80,#facc15,#fb923c,#f87171,#a747fe)',
  thermal: 'linear-gradient(90deg,#2563eb,#38bdf8,#2dd4bf,#facc15,#fb923c,#ef4444)',
  diverging: 'linear-gradient(90deg,#2563eb,#60a5fa,#f1f5f9,#f87171,#b91c1c)',
  baa: 'linear-gradient(90deg,#cbd5e1,#facc15,#fb923c,#ef4444,#7f1d1d)',
};

function bilerp(field: number[], g: { nx: number; ny: number; lon0: number; lat0: number; dLon: number; dLat: number }, lng: number, lat: number): number | null {
  const yf = (lat - g.lat0) / g.dLat;
  if (yf < 0 || yf > g.ny - 1) return null;
  let xf = (lng - g.lon0) / g.dLon; xf = ((xf % g.nx) + g.nx) % g.nx;
  const i0 = Math.floor(xf), j0 = Math.floor(yf), i1 = (i0 + 1) % g.nx, j1 = Math.min(j0 + 1, g.ny - 1);
  const fx = xf - i0, fy = yf - j0, at = (j: number, i: number) => j * g.nx + i, lp = (a: number, b: number, t: number) => a + (b - a) * t;
  const v = lp(lp(field[at(j0, i0)], field[at(j0, i1)], fx), lp(field[at(j1, i0)], field[at(j1, i1)], fx), fy);
  return Number.isFinite(v) ? v : null;
}

interface Readout { lat: number; lng: number; wind?: number; ocean?: number; wave?: number; scalar?: number }

export function NearEarthDataBar() {
  const map = useMapContext();
  const inNearEarth = useMapStore((s) => s.activeBody === 'earth' && s.activeTier === 'near_earth');
  const layers = useMapStore((s) => s.activeLayers);
  const param = useNearEarthStore((s) => s.param);
  const meta = SCALAR_META[param];

  const windOn = inNearEarth && layers.includes('wind_flow');
  const oceanOn = inNearEarth && layers.includes('ocean_flow');
  const waveOn = inNearEarth && layers.includes('wave_flow');
  const overlayOn = inNearEarth && layers.includes(meta.layer);

  const { data: wind } = useSWR<VecGrid>(windOn ? '/api/wind-grid' : null, fetcher, { revalidateOnFocus: false });
  const { data: ocean } = useSWR<VecGrid>(oceanOn ? '/api/ocean-grid' : null, fetcher, { revalidateOnFocus: false });
  const { data: wave } = useSWR<VecGrid>(waveOn ? '/api/wave-grid' : null, fetcher, { revalidateOnFocus: false });
  const { data: scalar } = useSWR<ScalarGrid>(overlayOn ? meta.endpoint : null, fetcher, { revalidateOnFocus: false });

  const [readout, setReadout] = useState<Readout | null>(null);
  const lastTs = useRef(0);

  useEffect(() => {
    if (!map || !inNearEarth) return;
    const onMove = (e: maplibregl.MapMouseEvent) => {
      const now = performance.now();
      if (now - lastTs.current < 80) return;
      lastTs.current = now;
      const { lng, lat } = e.lngLat;
      const r: Readout = { lat, lng };
      if (wind?.nx) { const u = bilerp(wind.u, wind, lng, lat); const v = bilerp(wind.v, wind, lng, lat); if (u != null && v != null) r.wind = Math.hypot(u, v); }
      if (ocean?.nx) { const u = bilerp(ocean.u, ocean, lng, lat); const v = bilerp(ocean.v, ocean, lng, lat); if (u != null && v != null) r.ocean = Math.hypot(u, v); }
      if (wave?.nx) { const u = bilerp(wave.u, wave, lng, lat); const v = bilerp(wave.v, wave, lng, lat); if (u != null && v != null) r.wave = Math.hypot(u, v); }
      if (scalar?.nx && scalar.params[meta.key]) { const val = bilerp(scalar.params[meta.key], scalar, lng, lat); if (val != null) r.scalar = val; }
      setReadout(r);
    };
    map.on('mousemove', onMove);
    return () => { map.off('mousemove', onMove); };
  }, [map, inNearEarth, wind, ocean, wave, scalar, meta.key]);

  if (!inNearEarth) return null;

  return (
    <div className="pointer-events-none fixed bottom-[6.25rem] left-1/2 z-20 w-[min(44rem,calc(100vw-1.5rem))] -translate-x-1/2 max-sm:bottom-[7rem]">
      <div className="pointer-events-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-lg border border-dashboard-neutral/25 bg-dashboard-bg/92 px-3 py-2 shadow-xl backdrop-blur-md">
        {/* 浓度色阶图例（醒目） */}
        {overlayOn ? (
          <div className="flex min-w-[14rem] flex-1 items-center gap-2">
            <span className="shrink-0 text-[12px] font-medium text-white">{meta.label}</span>
            <div className="flex flex-1 flex-col gap-0.5">
              <div className="h-2.5 w-full rounded" style={{ background: RAMP_CSS[meta.ramp] }} />
              <div className="flex justify-between text-[9px] text-dashboard-neutral/55">
                <span>{meta.min}</span>
                <span>{meta.unit}</span>
                <span>{meta.max}</span>
              </div>
            </div>
          </div>
        ) : (
          <span className="text-[11px] text-dashboard-neutral/50">未开启标量叠加 · 在「图层」菜单选择</span>
        )}

        {/* 实时读数 */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-dashboard-neutral/80">
          {readout ? (
            <>
              <span className="text-dashboard-neutral/50">{readout.lat.toFixed(1)}°, {readout.lng.toFixed(1)}°</span>
              {readout.wind != null && <span>风 <span className="text-white">{readout.wind.toFixed(1)}</span> m/s</span>}
              {readout.ocean != null && <span>洋流 <span className="text-white">{readout.ocean.toFixed(2)}</span> m/s</span>}
              {readout.wave != null && <span>浪 <span className="text-white">{readout.wave.toFixed(1)}</span> m</span>}
              {readout.scalar != null && <span>{meta.label} <span className="text-white">{readout.scalar.toFixed(1)}</span> {meta.unit}</span>}
            </>
          ) : (
            <span className="text-dashboard-neutral/45">移动鼠标查看该处实时数值</span>
          )}
        </div>
      </div>
    </div>
  );
}
