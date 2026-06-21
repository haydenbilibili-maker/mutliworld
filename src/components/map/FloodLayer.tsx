'use client';

/**
 * 洪水事件图层 — 地表层（NASA EONET，近实时）。蓝色圆点 + 点击弹出名称/最新时刻。真实数据·中立并陈。
 */

import { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import useSWR from 'swr';
import type { FeatureCollection } from 'geojson';
import { useMapContext, useMapStyleEpoch } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { findLiveOverlayBeforeId } from '@/lib/map/basemap';
import type { EventDetail } from '@/types/geo';

const SOURCE = 'live-floods';
const GLOW = 'live-floods-glow';
const CORE = 'live-floods-core';
const POPUP_BG = '#0A0E17';
const fetcher = (url: string) => fetch(url).then((r) => r.json());

type FloodProps = { title: string; date: string };

function applyPopupTheme(popup: maplibregl.Popup) {
  const content = popup.getElement()?.querySelector('.maplibregl-popup-content');
  if (content instanceof HTMLElement) {
    content.style.setProperty('background', POPUP_BG, 'important');
    content.style.setProperty('color', '#e6edf3', 'important');
    content.style.setProperty('border', '1px solid rgba(255,255,255,0.12)', 'important');
    content.style.setProperty('border-radius', '8px', 'important');
  }
}

export function FloodLayer() {
  const map = useMapContext();
  const styleEpoch = useMapStyleEpoch();
  const activeTier = useMapStore((s) => s.activeTier);
  const activeLayers = useMapStore((s) => s.activeLayers);
  const selectEvent = useMapStore((s) => s.selectEvent);

  const enabled = activeTier === 'surface' && activeLayers.includes('floods');
  const { data } = useSWR<FeatureCollection>(enabled ? '/api/floods' : null, fetcher, {
    revalidateOnFocus: false, refreshInterval: 30 * 60 * 1000, dedupingInterval: 5 * 60 * 1000,
  });
  const geojson: FeatureCollection = data?.type === 'FeatureCollection' ? data : { type: 'FeatureCollection', features: [] };

  const selectEventRef = useRef(selectEvent);
  selectEventRef.current = selectEvent;
  const popupRef = useRef<maplibregl.Popup | null>(null);
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
            paint: { 'circle-radius': 11, 'circle-color': '#3b82f6', 'circle-opacity': 0.22, 'circle-blur': 0.85 },
          }, findLiveOverlayBeforeId(map));
        }
        if (!map.getLayer(CORE)) {
          map.addLayer({
            id: CORE, type: 'circle', source: SOURCE, layout: { visibility: 'none' },
            paint: { 'circle-radius': 5, 'circle-color': '#2563eb', 'circle-opacity': 0.95, 'circle-stroke-width': 1, 'circle-stroke-color': '#bfdbfe' },
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
      const p = f.properties as unknown as FloodProps;
      const coords = (f.geometry as { coordinates: [number, number] }).coordinates;
      popupRef.current?.remove();
      const date = p.date ? new Date(p.date).toLocaleString('zh-CN', { hour12: false }) : '';
      const popup = new maplibregl.Popup({ closeButton: true, closeOnClick: true, offset: 10, className: 'geodata-popup' })
        .setLngLat(coords)
        .setHTML(`<div style="font-size:13px;line-height:1.5;min-width:11rem"><div style="font-weight:600;margin-bottom:4px">🌊 ${p.title}</div><div style="font-size:11px;color:#94a3b8">最新定位 ${date}</div></div>`)
        .addTo(map);
      applyPopupTheme(popup);
      popupRef.current = popup;
      const detail: EventDetail = {
        id: `flood-${coords[0]},${coords[1]}`,
        title: `🌊 ${p.title}`,
        source: 'NASA EONET（近实时）',
        timestamp: p.date ? new Date(p.date).toISOString() : new Date().toISOString(),
        location: coords,
        impact_level: 'medium',
        category: 'floods',
        description: `洪水事件 · 最新定位 ${date}`,
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
