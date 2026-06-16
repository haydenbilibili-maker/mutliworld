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

/** 全球区域数据集（默认视角， worldwide 态势） */
export const globalDataset: RegionDataset = {
  events: [...GLOBAL_SEED_EVENTS, ...GLOBAL_DENSIFY_EVENTS],
  incidents: [...GLOBAL_SEED_INCIDENTS, ...GLOBAL_DENSIFY_INCIDENTS],
  facilities: [...GLOBAL_SEED_FACILITIES, ...GLOBAL_DENSIFY_FACILITIES],
  energy: {
    regions: globalEnergyImpactRegions,
    points: globalEnergyDataPoints,
    oilProducers: globalOilProducerMapPoints,
  },
};
