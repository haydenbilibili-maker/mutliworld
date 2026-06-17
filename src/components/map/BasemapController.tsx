'use client';

/**
 * 按空间层切换底图样式：
 * - 洋底 → OpenFreeMap Fiord 自然地理 + 可选 DEM 地形增强
 * - 地表/宇宙 → 卫星 / 政区 / 混合（BasemapMode 切换）
 */

import { useEffect, useRef } from 'react';
import { useMapContext, useBumpMapStyleEpoch } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { getTier } from '@/tiers';
import type { BasemapMode, BasemapPreset } from '@/types/tier';
import {
  applyBasemapZoomConstraints,
  applyTerrainEnhancement,
  clearTerrainEnhancement,
  isTerrainPreset,
  isTerrainEnhanceEnabled,
  resolveBasemapStyle,
  shouldSkipImageryStyleSwap,
} from '@/lib/map/basemap';
import { syncGlobeState } from '@/lib/map/globeProjection';

function applyBasemap(
  map: NonNullable<ReturnType<typeof useMapContext>>,
  preset: BasemapPreset,
  mode: BasemapMode,
  bumpStyleEpoch: () => void,
) {
  const style = resolveBasemapStyle(preset, mode);
  const terrainEnhance = isTerrainPreset(preset) && isTerrainEnhanceEnabled();

  const onStyleReady = () => {
    try {
      applyBasemapZoomConstraints(map, preset, mode);
      if (terrainEnhance && typeof style === 'string') {
        applyTerrainEnhancement(map);
      } else {
        clearTerrainEnhancement(map);
      }
      const { globe, activeTier: tier } = useMapStore.getState();
      syncGlobeState(map, globe, tier);
    } catch {
      /* */
    }
    bumpStyleEpoch();
  };

  try {
    if (typeof style === 'string') {
      map.setStyle(style);
    } else {
      clearTerrainEnhancement(map);
      map.setStyle(style);
    }
    map.once('style.load', onStyleReady);
  } catch {
    /* 地图销毁中 */
  }
}

export function BasemapController() {
  const map = useMapContext();
  const bumpStyleEpoch = useBumpMapStyleEpoch();
  const activeTier = useMapStore((s) => s.activeTier);
  const basemapMode = useMapStore((s) => s.basemapMode);
  const prevTierRef = useRef(activeTier);
  const prevModeRef = useRef(basemapMode);
  const prevPresetRef = useRef<BasemapPreset>(
    getTier(activeTier)?.basemap ?? 'imagery',
  );

  useEffect(() => {
    if (!map) return;

    const preset = getTier(activeTier)?.basemap ?? 'imagery';
    const tierChanged = prevTierRef.current !== activeTier;
    const modeChanged = prevModeRef.current !== basemapMode;
    const prevPreset = prevPresetRef.current;
    const prevMode = prevModeRef.current;

    if (!tierChanged && !modeChanged) return;

    prevTierRef.current = activeTier;
    prevModeRef.current = basemapMode;
    prevPresetRef.current = preset;

    if (
      tierChanged &&
      !modeChanged &&
      shouldSkipImageryStyleSwap(prevPreset, preset, prevMode, basemapMode)
    ) {
      const { globe } = useMapStore.getState();
      syncGlobeState(map, globe, activeTier);
      return;
    }

    const run = () => applyBasemap(map, preset, basemapMode, bumpStyleEpoch);

    if (map.isStyleLoaded()) run();
    else map.once('load', run);
  }, [map, activeTier, basemapMode, bumpStyleEpoch]);

  return null;
}
