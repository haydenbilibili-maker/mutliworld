/**
 * 地图标记样式：按图层 / 设施子类 / 影响等级解析图标与光晕色
 */

import type { ImpactLevel, LayerId } from '@/types/geo';
import { LAYER_LABELS } from '@/lib/constants';

/** 预注册图标（imageId → emoji + 图例标签） */
export const MARKER_REGISTRY: Record<string, { emoji: string; label: string }> = {
  conflicts: { emoji: '💥', label: '冲突事件' },
  conflict_zones: { emoji: '▧', label: '冲突区（填充）' },
  military: { emoji: '⚔️', label: '军事动态' },
  hotspots: { emoji: '🔥', label: '热点区域' },
  economic: { emoji: '📊', label: '经济节点' },
  'economic-oil': { emoji: '🛢️', label: '油气生产' },
  waterways: { emoji: '⚓', label: '水道港口' },
  natural: { emoji: '🌋', label: '自然灾害' },
  weather: { emoji: '🌪️', label: '气象预警' },
  'live-weather-radar': { emoji: '🌧️', label: '降水雷达' },
  'live-weather-city': { emoji: '🌡️', label: '城市实况' },
  sanctions: { emoji: '🚫', label: '制裁博弈' },
  outages: { emoji: '⚡', label: '基础设施中断' },
  aviation: { emoji: '✈️', label: '航空枢纽' },
  live_flights: { emoji: '✈️', label: '实时航班（ADS-B）' },
  maritime: { emoji: '🚢', label: '海运要道' },
  cables: { emoji: '🔌', label: '海底光缆登陆点' },
  'cable-route': { emoji: '〰️', label: '海缆路由（青色）' },
  'nuclear-default': { emoji: '☢️', label: '核与战略' },
  'nuclear-power': { emoji: '⚛️', label: '核电站' },
  'nuclear-enrichment': { emoji: '⚗️', label: '铀浓缩' },
  'nuclear-reprocessing': { emoji: '♻️', label: '后处理' },
  'nuclear-silo': { emoji: '🚀', label: '导弹发射井' },
  'nuclear-icbm': { emoji: '🚀', label: '洲际导弹基地' },
  'nuclear-sub': { emoji: '🔱', label: '战略核潜艇' },
  'nuclear-warhead': { emoji: '☢️', label: '弹头储存' },
  'nuclear-test': { emoji: '💥', label: '核试验场' },
  'nuclear-contamination': { emoji: '☣️', label: '核污染区' },
  'nuclear-research': { emoji: '⚛️', label: '研究堆' },
  'base-default': { emoji: '🏕️', label: '军事基地' },
  'base-radar': { emoji: '📡', label: '雷达站' },
  'base-airfield': { emoji: '🛫', label: '机场' },
  'base-naval': { emoji: '⚓', label: '海军基地' },
  'base-missile': { emoji: '🎯', label: '导弹阵地' },
  'incident-military': { emoji: '⚔️', label: '军事冲突' },
  'incident-political': { emoji: '🏛️', label: '政治事件' },
  'incident-economic': { emoji: '📉', label: '经济事件' },
  econ_hubs: { emoji: '🏙️', label: '经济中心' },
  minerals: { emoji: '⛏️', label: '关键矿产' },
  'mineral-lithium': { emoji: '🔋', label: '锂矿' },
  'mineral-cobalt': { emoji: '💎', label: '钴矿' },
  'mineral-rare_earth': { emoji: '🧲', label: '稀土' },
  'mineral-copper': { emoji: '🟤', label: '铜矿' },
  'mineral-nickel': { emoji: '⚙️', label: '镍矿' },
  'mineral-iron': { emoji: '🪨', label: '铁矿' },
  'mineral-uranium': { emoji: '☢️', label: '铀矿' },
  'mineral-bauxite': { emoji: '🏔️', label: '铝土矿' },
  'mineral-tantalum': { emoji: '📱', label: '钽铌' },
  daynight: { emoji: '🌓', label: '晨昏线' },
  pipelines: { emoji: '🛢️', label: '油气管线' },
  datacenters: { emoji: '🖥️', label: 'AI 数据中心' },
  protests: { emoji: '✊', label: '抗议活动' },
  climate: { emoji: '🌡️', label: '气候异常' },
  'climate-heatwave': { emoji: '🔥', label: '极端高温' },
  'climate-drought': { emoji: '🏜️', label: '干旱' },
  'climate-flood': { emoji: '🌊', label: '洪涝' },
  'climate-ice': { emoji: '🧊', label: '海冰异常' },
  'climate-ocean': { emoji: '🪸', label: '海洋生态' },
  'launch-site': { emoji: '🛰️', label: '航天发射场' },
  'launch-site-orbital': { emoji: '🛰️', label: '轨道发射' },
  'launch-site-civilian': { emoji: '🛸', label: '民用航天' },
  'launch-site-military': { emoji: '🌌', label: '军用航天' },
  'launch-log': { emoji: '🚀', label: '发射任务' },
  'launch-log-success': { emoji: '🚀', label: '发射成功' },
  'launch-log-failure': { emoji: '💥', label: '发射失败' },
  'launch-log-partial': { emoji: '⚠️', label: '部分成功' },
  'launch-log-scheduled': { emoji: '📅', label: '计划发射' },
  'launch-log-scrubbed': { emoji: '⏸️', label: '推迟/中止' },
  semiconductors: { emoji: '🔬', label: '半导体晶圆厂' },
  'semi-foundry': { emoji: '🏭', label: '晶圆代工' },
  'semi-memory': { emoji: '💾', label: '存储芯片' },
  'semi-idm': { emoji: '🔬', label: 'IDM 垂直整合' },
  garrisons: { emoji: '🪖', label: '海外军事基地' },
  'garrison-us': { emoji: '🇺🇸', label: '美军基地' },
  'garrison-china': { emoji: '🇨🇳', label: '中国基地' },
  'garrison-russia': { emoji: '🇷🇺', label: '俄军基地' },
  'garrison-france': { emoji: '🇫🇷', label: '法军基地' },
  'garrison-uk': { emoji: '🇬🇧', label: '英军基地' },
  deep_sea_mining: { emoji: '⚒️', label: '深海采矿' },
  'dsm-nodules': { emoji: '⚫', label: '多金属结核' },
  'dsm-sulphides': { emoji: '🟡', label: '多金属硫化物' },
  'dsm-crusts': { emoji: '🔵', label: '富钴结壳' },
  tectonics: { emoji: '🌐', label: '板块与断层' },
  'tectonic-convergent': { emoji: '⛰️', label: '汇聚边界（俯冲/碰撞）' },
  'tectonic-divergent': { emoji: '🌋', label: '离散边界（洋脊/裂谷）' },
  'tectonic-transform': { emoji: '↔️', label: '转换断层' },
  cable_incidents: { emoji: '✂️', label: '海缆中断' },
  quake_depth: { emoji: '📏', label: '震源深度' },
  'quake-shallow': { emoji: '🔴', label: '浅源 (<70km)' },
  'quake-intermediate': { emoji: '🟠', label: '中源 (70–300km)' },
  'quake-deep': { emoji: '🟣', label: '深源 (>300km)' },
  ground_stations: { emoji: '📡', label: '测控/地面站' },
  'gs-deep-space': { emoji: '🛰️', label: '深空网' },
  'gs-tracking': { emoji: '📡', label: '常规测控站' },
  sat_constellations: { emoji: '🛰️', label: '在轨卫星（GEO）' },
  space_stations: { emoji: '🏠', label: '空间站（实时）' },
  satellites: { emoji: '🛰️', label: '在轨卫星（实时）' },
  space_debris: { emoji: '💫', label: '空间碎片（实时）' },
  'sat-weather': { emoji: '🌦️', label: '气象卫星' },
  'sat-comms': { emoji: '📶', label: '通信卫星' },
  'sat-navigation': { emoji: '🧭', label: '导航卫星' },
  space_events: { emoji: '💫', label: '空天事件' },
  'space-asat': { emoji: '🎯', label: '反卫星(ASAT)' },
  'space-collision': { emoji: '💥', label: '在轨相撞' },
  'space-breakup': { emoji: '🌌', label: '解体/碎片' },
  'space-reentry': { emoji: '☄️', label: '再入' },
  'space-closeapproach': { emoji: '⚠️', label: '抵近/规避' },
  marine_archaeology: { emoji: '🏺', label: '海洋考古' },
  'arch-ancient': { emoji: '🏛️', label: '古代沉船' },
  'arch-merchant': { emoji: '🚢', label: '商船沉船' },
  'arch-galleon': { emoji: '💰', label: '宝船' },
  'arch-warship': { emoji: '⚓', label: '军舰残骸' },
  'arch-modern': { emoji: '🛳️', label: '近代沉船' },
  ocean_currents: { emoji: '🌊', label: '洋流' },
  'current-route': { emoji: '〰️', label: '洋流路径' },
  fisheries: { emoji: '🐟', label: '渔场' },
  'fish-pelagic': { emoji: '🐟', label: '远洋渔业' },
  'fish-groundfish': { emoji: '🎣', label: '底栖渔业' },
  'fish-coastal': { emoji: '🦐', label: '近海渔业' },
  monsoon: { emoji: '🌧️', label: '季风气候带' },
  'monsoon-summer': { emoji: '🌧️', label: '夏季/湿季' },
  'monsoon-winter': { emoji: '❄️', label: '冬季/干季' },
  atmospheric_circulation: { emoji: '💨', label: '大气环流' },
  'atmo-itcz': { emoji: '☀️', label: '赤道辐合带' },
  'atmo-jet': { emoji: '💨', label: '急流' },
  'atmo-trade': { emoji: '🌀', label: '信风带' },
  deep_exploration: { emoji: '🤿', label: '深海探索' },
  'deep-trench': { emoji: '🕳️', label: '海沟' },
  'deep-hydrothermal': { emoji: '♨️', label: '热液喷口' },
  'deep-manned': { emoji: '🤿', label: '载人深潜' },
  'deep-rov': { emoji: '🤖', label: '无人深潜器' },
  'deep-institution': { emoji: '🔬', label: '科考机构' },
};

