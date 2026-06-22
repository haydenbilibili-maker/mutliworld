'use client';

/**
 * 区域 / 国家详情卡 — 对标 World Monitor Round 8
 * 由搜索选中区域或区域切换触发；展示该区域画像与数据覆盖摘要（结构化合成，不编造）。
 */

import { useMemo } from 'react';
import { useRegionDetailStore } from '@/store/useRegionDetailStore';
import { useMapStore } from '@/store/useMapStore';
import { getRegion } from '@/regions';
import { getSituationForRegion } from '@/regions/regional-situation';
import { LAYER_LABELS } from '@/lib/constants';
import { PanelCloseButton } from '@/components/ui/PanelCloseButton';
import type { EventDetail, ImpactLevel } from '@/types/geo';

interface RegionDetailCardProps {
  className?: string;
}

const IMPACT_RANK: Record<ImpactLevel, number> = {
  critical: 3,
  high: 2,
  medium: 1,
  low: 0,
};

const IMPACT_COLOR: Record<ImpactLevel, string> = {
  critical: 'text-rose-400',
  high: 'text-orange-400',
  medium: 'text-amber-300',
  low: 'text-sky-400',
};

function Stat({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  const on = value > 0;
  return (
    <div className={`flex items-center gap-1.5 rounded-md px-1.5 py-1 ${on ? 'bg-white/5' : 'bg-white/[0.02] opacity-45'}`}>
      <span className="text-[13px] leading-none" aria-hidden style={{ filter: on ? 'none' : 'grayscale(1)' }}>{icon}</span>
      <div className="min-w-0">
        <div className="text-[13px] font-semibold leading-none tabular-nums" style={{ color: on ? color : '#64748b' }}>{value}</div>
        <div className="mt-0.5 text-[9px] leading-none text-dashboard-neutral/45">{label}</div>
      </div>
    </div>
  );
}

/** 类别构成迷你堆叠条 */
function CompositionBar({ parts }: { parts: { label: string; value: number; color: string }[] }) {
  const total = parts.reduce((s, p) => s + p.value, 0);
  if (total === 0) return null;
  return (
    <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-white/5" title={parts.filter((p) => p.value).map((p) => `${p.label} ${p.value}`).join(' · ')}>
      {parts.filter((p) => p.value > 0).map((p) => (
        <div key={p.label} style={{ width: `${(p.value / total) * 100}%`, background: p.color }} />
      ))}
    </div>
  );
}

export function RegionDetailCard({ className = '' }: RegionDetailCardProps) {
  const regionId = useRegionDetailStore((s) => s.regionId);
  const close = useRegionDetailStore((s) => s.close);
  const selectEvent = useMapStore((s) => s.selectEvent);
  const setViewport = useMapStore((s) => s.setViewport);

  const mod = regionId ? getRegion(regionId) : undefined;

  const topEvents = useMemo(() => {
    const evs = mod?.dataset?.events ?? [];
    return [...evs]
      .sort(
        (a, b) =>
          (IMPACT_RANK[b.impact_level] ?? 0) - (IMPACT_RANK[a.impact_level] ?? 0),
      )
      .slice(0, 4);
  }, [mod]);

  if (!regionId || !mod) return null;
  const ds = mod.dataset;

  const flyTo = (e: EventDetail) => {
    setViewport([e.location[0], e.location[1]], 5.5);
    selectEvent(e);
  };

  const stats = [
    { label: '监测点', value: ds?.events?.length ?? 0, icon: '📍', color: '#38bdf8' },
    { label: '冲突', value: ds?.incidents?.length ?? 0, icon: '⚔️', color: '#f43f5e' },
    { label: '设施', value: ds?.facilities?.length ?? 0, icon: '🏭', color: '#a78bfa' },
    { label: '军力', value: ds?.military?.length ?? 0, icon: '🛡️', color: '#fb923c' },
    { label: '外交', value: ds?.diplomacy?.length ?? 0, icon: '🤝', color: '#34d399' },
    { label: '态势', value: getSituationForRegion(regionId).length, icon: '🛰', color: '#22d3ee' },
    { label: '人物', value: ds?.persons?.length ?? 0, icon: '👤', color: '#e879f9' },
    { label: '能源', value: ds?.energy?.points?.length ?? 0, icon: '⚡', color: '#fbbf24' },
  ];
  const hiSeverity = (ds?.events ?? []).filter((ev) => ev.impact_level === 'high' || ev.impact_level === 'critical').length;

  return (
    <div
      className={`w-[min(18rem,calc(100vw-2rem))] rounded-lg border border-dashboard-neutral/20 bg-dashboard-bg/95 shadow-xl backdrop-blur-md ${className}`}
    >
      <div className="flex items-start gap-2 border-b border-dashboard-neutral/10 px-3 py-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-medium text-white">{mod.name}</span>
            {hiSeverity > 0 && (
              <span className="shrink-0 rounded-full bg-rose-500/15 px-1.5 py-0.5 text-[9px] font-semibold text-rose-300" title="高/极高影响事件数">
                ⚠ {hiSeverity} 高危
              </span>
            )}
          </div>
          <div className="mt-0.5 text-[11px] leading-snug text-dashboard-neutral/55">
            {mod.viewpoint}
          </div>
        </div>
        <PanelCloseButton onClick={close} label="关闭详情" />
      </div>

      <div className="space-y-2.5 p-3">
        <CompositionBar parts={stats} />
        <div className="grid grid-cols-4 gap-1">
          {stats.map((s) => (
            <Stat key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color} />
          ))}
        </div>

        {mod.defaultLayers && mod.defaultLayers.length > 0 && (
          <div>
            <div className="mb-1 text-[10px] uppercase tracking-wide text-dashboard-neutral/40">
              默认图层
            </div>
            <div className="flex flex-wrap gap-1">
              {mod.defaultLayers.map((id) => (
                <span
                  key={id}
                  className="rounded border border-dashboard-neutral/20 bg-white/5 px-1.5 py-0.5 text-[10px] text-dashboard-neutral/70"
                >
                  {LAYER_LABELS[id] ?? id}
                </span>
              ))}
            </div>
          </div>
        )}

        {topEvents.length > 0 && (
          <div>
            <div className="mb-1 text-[10px] uppercase tracking-wide text-dashboard-neutral/40">
              重点动态
            </div>
            <ul className="space-y-1">
              {topEvents.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => flyTo(e)}
                    className="flex w-full items-start gap-1.5 rounded px-1 py-0.5 text-left hover:bg-white/5"
                  >
                    <span
                      className={`mt-0.5 text-[10px] ${IMPACT_COLOR[e.impact_level]}`}
                      aria-hidden
                    >
                      ●
                    </span>
                    <span className="min-w-0 text-[11px] leading-snug text-dashboard-neutral hover:text-white">
                      {e.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-[9px] text-dashboard-neutral/30">
          数据来源：区域结构化 dataset · 结构化合成、非 AI 编造
        </div>
      </div>
    </div>
  );
}
