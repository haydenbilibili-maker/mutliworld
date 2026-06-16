'use client';

import { TimelineSlider } from '@/components/ui/TimelineSlider';
import { LayerToggle } from '@/components/ui/LayerToggle';
import { SearchBox } from '@/components/ui/SearchBox';
import { StrategicResearchMenu } from '@/components/ui/StrategicResearchMenu';
import { MoreMenu } from '@/components/ui/MoreMenu';

interface MapControlBarProps {
  className?: string;
}

/** 底部统一控制条：时间范围 + 图层筛选 + 全局搜索 */
export function MapControlBar({ className = '' }: MapControlBarProps) {
  return (
    <div
      className={[
        'flex flex-wrap items-center justify-center gap-x-1 gap-y-1 rounded-lg border border-dashboard-neutral/20',
        'bg-dashboard-bg/90 px-2 py-1.5 shadow-lg backdrop-blur-sm',
        'max-w-[min(calc(100vw-2rem),48rem)]',
        className,
      ].join(' ')}
      role="toolbar"
      aria-label="地图控制"
    >
      <TimelineSlider embedded />
      <div
        className="mx-1 hidden h-6 w-px shrink-0 bg-dashboard-neutral/20 sm:block"
        aria-hidden
      />
      <LayerToggle embedded />
      <div
        className="mx-1 hidden h-6 w-px shrink-0 bg-dashboard-neutral/20 sm:block"
        aria-hidden
      />
      <SearchBox embedded />
      <div
        className="mx-1 hidden h-6 w-px shrink-0 bg-dashboard-neutral/20 sm:block"
        aria-hidden
      />
      <StrategicResearchMenu embedded />
      <div
        className="mx-1 hidden h-6 w-px shrink-0 bg-dashboard-neutral/20 sm:block"
        aria-hidden
      />
      <MoreMenu embedded />
    </div>
  );
}
