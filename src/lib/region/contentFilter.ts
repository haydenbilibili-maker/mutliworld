/**
 * 分级展示 — 二级（顶部 PanelDock）内容按当前区域过滤
 *
 * 一级：RegionSwitcher 决定 activeRegion
 * 二级：本模块过滤新闻/市场/跑马灯等跨区域内容
 * 三级：MapControlBar 图层/搜索等保持全局（不在此处理）
 */

import type { RegionId } from '@/types/region';
import { getRegion } from '@/regions';
import type { MarketKind } from '@/lib/markets/markets';

/** 带区域标签的内容项 */
export interface RegionTagged {
  regionIds?: RegionId[];
}

/** 顶部 dock 中需按区域过滤内容的面板 ID */
export const REGION_CONTENT_PANELS = new Set([
  'news',
  'markets',
  'marquee',
]);

/** 区域为空时的统一提示 */
export const EMPTY_REGION_MESSAGE = '当前区域暂无相关数据';

/** 区域切换器 tooltip — 一级筛选说明 */
export const REGION_SWITCHER_TOOLTIP =
  '一级筛选：切换区域后，顶部面板（简报/市场/新闻等）将只显示与当前区域相关的内容；底部图层与搜索不受区域限制。';

/** 外汇、加密等全球市场数据 — 任意区域均展示 */
export function isUniversalMarketKind(kind: MarketKind): boolean {
  return kind === 'fx' || kind === 'crypto';
}

/**
 * 判断内容是否对当前区域相关。
 * - global 区域：展示全部
 * - 具体区域：展示 regionIds 含该区域或 global 的项；无标签视为全球通用
 */
export function isRelevantToRegion(
  item: RegionTagged,
  activeRegion: RegionId,
): boolean {
  if (activeRegion === 'global') return true;

  const ids = item.regionIds;
  if (!ids || ids.length === 0) return true;
  if (ids.includes('global')) return true;
  return ids.includes(activeRegion);
}

/** 按区域过滤列表；global 时原样返回 */
export function filterByRegion<T extends RegionTagged>(
  items: T[],
  activeRegion: RegionId,
): T[] {
  if (activeRegion === 'global') return items;
  return items.filter((item) => isRelevantToRegion(item, activeRegion));
}

/** 市场报价：股指按 regionIds，FX/加密始终保留 */
export function filterMarketQuotes<
  T extends RegionTagged & { kind: MarketKind },
>(items: T[], activeRegion: RegionId): T[] {
  if (activeRegion === 'global') return items;
  return items.filter(
    (item) =>
      isUniversalMarketKind(item.kind) || isRelevantToRegion(item, activeRegion),
  );
}

/** 区域短名（用于 tab 标签「市场 · 美国」） */
export function getRegionShortLabel(regionId: RegionId): string {
  return getRegion(regionId)?.name ?? regionId;
}

/** 为顶部 dock 按钮追加区域上下文 */
export function formatDockPanelLabel(
  baseLabel: string,
  panelId: string,
  regionId: RegionId,
): string {
  if (regionId === 'global') return baseLabel;
  if (!REGION_CONTENT_PANELS.has(panelId)) return baseLabel;
  return `${baseLabel} · ${getRegionShortLabel(regionId)}`;
}
