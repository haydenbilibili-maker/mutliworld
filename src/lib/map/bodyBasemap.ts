/**
 * 天体底图 — 多天体探索 Phase 0（占位）
 *
 * 月球 / 火星先用纯色球面占位底图（零外部依赖，保证可用）；
 * 真实瓦片（NASA Trek / OpenPlanetaryMap）在 Phase 1 接入。
 */

import type { StyleSpecification } from 'maplibre-gl';
import type { CelestialBody } from '@/types/body';
import { getBody } from '@/bodies';

/** 是否为地球（地球走现有底图逻辑） */
export function isEarthBody(body: CelestialBody): boolean {
  return body === 'earth';
}

/** 构建天体占位底图样式（纯色背景 + 经纬网格占位） */
export function buildBodyStyle(body: CelestialBody): StyleSpecification {
  const mod = getBody(body);
  const color = mod?.basemapColor ?? '#1a1a1f';
  return {
    version: 8,
    name: `omnilens-body-${body}`,
    sources: {},
    layers: [
      {
        id: 'body-bg',
        type: 'background',
        paint: { 'background-color': color },
      },
    ],
  };
}