/** 图层主色（光晕底色） */
export const LAYER_HALO_COLORS: Record<string, string> = {
  military: '#ef4444',
  conflicts: '#FF4D4F',
  conflict_zones: '#FF4D4F',
  hotspots: '#f59e0b',
  economic: '#52C41A',
  waterways: '#1890FF',
  natural: '#3b82f6',
  weather: '#22d3ee',
  live_weather: '#06b6d4',
  bases: '#94a3b8',
  nuclear: '#a855f7',
  sanctions: '#f43f5e',
  outages: '#fbbf24',
  aviation: '#38bdf8',
  live_flights: '#0ea5e9',
  maritime: '#0ea5e9',
  cables: '#22d3ee',
  econ_hubs: '#22c55e',
  minerals: '#a16207',
  daynight: '#fbbf24',
  pipelines: '#f97316',
  datacenters: '#6366f1',
  protests: '#ec4899',
  climate: '#14b8a6',
  launch_sites: '#6366f1',
  launch_log: '#a855f7',
  semiconductors: '#0891b2',
  garrisons: '#dc2626',
  deep_sea_mining: '#0e7490',
  tectonics: '#b45309',
  cable_incidents: '#e11d48',
  quake_depth: '#7c3aed',
  ground_stations: '#0ea5e9',
  sat_constellations: '#facc15',
  space_stations: '#22d3ee',
  satellites: '#7dd3fc',
  space_debris: '#a78bfa',
  space_events: '#e879f9',
  marine_archaeology: '#b45309',
  ocean_currents: '#06b6d4',
  fisheries: '#0284c7',
  monsoon: '#6366f1',
  atmospheric_circulation: '#8b5cf6',
  deep_exploration: '#0e7490',
};

