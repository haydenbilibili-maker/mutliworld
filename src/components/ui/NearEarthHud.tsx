'use client';

/**
 * 近地空间 HUD — 对标 earth.nullschool 左下角控制/读数（图层 + 数据，不含视图控件）。
 * 动画流场(风/洋流/波浪) 一键切换 + 标量叠加(化学污染物/颗粒物/海面温度/有效波高/海温偏差/BAA) 选择
 * + 色阶图例 + 鼠标悬停处实时数值读数。视图控件(投影/动画速度)在底部「视图」菜单。
 * 仅在「近地」空间层显示。
 */

import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import type maplibregl from 'maplibre-gl';
import type { LayerId } from '@/types/geo';
import { useMapContext } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { useNearEarthStore, SCALAR_META, type ScalarParam, type ScalarRamp } from '@/store/useNearEarthStore';

interface VecGrid { nx: number; ny: number; lon0: number; lat0: number; dLon: number; dLat: number; u: number[]; v: number[]; }
interface ScalarGrid { nx: number; ny: number; lon0: number; lat0: number; dLon: number; dLat: number; params: Record<string, number[]>; }
const fetcher = (url: string) => fetch(url).then((r) => r.json());

const RAMP_CSS: Record<ScalarRamp, string> = {
  aqi: 'linear-gradient(90deg,#38bdf8,#4ade80,#facc15,#fb923c,#f87171,#a747fe)',
  thermal: 'linear-gradient(90deg,#2563eb,#38bdf8,#2dd4bf,#facc15,#fb923c,#ef4444)',
  diverging: 'linear-gradient(90deg,#2563eb,#60a5fa,#f1f5f9,#f87171,#b91c1c)',
  baa: 'linear-gradient(90deg,#cbd5e1,#facc15,#fb923c,#ef4444,#7f1d1d)',
};

const FLOWS: { id: LayerId; label: string }[] = [
  { id: 'wind_flow', label: '风' },
  { id: 'ocean_flow', label: '洋流' },
  { id: 'wave_flow', label: '波浪' },
];

const OVERLAY_GROUPS: { title: string; params: ScalarParam[] }[] = [
  { title: '化学污染物', params: ['carbon_monoxide', 'sulphur_dioxide', 'nitrogen_dioxide', 'ozone'] },
  { title: '颗粒物', params: ['pm2_5', 'pm10'] },
  { title: '海洋', params: ['sea_surface_temperature', 'wave_height'] },
  { title: '珊瑚礁观察', params: ['sst_anomaly', 'bleaching_alert_area'] },
];

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

export function NearEarthHud() {
  const map = useMapContext();
  const inNearEarth = useMapStore((s) => s.activeBody === 'earth' && s.activeTier === 'near_earth');
  const layers = useMapStore((s) => s.activeLayers);
  const toggleLayer = useMapStore((s) => s.toggleLayer);
  const param = useNearEarthStore((s) => s.param);
  const setParam = useNearEarthStore((s) => s.setParam);
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
      if (now - lastTs.current < 80) return; // 节流 ~12/s
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

  // 选择叠加参数：设为当前并确保其图层开启
  const pickOverlay = (p: ScalarParam) => {
    setParam(p);
    const target = SCALAR_META[p].layer;
    if (!layers.includes(target)) toggleLayer(target);
  };

  return (
    <div className="pointer-events-auto fixed bottom-16 left-3 z-30 max-h-[70vh] w-[min(17rem,calc(100vw-1.5rem))] overflow-y-auto rounded-lg border border-dashboard-neutral/25 bg-dashboard-bg/92 p-2.5 text-[11px] shadow-xl backdrop-blur-md">
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="text-sm" aria-hidden>🌀</span>
        <span className="font-medium text-white">近地空间 · 流场/叠加</span>
      </div>

      {/* 动画流场（对标 nullschool Animate）：风 / 洋流 / 波浪 */}
      <div className="mb-2">
        <div className="mb-1 text-[10px] text-dashboard-neutral/60">动画</div>
        <div className="flex flex-wrap gap-1">
          {FLOWS.map((f) => {
            const on = layers.includes(f.id);
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => toggleLayer(f.id)}
                className={[
                  'rounded px-1.5 py-0.5 text-[10px] transition-colors',
                  on ? 'bg-brand-cyan/20 text-brand-cyan ring-1 ring-brand-cyan/40' : 'text-dashboard-neutral hover:bg-white/5',
                ].join(' ')}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 标量叠加（对标 nullschool Overlay）：单选，自动开启对应图层 */}
      <div className="mb-2">
        <div className="mb-1 flex items-center justify-between text-[10px] text-dashboard-neutral/60">
          <span>叠加</span>
          {overlayOn && (
            <button type="button" onClick={() => { if (layers.includes(meta.layer)) toggleLayer(meta.layer); }} className="text-dashboard-neutral/45 hover:text-white">关闭</button>
          )}
        </div>
        <div className="space-y-1">
          {OVERLAY_GROUPS.map((grp) => (
            <div key={grp.title} className="flex flex-wrap items-center gap-1">
              <span className="mr-0.5 text-[9px] text-dashboard-neutral/40">{grp.title}</span>
              {grp.params.map((p) => {
                const active = p === param && layers.includes(SCALAR_META[p].layer);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => pickOverlay(p)}
                    className={[
                      'rounded px-1.5 py-0.5 text-[10px] transition-colors',
                      active ? 'bg-brand-cyan/20 text-brand-cyan' : 'text-dashboard-neutral hover:bg-white/5',
                    ].join(' ')}
                  >
                    {SCALAR_META[p].label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        {/* 当前叠加色阶图例 */}
        {overlayOn && (
          <div className="mt-1.5">
            <div className="h-2 w-full rounded" style={{ background: RAMP_CSS[meta.ramp] }} />
            <div className="mt-0.5 flex justify-between text-[9px] text-dashboard-neutral/50">
              <span>{meta.min}</span><span>{meta.label} ({meta.unit})</span><span>{meta.max}</span>
            </div>
          </div>
        )}
      </div>

      {/* 悬停读数 */}
      <div className="border-t border-dashboard-neutral/10 pt-1.5 text-[10px] leading-relaxed text-dashboard-neutral/80">
        {readout ? (
          <>
            <div className="text-dashboard-neutral/55">{readout.lat.toFixed(1)}°, {readout.lng.toFixed(1)}°</div>
            {readout.wind != null && <div>风速 <span className="text-white">{readout.wind.toFixed(1)}</span> m/s</div>}
            {readout.ocean != null && <div>洋流 <span className="text-white">{readout.ocean.toFixed(2)}</span> m/s</div>}
            {readout.wave != null && <div>浪高 <span className="text-white">{readout.wave.toFixed(1)}</span> m</div>}
            {readout.scalar != null && <div>{meta.label} <span className="text-white">{readout.scalar.toFixed(1)}</span> {meta.unit}</div>}
          </>
        ) : (
          <span className="text-dashboard-neutral/45">移动鼠标查看该处实时数值</span>
        )}
      </div>
    </div>
  );
}
