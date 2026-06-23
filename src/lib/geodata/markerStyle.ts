/**
 * 地图标记样式：按图层 / 设施子类 / 影响等级解析图标与光晕色
 */

import type { ImpactLevel, LayerId } from '@/types/geo';
import { LAYER_LABELS } from '@/lib/constants';
import {
  QUAKE_DEPTH_HALO,
  QUAKE_DEPTH_LABEL,
  QUAKE_MAG_HALO,
  QUAKE_MAG_LABEL,
  SEISMIC_LEGEND_HINTS,
  magBand,
  type QuakeDepthBand,
  type QuakeMagBand,
} from '@/lib/geodata/seismicStyle';
import {
  HYDROCARBON_LEGEND_HINTS,
  HYDROCARBON_TIER_HALO,
  HYDROCARBON_TIER_LABEL,
  HYDROCARBON_TIER_IMAGE,
  type HydrocarbonReserveTier,
} from '@/lib/geodata/hydrocarbonStyle';

/** 预注册图标（imageId → emoji + 图例标签） */
export const MARKER_REGISTRY: Record<string, { emoji: string; label: string }> = {
  conflicts: { emoji: '💥', label: '冲突事件' },
  conflict_zones: { emoji: '▧', label: '冲突区（填充）' },
  military: { emoji: '⚔️', label: '军事动态' },
  hotspots: { emoji: '🔥', label: '热点区域' },
  economic: { emoji: '📊', label: '经济节点' },
  'economic-oil': { emoji: '🛢️', label: '油气生产' },
  waterways: { emoji: '⚓', label: '水道港口' },
  natural: { emoji: '🌋', label: '其他自然灾害（GDACS）' },
  'quake-mag-low': { emoji: '📳', label: QUAKE_MAG_LABEL['mag-low'] },
  'quake-mag-medium': { emoji: '📳', label: QUAKE_MAG_LABEL['mag-medium'] },
  'quake-mag-high': { emoji: '📳', label: QUAKE_MAG_LABEL['mag-high'] },
  'quake-mag-critical': { emoji: '📳', label: QUAKE_MAG_LABEL['mag-critical'] },
  weather: { emoji: '🌪️', label: '气象预警' },
  'live-weather-radar': { emoji: '🌧️', label: '降水雷达' },
  'live-weather-city': { emoji: '🌡️', label: '城市实况' },
  sanctions: { emoji: '🚫', label: '制裁博弈' },
  outages: { emoji: '⚡', label: '基础设施中断' },
  aviation: { emoji: '✈️', label: '航空枢纽' },
  live_flights: { emoji: '✈️', label: '实时航班（ADS-B）' },
  live_fires: { emoji: '🔥', label: '实时火点（FIRMS VIIRS）' },
  live_maritime: { emoji: '🚢', label: '海运实时（AIS）' },
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
  'mineral-tungsten': { emoji: '🔩', label: '钨矿' },
  'mineral-titanium': { emoji: '🛩️', label: '钛矿' },
  'mineral-tin': { emoji: '🥫', label: '锡矿' },
  'mineral-vanadium': { emoji: '🧱', label: '钒矿' },
  'mineral-manganese': { emoji: '🧲', label: '锰矿' },
  'mineral-graphite': { emoji: '✏️', label: '石墨' },
  'mineral-diamond': { emoji: '💎', label: '钻石' },
  'mineral-gold': { emoji: '🪙', label: '金矿' },
  'mineral-potash': { emoji: '🌱', label: '钾肥' },
  'mineral-jade': { emoji: '🟢', label: '玉石' },
  'mineral-molybdenum': { emoji: '🔧', label: '钼矿' },
  daynight: { emoji: '🌓', label: '晨昏线' },
  pipelines: { emoji: '🛢️', label: '油气管线' },
  hydrocarbon_reserves: { emoji: '🛢️', label: '油气储藏' },
  'hydrocarbon-mega': { emoji: '🟤', label: HYDROCARBON_TIER_LABEL.mega },
  'hydrocarbon-large': { emoji: '🟡', label: HYDROCARBON_TIER_LABEL.large },
  'hydrocarbon-medium': { emoji: '🟫', label: HYDROCARBON_TIER_LABEL.medium },
  datacenters: { emoji: '🖥️', label: 'AI 数据中心' },
  protests: { emoji: '✊', label: '抗议活动' },
  climate: { emoji: '🌡️', label: '气候异常' },
  'climate-heatwave': { emoji: '🔥', label: '极端高温' },
  'climate-drought': { emoji: '🏜️', label: '干旱' },
  'climate-flood': { emoji: '🌊', label: '洪涝' },
  'climate-ice': { emoji: '🧊', label: '海冰异常' },
  'climate-ocean': { emoji: '🪸', label: '海洋生态' },
  'climate-wildfire': { emoji: '🔥', label: '野火' },
  'climate-storm': { emoji: '🌀', label: '风暴/台风' },
  'climate-haze': { emoji: '🌫️', label: '烟霾/空气污染' },
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
  quake_depth: { emoji: '📳', label: '震源深度' },
  'quake-shallow': { emoji: '🌊', label: QUAKE_DEPTH_LABEL.shallow },
  'quake-intermediate': { emoji: '🌊', label: QUAKE_DEPTH_LABEL.intermediate },
  'quake-deep': { emoji: '🌊', label: QUAKE_DEPTH_LABEL.deep },
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
  coral_reefs: { emoji: '🪸', label: '珊瑚礁' },
  marine_life: { emoji: '🐋', label: '海洋生物' },
  undersea_wonders: { emoji: '🌋', label: '海底奇观' },
  migration_routes: { emoji: '🐢', label: '迁徙路线' },
  world_heritage: { emoji: '🏛️', label: '世界遗产' },
  china_heritage: { emoji: '🏯', label: '国保单位' },
  megacities: { emoji: '🏙️', label: '特大城市' },
  'mega-30m': { emoji: '🌆', label: '3000万+ 都会区' },
  'mega-20m': { emoji: '🏙️', label: '2000万级都会区' },
  'mega-10m': { emoji: '🏛️', label: '1000万级都会区' },
  dams: { emoji: '🏗️', label: '水坝水电' },
  'dam-hydro-mega': { emoji: '💧', label: '巨型水电站（>10GW）' },
  'dam-hydro-large': { emoji: '⚡', label: '大型水电站' },
  'dam-irrigation': { emoji: '🚜', label: '灌溉/调水坝' },
  'dam-flood': { emoji: '🌊', label: '防洪/多用途坝' },
  ports: { emoji: '⚓', label: '主要港口' },
  'port-mega': { emoji: '🚢', label: '超级大港（>30M TEU）' },
  'port-large': { emoji: '🛳️', label: '大型港口' },
  'port-medium': { emoji: '⛴️', label: '中型港口' },
  research_stations: { emoji: '🧊', label: '极地科考站' },
  'rs-antarctic': { emoji: '🐧', label: '南极科考站' },
  'rs-arctic': { emoji: '🐻‍❄️', label: '北极科考站' },
  refineries: { emoji: '🏭', label: '炼油厂' },
  'ref-mega': { emoji: '🛢️', label: '超大型炼厂（>500kbd）' },
  'ref-large': { emoji: '🏭', label: '大型炼厂' },
  'ref-petrochem': { emoji: '🧪', label: '石化基地' },
  airports: { emoji: '✈️', label: '国际机场' },
  'ap-mega': { emoji: '🛫', label: '超级枢纽（>60M 旅客）' },
  'ap-large': { emoji: '✈️', label: '大型枢纽' },
  'ap-cargo': { emoji: '📦', label: '货运枢纽' },
  nuclear_reactors: { emoji: '☢️', label: '核电站' },
  'npp-mega': { emoji: '⚛️', label: '超大型核电站（>5GW）' },
  'npp-large': { emoji: '🔌', label: '大型核电站' },
  'npp-small': { emoji: '🔆', label: '中小型/SMR' },
  factories: { emoji: '🏭', label: '制造基地' },
  'fac-auto': { emoji: '🚗', label: '汽车制造' },
  'fac-shipyard': { emoji: '🚢', label: '造船基地' },
  'fac-steel': { emoji: '⚙️', label: '钢铁冶金' },
  'fac-electronics': { emoji: '📱', label: '电子制造' },
  financial_centers: { emoji: '🏦', label: '金融中心' },
  'fc-exchange': { emoji: '💹', label: '证券交易所' },
  'fc-central-bank': { emoji: '🏛️', label: '中央银行' },
  'fc-swf': { emoji: '💰', label: '主权财富基金' },
  borders: { emoji: '🛂', label: '边境口岸' },
  'border-land': { emoji: '🚧', label: '陆路口岸' },
  'border-megaproject': { emoji: '🌉', label: '跨境超级工程' },
  deserts: { emoji: '🏜️', label: '沙漠荒漠' },
  'desert-hot': { emoji: '🏜️', label: '热沙漠' },
  'desert-cold': { emoji: '🧊', label: '冷沙漠' },
  universities: { emoji: '🎓', label: '高等学府' },
  'uni-ivy': { emoji: '🏛️', label: '常春藤/顶尖' },
  'uni-public': { emoji: '🏫', label: '公立大学' },
  'uni-tech': { emoji: '🔬', label: '理工科大' },
  military_industry: { emoji: '🛡️', label: '军工企业' },
  'mi-aero': { emoji: '✈️', label: '航空军工' },
  'mi-arms': { emoji: '🔫', label: '武器/弹药' },
  'mi-space': { emoji: '🚀', label: '航天防务' },
  'mi-naval': { emoji: '🚢', label: '海军造舰' },
  wonder_projects: { emoji: '🏗️', label: '超级工程' },
  'wp-bridge': { emoji: '🌉', label: '桥梁' },
  'wp-tunnel': { emoji: '🚇', label: '隧道' },
  'wp-skyscraper': { emoji: '🏙️', label: '摩天楼' },
  'wp-megaproject': { emoji: '🏛️', label: '巨型基建' },
  agriculture: { emoji: '🌾', label: '农业产区' },
  'ag-grain': { emoji: '🌽', label: '粮食产区' },
  'ag-cash': { emoji: '☕', label: '经济作物' },
  'ag-livestock': { emoji: '🐄', label: '畜牧产区' },
  religions: { emoji: '⛪', label: '宗教圣地' },
  'rel-christian': { emoji: '⛪', label: '基督教圣地' },
  'rel-islam': { emoji: '🕌', label: '伊斯兰圣地' },
  'rel-buddhist': { emoji: '☸️', label: '佛教圣地' },
  'rel-hindu': { emoji: '🛕', label: '印度教圣地' },
  'rel-jewish': { emoji: '🕍', label: '犹太教圣地' },
  stadiums: { emoji: '🏟️', label: '体育场馆' },
  'st-football': { emoji: '⚽', label: '足球场' },
  'st-olympic': { emoji: '🥇', label: '奥运场馆' },
  'st-american': { emoji: '🏈', label: '美式橄榄球' },
  museums: { emoji: '🏛️', label: '博物馆' },
  'mus-art': { emoji: '🎨', label: '艺术博物馆' },
  'mus-history': { emoji: '📜', label: '历史博物馆' },
  'mus-science': { emoji: '🔬', label: '科学博物馆' },
  islands: { emoji: '🏝️', label: '主要岛屿' },
  'island-tropical': { emoji: '🌴', label: '热带岛屿' },
  'island-strategic': { emoji: '⚓', label: '战略岛屿' },
  'island-arctic': { emoji: '🧊', label: '北极岛屿' },
  capitals: { emoji: '🏙️', label: '各国首都' },
  'cap-superpower': { emoji: '🏛️', label: '大国首都' },
  'cap-regional': { emoji: '🏢', label: '地区首都' },
  'cap-small': { emoji: '🏘️', label: '小国首都' },
  power_plants: { emoji: '🏭', label: '火电与其他' },
  'pp-coal': { emoji: '⚫', label: '燃煤电厂' },
  'pp-gas': { emoji: '🔥', label: '燃气电厂' },
  'pp-renewable': { emoji: '♻️', label: '风光/地热' },
  forests: { emoji: '🌲', label: '森林生态' },
  'forest-tropical': { emoji: '🌴', label: '热带雨林' },
  'forest-temperate': { emoji: '🌳', label: '温带森林' },
  'forest-boreal': { emoji: '🌲', label: '北方针叶林' },
  earthquakes_historical: { emoji: '🌐', label: '历史大地震' },
  'eq-mega': { emoji: '💥', label: '巨震（M9+）' },
  'eq-great': { emoji: '⚠️', label: '大震（M8+）' },
  'eq-major': { emoji: '🔸', label: '强震（M7+）' },
  tech_companies: { emoji: '💻', label: '科技公司总部' },
  'tc-internet': { emoji: '🌐', label: '互联网/平台' },
  'tc-software': { emoji: '⚙️', label: '软件/SaaS' },
  'tc-cloud': { emoji: '☁️', label: '云/AI' },
  media_orgs: { emoji: '📺', label: '媒体机构' },
  'mo-news': { emoji: '📰', label: '通讯社/报纸' },
  'mo-tv': { emoji: '📡', label: '电视/广播' },
  'mo-tech-media': { emoji: '🎙️', label: '科技/新媒体' },
  auto_brands: { emoji: '🚗', label: '汽车品牌总部' },
  'ab-mass': { emoji: '🚙', label: '大众市场品牌' },
  'ab-luxury': { emoji: '🏎️', label: '豪华/超跑' },
  'ab-ev': { emoji: '🔋', label: '新能源/电动' },
  pharmaceutical: { emoji: '💊', label: '药企生物科技' },
  'ph-big-pharma': { emoji: '🏥', label: '大型药企' },
  'ph-biotech': { emoji: '🧬', label: '生物科技' },
  'ph-vaccine': { emoji: '💉', label: '疫苗厂商' },
  intl_orgs: { emoji: '🕊️', label: '国际组织' },
  'io-un': { emoji: '🏛️', label: '联合国系统' },
  'io-finance': { emoji: '💼', label: '国际金融机构' },
  'io-other': { emoji: '🤝', label: '多边/区域组织' },
  space_companies: { emoji: '🚀', label: '商业航天' },
  'sc-rocket': { emoji: '🚀', label: '火箭发射' },
  'sc-satellite': { emoji: '🛰️', label: '卫星/星座' },
  'sc-tourism': { emoji: '🧑‍🚀', label: '太空旅游' },
  rare_earth: { emoji: '♢', label: '稀土关键矿产' },
  're-mining': { emoji: '⛏️', label: '稀土开采' },
  're-refining': { emoji: '🏭', label: '精炼/加工' },
  're-strategic': { emoji: '⚠️', label: '战略储备/瓶颈' },
  flags_of_convenience: { emoji: '🚢', label: '船旗国避税地' },
  'foc-maritime': { emoji: '⛵', label: '船旗国' },
  'foc-tax': { emoji: '🏝️', label: '避税天堂' },
  'foc-finance': { emoji: '💎', label: '离岸金融中心' },
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
  pizza_index: { emoji: '🍕', label: '披萨指数门店' },
  'pizza-busy': { emoji: '🍕', label: '繁忙门店' },
  'pizza-quiet': { emoji: '🍕', label: '低繁忙门店' },
  persons: { emoji: '👤', label: '人物' },
  'person-political': { emoji: '🏛️', label: '政治人物' },
  'person-economic': { emoji: '💹', label: '经济人物' },
  'person-social': { emoji: '👥', label: '社会人物' },
  'person-cultural': { emoji: '🎭', label: '文化人物' },
  'person-military': { emoji: '⚔️', label: '军事人物' },
  // ── 产业链模块 ──
  aerospace_mfg: { emoji: '✈️', label: '航空制造' },
  'aero-airframer': { emoji: '🛩️', label: '飞机总装' },
  'aero-engine': { emoji: '🌀', label: '航空发动机' },
  'aero-supplier': { emoji: '🔩', label: 'Tier1 供应商' },
  defense_mfg: { emoji: '🛡️', label: '国防军工' },
  'def-prime': { emoji: '🎖️', label: '主承包商' },
  'def-shipyard': { emoji: '🚢', label: '造船厂' },
  'def-missiles': { emoji: '🚀', label: '导弹' },
  semi_supply: { emoji: '🔧', label: '半导体上游' },
  'semi-eda': { emoji: '💻', label: 'EDA 软件' },
  'semi-osat': { emoji: '📦', label: '封测 OSAT' },
  'semi-wafer': { emoji: '⚪', label: '硅晶圆' },
  'semi-materials': { emoji: '🧪', label: '材料/特气' },
  chemicals: { emoji: '⚗️', label: '化工与材料' },
  'chem-petrochem': { emoji: '🛢️', label: '石化' },
  'chem-specialty': { emoji: '🧬', label: '特种化学' },
  'chem-fertilizer': { emoji: '🌱', label: '化肥' },
  'chem-battery': { emoji: '🔋', label: '电池材料' },
};

