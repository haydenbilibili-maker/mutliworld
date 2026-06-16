'use client';

/**
 * 空间层切换器 — 三位一体空间态势（宇宙 / 地表 / 洋底）
 * 垂直三段"电梯"，在三层之间原地穿越；底部含「敏感图层一键下架」开关（商用）。
 */

import { useMapStore } from '@/store/useMapStore';
import { listTiers } from '@/tiers';

interface TierSwitcherProps {
  className?: string;
}

export function TierSwitcher({ className = '' }: TierSwitcherProps) {
  const activeTier = useMapStore((s) => s.activeTier);
  const setTier = useMapStore((s) => s.setTier);
  const hideSensitive = useMapStore((s) => s.hideSensitive);
  const setHideSensitive = useMapStore((s) => s.setHideSensitive);
  const globe = useMapStore((s) => s.globe);
  const setGlobe = useMapStore((s) => s.setGlobe);
  const tiers = listTiers(); // 宇宙 → 地表 → 洋底（上到下）
  // 宇宙层自动球面；其余层显示当前手动开关状态
  const globeActive = globe || activeTier === 'space';

  return (
    <div
      className={`flex flex-col gap-1 rounded-lg border border-dashboard-neutral/20 bg-dashboard-bg/90 p-1 shadow-lg backdrop-blur-sm ${className}`}
      role="group"
      aria-label="空间层切换"
    >
      {tiers.map((t) => {
        const active = t.id === activeTier;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => setTier(t.id)}
            aria-pressed={active}
            title={`${t.name} · ${t.tagline}`}
            className={[
              'flex items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs transition-colors',
              active
                ? 'bg-dashboard-military/25 text-white'
                : 'text-dashboard-neutral hover:bg-dashboard-neutral/15 hover:text-white',
            ].join(' ')}
          >
            <span className="text-base leading-none" aria-hidden>
              {t.icon}
            </span>
            <span className="min-w-0">
              <span className="block leading-tight">{t.name}</span>
              {active && (
                <span className="block truncate text-[10px] text-dashboard-neutral/60">
                  {t.tagline}
                </span>
              )}
            </span>
          </button>
        );
      })}

      <div className="mt-0.5 border-t border-dashboard-neutral/15 pt-1">
        <button
          type="button"
          onClick={() => setGlobe(!globe)}
          aria-pressed={globeActive}
          title="3D 地球（球面投影）· 需 maplibre v5 启用；宇宙层自动球面"
          className={[
            'mb-1 flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-[10px] transition-colors',
            globeActive
              ? 'bg-sky-500/20 text-sky-200'
              : 'text-dashboard-neutral/60 hover:bg-dashboard-neutral/15 hover:text-white',
          ].join(' ')}
        >
          <span aria-hidden>🌐</span>
          <span className="truncate">
            {globeActive ? '3D 地球：开' : '3D 地球：平面'}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setHideSensitive(!hideSensitive)}
          aria-pressed={hideSensitive}
          title="商用模式：一键下架军事/核/海外基地等敏感图层"
          className={[
            'flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-[10px] transition-colors',
            hideSensitive
              ? 'bg-rose-500/20 text-rose-200'
              : 'text-dashboard-neutral/60 hover:bg-dashboard-neutral/15 hover:text-white',
          ].join(' ')}
        >
          <span aria-hidden>{hideSensitive ? '🔒' : '🛡️'}</span>
          <span className="truncate">
            {hideSensitive ? '敏感图层已下架' : '敏感图层正常'}
          </span>
        </button>
      </div>
    </div>
  );
}