const IMPACT_HALO: Record<ImpactLevel, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#60a5fa',
};

const NUCLEAR_KIND_IMAGE: Record<string, string> = {
  power_plant: 'nuclear-power',
  enrichment: 'nuclear-enrichment',
  reprocessing: 'nuclear-reprocessing',
  missile_silo: 'nuclear-silo',
  icbm_base: 'nuclear-icbm',
  submarine_base: 'nuclear-sub',
  warhead_storage: 'nuclear-warhead',
  test_site: 'nuclear-test',
  contamination: 'nuclear-contamination',
  research_reactor: 'nuclear-research',
};

const FACILITY_TYPE_IMAGE: Record<string, string> = {
  radar: 'base-radar',
  airfield: 'base-airfield',
  naval: 'base-naval',
  missile: 'base-missile',
  base: 'base-default',
};

const MINERAL_KIND_IMAGE: Record<string, string> = {
  lithium: 'mineral-lithium',
  cobalt: 'mineral-cobalt',
  rare_earth: 'mineral-rare_earth',
  copper: 'mineral-copper',
  nickel: 'mineral-nickel',
  iron: 'mineral-iron',
  uranium: 'mineral-uranium',
  bauxite: 'mineral-bauxite',
  tantalum: 'mineral-tantalum',
};

