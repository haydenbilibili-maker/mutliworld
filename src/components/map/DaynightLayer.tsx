'use client';

/**
 * 晨昏线与昼夜区分图层 — 夜半球阴影 + 晨昏分界线 + 太阳直射点。
 * 仅在 daynight 图层开启时显示；每分钟随地球自转更新。自包含 ensure+重试，鲁棒应对底图切换。
 */

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { useMapContext, useMapStyleEpoch } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { buildTerminatorSegments, buildNightPolygon, subsolarPoint } from '@/lib/geodata/terminator';

const SRC_FILL = 'daynight-shade';
const SRC_LINE = 'daynight-term';
const LYR_FILL = 'daynight-fill';
const LYR_LINE = 'daynight-line';
/** 尽量把夜半球填充插到这些图层之下，避免遮盖标记 */
const BEFORE_CANDIDATES = ['geodata-api-halo', 'geodata-api-lines-solid', 'geodata-api-symbols'];

function nightFC(now: Date): GeoJSON.FeatureCollection {
  const poly = buildNightPolygon(now);
  if (!poly) return { type: 'FeatureCollection', features: [] };
  return {
    type: 'FeatureCollection',
    features: [{ type: 'Feature', geometry: { type: 'Polygon', coordinates: poly }, properties: {} }],
  };
}

function lineFC(now: Date): GeoJSON.FeatureCollection {
  const segs = buildTerminatorSegments(now);
  return {
    type: 'FeatureCollection',
    features: segs.map((coords) => ({
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: coords },
      properties: {},
    })),
  };
}

export function DaynightLayer() {
  const map = useMapContext();
  const styleEpoch = useMapStyleEpoch();
  const active = useMapStore((s) => s.activeLayers.includes('daynight'));
  const [tick, setTick] = useState(0);
  const sunRef = useRef<maplibregl.Marker | null>(null);

  // 每分钟刷新（地球自转 → 晨昏线移动）
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!map) return;
    let cancelled = false;

    const ensure = () => {
      if (cancelled || !map.isStyleLoaded()) return;
      try {
        const now = new Date();

        if (!map.getSource(SRC_FILL)) {
          map.addSource(SRC_FILL, { type: 'geojson', data: nightFC(now) });
        }
        if (!map.getSource(SRC_LINE)) {
          map.addSource(SRC_LINE, { type: 'geojson', data: lineFC(now) });
        }

        const beforeId = BEFORE_CANDIDATES.find((id) => map.getLayer(id));
        if (!map.getLayer(LYR_FILL)) {
          map.addLayer(
            {
              id: LYR_FILL,
              type: 'fill',
              source: SRC_FILL,
              layout: { visibility: 'none' },
              paint: { 'fill-color': '#070b22', 'fill-opacity': 0.42 },
            },
            beforeId,
          );
        }
        if (!map.getLayer(LYR_LINE)) {
          map.addLayer({
            id: LYR_LINE,
            type: 'line',
            source: SRC_LINE,
            layout: { visibility: 'none', 'line-cap': 'round' },
            paint: {
              'line-color': '#fbbf24',
              'line-width': 1.4,
              'line-opacity': 0.85,
              'line-dasharray': [4, 3],
            },
          });
        }

        // 刷新数据与显隐
        (map.getSource(SRC_FILL) as maplibregl.GeoJSONSource | undefined)?.setData(nightFC(now));
        (map.getSource(SRC_LINE) as maplibregl.GeoJSONSource | undefined)?.setData(lineFC(now));
        const vis = active ? 'visible' : 'none';
        if (map.getLayer(LYR_FILL)) map.setLayoutProperty(LYR_FILL, 'visibility', vis);
        if (map.getLayer(LYR_LINE)) map.setLayoutProperty(LYR_LINE, 'visibility', vis);

        // 太阳直射点标记
        if (active) {
          const sp = subsolarPoint(now);
          if (!sunRef.current) {
            const el = document.createElement('div');
            el.className = 'daynight-sun';
            el.innerHTML = '<span class="dn-sun-core">☀️</span><span class="dn-sun-glow"></span>';
            sunRef.current = new maplibregl.Marker({ element: el }).setLngLat([sp.lng, sp.lat]).addTo(map);
          } else {
            sunRef.current.setLngLat([sp.lng, sp.lat]);
          }
        } else if (sunRef.current) {
          sunRef.current.remove();
          sunRef.current = null;
        }
      } catch {
        /* 样式未就绪 */
      }
    };

    ensure();
    map.on('style.load', ensure);
    const t1 = window.setTimeout(ensure, 140);
    const t2 = window.setTimeout(ensure, 520);

    return () => {
      cancelled = true;
      map.off('style.load', ensure);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      try {
        if (map.getLayer(LYR_LINE)) map.removeLayer(LYR_LINE);
        if (map.getLayer(LYR_FILL)) map.removeLayer(LYR_FILL);
        if (map.getSource(SRC_LINE)) map.removeSource(SRC_LINE);
        if (map.getSource(SRC_FILL)) map.removeSource(SRC_FILL);
      } catch {
        /* */
      }
      sunRef.current?.remove();
      sunRef.current = null;
    };
  }, [map, styleEpoch, active, tick]);

  return (
    <style>{`
      .daynight-sun { position: relative; width: 0; height: 0; }
      .daynight-sun .dn-sun-core {
        position: absolute; left: -9px; top: -9px; font-size: 16px; line-height: 18px;
        filter: drop-shadow(0 0 6px rgba(251,191,36,0.9));
      }
      .daynight-sun .dn-sun-glow {
        position: absolute; left: -16px; top: -16px; width: 32px; height: 32px;
        border-radius: 50%; background: radial-gradient(circle, rgba(251,191,36,0.5), rgba(251,191,36,0));
        animation: dnSunPulse 3s ease-in-out infinite;
      }
      @keyframes dnSunPulse { 0%,100% { transform: scale(0.8); opacity: 0.6 } 50% { transform: scale(1.3); opacity: 0.25 } }
    `}</style>
  );
}
