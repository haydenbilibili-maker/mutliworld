'use client';

/**
 * 地表/宇宙层底图模式切换：卫星图 · 政区图 · 混合
 */

import { useMapStore } from '@/store/useMapStore';
import type { BasemapMode } from '@/types/tier';

const MODES: { id: BasemapMode; label: string; title: string }[] = [
  { id: 'satellite', label: '卫星图', title: 'ESRI 全球卫星影像' },
  { id: 'political', label: '政区图', title: 'OpenFreeMap Liberty 国界与标注' },
  { id: 'hybrid', label: '混合', title: '卫星底图 + 半透明国界叠加' },
];

interface BasemapModeSwitcherProps {
  className?: string;
}

export function BasemapModeSwitcher({ className = '' }: BasemapModeSwitcherProps) {
  const activeTier = useMapStore((s) => s.activeTier);
  const basemapMode = useMapStore((s) => s.basemapMode);
  const setBasemapMode = useMapStore((s) => s.setBasemapMode);

  if (activeTier !== 'surface' && activeTier !== 'space') {
    return null;
  }

  return (
    <div
      className={`flex flex-col gap-0.5 ${className}`}
      role="group"
      aria-label="底图样式"
    >
      <span className="px-2 text-[10px] text-dashboard-neutral/50">底图样式</span>
      <div className="flex gap-0.5 rounded-md bg-dashboard-neutral/10 p-0.5">
        {MODES.map((m) => {
          const active = basemapMode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setBasemapMode(m.id)}
              aria-pressed={active}
              title={m.title}
              className={[
                'seg-btn flex-1 rounded px-1.5 py-1 text-[10px] transition-colors',
                active
                  ? 'bg-dashboard-military/30 text-white'
                  : 'text-dashboard-neutral/70 hover:bg-dashboard-neutral/15 hover:text-white',
              ].join(' ')}
            >
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
