/**
 * 巡视器行进轨迹（traverse）数据源 — 多天体探索 Phase 4
 *
 * 取 NASA MMGIS 公开 waypoints（真实路径点）构建折线。来源为各任务公开发布的航点数据，
 * 不可用时优雅降级、不造假。
 */

import type { BodyLayerId, CelestialBody } from '@/types/body';

export interface TraverseDef {
  id: string;
  body: CelestialBody;
  layer: BodyLayerId; // mars_traverse
  rover: string;
  color: string;
  /** NASA MMGIS waypoints GeoJSON 端点 */
  url: string;
}

export const TRAVERSE_ROVERS: TraverseDef[] = [
  {
    id: 'tr-curiosity',
    body: 'mars',
    layer: 'mars_traverse',
    rover: '好奇号',
    color: '#fb923c',
    url: 'https://mars.nasa.gov/mmgis-maps/MSL/Layers/json/MSL_waypoints.json',
  },
  {
    id: 'tr-perseverance',
    body: 'mars',
    layer: 'mars_traverse',
    rover: '毅力号',
    color: '#f4d08a',
    url: 'https://mars.nasa.gov/mmgis-maps/M20/Layers/json/M20_waypoints.json',
  },
];

export function traverseForBody(body: CelestialBody): TraverseDef[] {
  return TRAVERSE_ROVERS.filter((t) => t.body === body);
}
