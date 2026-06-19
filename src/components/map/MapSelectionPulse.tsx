'use client';

/**
 * 地图选中高亮脉冲标记 — 持续性橙色脉冲环 + 人物头像/事件标识 + 名称标签
 *
 * 所有外部点击路径（人物面板、跑马灯、事件流、简报、地图图层等）均通过
 * store.selectedEvent 收敛，此处一次实现全链路覆盖。
 *
 * 视觉层次（从外到内）：
 *   1. 两层脉冲环（持续向外扩散消散，无限循环）
 *   2. 中心亮点（呼吸发光）
 *   3. 人物头像（有 avatarUrl 时）或橙色圆点（事件时）
 *   4. 底部名称标签（title）
 */

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { useMapContext } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';

export function MapSelectionPulse() {
  const map = useMapContext();
  const mapTooltip = useMapStore((s) => s.mapTooltip);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    // 清除上一个标记
    markerRef.current?.remove();
    markerRef.current = null;

    if (!map || !mapTooltip?.location) return;

    const [lng, lat] = mapTooltip.location;
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;

    const avatar = mapTooltip.avatarUrl;

    // 构建 DOM 结构
    const el = document.createElement('div');
    el.className = 'pulse-container';

    // 地面投影（深色半透明圆环，确保在浅色地图背景下清晰可见）
    const groundShadow = document.createElement('div');
    groundShadow.className = 'pulse-ground-shadow';
    el.appendChild(groundShadow);

    // 脉冲环 × 2（交错延时产生连续波纹效果）
    for (let i = 0; i < 2; i++) {
      const ring = document.createElement('div');
      ring.className = 'pulse-ring';
      ring.style.animationDelay = `${i * 1.1}s`;
      el.appendChild(ring);
    }

    // 白色对比环（内圈白环，确保橙色在任何背景上都有对比）
    const contrastRing = document.createElement('div');
    contrastRing.className = 'pulse-contrast-ring';
    el.appendChild(contrastRing);

    // 中心内容：头像或圆点
    const inner = document.createElement('div');
    inner.className = 'pulse-inner';
    if (avatar) {
      const img = document.createElement('img');
      img.className = 'pulse-avatar';
      img.src = avatar;
      img.alt = '';
      img.onerror = () => { img.style.display = 'none'; };
      inner.appendChild(img);
    }
    el.appendChild(inner);

    // 名称标签
    const label = document.createElement('div');
    label.className = 'pulse-label';
    label.textContent = mapTooltip.title;
    el.appendChild(label);

    const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
      .setLngLat([lng, lat])
      .addTo(map);
    markerRef.current = marker;

    return () => {
      marker.remove();
      if (markerRef.current === marker) markerRef.current = null;
    };
  }, [map, mapTooltip?.id, mapTooltip?.location?.[0], mapTooltip?.location?.[1], mapTooltip?.avatarUrl, mapTooltip?.title]);

  return (
    <style jsx global>{`
      .pulse-container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        pointer-events: none;
        width: 0;
        height: 0;
        z-index: 100;
      }

      /* 地面投影 — 深色半透明背景层，确保在浅色/沙漠地图上脉冲可见 */
      .pulse-ground-shadow {
        position: absolute;
        top: -16px;
        left: -16px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.35);
        filter: blur(4px);
        animation: pulse-glow 1.5s ease-in-out infinite;
        pointer-events: none;
      }

      .pulse-ring {
        position: absolute;
        top: -14px;
        left: -14px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2.5px solid #f59e0b;
        background: transparent;
        animation: pulse-expand 2.2s ease-out infinite;
        pointer-events: none;
        /* 多层级 shadow 确保在任何背景上都有对比 */
        box-shadow:
          0 0 0 1px rgba(255, 255, 255, 0.3),
          0 0 8px rgba(245, 158, 11, 0.5),
          0 0 20px rgba(245, 158, 11, 0.2);
      }

      @keyframes pulse-expand {
        0% {
          transform: scale(0.5);
          opacity: 1;
        }
        100% {
          transform: scale(3.2);
          opacity: 0;
        }
      }

      /* 白色对比环 — 始终在橙色环背后确保边界清晰 */
      .pulse-contrast-ring {
        position: absolute;
        top: -15px;
        left: -15px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, 0.5);
        background: transparent;
        pointer-events: none;
        animation: pulse-glow 1.5s ease-in-out infinite;
      }

      .pulse-inner {
        position: absolute;
        top: -10px;
        left: -10px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: rgba(245, 158, 11, 0.9);
        border: 2.5px solid #fbbf24;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: pulse-glow 1.5s ease-in-out infinite;
        overflow: hidden;
        /* 双层 shadow 提升对比度 */
        box-shadow:
          0 0 0 2px rgba(0, 0, 0, 0.3),
          0 0 12px rgba(245, 158, 11, 0.6);
      }

      @keyframes pulse-glow {
        0%, 100% {
          box-shadow:
            0 0 0 2px rgba(0, 0, 0, 0.3),
            0 0 6px rgba(245, 158, 11, 0.5),
            0 0 14px rgba(245, 158, 11, 0.25);
        }
        50% {
          box-shadow:
            0 0 0 2px rgba(0, 0, 0, 0.3),
            0 0 12px rgba(245, 158, 11, 0.75),
            0 0 28px rgba(245, 158, 11, 0.4);
        }
      }

      .pulse-avatar {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        object-fit: cover;
        display: block;
      }

      .pulse-label {
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
        font-size: 12px;
        font-weight: 700;
        color: #fff;
        text-shadow:
          0 0 6px rgba(0,0,0,0.95),
          0 0 12px rgba(0,0,0,0.7);
        background: rgba(10, 14, 23, 0.85);
        padding: 2px 10px;
        border-radius: 999px;
        border: 1px solid rgba(245, 158, 11, 0.5);
        max-width: 220px;
        overflow: hidden;
        text-overflow: ellipsis;
        pointer-events: none;
        backdrop-filter: blur(6px);
      }
    `}</style>
  );
}
