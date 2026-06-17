/**
 * 区域态势数据聚合 — 按 RegionId 索引
 */

import type { RegionalSituationItem } from '@/types/regional-situation';
import type { RegionId } from '@/types/region';
import { GLOBAL_SITUATION } from './global';
import { CHINA_SITUATION } from './china';
import { MIDDLEEAST_SITUATION } from './middleeast';
import { ASIA_PACIFIC_SITUATION } from './asia-pacific';
import { NORTH_AMERICA_SITUATION } from './north-america';
import { LATIN_AMERICA_SITUATION } from './latin-america';
import { SOUTHEAST_ASIA_SITUATION } from './southeast-asia';
import { WESTERN_EUROPE_SITUATION } from './western-europe';
import { EASTERN_EUROPE_SITUATION } from './eastern-europe';

const BY_REGION: Record<RegionId, RegionalSituationItem[]> = {
  global: GLOBAL_SITUATION,
  china: CHINA_SITUATION,
  middleeast: MIDDLEEAST_SITUATION,
  asia_pacific: ASIA_PACIFIC_SITUATION,
  north_america: NORTH_AMERICA_SITUATION,
  latin_america: LATIN_AMERICA_SITUATION,
  southeast_asia: SOUTHEAST_ASIA_SITUATION,
  western_europe: WESTERN_EUROPE_SITUATION,
  eastern_europe: EASTERN_EUROPE_SITUATION,
};

/** 获取指定区域的态势条目（已按 regionId 过滤） */
export function getSituationForRegion(regionId: RegionId): RegionalSituationItem[] {
  return BY_REGION[regionId] ?? [];
}

/** 高热度条目（地图标记候选，heat ≥ 阈值） */
export function getHighHeatSituation(
  regionId: RegionId,
  minHeat = 75,
): RegionalSituationItem[] {
  return getSituationForRegion(regionId).filter(
    (item) => item.heat >= minHeat && item.lng != null && item.lat != null,
  );
}

/** 各区域条目数量统计 */
export function getSituationCountsByRegion(): Record<RegionId, number> {
  const regions = Object.keys(BY_REGION) as RegionId[];
  return Object.fromEntries(
    regions.map((r) => [r, BY_REGION[r].length]),
  ) as Record<RegionId, number>;
}

/** 按类型统计 */
export function getSituationTypeCounts(
  regionId: RegionId,
): Record<string, number> {
  const counts: Record<string, number> = { 社媒: 0, 趋势: 0, 态势: 0 };
  for (const item of getSituationForRegion(regionId)) {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  return counts;
}

export {
  GLOBAL_SITUATION,
  CHINA_SITUATION,
  MIDDLEEAST_SITUATION,
  ASIA_PACIFIC_SITUATION,
  NORTH_AMERICA_SITUATION,
  LATIN_AMERICA_SITUATION,
  SOUTHEAST_ASIA_SITUATION,
  WESTERN_EUROPE_SITUATION,
  EASTERN_EUROPE_SITUATION,
};
