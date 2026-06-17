/**
 * 天体底图 — 多天体探索
 *
 * 两种模式：
 *  - terrain 地形图：OpenPlanetaryMap 真实地形瓦片（MOLA/LRO，开箱即用，默认）。
 *  - imagery 卫星实拍：写实影像瓦片（Viking/CTX 等），经环境变量配置可用源。
 * 任一不可用时以天体主色作球面兜底，痕迹标记照常渲染（优雅降级）。
 */

import type { StyleSpecification } from 'maplibre-gl';
import type { CelestialBody } from '@/types/body';
import { getBody } from '@/bodies';

export type BodyBasemapMode = 'terrain' | 'imagery';

/** 地形图瓦片（OpenPlanetaryMap，真实地形；可经 env 覆盖） */
const TERRAIN_TILES: Partial<Record<CelestialBody, string>> = {
  moon:
    (process.env.NEXT_PUBLIC_MOON_TILE_URL ?? '').trim() ||
    'https://cartocdn-gusc.global.ssl.fastly.net/opmbuilder/api/v1/map/named/opm-moon-basemap-v0-1/all/{z}/{x}/{y}.png',
  mars:
    (process.env.NEXT_PUBLIC_MARS_TILE_URL ?? '').trim() ||
    'https://cartocdn-gusc.global.ssl.fastly.net/opmbuilder/api/v1/map/named/opm-mars-basemap-v0-2/all/{z}/{x}/{y}.png',
};

/** 卫星实拍瓦片（写实影像；需配置已确认可用的 Web Mercator XYZ 源） */
const IMAGERY_TILES: Partial<Record<CelestialBody, string>> = {
  moon: (process.env.NEXT_PUBLIC_MOON_IMAGERY_URL ?? '').trim(),
  mars: (process.env.NEXT_PUBLIC_MARS_IMAGERY_URL ?? '').trim(),
};

const ATTRIBUTION: Partial<Record<CelestialBody, string>> = {
  moon: 'NASA / USGS / OpenPlanetaryMap',
  mars: 'NASA / USGS / OpenPlanetaryMap',
};

export function isEarthBody(body: CelestialBody): boolean {
  return body === 'earth';
}

/** 该天体在该模式下是否有可用瓦片（imagery 未配置时回落 terrain） */
export function resolveBodyTiles(body: CelestialBody, mode: BodyBasemapMode): string | undefined {
  if (mode === 'imagery' && IMAGERY_TILES[body]) return IMAGERY_TILES[body];
  return TERRAIN_TILES[body];
}

/** 卫星实拍源是否已配置（供 UI 提示） */
export function hasBodyImagery(body: CelestialBody): boolean {
  return Boolean(IMAGERY_TILES[body]);
}

/** 构建天体底图样式：背景兜底色 + 真实栅格瓦片 */
export function buildBodyStyle(body: CelestialBody, mode: BodyBasemapMode = 'terrain'): StyleSpecification {
  const mod = getBody(body);
  const color = mod?.basemapColor ?? '#1a1a1f';
  const tiles = resolveBodyTiles(body, mode);

  const layers: StyleSpecification['layers'] = [
    { id: 'body-bg', type: 'background', paint: { 'background-color': color } },
  ];
  const sources: StyleSpecification['sources'] = {};

  if (tiles) {
    sources['body-raster'] = {
      type: 'raster',
      tiles: [tiles],
      tileSize: 256,
      attribution: ATTRIBUTION[body] ?? '',
    };
    layers.push({ id: 'body-raster', type: 'raster', source: 'body-raster', paint: { 'raster-opacity': 1 } });
  }

  return {
    version: 8,
    name: `omnilens-body-${body}-${mode}`,
    sources,
    layers,
  };
}
