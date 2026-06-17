'use client';

/**
 * 3D 地球（Globe）控制器 + 太空视觉增强 — 三位一体 PRD 决策点 #2
 *
 * 触发：手动开关 globe=true，或进入 🛰 宇宙空间层（space tier）。
 * 投影重应用逻辑见 `src/lib/map/globeProjection.ts`（style.load 后 idle 阶段）。
 */

import { useEffect } from 'react';
import { useMapContext, useMapStyleEpoch } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { syncGlobeState } from '@/lib/map/globeProjection';

export { isGlobeSupported } from '@/lib/map/globeProjection';

export function GlobeController() {
  const map = useMapContext();
  const styleEpoch = useMapStyleEpoch();
  const globe = useMapStore((s) => s.globe);
  const activeTier = useMapStore((s) => s.activeTier);

  useEffect(() => {
    if (!map) return;
    syncGlobeState(map, globe, activeTier);
  }, [map, globe, activeTier, styleEpoch]);

  return null;
}
