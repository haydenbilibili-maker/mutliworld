'use client';

/** 沙尘/霾事件图层 — 地表层（NASA EONET dustHaze）。土黄圆点+点击详情。薄封装于通用 EonetEventLayer。 */

import { EonetEventLayer } from '@/components/map/EonetEventLayer';

export function DustHazeLayer() {
  return (
    <EonetEventLayer config={{
      layerId: 'dusthaze', endpoint: '/api/dusthaze', srcKey: 'dusthaze',
      glowColor: '#d4a017', coreColor: '#b45309', strokeColor: '#fde68a', icon: '🌫️', dateLabel: '最新定位',
      impact: 'medium', domains: ['空气质量', '航空能见度', '公共健康'],
    }} />
  );
}