const LAUNCH_SITE_KIND_IMAGE: Record<string, string> = {
  orbital: 'launch-site-orbital',
  civilian: 'launch-site-civilian',
  military: 'launch-site-military',
};

const LAUNCH_LOG_STATUS_IMAGE: Record<string, string> = {
  success: 'launch-log-success',
  failure: 'launch-log-failure',
  partial: 'launch-log-partial',
  scheduled: 'launch-log-scheduled',
  scrubbed: 'launch-log-scrubbed',
};

const SEMI_KIND_IMAGE: Record<string, string> = {
  foundry: 'semi-foundry',
  memory: 'semi-memory',
  idm: 'semi-idm',
};

const GARRISON_KIND_IMAGE: Record<string, string> = {
  us: 'garrison-us',
  china: 'garrison-china',
  russia: 'garrison-russia',
  france: 'garrison-france',
  uk: 'garrison-uk',
};

const DSM_RESOURCE_IMAGE: Record<string, string> = {
  nodules: 'dsm-nodules',
  sulphides: 'dsm-sulphides',
  crusts: 'dsm-crusts',
};

const TECTONIC_KIND_IMAGE: Record<string, string> = {
  convergent: 'tectonic-convergent',
  divergent: 'tectonic-divergent',
  transform: 'tectonic-transform',
};

const QUAKE_DEPTH_IMAGE: Record<string, string> = {
  shallow: 'quake-shallow',
  intermediate: 'quake-intermediate',
  deep: 'quake-deep',
};

const GROUND_STATION_KIND_IMAGE: Record<string, string> = {
  deep_space: 'gs-deep-space',
  tracking: 'gs-tracking',
};

const SAT_KIND_IMAGE: Record<string, string> = {
  weather: 'sat-weather',
  comms: 'sat-comms',
  navigation: 'sat-navigation',
};

const SPACE_EVENT_KIND_IMAGE: Record<string, string> = {
  asat: 'space-asat',
  collision: 'space-collision',
  breakup: 'space-breakup',
  reentry: 'space-reentry',
  closeapproach: 'space-closeapproach',
};

const MARINE_ARCH_KIND_IMAGE: Record<string, string> = {
  ancient: 'arch-ancient',
  merchant: 'arch-merchant',
  galleon: 'arch-galleon',
  warship: 'arch-warship',
  modern: 'arch-modern',
  colonial: 'arch-merchant',
};

const FISHERY_KIND_IMAGE: Record<string, string> = {
  pelagic: 'fish-pelagic',
  groundfish: 'fish-groundfish',
  coastal: 'fish-coastal',
};

