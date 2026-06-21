'use client';

/**
 * 自绘投影主视图（3.0 A · 投影引擎接入主视图）。
 * 由「视图」菜单的投影选择驱动（store.projMode）：选中自绘投影时，全屏覆盖 maplibre，
 * 用原创投影数学渲染 真实海岸线(Natural Earth) + 经纬网 + 实时地震(USGS)，自旋动画。
 * 选回「平面/球面」即退出（projMode='map'）。独立画布、零地图重绘。
 * 现承载海岸线/经纬网/地震；流场/标量适配为 A 引擎后续。
 */

import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import type { FeatureCollection } from 'geojson';
import { useMapStore } from '@/store/useMapStore';
import { useNearEarthStore, SCALAR_META } from '@/store/useNearEarthStore';
import { colorFor } from '@/lib/map/scalarColor';
import { PROJECTIONS, graticule } from '@/lib/projection/projections';
import type { ProjectionId } from '@/lib/projection/projections';

const GRAT = graticule(30, 2);
const fetcher = (url: string) => fetch(url).then((r) => r.json());
interface VecGrid { nx: number; ny: number; lon0: number; lat0: number; dLon: number; dLat: number; u: number[]; v: number[]; }
interface ScalarGrid { nx: number; ny: number; lon0: number; lat0: number; dLon: number; dLat: number; params: Record<string, number[]>; }

	export function ProjectionLab() {
	  const projMode: 'map' | ProjectionId = useMapStore((s) => s.projMode);
  const isEarth = useMapStore((s) => s.activeBody === 'earth');
  const setProjMode = useMapStore((s) => s.setProjMode);
  const activeTier = useMapStore((s) => s.activeTier);
  const activeLayers = useMapStore((s) => s.activeLayers);
  const scheme = useMapStore((s) => s.overlayScheme);
  const param = useNearEarthStore((s) => s.param);
  const meta = SCALAR_META[param];
  const active = isEarth && projMode !== 'map';
  // 近地层时叠加流场/标量（适配到自绘投影）
  const nearEarth = active && activeTier === 'near_earth';
  const windOn = nearEarth && activeLayers.includes('wind_flow');
  const overlayOn = nearEarth && activeLayers.includes(meta.layer);

  const [spin, setSpin] = useState(true);
  const [lon0, setLon0] = useState(0);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 视口尺寸
  useEffect(() => {
    if (!active) return;
    const measure = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [active]);

  // 自旋（独立画布、非地图重绘）
  useEffect(() => {
    if (!active || !spin) return;
    let raf = 0, last = 0;
    const tick = (ts: number) => {
      raf = requestAnimationFrame(tick);
      if (ts - last < 33) return;
      last = ts;
      setLon0((v) => (v + 0.35 + 180) % 360 - 180);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, spin]);

  const { data: quakes } = useSWR<FeatureCollection>(active ? '/api/earthquakes' : null, fetcher, { revalidateOnFocus: false, refreshInterval: 5 * 60 * 1000, dedupingInterval: 60 * 1000 });
  const { data: coastline } = useSWR<FeatureCollection>(active ? '/api/coastline' : null, fetcher, { revalidateOnFocus: false, revalidateIfStale: false, dedupingInterval: 24 * 3600 * 1000 });
  const { data: wind } = useSWR<VecGrid>(windOn ? '/api/wind-grid' : null, fetcher, { revalidateOnFocus: false, refreshInterval: 30 * 60 * 1000, dedupingInterval: 5 * 60 * 1000 });
  const { data: scalar } = useSWR<ScalarGrid>(overlayOn ? meta.endpoint : null, fetcher, { revalidateOnFocus: false, refreshInterval: 30 * 60 * 1000, dedupingInterval: 5 * 60 * 1000 });

  useEffect(() => {
    if (!active) return;
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const isMapMode = (projMode as string) === 'map';
    const def = isMapMode ? PROJECTIONS.orthographic : PROJECTIONS[projMode];
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
    const W = size.w, H = size.h;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const scale = (Math.min(W, H) / 2) * 0.82 / Math.max(def.xHalf, def.yHalf);
    const cx = W / 2, cy = H / 2;
    const params = { lon0, lat0: 12 };

    if (def.id === 'orthographic') { ctx.beginPath(); ctx.arc(cx, cy, scale, 0, Math.PI * 2); ctx.fillStyle = 'rgba(8,14,28,0.85)'; ctx.fill(); }

    const ring = (pts: number[][], color: string, width: number) => {
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath();
      let pen = false;
      for (const pt of pts) {
        const r = def.project(pt[0], pt[1], params);
        if (!r) { pen = false; continue; }
        const x = cx + r[0] * scale, y = cy + r[1] * scale;
        if (!pen) { ctx.moveTo(x, y); pen = true; } else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    const land = (coastline as { features?: { geometry?: { type?: string; coordinates?: unknown } }[] } | undefined)?.features;
    if (Array.isArray(land)) {
      for (const f of land) {
        const g = f.geometry; if (!g?.coordinates) continue;
        if (g.type === 'Polygon') for (const r of g.coordinates as number[][][]) ring(r, 'rgba(122,180,140,0.6)', 0.8);
        else if (g.type === 'MultiPolygon') for (const poly of g.coordinates as number[][][][]) for (const r of poly) ring(r, 'rgba(122,180,140,0.6)', 0.8);
      }
    }
    for (const g of GRAT) ring(g.pts, 'rgba(63,200,224,0.18)', 0.6);
    ring(GRAT.find((g) => g.type === 'parallel' && g.pts[0][1] === 0)?.pts ?? [], 'rgba(232,181,99,0.6)', 1.1);

    // 标量浓度（适配投影）：网格单元中心着色点
    if (scalar?.nx && scalar.params[meta.key]) {
      const sg = scalar; const field = sg.params[meta.key]; const span = (meta.max - meta.min) || 1;
      for (let k = 0; k < field.length; k++) {
        const v = field[k]; if (!Number.isFinite(v)) continue;
        const i = k % sg.nx, j = Math.floor(k / sg.nx);
        const r = def.project(sg.lon0 + i * sg.dLon, sg.lat0 + j * sg.dLat, params);
        if (!r) continue;
        const t = (v - meta.min) / span;
        const [cr, cg, cb] = colorFor(meta.ramp, scheme, t);
        const intensity = meta.ramp === 'diverging' ? Math.min(1, Math.abs(t - 0.5) * 2) : Math.max(0, Math.min(1, t));
        ctx.beginPath(); ctx.arc(cx + r[0] * scale, cy + r[1] * scale, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${0.25 + 0.5 * intensity})`; ctx.fill();
      }
    }
    // 风场流线（适配投影）：每格沿风向短线
    if (wind?.nx) {
      const wg = wind; ctx.lineWidth = 0.9;
      for (let k = 0; k < wg.u.length; k++) {
        const u = wg.u[k], v = wg.v[k]; if (!Number.isFinite(u) || !Number.isFinite(v)) continue;
        const spd = Math.hypot(u, v); if (spd < 0.5) continue;
        const i = k % wg.nx, j = Math.floor(k / wg.nx);
        const lng = wg.lon0 + i * wg.dLon, lat = wg.lat0 + j * wg.dLat;
        const kk = 0.18;
        const r0 = def.project(lng, lat, params);
        const r1 = def.project(lng + (u * kk) / Math.max(Math.cos(lat * Math.PI / 180), 0.25), lat + v * kk, params);
        if (!r0 || !r1) continue;
        ctx.strokeStyle = spd < 8 ? 'rgba(150,225,255,0.5)' : spd < 16 ? 'rgba(225,242,255,0.7)' : 'rgba(252,200,140,0.8)';
        ctx.beginPath(); ctx.moveTo(cx + r0[0] * scale, cy + r0[1] * scale); ctx.lineTo(cx + r1[0] * scale, cy + r1[1] * scale); ctx.stroke();
      }
    }

    if (quakes?.type === 'FeatureCollection') {
      for (const f of quakes.features) {
        const g = f.geometry as { type?: string; coordinates?: number[] } | null;
        if (!g || g.type !== 'Point' || !g.coordinates) continue;
        const mag = Number((f.properties as { mag?: number } | null)?.mag ?? 0);
        const r = def.project(g.coordinates[0], g.coordinates[1], params);
        if (!r) continue;
        ctx.beginPath(); ctx.arc(cx + r[0] * scale, cy + r[1] * scale, 1.3 + Math.max(0, mag) * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = mag >= 6 ? 'rgba(185,28,28,0.95)' : mag >= 5 ? 'rgba(239,68,68,0.9)' : 'rgba(248,113,113,0.85)';
        ctx.fill();
      }
    }
  }, [active, projMode, lon0, quakes, coastline, size, wind, scalar, scheme, meta]);

  if (!active) return null;
  const mode = projMode as string;
  const name = mode === 'map' ? '' : PROJECTIONS[projMode].name;

  return (
    <div className="absolute inset-0 z-[5] bg-[#060a14]">
      <canvas ref={canvasRef} style={{ width: size.w, height: size.h }} className="block" />
      <div className="pointer-events-auto absolute left-1/2 top-3 z-10 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-dashboard-neutral/25 bg-dashboard-bg/85 px-3 py-1.5 text-[11px] shadow-xl backdrop-blur-md">
        <span aria-hidden>🌐</span>
        <span className="text-white">自绘投影 · {name}</span>
        <button type="button" onClick={() => setSpin((v) => !v)} className="rounded px-1.5 py-0.5 text-dashboard-neutral hover:bg-white/5 hover:text-white">{spin ? '⏸' : '▶'}</button>
        <button type="button" onClick={() => setProjMode('map')} className="rounded px-1.5 py-0.5 text-dashboard-neutral/70 hover:bg-white/5 hover:text-white">退出</button>
      </div>
      <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] text-dashboard-neutral/40">原创投影 · 海岸线(Natural Earth) · 地震(USGS) · 近地层叠加风场流线/标量浓度(Open-Meteo/CAMS) · 真实数据</div>
    </div>
  );
}
