'use client';

/**
 * 太空天气卡 — 宇宙层（NOAA SWPC 行星 Kp 指数，免密钥真实，近实时）。
 * 展示最新 Kp、G 级地磁暴等级、近 ~3 天 Kp 柱状序列与极光关联提示。真实观测·非预测。
 * 仅在宇宙层显示；随右轨面板流式排布。
 */

import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { useMapStore } from '@/store/useMapStore';
import { ageLabel } from '@/lib/format/time';
import { MiniChart } from '@/components/ui/EventViz';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

/** 数字滚动到目标值（缓出；尊重 reduced-motion 则直接落定） */
function useCountUp(target: number | null, ms = 700): number {
  const [v, setV] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    if (target == null) { setV(0); return; }
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setV(target); return; }
    const from = 0, start = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      setV(from + (target - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, ms]);
  return v;
}

interface SpaceWeather { kp: number | null; series: number[]; times: string[]; gLevel: string; gDesc: string; windSpeed: number | null; bz: number | null; generatedAt: string; source: string; stale?: boolean }

function kpColor(kp: number): string {
  return kp >= 7 ? '#f43f5e' : kp >= 5 ? '#fb923c' : kp >= 4 ? '#fbbf24' : '#34d399';
}

export function SpaceWeatherCard({ className = '' }: { className?: string }) {
  const inSpace = useMapStore((s) => s.activeBody === 'earth' && s.activeTier === 'space');
  const setTier = useMapStore((s) => s.setTier);
  const toggleLayer = useMapStore((s) => s.toggleLayer);

  const viewAurora = () => {
    setTier('surface');
    if (!useMapStore.getState().activeLayers.includes('aurora')) toggleLayer('aurora');
  };
  const { data } = useSWR<SpaceWeather>(inSpace ? '/api/spaceweather' : null, fetcher, {
    revalidateOnFocus: false, refreshInterval: 10 * 60 * 1000, dedupingInterval: 5 * 60 * 1000,
  });
  const kp = data?.kp ?? null;
  const kpAnim = useCountUp(kp);

  if (!inSpace) return null;

  const color = kp != null ? kpColor(kp) : '#94a3b8';
  const isStorm = kp != null && kp >= 5;
  const auroraHint = kp == null ? '' : kp >= 7 ? '极光可达中低纬度' : kp >= 5 ? '极光向中纬度扩展' : kp >= 4 ? '高纬度极光活跃' : '极光局限极区';

  return (
    <div className={`rounded-lg border border-violet-500/25 bg-dashboard-bg/95 shadow-xl backdrop-blur-md ${className}`}>
      <div className="flex items-center gap-2 border-b border-dashboard-neutral/10 px-3 py-2">
        <span aria-hidden className="text-base leading-none">🧲</span>
        <div className="min-w-0 flex-1 text-sm font-medium text-white">太空天气 · 地磁活动</div>
        {data?.generatedAt && <span className="text-[9px] text-dashboard-neutral/40">{ageLabel(data.generatedAt)}</span>}
      </div>

      <div className="space-y-2 p-3 text-[11px]">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold leading-none tabular-nums" style={{ color }}>{kp != null ? Math.round(kpAnim) : '—'}</div>
            <div className="mt-0.5 text-[9px] text-dashboard-neutral/50">Kp 指数</div>
          </div>
          <div className="min-w-0 flex-1">
            <span className="inline-block rounded px-1.5 py-0.5 text-[11px] font-semibold" style={{ color, background: `${color}22`, border: `1px solid ${color}55` }}>
              {data?.gLevel ?? '—'} · {data?.gDesc ?? ''}
            </span>
            {auroraHint && <div className="mt-1 text-[10px] text-dashboard-neutral/60">🌌 {auroraHint}</div>}
          </div>
        </div>

        {/* Kp 0–9 刻度条 + 标记 */}
        <div>
          <div className="relative h-2 w-full overflow-hidden rounded-full" style={{ background: 'linear-gradient(90deg,#34d399 0%,#34d399 44%,#fbbf24 44%,#fbbf24 55%,#fb923c 55%,#fb923c 77%,#f43f5e 77%)' }}>
            {kp != null && <div className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-white shadow" style={{ left: `${Math.min(100, Math.max(0, (kp / 9) * 100))}%` }} />}
          </div>
          <div className="mt-0.5 flex justify-between text-[8px] text-dashboard-neutral/45"><span>0 平静</span><span>5 G1</span><span>9 G5</span></div>
        </div>

        {/* 太阳风实时（速度 + Bz；南向 Bz 利于触发地磁暴） */}
        {(data?.windSpeed != null || data?.bz != null) && (
          <div className="grid grid-cols-2 gap-1.5">
            <div className="rounded-md bg-white/5 px-2 py-1.5">
              <div className="text-sm font-semibold tabular-nums text-sky-200">{data?.windSpeed != null ? Math.round(data.windSpeed) : '—'}</div>
              <div className="text-[9px] text-dashboard-neutral/50">太阳风速度 km/s</div>
            </div>
            <div className="rounded-md bg-white/5 px-2 py-1.5">
              <div className="text-sm font-semibold tabular-nums" style={{ color: data?.bz != null && data.bz < 0 ? '#fb923c' : '#94e0c0' }}>{data?.bz != null ? data.bz.toFixed(1) : '—'}</div>
              <div className="text-[9px] text-dashboard-neutral/50">行星际 Bz nT{data?.bz != null && data.bz < 0 ? ' · 南向' : ''}</div>
            </div>
          </div>
        )}

        {/* 近 3 天 Kp 柱状序列 */}
        {data && data.series.length > 1 && (
          <div className="rounded-md border border-white/8 bg-white/[0.03] p-2">
            <div className="mb-1 text-[9px] text-dashboard-neutral/50">近 ~3 天 Kp（3 小时档）</div>
            <MiniChart series={{ label: 'Kp', points: data.series, kind: 'bars' }} color={color} />
          </div>
        )}

        {isStorm && (
          <div className="rounded-md border border-rose-500/20 bg-rose-500/5 px-2 py-1 text-[10px] text-rose-200/90">
            ⚠ 地磁暴可能影响高频通信、GNSS 定位与极区航线。
          </div>
        )}

        <button
          type="button"
          onClick={viewAurora}
          title="切到地表层并开启极光带图层"
          className="w-full rounded-md border border-violet-400/35 bg-violet-400/10 px-2 py-1 text-[11px] text-violet-100 transition-colors hover:bg-violet-400/20"
        >
          🌌 查看极光带（地表层）→
        </button>

        <div className="border-t border-dashboard-neutral/10 pt-1 text-[9px] text-dashboard-neutral/40">
          源：{data?.source ?? 'NOAA SWPC'} · 真实观测·非预测
        </div>
      </div>
    </div>
  );
}
