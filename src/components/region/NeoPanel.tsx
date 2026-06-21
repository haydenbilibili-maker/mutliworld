'use client';

/**
 * 近地天体(NEO)接近事件面板 — 仅宇宙层显示。
 * 真实数据：NASA/JPL CNEOS 近地天体接近 API（免密钥）。未来 7 天、≤0.05au 的接近事件。
 * NEO 无地表经纬度，故以面板而非地图层呈现；诚实合成、不编造。
 */

import useSWR from 'swr';
import { useMapStore } from '@/store/useMapStore';
import { DockPanel } from '@/components/region/DockPanel';

interface NeoItem { name: string; date: string; distLD: number; velocityKms: number; diameterKm: number | null; }
interface NeoBody { items?: NeoItem[]; source?: string; generatedAt?: string; }
const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface NeoPanelProps { className?: string }

function sizeLabel(km: number | null): string {
  if (km == null || !Number.isFinite(km)) return '—';
  if (km >= 1) return `~${km.toFixed(1)} km`;
  return `~${Math.round(km * 1000)} m`;
}

export function NeoPanel({ className = '' }: NeoPanelProps) {
  const activeTier = useMapStore((s) => s.activeTier);
  const enabled = activeTier === 'space';
  const { data } = useSWR<NeoBody>(enabled ? '/api/neo' : null, fetcher, {
    revalidateOnFocus: false, refreshInterval: 60 * 60 * 1000, dedupingInterval: 10 * 60 * 1000,
  });

  if (!enabled) return null;
  const items = data?.items ?? [];

  return (
    <DockPanel
      id="neo-panel"
      icon="☄️"
      title="近地天体 · 接近事件"
      className={`w-[min(18rem,calc(100vw-2rem))] border-sky-500/25 bg-dashboard-bg/95 shadow-xl backdrop-blur-md ${className}`}
    >
      <div className="space-y-1.5 text-[11px]">
        <div className="text-[10px] text-dashboard-neutral/50">未来 7 天 · 最近距离 ≤ 0.05 au（约 19.5 月球距离）· 越近越靠前</div>
        {items.length === 0 ? (
          <div className="py-2 text-center text-dashboard-neutral/45">暂无符合条件的接近事件</div>
        ) : (
          <div className="max-h-[40vh] space-y-1 overflow-y-auto pr-0.5">
            {items.map((it, i) => (
              <div key={`${it.name}-${it.date}-${i}`} className="rounded-md bg-white/5 px-2 py-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-white">{it.name}</span>
                  <span className={['tabular-nums', it.distLD < 1 ? 'text-rose-300' : it.distLD < 5 ? 'text-amber-300' : 'text-dashboard-neutral/70'].join(' ')}>
                    {it.distLD.toFixed(1)} LD
                  </span>
                </div>
                <div className="mt-0.5 flex flex-wrap gap-x-2 text-[10px] text-dashboard-neutral/55">
                  <span>{it.date}</span>
                  <span>径 {sizeLabel(it.diameterKm)}</span>
                  <span>速 {it.velocityKms.toFixed(1)} km/s</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {data?.source && (
          <div className="border-t border-dashboard-neutral/10 pt-1 text-[9px] text-dashboard-neutral/40">源：{data.source} · LD=月球距离</div>
        )}
      </div>
    </DockPanel>
  );
}