const MONSOON_KIND_IMAGE: Record<string, string> = {
  summer: 'monsoon-summer',
  winter: 'monsoon-winter',
  year_round: 'monsoon',
};

const ATMOS_KIND_IMAGE: Record<string, string> = {
  itcz: 'atmo-itcz',
  trade_wind: 'atmo-trade',
  jet_stream: 'atmo-jet',
  subtropical_high: 'atmospheric_circulation',
  hadley: 'atmospheric_circulation',
  polar: 'atmospheric_circulation',
  walker: 'atmospheric_circulation',
  semi_permanent: 'atmospheric_circulation',
};

const DEEP_EXPL_KIND_IMAGE: Record<string, string> = {
  trench: 'deep-trench',
  hydrothermal: 'deep-hydrothermal',
  manned: 'deep-manned',
  rov: 'deep-rov',
  institution: 'deep-institution',
};

const CLIMATE_KIND_IMAGE: Record<string, string> = {
  heatwave: 'climate-heatwave',
  drought: 'climate-drought',
  flood: 'climate-flood',
  ice: 'climate-ice',
  ocean: 'climate-ocean',
};

const INCIDENT_TYPE_IMAGE: Record<string, string> = {
  military: 'incident-military',
  political: 'incident-political',
  economic: 'incident-economic',
};

export interface MarkerStyleProps {
  layerId?: string;
  impact?: string;
  nuclearKind?: string;
  ftype?: string;
  etype?: string;
  production?: string;
  subKind?: string;
  launchStatus?: string;
}

export interface ResolvedMarkerStyle {
  markerImageId: string;
  markerEmoji: string;
  markerLabel: string;
  haloColor: string;
}

function toImpact(raw: string | undefined): ImpactLevel {
  if (raw === 'critical' || raw === 'high' || raw === 'medium' || raw === 'low') {
    return raw;
  }
  return 'medium';
}

