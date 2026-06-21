'use client';

/**
 * 应用功能顶栏 — 方案 A：地图上方固定功能区
 * 三区：左（品牌 + 区域）· 中（面板 tab 停靠，单行横滚不溢出）· 右（人物库 + 实时仪表盘，常驻可开关）。
 * 适当加高，为后续精美设计预留空间。地图坐落其下，顶部不再被浮层堆叠遮挡。
 */

import Link from 'next/link';
import { BrandMark } from '@/components/ui/BrandMark';
import { BodySwitcher } from '@/components/ui/BodySwitcher';
import { RegionSwitcher } from '@/components/ui/RegionSwitcher';
import { PanelDock } from '@/components/region/PanelDock';
import { RealtimeDashboard } from '@/components/ui/RealtimeDashboard';
import { BodyLayerToggle } from '@/components/ui/BodyLayerToggle';
import { useMapStore } from '@/store/useMapStore';

interface AppHeaderProps {
  className?: string;
}

export function AppHeader({ className = '' }: AppHeaderProps) {
  const isEarth = useMapStore((s) => s.activeBody === 'earth');
  return (
    <header
      className={[
        'relative z-40 flex w-full shrink-0 items-center gap-3 border-b border-brand-gold/15',
        'bg-dashboard-bg/95 px-4 shadow-lg backdrop-blur-md',
        'h-[4.5rem] max-sm:h-auto max-sm:flex-wrap max-sm:gap-2 max-sm:py-2.5',
        className,
      ].join(' ')}
    >
      {/* 左：品牌 + 天体 + 区域（区域仅地球） */}
      <div className="flex shrink-0 items-center gap-2.5">
        <BrandMark />
        <BodySwitcher />
        {isEarth && <RegionSwitcher />}
      </div>

      {/* 中：面板 tab（单行横滚，不换行不溢出；仅地球） */}
      <div className="flex min-w-0 flex-1 justify-center overflow-hidden max-sm:order-3 max-sm:w-full max-sm:basis-full max-sm:justify-start">
        {isEarth ? <PanelDock className="min-w-0 max-w-full" /> : <BodyLayerToggle />}
      </div>

      {/* 右：人物库入口 + 实时仪表盘（仅地球） */}
      <div className="flex shrink-0 items-center gap-2">
        {isEarth && (
          <Link
            href="/persons"
            title="全球政经人物资料库"
            className="flex items-center gap-1.5 rounded-lg border border-dashboard-neutral/20 bg-dashboard-bg/85 px-3 py-2 text-sm text-dashboard-neutral transition-colors hover:border-dashboard-neutral/40 hover:text-white"
          >
            <span aria-hidden>👥</span>
            <span className="hidden sm:inline">人物库</span>
          </Link>
        )}
        {isEarth && <RealtimeDashboard />}
      </div>
    </header>
  );
}
