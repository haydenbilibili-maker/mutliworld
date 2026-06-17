'use client';

/**
 * 全球海运实时图层 — 地表层（AISStream / 航运通道模拟）
 * Symbol 图层：按航向旋转的船舶图标，点击弹出详情
 */

import { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import type { FeatureCollection } from 'geojson';
import { useMapContext, useMapStyleEpoch } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { findLiveOverlayBeforeId } from '@/lib/map/basemap';
import { useLiveMaritime } from '@/hooks/useLiveMaritime';
import type { EventDetail } from '@/types/geo';

const SOURCE = 'live-maritime';
const HALO_LAYER = 'live-maritime-halo';
const LAYER = 'live-maritime-symbols';
const SHIP_ICON = 'maritime-ship';
const SHIP_SPRITE_SIZE = 64;

const SHIP_ICON_SIZE: maplibregl.ExpressionSpecification = [
  'interpolate',
  ['linear'],
  ['zoom'],
  2,
  0.85,
  4,
  1.0,
  6,
  1.15,
  8,
  1.3,
  10,
  1.45,
  12,
  1.6,
  14,
  1.75,
];

const POPUP_BG = '#0A0E17';

type VesselProps = {
  mmsi: string;
  name: string;
  vesselTypeLabel: string;
  flag: string;
  speedLabel: string;
  courseLabel: string;
  destination: string | null;
  heading: number;
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

function popupHtml(p: VesselProps): string {
  const dest = p.destination ? `<div>目的港：${p.destination}</div>` : '';
  return `
    <div style="font-size:13px;line-height:1.5;min-width:11rem">
      <div style="font-weight:600;margin-bottom:4px">🚢 ${p.name}</div>
      <div style="font-size:11px;color:#94a3b8;margin-bottom:6px">${p.vesselTypeLabel} · ${p.flag} · MMSI ${p.mmsi}</div>
      <div>航速：${p.speedLabel}</div>
      <div>航向：${p.courseLabel}</div>
      ${dest}
    </div>`;
}

function registerShipIcon(map: maplibregl.Map) {
  if (map.hasImage(SHIP_ICON)) return;
  const size = SHIP_SPRITE_SIZE;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const cx = size / 2;
  const cy = size / 2;

  ctx.clearRect(0, 0, size, size);

  ctx.beginPath();
  ctx.arc(cx, cy, 22, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(10, 14, 23, 0.6)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, 28, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
  ctx.fill();

  ctx.font =
    '40px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🚢', cx, cy + 1);

  const imageData = ctx.getImageData(0, 0, size, size);
  map.addImage(SHIP_ICON, imageData, { pixelRatio: 2 });
}

export function MaritimeLayer() {
  const map = useMapContext();
  const styleEpoch = useMapStyleEpoch();
  const activeTier = useMapStore((s) => s.activeTier);
  const activeLayers = useMapStore((s) => s.activeLayers);
  const center = useMapStore((s) => s.center);
  const zoom = useMapStore((s) => s.zoom);
  const selectEvent = useMapStore((s) => s.selectEvent);

  const enabled = activeTier === 'surface' && activeLayers.includes('live_maritime');
  const { geojson } = useLiveMaritime(enabled, center, zoom);

  const selectEventRef = useRef(selectEvent);
  selectEventRef.current = selectEvent;
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const lastDataKeyRef = useRef('');

  const dataKey = useMemo(
    () =>
      `${enabled}:${geojson.features.length}:${geojson.features
        .slice(0, 5)
        .map((f) => f.properties?.mmsi)
        .join(',')}`,
    [geojson, enabled],
  );

  useEffect(() => {
    if (!map) return;

    const setup = () => {
      try {
        registerShipIcon(map);
        if (!map.getSource(SOURCE)) {
          map.addSource(SOURCE, {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] },
          });
        }
        if (!map.getLayer(HALO_LAYER)) {
          map.addLayer(
            {
              id: HALO_LAYER,
              type: 'circle',
              source: SOURCE,
              layout: { visibility: 'none' },
              paint: {
                'circle-radius': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  2,
                  5,
                  5,
                  7,
                  8,
                  9,
                  12,
                  11,
                ],
                'circle-color': '#06b6d4',
                'circle-opacity': 0.4,
                'circle-blur': 0.35,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#cffafe',
                'circle-stroke-opacity': 0.6,
              },
            },
            findLiveOverlayBeforeId(map),
          );
        }
        if (!map.getLayer(LAYER)) {
          map.addLayer(
            {
              id: LAYER,
              type: 'symbol',
              source: SOURCE,
              layout: {
                visibility: 'none',
                'icon-image': SHIP_ICON,
                'icon-size': SHIP_ICON_SIZE,
                'icon-rotate': ['get', 'heading'],
                'icon-rotation-alignment': 'map',
                'icon-allow-overlap': true,
                'icon-ignore-placement': true,
              },
              paint: {
                'icon-opacity': 0.98,
              },
            },
            findLiveOverlayBeforeId(map),
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
        if (map.getLayer(HALO_LAYER)) map.removeLayer(HALO_LAYER);
        if (map.getSource(SOURCE)) map.removeSource(SOURCE);
        if (map.hasImage(SHIP_ICON)) map.removeImage(SHIP_ICON);
      } catch {
        /* */
      }
    };
  }, [map, styleEpoch]);

  useEffect(() => {
    lastDataKeyRef.current = '';
  }, [styleEpoch]);

  useEffect(() => {
    if (!map) return;

    const apply = () => {
      try {
        const src = map.getSource(SOURCE) as maplibregl.GeoJSONSource | undefined;
        const hasLayers = Boolean(map.getLayer(LAYER) && map.getLayer(HALO_LAYER));
        if (!src || !hasLayers) return;

        if (dataKey !== lastDataKeyRef.current) {
          src.setData(geojson as FeatureCollection);
          lastDataKeyRef.current = dataKey;
        }
        map.setLayoutProperty(LAYER, 'visibility', enabled ? 'visible' : 'none');
        map.setLayoutProperty(HALO_LAYER, 'visibility', enabled ? 'visible' : 'none');
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

    const onClick = (
      e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] },
    ) => {
      const f = e.features?.[0];
      if (!f?.properties) return;
      const p = f.properties as unknown as VesselProps;
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
        id: `vessel-${p.mmsi}`,
        title: p.name,
        source: '海运 AIS（近实时）',
        timestamp: new Date().toISOString(),
        location: coords,
        impact_level: 'low',
        category: 'live_maritime',
        description: `${p.vesselTypeLabel} · ${p.flag} · 航速 ${p.speedLabel} · 航向 ${p.courseLabel}`,
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
