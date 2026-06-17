'use client';

/**
 * 地表层实时图层状态 FAB 纵向堆叠 — 避免航班/天气/披萨指数在移动端重叠
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
        'pointer-events-none absolute right-4 top-[7.25rem] z-30 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-2',
        'max-sm:top-[6.5rem]',
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
