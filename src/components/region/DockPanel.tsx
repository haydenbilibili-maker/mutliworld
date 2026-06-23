'use client';

/**
 * 面板外壳 — LIFEOS-005 面板系统
 * 统一提供：开关门控（关闭则不渲染）、标题栏、计数、可选 header 右侧内容、关闭按钮、滚动。
 * 开关门控带 fade + 微缩放过渡（AnimatePresence），与 SidePanel/LayerToggle 动效语言一致。
 */

import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PanelCloseButton } from '@/components/ui/PanelCloseButton';
import { CountUpText } from '@/components/ui/CountUpText';
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 6 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
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
              {count != null && count > 0 && (
                <span className="text-dashboard-neutral/70 ml-1 text-xs tabular-nums">
                  <CountUpText value={String(count)} />
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
