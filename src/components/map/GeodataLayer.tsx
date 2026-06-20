'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import type { Feature, FeatureCollection } from 'geojson';
import { useMapContext, useMapStyleEpoch } from '@/context/MapContext';
import { useGeodataContext } from '@/context/GeodataContext';
import { useMapStore } from '@/store/useMapStore';
import { registerMarkerSprites } from '@/lib/map/emojiSprites';
import type { EventDetail, GeodataResponse, GeoJSONFeature, ImpactLevel } from '@/types/geo';

const POINT_SOURCE = 'geodata-api';
const LINE_SOURCE = 'geodata-api-lines';
const HALO_LAYER = 'geodata-api-halo';
const CORE_LAYER = 'geodata-api-core';
const SYMBOL_LAYER = 'geodata-api-symbols';
const CLUSTER_CIRCLE = 'geodata-api-cluster';
const CLUSTER_COUNT = 'geodata-api-cluster-count';
/** 未聚合单点过滤（避免簇点进入单点图层） */
const NOT_CLUSTER: maplibregl.FilterSpecification = ['!', ['has', 'point_count']];
/** 实线（海缆/管线等）— line-dasharray 不支持 feature 表达式，须分图层 */
const LINE_LAYER_SOLID = 'geodata-api-lines-solid';
const LINE_LAYER_DAYNIGHT = 'geodata-api-lines-daynight';
const LINE_LAYER_PLANNED = 'geodata-api-lines-planned';
const LINE_LAYERS = [LINE_LAYER_SOLID, LINE_LAYER_DAYNIGHT, LINE_LAYER_PLANNED] as const;
const POINT_INTERACTIVE_LAYERS = [SYMBOL_LAYER, CORE_LAYER, HALO_LAYER] as const;
const LINE_INTERACTIVE_LAYERS = LINE_LAYERS;

/** line-dasharray 仅支持 zoom 常量，不能按 feature 分支 */
const LINE_WIDTH_BY_ZOOM = (base: number): maplibregl.ExpressionSpecification => [
  'interpolate',
  ['linear'],
  ['zoom'],
  2,
  base * 0.75,
  5,
  base,
  8,
  base * 1.25,
  12,
  base * 1.5,
];

const POPUP_BG = '#0A0E17';

/** 强制深色弹窗：兜底覆盖 maplibre 默认白底（page.css 曾晚于 globals 加载） */
function applyGeodataPopupTheme(popup: maplibregl.Popup) {
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

  const close = root.querySelector('.maplibregl-popup-close-button');
  if (close instanceof HTMLElement) {
    close.style.setProperty('color', '#e6edf3', 'important');
  }
}

function splitFeatures(features: GeoJSONFeature[] | undefined): {
  points: FeatureCollection;
  lines: FeatureCollection;
} {
  const points: Feature[] = [];
  const lines: Feature[] = [];

  for (const f of features ?? []) {
    const feature: Feature = {
      ...f,
      properties: f.properties ?? {},
    };
    if (f.geometry.type === 'LineString') {
      lines.push(feature);
    } else {
      points.push(feature);
    }
  }

  return {
    points: { type: 'FeatureCollection', features: points },
    lines: { type: 'FeatureCollection', features: lines },
  };
}

