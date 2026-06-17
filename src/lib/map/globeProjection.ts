/**
 * 3D 地球（globe）投影与太空视觉 — 统一切换入口
 *
 * MapLibre v5：`setStyle` 会将投影重置为 mercator，须在 style.load 之后
 * 于 idle 阶段重新应用 globe，否则球面不生效（P0 根因）。
 */

import type { Map as MaplibreMap } from 'maplibre-gl';
import type { SpatialTier } from '@/types/tier';

const SPACE_BG = 'rgba(2,6,18,0)';
const FLAT_BG = '#0A0E17';

const idleHandlers = new WeakMap<MaplibreMap, () => void>();

export function isGlobeSupported(map: unknown): boolean {
  return typeof (map as MaplibreMap)?.setProjection === 'function';
}

export function wantGlobeProjection(globe: boolean, activeTier: SpatialTier): boolean {
  return globe || activeTier === 'space';
}

function currentProjectionType(map: MaplibreMap): string | undefined {
  try {
    const type = map.getProjection?.()?.type;
    return typeof type === 'string' ? type : undefined;
  } catch {
    return undefined;
  }
}

/** 设置 globe / mercator 投影（已在目标投影时跳过，避免重复 setProjection 闪烁） */
export function applyGlobeProjection(map: MaplibreMap, wantGlobe: boolean): boolean {
  if (!isGlobeSupported(map) || !map.isStyleLoaded()) return false;
  const target = wantGlobe ? 'globe' : 'mercator';
  if (currentProjectionType(map) === target) return true;
  try {
    map.setProjection({ type: target });
    return true;
  } catch {
    return false;
  }
}

/** 球面大气与背景：宇宙层透明露出星空；地表/洋底保留样式背景 */
export function applyGlobeVisuals(
  map: MaplibreMap,
  wantGlobe: boolean,
  activeTier: SpatialTier,
): void {
  if (!isGlobeSupported(map) || !map.isStyleLoaded()) return;

  try {
    if (wantGlobe) {
      map.setSky?.({
        'atmosphere-blend': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0,
          1,
          5,
          0.5,
          7,
          0,
        ],
      });
      if (activeTier === 'space' && map.getLayer('background')) {
        map.setPaintProperty('background', 'background-color', SPACE_BG);
      }
    } else if (
      activeTier === 'subsurface' &&
      map.getLayer('background')
    ) {
      map.setPaintProperty('background', 'background-color', FLAT_BG);
    }
  } catch {
    /* 样式未就绪 */
  }
}

function runGlobeSync(
  map: MaplibreMap,
  wantGlobe: boolean,
  activeTier: SpatialTier,
): void {
  applyGlobeProjection(map, wantGlobe);
  applyGlobeVisuals(map, wantGlobe, activeTier);
}

/** 合并 idle 回调，避免瓦片持续加载时重复 schedule 导致投影反复切换 */
function scheduleIdleGlobeSync(
  map: MaplibreMap,
  wantGlobe: boolean,
  activeTier: SpatialTier,
): void {
  const prev = idleHandlers.get(map);
  if (prev) map.off('idle', prev);

  const onIdle = () => {
    idleHandlers.delete(map);
    runGlobeSync(map, wantGlobe, activeTier);
  };
  idleHandlers.set(map, onIdle);
  map.once('idle', onIdle);
}

/** style.load / 底图切换后：重应用投影与视觉（避免被 setStyle 覆盖） */
export function scheduleGlobeSync(
  map: MaplibreMap,
  wantGlobe: boolean,
  activeTier: SpatialTier,
): void {
  if (!map.isStyleLoaded()) {
    map.once('style.load', () => {
      runGlobeSync(map, wantGlobe, activeTier);
      scheduleIdleGlobeSync(map, wantGlobe, activeTier);
    });
    return;
  }

  runGlobeSync(map, wantGlobe, activeTier);
  scheduleIdleGlobeSync(map, wantGlobe, activeTier);
}

export function syncGlobeState(
  map: MaplibreMap,
  globe: boolean,
  activeTier: SpatialTier,
): void {
  const wantGlobe = wantGlobeProjection(globe, activeTier);
  scheduleGlobeSync(map, wantGlobe, activeTier);
}
