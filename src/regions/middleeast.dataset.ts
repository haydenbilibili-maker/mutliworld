/**
 * 中东区域数据集 — LIFEOS-005 通用能力沉淀
 * 把迁入的各域数据组装成标准 RegionDataset，挂到中东 RegionModule。
 */

import type { RegionDataset } from '@/types/region';
import { MIDEAST_SEED_EVENTS } from './middleeast.events';
import { MIDEAST_MILITARY_SECTIONS } from './middleeast.military';
import { MIDEAST_TARGETS } from './middleeast.targets';
import { MIDEAST_FACILITIES } from './middleeast.facilities';
import { MIDEAST_INCIDENTS } from './middleeast.incidents';
import { MIDEAST_DIPLOMACY } from './middleeast.diplomacy';
import { MIDEAST_SOCIAL } from './middleeast.social';
import {
  MIDEAST_FORCE_TREND,
  MIDEAST_CONFLICT_INTENSITY,
} from './middleeast.trend';
import {
  energyImpactRegions,
  energyDataPoints,
  oilProducerMapPoints,
} from './middleeast.energy';
import { MIDEAST_FACTION_LABEL, MIDEAST_FACTION_HEX } from './middleeast.factions';
import {
  ME_DENSIFY_EVENTS,
  ME_DENSIFY_INCIDENTS,
  ME_DENSIFY_FACILITIES,
  ME_DENSIFY_OIL,
} from './regional-densify-r2';

export const middleEastDataset: RegionDataset = {
  events: [...MIDEAST_SEED_EVENTS, ...ME_DENSIFY_EVENTS],
  factions: { label: MIDEAST_FACTION_LABEL, color: MIDEAST_FACTION_HEX },
  military: MIDEAST_MILITARY_SECTIONS,
  energy: { regions: energyImpactRegions, points: energyDataPoints, oilProducers: [...oilProducerMapPoints, ...ME_DENSIFY_OIL] },
  targets: MIDEAST_TARGETS,
  facilities: [...MIDEAST_FACILITIES, ...ME_DENSIFY_FACILITIES],
  incidents: [...MIDEAST_INCIDENTS, ...ME_DENSIFY_INCIDENTS],
  diplomacy: MIDEAST_DIPLOMACY,
  social: MIDEAST_SOCIAL,
  trend: { force: MIDEAST_FORCE_TREND, intensity: MIDEAST_CONFLICT_INTENSITY },
};
