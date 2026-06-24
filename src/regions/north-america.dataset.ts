/**
 * 北美区域数据集 — 聚合 us-focus 七大战略模块 + 地表层 + 原有北美公开态势整理
 * 美国作为战略研究对象：核力量 / 全球部署 / 印太·北约 / 本土安全 / 供应链 / 地表态势
 */

import type { EventDetail } from '@/types/geo';
import type { RegionDataset } from '@/types/region';
import type { Incident, Facility, EnergyDataPoint, OilProducerMapPoint } from '@/types/middleeast';
import {
  NA_DENSIFY_EVENTS,
  NA_DENSIFY_INCIDENTS,
  NA_DENSIFY_FACILITIES,
} from './regional-densify-r2';
import {
  NA_DENSIFY_FACILITIES_R4,
} from './regional-densify-r4';
import { US_NUCLEAR_EVENTS, US_NUCLEAR_INCIDENTS, US_NUCLEAR_FACILITIES } from './us-focus/us.nuclear';
import { US_GARRISON_EVENTS, US_GARRISON_INCIDENTS, US_GARRISON_FACILITIES } from './us-focus/us.garrisons';
import { US_HOMELAND_EVENTS, US_HOMELAND_INCIDENTS, US_HOMELAND_FACILITIES } from './us-focus/us.homeland';
import {
  US_INDO_PACIFIC_EVENTS,
  US_INDO_PACIFIC_INCIDENTS,
  US_INDO_PACIFIC_FACILITIES,
} from './us-focus/us.indoPacific';
import { US_NATO_EVENTS, US_NATO_INCIDENTS, US_NATO_FACILITIES } from './us-focus/us.nato';
import {
  US_SUPPLY_CHAIN_EVENTS,
  US_SUPPLY_CHAIN_INCIDENTS,
  US_SUPPLY_CHAIN_FACILITIES,
} from './us-focus/us.supplyChain';
import { US_DOMESTIC_EVENTS, US_DOMESTIC_INCIDENTS, US_DOMESTIC_FACILITIES } from './us-focus/us.domestic';
import {
  US_SURFACE_EVENTS,
  US_SURFACE_INCIDENTS,
  US_SURFACE_FACILITIES,
} from './us-focus/us.surface';
import { US_FACTIONS, US_MILITARY, US_DIPLOMACY } from './us-focus/meta';

