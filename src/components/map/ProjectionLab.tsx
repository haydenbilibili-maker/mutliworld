'use client';

/**
 * 自绘投影主视图（3.0 A · 投影引擎接入主视图）。
 * 由「视图」菜单投影选择驱动（store.projMode）：全屏覆盖 maplibre，原创投影数学渲染
 * 真实海岸线(Natural Earth) + 经纬网 + 实时地震(USGS)，近地层叠加 标量浓度 + 风场粒子级平流。
 * 双画布：底图层(静态，按需重绘) + 粒子层(拖尾平流，独立 RAF)。支持拖拽旋转/滚轮缩放。
 * 选回「平面/球面」退出。独立画布、零 maplibre 重绘。
 */

import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import type { FeatureCollection } from 'geojson';
import { useMapStore } from '@/store/useMapStore';
import { useNearEarthStore, SCALAR_META } from '@/store/useNearEarthStore';
import { colorFor } from '@/lib/map/scalarColor';
import { PROJECTIONS, graticule } from '@/lib/projection/projections';
import type { ProjectionId, ProjectionParams } from '@/lib/projection/projections';

const GRAT = graticule(30, 2);
const fetcher = (url: string) => fetch(url).then((r) => r.json());
interface VecGrid { nx: number; ny: number; lon0: number; lat0: number; dLon: number; dLat: number; u: number[]; v: number[]; }
interface ScalarGrid { nx: number; ny: number; lon0: number; lat0: number; dLon: number; dLat: number; params: Record<string, number[]>; }
const FADE = 0.94, MAX_AGE = 90;

