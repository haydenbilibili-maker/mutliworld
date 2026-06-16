/**
 * 默认视野、图层列表等常量，与 PRD / URL 规范一致
 */

import type { LayerId } from '@/types/geo';

/** 默认地图中心（亚太视角） */
export const DEFAULT_CENTER: [number, number] = [105, 28];
export const DEFAULT_ZOOM = 3.5;
export const DEFAULT_VIEW = 'global' as const;
export const DEFAULT_TIME_RANGE = '7d' as const;

/** 图层 ID 与中文标签 */
export const LAYER_LABELS: Record<LayerId, string> = {
  conflicts: '冲突与安全',
  hotspots: '热点区域',
  bases: '基地与演习',
  economic: '经济与基建',
  waterways: '水道与港口',
  natural: '自然灾害',
  weather: '气象预警',
  military: '军事动态',
  sanctions: '制裁与博弈',
  nuclear: '核与战略',
  outages: '基础设施',
  aviation: '航空枢纽',
  maritime: '海运要道',
  cables: '海底光缆',
  econ_hubs: '全球经济中心',
  minerals: '关键矿产',
  daynight: '昼夜分界线',
  pipelines: '油气管线',
  datacenters: 'AI 数据中心',
  protests: '抗议活动',
  climate: '气候异常',
  launch_sites: '航天发射场',
  launch_log: '发射日志',
  semiconductors: '半导体晶圆厂',
  garrisons: '海外军事基地',
  deep_sea_mining: '深海采矿',
  tectonics: '板块与断层',
  cable_incidents: '海缆中断事件',
  quake_depth: '震源深度',
  ground_stations: '测控/地面站',
  sat_constellations: '在轨卫星（GEO）',
  space_stations: '空间站（实时）',
  satellites: '在轨卫星（实时）',
  space_debris: '空间碎片（实时）',
  space_events: '空天事件',
  marine_archaeology: '海洋考古',
  ocean_currents: '洋流',
  fisheries: '渔场',
  monsoon: '季风气候带',
  atmospheric_circulation: '大气环流',
  deep_exploration: '深海探索',
};

/** 默认开启的图层（MVP） */
export const DEFAULT_LAYERS: LayerId[] = ['conflicts', 'economic', 'weather'];
