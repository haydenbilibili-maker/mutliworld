/**
 * 天体底图 — 多天体探索 Phase 1
 *
 * 月球 / 火星接入真实栅格瓦片（OpenPlanetaryMap，可经环境变量覆盖），
 * 并以天体主色作背景兜底：瓦片不可用时仍显示纯色球面，痕迹标记照常渲染（优雅降级）。
 */

import type { StyleSpecification } from 'maplibre-gl';
import type { CelestialBody } from '@/types/body';
import { getBody } from '@/bodies';

/** 默认真实瓦片（OpenPlanetaryMap）；可用 env 覆盖为已确认可用的源 */
const DEFAULT_TILES: Partial<Record<CelestialBody, string>> = {
  moon:
    (process.env.NEXT_PUBLIC_MOON_TILE_URL ?? '').trim() ||
    'https://cartocdn-gusc.global.ssl.fastly.net/opmbuilder/api/v1/map/named/opm-moon-basemap-v0-1/all/{z}/{x}/{y}.png',
  mars:
    (process.env.NEXT_PUBLIC_MARS_TILE_URL ?? '').trim() ||
    'https://cartocdn-gusc.global.ssl.fastly.net/opmbuilder/api/v1/map/named/opm-mars-basemap-v0-2/all/{z}/{x}/{y}.png',
};

const ATTRIBUTION: Partial<Record<CelestialBody, string>> = {
  moon: 'NASA / USGS / OpenPlanetaryMap',
  mars: 'NASA / USGS / OpenPlanetaryMap',
};

export function isEarthBody(body: CelestialBody): boolean {
  return body === 'earth';
}

/** 构建天体底图样式：背景兜底色 + 真实栅格瓦片（若配置） */
export function buildBodyStyle(body: CelestialBody): StyleSpecification {
  const mod = getBody(body);
  const color = mod?.basemapColor ?? '#1a1a1f';
  const tiles = DEFAULT_TILES[body];

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
    name: `omnilens-body-${body}`,
    sources,
    layers,
  };
}
