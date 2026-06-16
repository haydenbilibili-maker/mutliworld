/**
 * 空间层注册表 — 三位一体空间态势（仿 regions/registry，结构同构）
 */

import type { SpatialTier, TierModule } from '@/types/tier';

const registry = new Map<SpatialTier, TierModule>();

export function registerTier(mod: TierModule): void {
  registry.set(mod.id, mod);
}

export function getTier(id: SpatialTier): TierModule | undefined {
  return registry.get(id);
}

/** 按"宇宙→地表→洋底"的垂直顺序列出（上到下） */
const TIER_ORDER: SpatialTier[] = ['space', 'surface', 'subsurface'];

export function listTiers(): TierModule[] {
  return TIER_ORDER.map((id) => registry.get(id)).filter(
    (m): m is TierModule => m != null,
  );
}

/** 平台默认空间层（地表，保证零回归） */
export const DEFAULT_TIER_ID: SpatialTier = 'surface';
