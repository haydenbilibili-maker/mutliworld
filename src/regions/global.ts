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
    'hotspots',
    'bases',
    'economic',
    'waterways',
    'natural',
    'weather',
    'military',
    'sanctions',
    'nuclear',
    'outages',
    'aviation',
    'maritime',
    'cables',
    'econ_hubs',
    'minerals',
    'pipelines',
    'datacenters',
    'launch_sites',
    'launch_log',
    'semiconductors',
    'garrisons',
    'deep_sea_mining',
  ],
  defaultLayers: ['conflicts', 'economic', 'natural'],
  timeRange: '7d',
  dataNamespace: 'global',
  enabled: true,
  dataset: globalDataset,
};
