'use client';

/**
 * 粒子流场引擎 — 对标 earth.nullschool 的招牌能力（大气风场 / 海洋洋流复用）。
 *
 * canvas 叠加层：数千粒子在真实矢量场中双线性插值平流，拖尾淡出、按速配色；
 * 粒子在当前视口内重生（缩放自适应密度），随地图平移/缩放实时投影。
 * 仅在「近地」层 + 对应图层开启时运行；页面不可见暂停；尊重 prefers-reduced-motion。
 * R4 优化：devicePixelRatio 清晰度 + 按 zoom 调粒子密度。
 */

import { useEffect, useRef } from 'react';
import useSWR from 'swr';
import type { LayerId } from '@/types/geo';
import { useMapContext } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { flowColor } from '@/lib/map/scalarColor';

interface VectorGrid {
  nx: number; ny: number; lon0: number; lat0: number; dLon: number; dLat: number;
  u: number[]; v: number[];
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface FlowConfig {
  layerId: LayerId;
  endpoint: string;
  /** 屏幕空间平流增益：每 1 m/s 每帧位移的像素数（与 zoom 无关，保证各尺度都可见） */
  gainPx: number;
  /** 速度→颜色（默认配色方案专用，各层自带审美） */
  color: (spd: number) => string;
  /** 归一化用的速度上界（非默认配色方案下 speed/maxSpeed→[0,1] 取色） */
  maxSpeed: number;
  /** 基准粒子数（zoom 自适应在此之上调整） */
  baseCount: number;
}

const WIND_CONFIG: FlowConfig = {
  layerId: 'wind_flow',
  endpoint: '/api/wind-grid',
  gainPx: 0.5, // 风 ~0–30 m/s → 每帧 0–15px
  maxSpeed: 28,
  baseCount: 4200,
  color: (spd) =>
    spd < 4 ? 'rgba(120,210,255,0.6)'
      : spd < 9 ? 'rgba(150,225,255,0.72)'
        : spd < 16 ? 'rgba(225,242,255,0.82)'
          : spd < 25 ? 'rgba(252,232,170,0.88)'
            : 'rgba(252,170,110,0.92)',
};

const OCEAN_CONFIG: FlowConfig = {
  layerId: 'ocean_flow',
  endpoint: '/api/ocean-grid',
  gainPx: 7, // 洋流 ~0–2 m/s → 每帧 0–14px
  maxSpeed: 2,
  baseCount: 2200,
  color: (spd) =>
    spd < 0.2 ? 'rgba(56,189,248,0.55)'
      : spd < 0.5 ? 'rgba(45,212,191,0.7)'
        : spd < 1 ? 'rgba(110,231,183,0.8)'
          : 'rgba(190,250,215,0.9)',
};

const WAVE_CONFIG: FlowConfig = {
  layerId: 'wave_flow',
  endpoint: '/api/wave-grid',
  gainPx: 1.6, // 有效波高 ~0–8 m → 每帧 0–13px
  maxSpeed: 9,
  baseCount: 2000,
  color: (h) =>
    h < 1 ? 'rgba(96,165,250,0.5)'
      : h < 2.5 ? 'rgba(56,189,248,0.66)'
        : h < 4 ? 'rgba(45,212,191,0.78)'
          : h < 6 ? 'rgba(167,243,208,0.86)'
            : 'rgba(240,253,250,0.92)',
};

const MAX_AGE = 100;
const FADE = 0.96; // 拖尾更长更顺滑（对标 nullschool）

function ParticleFlowLayer({ cfg }: { cfg: FlowConfig }) {
  const map = useMapContext();
  const enabled = useMapStore(
    (s) => s.activeBody === 'earth' && s.activeTier === 'near_earth' && s.activeLayers.includes(cfg.layerId),
  );
  const { data } = useSWR<VectorGrid>(enabled ? cfg.endpoint : null, fetcher, {
    refreshInterval: 30 * 60 * 1000,
    revalidateOnFocus: false,
  });

  // 视图模块的动画速度倍率 + 配色方案（级联自空间层 view 配置）；用 ref 让运行中的帧循环热更新、无需重建画布
  const flowSpeed = useMapStore((s) => s.flowSpeed);
  const scheme = useMapStore((s) => s.overlayScheme);
  const speedRef = useRef(flowSpeed);
  const schemeRef = useRef(scheme);
  useEffect(() => { speedRef.current = flowSpeed; }, [flowSpeed]);
  useEffect(() => { schemeRef.current = scheme; }, [scheme]);

  useEffect(() => {
    if (!map || !enabled || !data || !data.nx) return;
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);

    const container = map.getCanvasContainer();
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:2;';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) { canvas.remove(); return; }

    let cssW = 0, cssH = 0;
    const resize = () => {
      // 用地图画布的显示尺寸（canvasContainer 的 clientHeight 可能为 0 致零高画布）
      const mc = map.getCanvas();
      const w = mc.clientWidth || mc.width / dpr || container.clientWidth;
      const h = mc.clientHeight || mc.height / dpr || container.clientHeight;
      if (cssW !== w || cssH !== h) {
        cssW = w; cssH = h;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // 以 CSS 像素绘制（map.project 返回 CSS px）
      }
    };
    resize();

    const { nx, ny, lon0, lat0, dLon, dLat, u: U, v: V } = data;
    const sample = (lng: number, lat: number): { u: number; v: number } | null => {
      const yf = (lat - lat0) / dLat;
      if (yf < 0 || yf > ny - 1) return null;
      let xf = (lng - lon0) / dLon;
      xf = ((xf % nx) + nx) % nx;
      const i0 = Math.floor(xf), j0 = Math.floor(yf);
      const i1 = (i0 + 1) % nx, j1 = Math.min(j0 + 1, ny - 1);
      const fx = xf - i0, fy = yf - j0;
      const at = (j: number, i: number) => j * nx + i;
      const lp = (a: number, b: number, t: number) => a + (b - a) * t;
      const u = lp(lp(U[at(j0, i0)], U[at(j0, i1)], fx), lp(U[at(j1, i0)], U[at(j1, i1)], fx), fy);
      const v = lp(lp(V[at(j0, i0)], V[at(j0, i1)], fx), lp(V[at(j1, i0)], V[at(j1, i1)], fx), fy);
      return { u, v };
    };

    interface P { lng: number; lat: number; age: number; }
    // 按 zoom 自适应密度：放大时减少（视口小）、缩小时铺满
    const count = Math.round(cfg.baseCount * (map.getZoom() < 2 ? 1.1 : map.getZoom() > 5 ? 0.6 : 0.85));
    const particles: P[] = [];
    // 屏幕空间播种：在画布像素内随机取点反投影为经纬度，确保任意缩放/投影(含球面)下铺满整个视口
    const spawn = (p: P) => {
      const x = Math.random() * cssW;
      const y = Math.random() * cssH;
      const ll = map.unproject([x, y]);
      p.lng = ll.lng; p.lat = ll.lat;
      p.age = Math.floor(Math.random() * MAX_AGE);
    };
    for (let i = 0; i < count; i++) { const p: P = { lng: 0, lat: 0, age: 0 }; spawn(p); particles.push(p); }

    let raf = 0;
    let running = true;
    const frame = () => {
      if (!running) return;
      ctx.globalCompositeOperation = 'destination-in';
      ctx.fillStyle = `rgba(0,0,0,${FADE})`;
      ctx.fillRect(0, 0, cssW, cssH);
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = 1.3;
      for (const p of particles) {
        if (p.age > MAX_AGE) { spawn(p); continue; }
        const wind = sample(p.lng, p.lat);
        if (!wind) { spawn(p); continue; }
        // 屏幕空间平流：东=+x，北=-y（近似，球面下亦可接受）；gainPx × 视图动画速度倍率
        const a = map.project([p.lng, p.lat]);
        const g = cfg.gainPx * speedRef.current;
        const bx = a.x + wind.u * g;
        const by = a.y - wind.v * g;
        if (bx >= -10 && bx <= cssW + 10 && by >= -10 && by <= cssH + 10) {
          const spd = Math.hypot(wind.u, wind.v);
          ctx.strokeStyle = schemeRef.current === 'default'
            ? cfg.color(spd)
            : flowColor(schemeRef.current, Math.max(0, Math.min(1, spd / cfg.maxSpeed)), 0.82);
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(bx, by); ctx.stroke();
          const ll = map.unproject([bx, by]);
          p.lng = ll.lng; p.lat = ll.lat; p.age++;
        } else {
          spawn(p); // 出屏即在视口内重生
        }
      }
      raf = requestAnimationFrame(frame);
    };

    const onResize = () => resize();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') { if (!raf && running && !reduce) raf = requestAnimationFrame(frame); }
      else { cancelAnimationFrame(raf); raf = 0; }
    };
    map.on('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    if (!reduce) raf = requestAnimationFrame(frame);
    else {
      for (const p of particles) {
        const wind = sample(p.lng, p.lat);
        if (!wind) continue;
        const a = map.project([p.lng, p.lat]);
        ctx.strokeStyle = cfg.color(Math.hypot(wind.u, wind.v));
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.x + wind.u * 0.3, a.y - wind.v * 0.3); ctx.stroke();
      }
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      map.off('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.remove();
    };
  }, [map, enabled, data, cfg]);

  return null;
}

export function WindParticleLayer() {
  return <ParticleFlowLayer cfg={WIND_CONFIG} />;
}

export function OceanFlowLayer() {
  return <ParticleFlowLayer cfg={OCEAN_CONFIG} />;
}

export function WaveFlowLayer() {
  return <ParticleFlowLayer cfg={WAVE_CONFIG} />;
}
