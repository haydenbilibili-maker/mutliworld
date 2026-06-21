'use client';

/**
 * 通用 EONET 事件点层 — 火山/风暴/洪水/沙尘/海冰等共用。
 * 圆点(GLOW+CORE)+点击弹窗(名称/最新时刻)+selectEvent；gate 地表层 + 指定图层。真实数据·中立并陈。
 */

import { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import useSWR from 'swr';
import type { FeatureCollection } from 'geojson';
import { useMapContext, useMapStyleEpoch } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { findLiveOverlayBeforeId } from '@/lib/map/basemap';
import type { EventDetail, LayerId } from '@/types/geo';

export interface EonetLayerConfig {
  layerId: LayerId;
  endpoint: string;
  /** maplibre source/layer 前缀，需全局唯一 */
  srcKey: string;
  glowColor: string;
  coreColor: string;
  strokeColor: string;
  icon: string;
  /** 弹窗内副标题（如「活跃事件」「最新定位」） */
  dateLabel: string;
}

const POPUP_BG = '#0A0E17';
const fetcher = (url: string) => fetch(url).then((r) => r.json());
type EventProps = { title: string; date: string };

function applyPopupTheme(popup: maplibregl.Popup) {
  const content = popup.getElement()?.querySelector('.maplibregl-popup-content');
  if (content instanceof HTMLElement) {
    content.style.setProperty('background', POPUP_BG, 'important');
    content.style.setProperty('color', '#e6edf3', 'important');
    content.style.setProperty('border', '1px solid rgba(255,255,255,0.12)', 'important');
    content.style.setProperty('border-radius', '8px', 'important');
  }
}

export function EonetEventLayer({ config }: { config: EonetLayerConfig }) {
  const { layerId, endpoint, srcKey, glowColor, coreColor, strokeColor, icon, dateLabel } = config;
  const SOURCE = `live-${srcKey}`;
  const GLOW = `live-${srcKey}-glow`;
  const CORE = `live-${srcKey}-core`;

  const map = useMapContext();
  const styleEpoch = useMapStyleEpoch();
  const activeTier = useMapStore((s) => s.activeTier);
  const activeLayers = useMapStore((s) => s.activeLayers);
  const selectEvent = useMapStore((s) => s.selectEvent);

  const enabled = activeTier === 'surface' && activeLayers.includes(layerId);
  const { data } = useSWR<FeatureCollection>(enabled ? endpoint : null, fetcher, {
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
          map.addLayer({ id: GLOW, type: 'circle', source: SOURCE, layout: { visibility: 'none' },
            paint: { 'circle-radius': 12, 'circle-color': glowColor, 'circle-opacity': 0.22, 'circle-blur': 0.85 } }, findLiveOverlayBeforeId(map));
        }
        if (!map.getLayer(CORE)) {
          map.addLayer({ id: CORE, type: 'circle', source: SOURCE, layout: { visibility: 'none' },
            paint: { 'circle-radius': 5, 'circle-color': coreColor, 'circle-opacity': 0.95, 'circle-stroke-width': 1, 'circle-stroke-color': strokeColor } }, findLiveOverlayBeforeId(map));
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
  }, [map, styleEpoch, SOURCE, GLOW, CORE, glowColor, coreColor, strokeColor]);

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
  }, [map, enabled, geojson, dataKey, styleEpoch, SOURCE, GLOW, CORE]);

  useEffect(() => {
    if (!map) return;
    const onClick = (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
      const f = e.features?.[0];
      if (!f?.properties) return;
      const p = f.properties as unknown as EventProps;
      const coords = (f.geometry as { coordinates: [number, number] }).coordinates;
      popupRef.current?.remove();
      const date = p.date ? new Date(p.date).toLocaleString('zh-CN', { hour12: false }) : '';
      const popup = new maplibregl.Popup({ closeButton: true, closeOnClick: true, offset: 10, className: 'geodata-popup' })
        .setLngLat(coords)
        .setHTML(`<div style="font-size:13px;line-height:1.5;min-width:11rem"><div style="font-weight:600;margin-bottom:4px">${icon} ${p.title}</div><div style="font-size:11px;color:#94a3b8">${dateLabel} ${date}</div></div>`)
        .addTo(map);
      applyPopupTheme(popup);
      popupRef.current = popup;
      const detail: EventDetail = {
        id: `${srcKey}-${coords[0]},${coords[1]}`,
        title: `${icon} ${p.title}`,
        source: 'NASA EONET（近实时）',
        timestamp: p.date ? new Date(p.date).toISOString() : new Date().toISOString(),
        location: coords,
        impact_level: 'medium',
        category: layerId,
        description: `${dateLabel} ${date}`,
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
  }, [map, styleEpoch, CORE, srcKey, layerId, icon, dateLabel]);

  useEffect(() => () => { popupRef.current?.remove(); }, []);

  return null;
}