/** 原有北美区域种子（加拿大/墨西哥/泛北美经济节点，保留 na- 前缀） */
const NA_LEGACY_EVENTS: EventDetail[] = [
  {
    id: 'na-wall-street',
    title: '纽约 · 全球金融市场风向标',
    source: '公开态势整理 · 经济指标',
    timestamp: '2026-06-15T21:00:00Z',
    location: [-74.01, 40.71],
    impact_level: 'high',
    category: 'economic',
    description: '标普 500、美元指数与全球风险偏好',
  },
  {
    id: 'na-panama',
    title: '巴拿马运河 · 北美贸易通道',
    source: '公开态势整理 · 航运监测',
    timestamp: '2026-06-13T10:00:00Z',
    location: [-79.92, 9.08],
    impact_level: 'high',
    category: 'waterways',
    description: '美东—亚洲航线关键咽喉，通行配额影响运价',
  },
  {
    id: 'na-sanctions',
    title: '华盛顿 · 制裁与出口管制政策监测',
    source: 'OFAC',
    timestamp: '2026-06-12T16:00:00Z',
    location: [-77.04, 38.9],
    impact_level: 'high',
    category: 'sanctions',
    description: '实体清单与次级制裁合规敏感区',
  },
  {
    id: 'na-california-outage',
    title: '加州电网 · 极端天气负荷预警',
    source: 'CAISO',
    timestamp: '2026-06-14T22:00:00Z',
    location: [-121.49, 38.58],
    impact_level: 'medium',
    category: 'outages',
    description: '热浪期间用电高峰与滚动停电风险',
  },
  {
    id: 'na-texas-weather',
    title: '墨西哥湾 · 飓风季预警监测',
    source: 'NHC · 气象',
    timestamp: '2026-06-15T12:00:00Z',
    location: [-90.0, 28.0],
    impact_level: 'medium',
    category: 'weather',
    description: '油气平台与炼厂受飓风路径影响',
  },
  {
    id: 'na-alaska',
    title: '阿拉斯加 · 北极战略前哨',
    source: '公开态势整理 · 军事',
    timestamp: '2026-06-09T08:00:00Z',
    location: [-149.9, 61.22],
    impact_level: 'medium',
    category: 'military',
    description: '北极航线与导弹防御部署监测',
  },
  {
    id: 'na-california-quake',
    title: '加州 · 地震活动监测',
    source: 'USGS',
    timestamp: '2026-06-14T06:00:00Z',
    location: [-118.24, 34.05],
    impact_level: 'medium',
    category: 'natural',
    description: '圣安德烈亚斯断层带微震活动',
  },
  {
    id: 'na-great-lakes',
    title: '五大湖 · 跨境水运枢纽',
    source: '公开态势整理 · 航运',
    timestamp: '2026-06-13T12:00:00Z',
    location: [-87.9, 41.88],
    impact_level: 'medium',
    category: 'waterways',
    description: '美加钢铁与农产品内河运输',
  },
  {
    id: 'na-canada-tar',
    title: '阿尔伯塔油砂 · 产能监测',
    source: 'EIA',
    timestamp: '2026-06-14T16:00:00Z',
    location: [-114.0, 53.5],
    impact_level: 'high',
    category: 'economic',
    description: '美国炼厂主要重质原油来源',
  },
  {
    id: 'na-miami-weather',
    title: '佛罗里达 · 飓风季预警',
    source: 'NHC（美国国家飓风中心）',
    timestamp: '2026-06-15T14:00:00Z',
    location: [-80.19, 25.76],
    impact_level: 'medium',
    category: 'weather',
    description: '保险与旅游业受飓风路径影响',
  },
  {
    id: 'na-yellowstone-natural',
    title: '黄石 · 地热与地震监测',
    source: 'USGS',
    timestamp: '2026-06-12T06:00:00Z',
    location: [-110.67, 44.43],
    impact_level: 'low',
    category: 'natural',
    description: '超级火山系统微震活动',
  },
  {
    id: 'na-phoenix-weather',
    title: '凤凰城 · 极端高温预警',
    source: 'NWS',
    timestamp: '2026-06-15T18:00:00Z',
    location: [-112.07, 33.45],
    impact_level: 'high',
    category: 'weather',
    description: '连续多日超 45°C，电网负荷创新高',
  },
  {
    id: 'na-vancouver-trade',
    title: '温哥华 · 亚太贸易门户',
    source: '公开态势整理 · 经济',
    timestamp: '2026-06-14T20:00:00Z',
    location: [-123.12, 49.28],
    impact_level: 'medium',
    category: 'economic',
    description: '加拿大最大港口，对华贸易敏感',
  },
  {
    id: 'na-toronto-economic',
    title: '多伦多 · 金融与科技枢纽',
    source: '公开态势整理 · 经济',
    timestamp: '2026-06-15T16:00:00Z',
    location: [-79.38, 43.65],
    impact_level: 'medium',
    category: 'economic',
    description: '北美第二大金融中心',
  },
  {
    id: 'na-montreal-waterway',
    title: '蒙特利尔 · 圣劳伦斯河航运',
    source: '公开态势整理 · 航运',
    timestamp: '2026-06-12T12:00:00Z',
    location: [-73.57, 45.5],
    impact_level: 'low',
    category: 'waterways',
    description: '五大湖—大西洋内河联运枢纽',
  },
];

const NA_LEGACY_INCIDENTS: Incident[] = [
  {
    id: 'na-inc-5',
    title: '加拿大野火致油气减产',
    date: '2026-06-13T18:00:00Z',
    type: 'political',
    faction: 'us',
    location: { lat: 54.0, lng: -114.0 },
    description: '阿尔伯塔油砂产区部分关停',
    source: '公开态势整理',
  },
  {
    id: 'na-inc-6',
    title: '墨西哥近岸制造业投资协议',
    date: '2026-06-12T14:00:00Z',
    type: 'diplomatic',
    faction: 'us',
    location: { lat: 25.67, lng: -100.31 },
    description: '蒙特雷汽车产业链扩张',
    source: '公开态势整理',
  },
];

