'use client';

/** 干旱事件图层 — 地表层（NASA EONET drought）。土黄圆点+点击富详情。薄封装于通用 EonetEventLayer。 */

import { EonetEventLayer } from '@/components/map/EonetEventLayer';

export function DroughtLayer() {
  return (
    <EonetEventLayer config={{
      layerId: 'drought', endpoint: '/api/drought', srcKey: 'drought',
      glowColor: '#ca8a04', coreColor: '#a16207', strokeColor: '#fde68a', icon: '🏜️', dateLabel: '最新定位',
      impact: 'medium', domains: ['农业', '水资源', '能源'],
    }} />
  );
}
