'use client';

/**
 * 实时仪表盘条 — 顶部 tab 面板右侧的横向实时状态带
 * 航班 / 海运 / 天气 / 披萨指数等实时源以紧凑芯片横向排列，向左生长；
 * 移动端转为常规流式换行，避免与事件流/面板堆叠遮挡。
 */

import { FlightListHost } from '@/components/ui/FlightListHost';
import { MaritimeListHost } from '@/components/ui/MaritimeListHost';
import { LiveWeatherStatusHost } from '@/components/ui/LiveWeatherStatusHost';
import { PizzaIndexHost } from '@/components/ui/PizzaIndexHost';

interface SurfaceLayerStatusStackProps {
  className?: string;
}

export function SurfaceLayerStatusStack({ className = '' }: SurfaceLayerStatusStackProps) {
  return (
    <div
      className={[
        'pointer-events-none absolute right-4 top-4 z-30 flex max-w-[min(58vw,44rem)] flex-row flex-wrap items-center justify-end gap-1.5',
        'max-sm:static max-sm:max-w-full max-sm:justify-end',
        className,
      ].join(' ')}
    >
      <FlightListHost className="!static !top-auto !right-auto" />
      <MaritimeListHost className="!static !top-auto !right-auto" />
      <LiveWeatherStatusHost className="!static !top-auto !right-auto" />
      <PizzaIndexHost className="!static !top-auto !right-auto" />
    </div>
  );
}
