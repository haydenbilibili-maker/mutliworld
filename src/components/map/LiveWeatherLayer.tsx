'use client';

/**
 * 实时天气图层 — 地表层
 * - RainViewer 降水雷达栅格叠加
 * - Open-Meteo 主要城市当前天气 DOM 标记（温度 + 条件）
 */

import { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { useMapContext, useMapStyleEpoch } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { findOverlayBeforeId } from '@/lib/map/basemap';
import { useLiveWeather, useWeatherRadar } from '@/hooks/useLiveWeather';
import { windDirectionLabel } from '@/lib/weather/wmoCode';
import type { LiveWeatherPoint } from '@/types/weather';

const RADAR_SOURCE = 'live-weather-radar';
const RADAR_LAYER = 'live-weather-radar-raster';

const POPUP_BG = '#0A0E17';

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

function popupHtml(p: LiveWeatherPoint): string {
  const humidity = p.humidity != null ? `<div>湿度：${p.humidity}%</div>` : '';
  const wind = `<div>风速：${p.windSpeed} km/h · ${windDirectionLabel(p.windDirection)}风</div>`;
  return `
    <div style="font-size:13px;line-height:1.5;min-width:10rem">
      <div style="font-weight:600;margin-bottom:4px">${p.emoji} ${p.name}</div>
      <div style="font-size:18px;font-weight:700;color:#22d3ee;margin-bottom:6px">${p.temperature}°C · ${p.condition}</div>
      ${humidity}
      ${wind}
      <div style="margin-top:6px;font-size:11px;color:#94a3b8">观测：${p.observedAt.replace('T', ' ').slice(0, 16)}</div>
    </div>`;
}

function updateMarkerEl(el: HTMLDivElement, p: LiveWeatherPoint, onClick: () => void) {
  el.className = 'live-weather-marker';
  el.innerHTML = `
    <div class="lwm-chip">
      <span class="lwm-emoji">${p.emoji}</span>
      <span class="lwm-temp">${p.temperature}°</span>
    </div>
    <div class="lwm-name">${p.name}</div>`;
  el.onclick = (e) => {
    e.stopPropagation();
    onClick();
  };
}

function buildMarkerEl(p: LiveWeatherPoint, onClick: () => void): HTMLDivElement {
  const el = document.createElement('div');
  updateMarkerEl(el, p, onClick);
  return el;
}

export function LiveWeatherLayer() {
  const map = useMapContext();
  const styleEpoch = useMapStyleEpoch();
  const activeTier = useMapStore((s) => s.activeTier);
  const activeLayers = useMapStore((s) => s.activeLayers);
  const enabled = activeTier === 'surface' && activeLayers.includes('live_weather');

  const { points } = useLiveWeather(enabled);
  const { radar } = useWeatherRadar(enabled);

  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const lastRadarTsRef = useRef<number | null>(null);

  const pointsKey = useMemo(
    () => points.map((p) => `${p.id}:${p.temperature}:${p.weatherCode}`).join('|'),
    [points],
  );

  // 降水雷达栅格
  useEffect(() => {
    if (!map) return;

    const ensureRadar = () => {
      try {
        if (!enabled || !radar?.tiles?.length) {
          if (map.getLayer(RADAR_LAYER)) {
            map.setLayoutProperty(RADAR_LAYER, 'visibility', 'none');
          }
          return;
        }

        const beforeId = findOverlayBeforeId(map);

        if (lastRadarTsRef.current !== radar.timestamp) {
          if (map.getLayer(RADAR_LAYER)) map.removeLayer(RADAR_LAYER);
          if (map.getSource(RADAR_SOURCE)) map.removeSource(RADAR_SOURCE);

          map.addSource(RADAR_SOURCE, {
            type: 'raster',
            tiles: radar.tiles,
            tileSize: 256,
            attribution: '© RainViewer',
          });
          map.addLayer(
            {
              id: RADAR_LAYER,
              type: 'raster',
              source: RADAR_SOURCE,
              paint: { 'raster-opacity': 0.55 },
              layout: { visibility: 'visible' },
            },
            beforeId,
          );
          lastRadarTsRef.current = radar.timestamp;
        } else if (map.getLayer(RADAR_LAYER)) {
          map.setLayoutProperty(RADAR_LAYER, 'visibility', 'visible');
        }
      } catch {
        /* 样式未就绪 */
      }
    };

    if (map.isStyleLoaded()) ensureRadar();
    map.on('style.load', ensureRadar);

    return () => {
      map.off('style.load', ensureRadar);
      try {
        if (map.getLayer(RADAR_LAYER)) {
          map.setLayoutProperty(RADAR_LAYER, 'visibility', 'none');
        }
      } catch {
        /* */
      }
    };
  }, [map, enabled, radar, styleEpoch]);

  // 城市天气 DOM 标记
  useEffect(() => {
    if (!map) return;
    const markers = markersRef.current;
    popupRef.current?.remove();
    popupRef.current = null;

    if (!enabled) {
      markers.forEach((mk) => mk.remove());
      markers.clear();
      return;
    }

    const seen = new Set<string>();

    for (const p of points) {
      seen.add(p.id);
      const showPopup = () => {
        popupRef.current?.remove();
        const popup = new maplibregl.Popup({
          closeButton: true,
          closeOnClick: true,
          offset: 12,
          className: 'geodata-popup',
        })
          .setLngLat([p.lng, p.lat])
          .setHTML(popupHtml(p))
          .addTo(map);
        applyPopupTheme(popup);
        popupRef.current = popup;
      };

      let mk = markers.get(p.id);
      if (!mk) {
        const el = buildMarkerEl(p, showPopup);
        mk = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([p.lng, p.lat])
          .addTo(map);
        markers.set(p.id, mk);
      } else {
        mk.setLngLat([p.lng, p.lat]);
        const el = mk.getElement();
        if (el instanceof HTMLDivElement) {
          updateMarkerEl(el, p, showPopup);
        }
      }
    }

    markers.forEach((mk, id) => {
      if (!seen.has(id)) {
        mk.remove();
        markers.delete(id);
      }
    });
  }, [map, enabled, points, pointsKey]);

  useEffect(() => {
    return () => {
      popupRef.current?.remove();
      markersRef.current.forEach((mk) => mk.remove());
      markersRef.current.clear();
    };
  }, [map]);

  return (
    <style jsx global>{`
      .live-weather-marker {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        pointer-events: auto;
      }
      .live-weather-marker .lwm-chip {
        display: flex;
        align-items: center;
        gap: 2px;
        padding: 2px 6px;
        border-radius: 999px;
        background: rgba(10, 14, 23, 0.88);
        border: 1px solid rgba(34, 211, 238, 0.45);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
        white-space: nowrap;
      }
      .live-weather-marker .lwm-emoji {
        font-size: 14px;
        line-height: 1;
      }
      .live-weather-marker .lwm-temp {
        font-size: 12px;
        font-weight: 700;
        color: #22d3ee;
        font-variant-numeric: tabular-nums;
      }
      .live-weather-marker .lwm-name {
        margin-top: 2px;
        font-size: 10px;
        color: rgba(230, 237, 243, 0.85);
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
        white-space: nowrap;
      }
    `}</style>
  );
}
