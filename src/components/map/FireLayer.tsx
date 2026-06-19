'use client';

/**
 * 实时活跃火点图层 — 地表层（NASA FIRMS VIIRS）
 * 圆点热力：按置信度着色、按火辐射功率(FRP)定大小；点击弹出详情。
 */

import { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import type { FeatureCollection } from 'geojson';
import { useMapContext, useMapStyleEpoch } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { findLiveOverlayBeforeId } from '@/lib/map/basemap';
import { useLiveFires } from '@/hooks/useLiveFires';
import type { EventDetail } from '@/types/geo';

const SOURCE = 'live-fires';
const GLOW = 'live-fires-glow';
const CORE = 'live-fires-core';

const POPUP_BG = '#0A0E17';

type FireProps = {
  id: string;
  frp: number;
  confidence: string;
  brightness: number;
  acqDate: string;
  acqTime: string;
  daynight: string;
  satellite: string;
};

/** 置信度 → 颜色（h 高=红 / n 名义=橙 / l 低=琥珀；数值≥80 红 / ≥50 橙 / 其余琥珀） */
const COLOR_EXPR: maplibregl.ExpressionSpecification = [
  'match',
  ['get', 'confidence'],
  'h', '#ef4444',
  'n', '#f97316',
  'l', '#fbbf24',
  /* default（数值置信度或缺省）*/ '#f97316',
];

/** FRP → 半径（火越强越大） */
const RADIUS_EXPR: maplibregl.ExpressionSpecification = [
  'interpolate',
  ['linear'],
  ['get', 'frp'],
  0, 2.5,
  20, 4,
  100, 6,
  400, 9,
];

function applyPopupTheme(popup: maplibregl.Popup) {
  const root = popup.getElement();
  const content = root?.querySelector('.maplibregl-popup-content');
  if (content instanceof HTMLElement) {
    content.style.setProperty('background', POPUP_BG, 'important');
    content.style.setProperty('color', '#e6edf3', 'important');
    content.style.setProperty('border', '1px solid rgba(255,255,255,0.12)', 'important');
    content.style.setProperty('border-radius', '8px', 'important');
  }
}

const CONF_LABEL: Record<string, string> = { h: '高', n: '名义', l: '低' };

function popupHtml(p: FireProps): string {
  const conf = CONF_LABEL[p.confidence] ?? p.confidence ?? '—';
  const dn = p.daynight === 'D' ? '日' : p.daynight === 'N' ? '夜' : p.daynight;
  return `
    <div style="font-size:13px;line-height:1.5;min-width:11rem">
      <div style="font-weight:600;margin-bottom:4px">🔥 活跃火点</div>
      <div style="font-size:11px;color:#94a3b8;margin-bottom:6px">${p.acqDate} ${p.acqTime} · ${p.satellite} · ${dn}</div>
      <div>火辐射功率：${Math.round(p.frp)} MW</div>
      <div>亮温：${Math.round(p.brightness)} K</div>
      <div>置信度：${conf}</div>
    </div>`;
}

export function FireLayer() {
  const map = useMapContext();
  const styleEpoch = useMapStyleEpoch();
  const activeTier = useMapStore((s) => s.activeTier);
  const activeLayers = useMapStore((s) => s.activeLayers);
  const selectEvent = useMapStore((s) => s.selectEvent);

  const enabled = activeTier === 'surface' && activeLayers.includes('live_fires');
  const { geojson } = useLiveFires(enabled);

  const selectEventRef = useRef(selectEvent);
  selectEventRef.current = selectEvent;
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const lastDataKeyRef = useRef('');

  const dataKey = useMemo(
    () => `${enabled}:${geojson.features.length}`,
    [geojson, enabled],
  );

  // 初始化 source + 圆点图层
  useEffect(() => {
    if (!map) return;
    const setup = () => {
      try {
        if (!map.getSource(SOURCE)) {
          map.addSource(SOURCE, { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
        }
        if (!map.getLayer(GLOW)) {
          map.addLayer(
            {
              id: GLOW,
              type: 'circle',
              source: SOURCE,
              layout: { visibility: 'none' },
              paint: {
                'circle-radius': ['*', RADIUS_EXPR, 2.2],
                'circle-color': COLOR_EXPR,
                'circle-opacity': 0.22,
                'circle-blur': 0.7,
              },
            },
            findLiveOverlayBeforeId(map),
          );
        }
        if (!map.getLayer(CORE)) {
          map.addLayer(
            {
              id: CORE,
              type: 'circle',
              source: SOURCE,
              layout: { visibility: 'none' },
              paint: {
                'circle-radius': RADIUS_EXPR,
                'circle-color': COLOR_EXPR,
                'circle-opacity': 0.95,
                'circle-stroke-width': 0.6,
                'circle-stroke-color': '#1a0a00',
              },
            },
            findLiveOverlayBeforeId(map),
          );
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
      try {
        if (map.getLayer(CORE)) map.removeLayer(CORE);
        if (map.getLayer(GLOW)) map.removeLayer(GLOW);
        if (map.getSource(SOURCE)) map.removeSource(SOURCE);
      } catch {
        /* */
      }
    };
  }, [map, styleEpoch]);

  useEffect(() => {
    lastDataKeyRef.current = '';
  }, [styleEpoch]);

  // 更新数据与显隐
  useEffect(() => {
    if (!map) return;
    const apply = () => {
      try {
        const src = map.getSource(SOURCE) as maplibregl.GeoJSONSource | undefined;
        if (!src || !map.getLayer(CORE) || !map.getLayer(GLOW)) return;
        if (dataKey !== lastDataKeyRef.current) {
          src.setData(geojson as FeatureCollection);
          lastDataKeyRef.current = dataKey;
        }
        const vis = enabled ? 'visible' : 'none';
        map.setLayoutProperty(CORE, 'visibility', vis);
        map.setLayoutProperty(GLOW, 'visibility', vis);
      } catch {
        /* */
      }
    };
    if (map.isStyleLoaded()) apply();
    map.on('style.load', apply);
    return () => {
      map.off('style.load', apply);
    };
  }, [map, enabled, geojson, dataKey, styleEpoch]);

  // 点击交互
  useEffect(() => {
    if (!map) return;
    const onClick = (
      e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] },
    ) => {
      const f = e.features?.[0];
      if (!f?.properties) return;
      const p = f.properties as unknown as FireProps;
      const coords = (f.geometry as { type: string; coordinates: [number, number] }).coordinates;

      popupRef.current?.remove();
      const popup = new maplibregl.Popup({ closeButton: true, closeOnClick: true, offset: 10, className: 'geodata-popup' })
        .setLngLat(coords)
        .setHTML(popupHtml(p))
        .addTo(map);
      applyPopupTheme(popup);
      popupRef.current = popup;

      const detail: EventDetail = {
        id: `fire-${p.id}`,
        title: `🔥 活跃火点 ${Math.round(p.frp)}MW`,
        source: 'NASA FIRMS VIIRS（近实时）',
        timestamp: new Date().toISOString(),
        location: coords,
        impact_level: p.frp >= 100 ? 'high' : 'medium',
        category: 'live_fires',
        description: `${p.acqDate} ${p.acqTime} · 亮温 ${Math.round(p.brightness)}K · 置信度 ${CONF_LABEL[p.confidence] ?? p.confidence}`,
      };
      selectEventRef.current(detail);
    };

	    const onEnter = () => { map.getCanvas().style.cursor = 'pointer'; };
	    const onLeave = () => { map.getCanvas().style.cursor = ''; };
	    const attach = () => {
	      map.on('click', CORE, onClick);
	      map.on('mouseenter', CORE, onEnter);
	      map.on('mouseleave', CORE, onLeave);
	    };
	    if (map.isStyleLoaded()) attach();
	    map.on('style.load', attach);
	    return () => {
	      map.off('style.load', attach);
	      map.off('click', CORE, onClick);
	      map.off('mouseenter', CORE, onEnter);
	      map.off('mouseleave', CORE, onLeave);
	    };
  }, [map, styleEpoch]);

  useEffect(() => () => { popupRef.current?.remove(); }, []);

  return null;
}
