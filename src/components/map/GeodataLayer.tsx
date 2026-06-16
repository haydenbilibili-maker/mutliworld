'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import type { Feature, FeatureCollection } from 'geojson';
import { useMapContext } from '@/context/MapContext';
import { useGeodataContext } from '@/context/GeodataContext';
import { useMapStore } from '@/store/useMapStore';
import { registerMarkerSprites } from '@/lib/map/emojiSprites';
import type { EventDetail, GeodataResponse, GeoJSONFeature, ImpactLevel } from '@/types/geo';

const POINT_SOURCE = 'geodata-api';
const LINE_SOURCE = 'geodata-api-lines';
const HALO_LAYER = 'geodata-api-halo';
const SYMBOL_LAYER = 'geodata-api-symbols';
/** 实线（海缆/管线等）— line-dasharray 不支持 feature 表达式，须分图层 */
const LINE_LAYER_SOLID = 'geodata-api-lines-solid';
const LINE_LAYER_DAYNIGHT = 'geodata-api-lines-daynight';
const LINE_LAYER_PLANNED = 'geodata-api-lines-planned';
const LINE_LAYERS = [LINE_LAYER_SOLID, LINE_LAYER_DAYNIGHT, LINE_LAYER_PLANNED] as const;
const POINT_INTERACTIVE_LAYERS = [SYMBOL_LAYER, HALO_LAYER] as const;
const LINE_INTERACTIVE_LAYERS = LINE_LAYERS;

/** line-dasharray 仅支持 zoom 常量，不能按 feature 分支 */
const LINE_WIDTH_BY_ZOOM = (base: number): maplibregl.ExpressionSpecification => [
  'interpolate',
  ['linear'],
  ['zoom'],
  2,
  base * 0.75,
  5,
  base,
  8,
  base * 1.25,
  12,
  base * 1.5,
];

const POPUP_BG = '#0A0E17';

/** 强制深色弹窗：兜底覆盖 maplibre 默认白底（page.css 曾晚于 globals 加载） */
function applyGeodataPopupTheme(popup: maplibregl.Popup) {
  const root = popup.getElement();
  if (!root) return;

  root.classList.add('geodata-popup');

  const content = root.querySelector('.maplibregl-popup-content');
  if (content instanceof HTMLElement) {
    content.style.setProperty('background', POPUP_BG, 'important');
    content.style.setProperty('color', '#e6edf3', 'important');
    content.style.setProperty('border', '1px solid rgba(255,255,255,0.12)', 'important');
    content.style.setProperty('border-radius', '8px', 'important');
    content.style.setProperty('box-shadow', '0 4px 20px rgba(0,0,0,0.55)', 'important');
  }

  const close = root.querySelector('.maplibregl-popup-close-button');
  if (close instanceof HTMLElement) {
    close.style.setProperty('color', '#e6edf3', 'important');
  }
}

function splitFeatures(features: GeoJSONFeature[] | undefined): {
  points: FeatureCollection;
  lines: FeatureCollection;
} {
  const points: Feature[] = [];
  const lines: Feature[] = [];

  for (const f of features ?? []) {
    const feature: Feature = {
      ...f,
      properties: f.properties ?? {},
    };
    if (f.geometry.type === 'LineString') {
      lines.push(feature);
    } else {
      points.push(feature);
    }
  }

  return {
    points: { type: 'FeatureCollection', features: points },
    lines: { type: 'FeatureCollection', features: lines },
  };
}

