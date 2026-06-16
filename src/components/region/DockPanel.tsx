'use client';

/**
 * 面板外壳 — LIFEOS-005 面板系统
 * 统一提供：开关门控（关闭则不渲染）、标题栏、计数、可选 header 右侧内容、关闭按钮、滚动。
 */

import type { ReactNode } from 'react';
import { PanelCloseButton } from '@/components/ui/PanelCloseButton';
import { usePanelStore } from '@/store/usePanelStore';
import type { PanelId } from '@/store/usePanelStore';

interface DockPanelProps {
  id: PanelId;
  title: string;
  /** 标题左侧图标（如 🌊 / 🛰） */
  icon?: ReactNode;
  count?: number;
  /** header 右侧自定义内容（筛选/标签页等） */
  headerRight?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function DockPanel({
  id,
  title,
  icon,
  count,
  headerRight,
  className = '',
  children,
}: DockPanelProps) {
  const open = usePanelStore((s) => s.open[id]);
  const setOpen = usePanelStore((s) => s.setOpen);

  if (!open) return null;

  return (
    <div
      className={`rounded-lg bg-dashboard-bg/90 border border-dashboard-neutral/20 overflow-auto ${className}`}
    >
      <div className="flex items-center gap-2 px-3 py-2 border-b border-dashboard-neutral/10 sticky top-0 bg-dashboard-bg/95 backdrop-blur z-10">
        {icon && (
          <span className="text-base leading-none shrink-0" aria-hidden>
            {icon}
          </span>
        )}
        <div className="min-w-0 flex-1 text-sm font-medium text-white">
          {title}
          {count != null && (
            <span className="text-dashboard-neutral/70 ml-1 text-xs">
              {count}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {headerRight}
          <PanelCloseButton
            onClick={() => setOpen(id, false)}
            label="关闭面板"
          />
        </div>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}