function resolveImageId(props: MarkerStyleProps): string {
  const layerId = String(props.layerId ?? '');

  if (layerId === 'nuclear' || props.nuclearKind) {
    const kind = String(props.nuclearKind ?? '');
    return NUCLEAR_KIND_IMAGE[kind] ?? 'nuclear-default';
  }

  if (layerId === 'bases' && props.ftype) {
    return FACILITY_TYPE_IMAGE[String(props.ftype)] ?? 'base-default';
  }

  if (layerId === 'minerals' && props.subKind) {
    return MINERAL_KIND_IMAGE[String(props.subKind)] ?? 'minerals';
  }

  if (layerId === 'climate' && props.subKind) {
    return CLIMATE_KIND_IMAGE[String(props.subKind)] ?? 'climate';
  }

  if (layerId === 'launch_sites') {
    const kind = String(props.subKind ?? '');
    return LAUNCH_SITE_KIND_IMAGE[kind] ?? 'launch-site';
  }

  if (layerId === 'launch_log') {
    const status = String(props.launchStatus ?? props.subKind ?? '');
    return LAUNCH_LOG_STATUS_IMAGE[status] ?? 'launch-log';
  }

  if (layerId === 'semiconductors') {
    const kind = String(props.subKind ?? '');
    return SEMI_KIND_IMAGE[kind] ?? 'semiconductors';
  }

  if (layerId === 'garrisons') {
    const kind = String(props.subKind ?? '');
    return GARRISON_KIND_IMAGE[kind] ?? 'garrisons';
  }

  if (layerId === 'deep_sea_mining') {
    const kind = String(props.subKind ?? '');
    return DSM_RESOURCE_IMAGE[kind] ?? 'deep_sea_mining';
  }

  if (layerId === 'tectonics') {
    const kind = String(props.subKind ?? '');
    return TECTONIC_KIND_IMAGE[kind] ?? 'tectonics';
  }

  if (layerId === 'quake_depth') {
    const kind = String(props.subKind ?? '');
    return QUAKE_DEPTH_IMAGE[kind] ?? 'quake_depth';
  }

  if (layerId === 'ground_stations') {
    const kind = String(props.subKind ?? '');
    return GROUND_STATION_KIND_IMAGE[kind] ?? 'ground_stations';
  }

  if (layerId === 'sat_constellations') {
    const kind = String(props.subKind ?? '');
    return SAT_KIND_IMAGE[kind] ?? 'sat_constellations';
  }

  if (layerId === 'space_events') {
    const kind = String(props.subKind ?? '');
    return SPACE_EVENT_KIND_IMAGE[kind] ?? 'space_events';
  }

  if (layerId === 'marine_archaeology') {
    const kind = String(props.subKind ?? '');
    return MARINE_ARCH_KIND_IMAGE[kind] ?? 'marine_archaeology';
  }

  if (layerId === 'fisheries') {
    const kind = String(props.subKind ?? '');
    return FISHERY_KIND_IMAGE[kind] ?? 'fisheries';
  }

  if (layerId === 'monsoon') {
    const kind = String(props.subKind ?? '');
    return MONSOON_KIND_IMAGE[kind] ?? 'monsoon';
  }

  if (layerId === 'atmospheric_circulation') {
    const kind = String(props.subKind ?? '');
    return ATMOS_KIND_IMAGE[kind] ?? 'atmospheric_circulation';
  }

  if (layerId === 'deep_exploration') {
    const kind = String(props.subKind ?? '');
    return DEEP_EXPL_KIND_IMAGE[kind] ?? 'deep_exploration';
  }

  if (layerId === 'ocean_currents' && props.subKind === 'current-route') {
    return 'current-route';
  }

  if (props.etype) {
    return INCIDENT_TYPE_IMAGE[String(props.etype)] ?? layerId;
  }

  if (layerId === 'economic' && props.production) {
    return 'economic-oil';
  }

  if (layerId === 'cables' && props.subKind === 'cable-route') {
    return 'cable-route';
  }

  if (layerId in MARKER_REGISTRY) {
    return layerId;
  }

  return 'conflicts';
}

/** 根据要素属性解析地图图标与光晕 */
export function resolveMarkerStyle(props: MarkerStyleProps): ResolvedMarkerStyle {
  const imageId = resolveImageId(props);
  const entry = MARKER_REGISTRY[imageId] ?? MARKER_REGISTRY.conflicts;
  const layerId = String(props.layerId ?? '');
  const impact = toImpact(props.impact);
  const layerColor = LAYER_HALO_COLORS[layerId] ?? '#BFBFBF';
  const impactColor = IMPACT_HALO[impact];

  return {
    markerImageId: imageId,
    markerEmoji: entry.emoji,
    markerLabel: entry.label,
    haloColor: impact === 'critical' || impact === 'high' ? impactColor : layerColor,
  };
}

export interface LegendEntry {
  imageId: string;
  emoji: string;
  label: string;
}

export interface LegendGroup {
  layerId: LayerId;
  layerLabel: string;
  color: string;
  entries: LegendEntry[];
}

