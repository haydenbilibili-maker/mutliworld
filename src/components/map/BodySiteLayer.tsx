'use client';

/**
 * 天体探索痕迹图层 — 多天体探索 Phase 1
 * 月球/火星着陆点与巡视器以机构配色圆点标记 + 名称标签；点击弹出真实档案信息卡。
 * 门控于 activeBody !== 'earth' 且对应探索图层开启。
 */

import { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import type { FeatureCollection } from 'geojson';
import { useMapContext, useMapStyleEpoch } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { useBodyStore } from '@/store/useBodyStore';
import { getSitesForBody, BODY_LAYER_META } from '@/bodies/sites';
import type { BodyLayerId } from '@/types/body';

const SOURCE = 'body-sites';
const GLOW = 'body-sites-glow';
const CORE = 'body-sites-core';
const LABEL = 'body-sites-label';
const POPUP_BG = '#0A0E17';

const COLOR_BY_LAYER: Record<BodyLayerId, string> = Object.fromEntries(
  BODY_LAYER_META.map((m) => [m.id, m.color]),
) as Record<BodyLayerId, string>;

const COLOR_EXPR: maplibregl.ExpressionSpecification = [
  'match',
  ['get', 'layer'],
  'moon_apollo', COLOR_BY_LAYER.moon_apollo,
  'moon_change', COLOR_BY_LAYER.moon_change,
  'moon_legacy', COLOR_BY_LAYER.moon_legacy,
  'mars_rovers', COLOR_BY_LAYER.mars_rovers,
  'mars_landers', COLOR_BY_LAYER.mars_landers,
  '#cbd5e1',
];

const STATUS_LABEL: Record<string, string> = { active: '在役', completed: '已完成', lost: '失联' };

type SiteProps = {
  name: string;
  nameEn: string;
  agency: string;
  date: string;
  status: string;
  summary: string;
  sourceUrl: string;
  lat: number;
  lng: number;
};

function applyPopupTheme(popup: maplibregl.Popup) {
  const content = popup.getElement()?.querySelector('.maplibregl-popup-content');
  if (content instanceof HTMLElement) {
    content.style.setProperty('background', POPUP_BG, 'important');
    content.style.setProperty('color', '#e6edf3', 'important');
    content.style.setProperty('border', '1px solid rgba(232,181,99,0.25)', 'important');
    content.style.setProperty('border-radius', '8px', 'important');
  }
}

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => (c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : '&quot;'));
}

function popupHtml(p: SiteProps): string {
  const src = p.sourceUrl
    ? `<a href="${esc(p.sourceUrl)}" target="_blank" rel="noopener noreferrer" style="color:#3FC8E0">来源 ↗</a>`
    : '';
  const coord = `${Math.abs(p.lat).toFixed(2)}°${p.lat >= 0 ? 'N' : 'S'}, ${Math.abs(p.lng).toFixed(2)}°${p.lng >= 0 ? 'E' : 'W'}`;
  return `
    <div style="font-size:13px;line-height:1.5;min-width:12rem;max-width:16rem">
      <div style="font-weight:600;margin-bottom:2px">${esc(p.name)}</div>
      <div style="font-size:11px;color:#94a3b8;margin-bottom:6px">${esc(p.nameEn)} · ${esc(p.agency)} · ${esc(p.date)} · ${STATUS_LABEL[p.status] ?? p.status}</div>
      <div style="font-size:11px;color:#cbd5e1;margin-bottom:6px">${esc(p.summary)}</div>
      <div style="font-size:10px;color:#94a3b8">选源坐标 ${coord} ${src}</div>
    </div>`;
}

