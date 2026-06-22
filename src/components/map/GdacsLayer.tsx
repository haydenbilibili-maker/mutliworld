'use client';

/**
 * GDACS 全球灾害告警图层 — 地表层（GDACS，免密钥真实，近实时）。
 * 多灾种点，按告警级（绿/橙/红）着色定径；点击出富详情（告警级/严重度/类型/国家 + 原文）。
 * 静态渲染（零每帧重绘，深度防抖）。真实数据·中立并陈。
 */

import { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import useSWR from 'swr';
import type { FeatureCollection } from 'geojson';
import { useMapContext, useMapStyleEpoch } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { findLiveOverlayBeforeId } from '@/lib/map/basemap';
import { timeAgo } from '@/lib/format/time';
import type { EventDetail, ImpactLevel } from '@/types/geo';

const SOURCE = 'live-gdacs';
const GLOW = 'live-gdacs-glow';
const CORE = 'live-gdacs-core';
const fetcher = (url: string) => fetch(url).then((r) => r.json());

type GdacsProps = { eventtype: string; title: string; alertlevel: string; alertRank: number; alertscore: number | null; country: string; fromdate: string; severity: string; url: string };

const TYPE_META: Record<string, { icon: string; label: string; domains: string[] }> = {
  EQ: { icon: '📳', label: '地震', domains: ['基建', '救灾'] },
  TC: { icon: '🌀', label: '热带气旋', domains: ['航运', '能源', '农业'] },
  FL: { icon: '🌊', label: '洪水', domains: ['农业', '基建', '救灾'] },
  VO: { icon: '🌋', label: '火山', domains: ['航空', '空气质量'] },
  DR: { icon: '🌵', label: '干旱', domains: ['农业', '水资源'] },
  WF: { icon: '🔥', label: '野火', domains: ['空气质量', '应急'] },
};
const typeMeta = (t: string) => TYPE_META[t] ?? { icon: '⚠️', label: '灾害', domains: ['应急'] };
const ALERT_CN: Record<string, string> = { Red: '红色', Orange: '橙色', Green: '绿色' };
const ALERT_COLOR: Record<string, string> = { Red: '#ef4444', Orange: '#f59e0b', Green: '#22c55e' };

const COLOR_EXPR: maplibregl.ExpressionSpecification = ['match', ['get', 'alertlevel'], 'Red', '#ef4444', 'Orange', '#f59e0b', 'Green', '#22c55e', '#94a3b8'];
const RADIUS_EXPR: maplibregl.ExpressionSpecification = ['interpolate', ['linear'], ['get', 'alertRank'], 1, 4, 2, 6.5, 3, 9.5];

export function GdacsLayer() {
  const map = useMapContext();
  const styleEpoch = useMapStyleEpoch();
  const activeTier = useMapStore((s) => s.activeTier);
  const activeLayers = useMapStore((s) => s.activeLayers);
  const selectEvent = useMapStore((s) => s.selectEvent);

  const enabled = activeTier === 'surface' && activeLayers.includes('gdacs');
  const { data } = useSWR<FeatureCollection>(enabled ? '/api/gdacs' : null, fetcher, {
    revalidateOnFocus: false, refreshInterval: 30 * 60 * 1000, dedupingInterval: 5 * 60 * 1000,
  });
  const geojson: FeatureCollection = data?.type === 'FeatureCollection' ? data : { type: 'FeatureCollection', features: [] };

  const selectEventRef = useRef(selectEvent);
  selectEventRef.current = selectEvent;
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const lastKey = useRef('');
  const dataKey = useMemo(() => `${enabled}:${geojson.features.length}`, [enabled, geojson.features.length]);

  useEffect(() => {
    if (!map) return;
    const setup = () => {
      try {
        if (!map.getSource(SOURCE)) map.addSource(SOURCE, { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
        if (!map.getLayer(GLOW)) {
          map.addLayer({ id: GLOW, type: 'circle', source: SOURCE, layout: { visibility: 'none' },
            paint: { 'circle-radius': ['*', RADIUS_EXPR, 2.2], 'circle-color': COLOR_EXPR, 'circle-opacity': 0.18, 'circle-blur': 0.8 } }, findLiveOverlayBeforeId(map));
        }
        if (!map.getLayer(CORE)) {
          map.addLayer({ id: CORE, type: 'circle', source: SOURCE, layout: { visibility: 'none' },
            paint: { 'circle-radius': RADIUS_EXPR, 'circle-color': COLOR_EXPR, 'circle-opacity': 0.95, 'circle-stroke-width': 1, 'circle-stroke-color': 'rgba(255,255,255,0.7)' } }, findLiveOverlayBeforeId(map));
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
      const p = f.properties as unknown as GdacsProps;
      const coords = (f.geometry as unknown as { coordinates: [number, number] }).coordinates;
      const tm = typeMeta(p.eventtype);
      const alertCn = ALERT_CN[p.alertlevel] ?? p.alertlevel;
      const impact: ImpactLevel = p.alertlevel === 'Red' ? 'critical' : p.alertlevel === 'Orange' ? 'high' : 'medium';
      const tISO = p.fromdate && !Number.isNaN(Date.parse(p.fromdate)) ? new Date(p.fromdate).toISOString() : '';
      const rel = tISO ? timeAgo(tISO) : '';
      popupRef.current?.remove();
      const popup = new maplibregl.Popup({ closeButton: true, closeOnClick: true, offset: 10, className: 'geodata-popup' })
        .setLngLat(coords)
        .setHTML(`<div style="font-size:13px;line-height:1.5;min-width:12rem"><div style="font-weight:600;margin-bottom:4px">${tm.icon} ${p.title}</div><div style="font-size:11px;margin-bottom:2px"><span style="color:${ALERT_COLOR[p.alertlevel] ?? '#94a3b8'};font-weight:600">${alertCn}告警</span>${p.country ? ` · ${p.country}` : ''}</div>${p.severity ? `<div style="font-size:11px;color:#94a3b8">${p.severity}</div>` : ''}${rel ? `<div style="font-size:11px;color:#64748b">${rel}</div>` : ''}</div>`)
        .addTo(map);
      const content = popup.getElement()?.querySelector('.maplibregl-popup-content');
      if (content instanceof HTMLElement) {
        content.style.setProperty('background', '#0A0E17', 'important');
        content.style.setProperty('color', '#e6edf3', 'important');
        content.style.setProperty('border', '1px solid rgba(255,255,255,0.12)', 'important');
        content.style.setProperty('border-radius', '8px', 'important');
      }
      popupRef.current = popup;
      const detail: EventDetail = {
        id: `gdacs-${p.eventtype}-${coords[0]},${coords[1]}`,
        title: `${tm.icon} ${p.title}`,
        source: 'GDACS 全球灾害告警协调系统（近实时）',
        timestamp: tISO,
        location: coords,
        impact_level: impact,
        category: 'gdacs',
        description: `${tm.label}灾害告警${p.country ? ` · ${p.country}` : ''}。GDACS 多灾种监测，告警级反映潜在人道影响（联合国/欧盟联合系统，非预测结论）。`,
        metrics: [
          { label: '告警级', value: alertCn, accent: ALERT_COLOR[p.alertlevel] ?? '#94a3b8' },
          { label: '类型', value: tm.label },
          ...(p.alertscore != null ? [{ label: '告警分', value: p.alertscore.toFixed(1) }] : []),
          ...(p.severity ? [{ label: '严重度', value: p.severity }] : []),
        ],
        tags: [tm.label, ...(p.country ? [p.country] : []), '多灾种告警'],
        links: p.url ? [{ label: 'GDACS 事件详情', url: p.url.startsWith('http') ? p.url : `https://www.gdacs.org${p.url}` }] : undefined,
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
