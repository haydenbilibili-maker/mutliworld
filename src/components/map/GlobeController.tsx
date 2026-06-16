'use client';

/**
 * 3D 地球（Globe）控制器 + 太空视觉增强 — 三位一体 PRD 决策点 #2
 *
 * 通过 maplibre v5 的 `setProjection({type:'globe'})` 启用球面，并叠加大气辉光与透明太空背景。
 * ⚠ 前向兼容：当前依赖 maplibre v4（无 globe）。用「运行时探测 + 可选链」：
 *   仅当 `map.setProjection` 存在（即 v5）才启用球面与太空视觉；v4 下全部 no-op、零视觉变化。
 *   详见 docs/3D地球评估与迁移.md
 *
 * 触发：手动开关 globe=true，或进入 🛰 宇宙空间层（space tier）。
 */

import { useEffect } from 'react';
import { useMapContext } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';

/** v5 才有的能力，用最小结构类型避免依赖 v5 类型定义 */
type ProjectionCapableMap = {
  setProjection?: (p: { type: 'globe' | 'mercator' }) => void;
  setSky?: (sky: Record<string, unknown>) => void;
  setPaintProperty?: (layer: string, prop: string, value: unknown) => void;
  getLayer?: (id: string) => unknown;
  isStyleLoaded?: () => boolean;
  once?: (ev: string, cb: () => void) => void;
};

/** 运行时探测：仅 v5 拥有 setProjection */
export function isGlobeSupported(map: unknown): boolean {
  return typeof (map as ProjectionCapableMap)?.setProjection === 'function';
}

const SPACE_BG = 'rgba(2,6,18,0)'; // 透明，露出星空背景
const FLAT_BG = '#0A0E17';

export function GlobeController() {
  const map = useMapContext();
  const globe = useMapStore((s) => s.globe);
  const activeTier = useMapStore((s) => s.activeTier);
  const wantGlobe = globe || activeTier === 'space';

  useEffect(() => {
    if (!map) return;
    const m = map as unknown as ProjectionCapableMap;
    const supported = isGlobeSupported(m);

    const apply = () => {
      try {
        // 投影（v4：setProjection 不存在 → 跳过）
        m.setProjection?.({ type: wantGlobe ? 'globe' : 'mercator' });

        // 太空视觉仅在 v5 且开启球面时施加，避免影响 v4 平面观感
        if (supported && wantGlobe) {
          m.setSky?.({
            'atmosphere-blend': [
              'interpolate', ['linear'], ['zoom'], 0, 1, 5, 0.5, 7, 0,
            ],
          });
          m.setPaintProperty?.('background', 'background-color', SPACE_BG);
        } else if (supported) {
          // 恢复平面深色底
          m.setPaintProperty?.('background', 'background-color', FLAT_BG);
        }
      } catch {
        /* v4 或样式未就绪：忽略 */
      }
    };

    if (m.isStyleLoaded?.()) apply();
    else m.once?.('load', apply);
  }, [map, wantGlobe]);

  return null;
}
