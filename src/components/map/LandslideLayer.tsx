'use client';

/** 滑坡事件图层 — 地表层（NASA EONET landslides）。褐色圆点+点击富详情。薄封装于通用 EonetEventLayer。 */

import { EonetEventLayer } from '@/components/map/EonetEventLayer';

export function LandslideLayer() {
  return (
    <EonetEventLayer config={{
      layerId: 'landslides', endpoint: '/api/landslides', srcKey: 'landslides',
      glowColor: '#a16207', coreColor: '#854d0e', strokeColor: '#fde68a', icon: '⛰️', dateLabel: '最新定位',
      impact: 'medium', domains: ['交通', '基建', '救灾'],
    }} />
  );
}
