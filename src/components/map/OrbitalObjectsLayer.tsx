'use client';

/**
 * 轨道物体图层 — 宇宙空间层（TLE + SGP4 星下点）
 *
 * 三层：空间站（DOM 脉冲高亮）、在轨卫星、空间碎片（圆点，按高度缩放）
 * 仅在 🛰 宇宙层且对应图层开启时显示。
 */

import { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import type { Feature, FeatureCollection } from 'geojson';
import { useMapContext } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { useOrbitalObjects, LAYER_TO_ORBITAL_CATEGORY } from '@/hooks/useOrbitalObjects';
import type { LayerId } from '@/types/geo';

const SOURCE = 'orbital-objects';
const LAYER_SAT = 'orbital-sats-dot';
const LAYER_DEBRIS = 'orbital-debris-dot';
const LAYER_SAT_GLOW = 'orbital-sats-glow';

const ORBITAL_LAYERS: LayerId[] = ['space_stations', 'satellites', 'space_debris'];

type OrbitalProps = {
  id: string;
  noradId: number;
  name: string;
  category: string;
  alt_km: number;
  velocity_kmh: number;
  highlight?: boolean;
  operator?: string | null;
};

type StationMarker = { props: OrbitalProps; lng: number; lat: number };

function layerCategoryActive(activeLayers: LayerId[], category: string): boolean {
  for (const [layerId, cat] of Object.entries(LAYER_TO_ORBITAL_CATEGORY)) {
    if (cat === category && activeLayers.includes(layerId as LayerId)) return true;
  }
  return false;
}

function filterFeatures(
  fc: FeatureCollection,
  activeLayers: LayerId[],
): { sats: FeatureCollection; debris: FeatureCollection; stations: StationMarker[] } {
  const sats: Feature[] = [];
  const debris: Feature[] = [];
  const stations: StationMarker[] = [];

  const showSat = layerCategoryActive(activeLayers, 'satellite');
  const showDebris = layerCategoryActive(activeLayers, 'debris');
  const showStation = layerCategoryActive(activeLayers, 'station');

  for (const f of fc.features) {
    const p = f.properties as OrbitalProps | null;
    if (!p || f.geometry?.type !== 'Point') continue;
    const [lng, lat] = f.geometry.coordinates;
    if (p.category === 'station' && showStation) {
      stations.push({ props: p, lng, lat });
    } else if (p.category === 'satellite' && showSat) {
      sats.push(f);
    } else if (p.category === 'debris' && showDebris) {
      debris.push(f);
    }
  }

  return {
    sats: { type: 'FeatureCollection', features: sats },
    debris: { type: 'FeatureCollection', features: debris },
    stations,
  };
}

export function OrbitalObjectsLayer() {
  const map = useMapContext();
  const inSpace = useMapStore((s) => s.activeTier === 'space');
  const activeLayers = useMapStore((s) => s.activeLayers);
  const selectEvent = useMapStore((s) => s.selectEvent);
  const setCenter = useMapStore((s) => s.setCenter);

  const selectEventRef = useRef(selectEvent);
  const setCenterRef = useRef(setCenter);
  selectEventRef.current = selectEvent;
  setCenterRef.current = setCenter;

  const orbitalLayersOn = ORBITAL_LAYERS.some((id) => activeLayers.includes(id));
  const { geojson } = useOrbitalObjects(inSpace && orbitalLayersOn);

  const filtered = useMemo(
    () => filterFeatures(geojson, activeLayers),
    [geojson, activeLayers],
  );

  const markersRef = useRef<Map<number, maplibregl.Marker>>(new Map());
  const lastCombinedRef = useRef<string>('');

  const stationsKey = useMemo(
    () =>
      filtered.stations
        .map((s) => `${s.props.noradId}:${s.lng.toFixed(3)},${s.lat.toFixed(3)}`)
        .join('|'),
    [geojson, activeLayers],
  );

  // 初始化圆点图层
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
        if (!map.getLayer(LAYER_SAT_GLOW)) {
          map.addLayer({
            id: LAYER_SAT_GLOW,
            type: 'circle',
            source: SOURCE,
            filter: ['==', ['get', 'category'], 'satellite'],
            layout: { visibility: 'none' },
            paint: {
              'circle-radius': ['interpolate', ['linear'], ['get', 'alt_km'], 200, 5, 2000, 7, 36000, 10],
              'circle-color': '#38bdf8',
              'circle-opacity': 0.15,
              'circle-blur': 0.7,
            },
          });
        }
        if (!map.getLayer(LAYER_SAT)) {
          map.addLayer({
            id: LAYER_SAT,
            type: 'circle',
            source: SOURCE,
            filter: ['==', ['get', 'category'], 'satellite'],
            layout: { visibility: 'none' },
            paint: {
              'circle-radius': ['interpolate', ['linear'], ['get', 'alt_km'], 200, 2.5, 2000, 3.5, 36000, 5],
              'circle-color': '#7dd3fc',
              'circle-stroke-width': 1,
              'circle-stroke-color': '#0A0E17',
            },
          });
        }
        if (!map.getLayer(LAYER_DEBRIS)) {
          map.addLayer({
            id: LAYER_DEBRIS,
            type: 'circle',
            source: SOURCE,
            filter: ['==', ['get', 'category'], 'debris'],
            layout: { visibility: 'none' },
            paint: {
              'circle-radius': 1.8,
              'circle-color': '#c4b5fd',
              'circle-opacity': 0.65,
              'circle-stroke-width': 0,
            },
          });
        }
      } catch {
        /* 样式未就绪 */
      }
    };

    if (map.isStyleLoaded()) setup();
    else map.once('load', setup);

    return () => {
      try {
        for (const id of [LAYER_DEBRIS, LAYER_SAT, LAYER_SAT_GLOW]) {
          if (map.getLayer(id)) map.removeLayer(id);
        }
        if (map.getSource(SOURCE)) map.removeSource(SOURCE);
      } catch {
        /* */
      }
    };
  }, [map]);

  const combinedKey = useMemo(
    () =>
      `${inSpace && orbitalLayersOn}:${filtered.sats.features.length}:${filtered.debris.features.length}:${filtered.sats.features.map((f) => f.properties?.noradId).join(',')}:${filtered.debris.features.map((f) => f.properties?.noradId).join(',')}`,
    [filtered, inSpace, orbitalLayersOn],
  );

  // 更新圆点数据与显隐
  useEffect(() => {
    if (!map) return;
    const visible = inSpace && orbitalLayersOn;
    const combined: FeatureCollection = {
      type: 'FeatureCollection',
      features: [...filtered.sats.features, ...filtered.debris.features],
    };

    const apply = () => {
      try {
        const src = map.getSource(SOURCE) as maplibregl.GeoJSONSource | undefined;
        if (src && combinedKey !== lastCombinedRef.current) {
          src.setData(combined);
          lastCombinedRef.current = combinedKey;
        }
        const vis = visible ? 'visible' : 'none';
        for (const id of [LAYER_SAT, LAYER_SAT_GLOW, LAYER_DEBRIS]) {
          if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', vis);
        }
      } catch {
        /* */
      }
    };

    if (map.isStyleLoaded()) apply();
    else map.once('load', apply);
  }, [map, combinedKey, filtered, inSpace, orbitalLayersOn]);

  // 空间站 DOM 标记
  useEffect(() => {
    if (!map) return;
    const markers = markersRef.current;
    const showStation = inSpace && activeLayers.includes('space_stations');
    const stations = showStation ? filtered.stations : [];
    const seen = new Set<number>();

    for (const { props: s, lng, lat } of stations) {
      seen.add(s.noradId);
      let mk = markers.get(s.noradId);
      const isISS = s.noradId === 25544;
      const color = isISS ? '#22d3ee' : '#fb7185';
      const shortLabel = isISS ? 'ISS' : s.noradId === 48274 ? '天宫' : s.name.slice(0, 8);

      if (!mk) {
        const el = document.createElement('div');
        el.className = 'live-station-marker';
        el.innerHTML = `
          <span class="lsm-pulse" style="--c:${color}"></span>
          <span class="lsm-dot" style="background:${color}"></span>
          <span class="lsm-label" style="border-color:${color}66">🏠 ${shortLabel}</span>
        `;
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => {
          setCenterRef.current([lng, lat]);
          selectEventRef.current({
            id: `orbital-${s.noradId}`,
            title: s.name,
            source: 'TLE/SGP4（近实时）',
            timestamp: new Date().toISOString(),
            location: [lng, lat],
            impact_level: 'high',
            category: 'space_stations',
            description: `${s.operator ?? ''} · 高度 ${Math.round(s.alt_km)} km · 速度 ${Math.round(s.velocity_kmh).toLocaleString()} km/h · NORAD ${s.noradId}`,
          });
        });
        mk = new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map);
        markers.set(s.noradId, mk);
      } else {
        mk.setLngLat([lng, lat]);
      }
    }

    markers.forEach((mk, norad) => {
      if (!seen.has(norad)) {
        mk.remove();
        markers.delete(norad);
      }
    });
  }, [map, stationsKey, inSpace, activeLayers]);

  // 卫星/碎片点击
  useEffect(() => {
    if (!map) return;

    const onClick = (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
      const f = e.features?.[0];
      if (!f?.properties) return;
      const p = f.properties as unknown as OrbitalProps;
      const coords = (f.geometry as { type: string; coordinates: [number, number] }).coordinates;
      const layerId: LayerId = p.category === 'debris' ? 'space_debris' : 'satellites';
      selectEventRef.current({
        id: `orbital-${p.noradId}`,
        title: p.name,
        source: 'TLE/SGP4（近实时）',
        timestamp: new Date().toISOString(),
        location: [coords[0], coords[1]],
        impact_level: p.category === 'debris' ? 'medium' : 'low',
        category: layerId,
        description: `高度 ${p.alt_km} km · 速度 ${p.velocity_kmh.toLocaleString()} km/h · NORAD ${p.noradId}`,
      });
    };

    const layers = [LAYER_SAT, LAYER_DEBRIS];
    const attach = () => {
      for (const id of layers) {
        map.on('click', id, onClick);
        map.on('mouseenter', id, () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', id, () => { map.getCanvas().style.cursor = ''; });
      }
    };
    const detach = () => {
      for (const id of layers) {
        map.off('click', id, onClick);
      }
    };

    if (map.isStyleLoaded()) attach();
    else map.once('load', attach);
    return detach;
  }, [map]);

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
