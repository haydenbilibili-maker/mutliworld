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
      className={`rounded-lg bg-dashboard-bg/90 border border-dashboard-neutral/20 p-1.5 flex flex-wrap items-center justify-center gap-1 max-w-[min(calc(100vw-1rem),36rem)] ${className}`}
      role="group"
      aria-label="面板停靠"
    >
      <span className="hidden text-[11px] text-dashboard-neutral px-1 sm:inline">面板</span>
      {dockPanels.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => toggle(p.id)}
          aria-pressed={open[p.id]}
          title={p.title}
          className={`px-2 py-1 rounded-md text-xs transition-colors ${
            open[p.id]
              ? 'bg-dashboard-neutral/30 text-white'
              : 'text-dashboard-neutral hover:text-white'
          }`}
        >
          {p.label}
        </button>
      ))}
      <span className="w-px h-4 bg-dashboard-neutral/20 mx-0.5" />
      <button
        type="button"
        onClick={() => (anyOpen ? hideAll() : showAll())}
        className="px-2 py-1 rounded-md text-xs text-dashboard-neutral hover:text-white"
      >
        {anyOpen ? '全收起' : '全展开'}
      </button>
    </div>
  );
}
