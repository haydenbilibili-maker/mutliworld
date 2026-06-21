'use client';

/**
 * 国际空间站(ISS)实时星下点 — 宇宙层（wheretheiss.at，秒级实时）。
 * DOM 标记随真实经纬度移动；点击弹出高度/速度/时刻。真实数据·中立并陈。
 */

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import useSWR from 'swr';
import { useMapContext } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import type { EventDetail } from '@/types/geo';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface IssPos { lat: number; lon: number; altitude: number; velocity: number; timestamp: number; source?: string }

export function IssLayer() {
  const map = useMapContext();
  const activeTier = useMapStore((s) => s.activeTier);
  const activeLayers = useMapStore((s) => s.activeLayers);
  const selectEvent = useMapStore((s) => s.selectEvent);

  const enabled = activeTier === 'space' && activeLayers.includes('iss');
  const { data } = useSWR<IssPos>(enabled ? '/api/iss' : null, fetcher, {
    revalidateOnFocus: false, refreshInterval: 8000, dedupingInterval: 4000,
  });

  const markerRef = useRef<maplibregl.Marker | null>(null);
  const dataRef = useRef<IssPos | null>(null);
  dataRef.current = data ?? null;

  useEffect(() => {
    if (!map || !enabled) return;
    const el = document.createElement('div');
    el.style.cssText = 'font-size:20px;line-height:1;cursor:pointer;filter:drop-shadow(0 0 5px #38bdf8);transition:transform .2s;';
    el.textContent = '🛰️';
    el.title = '国际空间站 ISS（实时）';
    el.addEventListener('click', () => {
      const p = dataRef.current;
      if (!p) return;
      const detail: EventDetail = {
        id: 'iss-live',
        title: '🛰️ 国际空间站 ISS',
        source: p.source ?? 'wheretheiss.at（实时）',
        timestamp: new Date(p.timestamp).toISOString(),
        location: [p.lon, p.lat],
        impact_level: 'low',
        category: 'iss',
        description: `轨道高度 ${Math.round(p.altitude)} km · 速度 ${Math.round(p.velocity).toLocaleString()} km/h · ${p.lat.toFixed(2)}°, ${p.lon.toFixed(2)}°`,
      };
      selectEvent(detail);
    });
    const marker = new maplibregl.Marker({ element: el }).setLngLat([dataRef.current?.lon ?? 0, dataRef.current?.lat ?? 0]).addTo(map);
    markerRef.current = marker;
    return () => { marker.remove(); markerRef.current = null; };
  }, [map, enabled, selectEvent]);

  useEffect(() => {
    if (markerRef.current && data && typeof data.lon === 'number' && typeof data.lat === 'number') {
      markerRef.current.setLngLat([data.lon, data.lat]);
    }
  }, [data]);

  return null;
}
