'use client';

/**
 * 实时地震图层 — 地表层（USGS 地震灾害项目，近实时 M2.5+/24h）。
 * 圆点：按震级着色与定径；点击弹出详情（震级/地点/深度/时刻）。真实数据·中立并陈。
 */

import { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import useSWR from 'swr';
import type { FeatureCollection } from 'geojson';
import { useMapContext, useMapStyleEpoch } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { findLiveOverlayBeforeId } from '@/lib/map/basemap';
import { timeAgo } from '@/lib/format/time';
import type { EventDetail } from '@/types/geo';

const SOURCE = 'live-quakes';
const GLOW = 'live-quakes-glow';
const CORE = 'live-quakes-core';
const POPUP_BG = '#0A0E17';
const fetcher = (url: string) => fetch(url).then((r) => r.json());

type QuakeProps = { mag: number; place: string; depth: number; time: number; tsunami: number };

/** 震级 → 红色系（地震波）：浅红 → 深红 */
const COLOR_EXPR: maplibregl.ExpressionSpecification = [
  'interpolate', ['linear'], ['get', 'mag'],
  2.5, '#fca5a5', 4, '#f87171', 5, '#ef4444', 6.5, '#b91c1c',
];
/** 震级 → 半径（指数感知：每级能量约 32 倍） */
const RADIUS_EXPR: maplibregl.ExpressionSpecification = [
  'interpolate', ['exponential', 1.6], ['get', 'mag'],
  2.5, 3, 4.5, 6, 6, 10, 8, 18,
];

function applyPopupTheme(popup: maplibregl.Popup) {
  const content = popup.getElement()?.querySelector('.maplibregl-popup-content');
  if (content instanceof HTMLElement) {
    content.style.setProperty('background', POPUP_BG, 'important');
    content.style.setProperty('color', '#e6edf3', 'important');
    content.style.setProperty('border', '1px solid rgba(255,255,255,0.12)', 'important');
    content.style.setProperty('border-radius', '8px', 'important');
  }
}

function popupHtml(p: QuakeProps): string {
  const t = new Date(p.time).toLocaleString('zh-CN', { hour12: false });
  const rel = timeAgo(p.time);
  return `
    <div style="font-size:13px;line-height:1.5;min-width:12rem">
      <div style="font-weight:600;margin-bottom:4px">📳 M${p.mag.toFixed(1)} 地震</div>
      <div style="font-size:11px;color:#94a3b8;margin-bottom:6px">${t}${rel ? ` <span style="color:#64748b">· ${rel}</span>` : ''}</div>
      <div>${p.place}</div>
      <div>震源深度：${Math.round(p.depth)} km</div>
      ${p.tsunami ? '<div style="color:#38bdf8;font-weight:600">🌊 可能引发海啸（USGS 标记）</div>' : ''}
    </div>`;
}

export function EarthquakeLayer() {
  const map = useMapContext();
  const styleEpoch = useMapStyleEpoch();
  const activeTier = useMapStore((s) => s.activeTier);
  const activeLayers = useMapStore((s) => s.activeLayers);
  const selectEvent = useMapStore((s) => s.selectEvent);

  const tmActive = useMapStore((s) => s.tmActive);
  const tmPlayhead = useMapStore((s) => s.tmPlayhead);

  const enabled = activeTier === 'surface' && activeLayers.includes('earthquakes');
  const { data } = useSWR<FeatureCollection>(enabled ? '/api/earthquakes' : null, fetcher, {
    revalidateOnFocus: false, refreshInterval: 5 * 60 * 1000, dedupingInterval: 60 * 1000,
  });
  const raw: FeatureCollection = data?.type === 'FeatureCollection' ? data : { type: 'FeatureCollection', features: [] };
  // 时间机器：仅显示发生时刻 ≤ 播放头的地震（按真实时间戳过滤，不预测）
  const geojson: FeatureCollection = useMemo(() => {
    if (!tmActive) return raw;
    return { type: 'FeatureCollection', features: raw.features.filter((f) => {
      const t = (f.properties as { time?: number } | null)?.time;
      return typeof t === 'number' ? t <= tmPlayhead : true;
    }) };
  }, [raw, tmActive, tmPlayhead]);

  const selectEventRef = useRef(selectEvent);
  selectEventRef.current = selectEvent;
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const lastKey = useRef('');
  const dataKey = useMemo(() => `${enabled}:${geojson.features.length}:${tmActive ? tmPlayhead : 0}`, [enabled, geojson.features.length, tmActive, tmPlayhead]);

  useEffect(() => {
    if (!map) return;
    const setup = () => {
      try {
        if (!map.getSource(SOURCE)) map.addSource(SOURCE, { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
        if (!map.getLayer(GLOW)) {
          // 地震波：透明填充 + 红色描边的外扩环（静态，零地图重绘——深度防抖）
          map.addLayer({
            id: GLOW, type: 'circle', source: SOURCE, layout: { visibility: 'none' },
            paint: {
              'circle-radius': ['*', RADIUS_EXPR, 2.4],
              'circle-color': 'rgba(0,0,0,0)',
              'circle-stroke-color': COLOR_EXPR,
              'circle-stroke-width': 1.5,
              'circle-stroke-opacity': 0.5,
              'circle-stroke-opacity-transition': { duration: 0 },
            },
          }, findLiveOverlayBeforeId(map));
        }
        if (!map.getLayer(CORE)) {
          // 震中：红色实心点 + 浅红光晕描边（去除原黑色描边）
          map.addLayer({
            id: CORE, type: 'circle', source: SOURCE, layout: { visibility: 'none' },
            paint: { 'circle-radius': ['*', RADIUS_EXPR, 0.45], 'circle-color': COLOR_EXPR, 'circle-opacity': 0.95, 'circle-stroke-width': 1, 'circle-stroke-color': 'rgba(254,202,202,0.7)' },
          }, findLiveOverlayBeforeId(map));
        }
      } catch { /* 样式未就绪 */ }
    };
    if (map.isStyleLoaded()) setup();
    map.on('style.load', setup);
    return () => {
      map.off('style.load', setup);
      popupRef.current?.remove();
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

  useEffect(() => {
    if (!map) return;
    const onClick = (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
      const f = e.features?.[0];
      if (!f?.properties) return;
      const p = f.properties as unknown as QuakeProps;
      const coords = (f.geometry as unknown as { coordinates: [number, number] }).coordinates;
      popupRef.current?.remove();
      const popup = new maplibregl.Popup({ closeButton: true, closeOnClick: true, offset: 10, className: 'geodata-popup' })
        .setLngLat(coords).setHTML(popupHtml(p)).addTo(map);
      applyPopupTheme(popup);
      popupRef.current = popup;
      const detail: EventDetail = {
        id: `quake-${p.time}-${coords[0]},${coords[1]}`,
        title: `📳 M${p.mag.toFixed(1)} 地震`,
        source: 'USGS 地震灾害项目（近实时）',
        timestamp: new Date(p.time).toISOString(),
        location: coords,
        impact_level: p.mag >= 6 ? 'high' : p.mag >= 4.5 ? 'medium' : 'low',
        category: 'earthquakes',
        description: `${p.place} · 震源深度 ${Math.round(p.depth)} km`,
      };
      selectEventRef.current(detail);
    };
    const onEnter = () => { map.getCanvas().style.cursor = 'pointer'; };
    const onLeave = () => { map.getCanvas().style.cursor = ''; };
    const attach = () => {
      map.on('click', CORE, onClick);
      map.on('mouseenter', CORE, onEnter);
      map.on('mouseleave', CORE, onLeave);
    };
    if (map.isStyleLoaded()) attach();
    map.on('style.load', attach);
    return () => {
      map.off('style.load', attach);
      map.off('click', CORE, onClick);
      map.off('mouseenter', CORE, onEnter);
      map.off('mouseleave', CORE, onLeave);
    };
  }, [map, styleEpoch]);

  useEffect(() => () => { popupRef.current?.remove(); }, []);

  return null;
}
