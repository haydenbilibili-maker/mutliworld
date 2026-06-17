'use client';

/**
 * 天体地貌要素图层 — 多天体探索信息增密（第 2 轮）
 * 月海/撞击坑/火山/峡谷等以青色环标记 + 名称；点击弹出地貌百科。门控于天体 + *_features 开启。
 */

import { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import type { FeatureCollection } from 'geojson';
import { useMapContext, useMapStyleEpoch } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { useBodyStore } from '@/store/useBodyStore';
import { getFeaturesForBody } from '@/bodies/sites';
import type { BodyLayerId } from '@/types/body';

const SOURCE = 'body-features';
const RING = 'body-features-ring';
const CORE = 'body-features-core';
const LABEL = 'body-features-label';
const POPUP_BG = '#0A0E17';

type FeatProps = { name: string; nameEn: string; type: string; desc: string; color: string };

function applyPopupTheme(popup: maplibregl.Popup) {
  const content = popup.getElement()?.querySelector('.maplibregl-popup-content');
  if (content instanceof HTMLElement) {
    content.style.setProperty('background', POPUP_BG, 'important');
    content.style.setProperty('color', '#e6edf3', 'important');
    content.style.setProperty('border', '1px solid rgba(94,234,212,0.3)', 'important');
    content.style.setProperty('border-radius', '8px', 'important');
  }
}

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => (c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : '&quot;'));
}

function popupHtml(p: FeatProps): string {
  return `
    <div style="font-size:13px;line-height:1.5;min-width:11rem;max-width:15rem">
      <div style="font-weight:600;margin-bottom:2px">${esc(p.name)}</div>
      <div style="font-size:11px;color:#94a3b8;margin-bottom:6px">${esc(p.nameEn)} · ${esc(p.type)}</div>
      <div style="font-size:11px;color:#cbd5e1">${esc(p.desc)}</div>
    </div>`;
}

export function BodyFeatureLayer() {
  const map = useMapContext();
  const styleEpoch = useMapStyleEpoch();
  const activeBody = useMapStore((s) => s.activeBody);
  const activeBodyLayers = useBodyStore((s) => s.activeBodyLayers);

  const featureLayer: BodyLayerId | null =
    activeBody === 'moon' ? 'moon_features' : activeBody === 'mars' ? 'mars_features' : null;
  const enabled = featureLayer !== null && activeBodyLayers.includes(featureLayer);

  const geojson = useMemo<FeatureCollection>(() => {
    if (!enabled || activeBody === 'earth') return { type: 'FeatureCollection', features: [] };
    return {
      type: 'FeatureCollection',
      features: getFeaturesForBody(activeBody).map((f) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [f.lng, f.lat] },
        properties: { name: f.name, nameEn: f.nameEn, type: f.type, desc: f.desc, color: '#5eead4' },
      })),
    };
  }, [enabled, activeBody]);

  const popupRef = useRef<maplibregl.Popup | null>(null);
  const lastKeyRef = useRef('');
  const dataKey = useMemo(() => `${activeBody}:${geojson.features.length}`, [activeBody, geojson]);

  useEffect(() => {
    if (!map) return;
    const setup = () => {
      try {
        if (!map.getSource(SOURCE)) map.addSource(SOURCE, { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
        if (!map.getLayer(RING)) {
          map.addLayer({ id: RING, type: 'circle', source: SOURCE, layout: { visibility: 'none' }, paint: { 'circle-radius': 7, 'circle-color': 'rgba(0,0,0,0)', 'circle-stroke-width': 1.6, 'circle-stroke-color': ['get', 'color'], 'circle-stroke-opacity': 0.85 } });
        }
        if (!map.getLayer(CORE)) {
          map.addLayer({ id: CORE, type: 'circle', source: SOURCE, layout: { visibility: 'none' }, paint: { 'circle-radius': 2.6, 'circle-color': ['get', 'color'], 'circle-opacity': 0.9 } });
        }
        if (!map.getLayer(LABEL)) {
          map.addLayer({ id: LABEL, type: 'symbol', source: SOURCE, layout: { visibility: 'none', 'text-field': ['get', 'name'], 'text-size': 10, 'text-offset': [0, 1.1], 'text-anchor': 'top', 'text-optional': true }, paint: { 'text-color': '#bff7ec', 'text-halo-color': '#0A0E17', 'text-halo-width': 1.2 } });
        }
      } catch {
        /* */
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
        if (map.getLayer(RING)) map.removeLayer(RING);
        if (map.getSource(SOURCE)) map.removeSource(SOURCE);
      } catch {
        /* */
      }
    };
  }, [map, styleEpoch]);

  useEffect(() => { lastKeyRef.current = ''; }, [styleEpoch]);

  useEffect(() => {
    if (!map) return;
    const apply = () => {
      try {
        const src = map.getSource(SOURCE) as maplibregl.GeoJSONSource | undefined;
        if (!src || !map.getLayer(CORE)) return;
        if (dataKey !== lastKeyRef.current) { src.setData(geojson); lastKeyRef.current = dataKey; }
        const vis = enabled ? 'visible' : 'none';
        map.setLayoutProperty(CORE, 'visibility', vis);
        map.setLayoutProperty(RING, 'visibility', vis);
        map.setLayoutProperty(LABEL, 'visibility', vis);
      } catch {
        /* */
      }
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
      const p = f.properties as unknown as FeatProps;
      const coords = (f.geometry as unknown as { coordinates: [number, number] }).coordinates;
      popupRef.current?.remove();
      const popup = new maplibregl.Popup({ closeButton: true, closeOnClick: true, offset: 8, className: 'geodata-popup' })
        .setLngLat(coords).setHTML(popupHtml(p)).addTo(map);
      applyPopupTheme(popup);
      popupRef.current = popup;
    };
    const attach = () => {
      map.on('click', CORE, onClick);
      map.on('click', RING, onClick);
      map.on('mouseenter', RING, () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', RING, () => { map.getCanvas().style.cursor = ''; });
    };
    if (map.isStyleLoaded()) attach();
    map.on('style.load', attach);
    return () => {
      map.off('style.load', attach);
      map.off('click', CORE, onClick);
      map.off('click', RING, onClick);
    };
  }, [map, styleEpoch]);

  useEffect(() => () => { popupRef.current?.remove(); }, []);

  return null;
}
