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
  conflict_zones: '冲突区',
  hotspots: '热点区域',
  bases: '基地与演习',
  economic: '经济与基建',
  waterways: '水道与港口',
  natural: '自然灾害',
  weather: '气象预警',
  live_weather: '实时天气',
  military: '军事动态',
  sanctions: '制裁与博弈',
  nuclear: '核与战略',
  outages: '基础设施',
  aviation: '航空枢纽',
  live_flights: '实时航班',
  live_fires: '实时火点',
  live_maritime: '海运实时',
  maritime: '海运要道',
  cables: '海底光缆',
  econ_hubs: '全球经济中心',
  minerals: '关键矿产',
  daynight: '昼夜分界线',
  pipelines: '油气管线',
  hydrocarbon_reserves: '油气储藏',
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
  pizza_index: '披萨指数',
  persons: '人物',
};

/** 默认开启的图层（MVP） */
export const DEFAULT_LAYERS: LayerId[] = ['conflicts', 'economic', 'weather'];

/** 图层开关悬停说明（区分易混淆项） */
export const LAYER_HINTS: Partial<Record<LayerId, string>> = {
  conflicts: '冲突事件点标记（种子 + 缓存）',
  conflict_zones: '全球冲突区多边形填充（俄乌、中东、台海等）',
  aviation: '机场与航线枢纽（静态种子数据）',
  live_flights: 'OpenSky ADS-B 实时航迹（约 45 秒刷新）',
  live_fires: 'NASA FIRMS VIIRS 近实时活跃火点（约 10 分钟刷新，需 MAP_KEY）',
  live_maritime: '全球 AIS 船舶航迹或航运通道模拟（约 75 秒刷新）',
  weather: '区域气象预警（种子数据）',
  live_weather: 'Open-Meteo 城市实况 + RainViewer 降水雷达',
  pizza_index: '五角大楼周边披萨繁忙度（pizzint.watch OSINT）',
  cables: '海底光缆登陆点与路由线',
  maritime: '海运要道与港口节点',
  natural: '实时 USGS 地震（橙红地震波图例）≠ 油气储藏',
  hydrocarbon_reserves: '全球主要油气田/盆地（棕金储量波样式）≠ 地震',
  quake_depth: 'USGS 震源深度分带（青紫橙）· 洋底层专用 · 非油气储藏',
  persons: '区域公众人物标记（政治/经济/社会/文化/军事）',
};
