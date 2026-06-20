'use client';

/**
 * 近地数据条 — 置于底部控制栏上方，醒目展示当前标量叠加的浓度色阶图例 + 鼠标悬停实时读数。
 * 替代原左下角弹窗：动画流场入「视图」菜单、标量叠加入「图层」模块，本条专注「数据 + 图例」。
 * 仅在近地空间层显示；挂载于 MapContainer（持有地图上下文，监听 mousemove 取真实数据）。
 */

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import type maplibregl from 'maplibre-gl';
import { useMapContext } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { useNearEarthStore, SCALAR_META } from '@/store/useNearEarthStore';
import { rampCss } from '@/lib/map/scalarColor';

interface GridMeta { generatedAt?: string; source?: string }
interface VecGrid extends GridMeta { nx: number; ny: number; lon0: number; lat0: number; dLon: number; dLat: number; u: number[]; v: number[]; }
interface ScalarGrid extends GridMeta { nx: number; ny: number; lon0: number; lat0: number; dLon: number; dLat: number; params: Record<string, number[]>; }
const fetcher = (url: string) => fetch(url).then((r) => r.json());

const COMPASS = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
/** 由 u(东)/v(北) 分量求「去向」罗盘方位 */
function compass(u: number, v: number): string {
  const ang = (Math.atan2(u, v) * 180 / Math.PI + 360) % 360;
  return COMPASS[Math.round(ang / 45) % 8];
}
/** 相对更新时刻 */
function relTime(iso?: string): string {
  if (!iso) return '';
  const d = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(d) || d < 0) return '刚刚';
  const m = Math.floor(d / 60000);
  if (m < 1) return '刚刚';
  if (m < 60) return `${m}分钟前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}小时前`;
  return `${Math.floor(h / 24)}天前`;
}

function bilerp(field: number[], g: { nx: number; ny: number; lon0: number; lat0: number; dLon: number; dLat: number }, lng: number, lat: number): number | null {
  const yf = (lat - g.lat0) / g.dLat;
  if (yf < 0 || yf > g.ny - 1) return null;
  let xf = (lng - g.lon0) / g.dLon; xf = ((xf % g.nx) + g.nx) % g.nx;
  const i0 = Math.floor(xf), j0 = Math.floor(yf), i1 = (i0 + 1) % g.nx, j1 = Math.min(j0 + 1, g.ny - 1);
  const fx = xf - i0, fy = yf - j0, at = (j: number, i: number) => j * g.nx + i, lp = (a: number, b: number, t: number) => a + (b - a) * t;
  const v = lp(lp(field[at(j0, i0)], field[at(j0, i1)], fx), lp(field[at(j1, i0)], field[at(j1, i1)], fx), fy);
  return Number.isFinite(v) ? v : null;
}

interface Readout { lat: number; lng: number; wind?: number; windDir?: string; ocean?: number; oceanDir?: string; wave?: number; waveDir?: string; scalar?: number }

/** NOAA CRW 白化预警分级（BAA 0–4） */
const BAA_LEVELS: { label: string; color: string }[] = [
  { label: '无', color: '#cbd5e1' },
  { label: '关注', color: '#facc15' },
  { label: '警告', color: '#fb923c' },
  { label: 'I级警报', color: '#ef4444' },
  { label: 'II级警报', color: '#7f1d1d' },
];
const baaLabel = (v: number) => BAA_LEVELS[Math.max(0, Math.min(4, Math.round(v)))]?.label ?? '—';

