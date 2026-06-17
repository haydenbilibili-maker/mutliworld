'use client';

/**
 * 在轨轨道器图层 — 多天体探索 Phase 3（实时星历星下点）
 * 绕月/绕火卫星以脉冲环标记其星下点；点击弹出高度/历元/机构。带历元标注，缺数据不显示（不造假）。
 */

import { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import type { FeatureCollection } from 'geojson';
import { useMapContext, useMapStyleEpoch } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { useBodyStore } from '@/store/useBodyStore';
import { useBodyOrbiters } from '@/hooks/useBodyOrbiters';
import type { BodyLayerId } from '@/types/body';

const SOURCE = 'body-orbiters';
const RING = 'body-orbiters-ring';
const CORE = 'body-orbiters-core';
const LABEL = 'body-orbiters-label';
const COLOR = '#a78bfa';
const POPUP_BG = '#0A0E17';

function applyPopupTheme(popup: maplibregl.Popup) {
  const content = popup.getElement()?.querySelector('.maplibregl-popup-content');
  if (content instanceof HTMLElement) {
    content.style.setProperty('background', POPUP_BG, 'important');
    content.style.setProperty('color', '#e6edf3', 'important');
    content.style.setProperty('border', '1px solid rgba(167,139,250,0.35)', 'important');
    content.style.setProperty('border-radius', '8px', 'important');
  }
}

type OrbiterProps = { name: string; nameEn: string; agency: string; note: string; altKm: string; epoch: string };

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => (c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : '&quot;'));
}

function popupHtml(p: OrbiterProps): string {
  const alt = p.altKm && p.altKm !== '' ? `${p.altKm} km` : '—';
  const t = p.epoch ? new Date(p.epoch).toLocaleString('zh-CN') : '—';
  return `
    <div style="font-size:13px;line-height:1.5;min-width:11rem;max-width:15rem">
      <div style="font-weight:600;margin-bottom:2px">🛰 ${esc(p.name)}</div>
      <div style="font-size:11px;color:#94a3b8;margin-bottom:6px">${esc(p.nameEn)} · ${esc(p.agency)}</div>
      <div style="font-size:11px;color:#cbd5e1;margin-bottom:6px">${esc(p.note)}</div>
      <div style="font-size:10px;color:#94a3b8">星下点 · 轨道高度 ${alt}</div>
      <div style="font-size:10px;color:#a78bfa">实时星历 JPL Horizons · 历元 ${t}</div>
    </div>`;
}

export function BodyOrbiterLayer() {
  const map = useMapContext();
  const styleEpoch = useMapStyleEpoch();
  const activeBody = useMapStore((s) => s.activeBody);
  const activeBodyLayers = useBodyStore((s) => s.activeBodyLayers);

  const orbiterLayer: BodyLayerId | null =
    activeBody === 'moon' ? 'moon_orbiters' : activeBody === 'mars' ? 'mars_orbiters' : null;
  const enabled = orbiterLayer !== null && activeBodyLayers.includes(orbiterLayer);

  const { fixes } = useBodyOrbiters(activeBody, enabled);

  const geojson = useMemo<FeatureCollection>(() => {
    if (!enabled) return { type: 'FeatureCollection', features: [] };
    return {
      type: 'FeatureCollection',
      features: fixes.map((f) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [f.lng, f.lat] },
        properties: {
          name: f.name,
          nameEn: f.nameEn,
          agency: f.agency,
          note: f.note,
          altKm: f.altKm != null ? String(f.altKm) : '',
          epoch: f.epoch,
        },
      })),
    };
  }, [enabled, fixes]);

  const popupRef = useRef<maplibregl.Popup | null>(null);
  const lastKeyRef = useRef('');
  const dataKey = useMemo(() => `${activeBody}:${fixes.map((f) => `${f.id}${f.lng}${f.lat}`).join('|')}`, [activeBody, fixes]);

  useEffect(() => {
    if (!map) return;
    const setup = () => {
      try {
        if (!map.getSource(SOURCE)) {
          map.addSource(SOURCE, { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
        }
        if (!map.getLayer(RING)) {
          map.addLayer({ id: RING, type: 'circle', source: SOURCE, layout: { visibility: 'none' }, paint: { 'circle-radius': 10, 'circle-color': 'rgba(0,0,0,0)', 'circle-stroke-width': 1.5, 'circle-stroke-color': COLOR, 'circle-stroke-opacity': 0.7 } });
        }
        if (!map.getLayer(CORE)) {
          map.addLayer({ id: CORE, type: 'circle', source: SOURCE, layout: { visibility: 'none' }, paint: { 'circle-radius': 4.5, 'circle-color': COLOR, 'circle-opacity': 0.95, 'circle-stroke-width': 1, 'circle-stroke-color': '#0A0E17' } });
        }
        if (!map.getLayer(LABEL)) {
          map.addLayer({ id: LABEL, type: 'symbol', source: SOURCE, layout: { visibility: 'none', 'text-field': ['get', 'name'], 'text-size': 10, 'text-offset': [0, 1.2], 'text-anchor': 'top', 'text-optional': true }, paint: { 'text-color': '#d8c8ff', 'text-halo-color': '#0A0E17', 'text-halo-width': 1.2 } });
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
        if (dataKey !== lastKeyRef.current) {
          src.setData(geojson);
          lastKeyRef.current = dataKey;
        }
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
      const p = f.properties as unknown as OrbiterProps;
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
