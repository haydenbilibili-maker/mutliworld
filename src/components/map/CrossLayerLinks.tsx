'use client';

/**
 * 跨层关联高亮 — 招牌交互「天—地—海垂直剖面」的地图联动
 *
 * 剖面取点后：从剖面点向 宇宙/地表/洋底 三层各自最近的要素连线，并在目标处画高亮环，
 * 把同一坐标上下贯通的三层态势在地图上「串」起来（例：点海缆→连到登陆城市→连到头顶卫星）。
 * 复用 computeProfileBuckets，与剖面面板一致。
 */

import { useEffect, useMemo, useRef } from 'react';
import type maplibregl from 'maplibre-gl';
import type { FeatureCollection } from 'geojson';
import { useMapContext, useMapStyleEpoch } from '@/context/MapContext';
import { useProfileStore } from '@/store/useProfileStore';
import { useGeodataContext } from '@/context/GeodataContext';
import { useLiveSatellites } from '@/hooks/useLiveSatellites';
import { computeProfileBuckets } from '@/lib/profile/computeProfile';

const SOURCE = 'profile-links';
const LINE = 'profile-links-line';
const RING = 'profile-links-ring';
const EMPTY_FC: FeatureCollection = { type: 'FeatureCollection', features: [] };

const TIER_COLOR: Record<string, string> = {
  space: '#38bdf8',
  surface: '#facc15',
  subsurface: '#2dd4bf',
  center: '#f59e0b',
};

export function CrossLayerLinks() {
  const map = useMapContext();
  const styleEpoch = useMapStyleEpoch();
  const active = useProfileStore((s) => s.active);
  const point = useProfileStore((s) => s.point);
  const { data } = useGeodataContext();
  const { items: liveSats } = useLiveSatellites(active);

  const liveSatsKey = useMemo(
    () =>
      liveSats
        .map((s) => `${s.norad}:${s.lng.toFixed(3)},${s.lat.toFixed(3)}`)
        .join('|'),
    [liveSats],
  );

  const fc = useMemo<FeatureCollection>(() => {
    if (!active || !point) return EMPTY_FC;
    const buckets = computeProfileBuckets(data?.features, liveSats, point);
    const feats: FeatureCollection['features'] = [];
    // 剖面中心环
    feats.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: point },
      properties: { kind: 'ring', tier: 'center' },
    });
    (['space', 'surface', 'subsurface'] as const).forEach((tier) => {
      const it = buckets[tier][0];
      if (!it) return;
      feats.push({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: [point, [it.lng, it.lat]] },
        properties: { kind: 'link', tier },
      });
      feats.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [it.lng, it.lat] },
        properties: { kind: 'ring', tier },
      });
    });
    return { type: 'FeatureCollection', features: feats };
  }, [active, point, data, liveSatsKey]);

  const fcKey = useMemo(() => JSON.stringify(fc), [fc]);
  const lastFcKeyRef = useRef('');

  useEffect(() => {
    if (!map) return;

    const ensure = () => {
      try {
        if (!map.getSource(SOURCE)) {
          map.addSource(SOURCE, { type: 'geojson', data: fc });
        } else {
          (map.getSource(SOURCE) as maplibregl.GeoJSONSource).setData(fc);
        }
        if (!map.getLayer(LINE)) {
          map.addLayer({
            id: LINE,
            type: 'line',
            source: SOURCE,
            filter: ['==', ['get', 'kind'], 'link'],
            layout: { 'line-cap': 'round' },
            paint: {
              'line-color': [
                'match', ['get', 'tier'],
                'space', TIER_COLOR.space,
                'surface', TIER_COLOR.surface,
                'subsurface', TIER_COLOR.subsurface,
                '#ffffff',
              ],
              'line-width': 1.6,
              'line-opacity': 0.85,
              'line-dasharray': [2, 1.5],
            },
          });
        }
        if (!map.getLayer(RING)) {
          map.addLayer({
            id: RING,
            type: 'circle',
            source: SOURCE,
            filter: ['==', ['get', 'kind'], 'ring'],
            paint: {
              'circle-radius': ['case', ['==', ['get', 'tier'], 'center'], 9, 7],
              'circle-color': 'rgba(0,0,0,0)',
              'circle-stroke-width': 2,
              'circle-stroke-color': [
                'match', ['get', 'tier'],
                'space', TIER_COLOR.space,
                'surface', TIER_COLOR.surface,
                'subsurface', TIER_COLOR.subsurface,
                'center', TIER_COLOR.center,
                '#ffffff',
              ],
              'circle-stroke-opacity': 0.9,
            },
          });
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
        if (map.getLayer(RING)) map.removeLayer(RING);
        if (map.getLayer(LINE)) map.removeLayer(LINE);
        if (map.getSource(SOURCE)) map.removeSource(SOURCE);
      } catch {
        /* */
      }
    };
  }, [map, styleEpoch]);

  // 数据更新
  useEffect(() => {
    if (!map) return;
    if (fcKey === lastFcKeyRef.current) return;
    lastFcKeyRef.current = fcKey;
    try {
      const src = map.getSource(SOURCE) as maplibregl.GeoJSONSource | undefined;
      if (src) src.setData(fc);
    } catch {
      /* */
    }
  }, [map, fc, fcKey]);

  return null;
}
