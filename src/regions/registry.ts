/**
 * 区域模块注册表 — LIFEOS-005
 *
 * 单一数据源：所有区域在此注册，平台的区域切换 / 地图加载 / 默认视野皆由此驱动。
 */

import type { RegionId, RegionModule } from '@/types/region';

const registry = new Map<RegionId, RegionModule>();

/** 注册一个区域模块（同 id 覆盖） */
export function registerRegion(mod: RegionModule): void {
  registry.set(mod.id, mod);
}

/** 取单个区域 */
export function getRegion(id: RegionId): RegionModule | undefined {
  return registry.get(id);
}

/** 列出全部区域（已启用的排前） */
export function listRegions(): RegionModule[] {
  return Array.from(registry.values()).sort(
    (a, b) => Number(b.enabled) - Number(a.enabled),
  );
}

/** 仅列出已启用区域 */
export function listEnabledRegions(): RegionModule[] {
  return listRegions().filter((r) => r.enabled);
}

/** 平台默认区域 */
export const DEFAULT_REGION_ID: RegionId = 'global';
