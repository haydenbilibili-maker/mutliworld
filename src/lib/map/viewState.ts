/** 地图视野比较容差 — 用于 compare-before-set，断开 flyTo ↔ moveend 反馈环 */

import type { LayerId } from '@/types/geo';

export const CENTER_EPS = 1e-4;
export const ZOOM_EPS = 1e-3;

export function centersEqual(
  a: [number, number],
  b: [number, number],
  eps = CENTER_EPS,
): boolean {
  return Math.abs(a[0] - b[0]) < eps && Math.abs(a[1] - b[1]) < eps;
}

export function zoomsEqual(a: number, b: number, eps = ZOOM_EPS): boolean {
  return Math.abs(a - b) < eps;
}

export function layersEqual(a: LayerId[], b: LayerId[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/** CosmicGlobeAnimator 程序化 setBearing 期间为 true，避免 moveend 回写 store */
let programmaticBearing = false;

export function isProgrammaticBearingMove(): boolean {
  return programmaticBearing;
}

export function runProgrammaticBearing(fn: () => void): void {
  programmaticBearing = true;
  try {
    fn();
  } finally {
    programmaticBearing = false;
  }
}
