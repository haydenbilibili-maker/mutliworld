'use client';

/** 野火事件图层 — 地表层（NASA EONET wildfires）。橙红圆点+点击富详情。薄封装于通用 EonetEventLayer。 */

import { EonetEventLayer } from '@/components/map/EonetEventLayer';

export function WildfireLayer() {
  return (
    <EonetEventLayer config={{
      layerId: 'wildfires', endpoint: '/api/wildfires', srcKey: 'wildfires',
      glowColor: '#f43f5e', coreColor: '#dc2626', strokeColor: '#fecaca', icon: '🔥', dateLabel: '最新定位',
      impact: 'high', domains: ['空气质量', '应急', '农林', '碳排放'],
    }} />
  );
}
