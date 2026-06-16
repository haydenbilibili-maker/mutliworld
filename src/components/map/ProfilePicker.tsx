'use client';

/**
 * 垂直剖面取点器 — 招牌交互「天—地—海垂直剖面」
 * 剖面模式开启时：地图指针变十字，点击任一点设为剖面点，并在该处放置垂直钻取标记。
 */

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { useMapContext } from '@/context/MapContext';
import { useProfileStore } from '@/store/useProfileStore';

export function ProfilePicker() {
  const map = useMapContext();
  const active = useProfileStore((s) => s.active);
  const point = useProfileStore((s) => s.point);
  const setPoint = useProfileStore((s) => s.setPoint);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  // 点击取点
  useEffect(() => {
    if (!map || !active) return;
    const onClick = (e: maplibregl.MapMouseEvent) => {
      setPoint([e.lngLat.lng, e.lngLat.lat]);
    };
    map.on('click', onClick);
    map.getCanvas().style.cursor = 'crosshair';
    return () => {
      map.off('click', onClick);
      try {
        map.getCanvas().style.cursor = '';
      } catch {
        /* */
      }
    };
  }, [map, active, setPoint]);

  // 钻取标记
  useEffect(() => {
    if (!map) return;
    if (!active || !point) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }
    if (!markerRef.current) {
      const el = document.createElement('div');
      el.className = 'profile-pin';
      el.innerHTML = `
        <span class="pp-ring"></span>
        <span class="pp-core"></span>
        <span class="pp-shaft"></span>
      `;
      markerRef.current = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat(point)
        .addTo(map);
    } else {
      markerRef.current.setLngLat(point);
    }
  }, [map, active, point]);

  // 一次性点击涟漪反馈
  useEffect(() => {
    if (!map || !active || !point) return;
    const el = document.createElement('div');
    el.className = 'profile-ripple';
    const mk = new maplibregl.Marker({ element: el, anchor: 'center' })
      .setLngLat(point)
      .addTo(map);
    const t = window.setTimeout(() => mk.remove(), 750);
    return () => {
      window.clearTimeout(t);
      mk.remove();
    };
  }, [map, active, point]);

  useEffect(() => {
    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
    };
  }, []);

  return (
    <style>{`
      .profile-pin { position: relative; width: 0; height: 0; }
      .profile-pin .pp-core {
        position: absolute; left: -4px; top: -4px; width: 8px; height: 8px;
        border-radius: 50%; background: #facc15; box-shadow: 0 0 8px #facc15;
      }
      .profile-pin .pp-ring {
        position: absolute; left: -11px; top: -11px; width: 22px; height: 22px;
        border-radius: 50%; border: 1.5px solid rgba(250,204,21,0.7);
        animation: ppRing 1.6s ease-out infinite;
      }
      .profile-pin .pp-shaft {
        position: absolute; left: -1px; top: -34px; width: 2px; height: 68px;
        background: linear-gradient(to bottom, rgba(125,211,252,0.0), rgba(250,204,21,0.55), rgba(45,212,191,0.0));
      }
      @keyframes ppRing { 0% { transform: scale(0.5); opacity: 0.8 } 100% { transform: scale(2.2); opacity: 0 } }
      .profile-ripple {
        position: absolute; left: -6px; top: -6px; width: 12px; height: 12px;
        border-radius: 50%; border: 2px solid rgba(250,204,21,0.9);
        animation: ppFlash 0.75s ease-out forwards;
      }
      @keyframes ppFlash { 0% { transform: scale(0.3); opacity: 1 } 100% { transform: scale(5); opacity: 0 } }
    `}</style>
  );
}
