'use client';

/**
 * 投影实验室（3.0 A · 投影引擎预览）— 自包含独立画布，验证可插拔投影后端。
 * 用原创投影数学渲染经纬网 + 球体，可切换 等距柱/正射/球面立体/等距方位 并旋转。
 * 与 maplibre 完全独立、默认关闭（零开销）；为后续叠加海岸线/地图内容打基础。
 * 仅在近地空间层提供入口（投影是近地视图的核心诉求）。
 */

import { useEffect, useRef, useState } from 'react';
import { useMapStore } from '@/store/useMapStore';
import { PROJECTION_LIST, PROJECTIONS, graticule, type ProjectionId } from '@/lib/projection/projections';

const GRAT = graticule(30, 2);

export function ProjectionLab() {
  const inNearEarth = useMapStore((s) => s.activeBody === 'earth' && s.activeTier === 'near_earth');
  const [open, setOpen] = useState(false);
  const [proj, setProj] = useState<ProjectionId>('orthographic');
  const [lon0, setLon0] = useState(0);
  const [spin, setSpin] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lon0Ref = useRef(lon0);
  lon0Ref.current = lon0;

  // 自旋（独立画布、非地图重绘；仅打开时运行）
  useEffect(() => {
    if (!open || !spin) return;
    let raf = 0;
    let last = 0;
    const tick = (ts: number) => {
      raf = requestAnimationFrame(tick);
      if (ts - last < 33) return; // ~30fps
      last = ts;
      setLon0((v) => (v + 0.6 + 180) % 360 - 180);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open, spin]);

  // 绘制
  useEffect(() => {
    if (!open) return;
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
    const W = 360, H = 360;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const def = PROJECTIONS[proj];
    const scale = (Math.min(W, H) / 2) * 0.92 / Math.max(def.xHalf, def.yHalf);
    const cx = W / 2, cy = H / 2;
    const params = { lon0, lat0: 18 }; // 略微倾斜，立体感

    const drawLine = (pts: [number, number][], color: string, width: number) => {
      ctx.strokeStyle = color; ctx.lineWidth = width;
      ctx.beginPath();
      let pen = false;
      for (const [lng, lat] of pts) {
        const r = def.project(lng, lat, params);
        if (!r) { pen = false; continue; }
        const x = cx + r[0] * scale, y = cy + r[1] * scale;
        if (!pen) { ctx.moveTo(x, y); pen = true; } else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    // 球体底盘（正射/方位类用圆）
    if (proj !== 'equirectangular') {
      ctx.beginPath();
      ctx.arc(cx, cy, scale * (proj === 'orthographic' ? 1 : def.xHalf * 0.999), 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(10,18,34,0.6)'; ctx.fill();
    }
    for (const g of GRAT) drawLine(g.pts, 'rgba(63,200,224,0.28)', 0.7);
    // 强调赤道与本初子午线
    drawLine(GRAT.find((g) => g.type === 'parallel' && g.pts[0][1] === 0)?.pts ?? [], 'rgba(232,181,99,0.8)', 1.3);
    drawLine(GRAT.find((g) => g.type === 'meridian' && g.pts[0][0] === 0)?.pts ?? [], 'rgba(232,181,99,0.55)', 1);
  }, [open, proj, lon0]);

  if (!inNearEarth) return null;

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pointer-events-auto fixed bottom-[6.25rem] right-3 z-30 rounded-lg border border-dashboard-neutral/25 bg-dashboard-bg/92 px-2.5 py-1.5 text-[11px] text-dashboard-neutral shadow-xl backdrop-blur-md hover:text-white max-sm:bottom-[7rem]"
          title="投影实验室（A 投影引擎预览）"
        >
          🌐 投影实验室
        </button>
      )}
      {open && (
        <div className="pointer-events-auto fixed bottom-[6.25rem] right-3 z-40 w-[min(23rem,calc(100vw-1.5rem))] rounded-lg border border-dashboard-neutral/25 bg-dashboard-bg/95 p-3 shadow-2xl backdrop-blur-md max-sm:bottom-[7rem]">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[12px] font-medium text-white">🌐 投影实验室 · A 引擎预览</span>
            <button type="button" onClick={() => setOpen(false)} className="rounded px-1.5 text-dashboard-neutral/60 hover:text-white">✕</button>
          </div>
          <div className="mb-2 flex flex-wrap gap-1">
            {PROJECTION_LIST.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setProj(d.id)}
                className={['rounded px-1.5 py-0.5 text-[10px] transition-colors', proj === d.id ? 'bg-sky-500/25 text-sky-200' : 'text-dashboard-neutral/60 hover:bg-white/5'].join(' ')}
              >
                {d.name}
              </button>
            ))}
          </div>
          <div className="flex justify-center">
            <canvas ref={canvasRef} style={{ width: 360, height: 360 }} className="rounded-md" />
          </div>
          <div className="mt-2 flex items-center gap-2 text-[10px] text-dashboard-neutral/60">
            <button type="button" onClick={() => setSpin((v) => !v)} className="rounded px-1.5 py-0.5 hover:bg-white/5">{spin ? '⏸ 暂停' : '▶ 自旋'}</button>
            <span className="shrink-0">经度</span>
            <input type="range" min={-180} max={180} value={lon0} onChange={(e) => { setSpin(false); setLon0(Number(e.target.value)); }} className="h-1 flex-1 accent-sky-400" aria-label="中心经度" />
          </div>
          <p className="mt-1 text-[9px] leading-snug text-dashboard-neutral/40">原创投影数学·零依赖·与 maplibre 并存；后续叠加海岸线与地图内容（A 引擎演进中）。</p>
        </div>
      )}
    </>
  );
}
