'use client';

/**
 * 地图标记浮窗 — 点击事件后在地图脉冲点附近显示的信息卡片
 *
 * 交互范式（从左到右信息密度递增）：
 *   左侧筛选栏 → 地图脉冲标记 + 浮窗 → 右侧详情面板
 *   （低密度）     （中密度·概要信息）    （高密度·完整信息）
 *
 * 浮窗显示概要信息，点击「查看详情」打开右侧 SidePanel。
 */

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { useMapContext } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';

export function MapTooltip() {
  const map = useMapContext();
  const tooltip = useMapStore((s) => s.mapTooltip);
  const selectEvent = useMapStore((s) => s.selectEvent);
  const focusOnMap = useMapStore((s) => s.focusOnMap);

  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    markerRef.current?.remove();
    markerRef.current = null;

    if (!map || !tooltip?.location) return;

    const [lng, lat] = tooltip.location;
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;

    // 延迟显示，让脉冲标记先渲染
    const showTimer = setTimeout(() => setVisible(true), 180);

    // 构建浮窗 DOM
    const el = document.createElement('div');
    el.className = 'map-tooltip';
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.25s ease-out';

    // 标题行
    const titleRow = document.createElement('div');
    titleRow.className = 'map-tooltip-title';
    titleRow.textContent = tooltip.title;
    el.appendChild(titleRow);

    // 分类标签
    if (tooltip.category) {
      const cat = document.createElement('div');
      cat.className = 'map-tooltip-category';
      cat.textContent = tooltip.category;
      el.appendChild(cat);
    }

    // 简描述
    if (tooltip.description) {
      const desc = document.createElement('div');
      desc.className = 'map-tooltip-desc';
      desc.textContent = tooltip.description;
      el.appendChild(desc);
    }

    // 影响等级（有 impact_level 时）
    if (tooltip.impact_level && tooltip.impact_level !== 'medium') {
      const impact = document.createElement('div');
      impact.className = `map-tooltip-impact map-tooltip-impact--${tooltip.impact_level}`;
      const labels: Record<string, string> = { low: '低影响', high: '高影响', critical: '重大' };
      impact.textContent = labels[tooltip.impact_level] ?? tooltip.impact_level;
      el.appendChild(impact);
    }

    // 按钮组
    const btnGroup = document.createElement('div');
    btnGroup.className = 'map-tooltip-actions';

    const detailBtn = document.createElement('button');
    detailBtn.type = 'button';
    detailBtn.className = 'map-tooltip-btn map-tooltip-btn--primary';
    detailBtn.textContent = '查看详情 →';
    detailBtn.onclick = (e) => {
      e.stopPropagation();
      // 打开右侧面板，保留地图上的脉冲标记与浮窗
      selectEvent(tooltip);
    };
    btnGroup.appendChild(detailBtn);

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'map-tooltip-btn map-tooltip-btn--close';
    closeBtn.innerHTML = '✕';
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      focusOnMap(null); // 关闭浮窗
    };
    btnGroup.appendChild(closeBtn);

    el.appendChild(btnGroup);

    // 添加到地图（偏移到脉冲点右上方，避免遮挡脉冲）
    const marker = new maplibregl.Marker({
      element: el,
      anchor: 'left',
      offset: [14, -40],
    })
      .setLngLat([lng, lat])
      .addTo(map);
    markerRef.current = marker;

    // 淡入动画
    requestAnimationFrame(() => { el.style.opacity = '1'; });

    return () => {
      clearTimeout(showTimer);
      marker.remove();
      if (markerRef.current === marker) markerRef.current = null;
    };
  }, [map, tooltip?.id, tooltip?.location?.[0], tooltip?.location?.[1], tooltip?.title, tooltip?.description, tooltip?.category, tooltip?.impact_level, selectEvent, focusOnMap]);

  return (
    <style jsx global>{`
      .map-tooltip {
        background: rgba(10, 14, 23, 0.92);
        border: 1px solid rgba(245, 158, 11, 0.35);
        border-radius: 8px;
        padding: 10px 12px;
        min-width: 160px;
        max-width: 260px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,158,11,0.08);
        backdrop-filter: blur(8px);
        pointer-events: auto;
        cursor: default;
      }
      .map-tooltip-title {
        font-size: 12px;
        font-weight: 600;
        color: #e6edf3;
        line-height: 1.4;
        margin-bottom: 4px;
        word-break: break-word;
      }
      .map-tooltip-category {
        font-size: 10px;
        color: #f59e0b;
        margin-bottom: 4px;
      }
      .map-tooltip-desc {
        font-size: 11px;
        color: rgba(230, 237, 243, 0.7);
        line-height: 1.4;
        margin-bottom: 8px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .map-tooltip-impact {
        font-size: 10px;
        margin-bottom: 6px;
        padding: 1px 6px;
        border-radius: 4px;
        display: inline-block;
      }
      .map-tooltip-impact--high {
        color: #f97316;
        background: rgba(249, 115, 22, 0.15);
      }
      .map-tooltip-impact--critical {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.15);
      }
      .map-tooltip-actions {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 2px;
      }
      .map-tooltip-btn {
        border: none;
        border-radius: 6px;
        font-size: 11px;
        padding: 4px 10px;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .map-tooltip-btn--primary {
        background: rgba(245, 158, 11, 0.15);
        color: #f59e0b;
        border: 1px solid rgba(245, 158, 11, 0.3);
      }
      .map-tooltip-btn--primary:hover {
        background: rgba(245, 158, 11, 0.3);
      }
      .map-tooltip-btn--close {
        background: transparent;
        color: rgba(230, 237, 243, 0.5);
        font-size: 13px;
        padding: 4px 6px;
        margin-left: auto;
      }
      .map-tooltip-btn--close:hover {
        color: #e6edf3;
        background: rgba(255,255,255,0.08);
      }
    `}</style>
  );
}
