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
import { PROJECTIONS, graticule } from '@/lib/projection/projections';

const GRAT = graticule(30, 2);
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function ProjectionLab() {
  const projMode = useMapStore((s) => s.projMode);
  const isEarth = useMapStore((s) => s.activeBody === 'earth');
  const setProjMode = useMapStore((s) => s.setProjMode);
  const active = isEarth && projMode !== 'map';

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

  useEffect(() => {
    if (!active) return;
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const def = projMode === 'map' ? PROJECTIONS.orthographic : PROJECTIONS[projMode];
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
  }, [active, projMode, lon0, quakes, coastline, size]);

  if (!active) return null;
  const name = projMode === 'map' ? '' : PROJECTIONS[projMode].name;

  return (
    <div className="absolute inset-0 z-[5] bg-[#060a14]">
      <canvas ref={canvasRef} style={{ width: size.w, height: size.h }} className="block" />
      <div className="pointer-events-auto absolute left-1/2 top-3 z-10 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-dashboard-neutral/25 bg-dashboard-bg/85 px-3 py-1.5 text-[11px] shadow-xl backdrop-blur-md">
        <span aria-hidden>🌐</span>
        <span className="text-white">自绘投影 · {name}</span>
        <button type="button" onClick={() => setSpin((v) => !v)} className="rounded px-1.5 py-0.5 text-dashboard-neutral hover:bg-white/5 hover:text-white">{spin ? '⏸' : '▶'}</button>
        <button type="button" onClick={() => setProjMode('map')} className="rounded px-1.5 py-0.5 text-dashboard-neutral/70 hover:bg-white/5 hover:text-white">退出</button>
      </div>
      <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] text-dashboard-neutral/40">原创投影 · 海岸线 Natural Earth(公共领域) · 地震 USGS · 流场/标量适配为 A 引擎后续</div>
    </div>
  );
}
