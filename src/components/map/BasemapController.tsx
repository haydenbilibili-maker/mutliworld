'use client';

/**
 * 按空间层切换底图样式：
 * - 地表 → OpenFreeMap 自然地理矢量 + 可选 DEM 地形增强
 * - 洋底/宇宙 → 深色国界+经纬网（Bathymetry / 星空由其它层叠加）
 */

import { useEffect, useRef } from 'react';
import { useMapContext, useBumpMapStyleEpoch } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { getTier } from '@/tiers';
import {
  applyBasemapZoomConstraints,
  applyTerrainEnhancement,
  clearTerrainEnhancement,
  isTerrainEnhanceEnabled,
  resolveBasemapStyle,
} from '@/lib/map/basemap';

export function BasemapController() {
  const map = useMapContext();
  const bumpStyleEpoch = useBumpMapStyleEpoch();
  const activeTier = useMapStore((s) => s.activeTier);
  const prevTierRef = useRef(activeTier);

  useEffect(() => {
    if (!map) return;
    if (prevTierRef.current === activeTier) return;

    prevTierRef.current = activeTier;

    const preset = getTier(activeTier)?.basemap ?? 'geographic';
    const style = resolveBasemapStyle(preset);
    const terrainEnhance = preset === 'geographic' && isTerrainEnhanceEnabled();

    const apply = () => {
      try {
        if (typeof style === 'string') {
          map.setStyle(style);
        } else {
          clearTerrainEnhancement(map);
          map.setStyle(style);
        }
        map.once('style.load', () => {
          try {
            applyBasemapZoomConstraints(map, preset);
            if (terrainEnhance && typeof style === 'string') {
              applyTerrainEnhancement(map);
            } else {
              clearTerrainEnhancement(map);
            }
          } catch {
            /* */
          }
          bumpStyleEpoch();
        });
      } catch {
        /* 地图销毁中 */
      }
    };

    if (map.isStyleLoaded()) apply();
    else map.once('load', apply);
  }, [map, activeTier, bumpStyleEpoch]);

  return null;
}
