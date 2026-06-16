'use client';

import { useLaunchLogStore } from '@/store/useLaunchLogStore';
import { useLaunchLog } from '@/hooks/useLaunchLog';

interface LaunchLogButtonProps {
  className?: string;
  embedded?: boolean;
}

/** 地图控制条入口：打开发射日志面板 */
export function LaunchLogButton({ className = '', embedded = false }: LaunchLogButtonProps) {
  const open = useLaunchLogStore((s) => s.open);
  const toggle = useLaunchLogStore((s) => s.toggle);
  const { total } = useLaunchLog('1y');

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={open}
      aria-label="全球航天发射日志"
      className={[
        'flex items-center gap-1.5 rounded px-2 py-1 text-xs transition-colors sm:gap-2 sm:px-3 sm:py-1.5 sm:text-sm',
        embedded
          ? open
            ? 'bg-dashboard-military/25 text-white'
            : 'text-dashboard-neutral hover:bg-dashboard-neutral/20 hover:text-white'
          : [
              'gap-2 rounded-lg border px-3 py-2 shadow-lg backdrop-blur-sm',
              open
                ? 'border-dashboard-military/50 bg-dashboard-bg/95 text-white'
                : 'border-dashboard-neutral/25 bg-dashboard-bg/85 text-dashboard-neutral hover:border-dashboard-neutral/40 hover:text-white',
            ].join(' '),
        className,
      ].join(' ')}
    >
      <span aria-hidden>🚀</span>
      <span>发射日志</span>
      {total > 0 && (
        <span
          className={[
            'min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-center text-xs font-medium tabular-nums',
            open
              ? 'bg-dashboard-military/30 text-white'
              : 'bg-dashboard-neutral/15 text-dashboard-neutral/70',
          ].join(' ')}
        >
          {total}
        </span>
      )}
    </button>
  );
}