/** 各图层在图例中展示的图标子类 */
const LAYER_LEGEND_ENTRIES: Partial<Record<LayerId, string[]>> = {
  nuclear: [
    'nuclear-default',
    'nuclear-power',
    'nuclear-enrichment',
    'nuclear-silo',
    'nuclear-sub',
    'nuclear-warhead',
    'nuclear-test',
    'nuclear-contamination',
  ],
  bases: ['base-default', 'base-radar', 'base-airfield', 'base-naval', 'base-missile'],
  economic: ['economic', 'economic-oil'],
  conflicts: ['conflicts', 'incident-military', 'incident-political'],
  conflict_zones: ['conflict_zones'],
  military: ['military', 'incident-military'],
  natural: ['natural'],
  weather: ['weather'],
  live_weather: ['live-weather-radar', 'live-weather-city'],
  waterways: ['waterways'],
  hotspots: ['hotspots'],
  sanctions: ['sanctions'],
  outages: ['outages'],
  aviation: ['aviation'],
  live_flights: ['live_flights'],
  maritime: ['maritime'],
  cables: ['cables', 'cable-route'],
  econ_hubs: ['econ_hubs'],
  minerals: [
    'minerals',
    'mineral-lithium',
    'mineral-cobalt',
    'mineral-rare_earth',
    'mineral-copper',
    'mineral-nickel',
  ],
  daynight: ['daynight'],
  pipelines: ['pipelines'],
  datacenters: ['datacenters'],
  protests: ['protests'],
  climate: ['climate', 'climate-heatwave', 'climate-drought', 'climate-flood', 'climate-ice'],
  launch_sites: ['launch-site', 'launch-site-orbital', 'launch-site-civilian', 'launch-site-military'],
  launch_log: ['launch-log', 'launch-log-success', 'launch-log-failure', 'launch-log-partial', 'launch-log-scheduled', 'launch-log-scrubbed'],
  semiconductors: ['semiconductors', 'semi-foundry', 'semi-memory', 'semi-idm'],
  garrisons: ['garrison-us', 'garrison-china', 'garrison-russia', 'garrison-france', 'garrison-uk'],
  deep_sea_mining: ['deep_sea_mining', 'dsm-nodules', 'dsm-sulphides', 'dsm-crusts'],
  tectonics: ['tectonic-convergent', 'tectonic-divergent', 'tectonic-transform'],
  cable_incidents: ['cable_incidents'],
  quake_depth: ['quake-shallow', 'quake-intermediate', 'quake-deep'],
  ground_stations: ['gs-deep-space', 'gs-tracking'],
  sat_constellations: ['sat-weather', 'sat-comms', 'sat-navigation'],
  space_stations: ['space_stations'],
  satellites: ['satellites'],
  space_debris: ['space_debris'],
  space_events: ['space-asat', 'space-collision', 'space-breakup', 'space-reentry', 'space-closeapproach'],
  marine_archaeology: ['marine_archaeology', 'arch-ancient', 'arch-merchant', 'arch-galleon', 'arch-warship'],
  ocean_currents: ['ocean_currents', 'current-route'],
  fisheries: ['fisheries', 'fish-pelagic', 'fish-groundfish', 'fish-coastal'],
  monsoon: ['monsoon', 'monsoon-summer', 'monsoon-winter'],
  atmospheric_circulation: ['atmospheric_circulation', 'atmo-itcz', 'atmo-trade', 'atmo-jet'],
  deep_exploration: ['deep_exploration', 'deep-trench', 'deep-hydrothermal', 'deep-manned', 'deep-rov', 'deep-institution'],
};

/** 按当前开启图层生成图例分组 */
export function getLegendGroups(activeLayers: LayerId[]): LegendGroup[] {
  const groups: LegendGroup[] = [];

  for (const layerId of activeLayers) {
    const imageIds = LAYER_LEGEND_ENTRIES[layerId] ?? [layerId];
    const entries = imageIds
      .map((id) => {
        const reg = MARKER_REGISTRY[id];
        if (!reg) return null;
        return { imageId: id, emoji: reg.emoji, label: reg.label };
      })
      .filter((e): e is LegendEntry => e != null);

    if (entries.length === 0) continue;

    groups.push({
      layerId,
      layerLabel: LAYER_LABELS[layerId] ?? layerId,
      color: LAYER_HALO_COLORS[layerId] ?? '#BFBFBF',
      entries,
    });
  }

  return groups;
}

export const IMPACT_LEGEND: { level: ImpactLevel; label: string; color: string }[] = [
  { level: 'critical', label: '极高', color: IMPACT_HALO.critical },
  { level: 'high', label: '高', color: IMPACT_HALO.high },
  { level: 'medium', label: '中', color: IMPACT_HALO.medium },
  { level: 'low', label: '低', color: IMPACT_HALO.low },
];
