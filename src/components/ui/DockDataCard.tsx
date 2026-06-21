'use client';

/**
 * 底部 Dock 数据条通用外壳 — 由 BottomDock 级联叠放于底部控制栏正上方。
 * 统一近地数据条与地表态势条的视觉语言：窄宽(40rem)、重度毛玻璃、顶部青色内辉光。
 * 定位与入场动效由 BottomDock 统一管理；本组件仅提供卡片骨架与内容/尾注槽。
 */

import type { ReactNode } from 'react';

interface DockDataCardProps {
  children: ReactNode;
  /** 可选尾注槽（如「数据来源·时效」行），渲染于卡片底部发丝分隔线下方。 */
  footer?: ReactNode;
  className?: string;
}

export function DockDataCard({ children, footer, className = '' }: DockDataCardProps) {
  return (
    <div className={['w-[min(40rem,calc(100vw-1.5rem))]', className].join(' ')}>
      <div className="pointer-events-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-lg border border-dashboard-neutral/20 bg-dashboard-bg/92 px-3 py-2 shadow-xl backdrop-blur-md shadow-[0_-1px_0_0_rgba(63,200,224,0.18)] transition-colors">
        {children}
        {footer}
      </div>
    </div>
  );
}