/** 矢量场双线性采样 */
function sampleVec(g: VecGrid, lng: number, lat: number): { u: number; v: number } | null {
  const yf = (lat - g.lat0) / g.dLat;
  if (yf < 0 || yf > g.ny - 1) return null;
  let xf = (lng - g.lon0) / g.dLon; xf = ((xf % g.nx) + g.nx) % g.nx;
  const i0 = Math.floor(xf), j0 = Math.floor(yf), i1 = (i0 + 1) % g.nx, j1 = Math.min(j0 + 1, g.ny - 1);
  const fx = xf - i0, fy = yf - j0, at = (j: number, i: number) => j * g.nx + i, lp = (a: number, b: number, t: number) => a + (b - a) * t;
  const u = lp(lp(g.u[at(j0, i0)], g.u[at(j0, i1)], fx), lp(g.u[at(j1, i0)], g.u[at(j1, i1)], fx), fy);
  const v = lp(lp(g.v[at(j0, i0)], g.v[at(j0, i1)], fx), lp(g.v[at(j1, i0)], g.v[at(j1, i1)], fx), fy);
  return Number.isFinite(u) && Number.isFinite(v) ? { u, v } : null;
}

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
  const nearEarth = active && activeTier === 'near_earth';
  const windOn = nearEarth && activeLayers.includes('wind_flow');
  const overlayOn = nearEarth && activeLayers.includes(meta.layer);

  const [spin, setSpin] = useState(true);
  const [lon0, setLon0] = useState(0);
  const [lat0, setLat0] = useState(12);
  const [zoom, setZoom] = useState(1);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const baseRef = useRef<HTMLCanvasElement | null>(null);
  const partRef = useRef<HTMLCanvasElement | null>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  // 实时视图参数（供粒子 RAF 读取，避免重启）
  const view = useRef({ lon0, lat0, zoom, w: 800, h: 600 });
  view.current = { lon0, lat0, zoom, w: size.w, h: size.h };

  useEffect(() => {
    if (!active) return;
    const measure = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [active]);

  useEffect(() => {
    if (!active || !spin) return;
    let raf = 0, last = 0;
    const tick = (ts: number) => {
      raf = requestAnimationFrame(tick);
      if (ts - last < 33) return;
      last = ts;
      setLon0((v) => (v + 0.28 + 180) % 360 - 180);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, spin]);

  const { data: quakes } = useSWR<FeatureCollection>(active ? '/api/earthquakes' : null, fetcher, { revalidateOnFocus: false, refreshInterval: 5 * 60 * 1000, dedupingInterval: 60 * 1000 });
  const { data: coastline } = useSWR<FeatureCollection>(active ? '/api/coastline' : null, fetcher, { revalidateOnFocus: false, revalidateIfStale: false, dedupingInterval: 24 * 3600 * 1000 });
  const { data: wind } = useSWR<VecGrid>(windOn ? '/api/wind-grid' : null, fetcher, { revalidateOnFocus: false, refreshInterval: 30 * 60 * 1000, dedupingInterval: 5 * 60 * 1000 });
  const { data: scalar } = useSWR<ScalarGrid>(overlayOn ? meta.endpoint : null, fetcher, { revalidateOnFocus: false, refreshInterval: 30 * 60 * 1000, dedupingInterval: 5 * 60 * 1000 });

  const def = active ? (PROJECTIONS[projMode as ProjectionId] ?? PROJECTIONS.orthographic) : PROJECTIONS.orthographic;

  // 底图层：海岸线/经纬网/标量/地震（按需重绘）
  useEffect(() => {
    if (!active) return;
    const cv = baseRef.current; if (!cv) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
    const W = size.w, H = size.h;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const scale = (Math.min(W, H) / 2) * 0.82 * zoom / Math.max(def.xHalf, def.yHalf);
    const cx = W / 2, cy = H / 2;
    const params: ProjectionParams = { lon0, lat0 };
    const P = (lng: number, lat: number) => { const r = def.project(lng, lat, params); return r ? [cx + r[0] * scale, cy + r[1] * scale] as [number, number] : null; };

    if (def.id === 'orthographic') { ctx.beginPath(); ctx.arc(cx, cy, scale, 0, Math.PI * 2); ctx.fillStyle = 'rgba(8,14,28,0.9)'; ctx.fill(); }

    const ring = (pts: number[][], color: string, width: number) => {
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath();
      let pen = false;
      for (const pt of pts) { const p = P(pt[0], pt[1]); if (!p) { pen = false; continue; } if (!pen) { ctx.moveTo(p[0], p[1]); pen = true; } else ctx.lineTo(p[0], p[1]); }
      ctx.stroke();
    };
    const land = (coastline as { features?: { geometry?: { type?: string; coordinates?: unknown } }[] } | undefined)?.features;
    if (Array.isArray(land)) for (const f of land) {
      const g = f.geometry; if (!g?.coordinates) continue;
      if (g.type === 'Polygon') for (const r of g.coordinates as number[][][]) ring(r, 'rgba(122,180,140,0.6)', 0.8);
      else if (g.type === 'MultiPolygon') for (const poly of g.coordinates as number[][][][]) for (const r of poly) ring(r, 'rgba(122,180,140,0.6)', 0.8);
    }
    for (const g of GRAT) ring(g.pts, 'rgba(63,200,224,0.16)', 0.6);
    ring(GRAT.find((g) => g.type === 'parallel' && g.pts[0][1] === 0)?.pts ?? [], 'rgba(232,181,99,0.55)', 1.1);

    if (scalar?.nx && scalar.params[meta.key]) {
      const sg = scalar, field = sg.params[meta.key], span = (meta.max - meta.min) || 1;
      for (let k = 0; k < field.length; k++) {
        const val = field[k]; if (!Number.isFinite(val)) continue;
        const i = k % sg.nx, j = Math.floor(k / sg.nx);
        const p = P(sg.lon0 + i * sg.dLon, sg.lat0 + j * sg.dLat); if (!p) continue;
        const t = (val - meta.min) / span;
        const [r, g2, b] = colorFor(meta.ramp, scheme, t);
        const inten = meta.ramp === 'diverging' ? Math.min(1, Math.abs(t - 0.5) * 2) : Math.max(0, Math.min(1, t));
        ctx.beginPath(); ctx.arc(p[0], p[1], 3.2, 0, Math.PI * 2); ctx.fillStyle = `rgba(${r},${g2},${b},${0.22 + 0.5 * inten})`; ctx.fill();
      }
    }
    if (quakes?.type === 'FeatureCollection') for (const f of quakes.features) {
      const g = f.geometry as { type?: string; coordinates?: number[] } | null;
      if (!g || g.type !== 'Point' || !g.coordinates) continue;
      const mag = Number((f.properties as { mag?: number } | null)?.mag ?? 0);
      const p = P(g.coordinates[0], g.coordinates[1]); if (!p) continue;
      ctx.beginPath(); ctx.arc(p[0], p[1], 1.3 + Math.max(0, mag) * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = mag >= 6 ? 'rgba(185,28,28,0.95)' : mag >= 5 ? 'rgba(239,68,68,0.9)' : 'rgba(248,113,113,0.85)';
      ctx.fill();
    }
  }, [active, projMode, lon0, lat0, zoom, quakes, coastline, scalar, scheme, meta, size, def]);

  // 粒子层：风场粒子级平流（经纬空间平流 → 投影；拖尾）
  useEffect(() => {
    if (!active || !windOn || !wind?.nx) return;
    const cv = partRef.current; if (!cv) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let W = view.current.w, H = view.current.h;
    const fit = () => { W = view.current.w; H = view.current.h; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    fit();
    const count = Math.min(2600, Math.round((W * H) / 1100));
    interface P { lng: number; lat: number; age: number }
    const spawn = (p: P) => { p.lng = -180 + Math.random() * 360; p.lat = -82 + Math.random() * 164; p.age = Math.floor(Math.random() * MAX_AGE); };
    const ps: P[] = Array.from({ length: count }, () => { const p = { lng: 0, lat: 0, age: 0 }; spawn(p); return p; });
    let raf = 0, running = true;
    const proj = (lng: number, lat: number) => {
      const v = view.current;
      const scale = (Math.min(v.w, v.h) / 2) * 0.82 * v.zoom / Math.max(def.xHalf, def.yHalf);
      const r = def.project(lng, lat, { lon0: v.lon0, lat0: v.lat0 });
      return r ? [v.w / 2 + r[0] * scale, v.h / 2 + r[1] * scale] as [number, number] : null;
    };
    const frame = () => {
      if (!running) return;
      if (cv.width !== Math.round(view.current.w * dpr) || cv.height !== Math.round(view.current.h * dpr)) fit();
      ctx.globalCompositeOperation = 'destination-in';
      ctx.fillStyle = `rgba(0,0,0,${FADE})`; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over'; ctx.lineWidth = 1.1;
      for (const p of ps) {
        if (p.age > MAX_AGE) { spawn(p); continue; }
        const w = sampleVec(wind, p.lng, p.lat);
        if (!w) { spawn(p); continue; }
        const p0 = proj(p.lng, p.lat);
        const kk = 0.16;
        const nlng = p.lng + (w.u * kk) / Math.max(Math.cos(p.lat * Math.PI / 180), 0.25);
        const nlat = p.lat + w.v * kk;
        const p1 = proj(nlng, nlat);
        if (p0 && p1) {
          const spd = Math.hypot(w.u, w.v);
          ctx.strokeStyle = spd < 8 ? 'rgba(150,225,255,0.55)' : spd < 16 ? 'rgba(225,242,255,0.75)' : 'rgba(252,200,140,0.85)';
          ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke();
        }
        p.lng = nlng > 180 ? nlng - 360 : nlng < -180 ? nlng + 360 : nlng; p.lat = nlat; p.age++;
        if (p.lat > 88 || p.lat < -88) spawn(p);
      }
      raf = requestAnimationFrame(frame);
    };
    if (!reduce) raf = requestAnimationFrame(frame);
    return () => { running = false; cancelAnimationFrame(raf); };
  }, [active, windOn, wind, def, projMode]);

  if (!active) return null;
  const name = PROJECTIONS[projMode as ProjectionId]?.name ?? '';

  // 拖拽旋转 / 滚轮缩放
  const onPointerDown = (e: React.PointerEvent) => { dragRef.current = { x: e.clientX, y: e.clientY }; setSpin(false); (e.target as HTMLElement).setPointerCapture?.(e.pointerId); };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current; if (!d) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y; dragRef.current = { x: e.clientX, y: e.clientY };
    setLon0((v) => ((v - dx * 0.3 + 180) % 360 + 360) % 360 - 180);
    setLat0((v) => Math.max(-85, Math.min(85, v + dy * 0.3)));
  };
  const onPointerUp = () => { dragRef.current = null; };
  const onWheel = (e: React.WheelEvent) => { setZoom((z) => Math.max(0.5, Math.min(4, z * (e.deltaY < 0 ? 1.1 : 1 / 1.1)))); };

  return (
    <div className="absolute inset-0 z-[5] bg-[#060a14]">
      <canvas ref={baseRef} style={{ width: size.w, height: size.h }} className="absolute inset-0 block" />
      <canvas
        ref={partRef}
        style={{ width: size.w, height: size.h }}
        className="absolute inset-0 block touch-none cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp} onWheel={onWheel}
      />
      <div className="pointer-events-auto absolute left-1/2 top-3 z-10 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-dashboard-neutral/25 bg-dashboard-bg/85 px-3 py-1.5 text-[11px] shadow-xl backdrop-blur-md">
        <span aria-hidden>🌐</span>
        <span className="text-white">自绘投影 · {name}</span>
        <button type="button" onClick={() => setSpin((v) => !v)} className="rounded px-1.5 py-0.5 text-dashboard-neutral hover:bg-white/5 hover:text-white">{spin ? '⏸' : '▶'}</button>
        <button type="button" onClick={() => { setLon0(0); setLat0(12); setZoom(1); }} className="rounded px-1.5 py-0.5 text-dashboard-neutral/70 hover:bg-white/5 hover:text-white">复位</button>
        <button type="button" onClick={() => setProjMode('map')} className="rounded px-1.5 py-0.5 text-dashboard-neutral/70 hover:bg-white/5 hover:text-white">退出</button>
      </div>
      <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] text-dashboard-neutral/40">拖拽旋转 · 滚轮缩放 · 海岸线(Natural Earth)/地震(USGS)/风场粒子+标量(Open-Meteo·CAMS) · 真实数据</div>
    </div>
  );
}
