'use client';

/** 风暴/热带气旋图层 — 地表层（NASA EONET severeStorms）。青白圆点+点击详情。薄封装于通用 EonetEventLayer。 */

import { EonetEventLayer } from '@/components/map/EonetEventLayer';

export function StormLayer() {
  return (
    <EonetEventLayer config={{
      layerId: 'storms', endpoint: '/api/storms', srcKey: 'storms',
      glowColor: '#38bdf8', coreColor: '#7dd3fc', strokeColor: '#e0f2fe', icon: '🌪️', dateLabel: '最新定位',
    }} />
  );
}