export function NearEarthDataBar() {
  const map = useMapContext();
  const inNearEarth = useMapStore((s) => s.activeBody === 'earth' && s.activeTier === 'near_earth');
  const layers = useMapStore((s) => s.activeLayers);
  const param = useNearEarthStore((s) => s.param);
  const scheme = useMapStore((s) => s.overlayScheme);
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
      if (wind?.nx) { const u = bilerp(wind.u, wind, lng, lat); const v = bilerp(wind.v, wind, lng, lat); if (u != null && v != null) { r.wind = Math.hypot(u, v); r.windDir = compass(u, v); } }
      if (ocean?.nx) { const u = bilerp(ocean.u, ocean, lng, lat); const v = bilerp(ocean.v, ocean, lng, lat); if (u != null && v != null) { r.ocean = Math.hypot(u, v); r.oceanDir = compass(u, v); } }
      if (wave?.nx) { const u = bilerp(wave.u, wave, lng, lat); const v = bilerp(wave.v, wave, lng, lat); if (u != null && v != null) { r.wave = Math.hypot(u, v); r.waveDir = compass(u, v); } }
      if (scalar?.nx && scalar.params[meta.key]) { const val = bilerp(scalar.params[meta.key], scalar, lng, lat); if (val != null) r.scalar = val; }
      setReadout(r);
    };
    map.on('mousemove', onMove);
    return () => { map.off('mousemove', onMove); };
  }, [map, inNearEarth, wind, ocean, wave, scalar, meta.key]);

  if (!inNearEarth) return null;

  // 数据来源/时效：优先活动叠加，其次活动流场
  const provGrid: GridMeta | undefined = overlayOn ? scalar : (windOn ? wind : oceanOn ? ocean : waveOn ? wave : undefined);
  const provSource = provGrid?.source;
  const provAge = relTime(provGrid?.generatedAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="pointer-events-none fixed bottom-[6.25rem] left-1/2 z-20 w-[min(44rem,calc(100vw-1.5rem))] -translate-x-1/2 max-sm:bottom-[7rem]"
    >
      <div className="pointer-events-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-lg border border-dashboard-neutral/25 bg-dashboard-bg/92 px-3 py-2 shadow-xl backdrop-blur-md transition-colors">
        {/* 图例（醒目）：BAA 离散分级 / 其余连续浓度色阶 */}
        {overlayOn && meta.ramp === 'baa' ? (
          <div className="flex min-w-[14rem] flex-1 items-center gap-2">
            <span className="shrink-0 text-[12px] font-medium text-white">{meta.label}</span>
            <div className="flex flex-1 flex-wrap gap-x-2 gap-y-0.5">
              {BAA_LEVELS.map((lv) => (
                <span key={lv.label} className="flex items-center gap-1 text-[9px] text-dashboard-neutral/70">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: lv.color }} />
                  {lv.label}
                </span>
              ))}
            </div>
          </div>
        ) : overlayOn ? (
          <div className="flex min-w-[14rem] flex-1 items-center gap-2">
            <span className="shrink-0 text-[12px] font-medium text-white">{meta.label}</span>
            <div className="flex flex-1 flex-col gap-0.5">
              <div className="h-2.5 w-full rounded" style={{ background: rampCss(meta.ramp, scheme) }} />
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

        {/* 实时读数（含流向） */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-dashboard-neutral/80">
          {readout ? (
            <>
              <span className="text-dashboard-neutral/50">{readout.lat.toFixed(1)}°, {readout.lng.toFixed(1)}°</span>
              {readout.wind != null && <span>风 <span className="text-white">{readout.wind.toFixed(1)}</span> m/s{readout.windDir && <span className="text-dashboard-neutral/55"> 向{readout.windDir}</span>}</span>}
              {readout.ocean != null && <span>洋流 <span className="text-white">{readout.ocean.toFixed(2)}</span> m/s{readout.oceanDir && <span className="text-dashboard-neutral/55"> 向{readout.oceanDir}</span>}</span>}
              {readout.wave != null && <span>浪 <span className="text-white">{readout.wave.toFixed(1)}</span> m{readout.waveDir && <span className="text-dashboard-neutral/55"> 向{readout.waveDir}</span>}</span>}
              {readout.scalar != null && (
                meta.ramp === 'baa'
                  ? <span>{meta.label} <span className="text-white">{baaLabel(readout.scalar)}</span></span>
                  : <span>{meta.label} <span className="text-white">{readout.scalar.toFixed(1)}</span> {meta.unit}</span>
              )}
            </>
          ) : (
            <span className="text-dashboard-neutral/45">移动鼠标查看该处实时数值</span>
          )}
        </div>

        {/* 数据来源 / 时效 */}
        {provSource && (
          <div className="w-full border-t border-dashboard-neutral/10 pt-1 text-[9px] text-dashboard-neutral/45">
            源：{provSource}{provAge && ` · ${provAge}更新`} · 真实数据·中立并陈
          </div>
        )}
      </div>
    </motion.div>
  );
}
