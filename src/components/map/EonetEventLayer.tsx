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
import { useEventIndexStore } from '@/store/useEventIndexStore';
import { findLiveOverlayBeforeId } from '@/lib/map/basemap';
import { timeAgo } from '@/lib/format/time';
import type { EventDetail, ImpactLevel, LayerId } from '@/types/geo';

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
  /** 详情页影响等级（默认 medium） */
  impact?: ImpactLevel;
  /** 关注领域标签（按类型确定性推断，非预测） */
  domains?: string[];
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
  const { layerId, endpoint, srcKey, glowColor, coreColor, strokeColor, icon, dateLabel, impact = 'medium', domains } = config;
  const domainsKey = domains?.join(',') ?? '';
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
  const hoverRef = useRef<maplibregl.Popup | null>(null);
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
      const coords = (f.geometry as unknown as { coordinates: [number, number] }).coordinates;
      popupRef.current?.remove();
      hoverRef.current?.remove();
      const date = p.date ? new Date(p.date).toLocaleString('zh-CN', { hour12: false }) : '';
      const rel = p.date ? timeAgo(p.date) : '';
      const dateLine = date
        ? `${dateLabel} ${date}${rel ? ` <span style="color:#64748b">· ${rel}</span>` : ''}`
        : '';
      const popup = new maplibregl.Popup({ closeButton: true, closeOnClick: true, offset: 10, className: 'geodata-popup' })
        .setLngLat(coords)
        .setHTML(`<div style="font-size:13px;line-height:1.5;min-width:11rem"><div style="font-weight:600;margin-bottom:4px">${icon} ${p.title}</div>${dateLine ? `<div style="font-size:11px;color:#94a3b8">${dateLine}</div>` : ''}</div>`)
        .addTo(map);
      applyPopupTheme(popup);
      popupRef.current = popup;
      const detail: EventDetail = {
        id: `${srcKey}-${coords[0]},${coords[1]}`,
        title: `${icon} ${p.title}`,
        source: 'NASA EONET（近实时）',
        // 缺 date 时不伪造当前时刻（避免污染详情面板时间），用空串由面板回落到「—」
        timestamp: p.date ? new Date(p.date).toISOString() : '',
        location: coords,
        impact_level: impact,
        category: layerId,
        description: `${p.title}。NASA EONET 近实时事件，${date ? `${dateLabel} ${date}${rel ? `（${rel}）` : ''}。` : `${dateLabel}。`}`,
        metrics: [
          { label: '状态', value: '活跃', accent: coreColor },
          { label: dateLabel, value: rel || (date ? date : '—') },
        ],
        tags: domains,
      };
      selectEventRef.current(detail);
    };
    // 悬停预览：跟随光标的轻量卡（标题 + 最新定位相对龄期），点击再开完整浮窗+详情
    const onMove = (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
      map.getCanvas().style.cursor = 'pointer';
      const f = e.features?.[0];
      if (!f?.properties) return;
      const p = f.properties as unknown as EventProps;
      const coords = (f.geometry as unknown as { coordinates: [number, number] }).coordinates;
      const rel = p.date ? timeAgo(p.date) : '';
      const html = `<div style="font-size:12px;line-height:1.4;max-width:13rem"><div style="font-weight:600">${icon} ${p.title}</div>${rel ? `<div style="font-size:10px;color:#94a3b8;margin-top:2px">${dateLabel} · ${rel}</div>` : ''}</div>`;
      if (!hoverRef.current) {
        hoverRef.current = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 12, className: 'geodata-popup' });
      }
      hoverRef.current.setLngLat(coords).setHTML(html).addTo(map);
      applyPopupTheme(hoverRef.current);
    };
    const onLeave = () => { map.getCanvas().style.cursor = ''; hoverRef.current?.remove(); };
    const attach = () => {
      map.on('click', CORE, onClick);
      map.on('mousemove', CORE, onMove);
      map.on('mouseleave', CORE, onLeave);
    };
    if (map.isStyleLoaded()) attach();
    map.on('style.load', attach);
    return () => {
      map.off('style.load', attach);
      map.off('click', CORE, onClick);
      map.off('mousemove', CORE, onMove);
      map.off('mouseleave', CORE, onLeave);
      hoverRef.current?.remove();
    };
  }, [map, styleEpoch, CORE, srcKey, layerId, icon, dateLabel, impact, domainsKey, coreColor]);

  // 登记到事件空间索引（供详情页「邻近同类」）
  useEffect(() => {
    const items = enabled
      ? geojson.features.flatMap((f) => {
          const c = (f.geometry as { type?: string; coordinates?: number[] })?.coordinates;
          if (!Array.isArray(c) || c.length < 2) return [];
          const p = (f.properties ?? {}) as { title?: string };
          return [{ id: `${srcKey}-${c[0]},${c[1]}`, title: String(p.title ?? '事件'), category: layerId, lng: c[0], lat: c[1], impact }];
        })
      : [];
    useEventIndexStore.getState().setCategory(layerId, items);
  }, [enabled, geojson, layerId, srcKey, impact]);

  useEffect(() => () => { popupRef.current?.remove(); hoverRef.current?.remove(); }, []);

  return null;
}
