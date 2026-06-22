'use client';

/**
 * 近地数据条 — 由 BottomDock 级联叠放于底部控制栏正上方，专注展示当前标量叠加的
 * 浓度色阶图例 + 鼠标悬停实时读数。替代原左下角弹窗：动画流场入「视图」菜单、标量
 * 叠加入「图层」模块，本条专注「数据 + 图例」。
 * 仅在近地空间层显示；挂载于 MapContainer（持有地图上下文，监听 mousemove 取真实数据）。
 * 定位与入场动效由 BottomDock 统一管理；本组件仅返回裸卡片，与控制栏共享玻璃语言。
 */

import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import type maplibregl from 'maplibre-gl';
import { useMapContext } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { useNearEarthStore, SCALAR_META } from '@/store/useNearEarthStore';
import { rampCss } from '@/lib/map/scalarColor';
import { ageLabel } from '@/lib/format/time';
import { useRelativeTimeTick } from '@/hooks/useRelativeTimeTick';
import { DockDataCard } from '@/components/ui/DockDataCard';
import type { EventDetail, ImpactLevel } from '@/types/geo';

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
  const selectEvent = useMapStore((s) => s.selectEvent);
  const meta = SCALAR_META[param];

  const windOn = inNearEarth && layers.includes('wind_flow');
  const oceanOn = inNearEarth && layers.includes('ocean_flow');
  const waveOn = inNearEarth && layers.includes('wave_flow');
  const overlayOn = inNearEarth && layers.includes(meta.layer);

  // 时效性：30 分钟自动刷新(对齐服务端缓存)，dedupe 防重复请求，保证读数与「更新时刻」持续新鲜
  const swrOpts = { revalidateOnFocus: false, refreshInterval: 30 * 60 * 1000, dedupingInterval: 5 * 60 * 1000 };
  const { data: wind } = useSWR<VecGrid>(windOn ? '/api/wind-grid' : null, fetcher, swrOpts);
  const { data: ocean } = useSWR<VecGrid>(oceanOn ? '/api/ocean-grid' : null, fetcher, swrOpts);
  const { data: wave } = useSWR<VecGrid>(waveOn ? '/api/wave-grid' : null, fetcher, swrOpts);
  const { data: scalar } = useSWR<ScalarGrid>(overlayOn ? meta.endpoint : null, fetcher, swrOpts);

  const [readout, setReadout] = useState<Readout | null>(null);
  // 时效标签（"X分钟前"）刷新 tick：每 60s 重算数据龄期，停留时持续新鲜；页面不可见时暂停省电。
  useRelativeTimeTick(60_000, inNearEarth);
  const lastTs = useRef(0);
  // 把数据网格存入 ref：mousemove 监听器只需挂载一次，避免 SWR 静默刷新（每 30min + 聚焦）
  // 返回新对象引用 → 解绑/重绑 mousemove → 短暂窗口内读数失效闪现。
  const windRef = useRef(wind); windRef.current = wind;
  const oceanRef = useRef(ocean); oceanRef.current = ocean;
  const waveRef = useRef(wave); waveRef.current = wave;
  const scalarRef = useRef(scalar); scalarRef.current = scalar;
  const paramKeyRef = useRef(meta.key); paramKeyRef.current = meta.key;
  const metaRef = useRef(meta); metaRef.current = meta;
  const selectEventRef = useRef(selectEvent); selectEventRef.current = selectEvent;

  useEffect(() => {
    if (!map || !inNearEarth) return;
    const onMove = (e: maplibregl.MapMouseEvent) => {
      const now = performance.now();
      if (now - lastTs.current < 80) return;
      lastTs.current = now;
      const { lng, lat } = e.lngLat;
      const r: Readout = { lat, lng };
      const w = windRef.current, o = oceanRef.current, wav = waveRef.current, sc = scalarRef.current, pkey = paramKeyRef.current;
      if (w?.nx) { const u = bilerp(w.u, w, lng, lat); const v = bilerp(w.v, w, lng, lat); if (u != null && v != null) { r.wind = Math.hypot(u, v); r.windDir = compass(u, v); } }
      if (o?.nx) { const u = bilerp(o.u, o, lng, lat); const v = bilerp(o.v, o, lng, lat); if (u != null && v != null) { r.ocean = Math.hypot(u, v); r.oceanDir = compass(u, v); } }
      if (wav?.nx) { const u = bilerp(wav.u, wav, lng, lat); const v = bilerp(wav.v, wav, lng, lat); if (u != null && v != null) { r.wave = Math.hypot(u, v); r.waveDir = compass(u, v); } }
      if (sc?.nx && sc.params[pkey]) { const val = bilerp(sc.params[pkey], sc, lng, lat); if (val != null) r.scalar = val; }
      setReadout(r);
    };
    map.on('mousemove', onMove);
    return () => { map.off('mousemove', onMove); };
  }, [map, inNearEarth]);

  // 点击取点：开富详情（实测读数 + 同纬度纬向剖面，真实双线性插值·非预测）
  useEffect(() => {
    if (!map || !inNearEarth) return;
    const onClick = (e: maplibregl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat;
      const sc = scalarRef.current, pkey = paramKeyRef.current, m = metaRef.current;
      const w = windRef.current, o = oceanRef.current, wav = waveRef.current;
      const metrics: NonNullable<EventDetail['metrics']> = [];
      let scalarVal: number | null = null;
      if (sc?.nx && sc.params[pkey]) {
        const v = bilerp(sc.params[pkey], sc, lng, lat);
        if (v != null) {
          scalarVal = v;
          metrics.push({ label: m.label, value: m.ramp === 'baa' ? baaLabel(v) : v.toFixed(1), hint: m.ramp === 'baa' ? undefined : m.unit, accent: '#38bdf8' });
        }
      }
      const pushVec = (g: VecGrid | undefined, label: string, unit: string) => {
        if (!g?.nx) return;
        const u = bilerp(g.u, g, lng, lat), v = bilerp(g.v, g, lng, lat);
        if (u != null && v != null) metrics.push({ label, value: Math.hypot(u, v).toFixed(1), hint: `${unit} 向${compass(u, v)}` });
      };
      pushVec(w, '风速', 'm/s');
      pushVec(o, '洋流', 'm/s');
      pushVec(wav, '浪高', 'm');
      if (metrics.length === 0) return; // 该处无真实数据则不弹

      // 真实采样剖面：纬向（沿经度）+ 经向（沿纬度）
      let series: EventDetail['series'];
      let series2: EventDetail['series'];
      if (sc?.nx && sc.params[pkey]) {
        const field = sc.params[pkey];
        const transect = (vary: 'lon' | 'lat', span: number, N: number) => {
          const pts: number[] = [];
          let finite = 0, fallback = 0;
          for (let i = 0; i < N; i++) {
            const off = -span / 2 + (span * i) / (N - 1);
            const v = bilerp(field, sc, vary === 'lon' ? lng + off : lng, vary === 'lon' ? lat : lat + off);
            if (v != null) { pts.push(v); finite++; fallback = v; } else { pts.push(NaN); }
          }
          return finite > 4 ? pts.map((p) => (Number.isFinite(p) ? p : fallback)) : null;
        };
        const zonal = transect('lon', 80, 29);
        if (zonal) series = { label: `纬向剖面 @ ${lat.toFixed(1)}°（${(lng - 40).toFixed(0)}°→${(lng + 40).toFixed(0)}°E）`, points: zonal, unit: m.unit, kind: 'spark' };
        const merid = transect('lat', 60, 25);
        if (merid) series2 = { label: `经向剖面 @ ${lng.toFixed(1)}°（${(lat - 30).toFixed(0)}°→${(lat + 30).toFixed(0)}°N）`, points: merid, unit: m.unit, kind: 'spark' };
      }

      let impact: ImpactLevel = 'low';
      if (scalarVal != null) {
        if (m.ramp === 'baa') impact = scalarVal >= 3 ? 'high' : scalarVal >= 2 ? 'medium' : 'low';
        else { const f = (scalarVal - m.min) / ((m.max - m.min) || 1); impact = f > 0.8 ? 'high' : f > 0.5 ? 'medium' : 'low'; }
      }

      const detail: EventDetail = {
        id: `scalar-${pkey}-${lng.toFixed(2)},${lat.toFixed(2)}`,
        title: `📈 ${m.label} · 点位读数`,
        source: sc?.source ?? '近地标量场（近实时）',
        timestamp: sc?.generatedAt ?? '',
        location: [lng, lat],
        impact_level: impact,
        category: m.layer,
        description: `${m.label} 在 ${lat.toFixed(2)}°, ${lng.toFixed(2)}° 的实测读数及同纬度纬向剖面（真实网格双线性插值，非预测）。`,
        metrics,
        series,
        series2,
        tags: [m.label, '近地标量场'],
      };
      selectEventRef.current(detail);
    };
    map.on('click', onClick);
    return () => { map.off('click', onClick); };
  }, [map, inNearEarth]);

  if (!inNearEarth) return null;

  // 数据来源/时效：优先活动叠加，其次活动流场
  const provGrid: GridMeta | undefined = overlayOn ? scalar : (windOn ? wind : oceanOn ? ocean : waveOn ? wave : undefined);
  const provSource = provGrid?.source;
  const provAge = provGrid?.generatedAt ? ageLabel(provGrid.generatedAt) : '';

  return (
    <DockDataCard
      footer={provSource ? (
        <div className="w-full border-t border-dashboard-neutral/10 pt-1 text-[9px] text-dashboard-neutral/45">
          源：{provSource}{provAge && ` · ${provAge}更新`} · 真实数据·中立并陈
        </div>
      ) : undefined}
    >
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

      {/* 实时读数（含流向） — tabular-nums：鼠标移动时数字等宽不抖 */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] tabular-nums text-dashboard-neutral/80">
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
    </DockDataCard>
  );
}