function featureProps(p: Record<string, unknown> | undefined) {
  const lng = Number(p?.lng ?? 0);
  const lat = Number(p?.lat ?? 0);
  const impactRaw = String(p?.impact ?? '');
  const impact_level: ImpactLevel =
    impactRaw === 'critical' ||
    impactRaw === 'high' ||
    impactRaw === 'medium' ||
    impactRaw === 'low'
      ? (impactRaw as ImpactLevel)
      : 'medium';

  return {
    lng,
    lat,
    impact_level,
    link: String(p?.link ?? ''),
    production: String(p?.production ?? ''),
    ftype: String(p?.ftype ?? ''),
    nuclearKindLabel: String(p?.nuclearKindLabel ?? ''),
    nuclearStatus: String(p?.nuclearStatus ?? ''),
    weapons: String(p?.weapons ?? ''),
    troop: String(p?.troop ?? ''),
    forces: String(p?.forces ?? ''),
    baseDesc: String(p?.description ?? ''),
    markerLabel: String(p?.markerLabel ?? ''),
    markerEmoji: String(p?.markerEmoji ?? ''),
    personAvatar: String(p?.personAvatar ?? ''),
	    selected: {
	      id: String(p?.id ?? ''),
	      title: String(p?.title ?? ''),
	      source: String(p?.source ?? ''),
	      timestamp: String(p?.timestamp ?? ''),
	      location: [lng, lat] as [number, number],
	      impact_level,
	      category: String(p?.category ?? p?.layerId ?? 'conflicts'),
	      description: '',
	      avatarUrl: p?.personAvatar ? String(p.personAvatar) : undefined,
	    } satisfies EventDetail,
  };
}

/**
 * 统一 GeoJSON 图层：点标记（图标 + 光晕）+ 线要素（海缆/管线等），消费 /api/geodata
 */
