'use client';

/**
 * 空间层分段选择器 — 宇宙 / 地表 / 洋底（横向，嵌入底部控制条）
 * 由原左侧竖向 TierSwitcher 拆出，仅保留层级切换，提升首页坪效。
 */

import { useMapStore } from '@/store/useMapStore';
import { listTiers } from '@/tiers';

interface TierSelectorProps {
  className?: string;
}

export function TierSelector({ className = '' }: TierSelectorProps) {
  const activeTier = useMapStore((s) => s.activeTier);
  const setTier = useMapStore((s) => s.setTier);
  const tiers = listTiers();

  return (
    <div className={`flex items-center gap-0.5 ${className}`} role="group" aria-label="空间层切换">
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
              'flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors sm:py-1.5',
              active
                ? 'bg-dashboard-military/30 text-white'
                : 'text-dashboard-neutral hover:bg-dashboard-neutral/20 hover:text-white',
            ].join(' ')}
          >
            <span className="text-sm leading-none" aria-hidden>{t.icon}</span>
            <span className="max-sm:hidden">{t.name}</span>
          </button>
        );
      })}
    </div>
  );
}
