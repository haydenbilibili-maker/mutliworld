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
import { useMapContext, useMapStyleEpoch } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { useOrbitalObjects, LAYER_TO_ORBITAL_CATEGORY } from '@/hooks/useOrbitalObjects';
import type { LayerId } from '@/types/geo';

const SOURCE = 'orbital-objects';
/** 地表锚点（暗）+ 三段轨道高度的抬升卫星层 + 碎片层 */
const LAYER_SAT_ANCHOR = 'orbital-sats-anchor';
const LAYER_SAT_LEO = 'orbital-sats-leo';
const LAYER_SAT_MEO = 'orbital-sats-meo';
const LAYER_SAT_GEO = 'orbital-sats-geo';
const LAYER_DEBRIS = 'orbital-debris-dot';
const SAT_BAND_LAYERS = [LAYER_SAT_LEO, LAYER_SAT_MEO, LAYER_SAT_GEO] as const;
const ALL_ORBITAL_LAYERS = [LAYER_SAT_ANCHOR, ...SAT_BAND_LAYERS, LAYER_DEBRIS] as const;

/** 屏幕向上抬升像素（漂浮高度）：按轨道高度分段 */
const MEO_FLOOR_KM = 2000;
const GEO_FLOOR_KM = 20000;
function liftPx(altKm: number): number {
  if (altKm < MEO_FLOOR_KM) return 18;
  if (altKm < GEO_FLOOR_KM) return 38;
  return 66;
}

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
  const styleEpoch = useMapStyleEpoch();
  const inSpace = useMapStore((s) => s.activeTier === 'space');
  const activeLayers = useMapStore((s) => s.activeLayers);
  const selectEvent = useMapStore((s) => s.selectEvent);
  const setViewport = useMapStore((s) => s.setViewport);

  const selectEventRef = useRef(selectEvent);
  const setViewportRef = useRef(setViewport);
  selectEventRef.current = selectEvent;
  setViewportRef.current = setViewport;

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

        // 地表锚点：暗淡小点 + 连向漂浮卫星的"系绳"由抬升的明亮点与锚点之间的视觉间距体现
        if (!map.getLayer(LAYER_SAT_ANCHOR)) {
          map.addLayer({
            id: LAYER_SAT_ANCHOR,
            type: 'circle',
            source: SOURCE,
            filter: ['==', ['get', 'category'], 'satellite'],
            layout: { visibility: 'none' },
            paint: {
              'circle-radius': 1.6,
              'circle-color': '#38bdf8',
              'circle-opacity': 0.35,
              'circle-stroke-width': 0,
            },
          });
        }

        // 三段轨道高度：用 circle-translate（viewport 锚，屏幕向上）把卫星抬离地表，漂浮在宇宙空间
        const band = (
          id: string,
          altFilter: maplibregl.FilterSpecification,
          lift: number,
          radius: number,
        ) => {
          if (map.getLayer(id)) return;
          map.addLayer({
            id,
            type: 'circle',
            source: SOURCE,
            filter: ['all', ['==', ['get', 'category'], 'satellite'], altFilter] as maplibregl.FilterSpecification,
            layout: { visibility: 'none' },
            paint: {
              'circle-radius': radius,
              'circle-color': '#bae6fd',
              'circle-opacity': 0.95,
              'circle-blur': 0.25,
              'circle-stroke-width': 1,
              'circle-stroke-color': '#0ea5e9',
              'circle-translate': [0, -lift],
              'circle-translate-anchor': 'viewport',
            },
          });
        };
        band(LAYER_SAT_LEO, ['<', ['get', 'alt_km'], MEO_FLOOR_KM], 18, 3.2);
        band(
          LAYER_SAT_MEO,
          ['all', ['>=', ['get', 'alt_km'], MEO_FLOOR_KM], ['<', ['get', 'alt_km'], GEO_FLOOR_KM]],
          38,
          3.8,
        );
        band(LAYER_SAT_GEO, ['>=', ['get', 'alt_km'], GEO_FLOOR_KM], 66, 4.6);

        if (!map.getLayer(LAYER_DEBRIS)) {
          map.addLayer({
            id: LAYER_DEBRIS,
            type: 'circle',
            source: SOURCE,
            filter: ['==', ['get', 'category'], 'debris'],
            layout: { visibility: 'none' },
            paint: {
              'circle-radius': 1.6,
              'circle-color': '#c4b5fd',
              'circle-opacity': 0.55,
              'circle-stroke-width': 0,
              'circle-translate': [0, -10],
              'circle-translate-anchor': 'viewport',
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
        for (const id of [...ALL_ORBITAL_LAYERS]) {
          if (map.getLayer(id)) map.removeLayer(id);
        }
        if (map.getSource(SOURCE)) map.removeSource(SOURCE);
      } catch {
        /* */
      }
    };
  }, [map, styleEpoch]);

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
        for (const id of [...ALL_ORBITAL_LAYERS]) {
          if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', vis);
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
  }, [map, combinedKey, filtered, inSpace, orbitalLayersOn, styleEpoch]);

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

      const lift = liftPx(s.alt_km);
      if (!mk) {
        const el = document.createElement('div');
        el.className = 'live-station-marker';
        // 系绳：从漂浮的空间站向下连到地表星下点，凸显"漂浮在宇宙空间"
        el.innerHTML = `
          <span class="lsm-tether" style="height:${lift}px"></span>
          <span class="lsm-pulse" style="--c:${color}"></span>
          <span class="lsm-dot" style="background:${color}"></span>
          <span class="lsm-label" style="border-color:${color}66">🛰 ${shortLabel}</span>
        `;
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => {
          // 锁定：飞向空间站星下点并出详情卡
          setViewportRef.current([lng, lat], Math.max(map.getZoom(), 3.2));
          selectEventRef.current({
            id: `orbital-${s.noradId}`,
            title: s.name,
            source: 'TLE/SGP4（近实时）',
            timestamp: new Date().toISOString(),
            location: [lng, lat],
            impact_level: 'high',
            category: 'space_stations',
            description: `${s.operator ? s.operator + ' 运营。' : ''}TLE/SGP4 近实时定轨的在轨空间站。`,
            metrics: [
              { label: '轨道高度', value: `${Math.round(s.alt_km)}`, hint: 'km', accent: '#38bdf8' },
              { label: '速度', value: `${Math.round(s.velocity_kmh).toLocaleString()}`, hint: 'km/h', accent: '#7dd3fc' },
              { label: 'NORAD', value: `${s.noradId}` },
            ],
            tags: [s.operator, '空间站', '在轨'].filter(Boolean) as string[],
          });
        });
        // offset 向上抬升，使空间站漂浮在星下点上方
        mk = new maplibregl.Marker({ element: el, offset: [0, -lift] }).setLngLat([lng, lat]).addTo(map);
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
      // 锁定：飞向卫星星下点并出详情卡（类似地表概述卡片）
      setViewportRef.current([coords[0], coords[1]], Math.max(map.getZoom(), 3.2));
      selectEventRef.current({
        id: `orbital-${p.noradId}`,
        title: p.name,
        source: 'TLE/SGP4（近实时）',
        timestamp: new Date().toISOString(),
        location: [coords[0], coords[1]],
        impact_level: p.category === 'debris' ? 'medium' : 'low',
        category: layerId,
        description: `${p.operator ? p.operator + ' 运营。' : ''}${p.category === 'debris' ? '在轨空间碎片' : '在轨卫星'}，TLE/SGP4 近实时定轨。`,
        metrics: [
          { label: '轨道高度', value: `${Math.round(p.alt_km)}`, hint: 'km', accent: '#38bdf8' },
          { label: '速度', value: `${Math.round(p.velocity_kmh).toLocaleString()}`, hint: 'km/h', accent: '#7dd3fc' },
          { label: 'NORAD', value: `${p.noradId}` },
        ],
        tags: [p.operator, p.category === 'debris' ? '空间碎片' : '卫星', '在轨'].filter(Boolean) as string[],
      });
    };

    const layers = [...SAT_BAND_LAYERS, LAYER_DEBRIS];
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
    map.on('style.load', attach);
    return () => {
      map.off('style.load', attach);
      detach();
    };
  }, [map, styleEpoch]);

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
      .live-station-marker .lsm-tether {
        position: absolute; left: -0.5px; top: 0; width: 1px;
        background: linear-gradient(to bottom, rgba(125,211,252,0.7), rgba(125,211,252,0));
        pointer-events: none;
      }
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
