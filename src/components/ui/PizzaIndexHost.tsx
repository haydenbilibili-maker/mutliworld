'use client';

/**
 * 披萨指数入口 — 状态 FAB + 可展开面板（地表层）
 */

import { useMapStore } from '@/store/useMapStore';
import { usePizzaIndexPanelStore } from '@/store/usePizzaIndexPanelStore';
import { usePentagonPizzaIndex } from '@/hooks/usePentagonPizzaIndex';
import { PentagonPizzaIndexPanel } from '@/components/ui/PentagonPizzaIndexPanel';
import { levelLabelZh } from '@/lib/pizza-index/simulate';
import type { PizzaIndexLevel } from '@/types/pizza-index';

const LEVEL_DOT: Record<PizzaIndexLevel, string> = {
  LOW: 'bg-emerald-400',
  ELEVATED: 'bg-amber-400',
  HIGH: 'bg-orange-400',
  CRITICAL: 'bg-red-500',
};

interface PizzaIndexHostProps {
  className?: string;
}

export function PizzaIndexHost({ className = '' }: PizzaIndexHostProps) {
  const activeTier = useMapStore((s) => s.activeTier);
  const activeLayers = useMapStore((s) => s.activeLayers);
  const open = usePizzaIndexPanelStore((s) => s.open);
  const toggle = usePizzaIndexPanelStore((s) => s.toggle);

  const layerOn = activeLayers.includes('pizza_index');
  const enabled = activeTier === 'surface' && (open || layerOn);
  const { data, isValidating, error } = usePentagonPizzaIndex(enabled);

  if (activeTier !== 'surface') return null;
  if (!open && !layerOn) return null;

  const level = data?.level ?? 'LOW';
  const score = data?.score ?? '—';

  return (
    <div
      className={[
        'pointer-events-none absolute right-4 top-[10.5rem] z-30 flex flex-col items-end gap-2',
        className,
      ].join(' ')}
    >
      <div className="pointer-events-auto flex max-h-full flex-col items-end gap-2">
        {open && <PentagonPizzaIndexPanel />}

        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-label={open ? '收起五角大楼披萨指数面板' : '展开五角大楼披萨指数面板'}
          className={[
            'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs shadow-lg backdrop-blur-md transition-colors',
            open
              ? 'border-orange-500/40 bg-dashboard-bg/95 text-white'
              : 'border-dashboard-neutral/25 bg-dashboard-bg/90 text-dashboard-neutral hover:border-orange-500/35 hover:text-white',
          ].join(' ')}
        >
          <span aria-hidden>🍕</span>
          <span className="font-medium">披萨指数</span>
          <span className="tabular-nums text-white">{score}</span>
          <span className="hidden text-[10px] text-dashboard-neutral/70 sm:inline">
            {levelLabelZh(level)}
          </span>
          <span className={`h-2 w-2 shrink-0 rounded-full ${LEVEL_DOT[level]}`} />
          <span
            className={[
              'h-2 w-2 shrink-0 rounded-full',
              error ? 'bg-dashboard-conflict' : isValidating ? 'bg-amber-400' : 'bg-emerald-400',
            ].join(' ')}
            title={error ? '数据异常' : '刷新状态'}
          />
        </button>
      </div>
    </div>
  );
}
