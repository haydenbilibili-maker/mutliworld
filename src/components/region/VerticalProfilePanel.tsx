'use client';

/**
 * 天—地—海 垂直剖面 — 三位一体招牌交互
 *
 * 在剖面点垂直钻取：复用统一 geodata，按 tierForLayer 将已加载要素分到
 * 🛰 宇宙 / 🌍 地表 / 🌊 洋底 三层，按距剖面点距离排序；含头顶同步轨道与实时空间站。
 * 分层计算与地图「跨层关联高亮」共用 computeProfileBuckets，保证一致。
 */

import { useMemo } from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import { useMapStore } from '@/store/useMapStore';
import { useGeodataContext } from '@/context/GeodataContext';
import { useLiveSatellites } from '@/hooks/useLiveSatellites';
import {
  computeProfileBuckets,
  PROFILE_RADIUS_DEG,
  type ProfileItem,
} from '@/lib/profile/computeProfile';
import { VerticalCrossSection } from '@/components/region/VerticalCrossSection';
import { PanelCloseButton } from '@/components/ui/PanelCloseButton';
import type { EventDetail } from '@/types/geo';
import type { SpatialTier } from '@/types/tier';

interface VerticalProfilePanelProps {
  className?: string;
}

export function VerticalProfilePanel({ className = '' }: VerticalProfilePanelProps) {
  const active = useProfileStore((s) => s.active);
  const point = useProfileStore((s) => s.point);
  const close = useProfileStore((s) => s.close);
  const center = useMapStore((s) => s.center);
  const selectEvent = useMapStore((s) => s.selectEvent);
  const setCenter = useMapStore((s) => s.setCenter);
  const { data } = useGeodataContext();
  const { items: liveSats } = useLiveSatellites(active);

  const p = point ?? center;

  const buckets = useMemo(
    () => computeProfileBuckets(data?.features, liveSats, p),
    [data, liveSats, p],
  );

  if (!active) return null;

  const fly = (it: ProfileItem) => {
    setCenter([it.lng, it.lat]);
    const ev: EventDetail = {
      id: it.id,
      title: it.title,
      source: '',
      timestamp: '',
      location: [it.lng, it.lat],
      impact_level: 'medium',
      category: 'profile',
      description: it.detail,
    };
    selectEvent(ev);
  };

  const Band = ({
    tier,
    icon,
    title,
    accent,
  }: {
    tier: SpatialTier;
    icon: string;
    title: string;
    accent: string;
  }) => {
    const list = buckets[tier];
    return (
      <div className="relative pl-5">
        <span
          className="absolute left-1.5 top-1 h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: accent, boxShadow: `0 0 6px ${accent}` }}
        />
        <div className="flex items-center gap-1.5">
          <span aria-hidden>{icon}</span>
          <span className="text-[11px] font-medium text-white">{title}</span>
          <span className="text-[10px] text-dashboard-neutral/45">{list.length}</span>
        </div>
        {list.length === 0 ? (
          <div className="py-0.5 text-[10px] text-dashboard-neutral/35">无邻近要素（当前图层）</div>
        ) : (
          <ul className="space-y-0.5 py-0.5">
            {list.map((it, i) => (
              <li key={it.id}>
                <button
                  type="button"
                  onClick={() => fly(it)}
                  className="flex w-full items-center gap-1.5 rounded px-1 py-0.5 text-left hover:bg-white/5"
                >
                  <span className="text-[11px]" aria-hidden>{it.emoji}</span>
                  <span className="min-w-0 flex-1 truncate text-[10.5px] text-dashboard-neutral hover:text-white">
                    {i === 0 && <span className="text-amber-300/80">★ </span>}
                    {it.title}
                  </span>
                  <span className="shrink-0 text-[9px] tabular-nums text-dashboard-neutral/40">
                    {it.distKm}km
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className={`w-[min(18rem,calc(100vw-2rem))] rounded-lg border border-amber-400/30 bg-dashboard-bg/95 shadow-xl backdrop-blur-md ${className}`}>
      <div className="flex items-center gap-2 border-b border-dashboard-neutral/10 px-3 py-2">
        <span className="text-base leading-none" aria-hidden>📊</span>
        <div className="min-w-0 flex-1 text-sm font-medium text-white">天—地—海 垂直剖面</div>
        <PanelCloseButton onClick={close} label="关闭剖面" />
      </div>

      <div className="px-3 py-2">
        <div className="text-[10px] text-dashboard-neutral/50">
          剖面点 {p[1].toFixed(2)}°, {p[0].toFixed(2)}° · 半径约 {Math.round(PROFILE_RADIUS_DEG * 111)}km
          {point ? ' · 每层 ★ 为最近项（地图已连线）' : ' · 点击地图取点'}
        </div>
      </div>

      {/* 垂直高度侧视图：球面看不出的「上天入海」高度差，这里一眼读出 */}
      <div className="px-3 pb-1">
        <VerticalCrossSection buckets={buckets} onPick={fly} />
        <div className="mt-0.5 text-center text-[9px] text-dashboard-neutral/30">
          ↑高度 / ↓深度为示意（对数压缩）· 点击点位飞行
        </div>
      </div>

      {/* 垂直三层：上宇宙 → 中地表 → 下洋底，左侧竖线贯通 */}
      <div className="relative space-y-2.5 px-3 pb-3">
        <span className="absolute left-[14px] top-1 bottom-3 w-px bg-gradient-to-b from-sky-400/40 via-amber-300/40 to-teal-400/40" />
        <Band tier="space" icon="🛰" title="宇宙（头顶）" accent="#38bdf8" />
        <Band tier="surface" icon="🌍" title="地表" accent="#facc15" />
        <Band tier="subsurface" icon="🌊" title="洋底（地下）" accent="#2dd4bf" />
      </div>

      <div className="px-3 pb-2 text-[9px] text-dashboard-neutral/30">
        基于当前已加载图层按高度/深度归层 · 结构化合成
      </div>
    </div>
  );
}
