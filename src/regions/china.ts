/**
 * 区域模块：中国 — LIFEOS-005
 *
 * 中国周边安全态势专版：南海、台海、第一岛链、中日、朝鲜半岛、岛礁争端。
 */

import type { RegionModule } from '@/types/region';
import { chinaDataset } from './china.dataset';

export const chinaRegion: RegionModule = {
  id: 'china',
  name: '中国',
  viewpoint: '中国周边安全态势：南海、台海、第一岛链、中日、朝鲜半岛与岛礁争端',
  center: [112, 28],
  zoom: 4.5,
  bounds: [
    [100, 18],
    [130, 42],
  ],
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
    'maritime',
    'persons',
  ],
  defaultLayers: ['conflicts', 'conflict_zones', 'military', 'hotspots', 'bases', 'persons'],
  timeRange: '7d',
  dataNamespace: 'china',
  enabled: true,
  note: '中国周边专版：南海/台海/岛链/中日/半岛六大模块',
  dataset: chinaDataset,
};
