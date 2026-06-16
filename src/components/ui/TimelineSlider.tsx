'use client';

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

export function TimelineSlider({ className = '', embedded = false }: TimelineSliderProps) {
  const { timeRange, setTimeRange } = useMapStore();

  return (
    <div
      className={[
        'flex items-center gap-2 sm:gap-3',
        embedded ? 'px-1 py-0.5' : 'rounded-lg border border-dashboard-neutral/20 bg-dashboard-bg/90 px-4 py-2',
        className,
      ].join(' ')}
      role="group"
      aria-label="时间范围"
    >
      <span className="shrink-0 text-xs text-dashboard-neutral sm:text-sm">时间范围</span>
      <div className="flex gap-1 sm:gap-2">
        {OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTimeRange(value)}
            className={[
              'rounded px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm',
              timeRange === value
                ? 'bg-dashboard-military text-white'
                : 'text-dashboard-neutral hover:bg-dashboard-neutral/20',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
