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

    const avatar = tooltip.avatarUrl;

    // 延迟显示，让脉冲标记先渲染
    const showTimer = setTimeout(() => setVisible(true), 180);

    // 构建浮窗 DOM
    const el = document.createElement('div');
    el.className = 'map-tooltip';
    el.style.opacity = '0';
    el.style.transform = 'scale(0.85) translateY(-6px)';
    el.style.transition = 'opacity 0.2s ease-out, transform 0.25s ease-out';

    // 头部行：头像（可选）+ 标题
    const header = document.createElement('div');
    header.className = 'map-tooltip-header';

    if (avatar) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'map-tooltip-avatar-wrap';
      const img = document.createElement('img');
      img.className = 'map-tooltip-avatar';
      img.src = avatar;
      img.alt = '';
      img.onerror = function () { this.style.display = 'none'; };
      imgWrap.appendChild(img);
      header.appendChild(imgWrap);
    }

    const titleText = document.createElement('div');
    titleText.className = 'map-tooltip-title';
    titleText.textContent = tooltip.title;
    header.appendChild(titleText);

    el.appendChild(header);

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

    // 添加到地图（偏移到脉冲点右方，避免与脉冲环重叠）
    // 脉冲环最大扩张半径 ≈ 39px，工具放置于右侧 50px 处完全错开
    const marker = new maplibregl.Marker({
      element: el,
      anchor: 'left',
      offset: [50, -30],
    })
      .setLngLat([lng, lat])
      .addTo(map);
    markerRef.current = marker;

    // 淡入 + 缩放入场
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'scale(1) translateY(0)';
    });

    return () => {
      clearTimeout(showTimer);
      marker.remove();
      if (markerRef.current === marker) markerRef.current = null;
    };
  }, [map, tooltip?.id, tooltip?.location?.[0], tooltip?.location?.[1], tooltip?.avatarUrl, tooltip?.title, tooltip?.description, tooltip?.category, tooltip?.impact_level, selectEvent, focusOnMap]);

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
      .map-tooltip-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
      }
      .map-tooltip-avatar-wrap {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 1.5px solid #f59e0b;
        overflow: hidden;
        background: rgba(245, 158, 11, 0.15);
      }
      .map-tooltip-avatar {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        display: block;
      }
      .map-tooltip-title {
        font-size: 12px;
        font-weight: 600;
        color: #e6edf3;
        line-height: 1.4;
        word-break: break-word;
        flex: 1;
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
