/**
 * 区域模块：中东 — LIFEOS-005
 *
 * 由 Iran「中东冲突态势感知大屏」迁入。
 * 阶段2：阵营数据 + 种子事件 + 区域数据 Hook 已就位，enabled=true 可切换。
 * 阶段3：重写 Iran 的 22 个 Widget，替换种子数据为真实数据层。
 */

import type { RegionModule } from '@/types/region';
import { middleEastDataset } from './middleeast.dataset';

export const middleEastRegion: RegionModule = {
  id: 'middleeast',
  name: '中东',
  viewpoint: '中东地缘冲突态势：军事 / 能源 / 外交 / 情报 / 人物',
  center: [47, 29], // 波斯湾一带
  zoom: 4.5,
  layers: [
    'conflicts',
    'hotspots',
    'bases',
    'military',
    'waterways',
    'sanctions',
    'nuclear',
    'persons',
  ],
  defaultLayers: ['conflicts', 'conflict_zones', 'military', 'waterways', 'persons'],
  bounds: [
    [25, 12],
    [63, 42],
  ],
  timeRange: '7d',
  dataNamespace: 'middleeast',
  enabled: true,
  note: '已迁入 Iran 8 域真实数据（军力/能源/人物/设施/事件/外交/社媒/趋势）',
  dataset: middleEastDataset,
};
