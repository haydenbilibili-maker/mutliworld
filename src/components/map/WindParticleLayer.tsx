'use client';

/**
 * 大气风场粒子流 — 对标 earth.nullschool 的招牌能力。
 *
 * canvas 叠加层：数千粒子在真实 10m 风矢量场（/api/wind-grid，Open-Meteo/GFS）中平流，
 * 拖尾淡出、按风速配色；粒子在当前视口内重生（缩放自适应密度），随地图平移/缩放实时投影。
 * 仅在「近地」层 + 大气风场图层开启时运行；页面不可见暂停；尊重 prefers-reduced-motion。
 */

import { useEffect } from 'react';
import useSWR from 'swr';
import { useMapContext } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';

interface WindGrid {
  nx: number; ny: number; lon0: number; lat0: number; dLon: number; dLat: number;
  u: number[]; v: number[];
}

const PARTICLE_COUNT = 3200;
const MAX_AGE = 90; // 帧
const SPEED_FACTOR = 0.18; // 视觉平流增益
const FADE = 0.94; // 拖尾保留率（越大尾越长）

const fetcher = (url: string) => fetch(url).then((r) => r.json());

/** 按风速着色（慢→快：青→白→暖），半透明 */
function speedColor(spd: number): string {
  if (spd < 4) return 'rgba(90,200,250,0.55)';
  if (spd < 9) return 'rgba(125,211,252,0.65)';
  if (spd < 16) return 'rgba(220,240,255,0.75)';
  if (spd < 25) return 'rgba(250,230,170,0.8)';
  return 'rgba(252,180,120,0.85)';
}

export function WindParticleLayer() {
  const map = useMapContext();
  const enabled = useMapStore(
    (s) => s.activeBody === 'earth' && s.activeTier === 'near_earth' && s.activeLayers.includes('wind_flow'),
  );
  const { data } = useSWR<WindGrid>(enabled ? '/api/wind-grid' : null, fetcher, {
    refreshInterval: 30 * 60 * 1000,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (!map || !enabled || !data || !data.nx) return;
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const container = map.getCanvasContainer();
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:2;';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) { canvas.remove(); return; }

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      // 仅在尺寸真正变化时重置（重置 width 会清空画布；避免平移时反复清空致闪烁）
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
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
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      const u = lerp(lerp(U[at(j0, i0)], U[at(j0, i1)], fx), lerp(U[at(j1, i0)], U[at(j1, i1)], fx), fy);
      const v = lerp(lerp(V[at(j0, i0)], V[at(j0, i1)], fx), lerp(V[at(j1, i0)], V[at(j1, i1)], fx), fy);
      return { u, v };
    };

    interface P { lng: number; lat: number; age: number; }
    const particles: P[] = [];
    const spawn = (p: P) => {
      const b = map.getBounds();
      let w = b.getWest(), e = b.getEast();
      const s = Math.max(b.getSouth(), -78), n = Math.min(b.getNorth(), 78);
      if (e < w) e += 360; // 跨越反子午线
      p.lng = w + Math.random() * (e - w);
      p.lat = s + Math.random() * (n - s);
      if (p.lng > 180) p.lng -= 360;
      p.age = Math.floor(Math.random() * MAX_AGE);
    };
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p: P = { lng: 0, lat: 0, age: 0 };
      spawn(p);
      particles.push(p);
    }

    let raf = 0;
    let running = true;

    const frame = () => {
      if (!running) return;
      const w = canvas.width, h = canvas.height;
      // 拖尾淡出
      ctx.globalCompositeOperation = 'destination-in';
      ctx.fillStyle = `rgba(0,0,0,${FADE})`;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = 1.1;

      for (const p of particles) {
        const wind = sample(p.lng, p.lat);
        if (!wind || p.age > MAX_AGE) { spawn(p); continue; }
        const cosLat = Math.max(0.2, Math.cos((p.lat * Math.PI) / 180));
        const nLng = p.lng + (wind.u / (111320 * cosLat)) * SPEED_FACTOR * 1000;
        const nLat = p.lat + (wind.v / 111320) * SPEED_FACTOR * 1000;
        const a = map.project([p.lng, p.lat]);
        const b = map.project([nLng, nLat]);
        // 跳过屏幕外 / 异常长线（投影跳变）
        if (Math.abs(a.x - b.x) < 120 && Math.abs(a.y - b.y) < 120 && b.x >= -50 && b.x <= w + 50 && b.y >= -50 && b.y <= h + 50) {
          const spd = Math.hypot(wind.u, wind.v);
          ctx.strokeStyle = speedColor(spd);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        p.lng = nLng > 180 ? nLng - 360 : nLng < -180 ? nLng + 360 : nLng;
        p.lat = nLat;
        p.age++;
      }
      raf = requestAnimationFrame(frame);
    };

    const onResize = () => resize();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') { if (!raf && running) raf = requestAnimationFrame(frame); }
      else { cancelAnimationFrame(raf); raf = 0; }
    };
    map.on('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    if (!reduce) raf = requestAnimationFrame(frame);
    else {
      // 减少动态：画一帧静态短线示意
      ctx.lineWidth = 1;
      for (const p of particles) {
        const wind = sample(p.lng, p.lat);
        if (!wind) continue;
        const a = map.project([p.lng, p.lat]);
        ctx.strokeStyle = speedColor(Math.hypot(wind.u, wind.v));
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
  }, [map, enabled, data]);

  return null;
}
