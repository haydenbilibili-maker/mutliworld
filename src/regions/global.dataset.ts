import type { RegionDataset } from '@/types/region';
import { GLOBAL_SEED_EVENTS } from './global.events';
import { GLOBAL_SEED_INCIDENTS } from './global.incidents';
import {
  globalEnergyImpactRegions,
  globalEnergyDataPoints,
  globalOilProducerMapPoints,
} from './global.energy';
import { GLOBAL_SEED_FACILITIES } from './global.facilities';
import {
  GLOBAL_DENSIFY_EVENTS,
  GLOBAL_DENSIFY_INCIDENTS,
  GLOBAL_DENSIFY_FACILITIES,
} from './global.densify-r2';
import {
  GLOBAL_DENSIFY_EVENTS_R8,
  GLOBAL_DENSIFY_INCIDENTS_R8,
} from './global.densify-r8';
import {
  GLOBAL_DENSIFY_EVENTS_R9,
  GLOBAL_DENSIFY_INCIDENTS_R9,
} from './global.densify-r9';
import {
  GLOBAL_DENSIFY_EVENTS_R10,
} from './global.densify-r10';
import { GLOBAL_DENSIFY_INCIDENTS_R10 } from './global.densify-r10b';
import {
  GL_DENSIFY_EVENTS_R4,
  GL_DENSIFY_INCIDENTS_R4,
  GL_DENSIFY_FACILITIES_R4,
} from './regional-densify-r4';

import { getPersonsForRegion } from './persons';

/** 全球区域数据集（默认视角， worldwide 态势） */
export const globalDataset: RegionDataset = {
  events: [...GLOBAL_SEED_EVENTS, ...GLOBAL_DENSIFY_EVENTS, ...GLOBAL_DENSIFY_EVENTS_R8, ...GLOBAL_DENSIFY_EVENTS_R9, ...GLOBAL_DENSIFY_EVENTS_R10, ...GL_DENSIFY_EVENTS_R4],
  incidents: [...GLOBAL_SEED_INCIDENTS, ...GLOBAL_DENSIFY_INCIDENTS, ...GLOBAL_DENSIFY_INCIDENTS_R8, ...GLOBAL_DENSIFY_INCIDENTS_R9, ...GLOBAL_DENSIFY_INCIDENTS_R10, ...GL_DENSIFY_INCIDENTS_R4],
  facilities: [...GLOBAL_SEED_FACILITIES, ...GLOBAL_DENSIFY_FACILITIES, ...GL_DENSIFY_FACILITIES_R4],
  persons: getPersonsForRegion('global'),
  energy: {
    regions: globalEnergyImpactRegions,
    points: globalEnergyDataPoints,
    oilProducers: globalOilProducerMapPoints,
  },
};
