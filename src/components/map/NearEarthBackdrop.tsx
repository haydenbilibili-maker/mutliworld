'use client';

/**
 * 近地层暗化背景 — 对标 earth.nullschool：进入近地层时在底图上覆一层暗色，
 * 让风/洋流粒子流与污染物叠加更凸显。z 介于地图画布与粒子 canvas 之间。
 */

import { useEffect } from 'react';
import { useMapContext } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';

export function NearEarthBackdrop() {
  const map = useMapContext();
  const active = useMapStore((s) => s.activeBody === 'earth' && s.activeTier === 'near_earth');

  useEffect(() => {
    if (!map || !active) return;
    const container = map.getCanvasContainer();
    const veil = document.createElement('div');
    veil.style.cssText =
      'position:absolute;inset:0;pointer-events:none;z-index:1;' +
      'background:radial-gradient(ellipse at center, rgba(6,10,24,0.4) 0%, rgba(4,7,18,0.62) 100%);' +
      'transition:opacity .3s;opacity:0;';
    container.appendChild(veil);
    requestAnimationFrame(() => { veil.style.opacity = '1'; });
    return () => { veil.remove(); };
  }, [map, active]);

  return null;
}
