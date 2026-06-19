/**
 * 全球主题图层种子数据 — 经济中心 / 矿产 / 管线 / AI 数据中心 / 抗议 / 气候异常
 *
 * ⚠ 公开资料汇总与示意坐标，非实时情报。整理日：2026-06-16
 */

import type { ImpactLevel, LayerId } from '@/types/geo';
import {
  DENSIFY_ECON_HUBS,
  DENSIFY_MINERALS,
  DENSIFY_DATACENTERS,
  DENSIFY_PROTESTS,
  DENSIFY_CLIMATE,
  DENSIFY_PIPELINES,
} from './global.layers-densify-r2';
import { DENSIFY_INFRA } from './global.densify-infra';
import { DENSIFY_INFRA_R2 } from './global.densify-infra-r2';

export interface ThematicPoint {
  id: string;
  name: string;
  layerId: LayerId;
  lng: number;
  lat: number;
  note: string;
  impact: ImpactLevel;
  /** 子类（矿产类型等） */
  subKind?: string;
  /** 时效图层的时间戳（抗议、气候） */
  updatedAt?: string;
}

export interface PipelineRoute {
  id: string;
  name: string;
  coordinates: [number, number][];
  note: string;
  impact: ImpactLevel;
}

const T = '2026-06-15T10:00:00Z';
const T2 = '2026-06-14T08:00:00Z';
const T3 = '2026-06-13T16:00:00Z';

/** 全球主要经济金融中心 */
export const GLOBAL_ECON_HUBS: ThematicPoint[] = [
  { id: 'hub-nyc', name: '纽约 · 华尔街', layerId: 'econ_hubs', lng: -74.01, lat: 40.71, note: '全球金融中心、纽交所', impact: 'critical' },
  { id: 'hub-london', name: '伦敦金融城', layerId: 'econ_hubs', lng: -0.09, lat: 51.51, note: '欧洲首要金融中心', impact: 'critical' },
  { id: 'hub-tokyo', name: '东京丸之内', layerId: 'econ_hubs', lng: 139.76, lat: 35.68, note: '亚洲老牌金融枢纽', impact: 'high' },
  { id: 'hub-shanghai', name: '上海陆家嘴', layerId: 'econ_hubs', lng: 121.5, lat: 31.24, note: '中国国际金融中心', impact: 'critical' },
  { id: 'hub-hk', name: '香港中环', layerId: 'econ_hubs', lng: 114.16, lat: 22.28, note: '离岸人民币与亚太融资枢纽', impact: 'critical' },
  { id: 'hub-singapore', name: '新加坡莱佛士坊', layerId: 'econ_hubs', lng: 103.85, lat: 1.28, note: '东南亚财富与贸易管理中心', impact: 'high' },
  { id: 'hub-frankfurt', name: '法兰克福', layerId: 'econ_hubs', lng: 8.68, lat: 50.11, note: '欧洲央行所在地', impact: 'high' },
  { id: 'hub-dubai', name: '迪拜 DIFC', layerId: 'econ_hubs', lng: 55.27, lat: 25.2, note: '中东金融与转口贸易中心', impact: 'high' },
  { id: 'hub-sf', name: '旧金山湾区', layerId: 'econ_hubs', lng: -122.4, lat: 37.77, note: '全球科技与风投中心', impact: 'high' },
  { id: 'hub-mumbai', name: '孟买 BKC', layerId: 'econ_hubs', lng: 72.87, lat: 19.06, note: '南亚金融与资本市场核心', impact: 'medium' },
  { id: 'hub-saopaulo', name: '圣保罗', layerId: 'econ_hubs', lng: -46.63, lat: -23.55, note: '拉美最大经济都市', impact: 'medium' },
  { id: 'hub-sydney', name: '悉尼', layerId: 'econ_hubs', lng: 151.21, lat: -33.87, note: '南太平洋金融门户', impact: 'medium' },
  { id: 'hub-zurich', name: '苏黎世', layerId: 'econ_hubs', lng: 8.54, lat: 47.37, note: '全球私人银行与资产管理中心', impact: 'high' },
  { id: 'hub-toronto', name: '多伦多', layerId: 'econ_hubs', lng: -79.38, lat: 43.65, note: '北美第二大金融中心', impact: 'medium' },
  { id: 'hub-seoul', name: '首尔汝矣岛', layerId: 'econ_hubs', lng: 126.92, lat: 37.52, note: '东北亚证券与衍生品枢纽', impact: 'high' },
  { id: 'hub-beijing', name: '北京金融街', layerId: 'econ_hubs', lng: 116.36, lat: 39.91, note: '中国政策性金融与监管中心', impact: 'critical' },
  { id: 'hub-shenzhen', name: '深圳前海', layerId: 'econ_hubs', lng: 113.9, lat: 22.52, note: '跨境人民币与科创融资试验区', impact: 'high' },
  { id: 'hub-riyadh', name: '利雅得', layerId: 'econ_hubs', lng: 46.72, lat: 24.71, note: '中东主权财富与能源金融枢纽', impact: 'high' },
  { id: 'hub-johannesburg', name: '约翰内斯堡', layerId: 'econ_hubs', lng: 28.05, lat: -26.2, note: '非洲最大股票交易所所在地', impact: 'medium' },
  { id: 'hub-istanbul-fin', name: '伊斯坦布尔金融区', layerId: 'econ_hubs', lng: 29.01, lat: 41.08, note: '欧亚跨境资本与伊斯兰金融节点', impact: 'medium' },
  { id: 'hub-mexico-city', name: '墨西哥城', layerId: 'econ_hubs', lng: -99.13, lat: 19.43, note: '拉美第二大经济体金融核心', impact: 'medium' },
  ...DENSIFY_ECON_HUBS,
];