/** 图层主色（光晕底色） */
export const LAYER_HALO_COLORS: Record<string, string> = {
  military: '#ef4444',
  conflicts: '#FF4D4F',
  conflict_zones: '#FF4D4F',
  hotspots: '#f59e0b',
  economic: '#52C41A',
  waterways: '#1890FF',
  natural: '#f59e0b',
  weather: '#22d3ee',
  live_weather: '#06b6d4',
  bases: '#94a3b8',
  nuclear: '#a855f7',
  sanctions: '#f43f5e',
  outages: '#fbbf24',
  aviation: '#38bdf8',
  live_flights: '#0ea5e9',
  live_fires: '#f97316',
  live_maritime: '#06b6d4',
  maritime: '#0ea5e9',
  cables: '#22d3ee',
  econ_hubs: '#22c55e',
  minerals: '#a16207',
  daynight: '#fbbf24',
  pipelines: '#f97316',
  hydrocarbon_reserves: '#8b6914',
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
  quake_depth: '#fb923c',
  ground_stations: '#0ea5e9',
  sat_constellations: '#facc15',
  space_stations: '#22d3ee',
  satellites: '#7dd3fc',
  space_debris: '#a78bfa',
  space_events: '#e879f9',
  marine_archaeology: '#b45309',
  ocean_currents: '#06b6d4',
  fisheries: '#0284c7',
  coral_reefs: '#fb7185',
  marine_life: '#2dd4bf',
  undersea_wonders: '#f59e0b',
  migration_routes: '#34d399',
  world_heritage: '#eab308',
  china_heritage: '#ef4444',
  megacities: '#a855f7',
  dams: '#0ea5e9',
  ports: '#14b8a6',
  research_stations: '#67e8f9',
  refineries: '#b45309',
  airports: '#2563eb',
  nuclear_reactors: '#7c3aed',
  factories: '#475569',
  financial_centers: '#16a34a',
  borders: '#dc2626',
  deserts: '#d97706',
  universities: '#1d4ed8',
  military_industry: '#991b1b',
  wonder_projects: '#9333ea',
  agriculture: '#65a30d',
  religions: '#c026d3',
  stadiums: '#ea580c',
  museums: '#0d9488',
  islands: '#0891b2',
  capitals: '#be123c',
  power_plants: '#525252',
  forests: '#15803d',
  earthquakes_historical: '#b91c1c',
  tech_companies: '#0284c7',
  media_orgs: '#db2777',
  auto_brands: '#4338ca',
  pharmaceutical: '#059669',
  intl_orgs: '#1e40af',
  space_companies: '#6d28d9',
  rare_earth: '#ca8a04',
  flags_of_convenience: '#0e7490',
  aerospace_mfg: '#2563eb',
  defense_mfg: '#b91c1c',
  semi_supply: '#0d9488',
  chemicals: '#7c3aed',
  monsoon: '#6366f1',
  atmospheric_circulation: '#8b5cf6',
  deep_exploration: '#0e7490',
  pizza_index: '#f97316',
  persons: '#8b5cf6',
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
  tungsten: 'mineral-tungsten',
  titanium: 'mineral-titanium',
  tin: 'mineral-tin',
  vanadium: 'mineral-vanadium',
  manganese: 'mineral-manganese',
  graphite: 'mineral-graphite',
  diamond: 'mineral-diamond',
  gold: 'mineral-gold',
  potash: 'mineral-potash',
  jade: 'mineral-jade',
  molybdenum: 'mineral-molybdenum',
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

const PERSON_DOMAIN_IMAGE: Record<string, string> = {
  政治: 'person-political',
  经济: 'person-economic',
  社会: 'person-social',
  文化: 'person-cultural',
  军事: 'person-military',
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

const QUAKE_MAG_IMAGE: Record<QuakeMagBand, string> = {
  'mag-low': 'quake-mag-low',
  'mag-medium': 'quake-mag-medium',
  'mag-high': 'quake-mag-high',
  'mag-critical': 'quake-mag-critical',
};

const QUAKE_DEPTH_IMAGE: Record<QuakeDepthBand, string> = {
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
  wildfire: 'climate-wildfire',
  storm: 'climate-storm',
  haze: 'climate-haze',
};

const MEGACITY_KIND_IMAGE: Record<string, string> = {
  '30m+': 'mega-30m',
  '20m+': 'mega-20m',
  '10m': 'mega-10m',
};

const DAM_KIND_IMAGE: Record<string, string> = {
  'hydro-mega': 'dam-hydro-mega',
  'hydro-large': 'dam-hydro-large',
  irrigation: 'dam-irrigation',
  flood: 'dam-flood',
};

const PORT_KIND_IMAGE: Record<string, string> = {
  mega: 'port-mega',
  large: 'port-large',
  medium: 'port-medium',
};

const RESEARCH_STATION_KIND_IMAGE: Record<string, string> = {
  antarctic: 'rs-antarctic',
  arctic: 'rs-arctic',
};

const REFINERY_KIND_IMAGE: Record<string, string> = {
  mega: 'ref-mega',
  large: 'ref-large',
  petrochem: 'ref-petrochem',
};

const AIRPORT_KIND_IMAGE: Record<string, string> = {
  mega: 'ap-mega',
  large: 'ap-large',
  cargo: 'ap-cargo',
};

const NUCLEAR_REACTOR_KIND_IMAGE: Record<string, string> = {
  mega: 'npp-mega',
  large: 'npp-large',
  small: 'npp-small',
};

const FACTORY_KIND_IMAGE: Record<string, string> = {
  auto: 'fac-auto',
  shipyard: 'fac-shipyard',
  steel: 'fac-steel',
  electronics: 'fac-electronics',
};

const FINANCIAL_CENTER_KIND_IMAGE: Record<string, string> = {
  exchange: 'fc-exchange',
  central_bank: 'fc-central-bank',
  swf: 'fc-swf',
};

const BORDER_KIND_IMAGE: Record<string, string> = {
  land: 'border-land',
  megaproject: 'border-megaproject',
};

const DESERT_KIND_IMAGE: Record<string, string> = {
  hot: 'desert-hot',
  cold: 'desert-cold',
};

const UNIVERSITY_KIND_IMAGE: Record<string, string> = {
  ivy: 'uni-ivy',
  public: 'uni-public',
  tech: 'uni-tech',
};

const MILITARY_INDUSTRY_KIND_IMAGE: Record<string, string> = {
  aero: 'mi-aero',
  arms: 'mi-arms',
  space: 'mi-space',
  naval: 'mi-naval',
};

const WONDER_PROJECT_KIND_IMAGE: Record<string, string> = {
  bridge: 'wp-bridge',
  tunnel: 'wp-tunnel',
  skyscraper: 'wp-skyscraper',
  megaproject: 'wp-megaproject',
};

const AGRICULTURE_KIND_IMAGE: Record<string, string> = {
  grain: 'ag-grain',
  cash: 'ag-cash',
  livestock: 'ag-livestock',
};

const RELIGION_KIND_IMAGE: Record<string, string> = {
  christian: 'rel-christian',
  islam: 'rel-islam',
  buddhist: 'rel-buddhist',
  hindu: 'rel-hindu',
  jewish: 'rel-jewish',
};

const STADIUM_KIND_IMAGE: Record<string, string> = {
  football: 'st-football',
  olympic: 'st-olympic',
  american: 'st-american',
};

const MUSEUM_KIND_IMAGE: Record<string, string> = {
  art: 'mus-art',
  history: 'mus-history',
  science: 'mus-science',
};

const ISLAND_KIND_IMAGE: Record<string, string> = {
  tropical: 'island-tropical',
  strategic: 'island-strategic',
  arctic: 'island-arctic',
};

const CAPITAL_KIND_IMAGE: Record<string, string> = {
  superpower: 'cap-superpower',
  regional: 'cap-regional',
  small: 'cap-small',
};

const POWER_PLANT_KIND_IMAGE: Record<string, string> = {
  coal: 'pp-coal',
  gas: 'pp-gas',
  renewable: 'pp-renewable',
};

const FOREST_KIND_IMAGE: Record<string, string> = {
  tropical: 'forest-tropical',
  temperate: 'forest-temperate',
  boreal: 'forest-boreal',
};

const EARTHQUAKE_HISTORICAL_KIND_IMAGE: Record<string, string> = {
  mega: 'eq-mega',
  great: 'eq-great',
  major: 'eq-major',
};

const TECH_COMPANY_KIND_IMAGE: Record<string, string> = {
  internet: 'tc-internet',
  software: 'tc-software',
  cloud: 'tc-cloud',
};

const MEDIA_ORG_KIND_IMAGE: Record<string, string> = {
  news: 'mo-news',
  tv: 'mo-tv',
  tech_media: 'mo-tech-media',
};

const AUTO_BRAND_KIND_IMAGE: Record<string, string> = {
  mass: 'ab-mass',
  luxury: 'ab-luxury',
  ev: 'ab-ev',
};

const PHARMACEUTICAL_KIND_IMAGE: Record<string, string> = {
  big_pharma: 'ph-big-pharma',
  biotech: 'ph-biotech',
  vaccine: 'ph-vaccine',
};

const INTL_ORG_KIND_IMAGE: Record<string, string> = {
  un: 'io-un',
  finance: 'io-finance',
  other: 'io-other',
};

const SPACE_COMPANY_KIND_IMAGE: Record<string, string> = {
  rocket: 'sc-rocket',
  satellite: 'sc-satellite',
  tourism: 'sc-tourism',
};

const RARE_EARTH_KIND_IMAGE: Record<string, string> = {
  mining: 're-mining',
  refining: 're-refining',
  strategic: 're-strategic',
};

const FLAGS_OF_CONVENIENCE_KIND_IMAGE: Record<string, string> = {
  maritime: 'foc-maritime',
  tax: 'foc-tax',
  finance: 'foc-finance',
};

const AEROSPACE_MFG_KIND_IMAGE: Record<string, string> = {
  airframer: 'aero-airframer',
  engine: 'aero-engine',
  supplier: 'aero-supplier',
};

const DEFENSE_MFG_KIND_IMAGE: Record<string, string> = {
  prime: 'def-prime',
  shipyard: 'def-shipyard',
  missiles: 'def-missiles',
};

const SEMI_SUPPLY_KIND_IMAGE: Record<string, string> = {
  eda: 'semi-eda',
  osat: 'semi-osat',
  wafer: 'semi-wafer',
  materials: 'semi-materials',
};

const CHEMICALS_KIND_IMAGE: Record<string, string> = {
  petrochem: 'chem-petrochem',
  specialty: 'chem-specialty',
  fertilizer: 'chem-fertilizer',
  battery: 'chem-battery',
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
  /** USGS 震级（实时地震） */
  mag?: number;
  live?: boolean;
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

  if (layerId === 'megacities' && props.subKind) {
    return MEGACITY_KIND_IMAGE[String(props.subKind)] ?? 'megacities';
  }

  if (layerId === 'dams' && props.subKind) {
    return DAM_KIND_IMAGE[String(props.subKind)] ?? 'dams';
  }

  if (layerId === 'ports' && props.subKind) {
    return PORT_KIND_IMAGE[String(props.subKind)] ?? 'ports';
  }

  if (layerId === 'research_stations' && props.subKind) {
    return RESEARCH_STATION_KIND_IMAGE[String(props.subKind)] ?? 'research_stations';
  }

  if (layerId === 'refineries' && props.subKind) {
    return REFINERY_KIND_IMAGE[String(props.subKind)] ?? 'refineries';
  }

  if (layerId === 'airports' && props.subKind) {
    return AIRPORT_KIND_IMAGE[String(props.subKind)] ?? 'airports';
  }

  if (layerId === 'nuclear_reactors' && props.subKind) {
    return NUCLEAR_REACTOR_KIND_IMAGE[String(props.subKind)] ?? 'nuclear_reactors';
  }

  if (layerId === 'factories' && props.subKind) {
    return FACTORY_KIND_IMAGE[String(props.subKind)] ?? 'factories';
  }

  if (layerId === 'financial_centers' && props.subKind) {
    return FINANCIAL_CENTER_KIND_IMAGE[String(props.subKind)] ?? 'financial_centers';
  }

  if (layerId === 'borders' && props.subKind) {
    return BORDER_KIND_IMAGE[String(props.subKind)] ?? 'borders';
  }

  if (layerId === 'deserts' && props.subKind) {
    return DESERT_KIND_IMAGE[String(props.subKind)] ?? 'deserts';
  }

  if (layerId === 'universities' && props.subKind) {
    return UNIVERSITY_KIND_IMAGE[String(props.subKind)] ?? 'universities';
  }

  if (layerId === 'military_industry' && props.subKind) {
    return MILITARY_INDUSTRY_KIND_IMAGE[String(props.subKind)] ?? 'military_industry';
  }

  if (layerId === 'wonder_projects' && props.subKind) {
    return WONDER_PROJECT_KIND_IMAGE[String(props.subKind)] ?? 'wonder_projects';
  }

  if (layerId === 'agriculture' && props.subKind) {
    return AGRICULTURE_KIND_IMAGE[String(props.subKind)] ?? 'agriculture';
  }

  if (layerId === 'religions' && props.subKind) {
    return RELIGION_KIND_IMAGE[String(props.subKind)] ?? 'religions';
  }

  if (layerId === 'stadiums' && props.subKind) {
    return STADIUM_KIND_IMAGE[String(props.subKind)] ?? 'stadiums';
  }

  if (layerId === 'museums' && props.subKind) {
    return MUSEUM_KIND_IMAGE[String(props.subKind)] ?? 'museums';
  }

  if (layerId === 'islands' && props.subKind) {
    return ISLAND_KIND_IMAGE[String(props.subKind)] ?? 'islands';
  }

  if (layerId === 'capitals' && props.subKind) {
    return CAPITAL_KIND_IMAGE[String(props.subKind)] ?? 'capitals';
  }

  if (layerId === 'power_plants' && props.subKind) {
    return POWER_PLANT_KIND_IMAGE[String(props.subKind)] ?? 'power_plants';
  }

  if (layerId === 'forests' && props.subKind) {
    return FOREST_KIND_IMAGE[String(props.subKind)] ?? 'forests';
  }

  if (layerId === 'earthquakes_historical' && props.subKind) {
    return EARTHQUAKE_HISTORICAL_KIND_IMAGE[String(props.subKind)] ?? 'earthquakes_historical';
  }

  if (layerId === 'tech_companies' && props.subKind) {
    return TECH_COMPANY_KIND_IMAGE[String(props.subKind)] ?? 'tech_companies';
  }

  if (layerId === 'media_orgs' && props.subKind) {
    return MEDIA_ORG_KIND_IMAGE[String(props.subKind)] ?? 'media_orgs';
  }

  if (layerId === 'auto_brands' && props.subKind) {
    return AUTO_BRAND_KIND_IMAGE[String(props.subKind)] ?? 'auto_brands';
  }

  if (layerId === 'pharmaceutical' && props.subKind) {
    return PHARMACEUTICAL_KIND_IMAGE[String(props.subKind)] ?? 'pharmaceutical';
  }

  if (layerId === 'intl_orgs' && props.subKind) {
    return INTL_ORG_KIND_IMAGE[String(props.subKind)] ?? 'intl_orgs';
  }

  if (layerId === 'space_companies' && props.subKind) {
    return SPACE_COMPANY_KIND_IMAGE[String(props.subKind)] ?? 'space_companies';
  }

  if (layerId === 'rare_earth' && props.subKind) {
    return RARE_EARTH_KIND_IMAGE[String(props.subKind)] ?? 'rare_earth';
  }

  if (layerId === 'flags_of_convenience' && props.subKind) {
    return FLAGS_OF_CONVENIENCE_KIND_IMAGE[String(props.subKind)] ?? 'flags_of_convenience';
  }

  if (layerId === 'aerospace_mfg' && props.subKind) {
    return AEROSPACE_MFG_KIND_IMAGE[String(props.subKind)] ?? 'aerospace_mfg';
  }

  if (layerId === 'defense_mfg' && props.subKind) {
    return DEFENSE_MFG_KIND_IMAGE[String(props.subKind)] ?? 'defense_mfg';
  }

  if (layerId === 'semi_supply' && props.subKind) {
    return SEMI_SUPPLY_KIND_IMAGE[String(props.subKind)] ?? 'semi_supply';
  }

  if (layerId === 'chemicals' && props.subKind) {
    return CHEMICALS_KIND_IMAGE[String(props.subKind)] ?? 'chemicals';
  }

  if (layerId === 'launch_sites') {
    const kind = String(props.subKind ?? '');
    return LAUNCH_SITE_KIND_IMAGE[kind] ?? 'launch-site';
  }

  if (layerId === 'launch_log') {
    const status = String(props.launchStatus ?? props.subKind ?? '');
    return LAUNCH_LOG_STATUS_IMAGE[status] ?? 'launch-log';
  }

  if (layerId === 'persons') {
    const domain = String(props.subKind ?? '');
    return PERSON_DOMAIN_IMAGE[domain] ?? 'persons';
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

  if (layerId === 'natural') {
    const sub = String(props.subKind ?? '');
    if (sub in QUAKE_MAG_IMAGE) return QUAKE_MAG_IMAGE[sub as QuakeMagBand];
    if (typeof props.mag === 'number' && Number.isFinite(props.mag)) {
      return QUAKE_MAG_IMAGE[magBand(props.mag)];
    }
    if (props.live && props.mag != null) {
      return QUAKE_MAG_IMAGE[magBand(Number(props.mag))];
    }
  }

  if (layerId === 'quake_depth') {
    const kind = String(props.subKind ?? '') as QuakeDepthBand;
    return QUAKE_DEPTH_IMAGE[kind] ?? 'quake_depth';
  }

  if (layerId === 'hydrocarbon_reserves') {
    const tier = String(props.subKind ?? '') as HydrocarbonReserveTier;
    return HYDROCARBON_TIER_IMAGE[tier] ?? 'hydrocarbon_reserves';
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

function resolveHaloColor(props: MarkerStyleProps, imageId: string): string {
  const layerId = String(props.layerId ?? '');
  const impact = toImpact(props.impact);
  const layerColor = LAYER_HALO_COLORS[layerId] ?? '#BFBFBF';
  const impactColor = IMPACT_HALO[impact];

  if (layerId === 'natural') {
    const sub = String(props.subKind ?? '');
    if (sub in QUAKE_MAG_HALO) return QUAKE_MAG_HALO[sub as QuakeMagBand];
    if (typeof props.mag === 'number' && Number.isFinite(props.mag)) {
      return QUAKE_MAG_HALO[magBand(props.mag)];
    }
    if (imageId.startsWith('quake-mag-')) {
      const band = imageId.replace('quake-mag-', 'mag-') as QuakeMagBand;
      if (band in QUAKE_MAG_HALO) return QUAKE_MAG_HALO[band];
    }
  }

  if (layerId === 'quake_depth') {
    const depthBand = String(props.subKind ?? '') as QuakeDepthBand;
    if (depthBand in QUAKE_DEPTH_HALO) return QUAKE_DEPTH_HALO[depthBand];
  }

  if (layerId === 'hydrocarbon_reserves') {
    const tier = String(props.subKind ?? '') as HydrocarbonReserveTier;
    if (tier in HYDROCARBON_TIER_HALO) return HYDROCARBON_TIER_HALO[tier];
  }

  return impact === 'critical' || impact === 'high' ? impactColor : layerColor;
}

/** 根据要素属性解析地图图标与光晕 */
export function resolveMarkerStyle(props: MarkerStyleProps): ResolvedMarkerStyle {
  const imageId = resolveImageId(props);
  const entry = MARKER_REGISTRY[imageId] ?? MARKER_REGISTRY.conflicts;

  return {
    markerImageId: imageId,
    markerEmoji: entry.emoji,
    markerLabel: entry.label,
    haloColor: resolveHaloColor(props, imageId),
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
  /** 图例分组悬停说明（如地震波 ≠ 油气储藏） */
  hint?: string;
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
  natural: [
    'quake-mag-low',
    'quake-mag-medium',
    'quake-mag-high',
    'quake-mag-critical',
    'natural',
  ],
  weather: ['weather'],
  live_weather: ['live-weather-radar', 'live-weather-city'],
  waterways: ['waterways'],
  hotspots: ['hotspots'],
  sanctions: ['sanctions'],
  outages: ['outages'],
  aviation: ['aviation'],
  live_flights: ['live_flights'],
  live_fires: ['live_fires'],
  live_maritime: ['live_maritime'],
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
    'mineral-iron',
    'mineral-uranium',
    'mineral-bauxite',
    'mineral-tungsten',
    'mineral-titanium',
    'mineral-tin',
    'mineral-graphite',
    'mineral-gold',
    'mineral-diamond',
    'mineral-potash',
  ],
  daynight: ['daynight'],
  pipelines: ['pipelines'],
  datacenters: ['datacenters'],
  protests: ['protests'],
  climate: ['climate', 'climate-heatwave', 'climate-drought', 'climate-flood', 'climate-ice', 'climate-wildfire', 'climate-storm', 'climate-haze'],
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
  pizza_index: ['pizza_index', 'pizza-busy', 'pizza-quiet'],
  persons: ['persons', 'person-political', 'person-economic', 'person-social', 'person-cultural', 'person-military'],
  megacities: ['mega-30m', 'mega-20m', 'mega-10m'],
  dams: ['dam-hydro-mega', 'dam-hydro-large', 'dam-irrigation', 'dam-flood'],
  ports: ['port-mega', 'port-large', 'port-medium'],
  research_stations: ['rs-antarctic', 'rs-arctic'],
  refineries: ['ref-mega', 'ref-large', 'ref-petrochem'],
  airports: ['ap-mega', 'ap-large', 'ap-cargo'],
  nuclear_reactors: ['npp-mega', 'npp-large', 'npp-small'],
  factories: ['fac-auto', 'fac-shipyard', 'fac-steel', 'fac-electronics'],
  financial_centers: ['fc-exchange', 'fc-central-bank', 'fc-swf'],
  borders: ['border-land', 'border-megaproject'],
  deserts: ['desert-hot', 'desert-cold'],
  universities: ['uni-ivy', 'uni-public', 'uni-tech'],
  military_industry: ['mi-aero', 'mi-arms', 'mi-space', 'mi-naval'],
  wonder_projects: ['wp-bridge', 'wp-tunnel', 'wp-skyscraper', 'wp-megaproject'],
  agriculture: ['ag-grain', 'ag-cash', 'ag-livestock'],
  religions: ['rel-christian', 'rel-islam', 'rel-buddhist', 'rel-hindu', 'rel-jewish'],
  stadiums: ['st-football', 'st-olympic', 'st-american'],
  museums: ['mus-art', 'mus-history', 'mus-science'],
  islands: ['island-tropical', 'island-strategic', 'island-arctic'],
  capitals: ['cap-superpower', 'cap-regional', 'cap-small'],
  power_plants: ['pp-coal', 'pp-gas', 'pp-renewable'],
  forests: ['forest-tropical', 'forest-temperate', 'forest-boreal'],
  earthquakes_historical: ['eq-mega', 'eq-great', 'eq-major'],
  tech_companies: ['tc-internet', 'tc-software', 'tc-cloud'],
  media_orgs: ['mo-news', 'mo-tv', 'mo-tech-media'],
  auto_brands: ['ab-mass', 'ab-luxury', 'ab-ev'],
  pharmaceutical: ['ph-big-pharma', 'ph-biotech', 'ph-vaccine'],
  intl_orgs: ['io-un', 'io-finance', 'io-other'],
  space_companies: ['sc-rocket', 'sc-satellite', 'sc-tourism'],
  rare_earth: ['re-mining', 're-refining', 're-strategic'],
  flags_of_convenience: ['foc-maritime', 'foc-tax', 'foc-finance'],
  aerospace_mfg: ['aero-airframer', 'aero-engine', 'aero-supplier'],
  defense_mfg: ['def-prime', 'def-shipyard', 'def-missiles'],
  semi_supply: ['semi-eda', 'semi-osat', 'semi-wafer', 'semi-materials'],
  chemicals: ['chem-petrochem', 'chem-specialty', 'chem-fertilizer', 'chem-battery'],
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
      hint: SEISMIC_LEGEND_HINTS[layerId] ?? HYDROCARBON_LEGEND_HINTS[layerId],
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
