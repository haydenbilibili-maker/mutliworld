'use client';

/**
 * 应用功能顶栏 — 方案 A：地图上方固定功能区
 * 三区：左（品牌 + 区域）· 中（面板 tab 停靠，单行横滚不溢出）· 右（实时仪表盘，常驻可开关）。
 * 适当加高，为后续精美设计预留空间。地图坐落其下，顶部不再被浮层堆叠遮挡。
 */

import { BrandMark } from '@/components/ui/BrandMark';
import { RegionSwitcher } from '@/components/ui/RegionSwitcher';
import { PanelDock } from '@/components/region/PanelDock';
import { RealtimeDashboard } from '@/components/ui/RealtimeDashboard';

interface AppHeaderProps {
  className?: string;
}

export function AppHeader({ className = '' }: AppHeaderProps) {
  return (
    <header
      className={[
        'relative z-40 flex w-full shrink-0 items-center gap-3 border-b border-brand-gold/15',
        'bg-dashboard-bg/95 px-4 shadow-lg backdrop-blur-md',
        'h-[4.5rem] max-sm:h-auto max-sm:flex-wrap max-sm:gap-2 max-sm:py-2.5',
        className,
      ].join(' ')}
    >
      {/* 左：品牌 + 区域 */}
      <div className="flex shrink-0 items-center gap-2.5">
        <BrandMark />
        <RegionSwitcher />
      </div>

      {/* 中：面板 tab（单行横滚，不换行不溢出） */}
      <div className="flex min-w-0 flex-1 justify-center overflow-hidden max-sm:order-3 max-sm:w-full max-sm:basis-full max-sm:justify-start">
        <PanelDock className="min-w-0 max-w-full" />
      </div>

      {/* 右：实时仪表盘（常驻 · 默认关 · 点击开） */}
      <div className="flex shrink-0 items-center">
        <RealtimeDashboard />
      </div>
    </header>
  );
}
