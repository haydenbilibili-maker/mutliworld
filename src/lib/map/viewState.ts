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

/**
 * moveend → setViewport 的配对防抖
 *
 * 原来的单 boolean 存在竞态：当 setViewport 因容差返回 {}（center/zoom 未实质变化）
 * 时标记残留，下一次合法 flyTo 被误吞。
 *
 * 改用 center/zoom 配对：mark 时记录坐标，consume 时只在与记录的坐标匹配时才返回 true，
 * 不匹配则说明 flyTo 由外部触发，应正常执行。
 */

interface ViewportSnapshot {
  center: [number, number];
  zoom: number;
}

let lastSyncFromMap: ViewportSnapshot | null = null;

/** moveend 回写 store 前调用——记录本次地图操作的目标视野 */
export function markViewportSyncFromMap(center: [number, number], zoom: number): void {
  lastSyncFromMap = { center, zoom };
}

/**
 * flyTo effect 中调用——若当前 center/zoom 与 moveend 记录的匹配，说明此 effect
 * 由 map→store 同步触发，跳过 flyTo；否则说明由外部触发（点击事件/URL恢复等），允许 flyTo。
 */
export function consumeViewportSyncFromMap(
  center: [number, number],
  zoom: number,
): boolean {
  if (!lastSyncFromMap) return false;
  const match =
    centersEqual(lastSyncFromMap.center, center) &&
    zoomsEqual(lastSyncFromMap.zoom, zoom);
  if (match) lastSyncFromMap = null; // 配对成功，消费
  return match;
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