/** 关键矿产与战略资源产地 */
export const GLOBAL_MINERALS: ThematicPoint[] = [
  { id: 'min-congo-cobalt', name: '刚果（金）· 钴矿带', layerId: 'minerals', lng: 27.48, lat: -11.66, note: '全球约 70% 钴供应', impact: 'critical', subKind: 'cobalt' },
  { id: 'min-chile-lithium', name: '智利阿塔卡马 · 锂', layerId: 'minerals', lng: -68.2, lat: -23.5, note: '盐湖提锂核心产区', impact: 'critical', subKind: 'lithium' },
  { id: 'min-argentina-lithium', name: '阿根廷锂三角', layerId: 'minerals', lng: -66.5, lat: -25.0, note: '南美锂资源集中带', impact: 'high', subKind: 'lithium' },
  { id: 'min-bayan-obo', name: '白云鄂博 · 稀土', layerId: 'minerals', lng: 109.97, lat: 41.77, note: '全球最大稀土矿之一', impact: 'critical', subKind: 'rare_earth' },
  { id: 'min-pilbara', name: '西澳皮尔巴拉 · 铁矿', layerId: 'minerals', lng: 118.5, lat: -22.5, note: '全球海运铁矿主产区', impact: 'high', subKind: 'iron' },
  { id: 'min-chile-copper', name: '智利铜矿带', layerId: 'minerals', lng: -70.0, lat: -22.3, note: '全球最大铜生产国', impact: 'critical', subKind: 'copper' },
  { id: 'min-indonesia-nickel', name: '印尼苏拉威西 · 镍', layerId: 'minerals', lng: 121.0, lat: -2.5, note: '电动车电池镍供应枢纽', impact: 'high', subKind: 'nickel' },
  { id: 'min-guinea-bauxite', name: '几内亚 · 铝土矿', layerId: 'minerals', lng: -13.7, lat: 10.4, note: '全球最大铝土矿出口国', impact: 'high', subKind: 'bauxite' },
  { id: 'min-kazakh-uranium', name: '哈萨克斯坦 · 铀', layerId: 'minerals', lng: 66.9, lat: 48.0, note: '全球最大铀生产国', impact: 'high', subKind: 'uranium' },
  { id: 'min-drc-tantalum', name: '刚果（金）· 钽铌', layerId: 'minerals', lng: 28.3, lat: -1.7, note: '电子产业关键金属', impact: 'medium', subKind: 'tantalum' },
  { id: 'min-greenland-rare', name: '格陵兰 · 稀土潜力区', layerId: 'minerals', lng: -45.0, lat: 61.0, note: '北极资源开发争议焦点', impact: 'medium', subKind: 'rare_earth' },
  { id: 'min-peru-copper', name: '秘鲁安第斯 · 铜矿', layerId: 'minerals', lng: -77.0, lat: -12.0, note: '全球第二大铜生产国矿区带', impact: 'high', subKind: 'copper' },
  { id: 'min-sa-gold', name: '南非威特沃特斯兰德 · 金矿', layerId: 'minerals', lng: 27.85, lat: -26.2, note: '全球最深金矿带，黄金供应关键', impact: 'high', subKind: 'gold' },
  { id: 'min-mongolia-copper', name: '蒙古奥尤陶勒盖 · 铜金', layerId: 'minerals', lng: 106.85, lat: 43.0, note: '中亚最大未开发铜矿之一', impact: 'high', subKind: 'copper' },
  { id: 'min-canada-potash', name: '加拿大萨斯喀彻温 · 钾肥', layerId: 'minerals', lng: -106.0, lat: 52.0, note: '全球钾肥出口核心产区', impact: 'medium', subKind: 'potash' },
  { id: 'min-brazil-iron', name: '巴西米纳斯吉拉斯 · 铁矿', layerId: 'minerals', lng: -44.0, lat: -19.5, note: '淡水河谷主产区，全球铁矿供应', impact: 'high', subKind: 'iron' },
  { id: 'min-myanmar-jade', name: '缅甸克钦邦 · 玉石矿区', layerId: 'minerals', lng: 96.8, lat: 25.5, note: '高端玉石与冲突矿产监管焦点', impact: 'medium', subKind: 'jade' },
  { id: 'min-spain-lithium', name: '西班牙埃斯特雷马杜拉 · 锂', layerId: 'minerals', lng: -6.5, lat: 39.0, note: '欧洲本土锂资源开发试点', impact: 'medium', subKind: 'lithium' },
  { id: 'min-us-moly', name: '美国科罗拉多 · 钼矿', layerId: 'minerals', lng: -106.0, lat: 38.0, note: '特种合金关键金属', impact: 'low', subKind: 'molybdenum' },
  ...DENSIFY_MINERALS,
];

