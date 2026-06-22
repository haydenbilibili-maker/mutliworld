'use client';

/** 极端气温事件图层 — 地表层（NASA EONET tempExtremes）。红橙圆点+点击富详情。薄封装于通用 EonetEventLayer。 */

import { EonetEventLayer } from '@/components/map/EonetEventLayer';

export function TempExtremesLayer() {
  return (
    <EonetEventLayer config={{
      layerId: 'tempextremes', endpoint: '/api/tempextremes', srcKey: 'tempextremes',
      glowColor: '#f97316', coreColor: '#ea580c', strokeColor: '#fed7aa', icon: '🌡️', dateLabel: '最新定位',
      impact: 'medium', domains: ['公共健康', '能源', '农业'],
    }} />
  );
}
