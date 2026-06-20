'use client';

/**
 * 实时卫星图层 — 宇宙空间层（三位一体）
 * 仅在 🛰 宇宙层显示。普通卫星为圆点（geojson circle 层），
 * 国际空间站 ISS 与中国空间站 天宫用 DOM 脉冲标记 + 标签高亮（无需字体 glyphs）。
 * 数据每 12 秒刷新（wheretheiss.at 实时星下点）。
 */

import { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import type { FeatureCollection } from 'geojson';
import { useMapContext, useMapStyleEpoch } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { useLiveSatellites } from '@/hooks/useLiveSatellites';
import type { LiveSat } from '@/lib/space/liveSatellites';

const SOURCE = 'live-sats';
const GLOW = 'live-sats-glow';
const DOT = 'live-sats-dot';

function toFC(sats: LiveSat[]): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: sats
      .filter((s) => s.kind === 'sat')
      .map((s) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [s.lng, s.lat] },
        properties: { id: String(s.norad), name: s.name },
      })),
  };
}

export function LiveSatellitesLayer() {
  const map = useMapContext();
  const styleEpoch = useMapStyleEpoch();
  const inSpace = useMapStore((s) => s.activeTier === 'space');
  const selectEvent = useMapStore((s) => s.selectEvent);
  const setViewport = useMapStore((s) => s.setViewport);
  const zoom = useMapStore((s) => s.zoom);
  const selectEventRef = useRef(selectEvent);
  const setViewportRef = useRef(setViewport);
  const zoomRef = useRef(zoom);
  selectEventRef.current = selectEvent;
  setViewportRef.current = setViewport;
  zoomRef.current = zoom;

  const { items } = useLiveSatellites(inSpace);
  const markersRef = useRef<Map<number, maplibregl.Marker>>(new Map());
  const lastDotsKeyRef = useRef('');
  const lastSatsVisibleRef = useRef<boolean | null>(null);

  const itemsKey = useMemo(
    () =>
      items
        .map((s) => `${s.norad}:${s.kind}:${s.lng.toFixed(3)},${s.lat.toFixed(3)}`)
        .join('|'),
    [items],
  );

  // 圆点图层（普通卫星）
  useEffect(() => {
    if (!map) return;

    const setup = () => {
      try {
        if (!map.getSource(SOURCE)) {
          map.addSource(SOURCE, {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] },
          });
        }
        if (!map.getLayer(GLOW)) {
          map.addLayer({
            id: GLOW,
            type: 'circle',
            source: SOURCE,
            layout: { visibility: 'none' },
            paint: {
              'circle-radius': 9,
              'circle-color': '#38bdf8',
              'circle-opacity': 0.18,
              'circle-blur': 0.6,
            },
          });
        }
        if (!map.getLayer(DOT)) {
          map.addLayer({
            id: DOT,
            type: 'circle',
            source: SOURCE,
            layout: { visibility: 'none' },
            paint: {
              'circle-radius': 3.5,
              'circle-color': '#7dd3fc',
              'circle-stroke-width': 1,
              'circle-stroke-color': '#0A0E17',
            },
          });
        }
      } catch {
        /* 样式未就绪 */
      }
    };

    if (map.isStyleLoaded()) setup();
    map.on('style.load', setup);

    return () => {
      map.off('style.load', setup);
      try {
        if (map.getLayer(DOT)) map.removeLayer(DOT);
        if (map.getLayer(GLOW)) map.removeLayer(GLOW);
        if (map.getSource(SOURCE)) map.removeSource(SOURCE);
      } catch {
        /* */
      }
    };
  }, [map, styleEpoch]);

  // 数据更新：圆点 setData + 显隐
  useEffect(() => {
    if (!map) return;
    const apply = () => {
      try {
        const src = map.getSource(SOURCE) as maplibregl.GeoJSONSource | undefined;
        const dotsKey = `${inSpace}:${itemsKey}`;
        if (src && dotsKey !== lastDotsKeyRef.current) {
          src.setData(toFC(items));
          lastDotsKeyRef.current = dotsKey;
        }
        if (inSpace !== lastSatsVisibleRef.current) {
          lastSatsVisibleRef.current = inSpace;
          if (map.getLayer(DOT)) map.setLayoutProperty(DOT, 'visibility', inSpace ? 'visible' : 'none');
          if (map.getLayer(GLOW)) map.setLayoutProperty(GLOW, 'visibility', inSpace ? 'visible' : 'none');
        }
      } catch {
        /* */
      }
    };
    if (map.isStyleLoaded()) apply();
    map.on('style.load', apply);
    return () => {
      map.off('style.load', apply);
    };
  }, [map, items, itemsKey, inSpace, styleEpoch]);

  // 空间站 DOM 高亮标记（脉冲 + 标签）
  useEffect(() => {
    if (!map) return;
    const markers = markersRef.current;
    const stations = inSpace ? items.filter((s) => s.highlight) : [];
    const seen = new Set<number>();

    for (const s of stations) {
      seen.add(s.norad);
      let mk = markers.get(s.norad);
      if (!mk) {
        const el = document.createElement('div');
        el.className = 'live-station-marker';
        const isISS = s.norad === 25544;
        const color = isISS ? '#22d3ee' : '#fb7185';
        el.innerHTML = `
          <span class="lsm-pulse" style="--c:${color}"></span>
          <span class="lsm-dot" style="background:${color}"></span>
          <span class="lsm-label" style="border-color:${color}66">${isISS ? '🛰️ ISS' : '🛰️ 天宫'}</span>
        `;
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => {
          setViewportRef.current([s.lng, s.lat], zoomRef.current);
          selectEventRef.current({
            id: `live-${s.norad}`,
            title: s.name,
            source: 'wheretheiss.at（实时）',
            timestamp: new Date().toISOString(),
            location: [s.lng, s.lat],
            impact_level: 'high',
            category: 'sat_constellations',
            description: `${s.operator ?? ''} · 高度 ${Math.round(s.alt)} km · 速度 ${Math.round(s.velocity)} km/h · 实时星下点`,
          });
        });
        mk = new maplibregl.Marker({ element: el }).setLngLat([s.lng, s.lat]).addTo(map);
        markers.set(s.norad, mk);
      } else {
        mk.setLngLat([s.lng, s.lat]);
      }
    }

    // 清理：不在当前集合的标记移除
    markers.forEach((mk, norad) => {
      if (!seen.has(norad)) {
        mk.remove();
        markers.delete(norad);
      }
    });
  }, [map, itemsKey, inSpace]);

  // 卸载清理全部标记
  useEffect(() => {
    const markers = markersRef.current;
    return () => {
      markers.forEach((mk) => mk.remove());
      markers.clear();
    };
  }, []);

  return (
    <style>{`
      .live-station-marker { position: relative; width: 0; height: 0; }
      .live-station-marker .lsm-dot {
        position: absolute; left: -4px; top: -4px; width: 8px; height: 8px;
        border-radius: 50%; box-shadow: 0 0 6px currentColor;
      }
      .live-station-marker .lsm-pulse {
        position: absolute; left: -9px; top: -9px; width: 18px; height: 18px;
        border-radius: 50%; background: var(--c); opacity: 0.5;
        animation: lsmPulse 1.8s ease-out infinite;
      }
      .live-station-marker .lsm-label {
        position: absolute; left: 10px; top: -10px; white-space: nowrap;
        font-size: 10px; color: #e6edf3; background: rgba(10,14,23,0.8);
        border: 1px solid; border-radius: 4px; padding: 1px 5px; backdrop-filter: blur(4px);
      }
      @keyframes lsmPulse { 0% { transform: scale(0.6); opacity: 0.6 } 100% { transform: scale(2.4); opacity: 0 } }
    `}</style>
  );
}
