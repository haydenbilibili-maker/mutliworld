/**
 * 区域模块：全球 — LIFEOS-005
 *
 * 默认区域：全球地缘政治、经济、安全与自然灾害态势（原「中国/全球」合并视图之全球部分）。
 */

import type { RegionModule } from '@/types/region';
import { globalDataset } from './global.dataset';

export const globalRegion: RegionModule = {
  id: 'global',
  name: '全球',
  viewpoint: '全球地缘政治、经济、安全与自然灾害态势',
  center: [105, 28],
  zoom: 3.5,
  layers: [
    'conflicts',
    'conflict_zones',
    'hotspots',
    'bases',
    'economic',
    'waterways',
    'natural',
    'weather',
    'live_weather',
    'military',
    'sanctions',
    'nuclear',
    'outages',
    'aviation',
    'live_flights',
    'live_maritime',
    'maritime',
    'cables',
    'econ_hubs',
    'minerals',
    'pipelines',
    'hydrocarbon_reserves',
    'datacenters',
    'launch_sites',
    'launch_log',
    'semiconductors',
    'garrisons',
    'deep_sea_mining',
    'marine_archaeology',
    'ocean_currents',
    'fisheries',
    'persons',
  ],
  defaultLayers: ['conflicts', 'conflict_zones', 'economic', 'natural', 'persons'],
  timeRange: '7d',
  dataNamespace: 'global',
  enabled: true,
  dataset: globalDataset,
};
