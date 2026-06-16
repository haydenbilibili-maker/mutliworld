/**
 * 敏感图层标记与一键下架能力 — 三位一体 PRD 决策点 #7
 *
 * 项目自用：默认全开、不设边界。
 * 商用：可一键隐藏敏感（军事/核/海外基地等）图层——开启 hideSensitive 即从地图与面板下架。
 *
 * 新增敏感图层只需登记到 SENSITIVE_LAYERS。
 */

import type { LayerId } from '@/types/geo';

/** 敏感图层集合（商用一键下架时隐藏） */
export const SENSITIVE_LAYERS: ReadonlySet<LayerId> = new Set<LayerId>([
  'military',
  'bases',
  'garrisons',
  'nuclear',
  // 未来：submarine_bases / asat 等空天/海底军事条目登记于此
]);

export function isSensitiveLayer(layerId: LayerId): boolean {
  return SENSITIVE_LAYERS.has(layerId);
}

/** 按 hideSensitive 过滤图层列表 */
export function filterSensitive(layers: LayerId[], hideSensitive: boolean): LayerId[] {
  if (!hideSensitive) return layers;
  return layers.filter((id) => !SENSITIVE_LAYERS.has(id));
}
