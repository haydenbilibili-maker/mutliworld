/**
 * 世界重点区域模块（占位）— LIFEOS-005 通用能力沉淀
 *
 * 亚太 / 美国 / 拉美 / 东南亚：先建模块骨架（地图视野 + 图层），dataset 待后续填充。
 * 接入新区域只需：在此加一个 RegionModule，并在 regions/index.ts 注册即可——
 * 面板与地图会按 dataset 字段自动渲染（缺字段则对应面板自动隐藏）。
 */

import type { RegionModule } from '@/types/region';
import { easternEuropeDataset } from './eastern-europe.dataset';
import { westernEuropeDataset } from './western-europe.dataset';
import { asiaPacificDataset } from './asia-pacific.dataset';
import { northAmericaDataset } from './north-america.dataset';
import { latinAmericaDataset } from './latin-america.dataset';
import { southeastAsiaDataset } from './southeast-asia.dataset';

export const asiaPacificRegion: RegionModule = {
  id: 'asia_pacific',
  name: '亚太',
  viewpoint: '亚太地缘态势：海洋 / 军事 / 经济 / 热点',
  center: [128, 20],
  zoom: 3,
  layers: ['conflicts', 'hotspots', 'bases', 'military', 'waterways', 'economic', 'natural', 'weather', 'nuclear', 'persons'],
  defaultLayers: ['conflicts', 'conflict_zones', 'military', 'waterways'],
  bounds: [
    [60, -50],
    [180, 55],
  ],
  timeRange: '7d',
  dataNamespace: 'asia_pacific',
  enabled: true,
  note: '亚太航道、基地与经济节点种子数据',
  dataset: asiaPacificDataset,
};

export const northAmericaRegion: RegionModule = {
  id: 'north_america',
  name: '美国',
  viewpoint: '美国战略态势：核力量 / 全球部署 / 印太·北约 / 本土安全 / 供应链',
  center: [-98, 39],
  zoom: 3.2,
  layers: [
    'economic',
    'military',
    'conflicts',
    'sanctions',
    'nuclear',
    'outages',
    'weather',
    'natural',
    'bases',
    'hotspots',
    'garrisons',
    'semiconductors',
    'datacenters',
    'minerals',
    'waterways',
    'maritime',
    'protests',
    'persons',
  ],
  defaultLayers: ['military', 'nuclear', 'bases', 'garrisons'],
  bounds: [
    [-170, 15],
    [-50, 72],
  ],
  timeRange: '7d',
  dataNamespace: 'north_america',
  enabled: true,
  note: '美国战略研究对象 — 核力量、海外驻军、印太/北约枢纽与供应链（种子数据）',
  dataset: northAmericaDataset,
};

export const latinAmericaRegion: RegionModule = {
  id: 'latin_america',
  name: '拉美',
  viewpoint: '拉美态势：经济 / 资源 / 社会 / 热点',
  center: [-65, -15],
  zoom: 2.8,
  layers: ['economic', 'conflicts', 'natural', 'hotspots', 'waterways', 'weather', 'nuclear', 'persons'],
  defaultLayers: ['economic', 'hotspots'],
  bounds: [
    [-118, -56],
    [-34, 33],
  ],
  timeRange: '7d',
  dataNamespace: 'latin_america',
  enabled: true,
  note: '拉美资源、运河与热点种子数据',
  dataset: latinAmericaDataset,
};

export const southeastAsiaRegion: RegionModule = {
  id: 'southeast_asia',
  name: '东南亚',
  viewpoint: '东南亚态势：航道 / 军事 / 经济 / 热点',
  center: [113, 5],
  zoom: 3.8,
  layers: ['waterways', 'conflicts', 'economic', 'hotspots', 'military', 'bases', 'natural', 'weather', 'nuclear', 'persons'],
  defaultLayers: ['waterways', 'economic'],
  bounds: [
    [90, -12],
    [142, 25],
  ],
  timeRange: '7d',
  dataNamespace: 'southeast_asia',
  enabled: true,
  note: '马六甲、东盟经济与南海航道种子数据',
  dataset: southeastAsiaDataset,
};

export const westernEuropeRegion: RegionModule = {
  id: 'western_europe',
  name: '西欧',
  viewpoint: '西欧态势：经济 / 能源 / 外交 / 安全',
  center: [4, 48],
  zoom: 4,
  layers: ['economic', 'sanctions', 'conflicts', 'military', 'outages', 'nuclear', 'persons'],
  defaultLayers: ['economic', 'sanctions', 'military'],
  bounds: [
    [-11, 36],
    [20, 60],
  ],
  timeRange: '7d',
  dataNamespace: 'western_europe',
  enabled: true,
  note: '已填联网来源：防务投入/北约承诺/能源/对俄安全',
  dataset: westernEuropeDataset,
};

export const easternEuropeRegion: RegionModule = {
  id: 'eastern_europe',
  name: '东欧·俄乌',
  viewpoint: '东欧 / 俄乌战线：军事 / 能源 / 制裁 / 外交',
  center: [33, 49],
  zoom: 4.2,
  layers: ['conflicts', 'hotspots', 'bases', 'military', 'sanctions', 'economic', 'nuclear', 'persons'],
  defaultLayers: ['conflicts', 'conflict_zones', 'military', 'hotspots'],
  bounds: [
    [22, 44],
    [44, 56],
  ],
  timeRange: '7d',
  dataNamespace: 'eastern_europe',
  enabled: true,
  note: '俄乌战线：起步含阵营与关键城市；作战数据待真实来源填充',
  dataset: easternEuropeDataset,
};
