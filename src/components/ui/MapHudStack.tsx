'use client';

import { DataFreshnessBar } from '@/components/ui/DataFreshnessBar';
import { MapLegend } from '@/components/ui/MapLegend';

interface MapHudStackProps {
  className?: string;
}

/** 左下角 HUD：数据说明 + 地图图例垂直堆叠 */
export function MapHudStack({ className = '' }: MapHudStackProps) {
  return (
    <div className={`flex flex-col items-start gap-2 ${className}`}>
      <DataFreshnessBar />
      <MapLegend />
    </div>
  );
}
