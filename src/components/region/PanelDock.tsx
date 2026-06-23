'use client';

/**
 * 面板停靠工具条 — LIFEOS-005 面板系统
 * 一排开关按钮，控制各信息面板显隐；仅中东区域显示。
 */

import { usePanelStore, getDockPanels } from '@/store/usePanelStore';
import { useRegionData } from '@/hooks/useRegionData';
import { useMapStore } from '@/store/useMapStore';

interface PanelDockProps {
  className?: string;
}

export function PanelDock({ className = '' }: PanelDockProps) {
  const region = useMapStore((s) => s.activeRegion);
  const data = useRegionData();
  const open = usePanelStore((s) => s.open);
  const toggle = usePanelStore((s) => s.toggle);
  const showAll = usePanelStore((s) => s.showAll);
  const hideAll = usePanelStore((s) => s.hideAll);
  const dockPanels = getDockPanels(region);

  // 数据驱动：当前区域有任一面板数据才显示停靠工具条
  const hasPanels =
    !!data.factions ||
    !!data.military ||
    !!data.energy ||
    !!data.persons ||
    !!data.diplomacy ||
    !!data.situation?.length ||
    !!data.trend;
  if (!hasPanels) return null;

  const anyOpen = dockPanels.some((p) => open[p.id]);

  return (
    <div
      className={`flex items-center gap-1.5 ${className}`}
      role="group"
      aria-label="面板停靠"
    >
      <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap rounded-lg border border-dashboard-neutral/15 bg-white/[0.02] px-1.5 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {dockPanels.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => toggle(p.id)}
            aria-pressed={open[p.id]}
            title={p.title}
            className={`seg-btn shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              open[p.id]
                ? 'bg-brand-cyan/20 text-brand-cyan'
                : 'text-dashboard-neutral/80 hover:bg-white/5 hover:text-white'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => (anyOpen ? hideAll() : showAll())}
        title={anyOpen ? '收起全部面板' : '展开全部面板'}
        aria-label={anyOpen ? '收起全部面板' : '展开全部面板'}
        className="shrink-0 rounded-md border border-dashboard-neutral/15 px-2 py-1.5 text-xs text-dashboard-neutral/80 transition-colors hover:bg-white/5 hover:text-white"
      >
        {anyOpen ? '收起' : '展开'}
      </button>
    </div>
  );
}