const NA_ENERGY: EnergyDataPoint[] = [
  {
    id: 'na-wti',
    name: 'WTI 原油',
    unit: '美元/桶',
    value: 69.6,
    change: 4.2,
    changePercent: 6.4,
    description: '美国基准油价',
    updatedAt: '2026-06-15T18:00:00Z',
    source: 'NYMEX',
  },
  {
    id: 'na-spr',
    name: '战略石油储备',
    unit: '百万桶',
    value: 358,
    change: -2,
    description: '冲突后小幅释放',
    updatedAt: '2026-06-14T18:00:00Z',
    source: 'EIA',
  },
];

const NA_OIL: OilProducerMapPoint[] = [
  {
    id: 'na-oil-permian',
    name: '二叠纪盆地',
    lng: -102.0,
    lat: 31.5,
    production: '约 600 万桶/日',
    exportShare: '美国页岩油核心',
    note: '全球增长最快产区',
    updatedAt: '2026-06-15T12:00:00Z',
  },
  {
    id: 'na-oil-alberta',
    name: '阿尔伯塔油砂',
    lng: -114.0,
    lat: 53.5,
    production: '约 300 万桶/日',
    exportShare: '主要出口美国',
    note: '重质原油供应',
    updatedAt: '2026-06-14T16:00:00Z',
  },
  {
    id: 'na-oil-gom',
    name: '墨西哥湾海上油田',
    lng: -90.0,
    lat: 28.0,
    production: '约 180 万桶/日',
    exportShare: '美国炼厂主力',
    note: '深水平台与飓风季风险',
    updatedAt: '2026-06-15T12:00:00Z',
  },
  {
    id: 'na-oil-bakken',
    name: '巴肯页岩油田',
    lng: -103.0,
    lat: 47.5,
    production: '约 120 万桶/日',
    exportShare: '管道至中西部炼厂',
    note: '页岩油产量波动监测',
    updatedAt: '2026-06-14T08:00:00Z',
  },
  {
    id: 'na-oil-canada-offshore',
    name: '纽芬兰海上油田',
    lng: -53.0,
    lat: 47.0,
    production: '约 25 万桶/日',
    exportShare: '出口美国东岸',
    note: '大西洋离岸产能',
    updatedAt: '2026-06-13T10:00:00Z',
  },
];

import { getPersonsForRegion } from './persons';

export const northAmericaDataset: RegionDataset = {
  events: [
    ...US_NUCLEAR_EVENTS,
    ...US_GARRISON_EVENTS,
    ...US_HOMELAND_EVENTS,
    ...US_INDO_PACIFIC_EVENTS,
    ...US_NATO_EVENTS,
    ...US_SUPPLY_CHAIN_EVENTS,
    ...US_DOMESTIC_EVENTS,
    ...US_SURFACE_EVENTS,
    ...NA_LEGACY_EVENTS,
    ...NA_DENSIFY_EVENTS,
  ],
  incidents: [
    ...US_NUCLEAR_INCIDENTS,
    ...US_GARRISON_INCIDENTS,
    ...US_HOMELAND_INCIDENTS,
    ...US_INDO_PACIFIC_INCIDENTS,
    ...US_NATO_INCIDENTS,
    ...US_SUPPLY_CHAIN_INCIDENTS,
    ...US_DOMESTIC_INCIDENTS,
    ...US_SURFACE_INCIDENTS,
    ...NA_LEGACY_INCIDENTS,
    ...NA_DENSIFY_INCIDENTS,
  ],
  facilities: [
    ...US_NUCLEAR_FACILITIES,
    ...US_GARRISON_FACILITIES,
    ...US_HOMELAND_FACILITIES,
    ...US_INDO_PACIFIC_FACILITIES,
    ...US_NATO_FACILITIES,
    ...US_SUPPLY_CHAIN_FACILITIES,
    ...US_DOMESTIC_FACILITIES,
    ...US_SURFACE_FACILITIES,
    ...NA_DENSIFY_FACILITIES,
    ...NA_DENSIFY_FACILITIES_R4,
  ] as Facility[],
  factions: US_FACTIONS,
  military: US_MILITARY,
  diplomacy: US_DIPLOMACY,
  energy: { regions: [], points: NA_ENERGY, oilProducers: NA_OIL },
  persons: getPersonsForRegion('north_america'),
};
