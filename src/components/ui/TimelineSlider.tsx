'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMapStore } from '@/store/useMapStore';
import type { TimeRange } from '@/types/geo';

interface TimelineSliderProps {
  className?: string;
  /** 嵌入 MapControlBar 时省略外层容器样式 */
  embedded?: boolean;
}

const OPTIONS: { value: TimeRange; label: string }[] = [
  { value: '24h', label: '24 小时' },
  { value: '7d', label: '7 天' },
  { value: '30d', label: '30 天' },
];

/** 时间范围筛选 — 下拉选择（替代平铺按钮，提升坪效） */
export function TimelineSlider({ className = '', embedded = false }: TimelineSliderProps) {
  const { timeRange, setTimeRange } = useMapStore();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const current = OPTIONS.find((o) => o.value === timeRange) ?? OPTIONS[1];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={['relative', embedded ? '' : 'rounded-lg border border-dashboard-neutral/20 bg-dashboard-bg/90', className].join(' ')}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`时间范围：${current.label}`}
        title="选择数据时间范围"
        className={[
          'flex items-center gap-1.5 rounded px-2 py-1 text-xs transition-colors sm:px-3 sm:py-1.5 sm:text-sm',
          open
            ? 'bg-dashboard-military/25 text-white'
            : 'text-dashboard-neutral hover:bg-dashboard-neutral/20 hover:text-white',
        ].join(' ')}
      >
        <span aria-hidden>🕑</span>
        <span className="text-dashboard-neutral/70 max-sm:hidden">时间</span>
        <span className="font-medium text-white">{current.label}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={['shrink-0 transition-transform duration-150', open ? 'rotate-180' : ''].join(' ')}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            aria-label="时间范围"
            className="absolute bottom-full left-0 z-50 mb-1.5 w-32 overflow-hidden rounded-lg border border-dashboard-neutral/25 bg-dashboard-bg/95 p-1 shadow-xl backdrop-blur-md"
          >
            {OPTIONS.map(({ value, label }) => (
              <li key={value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={timeRange === value}
                  onClick={() => {
                    setTimeRange(value);
                    setOpen(false);
                  }}
                  className={[
                    'flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-[12px] transition-colors',
                    timeRange === value
                      ? 'bg-dashboard-military/20 text-white'
                      : 'text-dashboard-neutral hover:bg-white/5 hover:text-white',
                  ].join(' ')}
                >
                  <span>{label}</span>
                  {timeRange === value && <span aria-hidden className="text-dashboard-military">✓</span>}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