export function GeodataLayer() {
  const map = useMapContext();
  const styleEpoch = useMapStyleEpoch();
  const { data } = useGeodataContext();
  const selectEvent = useMapStore((s) => s.selectEvent);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const lastFeaturesKeyRef = useRef('');
  // 避免每次 SWR 重校验都无条件调用 setLayoutProperty 触发地图重排
  const lastShowPointsRef = useRef<boolean | null>(null);
  const lastShowLinesRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (!map) return;

    const showPopup = (
      lng: number,
      lat: number,
      selected: EventDetail,
      extras: {
        markerEmoji: string;
        markerLabel: string;
        nuclearMeta: string;
        production: string;
        ftype: string;
        troop: string;
        weapons: string;
        forces: string;
        baseDesc: string;
        link: string;
        personAvatar: string;
      },
    ) => {
      const dateStr = selected.timestamp
        ? selected.timestamp.slice(0, 16).replace('T', ' ')
        : '';

      map.flyTo({
        center: selected.location,
        zoom: Math.max(map.getZoom(), 4.2),
        duration: 800,
      });

      popupRef.current?.remove();
      popupRef.current = new maplibregl.Popup({
        closeButton: true,
        offset: 12,
        maxWidth: '280px',
        className: 'geodata-popup',
      })
        .setLngLat({ lng, lat })
        .setHTML(
          `<div style="font-size:12px;color:#e6edf3;background:transparent">
             <div style="display:flex;align-items:center;gap:8px">
               ${extras.personAvatar ? `<img src="${extras.personAvatar}" alt="" width="36" height="36" style="width:36px;height:36px;border-radius:50%;object-fit:cover;flex-shrink:0;background:rgba(255,255,255,0.1)" onerror="this.style.display='none'" />` : extras.markerEmoji ? `<span style="font-size:18px;line-height:1">${extras.markerEmoji}</span>` : ''}
               <span style="font-weight:600;color:#e6edf3">${selected.title}</span>
             </div>
             ${extras.markerLabel ? `<div style="color:#a855f7;margin-top:4px">${extras.markerLabel}</div>` : ''}
             <div style="color:#8b949e;margin-top:2px">${dateStr}${selected.source ? ' · ' + selected.source : ''}</div>
             ${extras.nuclearMeta ? `<div style="color:#c4b5fd;margin-top:4px">${extras.nuclearMeta}</div>` : ''}
             ${extras.production ? `<div style="color:#8b949e;margin-top:4px">${extras.production}</div>` : ''}
             ${extras.ftype && !extras.nuclearMeta ? `<div style="color:#8b949e;margin-top:2px">${extras.ftype}${extras.troop ? ' · ' + extras.troop : ''}</div>` : ''}
             ${extras.weapons ? `<div style="margin-top:4px;color:#c4b5fd">${extras.weapons}</div>` : ''}
             ${extras.forces ? `<div style="margin-top:4px">${extras.forces}</div>` : ''}
             ${extras.baseDesc ? `<div style="margin-top:4px;line-height:1.4;white-space:pre-line">${extras.baseDesc}</div>` : !extras.nuclearMeta && selected.description ? `<div style="margin-top:4px;line-height:1.4;white-space:pre-line">${selected.description}</div>` : ''}
             ${extras.link ? `<a href="${extras.link}" target="_blank" rel="noopener" style="color:#22d3ee;margin-top:4px;display:inline-block">查看原文 ↗</a>` : ''}
           </div>`,
        )
        .addTo(map);
      if (popupRef.current) applyGeodataPopupTheme(popupRef.current);
    };

    const onPointClick = (e: maplibregl.MapLayerMouseEvent) => {
      const p = e.features?.[0]?.properties as Record<string, unknown> | undefined;
      if (!p) return;

      const info = featureProps(p);
      const nuclearMeta = [info.nuclearKindLabel, info.nuclearStatus].filter(Boolean).join(' · ');
      const description = nuclearMeta
        ? info.baseDesc
          ? `${nuclearMeta}\n${info.baseDesc}`
          : nuclearMeta
        : info.baseDesc;

      const selected: EventDetail = { ...info.selected, description };
      selectEvent(selected);
      showPopup(info.lng, info.lat, selected, {
        markerEmoji: info.markerEmoji,
        markerLabel: info.markerLabel,
        nuclearMeta,
        production: info.production,
        ftype: info.ftype,
        troop: info.troop,
        weapons: info.weapons,
        forces: info.forces,
        baseDesc: info.baseDesc,
        link: info.link,
        personAvatar: info.personAvatar,
      });
    };

    const onLineClick = (e: maplibregl.MapLayerMouseEvent) => {
      const p = e.features?.[0]?.properties as Record<string, unknown> | undefined;
      if (!p) return;

      const info = featureProps(p);
      const selected: EventDetail = { ...info.selected, description: info.baseDesc };
      selectEvent(selected);
      showPopup(info.lng, info.lat, selected, {
        markerEmoji: info.markerEmoji,
        markerLabel: info.markerLabel,
        nuclearMeta: '',
        production: info.production,
        ftype: info.ftype,
        troop: info.troop,
        weapons: info.weapons,
        forces: info.forces,
        baseDesc: info.baseDesc,
        link: info.link,
        personAvatar: info.personAvatar,
      });
    };

    const onEnter = () => {
      map.getCanvas().style.cursor = 'pointer';
    };
    const onLeave = () => {
      map.getCanvas().style.cursor = '';
    };

    const setup = () => {
      try {
        registerMarkerSprites(map);

        if (!map.getSource(POINT_SOURCE)) {
          map.addSource(POINT_SOURCE, {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] },
            // 低 zoom 聚合为带计数的簇（WorldMonitor 数字圆），zoom>6 拆为单点
            cluster: true,
            clusterMaxZoom: 6,
            clusterRadius: 46,
          });
        }

        if (!map.getSource(LINE_SOURCE)) {
          map.addSource(LINE_SOURCE, {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] },
          });
        }

        // 旧版线图层 id 与 source 同名，addLayer 会静默失败导致线要素永不渲染
        if (map.getLayer('geodata-api-lines')) {
          map.removeLayer('geodata-api-lines');
        }

        const lineLayout: maplibregl.LineLayerSpecification['layout'] = {
          visibility: 'none',
          'line-cap': 'round',
          'line-join': 'round',
        };

        const ensureLayer = (id: string, spec: maplibregl.AddLayerObject) => {
          if (!map.getLayer(id)) map.addLayer(spec);
        };

        ensureLayer(LINE_LAYER_SOLID, {
          id: LINE_LAYER_SOLID,
          type: 'line',
          source: LINE_SOURCE,
          filter: [
            'all',
            ['!=', ['get', 'layerId'], 'daynight'],
            ['!=', ['get', 'planned'], true],
          ],
          layout: lineLayout,
          paint: {
            'line-color': ['coalesce', ['get', 'lineColor'], '#22d3ee'],
            'line-width': LINE_WIDTH_BY_ZOOM(1.5),
            'line-opacity': ['coalesce', ['get', 'opacity'], 0.8],
          },
        });

        ensureLayer(LINE_LAYER_DAYNIGHT, {
          id: LINE_LAYER_DAYNIGHT,
          type: 'line',
          source: LINE_SOURCE,
          filter: ['==', ['get', 'layerId'], 'daynight'],
          layout: lineLayout,
          paint: {
            'line-color': ['coalesce', ['get', 'lineColor'], '#fbbf24'],
            'line-width': LINE_WIDTH_BY_ZOOM(2),
            'line-opacity': ['coalesce', ['get', 'opacity'], 0.85],
            'line-dasharray': [5, 3],
          },
        });

        ensureLayer(LINE_LAYER_PLANNED, {
          id: LINE_LAYER_PLANNED,
          type: 'line',
          source: LINE_SOURCE,
          filter: ['==', ['get', 'planned'], true],
          layout: lineLayout,
          paint: {
            'line-color': ['coalesce', ['get', 'lineColor'], '#22d3ee'],
            'line-width': LINE_WIDTH_BY_ZOOM(1.5),
            'line-opacity': ['coalesce', ['get', 'opacity'], 0.55],
            'line-dasharray': [2, 2],
          },
        });

        ensureLayer(HALO_LAYER, {
          id: HALO_LAYER,
          type: 'circle',
          source: POINT_SOURCE,
          filter: NOT_CLUSTER,
          layout: { visibility: 'none' },
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              3,
              [
                'match',
                ['get', 'impact'],
                'critical',
                14,
                'high',
                12,
                'medium',
                10,
                'low',
                8,
                10,
              ],
              8,
              [
                'match',
                ['get', 'impact'],
                'critical',
                22,
                'high',
                18,
                'medium',
                15,
                'low',
                12,
                14,
              ],
            ],
            'circle-color': ['get', 'haloColor'],
            'circle-opacity': ['*', ['get', 'opacity'], 0.28],
            'circle-blur': 0.65,
          },
        });

        // 量级实色圆点（WorldMonitor 风格主视觉）：按 impact 缩放 + 深色描边
        ensureLayer(CORE_LAYER, {
          id: CORE_LAYER,
          type: 'circle',
          source: POINT_SOURCE,
          filter: NOT_CLUSTER,
          layout: { visibility: 'none' },
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              3,
              ['match', ['get', 'impact'], 'critical', 6, 'high', 5, 'medium', 4, 'low', 3, 4],
              8,
              ['match', ['get', 'impact'], 'critical', 11, 'high', 9, 'medium', 7, 'low', 5.5, 7],
            ],
            'circle-color': ['get', 'haloColor'],
            'circle-opacity': ['*', ['get', 'opacity'], 0.96],
            'circle-stroke-width': 1.2,
            'circle-stroke-color': '#0A0E17',
            'circle-stroke-opacity': 0.85,
          },
        });

        // emoji 仅在放大后浮现（缩放门控）：低 zoom 呈纯色量级点，高 zoom 显语义图标
        ensureLayer(SYMBOL_LAYER, {
          id: SYMBOL_LAYER,
          type: 'symbol',
          source: POINT_SOURCE,
          filter: NOT_CLUSTER,
          layout: {
            visibility: 'none',
            'icon-image': ['get', 'markerImageId'],
            'icon-size': [
              'interpolate',
              ['linear'],
              ['zoom'],
              4.5,
              0,
              5.5,
              0.5,
              10,
              0.72,
              14,
              0.9,
            ],
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
          },
          paint: {
            'icon-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              4.5,
              0,
              5.5,
              ['get', 'opacity'],
            ],
          },
        });

        // 聚合簇圆（WorldMonitor 数字圆）：按簇内点数缩放/配色
        ensureLayer(CLUSTER_CIRCLE, {
          id: CLUSTER_CIRCLE,
          type: 'circle',
          source: POINT_SOURCE,
          filter: ['has', 'point_count'],
          layout: { visibility: 'none' },
          paint: {
            'circle-radius': ['step', ['get', 'point_count'], 13, 10, 17, 30, 22, 100, 28],
            'circle-color': ['step', ['get', 'point_count'], '#0ea5e9', 10, '#22d3ee', 30, '#f59e0b', 100, '#ef4444'],
            'circle-opacity': 0.82,
            'circle-stroke-width': 1.5,
            'circle-stroke-color': '#0A0E17',
            'circle-blur': 0.15,
          },
        });
        ensureLayer(CLUSTER_COUNT, {
          id: CLUSTER_COUNT,
          type: 'symbol',
          source: POINT_SOURCE,
          filter: ['has', 'point_count'],
          layout: {
            visibility: 'none',
            'text-field': ['get', 'point_count_abbreviated'],
            'text-size': ['step', ['get', 'point_count'], 11, 30, 13, 100, 15],
            'text-allow-overlap': true,
            'text-ignore-placement': true,
          },
          paint: {
            'text-color': '#ffffff',
            'text-halo-color': '#0A0E17',
            'text-halo-width': 1.2,
          },
        });

        type MapWithListeners = maplibregl.Map & { __geodataListeners?: boolean };
        const mapWithListeners = map as MapWithListeners;
        if (mapWithListeners.__geodataListeners) return;
        mapWithListeners.__geodataListeners = true;

        // 点击簇：展开到合适缩放
        const onClusterClick = (
          e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] },
        ) => {
          const f = e.features?.[0];
          const clusterId = f?.properties?.cluster_id;
          const src = map.getSource(POINT_SOURCE) as maplibregl.GeoJSONSource | undefined;
          if (clusterId == null || !src) return;
          const coords = (f!.geometry as unknown as { coordinates: [number, number] }).coordinates;
          src
            .getClusterExpansionZoom(clusterId)
            .then((z) => map.easeTo({ center: coords, zoom: Math.min((z ?? map.getZoom()) + 0.3, 9) }))
            .catch(() => {});
        };
        map.on('click', CLUSTER_CIRCLE, onClusterClick);
        map.on('mouseenter', CLUSTER_CIRCLE, onEnter);
        map.on('mouseleave', CLUSTER_CIRCLE, onLeave);

        for (const layerId of POINT_INTERACTIVE_LAYERS) {
          map.on('click', layerId, onPointClick);
          map.on('mouseenter', layerId, onEnter);
          map.on('mouseleave', layerId, onLeave);
        }
        for (const layerId of LINE_INTERACTIVE_LAYERS) {
          map.on('click', layerId, onLineClick);
          map.on('mouseenter', layerId, onEnter);
          map.on('mouseleave', layerId, onLeave);
        }
      } catch {
        /* 样式未就绪 */
      }
    };

    if (map.isStyleLoaded()) setup();
    map.on('style.load', setup);
    // 兜底重试：底图 setStyle（如切换洋底/宇宙层）后样式异步加载，
    // styleEpoch 触发的重建可能赶在样式就绪前被跳过，且 style.load 已触发过不会再响应 → 图层永不重建。
    const tSetup1 = window.setTimeout(setup, 120);
    const tSetup2 = window.setTimeout(setup, 500);

    return () => {
      map.off('style.load', setup);
      window.clearTimeout(tSetup1);
      window.clearTimeout(tSetup2);
      popupRef.current?.remove();
      popupRef.current = null;
      try {
        for (const layerId of POINT_INTERACTIVE_LAYERS) {
          map.off('click', layerId, onPointClick);
          map.off('mouseenter', layerId, onEnter);
          map.off('mouseleave', layerId, onLeave);
        }
        for (const layerId of LINE_INTERACTIVE_LAYERS) {
          map.off('click', layerId, onLineClick);
          map.off('mouseenter', layerId, onEnter);
          map.off('mouseleave', layerId, onLeave);
        }
        if (map.getLayer(CLUSTER_COUNT)) map.removeLayer(CLUSTER_COUNT);
        if (map.getLayer(CLUSTER_CIRCLE)) map.removeLayer(CLUSTER_CIRCLE);
        if (map.getLayer(SYMBOL_LAYER)) map.removeLayer(SYMBOL_LAYER);
        if (map.getLayer(CORE_LAYER)) map.removeLayer(CORE_LAYER);
        if (map.getLayer(HALO_LAYER)) map.removeLayer(HALO_LAYER);
        for (const layerId of LINE_LAYERS) {
          if (map.getLayer(layerId)) map.removeLayer(layerId);
        }
        if (map.getSource(POINT_SOURCE)) map.removeSource(POINT_SOURCE);
        if (map.getSource(LINE_SOURCE)) map.removeSource(LINE_SOURCE);
        delete (map as maplibregl.Map & { __geodataListeners?: boolean }).__geodataListeners;
      } catch {
        /* map 已销毁 */
      }
    };
  }, [map, selectEvent, styleEpoch]);

  useEffect(() => {
    lastFeaturesKeyRef.current = '';
    lastShowPointsRef.current = null;
    lastShowLinesRef.current = null;
  }, [styleEpoch]);

  useEffect(() => {
    if (!map) return;

    const featuresKey = `${data?.meta?.generatedAt ?? ''}:${data?.features?.length ?? 0}`;
    const { points, lines } = splitFeatures(data?.features);
    const showPoints = points.features.length > 0;
    const showLines = lines.features.length > 0;

    const apply = () => {
      try {
        const pointSrc = map.getSource(POINT_SOURCE) as maplibregl.GeoJSONSource | undefined;
        const lineSrc = map.getSource(LINE_SOURCE) as maplibregl.GeoJSONSource | undefined;
        if (!pointSrc || !lineSrc) return;

        if (featuresKey !== lastFeaturesKeyRef.current) {
          pointSrc.setData(points);
          lineSrc.setData(lines);
          lastFeaturesKeyRef.current = featuresKey;
        }

        // 仅在显隐状态确实变化时才调用 setLayoutProperty，避免每次 SWR 重校验都触发地图重排
        if (showPoints !== lastShowPointsRef.current) {
          lastShowPointsRef.current = showPoints;
          const vis = showPoints ? 'visible' : 'none';
          if (map.getLayer(SYMBOL_LAYER)) {
            map.setLayoutProperty(SYMBOL_LAYER, 'visibility', vis);
          }
          if (map.getLayer(HALO_LAYER)) {
            map.setLayoutProperty(HALO_LAYER, 'visibility', vis);
          }
          if (map.getLayer(CORE_LAYER)) {
            map.setLayoutProperty(CORE_LAYER, 'visibility', vis);
          }
          if (map.getLayer(CLUSTER_CIRCLE)) {
            map.setLayoutProperty(CLUSTER_CIRCLE, 'visibility', vis);
          }
          if (map.getLayer(CLUSTER_COUNT)) {
            map.setLayoutProperty(CLUSTER_COUNT, 'visibility', vis);
          }
        }
        if (showLines !== lastShowLinesRef.current) {
          lastShowLinesRef.current = showLines;
          const vis = showLines ? 'visible' : 'none';
          for (const layerId of LINE_LAYERS) {
            if (map.getLayer(layerId)) {
              map.setLayoutProperty(layerId, 'visibility', vis);
            }
          }
        }
      } catch {
        /* */
      }
    };

    if (map.isStyleLoaded()) apply();
    map.on('style.load', apply);
    // 兜底重试：与 setup 同理，确保底图切换后数据/显隐被重新应用
    const tApply1 = window.setTimeout(apply, 160);
    const tApply2 = window.setTimeout(apply, 560);

    return () => {
      map.off('style.load', apply);
      window.clearTimeout(tApply1);
      window.clearTimeout(tApply2);
    };
  }, [map, data, styleEpoch]);

  return null;
}
