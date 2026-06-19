'use client';

/**
 * 轨道环 — 宇宙空间层视觉（三位一体 Phase 2）
 *
 * 绘制 GEO 地球同步带（赤道）与示意 LEO 轨道地面轨迹（正弦带）。
 * 平面图上为横带/正弦曲线；升级 maplibre v5 球面后自动绕球成环。仅宇宙层显示。
 * ⚠ LEO 轨迹为「示意」可视化，非精确星历。
 */

import { useEffect } from 'react';
import type maplibregl from 'maplibre-gl';
import { useMapContext, useMapStyleEpoch } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import type { FeatureCollection } from 'geojson';

const SOURCE = 'orbit-rings';
const LAYER = 'orbit-rings-line';

/** 生成一条地面轨迹（按倾角的正弦近似）：lat = incl * sin(经度相位) */
function track(
  id: string,
  inclDeg: number,
  cycles: number,
  phaseDeg: number,
  label: string,
): GeoJSON.Feature {
  const coords: [number, number][] = [];
  for (let lng = -180; lng <= 180; lng += 3) {
    const t = ((lng + 180) / 360) * Math.PI * 2 * cycles + (phaseDeg * Math.PI) / 180;
    const lat = inclDeg * Math.sin(t);
    coords.push([lng, lat]);
  }
  return {
    type: 'Feature',
    geometry: { type: 'LineString', coordinates: coords },
    properties: { id, kind: 'leo', label },
  };
}

function buildOrbitData(): FeatureCollection {
  // GEO 同步带（赤道）
  const geoBelt: GeoJSON.Feature = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: Array.from({ length: 121 }, (_, i) => [-180 + i * 3, 0] as [number, number]),
    },
    properties: { id: 'geo-belt', kind: 'geo', label: 'GEO 同步轨道带' },
  };
  return {
    type: 'FeatureCollection',
    features: [
      geoBelt,
      track('leo-iss', 51.6, 2.5, 0, 'LEO 倾角 51.6°（示意）'),
      track('leo-sso', 86, 2.5, 60, 'LEO 太阳同步 ~98°（示意）'),
    ],
  };
}

export function OrbitRings() {
  const map = useMapContext();
  const styleEpoch = useMapStyleEpoch();
  const show = useMapStore((s) => s.activeTier === 'space');

  useEffect(() => {
    if (!map) return;

    const ensure = () => {
      try {
        if (!map.getSource(SOURCE)) {
          map.addSource(SOURCE, { type: 'geojson', data: buildOrbitData() });
        }
        if (!map.getLayer(LAYER)) {
          map.addLayer({
            id: LAYER,
            type: 'line',
            source: SOURCE,
            layout: {
              visibility: show ? 'visible' : 'none',
              'line-cap': 'round',
            },
            paint: {
              'line-color': [
                'match',
                ['get', 'kind'],
                'geo',
                '#facc15',
                '#7dd3fc',
              ],
              'line-width': ['match', ['get', 'kind'], 'geo', 1.8, 1.2],
              'line-opacity': ['match', ['get', 'kind'], 'geo', 0.85, 0.5],
              'line-dasharray': [2, 2],
            },
          });
        } else {
          map.setLayoutProperty(LAYER, 'visibility', show ? 'visible' : 'none');
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
  }, [map, show, styleEpoch]);

  return null;
}

export type { maplibregl };
