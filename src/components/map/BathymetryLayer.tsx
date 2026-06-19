'use client';

/**
 * 海床地形栅格层 — 洋底空间层（三位一体 Phase 1）
 * 'bathymetry' 图层激活时叠加 EMODnet 海底地形栅格瓦片（公开），让洋底层真正"沉到海床"。
 * 置于态势点之下，作为底图增强。
 */

import { useEffect } from 'react';
import type maplibregl from 'maplibre-gl';
import { useMapContext, useMapStyleEpoch } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { findOverlayBeforeId } from '@/lib/map/basemap';

const SOURCE = 'bathymetry-emodnet';
const LAYER = 'bathymetry-emodnet-raster';
// EMODnet Bathymetry 公开 XYZ 瓦片（Web Mercator）
const TILES = ['https://tiles.emodnet-bathymetry.eu/2020/baselayer/web_mercator/{z}/{x}/{y}.png'];

export function BathymetryLayer() {
  const map = useMapContext();
  const styleEpoch = useMapStyleEpoch();
  const active = useMapStore((s) => s.activeTier === 'subsurface');

  useEffect(() => {
    if (!map) return;

    const ensure = () => {
      try {
        if (!map.getSource(SOURCE)) {
          map.addSource(SOURCE, {
            type: 'raster',
            tiles: TILES,
            tileSize: 256,
            attribution: 'EMODnet Bathymetry',
          });
        }
        if (!map.getLayer(LAYER)) {
          // 尽量置于态势点/线之下
          const beforeId = findOverlayBeforeId(map);
          map.addLayer(
            {
              id: LAYER,
              type: 'raster',
              source: SOURCE,
              paint: { 'raster-opacity': 0.75 },
              layout: { visibility: active ? 'visible' : 'none' },
            },
            beforeId,
          );
        } else {
          map.setLayoutProperty(LAYER, 'visibility', active ? 'visible' : 'none');
        }
      } catch {
        /* 样式未就绪 */
      }
    };

    if (map.isStyleLoaded()) ensure();
    map.on('style.load', ensure);

    return () => {
      map.off('style.load', ensure);
      try {
        if (map.getLayer(LAYER)) {
          map.removeLayer(LAYER);
        }
        if (map.getSource(SOURCE)) {
          map.removeSource(SOURCE);
        }
      } catch {
        /* */
      }
    };
  }, [map, active, styleEpoch]);

  return null;
}

export type { maplibregl };