export const GLOBAL_PIPELINES: PipelineRoute[] = [
  {
    id: 'pipe-nordstream',
    name: '北溪 / 波罗的海管道',
    coordinates: [[30.5, 69.0], [20.0, 60.0], [12.0, 55.0], [8.5, 53.5]],
    note: '俄气至欧洲海底管道（部分停运）',
    impact: 'critical',
  },
  {
    id: 'pipe-druzhba',
    name: '友谊管道（Druzhba）',
    coordinates: [[49.0, 55.8], [36.0, 52.0], [24.0, 50.5], [14.5, 51.0], [8.7, 50.1]],
    note: '俄罗斯经东欧向中欧供油主干线',
    impact: 'high',
  },
  {
    id: 'pipe-transalaska',
    name: '阿拉斯加输油管道',
    coordinates: [[-149.5, 70.2], [-152.0, 65.0], [-150.5, 62.5], [-149.0, 60.5]],
    note: '北美北极石油外运通道',
    impact: 'high',
  },
  {
    id: 'pipe-west-east-cn',
    name: '西气东输（中国）',
    coordinates: [[84.0, 41.0], [95.0, 40.5], [108.0, 36.0], [114.0, 34.5], [121.0, 31.2]],
    note: '塔里木—长三角天然气干线',
    impact: 'critical',
  },
  {
    id: 'pipe-tapi',
    name: 'TAPI 天然气管道',
    coordinates: [[66.0, 35.0], [62.0, 32.0], [58.0, 28.0], [52.0, 26.0], [45.0, 25.5]],
    note: '土库曼斯坦—阿富汗—巴基斯坦—印度',
    impact: 'medium',
  },
  {
    id: 'pipe-keystone',
    name: 'Keystone / 北美原油管网',
    coordinates: [[-110.0, 54.5], [-106.0, 50.0], [-100.0, 45.0], [-95.0, 39.0], [-89.0, 29.5]],
    note: '加拿大油砂至美国墨西哥湾方向',
    impact: 'high',
  },
  {
    id: 'pipe-medgaz',
    name: 'Medgaz / 地中海海底气管',
    coordinates: [[-0.5, 35.8], [-1.0, 37.0], [0.5, 38.5], [2.5, 40.5], [4.5, 42.0]],
    note: '阿尔及利亚经地中海至西班牙',
    impact: 'medium',
  },
  {
    id: 'pipe-power-siberia',
    name: '中俄东线天然气管道',
    coordinates: [[104.0, 52.0], [120.0, 48.0], [126.0, 45.0], [131.0, 43.0], [125.0, 42.0]],
    note: '西伯利亚气田至中国东北干线（种子/示例走向）',
    impact: 'critical',
  },
  {
    id: 'pipe-east-med',
    name: '东地中海天然气管道',
    coordinates: [[34.8, 31.5], [33.0, 33.5], [30.0, 35.0], [28.0, 36.5], [26.0, 38.0]],
    note: '以色列—塞浦路斯—希腊走廊（种子/示例）',
    impact: 'high',
  },
  {
    id: 'pipe-southern-gas',
    name: '南部天然气走廊（TANAP/TAP）',
    coordinates: [[44.0, 41.0], [38.0, 40.5], [32.0, 40.0], [26.0, 40.5], [20.0, 41.0], [12.0, 42.0]],
    note: '阿塞拜疆经土耳其至意大利（种子/示例）',
    impact: 'high',
  },
  {
    id: 'pipe-baku-tbilisi',
    name: '巴库—第比利斯—杰伊汉原油管道',
    coordinates: [[49.9, 40.4], [47.0, 41.5], [44.0, 42.0], [42.0, 42.5], [35.0, 41.0], [29.0, 40.5]],
    note: '里海石油绕过俄罗斯出口通道',
    impact: 'high',
  },
  {
    id: 'pipe-brazil-bolivia',
    name: '玻利维亚—巴西天然气管道',
    coordinates: [[-63.0, -17.0], [-60.0, -19.0], [-55.0, -22.0], [-50.0, -24.0], [-46.0, -23.5]],
    note: '南美内陆气田至圣保罗工业区（种子/示例）',
    impact: 'medium',
  },
  {
    id: 'pipe-nigeria-lng',
    name: '尼日利亚 LNG 出口管线',
    coordinates: [[7.0, 4.5], [6.5, 5.0], [5.5, 5.5], [4.0, 5.0], [3.5, 4.5]],
    note: '尼日尔三角洲至 Bonny 岛液化终端',
    impact: 'medium',
  },
  ...DENSIFY_PIPELINES,
];

