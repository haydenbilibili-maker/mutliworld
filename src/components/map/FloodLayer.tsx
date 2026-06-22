'use client';

/** 洪水事件图层 — 地表层（NASA EONET floods）。蓝色圆点+点击详情。薄封装于通用 EonetEventLayer。 */

import { EonetEventLayer } from '@/components/map/EonetEventLayer';

export function FloodLayer() {
  return (
    <EonetEventLayer config={{
      layerId: 'floods', endpoint: '/api/floods', srcKey: 'floods',
      glowColor: '#3b82f6', coreColor: '#2563eb', strokeColor: '#bfdbfe', icon: '🌊', dateLabel: '最新定位',
      impact: 'medium', domains: ['农业', '基建', '救灾'],
    }} />
  );
}
