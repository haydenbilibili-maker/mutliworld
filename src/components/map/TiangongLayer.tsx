'use client';

/**
 * 天宫空间站(CSS)实时星下点 — 宇宙层（wheretheiss.at NORAD 48274，秒级实时）。
 * DOM 标记随真实经纬度移动；点击弹出高度/速度/时刻。真实数据·中立并陈。
 */

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import useSWR from 'swr';
import { useMapContext } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import type { EventDetail } from '@/types/geo';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface SatPos { lat: number; lon: number; altitude: number; velocity: number; timestamp: number; source?: string }

export function TiangongLayer() {
  const map = useMapContext();
  const activeTier = useMapStore((s) => s.activeTier);
  const activeLayers = useMapStore((s) => s.activeLayers);
  const selectEvent = useMapStore((s) => s.selectEvent);

  const enabled = activeTier === 'space' && activeLayers.includes('tiangong');
  const { data } = useSWR<SatPos>(enabled ? '/api/tiangong' : null, fetcher, {
    revalidateOnFocus: false, refreshInterval: 8000, dedupingInterval: 4000,
  });

  const markerRef = useRef<maplibregl.Marker | null>(null);
  const dataRef = useRef<SatPos | null>(null);
  dataRef.current = data ?? null;

  useEffect(() => {
    if (!map || !enabled) return;
    const el = document.createElement('div');
    el.style.cssText = 'font-size:20px;line-height:1;cursor:pointer;filter:drop-shadow(0 0 5px #f59e0b);transition:transform .2s;';
    el.textContent = '🏯';
    el.title = '天宫空间站 CSS（实时）';
    el.addEventListener('click', () => {
      const p = dataRef.current;
      if (!p) return;
      const detail: EventDetail = {
        id: 'tiangong-live',
        title: '🏯 天宫空间站 CSS',
        source: p.source ?? 'wheretheiss.at（实时）',
        timestamp: new Date(p.timestamp).toISOString(),
        location: [p.lon, p.lat],
        impact_level: 'low',
        category: 'tiangong',
        description: `天宫空间站实时星下点。NORAD 48274，中国近地轨道载人空间站。`,
        metrics: [
          { label: '轨道高度', value: `${Math.round(p.altitude)}`, hint: 'km', accent: '#f59e0b' },
          { label: '速度', value: `${Math.round(p.velocity).toLocaleString()}`, hint: 'km/h', accent: '#fbbf24' },
          { label: '星下点', value: `${p.lat.toFixed(1)}°, ${p.lon.toFixed(1)}°` },
        ],
        tags: ['载人航天', '近地轨道', 'NORAD 48274'],
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