/** 全球 AI / 超算数据中心集群 */
export const GLOBAL_DATACENTERS: ThematicPoint[] = [
  { id: 'dc-ashburn', name: '弗吉尼亚 Ashburn', layerId: 'datacenters', lng: -77.49, lat: 39.04, note: '全球最大数据中心集群，AI 训练负载密集', impact: 'critical' },
  { id: 'dc-dublin', name: '都柏林', layerId: 'datacenters', lng: -6.26, lat: 53.35, note: '欧洲云与 AI 算力枢纽', impact: 'high' },
  { id: 'dc-singapore', name: '新加坡', layerId: 'datacenters', lng: 103.8, lat: 1.35, note: '亚太低时延 AI 推理节点', impact: 'high' },
  { id: 'dc-iowa', name: '爱荷华州', layerId: 'datacenters', lng: -93.6, lat: 41.6, note: '北美中部超大规模数据中心带', impact: 'high' },
  { id: 'dc-nevada', name: '内华达', layerId: 'datacenters', lng: -115.14, lat: 36.2, note: '西部算力与储能配套园区', impact: 'medium' },
  { id: 'dc-guizhou', name: '贵州贵安', layerId: 'datacenters', lng: 106.63, lat: 26.41, note: '中国「东数西算」西节点', impact: 'high' },
  { id: 'dc-inner-mongolia', name: '内蒙古和林格尔', layerId: 'datacenters', lng: 111.82, lat: 40.38, note: '中国北方算力枢纽', impact: 'high' },
  { id: 'dc-helsinki', name: '芬兰', layerId: 'datacenters', lng: 24.94, lat: 60.17, note: '北欧绿色能源算力中心', impact: 'medium' },
  { id: 'dc-uae', name: '阿联酋', layerId: 'datacenters', lng: 54.37, lat: 24.45, note: '中东 AI 主权云投资热点', impact: 'medium' },
  { id: 'dc-tokyo', name: '东京', layerId: 'datacenters', lng: 139.69, lat: 35.68, note: '东亚 AI 推理与金融算力', impact: 'medium' },
  { id: 'dc-mumbai', name: '孟买', layerId: 'datacenters', lng: 72.88, lat: 19.08, note: '南亚云与 BPO 算力枢纽', impact: 'medium' },
  { id: 'dc-seoul', name: '首尔', layerId: 'datacenters', lng: 127.0, lat: 37.5, note: '韩日低时延 AI 推理节点', impact: 'medium' },
  { id: 'dc-london', name: '伦敦', layerId: 'datacenters', lng: -0.12, lat: 51.5, note: '欧洲金融与 AI 合规算力', impact: 'high' },
  { id: 'dc-frankfurt', name: '法兰克福', layerId: 'datacenters', lng: 8.68, lat: 50.11, note: '欧洲互联交换与云区域枢纽', impact: 'high' },
  { id: 'dc-sydney', name: '悉尼', layerId: 'datacenters', lng: 151.2, lat: -33.87, note: '澳新主权云与 AI 试点', impact: 'medium' },
  { id: 'dc-saopaulo', name: '圣保罗', layerId: 'datacenters', lng: -46.63, lat: -23.55, note: '拉美最大云与金融科技算力', impact: 'medium' },
  { id: 'dc-taipei', name: '台北', layerId: 'datacenters', lng: 121.56, lat: 25.04, note: '半导体与 AI 芯片设计配套算力', impact: 'high' },
  { id: 'dc-riyadh', name: '利雅得', layerId: 'datacenters', lng: 46.72, lat: 24.71, note: '中东主权 AI 与云计算投资', impact: 'medium' },
  ...DENSIFY_DATACENTERS,
];

