'use client';

/**
 * 五角大楼披萨指数地图图层
 * 地表层 + pizza_index 图层开启时显示 🍕 标记，颜色映射繁忙度
 */

import { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import type { FeatureCollection } from 'geojson';
import { useMapContext, useMapStyleEpoch } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { findOverlayBeforeId } from '@/lib/map/basemap';
import { usePentagonPizzaIndex } from '@/hooks/usePentagonPizzaIndex';
import type { PizzaVenue } from '@/types/pizza-index';

const SOURCE = 'pizza-index-venues';
const LAYER_CIRCLES = 'pizza-index-circles';
const LAYER_SYMBOLS = 'pizza-index-symbols';
const PIZZA_ICON = 'pizza-emoji';

const POPUP_BG = '#0A0E17';

function busyColor(level: number): string {
  if (level >= 76) return '#ef4444';
  if (level >= 51) return '#f97316';
  if (level >= 26) return '#eab308';
  return '#22c55e';
}

function applyPopupTheme(popup: maplibregl.Popup) {
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
}

function popupHtml(v: PizzaVenue): string {
  const deltaSign = v.delta > 0 ? '+' : '';
  return `
    <div style="font-size:13px;line-height:1.5;min-width:12rem">
      <div style="font-weight:600;margin-bottom:4px">🍕 ${v.name}</div>
      <div style="font-size:11px;color:#94a3b8;margin-bottom:6px">${v.brand}</div>
      <div>繁忙度：<span style="color:${busyColor(v.busyLevel)};font-weight:600">${v.busyLevel}%</span></div>
      <div>相对基线：${deltaSign}${v.delta.toFixed(1)}%</div>
      <div>指数贡献：${v.contribution}%</div>
    </div>`;
}

function registerPizzaIcon(map: maplibregl.Map) {
  if (map.hasImage(PIZZA_ICON)) return;
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.font = '22px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🍕', size / 2, size / 2 + 1);
  const imageData = ctx.getImageData(0, 0, size, size);
  map.addImage(PIZZA_ICON, imageData, { pixelRatio: 2 });
}

function venuesToGeoJSON(venues: PizzaVenue[]): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: venues.map((v) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [v.lng, v.lat] },
      properties: {
        id: v.id,
        name: v.name,
        brand: v.brand,
        busyLevel: v.busyLevel,
        delta: v.delta,
        contribution: v.contribution,
        color: busyColor(v.busyLevel),
      },
    })),
  };
}

export function PizzaIndexLayer() {
  const map = useMapContext();
  const styleEpoch = useMapStyleEpoch();
  const activeTier = useMapStore((s) => s.activeTier);
  const activeLayers = useMapStore((s) => s.activeLayers);

  const enabled = activeTier === 'surface' && activeLayers.includes('pizza_index');
  const { data } = usePentagonPizzaIndex(enabled);

  const popupRef = useRef<maplibregl.Popup | null>(null);
  const lastPizzaKeyRef = useRef('');
  const lastPizzaEnabledRef = useRef<boolean | null>(null);
  const lastPizzaStyleEpochRef = useRef(0);
  const geojson = useMemo(
    () => venuesToGeoJSON(data?.venues ?? []),
    [data?.venues],
  );

  useEffect(() => {
    if (!map) return;

    const onClick = (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
      const feat = e.features?.[0];
      if (!feat?.geometry || feat.geometry.type !== 'Point') return;
      const props = feat.properties as Record<string, unknown>;
      const venue: PizzaVenue = {
        id: String(props.id),
        name: String(props.name),
        brand: String(props.brand),
        lat: (feat.geometry.coordinates as [number, number])[1],
        lng: (feat.geometry.coordinates as [number, number])[0],
        busyLevel: Number(props.busyLevel),
        delta: Number(props.delta),
        contribution: Number(props.contribution),
      };

      popupRef.current?.remove();
      const popup = new maplibregl.Popup({ closeButton: true, maxWidth: '280px' })
        .setLngLat(e.lngLat)
        .setHTML(popupHtml(venue));
      applyPopupTheme(popup);
      popup.addTo(map);
      popupRef.current = popup;
    };

    const setup = () => {
      try {
        registerPizzaIcon(map);
        const beforeId = findOverlayBeforeId(map);

        if (!map.getSource(SOURCE)) {
          map.addSource(SOURCE, { type: 'geojson', data: geojson });
          map.addLayer(
            {
              id: LAYER_CIRCLES,
              type: 'circle',
              source: SOURCE,
              paint: {
                'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 8, 14, 16, 18, 22],
                'circle-color': ['get', 'color'],
                'circle-opacity': 0.35,
                'circle-stroke-width': 1.5,
                'circle-stroke-color': ['get', 'color'],
                'circle-stroke-opacity': 0.85,
              },
            },
            beforeId,
          );
          map.addLayer(
            {
              id: LAYER_SYMBOLS,
              type: 'symbol',
              source: SOURCE,
              layout: {
                'icon-image': PIZZA_ICON,
                'icon-size': ['interpolate', ['linear'], ['zoom'], 10, 0.55, 14, 0.85, 18, 1.1],
                'icon-allow-overlap': true,
                'icon-ignore-placement': true,
              },
            },
            beforeId,
          );
          map.on('click', LAYER_SYMBOLS, onClick);
          map.on('mouseenter', LAYER_SYMBOLS, () => {
            map.getCanvas().style.cursor = 'pointer';
          });
          map.on('mouseleave', LAYER_SYMBOLS, () => {
            map.getCanvas().style.cursor = '';
          });
        }
      } catch {
        /* */
      }
    };

    if (map.isStyleLoaded()) setup();
    else map.once('load', setup);

    return () => {
      popupRef.current?.remove();
      popupRef.current = null;
      try {
        if (map.getLayer(LAYER_SYMBOLS)) {
          map.off('click', LAYER_SYMBOLS, onClick);
          map.removeLayer(LAYER_SYMBOLS);
        }
        if (map.getLayer(LAYER_CIRCLES)) map.removeLayer(LAYER_CIRCLES);
        if (map.getSource(SOURCE)) map.removeSource(SOURCE);
      } catch {
        /* */
      }
    };
  }, [map, styleEpoch]);

  useEffect(() => {
    if (!map || !enabled) return;
    if (styleEpoch !== lastPizzaStyleEpochRef.current) {
      lastPizzaStyleEpochRef.current = styleEpoch;
      lastPizzaKeyRef.current = '';
    }
    const pizzaKey = `${geojson.features.length}`;
    if (pizzaKey === lastPizzaKeyRef.current) return;
    lastPizzaKeyRef.current = pizzaKey;
    const src = map.getSource(SOURCE) as maplibregl.GeoJSONSource | undefined;
    if (src) src.setData(geojson);
  }, [map, geojson, enabled, styleEpoch]);

  useEffect(() => {
    if (!map) return;
    if (styleEpoch !== lastPizzaStyleEpochRef.current) {
      lastPizzaStyleEpochRef.current = styleEpoch;
      lastPizzaEnabledRef.current = null;
    }
    if (enabled === lastPizzaEnabledRef.current) return;
    lastPizzaEnabledRef.current = enabled;
    const vis = enabled ? 'visible' : 'none';
    try {
      if (map.getLayer(LAYER_CIRCLES)) map.setLayoutProperty(LAYER_CIRCLES, 'visibility', vis);
      if (map.getLayer(LAYER_SYMBOLS)) map.setLayoutProperty(LAYER_SYMBOLS, 'visibility', vis);
    } catch {
      /* */
    }
    if (!enabled) popupRef.current?.remove();
  }, [map, enabled, styleEpoch]);

  return null;
}
