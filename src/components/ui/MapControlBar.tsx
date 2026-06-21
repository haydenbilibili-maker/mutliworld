'use client';

import { TierSelector } from '@/components/ui/TierSelector';
import { TimelineSlider } from '@/components/ui/TimelineSlider';
import { LayerToggle } from '@/components/ui/LayerToggle';
import { SearchBox } from '@/components/ui/SearchBox';
import { ViewMenu } from '@/components/ui/ViewMenu';
import { StrategicResearchMenu } from '@/components/ui/StrategicResearchMenu';
import { MoreMenu } from '@/components/ui/MoreMenu';

function Divider() {
  return <div className="mx-1 hidden h-6 w-px shrink-0 bg-dashboard-neutral/20 sm:block" aria-hidden />;
}

interface MapControlBarProps {
  className?: string;
  /** 嵌入 BottomDock 时省略自身 max-w（层级宽度交由 dock 管理），并贴合数据条的玻璃语言。 */
  embedded?: boolean;
}

/** 底部统一控制条：时间范围 + 图层筛选 + 全局搜索 */
export function MapControlBar({ className = '', embedded = false }: MapControlBarProps) {
  return (
    <div
      className={[
        'flex flex-wrap items-center justify-center gap-x-1 gap-y-1.5 rounded-lg border border-dashboard-neutral/20',
        'bg-dashboard-bg/92 px-2 py-1.5 shadow-lg backdrop-blur-md',
        embedded ? '' : 'max-w-[min(calc(100vw-2rem),48rem)]',
        className,
      ].join(' ')}
      role="toolbar"
      aria-label="地图控制"
    >
      {/* 第一次序：地表（空间层） · 图层 · 视图 */}
      <TierSelector />
      <Divider />
      <LayerToggle embedded />
      <Divider />
      <ViewMenu embedded />

      <Divider />

      {/* 第二次序：时间 · 研究 · 搜索 */}
      <TimelineSlider embedded />
      <Divider />
      <StrategicResearchMenu embedded />
      <Divider />
      <SearchBox embedded />

      <Divider />

      {/* 更多：单列 */}
      <MoreMenu embedded />
    </div>
  );
}
