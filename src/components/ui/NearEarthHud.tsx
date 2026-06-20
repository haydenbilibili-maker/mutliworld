'use client';

/**
 * 近地空间 HUD — 对标 earth.nullschool 左下角控制/读数。
 * 标量叠加参数选择 + 色阶图例 + 鼠标悬停处的实时数值读数（风速/洋流/污染物）。
 * 仅在「近地」空间层显示。
 */

import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import type maplibregl from 'maplibre-gl';
import { useMapContext } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { useNearEarthStore, AQ_META, type AqParam } from '@/store/useNearEarthStore';

interface VecGrid { nx: number; ny: number; lon0: number; lat0: number; dLon: number; dLat: number; u: number[]; v: number[]; }
interface AqGrid { nx: number; ny: number; lon0: number; lat0: number; dLon: number; dLat: number; params: Record<AqParam, number[]>; }
const fetcher = (url: string) => fetch(url).then((r) => r.json());

function bilerp(field: number[], g: { nx: number; ny: number; lon0: number; lat0: number; dLon: number; dLat: number }, lng: number, lat: number): number | null {
  const yf = (lat - g.lat0) / g.dLat;
  if (yf < 0 || yf > g.ny - 1) return null;
  let xf = (lng - g.lon0) / g.dLon; xf = ((xf % g.nx) + g.nx) % g.nx;
  const i0 = Math.floor(xf), j0 = Math.floor(yf), i1 = (i0 + 1) % g.nx, j1 = Math.min(j0 + 1, g.ny - 1);
  const fx = xf - i0, fy = yf - j0, at = (j: number, i: number) => j * g.nx + i, lp = (a: number, b: number, t: number) => a + (b - a) * t;
  return lp(lp(field[at(j0, i0)], field[at(j0, i1)], fx), lp(field[at(j1, i0)], field[at(j1, i1)], fx), fy);
}

export function NearEarthHud() {
  const map = useMapContext();
  const inNearEarth = useMapStore((s) => s.activeBody === 'earth' && s.activeTier === 'near_earth');
  const layers = useMapStore((s) => s.activeLayers);
  const param = useNearEarthStore((s) => s.param);
  const setParam = useNearEarthStore((s) => s.setParam);

  const windOn = inNearEarth && layers.includes('wind_flow');
  const oceanOn = inNearEarth && layers.includes('ocean_flow');
  const overlayOn = inNearEarth && (layers.includes('air_pollutants') || layers.includes('particulates'));

  const { data: wind } = useSWR<VecGrid>(windOn ? '/api/wind-grid' : null, fetcher, { revalidateOnFocus: false });
  const { data: ocean } = useSWR<VecGrid>(oceanOn ? '/api/ocean-grid' : null, fetcher, { revalidateOnFocus: false });
  const { data: aq } = useSWR<AqGrid>(overlayOn ? '/api/airquality-grid' : null, fetcher, { revalidateOnFocus: false });

  const [readout, setReadout] = useState<{ lat: number; lng: number; wind?: number; ocean?: number; aq?: number } | null>(null);
  const lastTs = useRef(0);

  useEffect(() => {
    if (!map || !inNearEarth) return;
    const onMove = (e: maplibregl.MapMouseEvent) => {
      const now = performance.now();
      if (now - lastTs.current < 80) return; // 节流 ~12/s
      lastTs.current = now;
      const { lng, lat } = e.lngLat;
      const r: { lat: number; lng: number; wind?: number; ocean?: number; aq?: number } = { lat, lng };
      if (wind?.nx) { const u = bilerp(wind.u, wind, lng, lat); const v = bilerp(wind.v, wind, lng, lat); if (u != null && v != null) r.wind = Math.hypot(u, v); }
      if (ocean?.nx) { const u = bilerp(ocean.u, ocean, lng, lat); const v = bilerp(ocean.v, ocean, lng, lat); if (u != null && v != null) r.ocean = Math.hypot(u, v); }
      if (aq?.nx && aq.params[param]) { const val = bilerp(aq.params[param], aq, lng, lat); if (val != null) r.aq = val; }
      setReadout(r);
    };
    map.on('mousemove', onMove);
    return () => { map.off('mousemove', onMove); };
  }, [map, inNearEarth, wind, ocean, aq, param]);

  if (!inNearEarth) return null;

  const GASES: AqParam[] = ['carbon_monoxide', 'sulphur_dioxide', 'nitrogen_dioxide', 'ozone'];
  const PMS: AqParam[] = ['pm2_5', 'pm10'];

  return (
    <div className="pointer-events-auto fixed bottom-16 left-3 z-30 w-[min(17rem,calc(100vw-1.5rem))] rounded-lg border border-dashboard-neutral/25 bg-dashboard-bg/92 p-2.5 text-[11px] shadow-xl backdrop-blur-md">
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="text-sm" aria-hidden>🌀</span>
        <span className="font-medium text-white">近地空间 · 流场/叠加</span>
      </div>

      {overlayOn && (
        <div className="mb-2">
          <div className="mb-1 text-[10px] text-dashboard-neutral/60">标量叠加参数</div>
          <div className="flex flex-wrap gap-1">
            {[...GASES, ...PMS].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setParam(p)}
                className={[
                  'rounded px-1.5 py-0.5 text-[10px] transition-colors',
                  p === param ? 'bg-brand-cyan/20 text-brand-cyan' : 'text-dashboard-neutral hover:bg-white/5',
                ].join(' ')}
              >
                {AQ_META[p].label}
              </button>
            ))}
          </div>
          {/* 色阶图例 */}
          <div className="mt-1.5">
            <div className="h-2 w-full rounded" style={{ background: 'linear-gradient(90deg,#38bdf8,#4ade80,#facc15,#fb923c,#f87171,#a747fe)' }} />
            <div className="mt-0.5 flex justify-between text-[9px] text-dashboard-neutral/50">
              <span>0</span><span>{AQ_META[param].label} ({AQ_META[param].unit})</span><span>{AQ_META[param].max}</span>
            </div>
          </div>
        </div>
      )}

      {/* 悬停读数 */}
      <div className="border-t border-dashboard-neutral/10 pt-1.5 text-[10px] leading-relaxed text-dashboard-neutral/80">
        {readout ? (
          <>
            <div className="text-dashboard-neutral/55">{readout.lat.toFixed(1)}°, {readout.lng.toFixed(1)}°</div>
            {readout.wind != null && <div>风速 <span className="text-white">{readout.wind.toFixed(1)}</span> m/s</div>}
            {readout.ocean != null && <div>洋流 <span className="text-white">{readout.ocean.toFixed(2)}</span> m/s</div>}
            {readout.aq != null && <div>{AQ_META[param].label} <span className="text-white">{readout.aq.toFixed(1)}</span> {AQ_META[param].unit}</div>}
          </>
        ) : (
          <span className="text-dashboard-neutral/45">移动鼠标查看该处实时数值</span>
        )}
      </div>
    </div>
  );
}
