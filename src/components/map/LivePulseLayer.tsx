'use client';

/**
 * 活地图脉冲层 — 对高危(critical)事件铺设扩散血点脉冲（雷达 blip 观感）。
 * 走 DOM 标记 + CSS 合成动画，不强制地图画布重绘，性能友好；限量以控密度。
 */

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { useMapContext } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { useGeodata } from '@/hooks/useGeodata';

const MAX_PULSES = 28;

interface PulsePoint {
  id: string;
  lng: number;
  lat: number;
  color: string;
}

export function LivePulseLayer() {
  const map = useMapContext();
  const isEarth = useMapStore((s) => s.activeBody === 'earth');
  const { data } = useGeodata();
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());

  useEffect(() => {
    if (!map) return;
    const markers = markersRef.current;

    const points: PulsePoint[] = [];
    if (isEarth && data?.features) {
      for (const f of data.features) {
        if (points.length >= MAX_PULSES) break;
        const g = f.geometry;
        const p = f.properties as Record<string, unknown> | undefined;
        if (!g || g.type !== 'Point' || !p) continue;
        if (p.impact !== 'critical') continue;
        const [lng, lat] = g.coordinates as [number, number];
        points.push({
          id: String(p.id ?? `${lng},${lat}`),
          lng,
          lat,
          color: String(p.haloColor ?? '#ef4444'),
        });
      }
    }

    const seen = new Set<string>();
    for (const pt of points) {
      seen.add(pt.id);
      let mk = markers.get(pt.id);
      if (!mk) {
        const el = document.createElement('div');
        el.className = 'live-pulse';
        el.style.setProperty('--c', pt.color);
        el.innerHTML = '<span class="lp-ring"></span><span class="lp-ring lp-ring2"></span>';
        // 不拦截鼠标，让点击穿透到下方的 geodata 圆点层
        el.style.pointerEvents = 'none';
        mk = new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat([pt.lng, pt.lat])
          .addTo(map);
        markers.set(pt.id, mk);
      } else {
        mk.setLngLat([pt.lng, pt.lat]);
      }
    }

    markers.forEach((mk, id) => {
      if (!seen.has(id)) {
        mk.remove();
        markers.delete(id);
      }
    });
  }, [map, isEarth, data]);

  useEffect(() => {
    const markers = markersRef.current;
    return () => {
      markers.forEach((mk) => mk.remove());
      markers.clear();
    };
  }, []);

  return (
    <style>{`
      .live-pulse { position: relative; width: 0; height: 0; }
      .live-pulse .lp-ring {
        position: absolute; left: -7px; top: -7px; width: 14px; height: 14px;
        border-radius: 50%;
        border: 1.5px solid var(--c, #ef4444);
        box-shadow: 0 0 8px var(--c, #ef4444);
        opacity: 0;
        animation: lpPulse 2.2s cubic-bezier(0.2, 0.6, 0.3, 1) infinite;
      }
      .live-pulse .lp-ring2 { animation-delay: 1.1s; }
      @keyframes lpPulse {
        0%   { transform: scale(0.5); opacity: 0.75; }
        70%  { opacity: 0.18; }
        100% { transform: scale(3.0); opacity: 0; }
      }
      @media (prefers-reduced-motion: reduce) {
        .live-pulse .lp-ring { animation: none; opacity: 0.35; transform: scale(1.4); }
      }
    `}</style>
  );
}
