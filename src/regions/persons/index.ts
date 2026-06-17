/**
 * 区域人物数据聚合 — 按 RegionId 索引
 */

import type { Person } from '@/types/person';
import type { RegionId } from '@/types/region';
import { GLOBAL_PERSONS } from './global';
import { CHINA_PERSONS } from './china';
import { MIDDLEEAST_PERSONS } from './middleeast';
import { NORTH_AMERICA_PERSONS } from './north-america';
import { WESTERN_EUROPE_PERSONS } from './western-europe';
import { EASTERN_EUROPE_PERSONS } from './eastern-europe';
import { ASIA_PACIFIC_PERSONS } from './asia-pacific';
import { SOUTHEAST_ASIA_PERSONS } from './southeast-asia';
import { LATIN_AMERICA_PERSONS } from './latin-america';

const ALL_PERSON_POOL: Person[] = [
  ...GLOBAL_PERSONS,
  ...CHINA_PERSONS,
  ...MIDDLEEAST_PERSONS,
  ...NORTH_AMERICA_PERSONS,
  ...WESTERN_EUROPE_PERSONS,
  ...EASTERN_EUROPE_PERSONS,
  ...ASIA_PACIFIC_PERSONS,
  ...SOUTHEAST_ASIA_PERSONS,
  ...LATIN_AMERICA_PERSONS,
];

/** 去重合并（同 id 保留首次出现） */
function dedupeById(persons: Person[]): Person[] {
  const seen = new Set<string>();
  const out: Person[] = [];
  for (const p of persons) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    out.push(p);
  }
  return out;
}

const UNIQUE_POOL = dedupeById(ALL_PERSON_POOL);

/** 获取指定区域可见人物（regionIds 包含该区域） */
export function getPersonsForRegion(regionId: RegionId): Person[] {
  return UNIQUE_POOL.filter((p) => p.regionIds.includes(regionId));
}

/** 各区域人物数量统计 */
export function getPersonCountsByRegion(): Record<RegionId, number> {
  const regions: RegionId[] = [
    'global',
    'china',
    'middleeast',
    'asia_pacific',
    'north_america',
    'latin_america',
    'southeast_asia',
    'western_europe',
    'eastern_europe',
  ];
  return Object.fromEntries(
    regions.map((r) => [r, getPersonsForRegion(r).length]),
  ) as Record<RegionId, number>;
}

export { UNIQUE_POOL as ALL_PERSONS };