export function BodySiteLayer() {
  const map = useMapContext();
  const styleEpoch = useMapStyleEpoch();
  const activeBody = useMapStore((s) => s.activeBody);
  const activeBodyLayers = useBodyStore((s) => s.activeBodyLayers);

  const enabled = activeBody !== 'earth';

  const geojson = useMemo<FeatureCollection>(() => {
    if (!enabled) return { type: 'FeatureCollection', features: [] };
    const sites = getSitesForBody(activeBody).filter((s) => activeBodyLayers.includes(s.layer));
    return {
      type: 'FeatureCollection',
      features: sites.map((s) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [s.lng, s.lat] },
        properties: {
          name: s.name,
          nameEn: s.nameEn ?? '',
          agency: s.agency,
          date: s.date,
          status: s.status,
          summary: s.summary,
          sourceUrl: s.sourceUrl ?? '',
          layer: s.layer,
          lat: s.lat,
          lng: s.lng,
        },
      })),
    };
  }, [enabled, activeBody, activeBodyLayers]);

  const popupRef = useRef<maplibregl.Popup | null>(null);
  const lastKeyRef = useRef('');
  const dataKey = useMemo(() => `${activeBody}:${geojson.features.length}`, [activeBody, geojson]);

  useEffect(() => {
    if (!map) return;
    const setup = () => {
      try {
        if (!map.getSource(SOURCE)) {
          map.addSource(SOURCE, { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
        }
        if (!map.getLayer(GLOW)) {
          map.addLayer({ id: GLOW, type: 'circle', source: SOURCE, layout: { visibility: 'none' }, paint: { 'circle-radius': 12, 'circle-color': COLOR_EXPR, 'circle-opacity': 0.2, 'circle-blur': 0.6 } });
        }
        if (!map.getLayer(CORE)) {
          map.addLayer({ id: CORE, type: 'circle', source: SOURCE, layout: { visibility: 'none' }, paint: { 'circle-radius': 5.5, 'circle-color': COLOR_EXPR, 'circle-opacity': 0.95, 'circle-stroke-width': 1.2, 'circle-stroke-color': '#0A0E17' } });
        }
        if (!map.getLayer(LABEL)) {
          map.addLayer({ id: LABEL, type: 'symbol', source: SOURCE, layout: { visibility: 'none', 'text-field': ['get', 'name'], 'text-size': 10, 'text-offset': [0, 1.2], 'text-anchor': 'top', 'text-optional': true, 'text-allow-overlap': false }, paint: { 'text-color': '#e6edf3', 'text-halo-color': '#0A0E17', 'text-halo-width': 1.2 } });
        }
      } catch {
        /* 样式未就绪 */
      }
    };
    if (map.isStyleLoaded()) setup();
    map.on('style.load', setup);
    return () => {
      map.off('style.load', setup);
      popupRef.current?.remove();
      try {
        if (map.getLayer(LABEL)) map.removeLayer(LABEL);
        if (map.getLayer(CORE)) map.removeLayer(CORE);
        if (map.getLayer(GLOW)) map.removeLayer(GLOW);
        if (map.getSource(SOURCE)) map.removeSource(SOURCE);
      } catch {
        /* */
      }
    };
  }, [map, styleEpoch]);

  useEffect(() => {
    lastKeyRef.current = '';
  }, [styleEpoch]);

  useEffect(() => {
    if (!map) return;
    const apply = () => {
      try {
        const src = map.getSource(SOURCE) as maplibregl.GeoJSONSource | undefined;
        if (!src || !map.getLayer(CORE)) return;
        if (dataKey !== lastKeyRef.current) {
          src.setData(geojson);
          lastKeyRef.current = dataKey;
        }
        const vis = enabled ? 'visible' : 'none';
        map.setLayoutProperty(CORE, 'visibility', vis);
        map.setLayoutProperty(GLOW, 'visibility', vis);
        map.setLayoutProperty(LABEL, 'visibility', vis);
      } catch {
        /* */
      }
    };
    if (map.isStyleLoaded()) apply();
    map.on('style.load', apply);
    return () => {
      map.off('style.load', apply);
    };
  }, [map, enabled, geojson, dataKey, styleEpoch]);

  useEffect(() => {
    if (!map) return;
    const onClick = (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
      const f = e.features?.[0];
      if (!f?.properties) return;
      const p = f.properties as unknown as SiteProps;
      const coords = (f.geometry as unknown as { coordinates: [number, number] }).coordinates;
      popupRef.current?.remove();
      const popup = new maplibregl.Popup({ closeButton: true, closeOnClick: true, offset: 10, className: 'geodata-popup' })
        .setLngLat(coords)
        .setHTML(popupHtml(p))
        .addTo(map);
      applyPopupTheme(popup);
      popupRef.current = popup;
    };
    const attach = () => {
      map.on('click', CORE, onClick);
      map.on('mouseenter', CORE, () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', CORE, () => { map.getCanvas().style.cursor = ''; });
    };
    if (map.isStyleLoaded()) attach();
    map.on('style.load', attach);
    return () => {
      map.off('style.load', attach);
      map.off('click', CORE, onClick);
    };
  }, [map, styleEpoch]);

  useEffect(() => () => { popupRef.current?.remove(); }, []);

  return null;
}
