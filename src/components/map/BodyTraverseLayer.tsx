'use client';

/**
 * 巡视器行进轨迹图层 — 多天体探索 Phase 4（真实 traverse）
 * NASA MMGIS 公开航点构建的折线 + 末端当前位置点。门控于火星 + mars_traverse 开启。
 */

import { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import type { FeatureCollection } from 'geojson';
import { useMapContext, useMapStyleEpoch } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { useBodyStore } from '@/store/useBodyStore';
import { useBodyTraverse } from '@/hooks/useBodyTraverse';

const SRC_LINE = 'body-traverse-line';
const SRC_END = 'body-traverse-end';
const LINE = 'body-traverse-line-layer';
const END = 'body-traverse-end-layer';
const END_LABEL = 'body-traverse-end-label';

export function BodyTraverseLayer() {
  const map = useMapContext();
  const styleEpoch = useMapStyleEpoch();
  const activeBody = useMapStore((s) => s.activeBody);
  const activeBodyLayers = useBodyStore((s) => s.activeBodyLayers);

  const enabled = activeBody === 'mars' && activeBodyLayers.includes('mars_traverse');
  const { paths } = useBodyTraverse(activeBody, enabled);

  const lineGeo = useMemo<FeatureCollection>(() => {
    if (!enabled) return { type: 'FeatureCollection', features: [] };
    return {
      type: 'FeatureCollection',
      features: paths.map((p) => ({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: p.coords },
        properties: { rover: p.rover, color: p.color, count: p.count },
      })),
    };
  }, [enabled, paths]);

  const endGeo = useMemo<FeatureCollection>(() => {
    if (!enabled) return { type: 'FeatureCollection', features: [] };
    return {
      type: 'FeatureCollection',
      features: paths
        .filter((p) => p.last)
        .map((p) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: p.last as [number, number] },
          properties: { rover: p.rover, color: p.color, count: p.count },
        })),
    };
  }, [enabled, paths]);

  const lastKeyRef = useRef('');
  const dataKey = useMemo(() => `${activeBody}:${paths.map((p) => `${p.id}:${p.count}`).join('|')}`, [activeBody, paths]);

  useEffect(() => {
    if (!map) return;
    const setup = () => {
      try {
        if (!map.getSource(SRC_LINE)) map.addSource(SRC_LINE, { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
        if (!map.getSource(SRC_END)) map.addSource(SRC_END, { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
        if (!map.getLayer(LINE)) {
          map.addLayer({ id: LINE, type: 'line', source: SRC_LINE, layout: { visibility: 'none', 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': ['get', 'color'], 'line-width': 2, 'line-opacity': 0.85 } });
        }
        if (!map.getLayer(END)) {
          map.addLayer({ id: END, type: 'circle', source: SRC_END, layout: { visibility: 'none' }, paint: { 'circle-radius': 5, 'circle-color': ['get', 'color'], 'circle-stroke-width': 1.5, 'circle-stroke-color': '#0A0E17' } });
        }
        if (!map.getLayer(END_LABEL)) {
          map.addLayer({ id: END_LABEL, type: 'symbol', source: SRC_END, layout: { visibility: 'none', 'text-field': ['concat', ['get', 'rover'], ' · 当前'], 'text-size': 10, 'text-offset': [0, 1.1], 'text-anchor': 'top', 'text-optional': true }, paint: { 'text-color': '#ffe8c2', 'text-halo-color': '#0A0E17', 'text-halo-width': 1.2 } });
        }
      } catch {
        /* */
      }
    };
    if (map.isStyleLoaded()) setup();
    map.on('style.load', setup);
    return () => {
      map.off('style.load', setup);
      try {
        if (map.getLayer(END_LABEL)) map.removeLayer(END_LABEL);
        if (map.getLayer(END)) map.removeLayer(END);
        if (map.getLayer(LINE)) map.removeLayer(LINE);
        if (map.getSource(SRC_END)) map.removeSource(SRC_END);
        if (map.getSource(SRC_LINE)) map.removeSource(SRC_LINE);
      } catch {
        /* */
      }
    };
  }, [map, styleEpoch]);

  useEffect(() => { lastKeyRef.current = ''; }, [styleEpoch]);

  useEffect(() => {
    if (!map) return;
    const apply = () => {
      try {
        const sl = map.getSource(SRC_LINE) as maplibregl.GeoJSONSource | undefined;
        const se = map.getSource(SRC_END) as maplibregl.GeoJSONSource | undefined;
        if (!sl || !se || !map.getLayer(LINE)) return;
        if (dataKey !== lastKeyRef.current) {
          sl.setData(lineGeo);
          se.setData(endGeo);
          lastKeyRef.current = dataKey;
        }
        const vis = enabled ? 'visible' : 'none';
        map.setLayoutProperty(LINE, 'visibility', vis);
        map.setLayoutProperty(END, 'visibility', vis);
        map.setLayoutProperty(END_LABEL, 'visibility', vis);
      } catch {
        /* */
      }
    };
    if (map.isStyleLoaded()) apply();
    map.on('style.load', apply);
    return () => { map.off('style.load', apply); };
  }, [map, enabled, lineGeo, endGeo, dataKey, styleEpoch]);

  return null;
}
