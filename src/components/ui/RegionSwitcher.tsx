'use client';

/**
 * 区域切换器 — LIFEOS-005 平台化
 *
 * 由区域注册表驱动；未启用（迁移中）的区域置灰不可点。
 */

import { useMapStore } from '@/store/useMapStore';
import { listRegions } from '@/regions';
import type { RegionId } from '@/types/region';

interface RegionSwitcherProps {
  className?: string;
}

export function RegionSwitcher({ className = '' }: RegionSwitcherProps) {
  const activeRegion = useMapStore((s) => s.activeRegion);
  const setRegion = useMapStore((s) => s.setRegion);
  const regions = listRegions();

  return (
    <div
      className={`rounded-lg bg-dashboard-bg/90 border border-dashboard-neutral/20 p-1.5 flex flex-wrap gap-1 max-w-[44vw] ${className}`}
      role="group"
      aria-label="区域切换"
    >
      {regions.map((r) => {
        const active = r.id === (activeRegion as RegionId);
        return (
          <button
            key={r.id}
            type="button"
            disabled={!r.enabled}
            onClick={() => setRegion(r.id)}
            title={r.enabled ? r.viewpoint : r.note ?? '迁移中'}
            aria-pressed={active}
            className={[
              'px-3 py-1.5 rounded-md text-sm transition-colors',
              active
                ? 'bg-dashboard-neutral/30 text-white'
                : 'text-dashboard-neutral hover:text-white',
              !r.enabled ? 'opacity-40 cursor-not-allowed' : '',
            ].join(' ')}
          >
            {r.name}
            {!r.enabled && <span className="ml-1 text-xs">·待迁</span>}
          </button>
        );
      })}
    </div>
  );
}
