'use client';

/**
 * 区域 / 国家详情卡 — 对标 World Monitor Round 8
 * 由搜索选中区域或区域切换触发；展示该区域画像与数据覆盖摘要（结构化合成，不编造）。
 */

import { useMemo } from 'react';
import { useRegionDetailStore } from '@/store/useRegionDetailStore';
import { useMapStore } from '@/store/useMapStore';
import { getRegion } from '@/regions';
import { LAYER_LABELS } from '@/lib/constants';
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

function Stat({ label, value }: { label: string; value: number }) {
  if (!value) return null;
  return (
    <div className="rounded-md bg-white/5 px-2 py-1.5 text-center">
      <div className="text-sm font-semibold tabular-nums text-white">{value}</div>
      <div className="text-[10px] text-dashboard-neutral/50">{label}</div>
    </div>
  );
}

export function RegionDetailCard({ className = '' }: RegionDetailCardProps) {
  const regionId = useRegionDetailStore((s) => s.regionId);
  const close = useRegionDetailStore((s) => s.close);
  const selectEvent = useMapStore((s) => s.selectEvent);
  const setCenter = useMapStore((s) => s.setCenter);
  const setZoom = useMapStore((s) => s.setZoom);

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
    setCenter([e.location[0], e.location[1]]);
    setZoom(5.5);
    selectEvent(e);
  };

  return (
    <div
      className={`w-72 rounded-lg border border-dashboard-neutral/20 bg-dashboard-bg/95 shadow-xl backdrop-blur-md ${className}`}
    >
      <div className="flex items-start gap-2 border-b border-dashboard-neutral/10 px-3 py-2">
        <div className="min-w-0">
          <div className="text-sm font-medium text-white">{mod.name}</div>
          <div className="mt-0.5 text-[11px] leading-snug text-dashboard-neutral/55">
            {mod.viewpoint}
          </div>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="关闭详情"
          className="ml-auto text-base leading-none text-dashboard-neutral hover:text-white"
        >
          ×
        </button>
      </div>

      <div className="space-y-2.5 p-3">
        <div className="grid grid-cols-4 gap-1.5">
          <Stat label="监测点" value={ds?.events?.length ?? 0} />
          <Stat label="冲突" value={ds?.incidents?.length ?? 0} />
          <Stat label="设施" value={ds?.facilities?.length ?? 0} />
          <Stat label="军力" value={ds?.military?.length ?? 0} />
          <Stat label="外交" value={ds?.diplomacy?.length ?? 0} />
          <Stat label="社媒" value={ds?.social?.length ?? 0} />
          <Stat label="目标" value={ds?.targets?.length ?? 0} />
          <Stat label="能源" value={ds?.energy?.points?.length ?? 0} />
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