function featureProps(p: Record<string, unknown> | undefined) {
  const lng = Number(p?.lng ?? 0);
  const lat = Number(p?.lat ?? 0);
  const impactRaw = String(p?.impact ?? '');
  const impact_level: ImpactLevel =
    impactRaw === 'critical' ||
    impactRaw === 'high' ||
    impactRaw === 'medium' ||
    impactRaw === 'low'
      ? (impactRaw as ImpactLevel)
      : 'medium';

  return {
    lng,
    lat,
    impact_level,
    link: String(p?.link ?? ''),
    production: String(p?.production ?? ''),
    ftype: String(p?.ftype ?? ''),
    nuclearKindLabel: String(p?.nuclearKindLabel ?? ''),
    nuclearStatus: String(p?.nuclearStatus ?? ''),
    weapons: String(p?.weapons ?? ''),
    troop: String(p?.troop ?? ''),
    forces: String(p?.forces ?? ''),
    baseDesc: String(p?.description ?? ''),
    markerLabel: String(p?.markerLabel ?? ''),
    markerEmoji: String(p?.markerEmoji ?? ''),
    selected: {
      id: String(p?.id ?? ''),
      title: String(p?.title ?? ''),
      source: String(p?.source ?? ''),
      timestamp: String(p?.timestamp ?? ''),
      location: [lng, lat] as [number, number],
      impact_level,
      category: String(p?.category ?? p?.layerId ?? 'conflicts'),
      description: '',
    } satisfies EventDetail,
  };
}

/**
 * 统一 GeoJSON 图层：点标记（图标 + 光晕）+ 线要素（海缆/管线等），消费 /api/geodata
 */
