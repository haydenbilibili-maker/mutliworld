'use client';

/**
 * 真彩卫星/云图图层 — 地表层（NASA GIBS / Worldview，免密钥 WMTS 瓦片）。
 * 使用 MODIS Terra 真彩校正反射率（近实时，约 1 天延迟），呈现全球云系与地表实况。
 * 数据源：NASA EOSDIS GIBS，公开免 key。真实数据·中立并陈。
 */

import { useEffect, useRef } from 'react';
import { useMapContext, useMapStyleEpoch } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { findLiveOverlayBeforeId } from '@/lib/map/basemap';

const SOURCE = 'gibs-truecolor';
const LAYER = 'gibs-truecolor-raster';
const GIBS_LAYER = 'MODIS_Terra_CorrectedReflectance_TrueColor';

/** GIBS 真彩产品约 1 天延迟，取 UTC 前一日 */
function gibsDate(): string {
  const d = new Date(Date.now() - 24 * 3600 * 1000);
  return d.toISOString().slice(0, 10);
}

export function GibsImageryLayer() {
  const map = useMapContext();
  const styleEpoch = useMapStyleEpoch();
  const activeTier = useMapStore((s) => s.activeTier);
  const activeLayers = useMapStore((s) => s.activeLayers);

  const enabled = activeTier === 'surface' && activeLayers.includes('satellite_imagery');
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    if (!map) return;
    const date = gibsDate();
    const tiles = [
      `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${GIBS_LAYER}/default/${date}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`,
    ];
    const setup = () => {
      try {
        if (!map.getSource(SOURCE)) {
          map.addSource(SOURCE, { type: 'raster', tiles, tileSize: 256, maxzoom: 9, attribution: 'NASA EOSDIS GIBS' });
        }
        if (!map.getLayer(LAYER)) {
          map.addLayer({
            id: LAYER, type: 'raster', source: SOURCE,
            layout: { visibility: enabledRef.current ? 'visible' : 'none' },
            paint: { 'raster-opacity': 0.9, 'raster-fade-duration': 300 },
          }, findLiveOverlayBeforeId(map));
        }
      } catch { /* 样式未就绪 */ }
    };
    if (map.isStyleLoaded()) setup();
    map.on('style.load', setup);
    return () => {
      map.off('style.load', setup);
      try {
        if (map.getLayer(LAYER)) map.removeLayer(LAYER);
        if (map.getSource(SOURCE)) map.removeSource(SOURCE);
      } catch { /* */ }
    };
  }, [map, styleEpoch]);

  useEffect(() => {
    if (!map) return;
    const apply = () => {
      try {
        if (map.getLayer(LAYER)) map.setLayoutProperty(LAYER, 'visibility', enabled ? 'visible' : 'none');
      } catch { /* */ }
    };
    if (map.isStyleLoaded()) apply();
    map.on('style.load', apply);
    return () => { map.off('style.load', apply); };
  }, [map, enabled, styleEpoch]);

  return null;
}