/** 近期抗议与社会动员（种子示例） */
export const GLOBAL_PROTESTS: ThematicPoint[] = [
  { id: 'pro-fr-pension', name: '巴黎 · 养老金改革抗议', layerId: 'protests', lng: 2.35, lat: 48.86, note: '全国性罢工与示威持续', impact: 'high', updatedAt: T },
  { id: 'pro-ge-tbilisi', name: '第比利斯 · 外国代理人法抗议', layerId: 'protests', lng: 44.8, lat: 41.72, note: '亲欧示威与议会对峙', impact: 'high', updatedAt: T2 },
  { id: 'pro-bd-dhaka', name: '达卡 · 配额制抗议', layerId: 'protests', lng: 90.41, lat: 23.81, note: '青年就业诉求引发大规模集会', impact: 'critical', updatedAt: T3 },
  { id: 'pro-ke-nairobi', name: '内罗毕 · 财政紧缩抗议', layerId: 'protests', lng: 36.82, lat: -1.29, note: '税收与物价上涨引发街头示威', impact: 'medium', updatedAt: T2 },
  { id: 'pro-ar-buenos', name: '布宜诺斯艾利斯 · 经济紧缩抗议', layerId: 'protests', lng: -58.38, lat: -34.6, note: '通胀与减支政策引发工会动员', impact: 'medium', updatedAt: T },
  { id: 'pro-us-campus', name: '美国多校 · 校园示威', layerId: 'protests', lng: -74.0, lat: 40.73, note: '中东政策相关校园集会（种子点位）', impact: 'medium', updatedAt: T3 },
  { id: 'pro-iran-women', name: '德黑兰 · 社会诉求集会', layerId: 'protests', lng: 51.42, lat: 35.69, note: '公民权利相关零星示威', impact: 'high', updatedAt: T2 },
  { id: 'pro-seoul-labor', name: '首尔 · 劳工权益集会', layerId: 'protests', lng: 126.98, lat: 37.57, note: '制造业工会要求加薪与工时改革（种子/示例）', impact: 'medium', updatedAt: T },
  { id: 'pro-jakarta-election', name: '雅加达 · 选举后示威', layerId: 'protests', lng: 106.85, lat: -6.21, note: '地方选举争议引发街头集会（种子/示例）', impact: 'medium', updatedAt: T3 },
  { id: 'pro-london-climate', name: '伦敦 · 气候行动游行', layerId: 'protests', lng: -0.12, lat: 51.51, note: '环保组织要求加速能源转型（种子/示例）', impact: 'low', updatedAt: T2 },
  { id: 'pro-santiago-pension', name: '圣地亚哥 · 养老金改革抗议', layerId: 'protests', lng: -70.67, lat: -33.45, note: '社保私有化争议持续（种子/示例）', impact: 'medium', updatedAt: T },
  { id: 'pro-cairo-economic', name: '开罗 · 物价上涨抗议', layerId: 'protests', lng: 31.24, lat: 30.04, note: '通胀与补贴削减引发社会压力（种子/示例）', impact: 'high', updatedAt: T3 },
  { id: 'pro-berlin-housing', name: '柏林 · 住房租金抗议', layerId: 'protests', lng: 13.4, lat: 52.52, note: '租金上限与保障房诉求（种子/示例）', impact: 'low', updatedAt: T2 },
  { id: 'pro-manila-corruption', name: '马尼拉 · 反腐示威', layerId: 'protests', lng: 120.98, lat: 14.6, note: '公共采购腐败调查引发集会（种子/示例）', impact: 'medium', updatedAt: T },
  ...DENSIFY_PROTESTS,
];

