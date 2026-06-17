/**
 * 天体探索痕迹聚合 + 图层元信息 — 多天体探索 Phase 1+
 */

import type { BodyLayerId, BodySite, CelestialBody } from '@/types/body';
import { MOON_SITES } from './moon';
import { MARS_SITES } from './mars';
import { orbitersForBody } from '@/bodies/orbiters';
import { traverseForBody } from '@/bodies/traverse';

export const ALL_BODY_SITES: BodySite[] = [...MOON_SITES, ...MARS_SITES];

export function getSitesForBody(body: CelestialBody): BodySite[] {
  return ALL_BODY_SITES.filter((s) => s.body === body);
}

export interface BodyLayerMeta {
  id: BodyLayerId;
  body: CelestialBody;
  label: string;
  color: string;
}

/** 各天体探索图层元信息（颜色用于地图标记与图例） */
export const BODY_LAYER_META: BodyLayerMeta[] = [
  { id: 'moon_apollo', body: 'moon', label: '阿波罗', color: '#60a5fa' },
  { id: 'moon_change', body: 'moon', label: '嫦娥', color: '#f87171' },
  { id: 'moon_legacy', body: 'moon', label: '早期/其他', color: '#fbbf24' },
  { id: 'moon_orbiters', body: 'moon', label: '在轨绕月', color: '#a78bfa' },
  { id: 'mars_rovers', body: 'mars', label: '巡视器', color: '#fb923c' },
  { id: 'mars_landers', body: 'mars', label: '着陆器', color: '#f87171' },
  { id: 'mars_traverse', body: 'mars', label: '行进轨迹', color: '#fbbf24' },
  { id: 'mars_orbiters', body: 'mars', label: '在轨绕火', color: '#a78bfa' },
];

export function bodyLayersFor(body: CelestialBody): BodyLayerMeta[] {
  return BODY_LAYER_META.filter((m) => m.body === body);
}

/** 当前有数据（静态痕迹或在轨名册）的图层（用于显示图例与开关） */
export function populatedLayersFor(body: CelestialBody): BodyLayerId[] {
  const set = new Set(getSitesForBody(body).map((s) => s.layer));
  for (const o of orbitersForBody(body)) set.add(o.layer);
  for (const t of traverseForBody(body)) set.add(t.layer);
  return BODY_LAYER_META.filter((m) => m.body === body && set.has(m.id)).map((m) => m.id);
}
