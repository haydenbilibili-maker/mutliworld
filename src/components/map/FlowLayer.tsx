'use client';

/**
 * 连线流动 — 在海缆/管线/迁徙线上叠加"流光"虚线（ant-line），表现数据/能源/洄游的流动方向。
 *
 * 性能保护：
 *  - 仅在地图静止(idle)时驱动动画，交互(move)期间暂停；
 *  - 页面不可见(visibilitychange)时暂停；
 *  - 尊重 prefers-reduced-motion（关闭动画，仅静态虚线）；
 *  - 约 10fps 步进，限定图层集，控制重绘成本。
 */

import { useEffect } from 'react';
import { useMapContext, useMapStyleEpoch } from '@/context/MapContext';

const LINE_SOURCE = 'geodata-api-lines';
const FLOW_LAYER = 'geodata-flow';
const FLOW_LAYERS = ['cables', 'pipelines', 'migration_routes', 'ocean_currents'];

/** ant-line：循环偏移的 dash 序列，制造流动错觉 */
const DASH_SEQ: number[][] = [
  [0, 4, 3], [0.5, 4, 2.5], [1, 4, 2], [1.5, 4, 1.5],
  [2, 4, 1], [2.5, 4, 0.5], [3, 4, 0], [0, 0.5, 3, 3.5],
];

export function FlowLayer() {
  const map = useMapContext();
  const styleEpoch = useMapStyleEpoch();

  useEffect(() => {
    if (!map) return;
    let cancelled = false;
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const ensure = () => {
      if (cancelled || !map.isStyleLoaded() || !map.getSource(LINE_SOURCE)) return;
      try {
        if (!map.getLayer(FLOW_LAYER)) {
          map.addLayer({
            id: FLOW_LAYER,
            type: 'line',
            source: LINE_SOURCE,
            filter: ['in', ['get', 'layerId'], ['literal', FLOW_LAYERS]],
            layout: { 'line-cap': 'round' },
            paint: {
              'line-color': '#7dd3fc',
              'line-width': ['interpolate', ['linear'], ['zoom'], 2, 0.8, 6, 1.4, 11, 2.2],
              'line-opacity': 0.7,
              'line-dasharray': [0, 4, 3],
            },
          });
        }
      } catch {
        /* 样式未就绪 */
      }
    };

    ensure();
    map.on('style.load', ensure);
    const te1 = window.setTimeout(ensure, 160);
    const te2 = window.setTimeout(ensure, 560);

    // 动画驱动：仅在 idle 且页面可见时步进
    let step = 0;
    let timer: number | null = null;
    let moving = false;

    const tick = () => {
      if (cancelled) return;
      if (!moving && document.visibilityState === 'visible' && map.getLayer(FLOW_LAYER)) {
        step = (step + 1) % DASH_SEQ.length;
        try {
          map.setPaintProperty(FLOW_LAYER, 'line-dasharray', DASH_SEQ[step]);
        } catch {
          /* */
        }
      }
    };

    const start = () => {
      if (reduceMotion || timer != null) return;
      timer = window.setInterval(tick, 100); // ~10fps
    };
    const stop = () => {
      if (timer != null) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    const onMoveStart = () => {
      moving = true;
    };
    const onIdle = () => {
      moving = false;
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') start();
      else stop();
    };

    map.on('movestart', onMoveStart);
    map.on('idle', onIdle);
    document.addEventListener('visibilitychange', onVisibility);
    start();

    return () => {
      cancelled = true;
      stop();
      map.off('style.load', ensure);
      map.off('movestart', onMoveStart);
      map.off('idle', onIdle);
      document.removeEventListener('visibilitychange', onVisibility);
      window.clearTimeout(te1);
      window.clearTimeout(te2);
      try {
        if (map.getLayer(FLOW_LAYER)) map.removeLayer(FLOW_LAYER);
      } catch {
        /* */
      }
    };
  }, [map, styleEpoch]);

  return null;
}
