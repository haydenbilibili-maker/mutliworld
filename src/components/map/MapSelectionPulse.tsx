'use client';

/**
 * 外部选中事件时的短暂高亮脉冲（简报、搜索、事件流等）
 */

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { useMapContext } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';

export function MapSelectionPulse() {
  const map = useMapContext();
  const selectedEvent = useMapStore((s) => s.selectedEvent);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!map || !selectedEvent?.location) return;

    const [lng, lat] = selectedEvent.location;
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;

    markerRef.current?.remove();
    if (timerRef.current) clearTimeout(timerRef.current);

    const el = document.createElement('div');
    el.className = 'map-selection-pulse';
    const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
      .setLngLat([lng, lat])
      .addTo(map);
    markerRef.current = marker;

    timerRef.current = setTimeout(() => {
      marker.remove();
      if (markerRef.current === marker) markerRef.current = null;
    }, 2600);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      markerRef.current?.remove();
      markerRef.current = null;
    };
  }, [map, selectedEvent?.id, selectedEvent?.location?.[0], selectedEvent?.location?.[1]]);

  return (
    <style jsx global>{`
      .map-selection-pulse {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid #f59e0b;
        background: rgba(245, 158, 11, 0.2);
        animation: mw-selection-pulse 1.1s ease-out 2;
        pointer-events: none;
      }
      @keyframes mw-selection-pulse {
        0% {
          transform: scale(0.55);
          opacity: 1;
        }
        100% {
          transform: scale(2.4);
          opacity: 0;
        }
      }
    `}</style>
  );
}