export function GeodataLayer() {
  const map = useMapContext();
  const { data } = useGeodataContext();
  const selectEvent = useMapStore((s) => s.selectEvent);
  const popupRef = useRef<maplibregl.Popup | null>(null);

  useEffect(() => {
    if (!map) return;

    const showPopup = (
      lng: number,
      lat: number,
      selected: EventDetail,
      extras: {
        markerEmoji: string;
        markerLabel: string;
        nuclearMeta: string;
        production: string;
        ftype: string;
        troop: string;
        weapons: string;
        forces: string;
        baseDesc: string;
        link: string;
      },
    ) => {
      const dateStr = selected.timestamp
        ? selected.timestamp.slice(0, 16).replace('T', ' ')
        : '';

      map.flyTo({
        center: selected.location,
        zoom: Math.max(map.getZoom(), 4.2),
        duration: 800,
      });

      popupRef.current?.remove();
      popupRef.current = new maplibregl.Popup({
        closeButton: true,
        offset: 12,
        maxWidth: '280px',
        className: 'geodata-popup',
      })
        .setLngLat({ lng, lat })
        .setHTML(
          `<div style="font-size:12px;color:#e6edf3;background:transparent">
             <div style="display:flex;align-items:center;gap:6px">
               ${extras.markerEmoji ? `<span style="font-size:18px;line-height:1">${extras.markerEmoji}</span>` : ''}
               <span style="font-weight:600;color:#e6edf3">${selected.title}</span>
             </div>
             ${extras.markerLabel ? `<div style="color:#a855f7;margin-top:4px">${extras.markerLabel}</div>` : ''}
             <div style="color:#8b949e;margin-top:2px">${dateStr}${selected.source ? ' · ' + selected.source : ''}</div>
             ${extras.nuclearMeta ? `<div style="color:#c4b5fd;margin-top:4px">${extras.nuclearMeta}</div>` : ''}
             ${extras.production ? `<div style="color:#8b949e;margin-top:4px">${extras.production}</div>` : ''}
             ${extras.ftype && !extras.nuclearMeta ? `<div style="color:#8b949e;margin-top:2px">${extras.ftype}${extras.troop ? ' · ' + extras.troop : ''}</div>` : ''}
             ${extras.weapons ? `<div style="margin-top:4px;color:#c4b5fd">${extras.weapons}</div>` : ''}
             ${extras.forces ? `<div style="margin-top:4px">${extras.forces}</div>` : ''}
             ${extras.baseDesc ? `<div style="margin-top:4px;line-height:1.4;white-space:pre-line">${extras.baseDesc}</div>` : !extras.nuclearMeta && selected.description ? `<div style="margin-top:4px;line-height:1.4;white-space:pre-line">${selected.description}</div>` : ''}
             ${extras.link ? `<a href="${extras.link}" target="_blank" rel="noopener" style="color:#22d3ee;margin-top:4px;display:inline-block">查看原文 ↗</a>` : ''}
           </div>`,
        )
        .addTo(map);
      if (popupRef.current) applyGeodataPopupTheme(popupRef.current);
    };

    const onPointClick = (e: maplibregl.MapLayerMouseEvent) => {
      const p = e.features?.[0]?.properties as Record<string, unknown> | undefined;
      if (!p) return;

      const info = featureProps(p);
      const nuclearMeta = [info.nuclearKindLabel, info.nuclearStatus].filter(Boolean).join(' · ');
      const description = nuclearMeta
        ? info.baseDesc
          ? `${nuclearMeta}\n${info.baseDesc}`
          : nuclearMeta
        : info.baseDesc;

      const selected: EventDetail = { ...info.selected, description };
      selectEvent(selected);
      showPopup(info.lng, info.lat, selected, {
        markerEmoji: info.markerEmoji,
        markerLabel: info.markerLabel,
        nuclearMeta,
        production: info.production,
        ftype: info.ftype,
        troop: info.troop,
        weapons: info.weapons,
        forces: info.forces,
        baseDesc: info.baseDesc,
        link: info.link,
      });
    };

    const onLineClick = (e: maplibregl.MapLayerMouseEvent) => {
      const p = e.features?.[0]?.properties as Record<string, unknown> | undefined;
      if (!p) return;

      const info = featureProps(p);
      const selected: EventDetail = { ...info.selected, description: info.baseDesc };
      selectEvent(selected);
      showPopup(info.lng, info.lat, selected, {
        markerEmoji: info.markerEmoji,
        markerLabel: info.markerLabel,
        nuclearMeta: '',
        production: info.production,
        ftype: info.ftype,
        troop: info.troop,
        weapons: info.weapons,
        forces: info.forces,
        baseDesc: info.baseDesc,
        link: info.link,
      });
    };

    const onEnter = () => {
      map.getCanvas().style.cursor = 'pointer';
    };
    const onLeave = () => {
      map.getCanvas().style.cursor = '';
    };

    const setup = () => {
      try {
        if (map.getSource(POINT_SOURCE)) return;

        registerMarkerSprites(map);

        map.addSource(POINT_SOURCE, {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] },
        });

        map.addSource(LINE_SOURCE, {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] },
        });

        const lineLayout: maplibregl.LineLayerSpecification['layout'] = {
          visibility: 'none',
          'line-cap': 'round',
          'line-join': 'round',
        };

        map.addLayer({
          id: LINE_LAYER_SOLID,
          type: 'line',
          source: LINE_SOURCE,
          filter: [
            'all',
            ['!=', ['get', 'layerId'], 'daynight'],
            ['!=', ['get', 'planned'], true],
          ],
          layout: lineLayout,
          paint: {
            'line-color': ['coalesce', ['get', 'lineColor'], '#22d3ee'],
            'line-width': LINE_WIDTH_BY_ZOOM(1.5),
            'line-opacity': ['coalesce', ['get', 'opacity'], 0.8],
          },
        });

        map.addLayer({
          id: LINE_LAYER_DAYNIGHT,
          type: 'line',
          source: LINE_SOURCE,
          filter: ['==', ['get', 'layerId'], 'daynight'],
          layout: lineLayout,
          paint: {
            'line-color': ['coalesce', ['get', 'lineColor'], '#fbbf24'],
            'line-width': LINE_WIDTH_BY_ZOOM(2),
            'line-opacity': ['coalesce', ['get', 'opacity'], 0.85],
            'line-dasharray': [5, 3],
          },
        });

        map.addLayer({
          id: LINE_LAYER_PLANNED,
          type: 'line',
          source: LINE_SOURCE,
          filter: ['==', ['get', 'planned'], true],
          layout: lineLayout,
          paint: {
            'line-color': ['coalesce', ['get', 'lineColor'], '#22d3ee'],
            'line-width': LINE_WIDTH_BY_ZOOM(1.5),
            'line-opacity': ['coalesce', ['get', 'opacity'], 0.55],
            'line-dasharray': [2, 2],
          },
        });

        map.addLayer({
          id: HALO_LAYER,
          type: 'circle',
          source: POINT_SOURCE,
          layout: { visibility: 'none' },
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              3,
              [
                'match',
                ['get', 'impact'],
                'critical',
                14,
                'high',
                12,
                'medium',
                10,
                'low',
                8,
                10,
              ],
              8,
              [
                'match',
                ['get', 'impact'],
                'critical',
                22,
                'high',
                18,
                'medium',
                15,
                'low',
                12,
                14,
              ],
            ],
            'circle-color': ['get', 'haloColor'],
            'circle-opacity': ['*', ['get', 'opacity'], 0.3],
            'circle-blur': 0.35,
          },
        });

        map.addLayer({
          id: SYMBOL_LAYER,
          type: 'symbol',
          source: POINT_SOURCE,
          layout: {
            visibility: 'none',
            'icon-image': ['get', 'markerImageId'],
            'icon-size': [
              'interpolate',
              ['linear'],
              ['zoom'],
              2,
              0.42,
              5,
              0.55,
              10,
              0.72,
              14,
              0.9,
            ],
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
          },
          paint: {
            'icon-opacity': ['get', 'opacity'],
          },
        });

        for (const layerId of POINT_INTERACTIVE_LAYERS) {
          map.on('click', layerId, onPointClick);
          map.on('mouseenter', layerId, onEnter);
          map.on('mouseleave', layerId, onLeave);
        }
        for (const layerId of LINE_INTERACTIVE_LAYERS) {
          map.on('click', layerId, onLineClick);
          map.on('mouseenter', layerId, onEnter);
          map.on('mouseleave', layerId, onLeave);
        }
      } catch {
        /* 样式未就绪 */
      }
    };

    if (map.isStyleLoaded()) setup();
    else map.once('load', setup);

    return () => {
      popupRef.current?.remove();
      popupRef.current = null;
      try {
        for (const layerId of POINT_INTERACTIVE_LAYERS) {
          map.off('click', layerId, onPointClick);
          map.off('mouseenter', layerId, onEnter);
          map.off('mouseleave', layerId, onLeave);
        }
        for (const layerId of LINE_INTERACTIVE_LAYERS) {
          map.off('click', layerId, onLineClick);
          map.off('mouseenter', layerId, onEnter);
          map.off('mouseleave', layerId, onLeave);
        }
        if (map.getLayer(SYMBOL_LAYER)) map.removeLayer(SYMBOL_LAYER);
        if (map.getLayer(HALO_LAYER)) map.removeLayer(HALO_LAYER);
        for (const layerId of LINE_LAYERS) {
          if (map.getLayer(layerId)) map.removeLayer(layerId);
        }
        if (map.getSource(POINT_SOURCE)) map.removeSource(POINT_SOURCE);
        if (map.getSource(LINE_SOURCE)) map.removeSource(LINE_SOURCE);
      } catch {
        /* map 已销毁 */
      }
    };
  }, [map, selectEvent]);

  useEffect(() => {
    if (!map) return;

    const { points, lines } = splitFeatures(data?.features);
    const showPoints = points.features.length > 0;
    const showLines = lines.features.length > 0;

    const apply = () => {
      try {
        const pointSrc = map.getSource(POINT_SOURCE) as maplibregl.GeoJSONSource | undefined;
        const lineSrc = map.getSource(LINE_SOURCE) as maplibregl.GeoJSONSource | undefined;
        if (!pointSrc || !lineSrc) return;

        pointSrc.setData(points);
        lineSrc.setData(lines);

        if (map.getLayer(SYMBOL_LAYER)) {
          map.setLayoutProperty(SYMBOL_LAYER, 'visibility', showPoints ? 'visible' : 'none');
        }
        if (map.getLayer(HALO_LAYER)) {
          map.setLayoutProperty(HALO_LAYER, 'visibility', showPoints ? 'visible' : 'none');
        }
        for (const layerId of LINE_LAYERS) {
          if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, 'visibility', showLines ? 'visible' : 'none');
          }
        }
      } catch {
        /* */
      }
    };

    if (map.isStyleLoaded()) apply();
    else map.once('load', apply);
  }, [map, data]);

  return null;
}
