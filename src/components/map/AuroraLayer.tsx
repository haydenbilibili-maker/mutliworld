'use client';

/**
 * 极光带图层 — 地表层（NOAA SWPC OVATION，约 5 分钟更新）。
 * 高概率点以辉光圆点融合成极光卵；按出现概率着色（暗绿→亮绿→黄绿→品红）。真实数据·中立并陈。
 */

import { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import useSWR from 'swr';
import type { FeatureCollection } from 'geojson';
import { useMapContext, useMapStyleEpoch } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { findLiveOverlayBeforeId } from '@/lib/map/basemap';

const SOURCE = 'live-aurora';
const GLOW = 'live-aurora-glow';
const CORE = 'live-aurora-core';
const fetcher = (url: string) => fetch(url).then((r) => r.json());

const COLOR_EXPR: maplibregl.ExpressionSpecification = [
  'interpolate', ['linear'], ['get', 'aurora'],
  8, '#15803d', 25, '#22c55e', 45, '#4ade80', 70, '#a3e635', 90, '#e879f9',
];
const OPACITY_EXPR: maplibregl.ExpressionSpecification = [
  'interpolate', ['linear'], ['get', 'aurora'], 8, 0.12, 30, 0.4, 70, 0.7, 100, 0.85,
];

export function AuroraLayer() {
  const map = useMapContext();
  const styleEpoch = useMapStyleEpoch();
  const activeTier = useMapStore((s) => s.activeTier);
  const activeLayers = useMapStore((s) => s.activeLayers);

  const enabled = activeTier === 'surface' && activeLayers.includes('aurora');
  const { data } = useSWR<FeatureCollection>(enabled ? '/api/aurora' : null, fetcher, {
    revalidateOnFocus: false, refreshInterval: 10 * 60 * 1000, dedupingInterval: 2 * 60 * 1000,
  });
  const geojson: FeatureCollection = data?.type === 'FeatureCollection' ? data : { type: 'FeatureCollection', features: [] };

  const lastKey = useRef('');
  const dataKey = useMemo(() => `${enabled}:${geojson.features.length}`, [geojson, enabled]);

  useEffect(() => {
    if (!map) return;
    const setup = () => {
      try {
        if (!map.getSource(SOURCE)) map.addSource(SOURCE, { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
        if (!map.getLayer(GLOW)) {
          map.addLayer({
            id: GLOW, type: 'circle', source: SOURCE, layout: { visibility: 'none' },
            paint: { 'circle-radius': 14, 'circle-color': COLOR_EXPR, 'circle-opacity': ['*', OPACITY_EXPR, 0.5], 'circle-blur': 1 },
          }, findLiveOverlayBeforeId(map));
        }
        if (!map.getLayer(CORE)) {
          map.addLayer({
            id: CORE, type: 'circle', source: SOURCE, layout: { visibility: 'none' },
            paint: { 'circle-radius': 7, 'circle-color': COLOR_EXPR, 'circle-opacity': OPACITY_EXPR, 'circle-blur': 0.6 },
          }, findLiveOverlayBeforeId(map));
        }
      } catch { /* 样式未就绪 */ }
    };
    if (map.isStyleLoaded()) setup();
    map.on('style.load', setup);
    return () => {
      map.off('style.load', setup);
      try {
        if (map.getLayer(CORE)) map.removeLayer(CORE);
        if (map.getLayer(GLOW)) map.removeLayer(GLOW);
        if (map.getSource(SOURCE)) map.removeSource(SOURCE);
      } catch { /* */ }
    };
  }, [map, styleEpoch]);

  useEffect(() => { lastKey.current = ''; }, [styleEpoch]);

  useEffect(() => {
    if (!map) return;
    const apply = () => {
      try {
        const src = map.getSource(SOURCE) as maplibregl.GeoJSONSource | undefined;
        if (!src || !map.getLayer(CORE) || !map.getLayer(GLOW)) return;
        if (dataKey !== lastKey.current) { src.setData(geojson); lastKey.current = dataKey; }
        const vis = enabled ? 'visible' : 'none';
        map.setLayoutProperty(CORE, 'visibility', vis);
        map.setLayoutProperty(GLOW, 'visibility', vis);
      } catch { /* */ }
    };
    if (map.isStyleLoaded()) apply();
    map.on('style.load', apply);
    return () => { map.off('style.load', apply); };
  }, [map, enabled, geojson, dataKey, styleEpoch]);

  return null;
}
