'use client';

/**
 * 实时仪表盘 — 顶栏右区常驻控件
 * 天气/火点/航班/海运/卫星/空间站等实时源以芯片常驻展示；默认关闭，点击开启对应实时图层。
 * 点击空间层源（卫星/空间站）会自动切换到宇宙层。开启态以源色高亮 + 脉冲点指示。
 */

import { useMapStore } from '@/store/useMapStore';
import type { LayerId } from '@/types/geo';
import type { SpatialTier } from '@/types/tier';

interface RealtimeSource {
  id: LayerId;
  tier: SpatialTier;
  icon: string;
  label: string;
  color: string;
}

const SOURCES: RealtimeSource[] = [
  { id: 'live_weather', tier: 'surface', icon: '🌧️', label: '天气', color: '#06b6d4' },
  { id: 'live_fires', tier: 'surface', icon: '🔥', label: '火点', color: '#f97316' },
  { id: 'live_flights', tier: 'surface', icon: '✈️', label: '航班', color: '#0ea5e9' },
  { id: 'live_maritime', tier: 'surface', icon: '🚢', label: '海运', color: '#22d3ee' },
  { id: 'satellites', tier: 'space', icon: '🛰️', label: '卫星', color: '#a78bfa' },
  { id: 'space_stations', tier: 'space', icon: '🛸', label: '空间站', color: '#f4d08a' },
];

interface RealtimeDashboardProps {
  className?: string;
}

export function RealtimeDashboard({ className = '' }: RealtimeDashboardProps) {
  const activeTier = useMapStore((s) => s.activeTier);
  const activeLayers = useMapStore((s) => s.activeLayers);

  /** 点击：同层直接开关；跨层先切层级再确保该图层开启（用 getState 读切层后的新状态） */
  const handleToggle = (src: RealtimeSource) => {
    const st = useMapStore.getState();
    if (src.tier !== st.activeTier) {
      st.setTier(src.tier);
      const after = useMapStore.getState();
      if (!after.activeLayers.includes(src.id)) after.toggleLayer(src.id);
    } else {
      st.toggleLayer(src.id);
    }
  };

  return (
    <div className={`flex flex-row flex-wrap items-center gap-1.5 ${className}`} role="group" aria-label="实时数据源">
      {SOURCES.map((src) => {
        const active = activeTier === src.tier && activeLayers.includes(src.id);
        return (
          <button
            key={src.id}
            type="button"
            onClick={() => handleToggle(src)}
            aria-pressed={active}
            title={`${src.label} · ${active ? '实时开启中，点击关闭' : '点击开启实时图层'}${src.tier === 'space' ? '（宇宙层）' : ''}`}
            className="group flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-colors"
            style={
              active
                ? { borderColor: `${src.color}99`, backgroundColor: `${src.color}22`, color: '#fff' }
                : { borderColor: 'rgba(191,191,191,0.18)', backgroundColor: 'rgba(255,255,255,0.02)', color: '#9AA3B2' }
            }
          >
            <span aria-hidden className={active ? '' : 'opacity-60 grayscale'}>
              {src.icon}
            </span>
            <span className="font-medium max-sm:hidden">{src.label}</span>
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={
                active
                  ? { backgroundColor: src.color, boxShadow: `0 0 6px ${src.color}` }
                  : { backgroundColor: 'rgba(191,191,191,0.3)' }
              }
            />
          </button>
        );
      })}
    </div>
  );
}
