/**
 * 天体注册表 — 多天体探索 v2.0 Phase 0
 * 导入即注册 地球 / 月球 / 火星；其余代码统一从 '@/bodies' 取 API。
 */

import type { BodyModule, CelestialBody } from '@/types/body';

const earth: BodyModule = {
  id: 'earth',
  name: '地球',
  icon: '🌍',
  tagline: '天 · 地 · 海 三位一体态势',
  center: [105, 28],
  zoom: 3.5,
  basemapColor: '#0A0E17',
  defaultLayers: [],
  enabled: true,
};

const moon: BodyModule = {
  id: 'moon',
  name: '月球',
  icon: '🌙',
  tagline: '阿波罗 · 嫦娥 · 在轨绕月',
  center: [0, 0],
  zoom: 2,
  basemapColor: '#3a3a3e',
  defaultLayers: [],
  enabled: true,
};

const mars: BodyModule = {
  id: 'mars',
  name: '火星',
  icon: '🔴',
  tagline: '巡视器 · 着陆器 · 绕火',
  center: [0, 0],
  zoom: 2,
  basemapColor: '#7a3b2b',
  defaultLayers: [],
  enabled: true,
};

const REGISTRY = new Map<CelestialBody, BodyModule>([
  [earth.id, earth],
  [moon.id, moon],
  [mars.id, mars],
]);

export function getBody(id: CelestialBody): BodyModule | undefined {
  return REGISTRY.get(id);
}

export function listBodies(): BodyModule[] {
  return Array.from(REGISTRY.values()).filter((b) => b.enabled);
}

export const DEFAULT_BODY: CelestialBody = 'earth';
