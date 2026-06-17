'use client';

/**
 * 实时航班图层 — 地表层（OpenSky ADS-B）
 * Symbol 图层：按航向旋转的飞机图标，点击弹出详情
 */

import { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import type { FeatureCollection } from 'geojson';
import { useMapContext, useMapStyleEpoch } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { findOverlayBeforeId } from '@/lib/map/basemap';
import { useLiveFlights } from '@/hooks/useLiveFlights';
import type { EventDetail } from '@/types/geo';

const SOURCE = 'live-flights';
const LAYER = 'live-flights-symbols';
const PLANE_ICON = 'flight-plane';

const POPUP_BG = '#0A0E17';

type FlightProps = {
  icao24: string;
  callsign: string;
  originCountry: string;
  altitudeLabel: string;
  speedLabel: string;
  heading: number;
  squawk: string | null;
  verticalRate: number | null;
};

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

function popupHtml(p: FlightProps): string {
  const squawk = p.squawk ? `<div>应答机：${p.squawk}</div>` : '';
  const vRate =
    p.verticalRate != null
      ? `<div>垂直速率：${p.verticalRate > 0 ? '+' : ''}${Math.round(p.verticalRate)} m/s</div>`
      : '';
  return `
    <div style="font-size:13px;line-height:1.5;min-width:11rem">
      <div style="font-weight:600;margin-bottom:4px">✈️ ${p.callsign}</div>
      <div style="font-size:11px;color:#94a3b8;margin-bottom:6px">${p.originCountry} · ICAO ${p.icao24.toUpperCase()}</div>
      <div>高度：${p.altitudeLabel}</div>
      <div>地速：${p.speedLabel}</div>
      <div>航向：${Math.round(p.heading)}°</div>
      ${vRate}
      ${squawk}
    </div>`;
}

function registerPlaneIcon(map: maplibregl.Map) {
  if (map.hasImage(PLANE_ICON)) return;
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = '#38bdf8';
  ctx.strokeStyle = '#0A0E17';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(size / 2, 3);
  ctx.lineTo(size - 5, size - 5);
  ctx.lineTo(size / 2, size - 9);
  ctx.lineTo(5, size - 5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  const imageData = ctx.getImageData(0, 0, size, size);
  map.addImage(PLANE_ICON, imageData, { pixelRatio: 2 });
}

export function FlightLayer() {
  const map = useMapContext();
  const styleEpoch = useMapStyleEpoch();
  const activeTier = useMapStore((s) => s.activeTier);
  const activeLayers = useMapStore((s) => s.activeLayers);
  const center = useMapStore((s) => s.center);
  const zoom = useMapStore((s) => s.zoom);
  const selectEvent = useMapStore((s) => s.selectEvent);

  const enabled = activeTier === 'surface' && activeLayers.includes('live_flights');
  const { geojson } = useLiveFlights(enabled, center, zoom);

  const selectEventRef = useRef(selectEvent);
  selectEventRef.current = selectEvent;
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const lastDataKeyRef = useRef('');

  const dataKey = useMemo(
    () =>
      `${enabled}:${geojson.features.length}:${geojson.features
        .slice(0, 5)
        .map((f) => f.properties?.icao24)
        .join(',')}`,
    [geojson, enabled],
  );

  // 初始化 source + symbol layer
  useEffect(() => {
    if (!map) return;

    const setup = () => {
      try {
        registerPlaneIcon(map);
        if (!map.getSource(SOURCE)) {
          map.addSource(SOURCE, {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] },
          });
        }
        if (!map.getLayer(LAYER)) {
          map.addLayer(
            {
              id: LAYER,
              type: 'symbol',
              source: SOURCE,
              layout: {
                visibility: 'none',
                'icon-image': PLANE_ICON,
                'icon-size': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  2,
                  0.35,
                  5,
                  0.5,
                  8,
                  0.65,
                  12,
                  0.85,
                ],
                'icon-rotate': ['get', 'heading'],
                'icon-rotation-alignment': 'map',
                'icon-allow-overlap': true,
                'icon-ignore-placement': true,
              },
              paint: {
                'icon-opacity': 0.92,
              },
            },
            findOverlayBeforeId(map),
          );
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
        if (map.getLayer(LAYER)) map.removeLayer(LAYER);
        if (map.getSource(SOURCE)) map.removeSource(SOURCE);
        if (map.hasImage(PLANE_ICON)) map.removeImage(PLANE_ICON);
      } catch {
        /* */
      }
    };
  }, [map, styleEpoch]);

  // 更新数据与显隐
  useEffect(() => {
    if (!map) return;

    const apply = () => {
      try {
        const src = map.getSource(SOURCE) as maplibregl.GeoJSONSource | undefined;
        if (src && dataKey !== lastDataKeyRef.current) {
          src.setData(geojson as FeatureCollection);
          lastDataKeyRef.current = dataKey;
        }
        if (map.getLayer(LAYER)) {
          map.setLayoutProperty(LAYER, 'visibility', enabled ? 'visible' : 'none');
        }
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

  // 点击交互
  useEffect(() => {
    if (!map) return;

    const onClick = (
      e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] },
    ) => {
      const f = e.features?.[0];
      if (!f?.properties) return;
      const p = f.properties as unknown as FlightProps;
      const coords = (f.geometry as { type: string; coordinates: [number, number] }).coordinates;

      popupRef.current?.remove();
      const popup = new maplibregl.Popup({
        closeButton: true,
        closeOnClick: true,
        offset: 10,
        className: 'geodata-popup',
      })
        .setLngLat(coords)
        .setHTML(popupHtml(p))
        .addTo(map);
      applyPopupTheme(popup);
      popupRef.current = popup;

      const detail: EventDetail = {
        id: `flight-${p.icao24}`,
        title: p.callsign,
        source: 'OpenSky ADS-B（近实时）',
        timestamp: new Date().toISOString(),
        location: coords,
        impact_level: 'low',
        category: 'live_flights',
        description: `${p.originCountry} · 高度 ${p.altitudeLabel} · 地速 ${p.speedLabel} · 航向 ${Math.round(p.heading)}°`,
      };
      selectEventRef.current(detail);
    };

    const attach = () => {
      map.on('click', LAYER, onClick);
      map.on('mouseenter', LAYER, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', LAYER, () => {
        map.getCanvas().style.cursor = '';
      });
    };
    const detach = () => {
      map.off('click', LAYER, onClick);
    };

    if (map.isStyleLoaded()) attach();
    map.on('style.load', attach);
    return () => {
      map.off('style.load', attach);
      detach();
    };
  }, [map, styleEpoch]);

  useEffect(() => {
    return () => {
      popupRef.current?.remove();
    };
  }, []);

  return null;
}
