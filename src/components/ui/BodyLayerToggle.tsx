'use client';

/**
 * 天体探索图层开关 — 多天体探索 Phase 1
 * 顶栏中区：按当前天体展示探索图层分类芯片（阿波罗/嫦娥/早期…），点击开关，含颜色图例。
 */

import { useMapStore } from '@/store/useMapStore';
import { useBodyStore } from '@/store/useBodyStore';
import { bodyLayersFor, populatedLayersFor, getSitesForBody } from '@/bodies/sites';

interface BodyLayerToggleProps {
  className?: string;
}

export function BodyLayerToggle({ className = '' }: BodyLayerToggleProps) {
  const activeBody = useMapStore((s) => s.activeBody);
  const activeBodyLayers = useBodyStore((s) => s.activeBodyLayers);
  const toggleBodyLayer = useBodyStore((s) => s.toggleBodyLayer);

  if (activeBody === 'earth') return null;

  const populated = new Set(populatedLayersFor(activeBody));
  const layers = bodyLayersFor(activeBody).filter((m) => populated.has(m.id));
  if (layers.length === 0) return null;

  const sites = getSitesForBody(activeBody);
  const shownCount = sites.filter((s) => activeBodyLayers.includes(s.layer)).length;

  return (
    <div className={`flex flex-wrap items-center justify-center gap-1.5 ${className}`} role="group" aria-label="探索图层">
      <span className="text-[10px] text-dashboard-neutral/50">探索痕迹 {shownCount}</span>
      {layers.map((m) => {
        const on = activeBodyLayers.includes(m.id);
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => toggleBodyLayer(m.id)}
            aria-pressed={on}
            className="seg-btn flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors"
            style={
              on
                ? { borderColor: `${m.color}99`, backgroundColor: `${m.color}22`, color: '#fff' }
                : { borderColor: 'rgba(191,191,191,0.18)', color: '#9AA3B2' }
            }
          >
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: on ? m.color : 'rgba(191,191,191,0.3)' }} />
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
