'use client';

/** 海冰/湖冰事件图层 — 地表层（NASA EONET seaLakeIce）。冰白圆点+点击详情。薄封装于通用 EonetEventLayer。 */

import { EonetEventLayer } from '@/components/map/EonetEventLayer';

export function SeaIceLayer() {
  return (
    <EonetEventLayer config={{
      layerId: 'seaice', endpoint: '/api/seaice', srcKey: 'seaice',
      glowColor: '#a5f3fc', coreColor: '#e0f2fe', strokeColor: '#67e8f9', icon: '🧊', dateLabel: '最新定位',
    }} />
  );
}
