'use client';

/**
 * 航迹尾迹 — 在每架飞机身后绘制一条沿航向淡出的轨迹线（WorldMonitor 活地图观感）。
 * 基于航向 heading + 地速 velocityMs 外推合成尾迹（无状态、即时可见），line-gradient 尾部淡出。
 * 复用 useLiveFlights（与 FlightLayer 同 key，SWR 去重，无额外请求）；随数据 45s 更新，不逐帧重绘。
 */

import { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import type { FeatureCollection, Feature } from 'geojson';
import { useMapContext, useMapStyleEpoch } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { useLiveFlights } from '@/hooks/useLiveFlights';

const SOURCE = 'live-flight-trails';
const LAYER = 'live-flight-trails-line';
/** 尾迹分段数与每段时长（秒）：总尾迹约 2 分钟航程 */
const SEGMENTS = 3;
const SEG_SECONDS = 40;

function buildTrails(geojson: FeatureCollection): FeatureCollection {
  const features: Feature[] = [];
  for (const f of geojson.features) {
    if (f.geometry?.type !== 'Point') continue;
    const p = f.properties as Record<string, unknown> | undefined;
    if (!p) continue;
    const heading = Number(p.heading);
    const v = Number(p.velocityMs);
    if (!Number.isFinite(heading) || !Number.isFinite(v) || v < 20) continue;
    const [lng, lat] = f.geometry.coordinates as [number, number];
    const backBearing = ((heading + 180) % 360) * (Math.PI / 180);
    const cosLat = Math.max(0.2, Math.cos((lat * Math.PI) / 180));
    const coords: [number, number][] = [];
    // 从最远的尾端到机头（line-progress 0→1 = 尾→头）
    for (let k = SEGMENTS; k >= 0; k--) {
      const d = v * SEG_SECONDS * k; // 米
      const dLat = (d * Math.cos(backBearing)) / 111320;
      const dLng = (d * Math.sin(backBearing)) / (111320 * cosLat);
      coords.push([lng + dLng, lat + dLat]);
    }
    features.push({
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: coords },
      properties: {},
    });
  }
  return { type: 'FeatureCollection', features };
}

export function FlightTrailLayer() {
  const map = useMapContext();
  const styleEpoch = useMapStyleEpoch();
  const activeTier = useMapStore((s) => s.activeTier);
  const activeLayers = useMapStore((s) => s.activeLayers);
  const center = useMapStore((s) => s.center);
  const zoom = useMapStore((s) => s.zoom);

  const enabled = activeTier === 'surface' && activeLayers.includes('live_flights');
  const { geojson } = useLiveFlights(enabled, center, zoom);

  const trails = useMemo(() => buildTrails(geojson), [geojson]);
  const lastTrailKeyRef = useRef('');
  const lastEnabledRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (!map) return;
    let cancelled = false;
    // styleEpoch 刷新时重置守卫，确保数据/显隐被重新应用
    lastTrailKeyRef.current = '';
    lastEnabledRef.current = null;

    const trailKey = `${trails.features.length}`;

    const ensure = () => {
      if (cancelled || !map.isStyleLoaded()) return;
      try {
        if (!map.getSource(SOURCE)) {
          map.addSource(SOURCE, { type: 'geojson', data: trails, lineMetrics: true });
        }
        if (!map.getLayer(LAYER)) {
          const beforeId = ['live-flights-halo', 'live-flights-symbols'].find((id) => map.getLayer(id));
          map.addLayer(
            {
              id: LAYER,
              type: 'line',
              source: SOURCE,
              layout: { visibility: 'none', 'line-cap': 'round' },
              paint: {
                // 尾部透明 → 机头亮青，沿线渐变淡出
                'line-gradient': [
                  'interpolate',
                  ['linear'],
                  ['line-progress'],
                  0, 'rgba(56,189,248,0)',
                  0.7, 'rgba(56,189,248,0.35)',
                  1, 'rgba(125,211,252,0.85)',
                ],
                'line-width': ['interpolate', ['linear'], ['zoom'], 3, 0.8, 7, 1.6, 11, 2.4],
                'line-blur': 0.4,
              },
            },
            beforeId,
          );
        }
        // 仅当尾迹数据实际变化时才 setData
        if (trailKey !== lastTrailKeyRef.current) {
          (map.getSource(SOURCE) as maplibregl.GeoJSONSource | undefined)?.setData(trails);
          lastTrailKeyRef.current = trailKey;
        }
        // 仅当 enabled 状态变化时才改显隐
        if (enabled !== lastEnabledRef.current) {
          lastEnabledRef.current = enabled;
          if (map.getLayer(LAYER)) {
            map.setLayoutProperty(LAYER, 'visibility', enabled ? 'visible' : 'none');
          }
        }
      } catch {
        /* 样式未就绪 */
      }
    };

    ensure();
    map.on('style.load', ensure);
    const t1 = window.setTimeout(ensure, 150);
    const t2 = window.setTimeout(ensure, 540);

    return () => {
      cancelled = true;
      map.off('style.load', ensure);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      try {
        if (map.getLayer(LAYER)) map.removeLayer(LAYER);
        if (map.getSource(SOURCE)) map.removeSource(SOURCE);
      } catch {
        /* */
      }
    };
  }, [map, styleEpoch, enabled, trails]);

  return null;
}
