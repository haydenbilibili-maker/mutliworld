'use client';

/**
 * 应用功能顶栏 — 方案 A：地图上方固定功能区
 * 三区：左（品牌 + 区域切换）· 中（面板 tab 停靠）· 右（实时仪表盘）。
 * 地图坐落其下，顶部不再被浮层堆叠遮挡。
 */

import { BrandMark } from '@/components/ui/BrandMark';
import { RegionSwitcher } from '@/components/ui/RegionSwitcher';
import { PanelDock } from '@/components/region/PanelDock';
import { SurfaceLayerStatusStack } from '@/components/ui/SurfaceLayerStatusStack';

interface AppHeaderProps {
  className?: string;
}

export function AppHeader({ className = '' }: AppHeaderProps) {
  return (
    <header
      className={[
        'relative z-40 flex w-full shrink-0 items-center gap-3 border-b border-brand-gold/15',
        'bg-dashboard-bg/95 px-3 py-2 shadow-lg backdrop-blur-md',
        'h-14 max-sm:h-auto max-sm:flex-wrap max-sm:gap-2',
        className,
      ].join(' ')}
    >
      {/* 左：品牌 + 区域 */}
      <div className="flex shrink-0 items-center gap-2">
        <BrandMark />
        <RegionSwitcher />
      </div>

      {/* 中：面板 tab（自适应居中，可换行/横滚） */}
      <div className="flex min-w-0 flex-1 justify-center max-sm:order-3 max-sm:w-full max-sm:basis-full">
        <PanelDock />
      </div>

      {/* 右：实时仪表盘 */}
      <div className="flex shrink-0 items-center">
        <SurfaceLayerStatusStack />
      </div>
    </header>
  );
}
