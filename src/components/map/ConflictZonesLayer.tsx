'use client';

/**
 * 冲突区图层 — 在地表绘制主要军事冲突示意多边形
 * fill + dashed/solid outline + 中文标注 + 点击弹窗
 */

import { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { useMapContext, useMapStyleEpoch } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { findOverlayBeforeId } from '@/lib/map/basemap';
import { buildConflictZonesGeoJSON } from '@/lib/geodata/conflictZones';
import type { EventDetail } from '@/types/geo';

const SOURCE = 'conflict-zones';
const FILL_LAYER = 'conflict-zones-fill';
const LINE_SOLID = 'conflict-zones-outline-solid';
const LINE_DASHED = 'conflict-zones-outline-dashed';
const LABEL_LAYER = 'conflict-zones-labels';
const INTERACTIVE_LAYERS = [FILL_LAYER, LINE_SOLID, LINE_DASHED, LABEL_LAYER] as const;

const POPUP_BG = '#0A0E17';

const INTENSITY_LABEL: Record<string, string> = {
  high: '高强度',
  medium: '中强度',
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

function popupHtml(p: Record<string, unknown>): string {
  const nameZh = String(p.nameZh ?? p.title ?? '');
  const since = String(p.since ?? '');
  const intensity = INTENSITY_LABEL[String(p.intensity ?? '')] ?? '';
  const status = String(p.status ?? '');
  const desc = String(p.description ?? '');
  return `
    <div style="font-size:12px;line-height:1.5;color:#e6edf3">
      <div style="font-weight:600;font-size:13px;margin-bottom:4px">⚔️ ${nameZh}</div>
      <div style="color:#ff7875;margin-bottom:4px">${intensity}${status ? ' · ' + status : ''}${since ? ' · 始于 ' + since : ''}</div>
      <div style="color:#8b949e;line-height:1.45">${desc}</div>
      <div style="margin-top:6px;font-size:10px;color:#6b7280">示意范围 · 非精确前线</div>
    </div>`;
}

export function ConflictZonesLayer() {
  const map = useMapContext();
  const styleEpoch = useMapStyleEpoch();
  const activeTier = useMapStore((s) => s.activeTier);
  const activeLayers = useMapStore((s) => s.activeLayers);
  const activeRegion = useMapStore((s) => s.activeRegion);
  const selectEvent = useMapStore((s) => s.selectEvent);

  const enabled = activeTier === 'surface' && activeLayers.includes('conflict_zones');
  const geojson = useMemo(
    () => buildConflictZonesGeoJSON(activeRegion),
    [activeRegion],
  );

  const popupRef = useRef<maplibregl.Popup | null>(null);
  const lastConflictKeyRef = useRef('');
  const lastConflictVisibleRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (!map) return;

    const onClick = (e: maplibregl.MapLayerMouseEvent) => {
      const raw = e.features?.[0]?.properties;
      if (!raw) return;

      const lng = Number(raw.labelLng ?? raw.lng ?? e.lngLat.lng);
      const lat = Number(raw.labelLat ?? raw.lat ?? e.lngLat.lat);
      const selected: EventDetail = {
        id: String(raw.id ?? ''),
        title: String(raw.title ?? raw.nameZh ?? ''),
        source: String(raw.source ?? '冲突区示意数据'),
        timestamp: String(raw.timestamp ?? ''),
        location: [lng, lat],
        impact_level: raw.impact === 'critical' ? 'critical' : 'high',
        category: 'conflict_zones',
        description: String(raw.description ?? ''),
      };
      selectEvent(selected);

      popupRef.current?.remove();
      popupRef.current = new maplibregl.Popup({
        closeButton: true,
        offset: 12,
        maxWidth: '300px',
        className: 'geodata-popup',
      })
        .setLngLat({ lng, lat })
        .setHTML(popupHtml(raw as Record<string, unknown>))
        .addTo(map);
      if (popupRef.current) applyPopupTheme(popupRef.current);
    };

    const onEnter = () => {
      map.getCanvas().style.cursor = 'pointer';
    };
    const onLeave = () => {
      map.getCanvas().style.cursor = '';
    };

    const setup = () => {
      try {
        const beforeId = findOverlayBeforeId(map);

        if (!map.getSource(SOURCE)) {
          map.addSource(SOURCE, {
            type: 'geojson',
            data: geojson,
          });
        }

        if (!map.getLayer(FILL_LAYER)) {
          map.addLayer(
            {
              id: FILL_LAYER,
              type: 'fill',
              source: SOURCE,
              paint: {
                'fill-color': ['coalesce', ['get', 'fillColor'], '#FF4D4F'],
                'fill-opacity': ['coalesce', ['get', 'fillOpacity'], 0.28],
                'fill-outline-color': 'transparent',
              },
              layout: { visibility: 'none' },
            },
            beforeId,
          );
        }

        if (!map.getLayer(LINE_SOLID)) {
          map.addLayer(
            {
              id: LINE_SOLID,
              type: 'line',
              source: SOURCE,
              filter: ['!=', ['get', 'dashed'], true],
              paint: {
                'line-color': ['coalesce', ['get', 'lineColor'], '#FF7875'],
                'line-width': 2,
                'line-opacity': 0.85,
              },
              layout: {
                visibility: 'none',
                'line-cap': 'round',
                'line-join': 'round',
              },
            },
            beforeId,
          );
        }

        if (!map.getLayer(LINE_DASHED)) {
          map.addLayer(
            {
              id: LINE_DASHED,
              type: 'line',
              source: SOURCE,
              filter: ['==', ['get', 'dashed'], true],
              paint: {
                'line-color': ['coalesce', ['get', 'lineColor'], '#fbbf24'],
                'line-width': 2,
                'line-opacity': 0.9,
                'line-dasharray': [4, 3],
              },
              layout: {
                visibility: 'none',
                'line-cap': 'round',
                'line-join': 'round',
              },
            },
            beforeId,
          );
        }

        if (!map.getLayer(LABEL_LAYER)) {
          map.addLayer(
            {
              id: LABEL_LAYER,
              type: 'symbol',
              source: SOURCE,
              layout: {
                visibility: 'none',
                'text-field': ['get', 'nameZh'],
                'text-size': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  2,
                  10,
                  5,
                  11,
                  8,
                  12,
                ],
                'text-anchor': 'center',
                'text-allow-overlap': false,
                'text-ignore-placement': false,
                'text-padding': 2,
                'text-max-width': 12,
              },
              paint: {
                'text-color': '#ffffff',
                'text-halo-color': 'rgba(0,0,0,0.75)',
                'text-halo-width': 1.2,
                'text-opacity': 0.92,
              },
            },
            beforeId,
          );
        }

        type MapWithListeners = maplibregl.Map & { __conflictZoneListeners?: boolean };
        const mapWithListeners = map as MapWithListeners;
        if (!mapWithListeners.__conflictZoneListeners) {
          mapWithListeners.__conflictZoneListeners = true;
          for (const layerId of INTERACTIVE_LAYERS) {
            map.on('click', layerId, onClick);
            map.on('mouseenter', layerId, onEnter);
            map.on('mouseleave', layerId, onLeave);
          }
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
      popupRef.current = null;
      try {
        for (const layerId of INTERACTIVE_LAYERS) {
          map.off('click', layerId, onClick);
          map.off('mouseenter', layerId, onEnter);
          map.off('mouseleave', layerId, onLeave);
        }
        for (const id of [LABEL_LAYER, LINE_DASHED, LINE_SOLID, FILL_LAYER]) {
          if (map.getLayer(id)) map.removeLayer(id);
        }
        if (map.getSource(SOURCE)) map.removeSource(SOURCE);
        delete (map as maplibregl.Map & { __conflictZoneListeners?: boolean })
          .__conflictZoneListeners;
      } catch {
        /* map 已销毁 */
      }
    };
  }, [map, selectEvent, styleEpoch]);

  useEffect(() => {
    if (!map) return;
    // styleEpoch 刷新时重置守卫
    lastConflictKeyRef.current = '';
    lastConflictVisibleRef.current = null;

    const conflictKey = `${geojson.features.length}:${enabled}`;

    const apply = () => {
      try {
        const src = map.getSource(SOURCE) as maplibregl.GeoJSONSource | undefined;
        if (!src) return;

        // 仅在数据实际变化时 setData
        if (conflictKey !== lastConflictKeyRef.current) {
          src.setData(geojson);
          lastConflictKeyRef.current = conflictKey;
        }

        const visible = enabled && geojson.features.length > 0;
        if (visible !== lastConflictVisibleRef.current) {
          lastConflictVisibleRef.current = visible;
          const vis = visible ? 'visible' : 'none';
          for (const id of [FILL_LAYER, LINE_SOLID, LINE_DASHED, LABEL_LAYER]) {
            if (map.getLayer(id)) {
              map.setLayoutProperty(id, 'visibility', vis);
            }
          }
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
  }, [map, geojson, enabled, styleEpoch]);

  // 轻微脉冲填充透明度
  useEffect(() => {
    if (!map || !enabled) return;

    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return; // 降级：不做脉冲动画

    let frame = 0;
    let raf = 0;
    let last = 0;

    const tick = (ts: number) => {
      raf = requestAnimationFrame(tick);
      // 深度防抖：交互(平移/缩放/旋转)期间暂停脉冲，避免与移动渲染竞争导致高频抖动
      if (map.isMoving() || map.isZooming() || map.isRotating()) return;
      // 节流 ~10fps（脉冲细微，肉眼无差，整图重绘减少约 6×）
      if (ts - last < 100) return;
      last = ts;
      frame += 1;
      const pulse = 0.5 + 0.5 * Math.sin(frame * 0.21);
      try {
        if (map.getLayer(FILL_LAYER)) {
          map.setPaintProperty(FILL_LAYER, 'fill-opacity', [
            '*',
            ['coalesce', ['get', 'fillOpacity'], 0.28],
            0.75 + 0.25 * pulse,
          ]);
        }
      } catch {
        /* */
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [map, enabled, styleEpoch]);

  return null;
}