/** 气候异常监测点（种子示例） */
export const GLOBAL_CLIMATE: ThematicPoint[] = [
  { id: 'cli-india-heat', name: '印度次大陆 · 极端热浪', layerId: 'climate', lng: 78.96, lat: 20.59, note: '2026 初夏多地突破 45°C，农业与供电承压', impact: 'critical', updatedAt: T, subKind: 'heatwave' },
  { id: 'cli-mexico-drought', name: '墨西哥城 · 严重干旱', layerId: 'climate', lng: -99.13, lat: 19.43, note: '水库蓄水量创新低，限水措施', impact: 'high', updatedAt: T2, subKind: 'drought' },
  { id: 'cli-brazil-flood', name: '巴西南里奥格兰德 · 洪涝', layerId: 'climate', lng: -51.23, lat: -30.03, note: '持续强降雨致大规模洪灾', impact: 'critical', updatedAt: T, subKind: 'flood' },
  { id: 'cli-eu-warm', name: '西欧 · 暖冬后异常高温', layerId: 'climate', lng: 2.35, lat: 48.86, note: '厄尔尼诺余温叠加区域热岛', impact: 'medium', updatedAt: T3, subKind: 'heatwave' },
  { id: 'cli-china-rain', name: '华南 · 极端强降雨', layerId: 'climate', lng: 113.26, lat: 23.13, note: '梅雨锋面持续，城市内涝风险', impact: 'high', updatedAt: T2, subKind: 'flood' },
  { id: 'cli-arctic-ice', name: '北极海冰 · 历史低位', layerId: 'climate', lng: 0.0, lat: 82.0, note: '北极夏季海冰范围低于常年均值', impact: 'high', updatedAt: T, subKind: 'ice' },
  { id: 'cli-australia-coral', name: '大堡礁 · 珊瑚白化预警', layerId: 'climate', lng: 147.0, lat: -18.0, note: '海水温度过高触发 bleaching alert', impact: 'medium', updatedAt: T3, subKind: 'ocean' },
  { id: 'cli-sa-drought', name: '南非开普敦 · 干旱预警', layerId: 'climate', lng: 18.42, lat: -33.92, note: '水库蓄水量低于常年，限水措施（种子/示例）', impact: 'high', updatedAt: T2, subKind: 'drought' },
  { id: 'cli-sea-haze', name: '东南亚 · 跨境烟霾', layerId: 'climate', lng: 104.0, lat: 0.5, note: '印尼烧芭引发新马空气质量恶化（种子/示例）', impact: 'high', updatedAt: T, subKind: 'haze' },
  { id: 'cli-us-tornado', name: '美国中部 · 龙卷风高发季', layerId: 'climate', lng: -97.0, lat: 35.5, note: '强对流天气频发，保险损失上升（种子/示例）', impact: 'medium', updatedAt: T3, subKind: 'storm' },
  { id: 'cli-alps-glacier', name: '阿尔卑斯 · 冰川加速消融', layerId: 'climate', lng: 8.0, lat: 46.5, note: '百年观测站记录融化速率创新高（种子/示例）', impact: 'medium', updatedAt: T2, subKind: 'ice' },
  { id: 'cli-ganges-flood', name: '恒河平原 · 季风洪涝', layerId: 'climate', lng: 85.0, lat: 25.5, note: '强降雨致孟加拉国与比哈尔邦受灾（种子/示例）', impact: 'critical', updatedAt: T, subKind: 'flood' },
  { id: 'cli-peru-el-nino', name: '秘鲁海岸 · 厄尔尼诺渔业冲击', layerId: 'climate', lng: -77.0, lat: -12.0, note: '海水升温影响鳀鱼渔获（种子/示例）', impact: 'high', updatedAt: T3, subKind: 'ocean' },
  { id: 'cli-canada-wildfire', name: '加拿大西部 · 野火季', layerId: 'climate', lng: -120.0, lat: 54.0, note: '干旱与高温推高林火风险（种子/示例）', impact: 'high', updatedAt: T2, subKind: 'wildfire' },
  ...DENSIFY_CLIMATE,
];

export const GLOBAL_THEMATIC_POINTS: ThematicPoint[] = [
  ...GLOBAL_ECON_HUBS,
  ...GLOBAL_MINERALS,
  ...GLOBAL_DATACENTERS,
  ...GLOBAL_PROTESTS,
  ...GLOBAL_CLIMATE,
  ...DENSIFY_INFRA,
  ...DENSIFY_INFRA_R2,
];
