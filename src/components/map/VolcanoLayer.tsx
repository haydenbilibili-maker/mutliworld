'use client';

/** 活跃火山图层 — 地表层（NASA EONET）。橙红圆点+点击详情。薄封装于通用 EonetEventLayer。 */

import { EonetEventLayer } from '@/components/map/EonetEventLayer';

export function VolcanoLayer() {
  return (
    <EonetEventLayer config={{
      layerId: 'volcanoes', endpoint: '/api/volcanoes', srcKey: 'volcanoes',
      glowColor: '#f97316', coreColor: '#ea580c', strokeColor: '#fed7aa', icon: '🌋', dateLabel: '活跃事件',
      impact: 'high', domains: ['航空', '空气质量', '应急'],
    }} />
  );
}
