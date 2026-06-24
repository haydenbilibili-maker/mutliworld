import type { RegionDataset } from '@/types/region';
import { SCS_EVENTS, SCS_INCIDENTS, SCS_FACILITIES } from './china-focus/scs';
import {
  ISLAND_CHAIN_EVENTS,
  ISLAND_CHAIN_INCIDENTS,
  ISLAND_CHAIN_FACILITIES,
} from './china-focus/islandChain';
import { TAIWAN_EVENTS, TAIWAN_INCIDENTS, TAIWAN_FACILITIES } from './china-focus/taiwan';
import { JAPAN_EVENTS, JAPAN_INCIDENTS, JAPAN_FACILITIES } from './china-focus/japan';
import { KOREA_EVENTS, KOREA_INCIDENTS, KOREA_FACILITIES } from './china-focus/korea';
import {
  CHINA_DISPUTE_EVENTS,
  CHINA_DISPUTE_INCIDENTS,
  CHINA_DISPUTE_FACILITIES,
} from './china-focus/disputes';
import { getPersonsForRegion } from './persons';
import {
  CHINA_DENSIFY_EVENTS,
  CHINA_DENSIFY_INCIDENTS,
  CHINA_DENSIFY_FACILITIES,
} from './china-focus/densify-r2';
import {
  CN_DENSIFY_FACILITIES_R3,
} from './regional-densify-r3';
import {
  CN_DENSIFY_FACILITIES_R4,
} from './regional-densify-r4';
import { CHINA_FACTIONS, CHINA_MILITARY, CHINA_DIPLOMACY } from './china-focus/meta';

/**
 * 中国区域数据集 — 聚合南海/台海/第一岛链/中日/朝鲜半岛/岛礁争端六大模块
 */
export const chinaDataset: RegionDataset = {
  events: [
    ...SCS_EVENTS,
    ...ISLAND_CHAIN_EVENTS,
    ...TAIWAN_EVENTS,
    ...JAPAN_EVENTS,
    ...KOREA_EVENTS,
    ...CHINA_DISPUTE_EVENTS,
    ...CHINA_DENSIFY_EVENTS,
  ],
  incidents: [
    ...SCS_INCIDENTS,
    ...ISLAND_CHAIN_INCIDENTS,
    ...TAIWAN_INCIDENTS,
    ...JAPAN_INCIDENTS,
    ...KOREA_INCIDENTS,
    ...CHINA_DISPUTE_INCIDENTS,
    ...CHINA_DENSIFY_INCIDENTS,
  ],
  facilities: [
    ...SCS_FACILITIES,
    ...ISLAND_CHAIN_FACILITIES,
    ...TAIWAN_FACILITIES,
    ...JAPAN_FACILITIES,
    ...KOREA_FACILITIES,
    ...CHINA_DISPUTE_FACILITIES,
    ...CHINA_DENSIFY_FACILITIES,
    ...CN_DENSIFY_FACILITIES_R3,
    ...CN_DENSIFY_FACILITIES_R4,
  ],
  factions: CHINA_FACTIONS,
  military: CHINA_MILITARY,
  diplomacy: CHINA_DIPLOMACY,
  persons: getPersonsForRegion('china'),
};
