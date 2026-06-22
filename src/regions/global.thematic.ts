/**
 * 全球主题图层公开态势整理 — 经济中心 / 矿产 / 管线 / AI 数据中心 / 抗议 / 气候异常
 *
 * ⚠ 公开资料汇总与示意坐标，非实时情报。整理日：2026-06-22
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
import { DENSIFY_WORLD_HERITAGE_R3 } from './global.layers-densify-r3';
import { DENSIFY_MINERALS_R3, DENSIFY_DATACENTERS_R3 } from './global.layers-densify-r3';
import { DENSIFY_ECON_HUBS_R3, DENSIFY_DATACENTERS_R3B } from './global.layers-densify-r3';
import {
  DENSIFY_SPACE_COMPANIES_R4,
  DENSIFY_FORESTS_R4,
  DENSIFY_RARE_EARTH_R4,
  DENSIFY_TECH_COMPANIES_R4,
  DENSIFY_INTL_ORGS_R4,
  DENSIFY_POWER_PLANTS_R4,
} from './global.layers-densify-r4';
import { DENSIFY_INFRA } from './global.densify-infra';
import { DENSIFY_INFRA_R2 } from './global.densify-infra-r2';
import { GLOBAL_WORLD_HERITAGE, GLOBAL_CHINA_HERITAGE } from './global.heritage';

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

const T = '2026-06-22T10:00:00Z';
const T2 = '2026-06-21T08:00:00Z';
const T3 = '2026-06-20T16:00:00Z';

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
  ...DENSIFY_ECON_HUBS_R3,
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
  ...DENSIFY_MINERALS_R3,
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
    note: '西伯利亚气田至中国东北干线（示意走向）',
    impact: 'critical',
  },
  {
    id: 'pipe-east-med',
    name: '东地中海天然气管道',
    coordinates: [[34.8, 31.5], [33.0, 33.5], [30.0, 35.0], [28.0, 36.5], [26.0, 38.0]],
    note: '以色列—塞浦路斯—希腊走廊',
    impact: 'high',
  },
  {
    id: 'pipe-southern-gas',
    name: '南部天然气走廊（TANAP/TAP）',
    coordinates: [[44.0, 41.0], [38.0, 40.5], [32.0, 40.0], [26.0, 40.5], [20.0, 41.0], [12.0, 42.0]],
    note: '阿塞拜疆经土耳其至意大利',
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
    note: '南美内陆气田至圣保罗工业区',
    impact: 'medium',
  },
  {
    id: 'pipe-nigeria-lng',
    name: '尼日利亚 LNG 出口管线',
    coordinates: [[7.0, 4.5], [6.5, 5.0], [5.5, 5.5], [4.0, 5.0], [3.5, 4.5]],
    note: '尼日尔三角洲至 Bonny 岛液化终端',
    impact: 'medium',
  },
  {
    id: 'pipe-nordstream2',
    name: '北溪二号（Nord Stream 2）海底气管',
    coordinates: [[28.0, 60.0], [22.0, 59.0], [18.0, 56.5], [15.0, 55.2], [12.5, 54.6]],
    note: '俄罗斯经波罗的海海底至德国，2022 年遭爆炸破坏后未投运',
    impact: 'critical',
  },
  {
    id: 'pipe-turkstream',
    name: '土耳其溪（TurkStream）海底气管',
    coordinates: [[37.8, 44.8], [35.0, 43.5], [32.0, 42.5], [28.5, 41.5]],
    note: '俄罗斯经黑海海底至土耳其与南欧',
    impact: 'high',
  },
  {
    id: 'pipe-baltic-pipe',
    name: '波罗的海管道（Baltic Pipe）',
    coordinates: [[6.5, 56.5], [10.0, 55.6], [14.0, 55.3], [16.0, 54.6]],
    note: '挪威经丹麦至波兰海底气管，2022 年通气',
    impact: 'high',
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
  ...DENSIFY_DATACENTERS_R3,
  ...DENSIFY_DATACENTERS_R3B,
];

/** 近期抗议与社会动员 */
export const GLOBAL_PROTESTS: ThematicPoint[] = [
  { id: 'pro-fr-pension', name: '巴黎 · 养老金改革抗议', layerId: 'protests', lng: 2.35, lat: 48.86, note: '全国性罢工与示威持续', impact: 'high', updatedAt: T },
  { id: 'pro-ge-tbilisi', name: '第比利斯 · 外国代理人法抗议', layerId: 'protests', lng: 44.8, lat: 41.72, note: '亲欧示威与议会对峙', impact: 'high', updatedAt: T2 },
  { id: 'pro-bd-dhaka', name: '达卡 · 配额制抗议', layerId: 'protests', lng: 90.41, lat: 23.81, note: '青年就业诉求引发大规模集会', impact: 'critical', updatedAt: T3 },
  { id: 'pro-ke-nairobi', name: '内罗毕 · 财政紧缩抗议', layerId: 'protests', lng: 36.82, lat: -1.29, note: '税收与物价上涨引发街头示威', impact: 'medium', updatedAt: T2 },
  { id: 'pro-ar-buenos', name: '布宜诺斯艾利斯 · 经济紧缩抗议', layerId: 'protests', lng: -58.38, lat: -34.6, note: '通胀与减支政策引发工会动员', impact: 'medium', updatedAt: T },
  { id: 'pro-us-campus', name: '美国多校 · 校园示威', layerId: 'protests', lng: -74.0, lat: 40.73, note: '中东政策相关校园集会', impact: 'medium', updatedAt: T3 },
  { id: 'pro-iran-women', name: '德黑兰 · 社会诉求集会', layerId: 'protests', lng: 51.42, lat: 35.69, note: '公民权利相关零星示威', impact: 'high', updatedAt: T2 },
  { id: 'pro-seoul-labor', name: '首尔 · 劳工权益集会', layerId: 'protests', lng: 126.98, lat: 37.57, note: '制造业工会要求加薪与工时改革', impact: 'medium', updatedAt: T },
  { id: 'pro-jakarta-election', name: '雅加达 · 选举后示威', layerId: 'protests', lng: 106.85, lat: -6.21, note: '地方选举争议引发街头集会', impact: 'medium', updatedAt: T3 },
  { id: 'pro-london-climate', name: '伦敦 · 气候行动游行', layerId: 'protests', lng: -0.12, lat: 51.51, note: '环保组织要求加速能源转型', impact: 'low', updatedAt: T2 },
  { id: 'pro-santiago-pension', name: '圣地亚哥 · 养老金改革抗议', layerId: 'protests', lng: -70.67, lat: -33.45, note: '社保私有化争议持续', impact: 'medium', updatedAt: T },
  { id: 'pro-cairo-economic', name: '开罗 · 物价上涨抗议', layerId: 'protests', lng: 31.24, lat: 30.04, note: '通胀与补贴削减引发社会压力', impact: 'high', updatedAt: T3 },
  { id: 'pro-berlin-housing', name: '柏林 · 住房租金抗议', layerId: 'protests', lng: 13.4, lat: 52.52, note: '租金上限与保障房诉求', impact: 'low', updatedAt: T2 },
  { id: 'pro-manila-corruption', name: '马尼拉 · 反腐示威', layerId: 'protests', lng: 120.98, lat: 14.6, note: '公共采购腐败调查引发集会', impact: 'medium', updatedAt: T },
  // ── 2026 当下热点（时效增密）──
  { id: 'pro-bangladesh-jul', name: '达卡 · 反政府大示威', layerId: 'protests', lng: 90.41, lat: 23.81, note: '临时政府过渡期持续抗议，要求改革', impact: 'critical', updatedAt: T },
  { id: 'pro-georgia-2026', name: '第比利斯 · 亲欧大游行', layerId: 'protests', lng: 44.8, lat: 41.72, note: '入欧进程受阻，数十万人上街', impact: 'critical', updatedAt: T2 },
  { id: 'pro-venezuela-2026', name: '加拉加斯 · 大选后续抗议', layerId: 'protests', lng: -66.9, lat: 10.49, note: '反对派质疑选举结果，镇压与流亡', impact: 'high', updatedAt: T3 },
  { id: 'pro-kenya-gen-z', name: '内罗毕 · Z 世代占领国会', layerId: 'protests', lng: 36.82, lat: -1.29, note: '增税法案引发青年占领议会运动', impact: 'high', updatedAt: T2 },
  { id: 'pro-france-2026', name: '巴黎 · 退休制度再抗议', layerId: 'protests', lng: 2.35, lat: 48.86, note: '工会联合反对延迟退休后续改革', impact: 'high', updatedAt: T3 },
  { id: 'pro-argentina-milei', name: '布宜诺斯艾利斯 · 紧缩冲击', layerId: 'protests', lng: -58.38, lat: -34.6, note: '米莱休克疗法引发工会与中产反弹', impact: 'high', updatedAt: T },
  { id: 'pro-uk-strikes', name: '伦敦 · 公共部门罢工潮', layerId: 'protests', lng: -0.13, lat: 51.51, note: '医护/教师/铁路联合罢工', impact: 'medium', updatedAt: T2 },
  { id: 'pro-us-immigration', name: '洛杉矶 · 移民政策抗议', layerId: 'protests', lng: -118.24, lat: 34.05, note: 'ICE 执法与边境政策引发对峙', impact: 'high', updatedAt: T3 },
  { id: 'pro-ecuador-security', name: '基多 · 治安危机抗议', layerId: 'protests', lng: -78.47, lat: -0.18, note: '黑帮暴力升级，民众要求安全', impact: 'high', updatedAt: T },
  { id: 'pro-haiti-2026', name: '太子港 · 帮派暴力与示威', layerId: 'protests', lng: -72.34, lat: 18.59, note: '武装帮派控制大部分城区', impact: 'critical', updatedAt: T2 },
  { id: 'pro-india-farmer', name: '新德里 · 农民大军围城', layerId: 'protests', lng: 77.21, lat: 28.61, note: '最低支持价格诉求再起', impact: 'high', updatedAt: T3 },
  { id: 'pro-china-housing', name: '多地 · 保交楼维权', layerId: 'protests', lng: 113.26, lat: 23.13, note: '烂尾楼业主集体停贷施压', impact: 'medium', updatedAt: T2 },
  { id: 'pro-japan-cult', name: '东京 · 统一教会受害者集会', layerId: 'protests', lng: 139.69, lat: 35.69, note: '宗教法人法修正引发受害者维权', impact: 'low', updatedAt: T3 },
  { id: 'pro-senegal-2026', name: '达喀尔 · 青年失业抗议', layerId: 'protests', lng: -17.45, lat: 14.69, note: '大选后经济承诺未兑现', impact: 'medium', updatedAt: T2 },
  { id: 'pro-mozambique-2026', name: '马普托 · 大选争议抗议', layerId: 'protests', lng: 32.57, lat: -25.97, note: '执政党胜选受质疑，南部动荡', impact: 'high', updatedAt: T },
  { id: 'pro-serbia-2026', name: '贝尔格莱德 · 反锂矿环保抗议', layerId: 'protests', lng: 20.46, lat: 44.79, note: 'Jadar 锂矿项目重启引发环保封锁', impact: 'high', updatedAt: T3 },
  { id: 'pro-nigeria-cost', name: '拉各斯 · 生活成本抗议', layerId: 'protests', lng: 3.38, lat: 6.52, note: '取消燃油补贴后通胀飙升', impact: 'high', updatedAt: T },
  // ── 2026 当下热点 · 第二批（时效增密）──
  { id: 'pro-ukraine-draft', name: '基辅 · 征兵与战后诉求集会', layerId: 'protests', lng: 30.52, lat: 50.45, note: '前线动员与退伍安置引发社会讨论', impact: 'medium', updatedAt: T2 },
  { id: 'pro-korea-medical', name: '首尔 · 医学院扩招罢诊', layerId: 'protests', lng: 126.98, lat: 37.57, note: '实习医生大规模辞职，医疗系统承压', impact: 'high', updatedAt: T },
  { id: 'pro-germany-far-right', name: '德国多地 · 反极右集会', layerId: 'protests', lng: 13.38, lat: 52.52, note: 'AfD 崛起引发数百万人大游行', impact: 'high', updatedAt: T3 },
  { id: 'pro-us-student-gaza', name: '美国多校 · 加沙声援复燃', layerId: 'protests', lng: -73.96, lat: 40.81, note: '哥大等校园帐篷营地再现，校方清场', impact: 'high', updatedAt: T2 },
  { id: 'pro-lebanon-gov', name: '贝鲁特 · 经济崩溃周年抗议', layerId: 'protests', lng: 35.5, lat: 33.89, note: '货币贬值九成，银行挤兑记忆', impact: 'high', updatedAt: T3 },
  { id: 'pro-sri-lanka-tax', name: '科伦坡 · 增税与紧缩抗议', layerId: 'protests', lng: 79.87, lat: 6.93, note: 'IMF 救助附加条件引发中产反弹', impact: 'medium', updatedAt: T },
  { id: 'pro-cuba-blackout', name: '哈瓦那 · 全岛大停电抗议', layerId: 'protests', lng: -82.38, lat: 23.13, note: '电网崩溃后罕见上街，经济困境叠加', impact: 'high', updatedAt: T2 },
  { id: 'pro-france-farmer', name: '巴黎 · 农民封锁大道', layerId: 'protests', lng: 2.35, lat: 48.86, note: '拖拉机封锁抗议环保法规与廉价进口', impact: 'high', updatedAt: T3 },
  { id: 'pro-india-manipur', name: '英帕尔 · 民族冲突持续', layerId: 'protests', lng: 93.94, lat: 24.82, note: '梅泰族与库基族冲突，族群隔离', impact: 'critical', updatedAt: T },
  { id: 'pro-turkey-inflation', name: '伊斯坦布尔 · 生活成本抗议', layerId: 'protests', lng: 29.01, lat: 41.08, note: '通胀长期高企，青年与退休群体承压', impact: 'high', updatedAt: T2 },
  { id: 'pro-mexico-judicial', name: '墨西哥城 · 司法改革抗议', layerId: 'protests', lng: -99.13, lat: 19.43, note: '法官普选法案引发法官与律师罢工', impact: 'medium', updatedAt: T3 },
  { id: 'pro-south-africa', name: '比勒陀利亚 · 大选后抗议', layerId: 'protests', lng: 28.19, lat: -25.75, note: '非国大失多数后联合政府摩擦', impact: 'medium', updatedAt: T },
  ...DENSIFY_PROTESTS,
];

/** 气候异常监测点 */
export const GLOBAL_CLIMATE: ThematicPoint[] = [
  { id: 'cli-india-heat', name: '印度次大陆 · 极端热浪', layerId: 'climate', lng: 78.96, lat: 20.59, note: '2026 初夏多地突破 45°C，农业与供电承压', impact: 'critical', updatedAt: T, subKind: 'heatwave' },
  { id: 'cli-mexico-drought', name: '墨西哥城 · 严重干旱', layerId: 'climate', lng: -99.13, lat: 19.43, note: '水库蓄水量创新低，限水措施', impact: 'high', updatedAt: T2, subKind: 'drought' },
  { id: 'cli-brazil-flood', name: '巴西南里奥格兰德 · 洪涝', layerId: 'climate', lng: -51.23, lat: -30.03, note: '持续强降雨致大规模洪灾', impact: 'critical', updatedAt: T, subKind: 'flood' },
  { id: 'cli-eu-warm', name: '西欧 · 暖冬后异常高温', layerId: 'climate', lng: 2.35, lat: 48.86, note: '厄尔尼诺余温叠加区域热岛', impact: 'medium', updatedAt: T3, subKind: 'heatwave' },
  { id: 'cli-china-rain', name: '华南 · 极端强降雨', layerId: 'climate', lng: 113.26, lat: 23.13, note: '梅雨锋面持续，城市内涝风险', impact: 'high', updatedAt: T2, subKind: 'flood' },
  { id: 'cli-arctic-ice', name: '北极海冰 · 历史低位', layerId: 'climate', lng: 0.0, lat: 82.0, note: '北极夏季海冰范围低于常年均值', impact: 'high', updatedAt: T, subKind: 'ice' },
  { id: 'cli-australia-coral', name: '大堡礁 · 珊瑚白化预警', layerId: 'climate', lng: 147.0, lat: -18.0, note: '海水温度过高触发 bleaching alert', impact: 'medium', updatedAt: T3, subKind: 'ocean' },
  { id: 'cli-sa-drought', name: '南非开普敦 · 干旱预警', layerId: 'climate', lng: 18.42, lat: -33.92, note: '水库蓄水量低于常年，限水措施', impact: 'high', updatedAt: T2, subKind: 'drought' },
  { id: 'cli-sea-haze', name: '东南亚 · 跨境烟霾', layerId: 'climate', lng: 104.0, lat: 0.5, note: '印尼烧芭引发新马空气质量恶化', impact: 'high', updatedAt: T, subKind: 'haze' },
  { id: 'cli-us-tornado', name: '美国中部 · 龙卷风高发季', layerId: 'climate', lng: -97.0, lat: 35.5, note: '强对流天气频发，保险损失上升', impact: 'medium', updatedAt: T3, subKind: 'storm' },
  { id: 'cli-alps-glacier', name: '阿尔卑斯 · 冰川加速消融', layerId: 'climate', lng: 8.0, lat: 46.5, note: '百年观测站记录融化速率创新高', impact: 'medium', updatedAt: T2, subKind: 'ice' },
  { id: 'cli-ganges-flood', name: '恒河平原 · 季风洪涝', layerId: 'climate', lng: 85.0, lat: 25.5, note: '强降雨致孟加拉国与比哈尔邦受灾', impact: 'critical', updatedAt: T, subKind: 'flood' },
  { id: 'cli-peru-el-nino', name: '秘鲁海岸 · 厄尔尼诺渔业冲击', layerId: 'climate', lng: -77.0, lat: -12.0, note: '海水升温影响鳀鱼渔获', impact: 'high', updatedAt: T3, subKind: 'ocean' },
  { id: 'cli-canada-wildfire', name: '加拿大西部 · 野火季', layerId: 'climate', lng: -120.0, lat: 54.0, note: '干旱与高温推高林火风险', impact: 'high', updatedAt: T2, subKind: 'wildfire' },
  // ── 2026 当下极端天气（时效增密）──
  { id: 'cli-me-heat', name: '中东 · 极端热浪', layerId: 'climate', lng: 47.0, lat: 29.0, note: '海湾多国体感温度逼近 55°C', impact: 'critical', updatedAt: T, subKind: 'heatwave' },
  { id: 'cli-pakistan-flood', name: '巴基斯坦 · 季风前洪涝', layerId: 'climate', lng: 68.0, lat: 28.0, note: '冰川融化加速叠加早季降雨', impact: 'critical', updatedAt: T2, subKind: 'flood' },
  { id: 'cli-us-southwest-heat', name: '美西南 · 热穹顶', layerId: 'climate', lng: -112.0, lat: 34.0, note: '亚利桑那/内华达连续 45°C+', impact: 'high', updatedAt: T, subKind: 'heatwave' },
  { id: 'cli-china-heat-2026', name: '华北 · 高温红色预警', layerId: 'climate', lng: 116.4, lat: 39.9, note: '京津冀多地突破 40°C', impact: 'high', updatedAt: T, subKind: 'heatwave' },
  { id: 'cli-siberia-permafrost', name: '西伯利亚 · 永冻土融化', layerId: 'climate', lng: 100.0, lat: 65.0, note: '气温异常加速甲烷释放', impact: 'high', updatedAt: T3, subKind: 'ice' },
  { id: 'cli-amazon-drought', name: '亚马逊 · 历史性干旱', layerId: 'climate', lng: -60.0, lat: -5.0, note: '支流干涸，原住民断水断粮', impact: 'critical', updatedAt: T2, subKind: 'drought' },
  { id: 'cli-eu-flood-2026', name: '中欧 · 暴雨洪涝', layerId: 'climate', lng: 17.0, lat: 50.0, note: '波兰/捷克/德国极端降水', impact: 'high', updatedAt: T, subKind: 'flood' },
  { id: 'cli-japan-heat', name: '日本 · 致命酷暑', layerId: 'climate', lng: 138.0, lat: 36.0, note: '中暑预警最高级别，东京多次', impact: 'high', updatedAt: T2, subKind: 'heatwave' },
  { id: 'cli-africa-sahel', name: '萨赫勒 · 粮食危机干旱', layerId: 'climate', lng: 5.0, lat: 14.0, note: '连续歉收引发人道紧急', impact: 'critical', updatedAt: T3, subKind: 'drought' },
  { id: 'cli-caribbean-hurricane', name: '加勒比 · 飓风季提前', layerId: 'climate', lng: -75.0, lat: 18.0, note: '海面温度异常催生早季强风暴', impact: 'high', updatedAt: T, subKind: 'storm' },
  { id: 'cli-philippines-typhoon', name: '菲律宾 · 超强台风', layerId: 'climate', lng: 122.0, lat: 14.0, note: '吕宋岛大规模疏散与断电', impact: 'critical', updatedAt: T2, subKind: 'storm' },
  { id: 'cli-greenland-melt', name: '格陵兰 · 冰盖融化峰季', layerId: 'climate', lng: -40.0, lat: 72.0, note: '表面融化范围创新高', impact: 'high', updatedAt: T3, subKind: 'ice' },
  { id: 'cli-argentina-wildfire', name: '阿根廷 · 湿地野火', layerId: 'climate', lng: -58.0, lat: -31.0, note: '巴拉那三角洲干旱引发火灾', impact: 'medium', updatedAt: T2, subKind: 'wildfire' },
  { id: 'cli-chile-drought', name: '智利 · 百年大旱', layerId: 'climate', lng: -71.0, lat: -33.0, note: '中部连续十余年降水不足', impact: 'high', updatedAt: T3, subKind: 'drought' },
  { id: 'cli-korea-flood', name: '韩国 · 集中暴雨', layerId: 'climate', lng: 127.5, lat: 36.5, note: '梅雨锋面滞留致内涝与山体滑坡', impact: 'medium', updatedAt: T, subKind: 'flood' },
  { id: 'cli-greenland2', name: '南极 · 海冰再创新低', layerId: 'climate', lng: 0.0, lat: -75.0, note: '冬季最大范围低于历史均值', impact: 'high', updatedAt: T3, subKind: 'ice' },
  // ── 2026 当下极端天气 · 第二批（时效增密）──
  { id: 'cli-sahara-dust', name: '撒哈拉沙尘 · 跨洋输送', layerId: 'climate', lng: -25.0, lat: 18.0, note: '撒哈拉尘羽越洋影响加勒比空气质量', impact: 'medium', updatedAt: T, subKind: 'haze' },
  { id: 'cli-indonesia-flood', name: '爪哇 · 季风洪涝', layerId: 'climate', lng: 110.0, lat: -7.0, note: '雅加达都市区内涝，万人撤离', impact: 'high', updatedAt: T2, subKind: 'flood' },
  { id: 'cli-us-northeast-flood', name: '美东北 · 暴雨内涝', layerId: 'climate', lng: -74.0, lat: 40.7, note: '慢移动风暴致纽约/新泽西骤雨', impact: 'high', updatedAt: T3, subKind: 'flood' },
  { id: 'cli-mediterranean-heat', name: '地中海 · 热浪与野火', layerId: 'climate', lng: 14.0, lat: 41.0, note: '希腊/意大利南高温干燥，林火提前', impact: 'high', updatedAt: T, subKind: 'heatwave' },
  { id: 'cli-greece-wildfire', name: '希腊 · 伯罗奔尼撒野火', layerId: 'climate', lng: 22.0, lat: 37.5, note: '强风助长火势，村庄疏散', impact: 'high', updatedAt: T2, subKind: 'wildfire' },
  { id: 'cli-australia-flood', name: '澳东 · 东海岸暴雨', layerId: 'climate', lng: 152.0, lat: -30.0, note: '新州/昆州极端降水，Lismore 再淹', impact: 'critical', updatedAt: T3, subKind: 'flood' },
  { id: 'cli-china-drought', name: '长江中下游 · 伏旱', layerId: 'climate', lng: 114.3, lat: 30.6, note: '梅雨偏少叠加高温，农业受影响', impact: 'high', updatedAt: T, subKind: 'drought' },
  { id: 'cli-east-africa-flood', name: '东非 · 异常暴雨洪涝', layerId: 'climate', lng: 39.0, lat: -3.0, note: '坦桑/肯尼亚洪灾，霍乱风险上升', impact: 'critical', updatedAt: T2, subKind: 'flood' },
  { id: 'cli-california-wildfire', name: '加州 · 山火季提前', layerId: 'climate', lng: -119.0, lat: 36.5, note: '植被干旱指数高，多起大型山火', impact: 'high', updatedAt: T3, subKind: 'wildfire' },
  { id: 'cli-himalaya-glacier', name: '喜马拉雅 · 冰湖溃决风险', layerId: 'climate', lng: 86.0, lat: 28.0, note: '升温加速冰川融化，GLOF 预警', impact: 'high', updatedAt: T, subKind: 'ice' },
  { id: 'cli-mexico-hurricane', name: '墨西哥太平洋 · 飓风登陆', layerId: 'climate', lng: -104.0, lat: 19.0, note: '5 级飓风逼近，海岸度假城疏散', impact: 'critical', updatedAt: T2, subKind: 'storm' },
  { id: 'cli-europe-heat-dome', name: '南欧 · 热穹顶持续', layerId: 'climate', lng: 12.5, lat: 42.0, note: '西班牙/意大利南部 45°C 持续', impact: 'critical', updatedAt: T3, subKind: 'heatwave' },
  ...DENSIFY_CLIMATE,
];

/**
 * 特大城市（megacities）— 人口 1000 万以上的都会区节点。
 * subKind 标都会区人口量级：'20m+'（2000万以上）/ '30m+'（3000万以上）/ '10m'（1000-2000万）。
 * 人口口径为都会区（metropolitan area）估值，整理日：2026-06-16。
 */
export const GLOBAL_MEGACITIES: ThematicPoint[] = [
  // ── 3000 万+ ──
  { id: 'mega-tokyo', name: '东京 · 首都圈', layerId: 'megacities', lng: 139.69, lat: 35.69, note: '全球最大都会区，约 3700 万人', impact: 'critical', subKind: '30m+' },
  { id: 'mega-delhi', name: '德里 · 国家首都区', layerId: 'megacities', lng: 77.21, lat: 28.61, note: '约 3300 万人，南亚增长最快都会区', impact: 'critical', subKind: '30m+' },
  { id: 'mega-shanghai', name: '上海都会区', layerId: 'megacities', lng: 121.47, lat: 31.23, note: '约 2900 万人，长江三角洲核心', impact: 'critical', subKind: '30m+' },
  { id: 'mega-saopaulo', name: '圣保罗都会区', layerId: 'megacities', lng: -46.63, lat: -23.55, note: '约 2250 万人，南美最大都市', impact: 'critical', subKind: '20m+' },
  { id: 'mega-mexicocity', name: '墨西哥城都会区', layerId: 'megacities', lng: -99.13, lat: 19.43, note: '约 2200 万人，海拔最高的特大城市', impact: 'critical', subKind: '20m+' },
  { id: 'mega-cairo', name: '大开罗区', layerId: 'megacities', lng: 31.24, lat: 30.04, note: '约 2200 万人，非洲与阿拉伯世界最大都市', impact: 'critical', subKind: '20m+' },
  { id: 'mega-mumbai', name: '孟买大都会区', layerId: 'megacities', lng: 72.88, lat: 19.08, note: '约 2100 万人，印度金融首都', impact: 'critical', subKind: '20m+' },
  { id: 'mega-beijing', name: '北京都会区', layerId: 'megacities', lng: 116.41, lat: 39.90, note: '约 2200 万人，中国政治与文化中心', impact: 'critical', subKind: '20m+' },
  { id: 'mega-dhaka', name: '达卡都会区', layerId: 'megacities', lng: 90.41, lat: 23.81, note: '约 2300 万人，人口密度最高的特大城市', impact: 'critical', subKind: '20m+' },
  // ── 2000 万 + ──
  { id: 'mega-osaka', name: '大阪 · 关西圈', layerId: 'megacities', lng: 135.50, lat: 34.69, note: '约 1900 万人，日本第二大都会区', impact: 'high', subKind: '20m+' },
  { id: 'mega-newyork', name: '纽约 · 三州都会区', layerId: 'megacities', lng: -74.01, lat: 40.71, note: '约 2000 万人，北美最大都市圈', impact: 'critical', subKind: '20m+' },
  { id: 'mega-karachi', name: '卡拉奇都会区', layerId: 'megacities', lng: 67.01, lat: 24.86, note: '约 1700 万人，巴基斯坦最大城市', impact: 'high', subKind: '20m+' },
  { id: 'mega-buenosaires', name: '布宜诺斯艾利斯大都会', layerId: 'megacities', lng: -58.38, lat: -34.60, note: '约 1500 万人，南美第二大都市', impact: 'high', subKind: '20m+' },
  { id: 'mega-chongqing', name: '重庆主城都会区', layerId: 'megacities', lng: 106.55, lat: 29.56, note: '约 1600 万人，长江上游最大城市', impact: 'high', subKind: '20m+' },
  { id: 'mega-istanbul', name: '伊斯坦布尔都会区', layerId: 'megacities', lng: 28.98, lat: 41.01, note: '约 1600 万人，地跨欧亚的千年古都', impact: 'high', subKind: '20m+' },
  { id: 'mega-kolkata', name: '加尔各答都会区', layerId: 'megacities', lng: 88.36, lat: 22.57, note: '约 1500 万人，印度东部最大城市', impact: 'high', subKind: '20m+' },
  { id: 'mega-manila', name: '马尼拉大都会', layerId: 'megacities', lng: 120.98, lat: 14.60, note: '约 1400 万人，菲律宾首都圈', impact: 'high', subKind: '20m+' },
  { id: 'mega-lagos', name: '拉各斯都会区', layerId: 'megacities', lng: 3.38, lat: 6.52, note: '约 1600 万人，非洲增长最快的特大城市', impact: 'high', subKind: '20m+' },
  { id: 'mega-rio', name: '里约热内卢都会区', layerId: 'megacities', lng: -43.20, lat: -22.91, note: '约 1300 万人，巴西第二大城市', impact: 'high', subKind: '20m+' },
  { id: 'mega-tianjin', name: '天津都会区', layerId: 'megacities', lng: 117.20, lat: 39.13, note: '约 1400 万人，华北港口工业重镇', impact: 'high', subKind: '20m+' },
  { id: 'mega-kinshasa', name: '金沙萨都会区', layerId: 'megacities', lng: 15.32, lat: -4.32, note: '约 1700 万人，非洲最大法语城市', impact: 'high', subKind: '20m+' },
  { id: 'mega-guangzhou', name: '广州都会区', layerId: 'megacities', lng: 113.26, lat: 23.13, note: '约 1400 万人，珠江三角洲核心', impact: 'high', subKind: '20m+' },
  { id: 'mega-losangeles', name: '洛杉矶都会区', layerId: 'megacities', lng: -118.24, lat: 34.05, note: '约 1300 万人，北美西岸最大都市', impact: 'high', subKind: '20m+' },
  { id: 'mega-moscow', name: '莫斯科都会区', layerId: 'megacities', lng: 37.62, lat: 55.75, note: '约 1300 万人，欧洲最大都市', impact: 'high', subKind: '20m+' },
  { id: 'mega-shenzhen', name: '深圳都会区', layerId: 'megacities', lng: 114.06, lat: 22.55, note: '约 1300 万人，中国科创与硬件制造中心', impact: 'high', subKind: '20m+' },
  { id: 'mega-lahore', name: '拉合尔都会区', layerId: 'megacities', lng: 74.36, lat: 31.55, note: '约 1400 万人，巴基斯坦第二大城市', impact: 'high', subKind: '20m+' },
  { id: 'mega-bangalore', name: '班加罗尔都会区', layerId: 'megacities', lng: 77.59, lat: 12.97, note: '约 1300 万人，印度「硅谷」', impact: 'high', subKind: '20m+' },
  { id: 'mega-paris', name: '巴黎大区（法兰西岛）', layerId: 'megacities', lng: 2.35, lat: 48.86, note: '约 1200 万人，西欧最大都会区', impact: 'high', subKind: '20m+' },
  { id: 'mega-bogota', name: '波哥大都会区', layerId: 'megacities', lng: -74.07, lat: 4.71, note: '约 1100 万人，安第斯山高海拔都市', impact: 'high', subKind: '20m+' },
  { id: 'mega-jakarta', name: '大雅加达（Jabodetabek）', layerId: 'megacities', lng: 106.85, lat: -6.21, note: '约 3400 万人都会区，因下沉拟迁都', impact: 'critical', subKind: '30m+' },
  { id: 'mega-chennai', name: '金奈都会区', layerId: 'megacities', lng: 80.27, lat: 13.08, note: '约 1100 万人，印度南部门户', impact: 'high', subKind: '20m+' },
  { id: 'mega-lima', name: '利马都会区', layerId: 'megacities', lng: -77.04, lat: -12.05, note: '约 1100 万人，秘鲁首都圈', impact: 'high', subKind: '20m+' },
  { id: 'mega-bangkok', name: '曼谷都会区', layerId: 'megacities', lng: 100.50, lat: 13.75, note: '约 1100 万人，东南亚中枢都市', impact: 'high', subKind: '20m+' },
  { id: 'mega-seoul', name: '首尔首都圈（Sudogwon）', layerId: 'megacities', lng: 126.98, lat: 37.57, note: '约 2600 万人，含仁川/京畿的超级都会', impact: 'critical', subKind: '20m+' },
  { id: 'mega-tehran', name: '德黑兰都会区', layerId: 'megacities', lng: 51.39, lat: 35.69, note: '约 1500 万人，西亚最大都市', impact: 'high', subKind: '20m+' },
  { id: 'mega-hochiminh', name: '胡志明市都会区', layerId: 'megacities', lng: 106.63, lat: 10.82, note: '约 1000 万人，越南经济中心', impact: 'high', subKind: '10m' },
  { id: 'mega-taipei', name: '台北都会区（北北基桃）', layerId: 'megacities', lng: 121.56, lat: 25.03, note: '约 1000 万人，台湾都会核心', impact: 'high', subKind: '10m' },
  { id: 'mega-chengdu', name: '成都都会区', layerId: 'megacities', lng: 104.07, lat: 30.67, note: '约 1600 万人，中国西部最大都市', impact: 'high', subKind: '20m+' },
  { id: 'mega-london', name: '大伦敦都会区', layerId: 'megacities', lng: -0.13, lat: 51.51, note: '约 1000 万人，欧洲金融中心', impact: 'high', subKind: '10m' },
  { id: 'mega-wuhan', name: '武汉都会区', layerId: 'megacities', lng: 114.31, lat: 30.59, note: '约 1300 万人，华中最大都市', impact: 'high', subKind: '20m+' },
  { id: 'mega-ahmedabad', name: '艾哈迈达巴德都会区', layerId: 'megacities', lng: 72.57, lat: 23.02, note: '约 800 万都会区，印度西部纺织工业重镇', impact: 'medium', subKind: '10m' },
  { id: 'mega-dongguan', name: '东莞都会区', layerId: 'megacities', lng: 113.75, lat: 23.05, note: '约 1000 万人，珠三角世界工厂枢纽', impact: 'high', subKind: '10m' },
  { id: 'mega-nanjing', name: '南京都会区', layerId: 'megacities', lng: 118.80, lat: 32.06, note: '约 900 万人，长三角北翼中心', impact: 'medium', subKind: '10m' },
  { id: 'mega-toronto', name: '大多伦多地区（GTA）', layerId: 'megacities', lng: -79.38, lat: 43.65, note: '约 650 万人，加拿大最大都市圈', impact: 'medium', subKind: '10m' },
  { id: 'mega-riyadh', name: '利雅得都会区', layerId: 'megacities', lng: 46.72, lat: 24.71, note: '约 800 万人，海湾最大都市之一', impact: 'medium', subKind: '10m' },
  { id: 'mega-johannesburg', name: '约翰内斯堡 · 豪登都会区', layerId: 'megacities', lng: 28.04, lat: -26.20, note: '约 600 万人，南部非洲经济中心', impact: 'medium', subKind: '10m' },
  { id: 'mega-hangzhou', name: '杭州都会区', layerId: 'megacities', lng: 120.16, lat: 30.27, note: '约 1200 万人，长三角数字经济中心', impact: 'high', subKind: '20m+' },
  { id: 'mega-xian', name: '西安都会区', layerId: 'megacities', lng: 108.94, lat: 34.34, note: '约 1300 万人，西北最大都市', impact: 'high', subKind: '20m+' },
  { id: 'mega-faisalabad', name: '费萨拉巴德都会区', layerId: 'megacities', lng: 73.07, lat: 31.42, note: '约 700 万人，巴基斯坦纺织工业重镇', impact: 'medium', subKind: '10m' },
  { id: 'mega-luanda', name: '罗安达都会区', layerId: 'megacities', lng: 13.23, lat: -8.84, note: '约 900 万人，安哥拉首都与石油经济中心', impact: 'medium', subKind: '10m' },
  { id: 'mega-dar-es-salaam', name: '达累斯萨拉姆都会区', layerId: 'megacities', lng: 39.28, lat: -6.82, note: '约 750 万人，东非最大都市', impact: 'medium', subKind: '10m' },
];

/**
 * 水坝水电（dams）— 全球主要水坝与水电站。
 * subKind 标类型：'hydro-mega'（巨型水电站 >10GW）/ 'hydro-large'（大型）/ 'irrigation'（灌溉调水）/ 'flood'（防洪多用途）。
 * 装机容量与坝高为公开资料估值。整理日：2026-06-22。
 */
export const GLOBAL_DAMS: ThematicPoint[] = [
  // ── 巨型水电站（>10GW） ──
  { id: 'dam-three-gorges', name: '三峡大坝', layerId: 'dams', lng: 111.0, lat: 30.82, note: '世界最大水电站，装机 22.5GW，长江防洪核心', impact: 'critical', subKind: 'hydro-mega' },
  { id: 'dam-itapu', name: '伊泰普水电站', layerId: 'dams', lng: -54.59, lat: -25.41, note: '巴西/巴拉圭，装机 14GW，世界第二大', impact: 'critical', subKind: 'hydro-mega' },
  { id: 'dam-baihetan', name: '白鹤滩水电站', layerId: 'dams', lng: 102.96, lat: 27.06, note: '中国金沙江，装机 16GW，世界第二大在建成', impact: 'critical', subKind: 'hydro-mega' },
  { id: 'dam-belomonte', name: '贝罗蒙特大坝', layerId: 'dams', lng: -51.6, lat: -3.17, note: '巴西欣古河，装机 11.2GW，争议巨型工程', impact: 'critical', subKind: 'hydro-mega' },
  { id: 'dam-wudongde', name: '乌东德水电站', layerId: 'dams', lng: 102.64, lat: 26.26, note: '中国金沙江，装机 10.2GW', impact: 'high', subKind: 'hydro-mega' },
  { id: 'dam-guri', name: '古里水电站', layerId: 'dams', lng: -62.89, lat: 7.76, note: '委内瑞拉卡罗尼河，装机 10.2GW', impact: 'high', subKind: 'hydro-mega' },
  { id: 'dam-tucurui', name: '图库鲁伊水电站', layerId: 'dams', lng: -49.64, lat: -3.75, note: '巴西托坎廷斯河，装机 8.4GW', impact: 'high', subKind: 'hydro-large' },
  { id: 'dam-grand-coulee', name: '大古力水坝', layerId: 'dams', lng: -119.05, lat: 47.96, note: '美国哥伦比亚河，装机 6.8GW，北美最大', impact: 'high', subKind: 'hydro-large' },
  { id: 'dam-xiangjiaba', name: '向家坝水电站', layerId: 'dams', lng: 104.39, lat: 28.65, note: '中国金沙江最末梯级，装机 7.75GW', impact: 'high', subKind: 'hydro-large' },
  { id: 'dam-xiluodu', name: '溪洛渡水电站', layerId: 'dams', lng: 103.65, lat: 28.27, note: '中国金沙江，装机 13.9GW', impact: 'critical', subKind: 'hydro-mega' },
  { id: 'dam-sayano', name: '萨扬-舒申斯克水电站', layerId: 'dams', lng: 91.38, lat: 52.83, note: '俄罗斯叶尼塞河，装机 6.4GW，俄国最大', impact: 'high', subKind: 'hydro-large' },
  { id: 'dam-krasnoyarsk', name: '克拉斯诺亚尔斯克水电站', layerId: 'dams', lng: 92.25, lat: 55.94, note: '俄罗斯叶尼塞河，装机 6GW', impact: 'high', subKind: 'hydro-large' },
  { id: 'dam-robert-bourassa', name: '罗伯特-布拉萨水电站', layerId: 'dams', lng: -77.43, lat: 53.78, note: '加拿大魁北克，装机 5.6GW，詹姆斯湾工程', impact: 'high', subKind: 'hydro-large' },
  { id: 'dam-churchill', name: '丘吉尔瀑布水电站', layerId: 'dams', lng: -64.07, lat: 53.56, note: '加拿大拉布拉多，装机 5.4GW', impact: 'high', subKind: 'hydro-large' },
  // ── 大型/知名水电站 ──
  { id: 'dam-longtan', name: '龙滩水电站', layerId: 'dams', lng: 106.99, lat: 25.04, note: '中国红水河，装机 6.3GW', impact: 'high', subKind: 'hydro-large' },
  { id: 'dam-nurek', name: '努列克大坝', layerId: 'dams', lng: 69.35, lat: 38.37, note: '塔吉克斯坦，世界最高坝（300m）', impact: 'high', subKind: 'hydro-large' },
  { id: 'dam-hoover', name: '胡佛大坝', layerId: 'dams', lng: -114.74, lat: 36.02, note: '美国科罗拉多河，2.1GW，胡佛水坝', impact: 'high', subKind: 'flood' },
  { id: 'dam-grand-ethiopia', name: '复兴大坝（GERD）', layerId: 'dams', lng: 35.31, lat: 11.65, note: '埃塞俄比亚青尼罗河，5.15GW，下游争议', impact: 'critical', subKind: 'hydro-large' },
  { id: 'dam-inga', name: '英加瀑布（规划）', layerId: 'dams', lng: 13.86, lat: -5.85, note: '刚果（金）刚果河，规划世界最大水电 40GW+', impact: 'high', subKind: 'hydro-mega' },
  { id: 'dam-cao-ling', name: '糯扎渡水电站', layerId: 'dams', lng: 100.42, lat: 23.05, note: '中国澜沧江，装机 5.85GW', impact: 'high', subKind: 'hydro-large' },
  { id: 'dam-xiaowan', name: '小湾水电站', layerId: 'dams', lng: 100.09, lat: 24.73, note: '中国澜沧江，装机 4.2GW，高拱坝', impact: 'high', subKind: 'hydro-large' },
  { id: 'dam-erytan', name: '二滩水电站', layerId: 'dams', lng: 101.79, lat: 26.99, note: '中国雅砻江，装机 3.3GW', impact: 'medium', subKind: 'hydro-large' },
  { id: 'dam-yongding', name: '官厅水库', layerId: 'dams', lng: 115.77, lat: 40.24, note: '中国永定河，防洪与北京供水', impact: 'medium', subKind: 'flood' },
  // ── 灌溉/调水坝 ──
  { id: 'dam-aswan', name: '阿斯旺高坝', layerId: 'dams', lng: 32.88, lat: 23.97, note: '埃及尼罗河，2.1GW，灌溉与防洪命脉', impact: 'critical', subKind: 'irrigation' },
  { id: 'dam-tarbela', name: '塔贝拉大坝', layerId: 'dams', lng: 72.7, lat: 34.09, note: '巴基斯坦印度河，3.5GW，世界最大土坝之一', impact: 'critical', subKind: 'irrigation' },
  { id: 'dam-mangla', name: '曼格拉大坝', layerId: 'dams', lng: 73.65, lat: 33.14, note: '巴基斯坦杰赫勒姆河，1GW，灌溉/防洪', impact: 'high', subKind: 'irrigation' },
  { id: 'dam-bhakra', name: '巴克拉大坝', layerId: 'dams', lng: 76.43, lat: 31.41, note: '印度萨特莱杰河，1.3GW，灌溉枢纽', impact: 'high', subKind: 'irrigation' },
  { id: 'dam-hirakud', name: '希拉库德大坝', layerId: 'dams', lng: 83.75, lat: 21.53, note: '印度默哈讷迪河，世界最长主坝之一', impact: 'medium', subKind: 'irrigation' },
  { id: 'dam-ataturk', name: '阿塔图尔克大坝', layerId: 'dams', lng: 38.48, lat: 37.68, note: '土耳其幼发拉底河，2.4GW，东南安纳托利亚工程', impact: 'high', subKind: 'irrigation' },
  // ── 防洪/多用途坝 ──
  { id: 'dam-three-gorges2', name: '丹江口水库', layerId: 'dams', lng: 111.51, lat: 32.55, note: '中国汉江，南水北调中线水源', impact: 'high', subKind: 'irrigation' },
  { id: 'dam-furnas', name: '富尔纳斯大坝', layerId: 'dams', lng: -46.32, lat: -20.66, note: '巴西格兰德河，1.2GW', impact: 'medium', subKind: 'hydro-large' },
  { id: 'dam-porto-primavera', name: '春港大坝', layerId: 'dams', lng: -52.0, lat: -22.5, note: '巴西巴拉那河，1.5GW', impact: 'medium', subKind: 'hydro-large' },
  { id: 'dam-yacyreta', name: '亚西雷塔水电站', layerId: 'dams', lng: -57.45, lat: -27.4, note: '阿根廷/巴拉圭巴拉那河，3.1GW', impact: 'high', subKind: 'hydro-large' },
  { id: 'dam-salto', name: '萨尔托格兰德水电站', layerId: 'dams', lng: -57.95, lat: -31.27, note: '乌拉圭/阿根廷乌拉圭河，1.9GW', impact: 'medium', subKind: 'hydro-large' },
  { id: 'dam-karun', name: '卡伦河水电梯级', layerId: 'dams', lng: 49.5, lat: 31.7, note: '伊朗卡伦河，多级开发（卡伦1/3/4）', impact: 'medium', subKind: 'hydro-large' },
  { id: 'dam-kaptai', name: '卡普泰水电站', layerId: 'dams', lng: 92.22, lat: 22.5, note: '孟加拉国唯一大型水电站', impact: 'low', subKind: 'hydro-large' },
  { id: 'dam-victoria', name: '维多利亚水电站', layerId: 'dams', lng: 80.77, lat: 7.21, note: '斯里兰卡马哈韦利河，210MW', impact: 'low', subKind: 'hydro-large' },
  { id: 'dam-kariba', name: '卡里巴大坝', layerId: 'dams', lng: 28.77, lat: -16.52, note: '赞比亚/津巴布韦赞比西河，1.6GW', impact: 'high', subKind: 'hydro-large' },
  { id: 'dam-cahora', name: '卡霍拉巴萨大坝', layerId: 'dams', lng: 32.71, lat: -15.97, note: '莫桑比克赞比西河，2.07GW', impact: 'high', subKind: 'hydro-large' },
  { id: 'dam-merowe', name: '麦罗维大坝', layerId: 'dams', lng: 32.62, lat: 19.41, note: '苏丹尼罗河，1.25GW', impact: 'medium', subKind: 'irrigation' },
  { id: 'dam-dragon', name: '德拉肯斯堡抽水蓄能', layerId: 'dams', lng: 29.16, lat: -28.5, note: '南非，1GW 抽水蓄能', impact: 'low', subKind: 'hydro-large' },
  { id: 'dam-bath', name: '巴斯县抽水蓄能', layerId: 'dams', lng: -79.78, lat: 38.21, note: '美国弗吉尼亚，3GW 抽水蓄能', impact: 'medium', subKind: 'hydro-large' },
  { id: 'dam-dinorwig', name: '迪诺威克抽水蓄能', layerId: 'dams', lng: -4.21, lat: 52.97, note: '英国威尔士，1.7GW 抽水蓄能', impact: 'low', subKind: 'hydro-large' },
  { id: 'dam-fengning', name: '丰宁抽水蓄能', layerId: 'dams', lng: 116.63, lat: 41.6, note: '中国河北，世界最大抽水蓄能 3.6GW', impact: 'high', subKind: 'hydro-large' },
];

/**
 * 主要港口（ports）— 全球主要海港与集装箱枢纽。
 * subKind 标吞吐量量级：'mega'（>30M TEU）/ 'large'（10-30M TEU）/ 'medium'（5-10M TEU）。
 * 整理日：2026-06-22。
 */
export const GLOBAL_PORTS: ThematicPoint[] = [
  // ── 超级大港（>30M TEU） ──
  { id: 'port-shanghai', name: '上海港', layerId: 'ports', lng: 121.49, lat: 31.23, note: '全球最大集装箱港，超 49M TEU', impact: 'critical', subKind: 'mega' },
  { id: 'port-singapore', name: '新加坡港', layerId: 'ports', lng: 103.84, lat: 1.26, note: '全球第二大港与最大转运港，超 39M TEU', impact: 'critical', subKind: 'mega' },
  { id: 'port-ningbo', name: '宁波舟山港', layerId: 'ports', lng: 122.11, lat: 30.0, note: '全球第三大港，超 35M TEU，货物吞吐第一', impact: 'critical', subKind: 'mega' },
  { id: 'port-shenzhen', name: '深圳港', layerId: 'ports', lng: 113.92, lat: 22.53, note: '盐田/蛇口/赤湾，超 30M TEU', impact: 'critical', subKind: 'mega' },
  { id: 'port-guangzhou', name: '广州港', layerId: 'ports', lng: 113.59, lat: 23.09, note: '南沙港区，约 25M TEU', impact: 'high', subKind: 'large' },
  { id: 'port-qingdao', name: '青岛港', layerId: 'ports', lng: 120.38, lat: 36.06, note: '北方最大集装箱港，约 26M TEU', impact: 'high', subKind: 'large' },
  { id: 'port-busan', name: '釜山港', layerId: 'ports', lng: 129.04, lat: 35.09, note: '韩国最大港，约 22M TEU，转运枢纽', impact: 'high', subKind: 'large' },
  { id: 'port-tianjin', name: '天津港', layerId: 'ports', lng: 117.78, lat: 38.98, note: '中国北方最大综合性港，约 21M TEU', impact: 'high', subKind: 'large' },
  // ── 大型港口（10-30M TEU） ──
  { id: 'port-hongkong', name: '香港港', layerId: 'ports', lng: 114.16, lat: 22.29, note: '葵青集装箱码头，约 17M TEU', impact: 'high', subKind: 'large' },
  { id: 'port-rotterdam', name: '鹿特丹港', layerId: 'ports', lng: 4.03, lat: 51.95, note: '欧洲最大港，约 14.5M TEU', impact: 'critical', subKind: 'large' },
  { id: 'port-antwerp', name: '安特卫普-布鲁日港', layerId: 'ports', lng: 4.31, lat: 51.31, note: '欧洲第二大港，约 13.5M TEU', impact: 'high', subKind: 'large' },
  { id: 'port-hamburg', name: '汉堡港', layerId: 'ports', lng: 9.95, lat: 53.54, note: '德国最大港，约 8.5M TEU', impact: 'high', subKind: 'large' },
  { id: 'port-los-angeles', name: '洛杉矶港', layerId: 'ports', lng: -118.27, lat: 33.74, note: '北美最大集装箱港，约 8.6M TEU', impact: 'high', subKind: 'large' },
  { id: 'port-long-beach', name: '长滩港', layerId: 'ports', lng: -118.19, lat: 33.75, note: '与洛杉矶构成美西最大港群', impact: 'high', subKind: 'large' },
  { id: 'port-newyork', name: '纽约-新泽西港', layerId: 'ports', lng: -74.04, lat: 40.68, note: '美东最大港，约 8M TEU', impact: 'high', subKind: 'large' },
  { id: 'port-savannah', name: '萨凡纳港', layerId: 'ports', lng: -81.09, lat: 32.08, note: '美国第四大集装箱港', impact: 'medium', subKind: 'large' },
  { id: 'port-dubai', name: '杰贝阿里港（迪拜）', layerId: 'ports', lng: 55.06, lat: 25.01, note: '中东最大港口，约 14M TEU', impact: 'critical', subKind: 'large' },
  { id: 'port-tanjung-pelepas', name: '丹戎帕拉帕斯港', layerId: 'ports', lng: 103.55, lat: 1.36, note: '马来西亚转运枢纽，约 9M TEU', impact: 'medium', subKind: 'large' },
  { id: 'port-port-klang', name: '巴生港', layerId: 'ports', lng: 101.39, lat: 3.0, note: '马来西亚最大港，约 13M TEU', impact: 'high', subKind: 'large' },
  { id: 'port-manila', name: '马尼拉港', layerId: 'ports', lng: 120.97, lat: 14.59, note: '菲律宾主要港口，约 5M TEU', impact: 'medium', subKind: 'medium' },
  { id: 'port-tokyo', name: '东京港', layerId: 'ports', lng: 139.83, lat: 35.65, note: '日本最大集装箱港，约 5M TEU', impact: 'high', subKind: 'medium' },
  { id: 'port-yokohama', name: '横滨港', layerId: 'ports', lng: 139.64, lat: 35.45, note: '日本主要国际贸易港', impact: 'medium', subKind: 'medium' },
  { id: 'port-kobe', name: '神户港', layerId: 'ports', lng: 135.19, lat: 34.68, note: '日本主要港口', impact: 'low', subKind: 'medium' },
  { id: 'port-kaohsiung', name: '高雄港', layerId: 'ports', lng: 120.31, lat: 22.62, note: '台湾最大港，约 9M TEU', impact: 'high', subKind: 'large' },
  { id: 'port-jakarta', name: '丹戎不碌港（雅加达）', layerId: 'ports', lng: 106.88, lat: -6.11, note: '印尼最大港，约 8M TEU', impact: 'high', subKind: 'large' },
  { id: 'port-tanjung-priok', name: '丹戎普瑞克（新普鲁伊）', layerId: 'ports', lng: 106.0, lat: -5.9, note: '印尼新超大港规划（备注）', impact: 'medium', subKind: 'large' },
  { id: 'port-chennai', name: '金奈港', layerId: 'ports', lng: 80.29, lat: 13.08, note: '印度东海岸最大港', impact: 'medium', subKind: 'medium' },
  { id: 'port-mumbai', name: '尼赫鲁港（孟买）', layerId: 'ports', lng: 72.95, lat: 18.95, note: '印度最大集装箱港，约 6M TEU', impact: 'high', subKind: 'medium' },
  { id: 'port-mundra', name: '蒙德拉港', layerId: 'ports', lng: 69.72, lat: 22.84, note: '印度最大私营港，超 7M TEU', impact: 'high', subKind: 'large' },
  { id: 'port-colombo', name: '科伦坡港', layerId: 'ports', lng: 79.84, lat: 6.95, note: '南亚转运枢纽，约 7M TEU', impact: 'high', subKind: 'large' },
  { id: 'port-saopaulo', name: '桑托斯港', layerId: 'ports', lng: -46.32, lat: -23.96, note: '拉美最大港，巴西咖啡/大豆出口', impact: 'high', subKind: 'large' },
  { id: 'port-colon', name: '科隆港（巴拿马）', layerId: 'ports', lng: -79.9, lat: 9.36, note: '巴拿马运河太平洋/大西洋两端枢纽', impact: 'critical', subKind: 'large' },
  { id: 'port-balboa', name: '巴尔博亚港（巴拿马）', layerId: 'ports', lng: -79.57, lat: 8.9, note: '运河太平洋侧枢纽', impact: 'high', subKind: 'large' },
  { id: 'port-manama', name: '哈利法港（阿布扎比）', layerId: 'ports', lng: 54.83, lat: 24.82, note: '阿联酋新枢纽，约 4M TEU', impact: 'medium', subKind: 'medium' },
  { id: 'port-jeddah', name: '吉达港', layerId: 'ports', lng: 39.17, lat: 21.48, note: '沙特红海主要港，约 4.5M TEU', impact: 'medium', subKind: 'medium' },
  { id: 'port-suez', name: '塞得港（苏伊士）', layerId: 'ports', lng: 32.29, lat: 31.26, note: '苏伊士运河地中海入口枢纽', impact: 'critical', subKind: 'large' },
  { id: 'port-piraeus', name: '比雷埃夫斯港', layerId: 'ports', lng: 23.63, lat: 37.94, note: '希腊，中远经营，约 5M TEU', impact: 'high', subKind: 'medium' },
  { id: 'port-valencia', name: '瓦伦西亚港', layerId: 'ports', lng: -0.28, lat: 39.44, note: '地中海最大集装箱港，约 5M TEU', impact: 'high', subKind: 'medium' },
  { id: 'port-algeciras', name: '阿尔赫西拉斯港', layerId: 'ports', lng: -5.45, lat: 36.13, note: '西班牙直布罗陀海峡枢纽', impact: 'medium', subKind: 'medium' },
  { id: 'port-felixstowe', name: '费利克斯托港', layerId: 'ports', lng: 1.32, lat: 51.96, note: '英国最大集装箱港', impact: 'medium', subKind: 'medium' },
  { id: 'port-melbourne', name: '墨尔本港', layerId: 'ports', lng: 144.89, lat: -37.83, note: '澳大利亚最大集装箱港', impact: 'medium', subKind: 'medium' },
  { id: 'port-durban', name: '德班港', layerId: 'ports', lng: 31.03, lat: -29.87, note: '非洲最繁忙港口之一', impact: 'high', subKind: 'medium' },
  { id: 'port-mombasa', name: '蒙巴萨港', layerId: 'ports', lng: 39.67, lat: -4.06, note: '东非最大港，肯尼亚门户', impact: 'medium', subKind: 'medium' },
  { id: 'port-tanger', name: '丹吉尔地中海港', layerId: 'ports', lng: -5.75, lat: 35.86, note: '摩洛哥，直布罗陀海峡新枢纽，约 9M TEU', impact: 'high', subKind: 'large' },
  { id: 'port-lagos', name: '廷坎岛/阿帕帕港（拉各斯）', layerId: 'ports', lng: 3.37, lat: 6.45, note: '西非最大港', impact: 'high', subKind: 'medium' },
  { id: 'port-vladivostok', name: '符拉迪沃斯托克港', layerId: 'ports', lng: 131.88, lat: 43.11, note: '俄罗斯远东主要港', impact: 'medium', subKind: 'medium' },
];

/**
 * 极地科考站（research_stations）— 南极与北极科考站。
 * subKind 标区域：'antarctic'（南极）/ 'arctic'（北极）。
 * 整理日：2026-06-22。
 */
export const GLOBAL_RESEARCH_STATIONS: ThematicPoint[] = [
  // ── 南极科考站 ──
  { id: 'rs-mcmurdo', name: '麦克默多站', layerId: 'research_stations', lng: 166.67, lat: -77.85, note: '美国，南极最大科考站，常年约 1000 人', impact: 'critical', subKind: 'antarctic' },
  { id: 'rs-amundsen-scott', name: '阿蒙森-斯科特站', layerId: 'research_stations', lng: 0.0, lat: -90.0, note: '美国，南极点站，天文与冰芯研究', impact: 'critical', subKind: 'antarctic' },
  { id: 'rs-great-wall', name: '长城站', layerId: 'research_stations', lng: -58.96, lat: -62.21, note: '中国首个南极科考站（1985），乔治王岛', impact: 'high', subKind: 'antarctic' },
  { id: 'rs-zhongshan', name: '中山站', layerId: 'research_stations', lng: 76.37, lat: -69.37, note: '中国南极第二大站（1989），拉斯曼丘陵', impact: 'high', subKind: 'antarctic' },
  { id: 'rs-kunlun', name: '昆仑站', layerId: 'research_stations', lng: 77.12, lat: -80.42, note: '中国南极内陆站（2009），冰穹A 最高点', impact: 'high', subKind: 'antarctic' },
  { id: 'rs-taishan', name: '泰山站', layerId: 'research_stations', lng: 76.97, lat: -73.51, note: '中国南极内陆度夏站（2014）', impact: 'medium', subKind: 'antarctic' },
  { id: 'rs-qinling', name: '秦岭站', layerId: 'research_stations', lng: 164.59, lat: -74.62, note: '中国第五个南极站（2024），罗斯海区域', impact: 'high', subKind: 'antarctic' },
  { id: 'rs-rothera', name: '罗瑟拉站', layerId: 'research_stations', lng: -68.13, lat: -67.57, note: '英国南极最大科考站', impact: 'high', subKind: 'antarctic' },
  { id: 'rs-halley', name: '哈雷站', layerId: 'research_stations', lng: -26.3, lat: -75.6, note: '英国，发现臭氧空洞的站点', impact: 'high', subKind: 'antarctic' },
  { id: 'rs-dumont', name: '迪蒙迪维尔站', layerId: 'research_stations', lng: 140.0, lat: -66.67, note: '法国/意大利联合站，康科迪亚', impact: 'high', subKind: 'antarctic' },
  { id: 'rs-concordia', name: '康科迪亚站', layerId: 'research_stations', lng: 123.33, lat: -75.1, note: '法国/意大利联合内陆站，穹顶C', impact: 'high', subKind: 'antarctic' },
  { id: 'rs-neumayer', name: '诺伊迈尔三号站', layerId: 'research_stations', lng: -8.25, lat: -70.67, note: '德国南极常年站', impact: 'medium', subKind: 'antarctic' },
  { id: 'rs-syowa', name: '昭和站', layerId: 'research_stations', lng: 39.58, lat: -69.0, note: '日本南极科考母站', impact: 'medium', subKind: 'antarctic' },
  { id: 'rs-davis', name: '戴维斯站', layerId: 'research_stations', lng: 77.97, lat: -68.58, note: '澳大利亚南极站', impact: 'medium', subKind: 'antarctic' },
  { id: 'rs-mawson', name: '莫森站', layerId: 'research_stations', lng: 62.87, lat: -67.6, note: '澳大利亚最古老南极站', impact: 'medium', subKind: 'antarctic' },
  { id: 'rs-casey', name: '凯西站', layerId: 'research_stations', lng: 110.53, lat: -66.28, note: '澳大利亚南极站', impact: 'medium', subKind: 'antarctic' },
  { id: 'rs-mirny', name: '米尔尼站', layerId: 'research_stations', lng: 93.02, lat: -66.55, note: '俄罗斯南极站', impact: 'medium', subKind: 'antarctic' },
  { id: 'rs-vostok', name: '东方站', layerId: 'research_stations', lng: 106.87, lat: -78.47, note: '俄罗斯，记录地球最低温 -89.2°C', impact: 'critical', subKind: 'antarctic' },
  { id: 'rs-progress', name: '进步站', layerId: 'research_stations', lng: 76.4, lat: -69.4, note: '俄罗斯南极站', impact: 'medium', subKind: 'antarctic' },
  { id: 'rs-bellingshausen', name: '别林斯高晋站', layerId: 'research_stations', lng: -58.96, lat: -62.2, note: '俄罗斯南极站（乔治王岛）', impact: 'medium', subKind: 'antarctic' },
  { id: 'rs-sejong', name: '世宗站', layerId: 'research_stations', lng: -58.78, lat: -62.22, note: '韩国南极站（乔治王岛）', impact: 'medium', subKind: 'antarctic' },
  { id: 'rs-jangbogo', name: '张保皋站', layerId: 'research_stations', lng: 164.69, lat: -74.62, note: '韩国第二南极站（ Terra Nova Bay）', impact: 'medium', subKind: 'antarctic' },
  { id: 'rs-maitri', name: '迈特里站', layerId: 'research_stations', lng: 11.73, lat: -70.77, note: '印度南极站', impact: 'medium', subKind: 'antarctic' },
  { id: 'rs-bharati', name: '巴拉蒂站', layerId: 'research_stations', lng: 76.19, lat: -69.4, note: '印度第二南极站', impact: 'medium', subKind: 'antarctic' },
  { id: 'rs-escudero', name: '尤金尼奥·埃斯库德罗站', layerId: 'research_stations', lng: -58.96, lat: -62.19, note: '智利南极站（乔治王岛）', impact: 'low', subKind: 'antarctic' },
  { id: 'rs-esperanza', name: '埃斯佩兰萨站', layerId: 'research_stations', lng: -56.99, lat: -63.4, note: '阿根廷南极常年站，有家属居住', impact: 'medium', subKind: 'antarctic' },
  { id: 'rs-marambio', name: '马兰比奥站', layerId: 'research_stations', lng: -56.73, lat: -64.23, note: '阿根廷南极航空枢纽', impact: 'medium', subKind: 'antarctic' },
  { id: 'rs-princess-elisabeth', name: '伊丽莎白公主站', layerId: 'research_stations', lng: 23.2, lat: -71.95, note: '比利时，南极首座零排放站', impact: 'medium', subKind: 'antarctic' },
  { id: 'rs-troll', name: '特罗尔站', layerId: 'research_stations', lng: 2.53, lat: -72.01, note: '挪威南极站', impact: 'medium', subKind: 'antarctic' },
  { id: 'rs-mario-zucchelli', name: '马里奥·祖凯利站', layerId: 'research_stations', lng: 164.12, lat: -74.7, note: '意大利南极站', impact: 'medium', subKind: 'antarctic' },
  { id: 'rs-arturo-prat', name: '阿图罗·普拉特站', layerId: 'research_stations', lng: -62.47, lat: -62.5, note: '智利南极站', impact: 'low', subKind: 'antarctic' },
  // ── 北极科考站 ──
  { id: 'rs-ny-alesund', name: '新奥尔松（Ny-Ålesund）', layerId: 'research_stations', lng: 11.93, lat: 78.92, note: '挪威斯瓦尔巴，国际北极科考村', impact: 'critical', subKind: 'arctic' },
  { id: 'rs-svalbard', name: '斯瓦尔巴大学中心（UNIS）', layerId: 'research_stations', lng: 15.65, lat: 78.22, note: '朗伊尔城，北极教育与研究中心', impact: 'high', subKind: 'arctic' },
  { id: 'rs-himadri', name: '希马德里站', layerId: 'research_stations', lng: 11.93, lat: 78.92, note: '印度北极研究站（新奥尔松）', impact: 'low', subKind: 'arctic' },
  { id: 'rs-barrow', name: '巴罗天文台（Utqiaġvik）', layerId: 'research_stations', lng: -156.61, lat: 71.32, note: '美国阿拉斯加北极观测站', impact: 'high', subKind: 'arctic' },
  { id: 'rs-alert', name: '阿勒特站', layerId: 'research_stations', lng: -62.34, lat: 82.52, note: '加拿大，世界最北永久定居点之一', impact: 'medium', subKind: 'arctic' },
  { id: 'rs-eureka', name: '尤里卡站', layerId: 'research_stations', lng: -85.93, lat: 79.99, note: '加拿大埃尔斯米尔岛气象站', impact: 'medium', subKind: 'arctic' },
  { id: 'rs-svalbard-radar', name: '斯瓦尔巴雷达站', layerId: 'research_stations', lng: 15.0, lat: 78.15, note: '欧洲非相干散射雷达（EISCAT）', impact: 'medium', subKind: 'arctic' },
  { id: 'rs-yellow-river', name: '黄河站', layerId: 'research_stations', lng: 11.92, lat: 78.92, note: '中国北极科考站（新奥尔松）', impact: 'high', subKind: 'arctic' },
  { id: 'rs-tiksi', name: '季克西站', layerId: 'research_stations', lng: 128.77, lat: 71.59, note: '俄罗斯北极观测站', impact: 'medium', subKind: 'arctic' },
  { id: 'rs-svetloe', name: '斯韦特洛耶站', layerId: 'research_stations', lng: 32.0, lat: 69.0, note: '俄罗斯西北极地站（备注）', impact: 'low', subKind: 'arctic' },
];

/**
 * 炼油厂（refineries）— 全球主要炼油厂与石化基地。
 * subKind 标规模/类型：'mega'（超大型 >500kbd）/ 'large'（大型）/ 'petrochem'（石化基地）。
 * 日加工能力为公开资料估值。整理日：2026-06-22。
 */
export const GLOBAL_REFINERIES: ThematicPoint[] = [
  // ── 超大型炼厂（>500kbd） ──
  { id: 'ref-jamnagar', name: '贾姆纳格尔炼厂', layerId: 'refineries', lng: 69.99, lat: 22.27, note: '印度信实，世界最大炼厂 1.24M bpd', impact: 'critical', subKind: 'mega' },
  { id: 'ref-paraguana', name: '帕拉瓜纳炼厂中心', layerId: 'refineries', lng: -70.2, lat: 11.73, note: '委内瑞拉，955kbpd，拉美最大', impact: 'high', subKind: 'mega' },
  { id: 'ref-ulyanovsk', name: 'SK炼厂（韩国蔚山）', layerId: 'refineries', lng: 129.35, lat: 35.5, note: 'SK Energy，840kbpd', impact: 'high', subKind: 'mega' },
  { id: 'ref-ruwais', name: '鲁韦斯炼厂', layerId: 'refineries', lng: 54.22, lat: 24.13, note: '阿联酋阿布扎比，837kbpd', impact: 'high', subKind: 'mega' },
  { id: 'ref-jubail', name: '朱拜勒炼厂群', layerId: 'refineries', lng: 49.99, lat: 27.0, note: '沙特 SATORP/YASREF，合计超 800kbpd', impact: 'high', subKind: 'mega' },
  { id: 'ref-galveston', name: '贝敦炼厂（得州）', layerId: 'refineries', lng: -94.98, lat: 29.78, note: '埃克森美孚，571kbpd', impact: 'high', subKind: 'mega' },
  { id: 'ref-port-arthur', name: '阿瑟港炼厂', layerId: 'refineries', lng: -93.93, lat: 29.89, note: '沙特阿美，630kbpd，美国最大之一', impact: 'high', subKind: 'mega' },
  { id: 'ref-baytown', name: '贝城炼厂', layerId: 'refineries', lng: -94.98, lat: 29.74, note: '埃克森美孚，560kbpd', impact: 'high', subKind: 'mega' },
  { id: 'ref-baton-rouge', name: '巴吞鲁日炼厂', layerId: 'refineries', lng: -91.19, lat: 30.46, note: '埃克森美孚，503kbpd', impact: 'high', subKind: 'mega' },
  // ── 大型炼厂 ──
  { id: 'ref-yokkaichi', name: '四日市炼厂', layerId: 'refineries', lng: 136.62, lat: 34.97, note: '日本出光，约 430kbpd', impact: 'medium', subKind: 'large' },
  { id: 'ref-chiba', name: '千叶炼厂', layerId: 'refineries', lng: 140.1, lat: 35.6, note: '日本 COSMO/出光，约 350kbpd', impact: 'medium', subKind: 'large' },
  { id: 'ref-dalian', name: '大连石化', layerId: 'refineries', lng: 121.62, lat: 38.93, note: '中石油，410kbpd', impact: 'high', subKind: 'large' },
  { id: 'ref-zhenhai', name: '镇海炼化', layerId: 'refineries', lng: 121.72, lat: 29.95, note: '中石化，浙江，超 500kbpd', impact: 'high', subKind: 'mega' },
  { id: 'ref-maoming', name: '茂名石化', layerId: 'refineries', lng: 110.93, lat: 21.66, note: '中石化，广东，超 400kbpd', impact: 'high', subKind: 'large' },
  { id: 'ref-shanghai-ref', name: '上海石化', layerId: 'refineries', lng: 121.33, lat: 30.72, note: '中石化，金山卫，约 320kbpd', impact: 'medium', subKind: 'large' },
  { id: 'ref-jinzhou', name: '金陵石化（南京）', layerId: 'refineries', lng: 118.78, lat: 32.07, note: '中石化，约 350kbpd', impact: 'medium', subKind: 'large' },
  { id: 'ref-tianjin-ref', name: '天津石化', layerId: 'refineries', lng: 117.43, lat: 39.13, note: '中石化/中沙合资', impact: 'medium', subKind: 'large' },
  { id: 'ref-jubail2', name: '拉斯坦努拉炼厂', layerId: 'refineries', lng: 50.17, lat: 26.65, note: '沙特阿美，550kbpd，波斯湾出口枢纽', impact: 'high', subKind: 'mega' },
  { id: 'ref-yanbu', name: '延布炼厂', layerId: 'refineries', lng: 38.04, lat: 24.09, note: '沙特阿美/中石化合资，红海侧', impact: 'high', subKind: 'large' },
  { id: 'ref-jubail3', name: 'SATORP 朱拜勒', layerId: 'refineries', lng: 49.99, lat: 27.01, note: '沙特阿美/道达尔，440kbpd', impact: 'high', subKind: 'large' },
  { id: 'ref-ess', name: '鹿特丹-佩尔尼斯炼厂', layerId: 'refineries', lng: 4.03, lat: 51.95, note: '壳牌，欧洲最大，400kbpd', impact: 'high', subKind: 'large' },
  { id: 'ref-leuna', name: '洛伊纳炼厂', layerId: 'refineries', lng: 12.02, lat: 51.32, note: '德国道达尔，约 220kbpd', impact: 'medium', subKind: 'large' },
  { id: 'ref-karlsruhe', name: '卡尔斯鲁厄炼厂', layerId: 'refineries', lng: 8.4, lat: 49.0, note: 'Miro，约 300kbpd', impact: 'medium', subKind: 'large' },
  { id: 'ref-fawley', name: '福莱炼厂', layerId: 'refineries', lng: -1.36, lat: 50.82, note: '埃克森美孚英国，约 270kbpd', impact: 'medium', subKind: 'large' },
  { id: 'ref-sannazzaro', name: '桑纳扎罗炼厂', layerId: 'refineries', lng: 8.65, lat: 45.11, note: '意大利埃尼集团，约 200kbpd', impact: 'medium', subKind: 'large' },
  { id: 'ref-lavera', name: '拉韦拉炼厂', layerId: 'refineries', lng: 4.84, lat: 43.36, note: '法国，地中海枢纽，约 220kbpd', impact: 'medium', subKind: 'large' },
  { id: 'ref-gonfreville', name: '贡夫勒维尔炼厂', layerId: 'refineries', lng: 0.2, lat: 49.66, note: '法国诺曼底，埃克森，约 240kbpd', impact: 'medium', subKind: 'large' },
  { id: 'ref-ploiesti', name: '普洛耶什蒂炼厂群', layerId: 'refineries', lng: 26.03, lat: 44.94, note: '罗马尼亚，东欧老牌炼油基地', impact: 'medium', subKind: 'large' },
  { id: 'ref-ushuaia', name: 'Bahía Blanca 炼厂', layerId: 'refineries', lng: -62.27, lat: -38.72, note: '阿根廷，约 100kbpd', impact: 'low', subKind: 'large' },
  { id: 'ref-cartagena-ref', name: '卡塔赫纳炼厂', layerId: 'refineries', lng: -75.55, lat: 10.42, note: '哥伦比亚埃克森，约 80kbpd', impact: 'low', subKind: 'large' },
  // ── 石化基地 ──
  { id: 'ref-antwerp', name: '安特卫普石化基地', layerId: 'refineries', lng: 4.31, lat: 51.31, note: '埃克森/巴斯夫，欧洲最大石化集群', impact: 'high', subKind: 'petrochem' },
  { id: 'ref-ludwigshafen', name: '路德维希港化工基地', layerId: 'refineries', lng: 8.45, lat: 49.48, note: '巴斯夫总部，全球最大一体化化工基地', impact: 'high', subKind: 'petrochem' },
  { id: 'ref-jubail4', name: '朱拜勒石化城', layerId: 'refineries', lng: 49.99, lat: 27.02, note: '沙特朱拜勒工业城，沙特基础工业', impact: 'critical', subKind: 'petrochem' },
  { id: 'ref-yanbu2', name: '延布工业城', layerId: 'refineries', lng: 38.04, lat: 24.09, note: '沙特红海侧石化/炼油基地', impact: 'high', subKind: 'petrochem' },
  { id: 'ref-jurong', name: '裕廊岛石化基地', layerId: 'refineries', lng: 103.72, lat: 1.27, note: '新加坡，全球第三大炼油中心', impact: 'critical', subKind: 'petrochem' },
  { id: 'ref-daya-bay', name: '大亚湾石化区', layerId: 'refineries', lng: 114.55, lat: 22.75, note: '中海油/壳牌，惠州，世界级石化基地', impact: 'high', subKind: 'petrochem' },
  { id: 'ref-cnooc-ningbo', name: '宁波/舟山石化区', layerId: 'refineries', lng: 121.95, lat: 29.85, note: '浙江石化，4000 万吨/年炼化一体', impact: 'high', subKind: 'petrochem' },
  { id: 'ref-hengli', name: '恒力大连长兴岛', layerId: 'refineries', lng: 121.3, lat: 39.3, note: '民营炼化龙头，2000 万吨/年', impact: 'high', subKind: 'petrochem' },
  { id: 'ref-jubail5', name: '杰贝阿里工业区', layerId: 'refineries', lng: 55.06, lat: 25.01, note: '迪拜石化/铝业集群', impact: 'medium', subKind: 'petrochem' },
  { id: 'ref-jamshedpur', name: '贾姆谢德布尔工业城', layerId: 'refineries', lng: 86.18, lat: 22.78, note: '塔塔钢铁/化工基地', impact: 'medium', subKind: 'petrochem' },
  { id: 'ref-camaçari', name: '卡马萨里石化基地', layerId: 'refineries', lng: -38.3, lat: -12.7, note: '巴西巴伊亚州石化集群', impact: 'medium', subKind: 'petrochem' },
  { id: 'ref-coatzacoalcos', name: '夸察夸尔科斯石化', layerId: 'refineries', lng: -94.47, lat: 18.14, note: '墨西哥 Pemex 石化核心', impact: 'medium', subKind: 'petrochem' },
  { id: 'ref-deer-park', name: '迪尔帕克炼厂', layerId: 'refineries', lng: -95.13, lat: 29.69, note: '得州休斯顿航道上，壳牌/沙特阿美', impact: 'medium', subKind: 'large' },
  { id: 'ref-sarnia', name: '萨尼亚炼厂群', layerId: 'refineries', lng: -82.4, lat: 42.97, note: '加拿大安大略，石化走廊', impact: 'medium', subKind: 'petrochem' },
];

/**
 * 国际机场（airports）— 全球主要国际机场与航空枢纽。
 * subKind 标量级：'mega'（>60M 旅客）/ 'large'（30-60M）/ 'cargo'（货运枢纽）。
 * 整理日：2026-06-22。
 */
export const GLOBAL_AIRPORTS: ThematicPoint[] = [
  // ── 超级枢纽（>60M 旅客） ──
  { id: 'ap-atlanta', name: '亚特兰大机场（ATL）', layerId: 'airports', lng: -84.43, lat: 33.64, note: '全球最繁忙机场，超 90M 旅客', impact: 'critical', subKind: 'mega' },
  { id: 'ap-beijing', name: '北京首都机场（PEK）', layerId: 'airports', lng: 116.58, lat: 40.08, note: '中国最大枢纽之一，超 100M（疫情前）', impact: 'critical', subKind: 'mega' },
  { id: 'ap-dubai', name: '迪拜机场（DXB）', layerId: 'airports', lng: 55.36, lat: 25.25, note: '全球国际旅客第一，阿联酋航空枢纽', impact: 'critical', subKind: 'mega' },
  { id: 'ap-los-angeles', name: '洛杉矶机场（LAX）', layerId: 'airports', lng: -118.41, lat: 33.94, note: '美西门户，约 75M 旅客', impact: 'high', subKind: 'mega' },
  { id: 'ap-tokyo-haneda', name: '东京羽田机场（HND）', layerId: 'airports', lng: 139.78, lat: 35.55, note: '日本最繁忙，约 87M', impact: 'high', subKind: 'mega' },
  { id: 'ap-chicago', name: '芝加哥奥黑尔（ORD）', layerId: 'airports', lng: -87.9, lat: 41.98, note: '美国中部枢纽，约 76M', impact: 'high', subKind: 'mega' },
  { id: 'ap-london', name: '伦敦希思罗（LHR）', layerId: 'airports', lng: -0.45, lat: 51.47, note: '欧洲最繁忙，约 80M', impact: 'critical', subKind: 'mega' },
  { id: 'ap-hongkong', name: '香港机场（HKG）', layerId: 'airports', lng: 113.91, lat: 22.31, note: '亚太转运枢纽，国泰基地', impact: 'critical', subKind: 'mega' },
  { id: 'ap-shanghai-pudong', name: '上海浦东机场（PVG）', layerId: 'airports', lng: 121.81, lat: 31.14, note: '中国最大国际门户', impact: 'high', subKind: 'mega' },
  { id: 'ap-paris-cdg', name: '巴黎戴高乐（CDG）', layerId: 'airports', lng: 2.55, lat: 49.0, note: '法国枢纽，约 76M', impact: 'high', subKind: 'mega' },
  { id: 'ap-amsterdam', name: '阿姆斯特丹史基浦（AMS）', layerId: 'airports', lng: 4.77, lat: 52.31, note: '欧洲第四大，约 61M', impact: 'high', subKind: 'mega' },
  { id: 'ap-delhi', name: '德里英迪拉·甘地（DEL）', layerId: 'airports', lng: 77.12, lat: 28.56, note: '印度最繁忙，约 73M', impact: 'high', subKind: 'mega' },
  { id: 'ap-guangzhou', name: '广州白云机场（CAN）', layerId: 'airports', lng: 113.3, lat: 23.39, note: '中国南方枢纽，超 70M', impact: 'high', subKind: 'mega' },
  { id: 'ap-frankfurt', name: '法兰克福机场（FRA）', layerId: 'airports', lng: 8.56, lat: 50.04, note: '德国枢纽，约 60M', impact: 'high', subKind: 'mega' },
  { id: 'ap-istanbul', name: '伊斯坦布尔机场（IST）', layerId: 'airports', lng: 28.81, lat: 41.26, note: '土耳其新枢纽，欧亚十字路口，约 64M', impact: 'high', subKind: 'mega' },
  { id: 'ap-seoul-incheon', name: '首尔仁川（ICN）', layerId: 'airports', lng: 126.45, lat: 37.46, note: '韩国国际枢纽，约 71M', impact: 'high', subKind: 'mega' },
  { id: 'ap-singapore', name: '新加坡樟宜（SIN）', layerId: 'airports', lng: 103.99, lat: 1.36, note: '东南亚主要枢纽，约 65M', impact: 'critical', subKind: 'mega' },
  // ── 大型枢纽（30-60M） ──
  { id: 'ap-newyork-jfk', name: '纽约 JFK', layerId: 'airports', lng: -73.78, lat: 40.64, note: '美东国际门户，约 62M', impact: 'high', subKind: 'large' },
  { id: 'ap-denver', name: '丹佛机场（DEN）', layerId: 'airports', lng: -104.67, lat: 39.86, note: '美国面积最大机场，约 69M', impact: 'high', subKind: 'mega' },
  { id: 'ap-tokyo-narita', name: '东京成田（NRT）', layerId: 'airports', lng: 140.39, lat: 35.77, note: '日本主要国际门户', impact: 'medium', subKind: 'large' },
  { id: 'ap-madrid', name: '马德里巴拉哈斯（MAD）', layerId: 'airports', lng: -3.57, lat: 40.47, note: '西班牙枢纽，伊比利亚基地', impact: 'medium', subKind: 'large' },
  { id: 'ap-mumbai', name: '孟买（BOM）', layerId: 'airports', lng: 72.87, lat: 19.09, note: '印度第二大，约 50M', impact: 'medium', subKind: 'large' },
  { id: 'ap-toronto', name: '多伦多皮尔逊（YYZ）', layerId: 'airports', lng: -79.61, lat: 43.68, note: '加拿大最繁忙，约 50M', impact: 'medium', subKind: 'large' },
  { id: 'ap-sao-paulo', name: '圣保罗 Guarulhos（GRU）', layerId: 'airports', lng: -46.48, lat: -23.43, note: '拉美最繁忙，约 42M', impact: 'medium', subKind: 'large' },
  { id: 'ap-mexico', name: '墨西哥城（MEX）', layerId: 'airports', lng: -99.07, lat: 19.44, note: '拉美第二大枢纽', impact: 'medium', subKind: 'large' },
  { id: 'ap-sydney', name: '悉尼 Kingsford Smith（SYD）', layerId: 'airports', lng: 151.18, lat: -33.95, note: '澳大利亚最繁忙国际门户', impact: 'medium', subKind: 'large' },
  { id: 'ap-bangkok', name: '曼谷素万那普（BKK）', layerId: 'airports', lng: 100.75, lat: 13.69, note: '东南亚主要枢纽', impact: 'medium', subKind: 'large' },
  { id: 'ap-jakarta', name: '雅加达苏加诺-哈达（CGK）', layerId: 'airports', lng: 106.66, lat: -6.13, note: '印尼主要门户', impact: 'medium', subKind: 'large' },
  { id: 'ap-kuala', name: '吉隆坡（KUL）', layerId: 'airports', lng: 101.71, lat: 2.75, note: '马来西亚枢纽，亚航基地', impact: 'medium', subKind: 'large' },
  { id: 'ap-hongqiao', name: '上海虹桥（SHA）', layerId: 'airports', lng: 121.34, lat: 31.2, note: '中国国内主要枢纽', impact: 'medium', subKind: 'large' },
  { id: 'ap-chengdu', name: '成都天府/双流（CTU/TFU）', layerId: 'airports', lng: 104.44, lat: 30.58, note: '中国西部最大枢纽', impact: 'medium', subKind: 'large' },
  { id: 'ap-shenzhen-air', name: '深圳宝安（SZX）', layerId: 'airports', lng: 113.81, lat: 22.64, note: '中国南方枢纽', impact: 'medium', subKind: 'large' },
  { id: 'ap-kunming', name: '昆明长水（KMG）', layerId: 'airports', lng: 102.93, lat: 25.1, note: '中国西南门户，通东南亚', impact: 'medium', subKind: 'large' },
  { id: 'ap-xian', name: '西安咸阳（XIY）', layerId: 'airports', lng: 108.75, lat: 34.45, note: '中国西北枢纽', impact: 'low', subKind: 'large' },
  { id: 'ap-munich', name: '慕尼黑（MUC）', layerId: 'airports', lng: 11.59, lat: 48.14, note: '德国第二枢纽，约 48M', impact: 'medium', subKind: 'large' },
  { id: 'ap-rome', name: '罗马菲乌米奇诺（FCO）', layerId: 'airports', lng: 12.25, lat: 41.8, note: '意大利最大机场', impact: 'medium', subKind: 'large' },
  { id: 'ap-barcelona', name: '巴塞罗那（BCN）', layerId: 'airports', lng: 2.08, lat: 41.3, note: '西班牙第二枢纽', impact: 'low', subKind: 'large' },
  { id: 'ap-moscow', name: '莫斯科谢列梅捷沃（SVO）', layerId: 'airports', lng: 37.41, lat: 55.97, note: '俄罗斯最大机场', impact: 'medium', subKind: 'large' },
  { id: 'ap-doha', name: '多哈哈马德（DOH）', layerId: 'airports', lng: 51.61, lat: 25.27, note: '卡塔尔航空枢纽', impact: 'high', subKind: 'large' },
  { id: 'ap-dallas', name: '达拉斯沃斯堡（DFW）', layerId: 'airports', lng: -97.04, lat: 32.9, note: '美国航空枢纽，约 73M', impact: 'high', subKind: 'mega' },
  // ── 货运枢纽 ──
  { id: 'ap-memphis', name: '孟菲斯机场（MEM）', layerId: 'airports', lng: -89.98, lat: 35.04, note: '联邦快递超级枢纽，全球最大货运机场之一', impact: 'critical', subKind: 'cargo' },
  { id: 'ap-anchorage', name: '安克雷奇（ANC）', layerId: 'airports', lng: -149.99, lat: 61.17, note: '亚美货运中转，全球五大货运机场之一', impact: 'high', subKind: 'cargo' },
  { id: 'ap-louisville', name: '路易维尔（SDF）', layerId: 'airports', lng: -85.74, lat: 38.18, note: 'UPS Worldport 主枢纽', impact: 'high', subKind: 'cargo' },
  { id: 'ap-leipzig', name: '莱比锡哈雷（LEJ）', layerId: 'airports', lng: 12.24, lat: 51.43, note: 'DHL 欧洲枢纽，欧洲第二大货运机场', impact: 'high', subKind: 'cargo' },
  { id: 'ap-shenzhen-cargo', name: '深圳宝安货运', layerId: 'airports', lng: 113.81, lat: 22.64, note: '中国主要货运机场之一（顺丰）', impact: 'medium', subKind: 'cargo' },
  { id: 'ap-hongkong-cargo', name: '香港货运', layerId: 'airports', lng: 113.91, lat: 22.31, note: '全球最繁忙货运机场之一（合并条目）', impact: 'high', subKind: 'cargo' },
  { id: 'ap-incheon-cargo', name: '仁川货运', layerId: 'airports', lng: 126.45, lat: 37.46, note: '韩国主要货运枢纽', impact: 'medium', subKind: 'cargo' },
  { id: 'ap-dubai-cargo', name: '迪拜 DWC/铝马克图姆', layerId: 'airports', lng: 55.16, lat: 24.9, note: '规划中全球最大货运机场', impact: 'medium', subKind: 'cargo' },
];

/**
 * 核电站（nuclear_reactors）— 全球在运民用核电站。
 * subKind 标规模：'mega'（>5GW）/ 'large'（2-5GW）/ 'small'（<2GW 或 SMR）。
 * 整理日：2026-06-22。
 */
export const GLOBAL_NUCLEAR_REACTORS: ThematicPoint[] = [
  // ── 超大型核电站（>5GW） ──
  { id: 'npp-kashiwazaki', name: '柏崎刈羽核电站', layerId: 'nuclear_reactors', lng: 138.6, lat: 37.42, note: '日本，世界最大装机 8.2GW（7 堆），长期停运', impact: 'critical', subKind: 'mega' },
  { id: 'npp-bruce', name: '布鲁斯核电站', layerId: 'nuclear_reactors', lng: -81.59, lat: 44.32, note: '加拿大安大略，8 堆 6.4GW，西半球最大', impact: 'critical', subKind: 'mega' },
  { id: 'npp-zaporizhzhia', name: '扎波罗热核电站', layerId: 'nuclear_reactors', lng: 34.58, lat: 47.51, note: '乌克兰，6 堆 5.7GW，欧洲最大（战时占领）', impact: 'critical', subKind: 'mega' },
  { id: 'npp-hanul', name: '韩蔚核电站', layerId: 'nuclear_reactors', lng: 129.41, lat: 37.09, note: '韩国，6 堆 5.9GW', impact: 'high', subKind: 'mega' },
  { id: 'npp-hanbit', name: '韩吉核电站', layerId: 'nuclear_reactors', lng: 126.41, lat: 35.4, note: '韩国，6 堆 5.9GW', impact: 'high', subKind: 'mega' },
  { id: 'npp-uljin', name: '蔚珍核电站（新韩蔚）', layerId: 'nuclear_reactors', lng: 129.4, lat: 37.1, note: '韩国新建 APR-1400 机组', impact: 'medium', subKind: 'mega' },
  { id: 'npp-palo-verde', name: '帕洛弗迪核电站', layerId: 'nuclear_reactors', lng: -112.86, lat: 33.39, note: '美国亚利桑那，3 堆 4GW，美国最大', impact: 'critical', subKind: 'large' },
  // ── 大型核电站（2-5GW） ──
  { id: 'npp-weiher', name: '沃尔夫克里克', layerId: 'nuclear_reactors', lng: -95.65, lat: 38.05, note: '美国堪萨斯，1.2GW（合并参考）', impact: 'low', subKind: 'small' },
  { id: 'npp-vogtle', name: '沃格特勒核电站', layerId: 'nuclear_reactors', lng: -81.76, lat: 33.14, note: '美国佐治亚，新建 AP1000 两台，4.5GW', impact: 'high', subKind: 'large' },
  { id: 'npp-summer', name: 'VC Summer（停建）', layerId: 'nuclear_reactors', lng: -81.34, lat: 34.29, note: '美国南卡，AP1000 项目 2017 年停建', impact: 'low', subKind: 'small' },
  { id: 'npp-browns-ferry', name: '布朗斯费里', layerId: 'nuclear_reactors', lng: -87.13, lat: 34.74, note: '美国阿拉巴马，3.3GW', impact: 'medium', subKind: 'large' },
  { id: 'npp-ochens', name: '奥伊斯特溪', layerId: 'nuclear_reactors', lng: -74.13, lat: 39.83, note: '美国新泽西，已退役', impact: 'low', subKind: 'small' },
  { id: 'npp-gravelines', name: '格拉夫林核电站', layerId: 'nuclear_reactors', lng: 2.14, lat: 51.0, note: '法国，6 堆 5.4GW，西欧最大', impact: 'high', subKind: 'mega' },
  { id: 'npp-paluel', name: '帕吕埃尔核电站', layerId: 'nuclear_reactors', lng: 0.6, lat: 49.86, note: '法国，4 堆 5.3GW', impact: 'high', subKind: 'large' },
  { id: 'npp-cattenom', name: '卡特农核电站', layerId: 'nuclear_reactors', lng: 6.28, lat: 49.42, note: '法国，4 堆 5.2GW，临近德/卢边界', impact: 'high', subKind: 'large' },
  { id: 'npp-tricastin', name: '特立卡斯唐核电站', layerId: 'nuclear_reactors', lng: 4.73, lat: 44.33, note: '法国，4 堆，欧洲铀浓缩厂同址', impact: 'high', subKind: 'large' },
  { id: 'npp-flamanville', name: '弗拉芒维尔核电站', layerId: 'nuclear_reactors', lng: -1.52, lat: 49.64, note: '法国，EPR 新机组在建', impact: 'medium', subKind: 'large' },
  { id: 'npp-civaux', name: '西沃核电站', layerId: 'nuclear_reactors', lng: 0.64, lat: 46.46, note: '法国，4 堆 4.9GW', impact: 'medium', subKind: 'large' },
  { id: 'npp-penly', name: '庞利核电站', layerId: 'nuclear_reactors', lng: 1.21, lat: 49.97, note: '法国诺曼底海岸，EPR2 规划', impact: 'medium', subKind: 'large' },
  { id: 'npp-gundremmingen', name: '贡德雷明根', layerId: 'nuclear_reactors', lng: 10.4, lat: 48.5, note: '德国，已退役（2021 退核）', impact: 'low', subKind: 'small' },
  { id: 'npp-isar', name: '伊萨尔核电站', layerId: 'nuclear_reactors', lng: 12.29, lat: 48.6, note: '德国巴伐利亚，2023 退役', impact: 'low', subKind: 'small' },
  { id: 'npp-emsland', name: '埃姆斯兰', layerId: 'nuclear_reactors', lng: 7.33, lat: 52.47, note: '德国，2023 最后退役', impact: 'low', subKind: 'small' },
  { id: 'npp-sizewell', name: '塞兹韦尔 B', layerId: 'nuclear_reactors', lng: 1.62, lat: 52.21, note: '英国，PWR 1.2GW，C 堆规划中', impact: 'medium', subKind: 'large' },
  { id: 'npp-hinkley', name: '欣克利角 C', layerId: 'nuclear_reactors', lng: -3.11, lat: 51.21, note: '英国，EPR 在建，3.2GW', impact: 'high', subKind: 'large' },
  { id: 'npp-paks', name: '保克什核电站', layerId: 'nuclear_reactors', lng: 18.85, lat: 46.57, note: '匈牙利，4 堆 VVER，2 新机组在建', impact: 'medium', subKind: 'large' },
  { id: 'npp-temelin', name: '特梅林核电站', layerId: 'nuclear_reactors', lng: 14.38, lat: 49.18, note: '捷克，2 堆 VVER，2 新机组规划', impact: 'medium', subKind: 'large' },
  { id: 'npp-dukovany', name: '杜科凡尼核电站', layerId: 'nuclear_reactors', lng: 16.14, lat: 49.08, note: '捷克，4 堆 VVER', impact: 'medium', subKind: 'large' },
  { id: 'npp-loomon', name: '洛文核电站', layerId: 'nuclear_reactors', lng: 25.41, lat: 46.78, note: '罗马尼亚，CANDU 重水堆 1.4GW', impact: 'low', subKind: 'small' },
  { id: 'npp-kujan', name: '库尔斯克核电站', layerId: 'nuclear_reactors', lng: 35.63, lat: 51.66, note: '俄罗斯，4 堆 RBMK，库尔斯克-II 在建', impact: 'high', subKind: 'large' },
  { id: 'npp-leningrad', name: '列宁格勒核电站', layerId: 'nuclear_reactors', lng: 29.1, lat: 59.86, note: '俄罗斯圣彼得堡，4GW（含新 VVER）', impact: 'high', subKind: 'large' },
  { id: 'npp-novovoronezh', name: '新沃罗涅日', layerId: 'nuclear_reactors', lng: 39.2, lat: 51.32, note: '俄罗斯，VVER 首堆原型与新机组', impact: 'medium', subKind: 'large' },
  { id: 'npp-balakovo', name: '巴拉科沃核电站', layerId: 'nuclear_reactors', lng: 47.84, lat: 52.0, note: '俄罗斯，4 堆 VVER 4GW', impact: 'medium', subKind: 'large' },
  { id: 'npp-rostov', name: '罗斯托夫核电站', layerId: 'nuclear_reactors', lng: 43.72, lat: 47.84, note: '俄罗斯伏尔加河畔，4 堆 VVER', impact: 'medium', subKind: 'large' },
  // ── 亚洲 ──
  { id: 'npp-tianwan', name: '田湾核电站', layerId: 'nuclear_reactors', lng: 119.46, lat: 34.71, note: '中俄合作 VVER，江苏，规划 8+ 机组', impact: 'high', subKind: 'mega' },
  { id: 'npp-hongyanhe', name: '红沿河核电站', layerId: 'nuclear_reactors', lng: 121.47, lat: 39.79, note: '辽宁，中国东北首座核电站，6 机组', impact: 'high', subKind: 'mega' },
  { id: 'npp-fuqing', name: '福清核电站', layerId: 'nuclear_reactors', lng: 119.45, lat: 25.44, note: '福建，华龙一号首堆所在地', impact: 'high', subKind: 'large' },
  { id: 'npp-daya-bay-npp', name: '大亚湾核电站', layerId: 'nuclear_reactors', lng: 114.55, lat: 22.59, note: '广东，中国首座大型商用核电站', impact: 'critical', subKind: 'large' },
  { id: 'npp-lingao', name: '岭澳核电站', layerId: 'nuclear_reactors', lng: 114.57, lat: 22.62, note: '广东，紧邻大亚湾', impact: 'high', subKind: 'large' },
  { id: 'npp-yangjiang', name: '阳江核电站', layerId: 'nuclear_reactors', lng: 111.85, lat: 21.7, note: '广东，6 机组 6GW', impact: 'high', subKind: 'mega' },
  { id: 'npp-taishan-npp', name: '台山核电站', layerId: 'nuclear_reactors', lng: 112.77, lat: 21.9, note: '广东，EPR 机组，中法合作', impact: 'high', subKind: 'large' },
  { id: 'npp-qinshan', name: '秦山核电站', layerId: 'nuclear_reactors', lng: 120.95, lat: 30.45, note: '浙江，中国自行设计首座核电站', impact: 'high', subKind: 'large' },
  { id: 'npp-sanmen', name: '三门核电站', layerId: 'nuclear_reactors', lng: 121.38, lat: 28.95, note: '浙江，AP1000 首堆', impact: 'medium', subKind: 'large' },
  { id: 'npp-haiyang', name: '海阳核电站', layerId: 'nuclear_reactors', lng: 121.13, lat: 36.77, note: '山东，AP1000 机组', impact: 'medium', subKind: 'large' },
  { id: 'npp-fangchenggang', name: '防城港核电站', layerId: 'nuclear_reactors', lng: 108.37, lat: 21.7, note: '广西，华龙一号', impact: 'medium', subKind: 'large' },
  { id: 'npp-changjiang', name: '昌江核电站', layerId: 'nuclear_reactors', lng: 108.91, lat: 19.4, note: '海南，华龙一号', impact: 'medium', subKind: 'large' },
  { id: 'npp-tarapur', name: '塔拉普尔核电站', layerId: 'nuclear_reactors', lng: 72.95, lat: 19.83, note: '印度最古老核电站', impact: 'medium', subKind: 'small' },
  { id: 'npp-kudankulam', name: '库丹库拉姆核电站', layerId: 'nuclear_reactors', lng: 77.73, lat: 8.16, note: '印度，俄制 VVER，2GW+', impact: 'high', subKind: 'large' },
  { id: 'npp-barakah', name: '巴拉卡核电站', layerId: 'nuclear_reactors', lng: 52.58, lat: 24.07, note: '阿联酋，阿拉伯世界首座，5.6GW（4 堆）', impact: 'critical', subKind: 'mega' },
  { id: 'npp-bushehr', name: '布什尔核电站', layerId: 'nuclear_reactors', lng: 50.83, lat: 28.83, note: '伊朗，俄制 VVER，中东首座', impact: 'high', subKind: 'large' },
  { id: 'npp-akuyu', name: '阿库尤核电站', layerId: 'nuclear_reactors', lng: 35.17, lat: 36.18, note: '土耳其，俄制 VVER 在建，地中海沿岸', impact: 'high', subKind: 'large' },
  { id: 'npp-kanupp', name: '卡拉奇核电站（K2/K3）', layerId: 'nuclear_reactors', lng: 66.8, lat: 24.85, note: '巴基斯坦，华龙一号海外首堆', impact: 'medium', subKind: 'large' },
  { id: 'npp-chashma', name: '查什马核电站', layerId: 'nuclear_reactors', lng: 71.45, lat: 32.4, note: '巴基斯坦，中巴合作多机组', impact: 'medium', subKind: 'large' },
  { id: 'npp-rooppur', name: '鲁普尔核电站', layerId: 'nuclear_reactors', lng: 89.25, lat: 24.12, note: '孟加拉国，俄制 VVER 在建', impact: 'medium', subKind: 'large' },
  { id: 'npp-kudankulam2', name: '拉贾斯坦核电站', layerId: 'nuclear_reactors', lng: 75.58, lat: 27.27, note: '印度，PHWR 多机组', impact: 'medium', subKind: 'large' },
];

/**
 * 制造基地（factories）— 全球主要制造业与工业基地。
 * subKind 标类型：'auto'（汽车）/ 'shipyard'（造船）/ 'steel'（钢铁冶金）/ 'electronics'（电子）。
 * 整理日：2026-06-22。
 */
export const GLOBAL_FACTORIES: ThematicPoint[] = [
  // ── 汽车制造 ──
  { id: 'fac-toyota-tahara', name: '丰田田原工厂', layerId: 'factories', lng: 137.36, lat: 34.74, note: '日本爱知，丰田旗舰工厂，雷克萨斯产线', impact: 'high', subKind: 'auto' },
  { id: 'fac-toyota-tsutsumi', name: '丰田堤工厂', layerId: 'factories', lng: 137.08, lat: 35.08, note: '丰田普锐斯诞生地', impact: 'medium', subKind: 'auto' },
  { id: 'fac-volkswagen-wolfsburg', name: '大众狼堡工厂', layerId: 'factories', lng: 10.79, lat: 52.43, note: '德国，全球最大汽车工厂之一', impact: 'high', subKind: 'auto' },
  { id: 'fac-bmw-munich', name: '宝马慕尼黑工厂', layerId: 'factories', lng: 11.57, lat: 48.13, note: '宝马总部与主工厂', impact: 'medium', subKind: 'auto' },
  { id: 'fac-mercedes-sindelfingen', name: '奔驰辛德芬根', layerId: 'factories', lng: 9.0, lat: 48.7, note: '德国，奔驰最大工厂，S 级产线', impact: 'high', subKind: 'auto' },
  { id: 'fac-tesla-fremont', name: '特斯拉弗里蒙特', layerId: 'factories', lng: -121.96, lat: 37.49, note: '加州，原 NUMMI 工厂，Tesla 主力', impact: 'high', subKind: 'auto' },
  { id: 'fac-tesla-shanghai', name: '特斯拉上海超级工厂', layerId: 'factories', lng: 121.66, lat: 31.25, note: '中国临港，Tesla 海外首个超级工厂', impact: 'high', subKind: 'auto' },
  { id: 'fac-tesla-berlin', name: '特斯拉柏林超级工厂', layerId: 'factories', lng: 13.42, lat: 52.4, note: '德国 Grünheide，欧洲首座', impact: 'medium', subKind: 'auto' },
  { id: 'fac-tesla-texas', name: '特斯拉得州超级工厂', layerId: 'factories', lng: -97.52, lat: 30.27, note: '奥斯汀，Cybertruck 产线', impact: 'medium', subKind: 'auto' },
  { id: 'fac-byd-shenzhen', name: '比亚迪深圳基地', layerId: 'factories', lng: 114.06, lat: 22.55, note: '中国深圳，全球最大新能源车企总部', impact: 'high', subKind: 'auto' },
  { id: 'fac-saic-shanghai', name: '上汽临港基地', layerId: 'factories', lng: 121.6, lat: 30.88, note: '中国上海，整车制造基地', impact: 'medium', subKind: 'auto' },
  { id: 'fac-faw-changchun', name: '一汽长春基地', layerId: 'factories', lng: 125.32, lat: 43.82, note: '中国吉林，中国汽车工业摇篮', impact: 'medium', subKind: 'auto' },
  { id: 'fac-dongfeng-wuhan', name: '东风武汉基地', layerId: 'factories', lng: 114.31, lat: 30.59, note: '中国湖北，中部汽车集群', impact: 'medium', subKind: 'auto' },
  { id: 'fac-guanchow', name: '广州汽车产业基地', layerId: 'factories', lng: 113.26, lat: 23.13, note: '广汽/东风日产集群', impact: 'medium', subKind: 'auto' },
  { id: 'fac-hyundai-ulsan', name: '现代蔚山工厂', layerId: 'factories', lng: 129.35, lat: 35.5, note: '韩国，全球最大单一汽车工厂', impact: 'high', subKind: 'auto' },
  { id: 'fac-gm-detroit', name: '通用底特律哈姆特拉米克', layerId: 'factories', lng: -83.05, lat: 42.4, note: '美国密歇根，GM 电动车产线', impact: 'medium', subKind: 'auto' },
  { id: 'fac-ford-dearborn', name: '福特荣格工厂', layerId: 'factories', lng: -83.15, lat: 42.3, note: '美国密歇根，福特 Rouge 综合体', impact: 'medium', subKind: 'auto' },
  { id: 'fac-renault-flins', name: '雷诺弗林工厂', layerId: 'factories', lng: 1.87, lat: 48.97, note: '法国巴黎，雷诺主力工厂', impact: 'medium', subKind: 'auto' },
  { id: 'fac-tata-jamshedpur', name: '塔塔贾姆谢德布尔', layerId: 'factories', lng: 86.18, lat: 22.78, note: '印度，塔塔汽车/钢铁基地', impact: 'medium', subKind: 'auto' },
  { id: 'fac-fiat-melfi', name: 'Stellantis 梅尔菲', layerId: 'factories', lng: 15.65, lat: 40.76, note: '意大利，Stellantis 集团工厂', impact: 'low', subKind: 'auto' },
  // ── 造船 ──
  { id: 'fac-hyundai-heavy', name: '现代重工蔚山', layerId: 'factories', lng: 129.35, lat: 35.5, note: '韩国，全球最大造船企业', impact: 'critical', subKind: 'shipyard' },
  { id: 'fac-samsung-geoje', name: '三星重工巨济', layerId: 'factories', lng: 128.7, lat: 34.88, note: '韩国巨济岛，海工/钻井平台基地', impact: 'high', subKind: 'shipyard' },
  { id: 'fac-daewoo-okpo', name: '大宇造船玉浦', layerId: 'factories', lng: 128.75, lat: 34.88, note: '韩国巨济，LNG 船建造主力', impact: 'high', subKind: 'shipyard' },
  { id: 'fac-cssc-shanghai', name: '江南长兴造船', layerId: 'factories', lng: 121.45, lat: 31.25, note: '中国上海长兴岛，最大造船基地', impact: 'critical', subKind: 'shipyard' },
  { id: 'fac-cssc-dalian', name: '大连船舶重工', layerId: 'factories', lng: 121.62, lat: 38.93, note: '中国辽宁，航母建造地', impact: 'high', subKind: 'shipyard' },
  { id: 'fac-imabari', name: '今治造船', layerId: 'factories', lng: 134.0, lat: 34.07, note: '日本今治，散货船建造主力', impact: 'medium', subKind: 'shipyard' },
  { id: 'fac-mitsubishi-nagasaki', name: '三菱长崎造船', layerId: 'factories', lng: 129.87, lat: 32.74, note: '日本长崎，LNG 船历史基地', impact: 'medium', subKind: 'shipyard' },
  { id: 'fac-fincantieri', name: '芬坎蒂尼的里雅斯特', layerId: 'factories', lng: 13.77, lat: 45.65, note: '意大利，欧洲最大邮轮建造商', impact: 'high', subKind: 'shipyard' },
  { id: 'fac-ingalls', name: '英格尔斯造船', layerId: 'factories', lng: -88.66, lat: 30.37, note: '美国密西西比，HII 海军造船', impact: 'high', subKind: 'shipyard' },
  { id: 'fac-newport', name: '纽波特纽斯造船', layerId: 'factories', lng: -76.43, lat: 36.99, note: '美国弗吉尼亚，航母建造基地', impact: 'critical', subKind: 'shipyard' },
  { id: 'fac-electric-boat', name: '电船公司格罗顿', layerId: 'factories', lng: -72.09, lat: 41.35, note: '美国康涅狄格，核潜艇建造地', impact: 'high', subKind: 'shipyard' },
  { id: 'fac-babcock', name: '巴布科克罗塞斯', layerId: 'factories', lng: -3.17, lat: 51.64, note: '英国威尔士，皇家海军主力造船', impact: 'medium', subKind: 'shipyard' },
  { id: 'fac-mazagon', name: '马扎冈造船', layerId: 'factories', lng: 72.84, lat: 18.97, note: '印度孟买，印度海军主力造船厂', impact: 'medium', subKind: 'shipyard' },
  // ── 钢铁冶金 ──
  { id: 'fac-nippon-yawata', name: '新日铁八幡', layerId: 'factories', lng: 130.8, lat: 33.86, note: '日本北九州，日本钢铁工业发源地', impact: 'medium', subKind: 'steel' },
  { id: 'fac-posco-pohang', name: '浦项制铁所', layerId: 'factories', lng: 129.36, lat: 36.0, note: '韩国浦项，POSCO 母厂', impact: 'high', subKind: 'steel' },
  { id: 'fac-posco-gwangyang', name: '光阳制铁所', layerId: 'factories', lng: 127.7, lat: 34.93, note: '韩国，世界最大单一钢厂之一', impact: 'high', subKind: 'steel' },
  { id: 'fac-baoshan', name: '宝山钢铁', layerId: 'factories', lng: 121.44, lat: 31.26, note: '中国上海，宝武集团旗舰钢厂', impact: 'critical', subKind: 'steel' },
  { id: 'fac-shougang', name: '首钢京唐（曹妃甸）', layerId: 'factories', lng: 118.46, lat: 39.27, note: '中国河北，临海钢铁基地', impact: 'medium', subKind: 'steel' },
  { id: 'fac-ansteel', name: '鞍钢集团', layerId: 'factories', lng: 123.0, lat: 41.11, note: '中国辽宁，中国最老钢铁基地', impact: 'high', subKind: 'steel' },
  { id: 'fac-arcelor-dunkirk', name: '安赛乐敦刻尔克', layerId: 'factories', lng: 2.37, lat: 51.04, note: '法国，欧洲最大钢厂之一', impact: 'high', subKind: 'steel' },
  { id: 'fac-tata-steel-jamshedpur', name: '塔塔钢铁贾姆谢德布尔', layerId: 'factories', lng: 86.18, lat: 22.78, note: '印度，塔塔钢铁母厂', impact: 'high', subKind: 'steel' },
  { id: 'fac-nucor', name: '纽柯钢铁查尔斯顿', layerId: 'factories', lng: -79.94, lat: 32.82, note: '美国南卡，电弧炉短流程代表', impact: 'medium', subKind: 'steel' },
  { id: 'fac-us-steel-gary', name: '美国钢铁加里', layerId: 'factories', lng: -87.31, lat: 41.6, note: '美国印第安纳，美钢联最大厂', impact: 'medium', subKind: 'steel' },
  { id: 'fac-mittal-essen', name: '蒂森克虏伯杜伊斯堡', layerId: 'factories', lng: 6.76, lat: 51.43, note: '德国，欧洲最大钢铁工业带', impact: 'high', subKind: 'steel' },
  { id: 'fac-magnitogorsk', name: '马格尼托哥尔斯克钢厂', layerId: 'factories', lng: 59.03, lat: 53.36, note: '俄罗斯乌拉尔，俄最大钢厂', impact: 'high', subKind: 'steel' },
  // ── 电子制造 ──
  { id: 'fac-foxconn-zhengzhou', name: '富士康郑州', layerId: 'factories', lng: 113.62, lat: 34.75, note: '中国河南，全球最大 iPhone 组装基地', impact: 'critical', subKind: 'electronics' },
  { id: 'fac-foxconn-shenzhen', name: '富士康深圳龙华', layerId: 'factories', lng: 114.03, lat: 22.65, note: '中国广东，富士康总部与电子组装', impact: 'high', subKind: 'electronics' },
  { id: 'fac-foxconn-taiyuan', name: '富士康太原', layerId: 'factories', lng: 112.55, lat: 37.87, note: '中国山西，手机金属机壳生产', impact: 'medium', subKind: 'electronics' },
  { id: 'fac-samsung-hwaseong', name: '三星华城半导体', layerId: 'factories', lng: 126.82, lat: 37.21, note: '韩国京畿，三星最大芯片工厂', impact: 'critical', subKind: 'electronics' },
  { id: 'fac-samsung-pyeongtaek', name: '三星平泽半导体', layerId: 'factories', lng: 127.11, lat: 36.99, note: '韩国，最新存储芯片产线', impact: 'high', subKind: 'electronics' },
  { id: 'fac-samsung-vietnam', name: '三星越南北宁', layerId: 'factories', lng: 106.0, lat: 21.18, note: '越南，三星手机最大海外工厂', impact: 'high', subKind: 'electronics' },
  { id: 'fac-foxconn-india', name: '富士康印度泰米尔纳德', layerId: 'factories', lng: 79.0, lat: 13.0, note: '印度，iPhone 转移产线', impact: 'medium', subKind: 'electronics' },
  { id: 'fac-pegatron-kunshan', name: '和硕昆山', layerId: 'factories', lng: 120.98, lat: 31.4, note: '中国江苏，iPhone 代工', impact: 'medium', subKind: 'electronics' },
  { id: 'fac-lg-gumi', name: 'LG 龟尾电子', layerId: 'factories', lng: 128.34, lat: 36.12, note: '韩国，LG 显示/电子基地', impact: 'medium', subKind: 'electronics' },
  { id: 'fac-boa', name: '京东方北京/成都', layerId: 'factories', lng: 116.4, lat: 39.9, note: '中国，全球最大面板制造商之一', impact: 'high', subKind: 'electronics' },
  { id: 'fac-dell-austin', name: '戴尔得州', layerId: 'factories', lng: -97.74, lat: 30.27, note: '美国奥斯汀，戴尔总部（备注）', impact: 'low', subKind: 'electronics' },
];

/**
 * 金融中心（financial_centers）— 全球主要金融中心与核心机构。
 * subKind 标类型：'exchange'（证券交易所）/ 'central_bank'（中央银行）/ 'swf'（主权财富基金）。
 * 整理日：2026-06-22。
 */
export const GLOBAL_FINANCIAL_CENTERS: ThematicPoint[] = [
  // ── 证券交易所 ──
  { id: 'fc-nyse', name: '纽约证券交易所（NYSE）', layerId: 'financial_centers', lng: -74.01, lat: 40.71, note: '华尔街 11 号，全球最大证券交易所', impact: 'critical', subKind: 'exchange' },
  { id: 'fc-nasdaq', name: '纳斯达克（NASDAQ）', layerId: 'financial_centers', lng: -74.01, lat: 40.71, note: '时代广场，科技股主场', impact: 'critical', subKind: 'exchange' },
  { id: 'fc-cme', name: '芝加哥商品交易所（CME）', layerId: 'financial_centers', lng: -87.63, lat: 41.88, note: '全球最大期货与衍生品交易所', impact: 'critical', subKind: 'exchange' },
  { id: 'fc-lse', name: '伦敦证券交易所（LSE）', layerId: 'financial_centers', lng: -0.09, lat: 51.51, note: '伦敦金融城，欧洲最大', impact: 'critical', subKind: 'exchange' },
  { id: 'fc-eurex', name: '欧洲期货交易所（Eurex）', layerId: 'financial_centers', lng: 8.54, lat: 50.07, note: '苏黎世/法兰克福，欧洲衍生品', impact: 'high', subKind: 'exchange' },
  { id: 'fc-euronext', name: '泛欧交易所（Euronext）', layerId: 'financial_centers', lng: 2.35, lat: 48.86, note: '巴黎/阿姆斯特丹/布鲁塞尔', impact: 'high', subKind: 'exchange' },
  { id: 'fc-deutsche-borse', name: '德意志交易所', layerId: 'financial_centers', lng: 8.68, lat: 50.11, note: '法兰克福，Xetra 电子交易', impact: 'high', subKind: 'exchange' },
  { id: 'fc-six', name: '瑞士证券交易所（SIX）', layerId: 'financial_centers', lng: 8.54, lat: 47.37, note: '苏黎世，大宗商品融资中心', impact: 'high', subKind: 'exchange' },
  { id: 'fc-tse', name: '东京证券交易所（TSE）', layerId: 'financial_centers', lng: 139.77, lat: 35.68, note: '亚洲第二大，日本最大', impact: 'critical', subKind: 'exchange' },
  { id: 'fc-hkex', name: '香港交易所（HKEX）', layerId: 'financial_centers', lng: 114.16, lat: 22.28, note: '中环，离岸人民币与国际 IPO', impact: 'critical', subKind: 'exchange' },
  { id: 'fc-sse', name: '上海证券交易所（SSE）', layerId: 'financial_centers', lng: 121.49, lat: 31.23, note: '陆家嘴，A 股主板', impact: 'critical', subKind: 'exchange' },
  { id: 'fc-szse', name: '深圳证券交易所（SZSE）', layerId: 'financial_centers', lng: 113.93, lat: 22.53, note: '创业板与中小企业板', impact: 'high', subKind: 'exchange' },
  { id: 'fc-cffex', name: '中国金融期货交易所', layerId: 'financial_centers', lng: 121.49, lat: 31.23, note: '上海，股指期货与国债期货', impact: 'medium', subKind: 'exchange' },
  { id: 'fc-ksse', name: '韩国交易所（KRX）', layerId: 'financial_centers', lng: 126.98, lat: 37.57, note: '首尔汝矣岛，KOSPI/KOSDAQ', impact: 'high', subKind: 'exchange' },
  { id: 'fc-asx', name: '澳洲证券交易所（ASX）', layerId: 'financial_centers', lng: 151.21, lat: -33.87, note: '悉尼，南半球最大', impact: 'medium', subKind: 'exchange' },
  { id: 'fc-nse-india', name: '印度国家证券交易所（NSE）', layerId: 'financial_centers', lng: 72.88, lat: 19.08, note: '孟买，印度最大', impact: 'high', subKind: 'exchange' },
  { id: 'fc-bse', name: '孟买证券交易所（BSE）', layerId: 'financial_centers', lng: 72.83, lat: 18.93, note: '亚洲最古老交易所', impact: 'high', subKind: 'exchange' },
  { id: 'fc-sgx', name: '新加坡交易所（SGX）', layerId: 'financial_centers', lng: 103.85, lat: 1.28, note: '铁矿石/橡胶衍生品定价中心', impact: 'high', subKind: 'exchange' },
  { id: 'fc-saudi-tadawul', name: '沙特交易所（Tadawul）', layerId: 'financial_centers', lng: 46.72, lat: 24.71, note: '利雅得，阿美上市地', impact: 'high', subKind: 'exchange' },
  { id: 'fc-dfm', name: '迪拜金融市场（DFM）', layerId: 'financial_centers', lng: 55.27, lat: 25.2, note: 'DIFC 海湾金融枢纽', impact: 'medium', subKind: 'exchange' },
  { id: 'fc-bovespa', name: '巴西交易所（B3）', layerId: 'financial_centers', lng: -46.63, lat: -23.55, note: '圣保罗，拉美最大', impact: 'high', subKind: 'exchange' },
  { id: 'fc-bmv', name: '墨西哥证券交易所（BMV）', layerId: 'financial_centers', lng: -99.17, lat: 19.43, note: '墨西哥城，拉美第二大', impact: 'medium', subKind: 'exchange' },
  { id: 'fc-jse', name: '约翰内斯堡交易所（JSE）', layerId: 'financial_centers', lng: 28.04, lat: -26.2, note: '非洲最大，矿业股核心', impact: 'medium', subKind: 'exchange' },
  // ── 中央银行 ──
  { id: 'fc-fed', name: '美联储（Fed）', layerId: 'financial_centers', lng: -77.02, lat: 38.89, note: '华盛顿，埃克尔斯大楼，全球央行之央行', impact: 'critical', subKind: 'central_bank' },
  { id: 'fc-ecb', name: '欧洲央行（ECB）', layerId: 'financial_centers', lng: 8.55, lat: 50.11, note: '法兰克福，欧元区货币政策', impact: 'critical', subKind: 'central_bank' },
  { id: 'fc-boe', name: '英格兰银行（BoE）', layerId: 'financial_centers', lng: -0.09, lat: 51.51, note: '伦敦 Threadneedle 街', impact: 'critical', subKind: 'central_bank' },
  { id: 'fc-boj', name: '日本银行（BoJ）', layerId: 'financial_centers', lng: 139.77, lat: 35.68, note: '东京日本桥，超宽松货币政策', impact: 'critical', subKind: 'central_bank' },
  { id: 'fc-pboc', name: '中国人民银行（PBoC）', layerId: 'financial_centers', lng: 116.39, lat: 39.9, note: '北京金融街，人民币汇率管理', impact: 'critical', subKind: 'central_bank' },
  { id: 'fc-snb', name: '瑞士国家银行（SNB）', layerId: 'financial_centers', lng: 8.54, lat: 47.37, note: '苏黎世/伯尔尼，瑞郎干预', impact: 'high', subKind: 'central_bank' },
  { id: 'fc-buba', name: '德国联邦银行（Bundesbank）', layerId: 'financial_centers', lng: 8.68, lat: 50.11, note: '法兰克福，ECB 前身地位', impact: 'high', subKind: 'central_bank' },
  { id: 'fc-bok', name: '韩国银行（BOK）', layerId: 'financial_centers', lng: 126.98, lat: 37.56, note: '首尔，韩元管理', impact: 'medium', subKind: 'central_bank' },
  { id: 'fc-rbi', name: '印度储备银行（RBI）', layerId: 'financial_centers', lng: 72.83, lat: 18.93, note: '孟买，卢比管理', impact: 'medium', subKind: 'central_bank' },
  { id: 'fc-rba', name: '澳洲储备银行（RBA）', layerId: 'financial_centers', lng: 151.21, lat: -33.87, note: '悉尼，澳元管理', impact: 'medium', subKind: 'central_bank' },
  { id: 'fc-sama', name: '沙特货币局（SAMA）', layerId: 'financial_centers', lng: 46.72, lat: 24.71, note: '利雅得，里亚尔与石油美元', impact: 'high', subKind: 'central_bank' },
  { id: 'fc-cbr', name: '俄罗斯央行（CBR）', layerId: 'financial_centers', lng: 37.62, lat: 55.75, note: '莫斯科，卢布与资本管制', impact: 'high', subKind: 'central_bank' },
  // ── 主权财富基金 ──
  { id: 'fc-norway-gpf', name: '挪威政府养老基金（NBIM）', layerId: 'financial_centers', lng: 10.75, lat: 59.91, note: '奥斯陆，全球最大主权基金 1.5T 美元', impact: 'critical', subKind: 'swf' },
  { id: 'fc-china-cic', name: '中投公司（CIC）', layerId: 'financial_centers', lng: 116.36, lat: 39.91, note: '北京，中国主权财富基金', impact: 'critical', subKind: 'swf' },
  { id: 'fc-adia', name: '阿布扎比投资局（ADIA）', layerId: 'financial_centers', lng: 54.37, lat: 24.48, note: '阿联酋，全球第二大主权基金', impact: 'critical', subKind: 'swf' },
  { id: 'fc-saudi-pif', name: '沙特公共投资基金（PIF）', layerId: 'financial_centers', lng: 46.72, lat: 24.71, note: '利雅得，Vision 2030 投资旗舰', impact: 'critical', subKind: 'swf' },
  { id: 'fc-kuwait-kia', name: '科威特投资局（KIA）', layerId: 'financial_centers', lng: 47.98, lat: 29.37, note: '科威特城，最古老主权基金之一', impact: 'high', subKind: 'swf' },
  { id: 'fc-qatar-qia', name: '卡塔尔投资局（QIA）', layerId: 'financial_centers', lng: 51.53, lat: 25.29, note: '多哈，欧洲地产/体育投资活跃', impact: 'high', subKind: 'swf' },
  { id: 'fc-singapore-gic', name: '新加坡政府投资公司（GIC）', layerId: 'financial_centers', lng: 103.85, lat: 1.28, note: '新加坡，全球最大私募 LP 之一', impact: 'high', subKind: 'swf' },
  { id: 'fc-temasek', name: '淡马锡控股', layerId: 'financial_centers', lng: 103.85, lat: 1.28, note: '新加坡，国资控股旗舰', impact: 'high', subKind: 'swf' },
  { id: 'fc-hk-exchanges', name: '香港金管局（HKMA）', layerId: 'financial_centers', lng: 114.16, lat: 22.28, note: '香港，联系汇率与外汇基金', impact: 'high', subKind: 'swf' },
  { id: 'fc-korea-kic', name: '韩国投资公司（KIC）', layerId: 'financial_centers', lng: 126.98, lat: 37.57, note: '首尔，韩国主权基金', impact: 'medium', subKind: 'swf' },
];

/**
 * 边境口岸（borders）— 全球主要陆路边境口岸与关隘。
 * subKind 标类型：'land'（陆路口岸）/ 'megaproject'（跨境超级工程）。
 * 整理日：2026-06-22。
 */
export const GLOBAL_BORDERS: ThematicPoint[] = [
  // ── 中美俄大国边境 ──
  { id: 'bor-erlian', name: '二连浩特口岸', layerId: 'borders', lng: 111.98, lat: 43.65, note: '中蒙最大陆路口岸，中欧班列通道', impact: 'high', subKind: 'land' },
  { id: 'bor-manimen', name: '满洲里口岸', layerId: 'borders', lng: 117.43, lat: 49.6, note: '中俄最大陆路口岸', impact: 'high', subKind: 'land' },
  { id: 'bor-suifenhe', name: '绥芬河口岸', layerId: 'borders', lng: 131.15, lat: 44.41, note: '中俄东部，黑龙江', impact: 'medium', subKind: 'land' },
  { id: 'bor-heihe', name: '黑河口岸', layerId: 'borders', lng: 127.53, lat: 50.24, note: '中俄黑龙江，对岸布拉戈维申斯克', impact: 'medium', subKind: 'land' },
  { id: 'bor-khorgos', name: '霍尔果斯口岸', layerId: 'borders', lng: 80.42, lat: 44.2, note: '中哈，中欧班列西通道，一带一路枢纽', impact: 'high', subKind: 'land' },
  { id: 'bor-alashankou', name: '阿拉山口口岸', layerId: 'borders', lng: 82.57, lat: 45.17, note: '中哈，首条中欧班列通道', impact: 'high', subKind: 'land' },
  { id: 'bor-pingxiang', name: '友谊关（凭祥）', layerId: 'borders', lng: 106.66, lat: 22.02, note: '中越最大陆路口岸', impact: 'medium', subKind: 'land' },
  { id: 'bor-ruili', name: '瑞丽口岸', layerId: 'borders', lng: 97.85, lat: 24.01, note: '中缅最大口岸，翡翠/木材贸易', impact: 'medium', subKind: 'land' },
  { id: 'bor-mohpa', name: '磨憨口岸', layerId: 'borders', lng: 101.42, lat: 21.46, note: '中老铁路出境点，老挝万象通道', impact: 'medium', subKind: 'land' },
  { id: 'bor-zham', name: '樟木/吉隆口岸', layerId: 'borders', lng: 85.98, lat: 28.33, note: '中尼口岸，尼泊尔贸易', impact: 'low', subKind: 'land' },
  // ── 美墨边境 ──
  { id: 'bor-tijuana', name: '圣伊西德罗（蒂华纳）', layerId: 'borders', lng: -117.05, lat: 32.54, note: '美墨最繁忙陆路口岸', impact: 'high', subKind: 'land' },
  { id: 'bor-juarez', name: '埃尔帕索-华雷斯', layerId: 'borders', lng: -106.49, lat: 31.74, note: '美墨第二大口岸', impact: 'high', subKind: 'land' },
  { id: 'bor-laredo', name: '拉雷多-新拉雷多', layerId: 'borders', lng: -99.51, lat: 27.51, note: '美墨货运量最大口岸', impact: 'high', subKind: 'land' },
  { id: 'bor-nogales', name: '诺加利斯', layerId: 'borders', lng: -110.94, lat: 31.33, note: '美墨亚利桑那/索诺拉', impact: 'medium', subKind: 'land' },
  { id: 'bor-otay', name: '奥泰梅萨', layerId: 'borders', lng: -116.95, lat: 32.6, note: '美墨加州货运专用', impact: 'medium', subKind: 'land' },
  // ── 欧洲口岸 ──
  { id: 'bor-calais', name: '加来-多佛尔', layerId: 'borders', lng: 1.85, lat: 50.96, note: '英法海底隧道口，欧洲最忙货运', impact: 'critical', subKind: 'megaproject' },
  { id: 'bor-eurotunnel', name: '英法海底隧道', layerId: 'borders', lng: 1.26, lat: 51.09, note: '50km 海底铁路隧道，1994 通车', impact: 'critical', subKind: 'megaproject' },
  { id: 'bor-brenner', name: '布伦纳罗山口', layerId: 'borders', lng: 11.51, lat: 47.0, note: '意奥，阿尔卑斯主要南北通道', impact: 'high', subKind: 'land' },
  { id: 'bor-stgorge', name: '圣哥达山口', layerId: 'borders', lng: 8.56, lat: 46.56, note: '瑞士，阿尔卑斯最重要南北通道', impact: 'high', subKind: 'land' },
  { id: 'bor-suwalki', name: '苏瓦乌基走廊', layerId: 'borders', lng: 23.0, lat: 54.1, note: '波兰-立陶宛，北约最脆弱地缘点', impact: 'critical', subKind: 'land' },
  // ── 南亚/中东 ──
  { id: 'bor-wagah', name: '瓦加口岸', layerId: 'borders', lng: 74.57, lat: 31.62, note: '印巴唯一陆路口岸，降旗仪式闻名', impact: 'high', subKind: 'land' },
  { id: 'bor-attari', name: '阿塔里检查站', layerId: 'borders', lng: 74.58, lat: 31.61, note: '印巴边境印方侧', impact: 'medium', subKind: 'land' },
  { id: 'bor-khyber', name: '开伯尔山口', layerId: 'borders', lng: 71.27, lat: 34.09, note: '巴阿，历史通往印度次大陆门户', impact: 'high', subKind: 'land' },
  { id: 'bor-chaman', name: '查曼-斯平布尔达克', layerId: 'borders', lng: 66.45, lat: 30.92, note: '巴阿主要贸易口岸', impact: 'medium', subKind: 'land' },
  { id: 'bor-torkham', name: '托尔哈姆', layerId: 'borders', lng: 71.15, lat: 34.06, note: '巴阿另一主要口岸', impact: 'medium', subKind: 'land' },
  // ── 东南亚 ──
  { id: 'bor-friendship', name: '泰老第一友谊桥', layerId: 'borders', lng: 104.78, lat: 17.39, note: '廊开-万象，湄公河跨境桥', impact: 'medium', subKind: 'megaproject' },
  { id: 'bor-causeway', name: '新马长堤', layerId: 'borders', lng: 103.76, lat: 1.45, note: '新柔长堤，全球最繁忙陆路通道之一', impact: 'high', subKind: 'megaproject' },
  { id: 'bor-second-link', name: '新马第二通道', layerId: 'borders', lng: 103.62, lat: 1.36, note: '大士第二通道', impact: 'medium', subKind: 'megaproject' },
  // ── 朝鲜半岛 ──
  { id: 'bor-dorasan', name: '都罗山站', layerId: 'borders', lng: 126.71, lat: 37.85, note: '朝韩京义线最北，目前停运', impact: 'medium', subKind: 'land' },
  { id: 'bor-panmunjom', name: '板门店', layerId: 'borders', lng: 126.68, lat: 37.96, note: '朝韩军事分界线，停战村', impact: 'critical', subKind: 'land' },
  { id: 'bor-sinuiju', name: '新义州-丹东', layerId: 'borders', lng: 124.39, lat: 40.1, note: '朝中鸭绿江，中朝贸易主通道', impact: 'high', subKind: 'land' },
  // ── 其他 ──
  { id: 'bor-berlin', name: '勃兰登堡门', layerId: 'borders', lng: 13.38, lat: 52.52, note: '柏林，冷战分裂象征（历史口岸）', impact: 'medium', subKind: 'land' },
  { id: 'bor-sahara', name: '休达/梅利利亚', layerId: 'borders', lng: -5.35, lat: 35.89, note: '西班牙在北非飞地，摩洛哥-欧盟边界', impact: 'medium', subKind: 'land' },
  { id: 'bor-osman', name: '奥斯曼恰伊（土耳其/亚美尼亚）', layerId: 'borders', lng: 43.0, lat: 40.85, note: '土阿封闭边境，地缘紧张点', impact: 'low', subKind: 'land' },
];

/**
 * 沙漠荒漠（deserts）— 全球主要沙漠与荒漠。
 * subKind 标类型：'hot'（热沙漠）/ 'cold'（冷沙漠）。
 * 整理日：2026-06-22。
 */
export const GLOBAL_DESERTS: ThematicPoint[] = [
  // ── 热沙漠 ──
  { id: 'des-sahara', name: '撒哈拉沙漠', layerId: 'deserts', lng: 13.0, lat: 23.0, note: '世界最大热沙漠，约 900 万 km²，北非', impact: 'critical', subKind: 'hot' },
  { id: 'des-arabian', name: '阿拉伯沙漠', layerId: 'deserts', lng: 45.0, lat: 23.0, note: '阿拉伯半岛，约 230 万 km²', impact: 'high', subKind: 'hot' },
  { id: 'des-rub-al-khali', name: '鲁卜哈利（空域）', layerId: 'deserts', lng: 50.0, lat: 20.0, note: '沙特南部，世界最大连续沙海', impact: 'high', subKind: 'hot' },
  { id: 'des-kalahari', name: '卡拉哈里沙漠', layerId: 'deserts', lng: 22.0, lat: -23.0, note: '博茨瓦纳/纳米比亚/南非，约 90 万 km²', impact: 'medium', subKind: 'hot' },
  { id: 'des-namib', name: '纳米布沙漠', layerId: 'deserts', lng: 14.0, lat: -24.0, note: '纳米比亚海岸，世界最古老沙漠', impact: 'medium', subKind: 'hot' },
  { id: 'des-syrian', name: '叙利亚沙漠', layerId: 'deserts', lng: 39.0, lat: 34.0, note: '叙利亚/约旦/伊拉克/沙特交界', impact: 'low', subKind: 'hot' },
  { id: 'des-thar', name: '塔尔沙漠', layerId: 'deserts', lng: 70.0, lat: 27.0, note: '印度/巴基斯坦，约 20 万 km²', impact: 'medium', subKind: 'hot' },
  { id: 'des-mojave', name: '莫哈维沙漠', layerId: 'deserts', lng: -116.0, lat: 35.0, note: '美国西南，死亡谷所在地', impact: 'medium', subKind: 'hot' },
  { id: 'des-sonoran', name: '索诺兰沙漠', layerId: 'deserts', lng: -112.0, lat: 32.0, note: '美墨交界，仙人掌沙漠代表', impact: 'low', subKind: 'hot' },
  { id: 'des-chihuahuan', name: '奇瓦瓦沙漠', layerId: 'deserts', lng: -105.0, lat: 29.0, note: '美墨，北美最大沙漠', impact: 'low', subKind: 'hot' },
  { id: 'des-atacama', name: '阿塔卡马沙漠', layerId: 'deserts', lng: -69.0, lat: -23.5, note: '智利，世界最干燥沙漠，锂矿核心', impact: 'high', subKind: 'hot' },
  { id: 'des-simpson', name: '辛普森沙漠', layerId: 'deserts', lng: 138.0, lat: -25.0, note: '澳大利亚内陆，红色沙丘', impact: 'low', subKind: 'hot' },
  { id: 'des-great-sandy', name: '大沙沙漠', layerId: 'deserts', lng: 124.0, lat: -21.0, note: '澳大利亚西北', impact: 'low', subKind: 'hot' },
  { id: 'des-gibson', name: '吉布森沙漠', layerId: 'deserts', lng: 124.0, lat: -25.0, note: '澳大利亚中西部', impact: 'low', subKind: 'hot' },
  { id: 'des-great-victoria', name: '大维多利亚沙漠', layerId: 'deserts', lng: 128.0, lat: -29.0, note: '澳大利亚最大沙漠', impact: 'low', subKind: 'hot' },
  { id: 'des-danakil', name: '达纳基尔沙漠', layerId: 'deserts', lng: 40.5, lat: 13.5, note: '埃塞俄比亚/厄立特里亚，极端热/盐', impact: 'medium', subKind: 'hot' },
  // ── 冷沙漠 ──
  { id: 'des-gobi', name: '戈壁沙漠', layerId: 'deserts', lng: 104.0, lat: 42.0, note: '中蒙，约 130 万 km²，寒冷荒漠', impact: 'high', subKind: 'cold' },
  { id: 'des-taklamakan', name: '塔克拉玛干沙漠', layerId: 'deserts', lng: 83.0, lat: 39.0, note: '中国新疆塔里木盆地，世界第二大流动沙漠', impact: 'high', subKind: 'cold' },
  { id: 'des-patagonian', name: '巴塔哥尼亚沙漠', layerId: 'deserts', lng: -68.0, lat: -44.0, note: '阿根廷，南美最大沙漠，寒冷', impact: 'medium', subKind: 'cold' },
  { id: 'des-great-basin', name: '大盆地沙漠', layerId: 'deserts', lng: -116.0, lat: 40.0, note: '美国西部，最大冷沙漠', impact: 'medium', subKind: 'cold' },
  { id: 'des-colorado', name: '科罗拉多高原', layerId: 'deserts', lng: -110.0, lat: 37.0, note: '美国西部，大峡谷/纪念碑谷', impact: 'low', subKind: 'cold' },
  { id: 'des-iranian', name: '伊朗高原荒漠', layerId: 'deserts', lng: 56.0, lat: 32.0, note: '卡维尔/卢特盐漠，极端高温', impact: 'medium', subKind: 'cold' },
  { id: 'des-karakum', name: '卡拉库姆沙漠', layerId: 'deserts', lng: 59.0, lat: 40.0, note: '土库曼斯坦，约 35 万 km²', impact: 'medium', subKind: 'cold' },
  { id: 'des-kyzylkum', name: '克孜勒库姆沙漠', layerId: 'deserts', lng: 64.0, lat: 42.0, note: '乌兹别克/哈萨克，约 30 万 km²', impact: 'medium', subKind: 'cold' },
  { id: 'des-aralkum', name: '阿拉尔库姆（咸海床）', layerId: 'deserts', lng: 60.0, lat: 45.0, note: '咸海干涸形成的新沙漠，盐尘暴源', impact: 'medium', subKind: 'cold' },
  { id: 'des-antarctica', name: '南极冰原荒漠', layerId: 'deserts', lng: 0.0, lat: -82.0, note: '技术上世界最大沙漠（极地冷漠）', impact: 'critical', subKind: 'cold' },
  { id: 'des-greenland', name: '格陵兰冰原', layerId: 'deserts', lng: -40.0, lat: 72.0, note: '极地荒漠，第二大冰盖', impact: 'high', subKind: 'cold' },
];

/**
 * 高等学府（universities）— 全球顶尖大学与高等学府。
 * subKind 标类型：'ivy'（常春藤/顶尖私立）/ 'public'（公立旗舰）/ 'tech'（理工科大）。
 * 整理日：2026-06-22。
 */
export const GLOBAL_UNIVERSITIES: ThematicPoint[] = [
  // ── 常春藤/顶尖私立 ──
  { id: 'uni-harvard', name: '哈佛大学', layerId: 'universities', lng: -71.12, lat: 42.38, note: '麻省剑桥，美国最古老大学（1636）', impact: 'critical', subKind: 'ivy' },
  { id: 'uni-yale', name: '耶鲁大学', layerId: 'universities', lng: -72.93, lat: 41.31, note: '康涅狄格纽黑文', impact: 'high', subKind: 'ivy' },
  { id: 'uni-princeton', name: '普林斯顿大学', layerId: 'universities', lng: -74.66, lat: 40.35, note: '新泽西', impact: 'high', subKind: 'ivy' },
  { id: 'uni-columbia', name: '哥伦比亚大学', layerId: 'universities', lng: -73.96, lat: 40.81, note: '纽约曼哈顿', impact: 'high', subKind: 'ivy' },
  { id: 'uni-stanford', name: '斯坦福大学', layerId: 'universities', lng: -122.17, lat: 37.43, note: '加州，硅谷孵化器', impact: 'critical', subKind: 'ivy' },
  { id: 'uni-mit', name: '麻省理工学院', layerId: 'universities', lng: -71.09, lat: 42.36, note: '剑桥，理工科之巅', impact: 'critical', subKind: 'tech' },
  { id: 'uni-caltech', name: '加州理工学院', layerId: 'universities', lng: -118.13, lat: 34.14, note: '帕萨迪纳，NASA JPL 母校', impact: 'high', subKind: 'tech' },
  { id: 'uni-chicago', name: '芝加哥大学', layerId: 'universities', lng: -87.6, lat: 41.79, note: '芝加哥，经济学重镇', impact: 'high', subKind: 'ivy' },
  { id: 'uni-upenn', name: '宾夕法尼亚大学', layerId: 'universities', lng: -75.19, lat: 39.95, note: '费城，沃顿商学院', impact: 'high', subKind: 'ivy' },
  { id: 'uni-oxford', name: '牛津大学', layerId: 'universities', lng: -1.25, lat: 51.75, note: '英国，英语世界最古老大学', impact: 'critical', subKind: 'ivy' },
  { id: 'uni-cambridge', name: '剑桥大学', layerId: 'universities', lng: 0.12, lat: 52.21, note: '英国，卡文迪许实验室', impact: 'critical', subKind: 'ivy' },
  { id: 'uni-imperial', name: '帝国理工学院', layerId: 'universities', lng: -0.17, lat: 51.5, note: '伦敦，理工科旗舰', impact: 'high', subKind: 'tech' },
  { id: 'uni-lse', name: '伦敦政经学院', layerId: 'universities', lng: -0.12, lat: 51.51, note: '伦敦，社会科学重镇', impact: 'medium', subKind: 'ivy' },
  { id: 'uni-eth', name: '苏黎世联邦理工（ETH）', layerId: 'universities', lng: 8.55, lat: 47.38, note: '瑞士，爱因斯坦母校', impact: 'high', subKind: 'tech' },
  { id: 'uni-epfl', name: '洛桑联邦理工（EPFL）', layerId: 'universities', lng: 6.57, lat: 46.52, note: '瑞士法语区理工旗舰', impact: 'medium', subKind: 'tech' },
  // ── 公立旗舰 ──
  { id: 'uni-berkeley', name: '加州大学伯克利', layerId: 'universities', lng: -122.26, lat: 37.87, note: '公立大学之首', impact: 'critical', subKind: 'public' },
  { id: 'uni-ucla', name: '加州大学洛杉矶', layerId: 'universities', lng: -118.45, lat: 34.07, note: '西岸旗舰', impact: 'high', subKind: 'public' },
  { id: 'umi-michigan', name: '密歇根大学安娜堡', layerId: 'universities', lng: -83.71, lat: 42.28, note: '中西部公立旗舰', impact: 'high', subKind: 'public' },
  { id: 'umi-illinois', name: '伊利诺伊大学香槟', layerId: 'universities', lng: -88.23, lat: 40.11, note: 'UIUC，工程与 CS', impact: 'high', subKind: 'tech' },
  { id: 'umi-toronto', name: '多伦多大学', layerId: 'universities', lng: -79.39, lat: 43.66, note: '加拿大顶尖', impact: 'high', subKind: 'public' },
  { id: 'umi-mcgill', name: '麦吉尔大学', layerId: 'universities', lng: -73.58, lat: 45.5, note: '蒙特利尔，加拿大哈佛', impact: 'medium', subKind: 'public' },
  { id: 'umi-tokyo', name: '东京大学', layerId: 'universities', lng: 139.76, lat: 35.71, note: '日本最高学府，赤门', impact: 'critical', subKind: 'public' },
  { id: 'umi-kyoto', name: '京都大学', layerId: 'universities', lng: 135.78, lat: 35.03, note: '日本最多诺奖得主', impact: 'high', subKind: 'public' },
  { id: 'umi-titech', name: '东京工业大学', layerId: 'universities', lng: 139.68, lat: 35.6, note: '日本理工旗舰', impact: 'medium', subKind: 'tech' },
  { id: 'umi-seoul-national', name: '首尔国立大学', layerId: 'universities', lng: 126.95, lat: 37.46, note: '韩国最高学府', impact: 'high', subKind: 'public' },
  { id: 'umi-kaist', name: '韩国科学技术院（KAIST）', layerId: 'universities', lng: 127.36, lat: 36.37, note: '大田，韩国理工旗舰', impact: 'high', subKind: 'tech' },
  { id: 'umi-postech', name: '浦项科技大学（POSTECH）', layerId: 'universities', lng: 129.37, lat: 36.01, note: '浦项，理工科大', impact: 'medium', subKind: 'tech' },
  { id: 'umi-nus', name: '新加坡国立大学', layerId: 'universities', lng: 103.78, lat: 1.3, note: '亚洲顶尖', impact: 'critical', subKind: 'public' },
  { id: 'umi-ntu', name: '南洋理工大学', layerId: 'universities', lng: 103.68, lat: 1.35, note: '新加坡理工旗舰', impact: 'high', subKind: 'tech' },
  { id: 'umi-tsinghua', name: '清华大学', layerId: 'universities', lng: 116.32, lat: 40.0, note: '北京，中国工科之巅', impact: 'critical', subKind: 'tech' },
  { id: 'umi-peking', name: '北京大学', layerId: 'universities', lng: 116.31, lat: 39.99, note: '北京，中国文理之巅', impact: 'critical', subKind: 'public' },
  { id: 'umi-fudan', name: '复旦大学', layerId: 'universities', lng: 121.5, lat: 31.3, note: '上海，江南第一学府', impact: 'high', subKind: 'public' },
  { id: 'umi-sjtu', name: '上海交通大学', layerId: 'universities', lng: 121.43, lat: 31.03, note: '上海，工科与商科', impact: 'high', subKind: 'tech' },
  { id: 'umi-zju', name: '浙江大学', layerId: 'universities', lng: 120.13, lat: 30.27, note: '杭州，综合型旗舰', impact: 'high', subKind: 'public' },
  { id: 'umi-ustc', name: '中国科学技术大学', layerId: 'universities', lng: 117.27, lat: 31.86, note: '合肥，理工科研重镇', impact: 'high', subKind: 'tech' },
  { id: 'umi-nankai', name: '南京大学', layerId: 'universities', lng: 118.78, lat: 32.06, note: '南京，文理综合', impact: 'high', subKind: 'public' },
  { id: 'umi-whu', name: '武汉大学', layerId: 'universities', lng: 114.36, lat: 30.54, note: '武汉，樱花与测绘', impact: 'medium', subKind: 'public' },
  { id: 'umi-hust', name: '华中科技大学', layerId: 'universities', lng: 114.42, lat: 30.51, note: '武汉，工科与医科', impact: 'medium', subKind: 'tech' },
  { id: 'umi-sysu', name: '中山大学', layerId: 'universities', lng: 113.3, lat: 23.1, note: '广州，华南旗舰', impact: 'medium', subKind: 'public' },
  { id: 'umi-hku', name: '香港大学', layerId: 'universities', lng: 114.14, lat: 22.28, note: '薄扶林，亚洲历史名校', impact: 'high', subKind: 'public' },
  { id: 'umi-hkust', name: '香港科技大学', layerId: 'universities', lng: 114.26, lat: 22.34, note: '清水湾，理工与商科', impact: 'high', subKind: 'tech' },
  { id: 'umi-cuhk', name: '香港中文大学', layerId: 'universities', lng: 114.21, lat: 22.42, note: '沙田，人文与理科', impact: 'medium', subKind: 'public' },
  { id: 'umi-ntu-tw', name: '台湾大学', layerId: 'universities', lng: 121.54, lat: 25.02, note: '台北，台湾最高学府', impact: 'high', subKind: 'public' },
  { id: 'umi-nthu', name: '清华大学（新竹）', layerId: 'universities', lng: 120.99, lat: 24.79, note: '台湾清华/交大理工旗舰', impact: 'medium', subKind: 'tech' },
  { id: 'umi-iit', name: '印度理工学院（孟买/德里）', layerId: 'universities', lng: 72.91, lat: 19.13, note: 'IIT 系统，印度理工皇冠', impact: 'high', subKind: 'tech' },
  { id: 'umi-sorbonne', name: '索邦大学（巴黎）', layerId: 'universities', lng: 2.34, lat: 48.85, note: '巴黎，拉丁区学术心脏', impact: 'high', subKind: 'public' },
  { id: 'umi-heidelberg', name: '海德堡大学', layerId: 'universities', lng: 8.67, lat: 49.4, note: '德国最古老大学（1386）', impact: 'medium', subKind: 'public' },
  { id: 'umi-humboldt', name: '洪堡大学', layerId: 'universities', lng: 13.39, lat: 52.52, note: '柏林，爱因斯坦/马克思母校', impact: 'medium', subKind: 'public' },
  { id: 'umi-tu-munich', name: '慕尼黑工业大学', layerId: 'universities', lng: 11.57, lat: 48.15, note: 'TUM，德国理工旗舰', impact: 'high', subKind: 'tech' },
  { id: 'umi-melbourne', name: '墨尔本大学', layerId: 'universities', lng: 144.96, lat: -37.8, note: '澳洲第一', impact: 'high', subKind: 'public' },
  { id: 'umi-ans', name: '澳洲国立大学', layerId: 'universities', lng: 149.12, lat: -35.28, note: '堪培拉，研究型旗舰', impact: 'medium', subKind: 'public' },
];

/**
 * 军工企业（military_industry）— 全球主要军工与防务企业总部。
 * subKind 标类型：'aero'（航空军工）/ 'arms'（武器弹药）/ 'space'（航天防务）/ 'naval'（海军造舰）。
 * 整理日：2026-06-22。
 */
export const GLOBAL_MILITARY_INDUSTRY: ThematicPoint[] = [
  // ── 美国 ──
  { id: 'mi-lockheed', name: '洛克希德·马丁', layerId: 'military_industry', lng: -77.2, lat: 38.95, note: '马里兰 Bethesda，全球最大军工企业，F-35', impact: 'critical', subKind: 'aero' },
  { id: 'mi-rtx', name: 'RTX（雷神技术）', layerId: 'military_industry', lng: -72.68, lat: 41.77, note: '康涅狄格，爱国者/战斧导弹', impact: 'critical', subKind: 'aero' },
  { id: 'mi-boeing', name: '波音国防', layerId: 'military_industry', lng: -122.3, lat: 47.53, note: '西雅图/圣路易斯，F-15/KC-46', impact: 'critical', subKind: 'aero' },
  { id: 'mi-northrop', name: '诺斯罗普·格鲁曼', layerId: 'military_industry', lng: -77.11, lat: 38.92, note: '弗吉尼亚，B-2/B-21 轰炸机', impact: 'critical', subKind: 'aero' },
  { id: 'mi-gd', name: '通用动力', layerId: 'military_industry', lng: -77.1, lat: 38.92, note: '弗吉尼亚，M1 艾布拉姆斯/核潜艇', impact: 'high', subKind: 'naval' },
  { id: 'mi-l3harris', name: 'L3Harris 技术', layerId: 'military_industry', lng: -80.72, lat: 28.08, note: '佛罗里达，通信与电子战', impact: 'high', subKind: 'aero' },
  { id: 'mi-huntington', name: '亨廷顿·英格尔斯', layerId: 'military_industry', lng: -76.43, lat: 36.99, note: '纽波特纽斯，航母/核潜艇建造', impact: 'critical', subKind: 'naval' },
  { id: 'mi-bae', name: 'BAE 系统公司', layerId: 'military_industry', lng: -0.45, lat: 51.51, note: '英国，欧洲最大军工，台风战机', impact: 'critical', subKind: 'aero' },
  { id: 'mi-rolls', name: '罗尔斯·罗伊斯', layerId: 'military_industry', lng: -1.47, lat: 52.91, note: '德比，军用航空发动机', impact: 'high', subKind: 'aero' },
  // ── 欧洲 ──
  { id: 'mi-airbus', name: '空客防务航天', layerId: 'military_industry', lng: 11.0, lat: 48.23, note: '慕尼黑，A400M/欧洲战斗机', impact: 'critical', subKind: 'aero' },
  { id: 'mi-thales', name: '泰雷兹集团', layerId: 'military_industry', lng: 2.29, lat: 48.88, note: '巴黎，雷达/导弹电子', impact: 'high', subKind: 'aero' },
  { id: 'mi-dassault', name: '达索航空', layerId: 'military_industry', lng: 2.35, lat: 48.82, note: '巴黎，阵风战机', impact: 'high', subKind: 'aero' },
  { id: 'mi-saab', name: '萨博集团', layerId: 'military_industry', lng: 17.94, lat: 59.4, note: '瑞典林雪平，JAS-39 鹰狮', impact: 'high', subKind: 'aero' },
  { id: 'mi-leonardo', name: '莱昂纳多公司', layerId: 'military_industry', lng: 12.51, lat: 41.9, note: '罗马，意大利军工龙头', impact: 'high', subKind: 'aero' },
  { id: 'mi-rheinmetall', name: '莱茵金属', layerId: 'military_industry', lng: 6.95, lat: 50.94, note: '杜塞尔多夫，豹 2 坦克/火炮', impact: 'high', subKind: 'arms' },
  { id: 'mi-knds', name: 'KNDS（奈克斯特）', layerId: 'military_industry', lng: 2.21, lat: 48.76, note: '法国，勒克莱尔坦克', impact: 'medium', subKind: 'arms' },
  { id: 'mi-mbda', name: 'MBDA 导弹集团', layerId: 'military_industry', lng: 2.24, lat: 48.77, note: '法/英/意合资，欧洲导弹联营', impact: 'high', subKind: 'arms' },
  // ── 俄罗斯 ──
  { id: 'mi-rsk', name: '苏霍伊/联合航空制造', layerId: 'military_industry', lng: 37.62, lat: 55.75, note: '莫斯科，Su-35/Su-57', impact: 'critical', subKind: 'aero' },
  { id: 'mi-mi', name: '米格/米里直升机', layerId: 'military_industry', lng: 37.62, lat: 55.75, note: '莫斯科，MiG-29/米-17', impact: 'high', subKind: 'aero' },
  { id: 'mi-tupolev', name: '图波列夫', layerId: 'military_industry', lng: 37.62, lat: 55.75, note: '莫斯科，Tu-95/Tu-160 战略轰炸', impact: 'high', subKind: 'aero' },
  { id: 'mi-uralvagon', name: '乌拉尔机车车辆厂', layerId: 'military_industry', lng: 60.47, lat: 57.92, note: '下塔吉尔，T-90 坦克', impact: 'high', subKind: 'arms' },
  { id: 'mi-almaz', name: '金刚石-安泰', layerId: 'military_industry', lng: 37.62, lat: 55.75, note: '莫斯科，S-300/S-400 防空导弹', impact: 'critical', subKind: 'arms' },
  { id: 'mi-tactical', name: '战术导弹武器集团', layerId: 'military_industry', lng: 37.62, lat: 55.75, note: '科罗廖夫，各型战术导弹', impact: 'medium', subKind: 'arms' },
  { id: 'mi-roste', name: '联合造船集团（USC）', layerId: 'military_industry', lng: 30.31, lat: 59.94, note: '圣彼得堡，俄海军造舰总集', impact: 'high', subKind: 'naval' },
  // ── 中国 ──
  { id: 'mi-avic', name: '中国航空工业集团（AVIC）', layerId: 'military_industry', lng: 116.36, lat: 39.92, note: '北京，歼-10/歼-20/运-20', impact: 'critical', subKind: 'aero' },
  { id: 'mi-aero-engine', name: '中国航空发动机集团（AECC）', layerId: 'military_industry', lng: 116.36, lat: 39.92, note: '北京，涡扇/涡轴发动机', impact: 'high', subKind: 'aero' },
  { id: 'mi-casc', name: '中国航天科技集团（CASC）', layerId: 'military_industry', lng: 116.32, lat: 39.93, note: '北京，长征火箭/北斗/东风', impact: 'critical', subKind: 'space' },
  { id: 'mi-casic', name: '中国航天科工集团（CASIC）', layerId: 'military_industry', lng: 116.32, lat: 39.93, note: '北京，东风导弹/鹰击/红旗', impact: 'critical', subKind: 'space' },
  { id: 'mi-norinco', name: '中国兵器工业集团（NORINCO）', layerId: 'military_industry', lng: 116.36, lat: 39.92, note: '北京，99 式坦克/火炮/弹药', impact: 'critical', subKind: 'arms' },
  { id: 'mi-csgc', name: '中国兵器装备集团（CSGC）', layerId: 'military_industry', lng: 116.36, lat: 39.92, note: '北京，轻武器/装甲车', impact: 'high', subKind: 'arms' },
  { id: 'mi-csic', name: '中国船舶集团（CSSC）', layerId: 'military_industry', lng: 121.45, lat: 31.25, note: '上海，航母/驱逐舰/潜艇建造', impact: 'critical', subKind: 'naval' },
  { id: 'mi-nucle', name: '中核工业集团（CNNC）', layerId: 'military_industry', lng: 116.36, lat: 39.92, note: '北京，核材料/核动力', impact: 'high', subKind: 'space' },
  { id: 'mi-cetc', name: '中国电子科技集团（CETC）', layerId: 'military_industry', lng: 116.32, lat: 39.93, note: '北京，雷达/电子战/通信', impact: 'high', subKind: 'aero' },
  // ── 其他亚洲 ──
  { id: 'mi-mitsubishi-h', name: '三菱重工', layerId: 'military_industry', lng: 135.5, lat: 34.69, note: '东京/大阪，F-15J/坦克/潜艇', impact: 'high', subKind: 'aero' },
  { id: 'mi-kawasaki', name: '川崎重工', layerId: 'military_industry', lng: 135.5, lat: 34.69, note: '神户，P-1/C-2/潜艇', impact: 'medium', subKind: 'aero' },
  { id: 'mi-ia', name: '以色列航空航天工业（IAI）', layerId: 'military_industry', lng: 34.89, lat: 32.02, note: '特拉维夫，无人机/导弹', impact: 'high', subKind: 'aero' },
  { id: 'mi-elbit', name: '埃尔比特系统', layerId: 'military_industry', lng: 34.99, lat: 32.81, note: '海法，电子战/光学瞄准', impact: 'high', subKind: 'aero' },
  { id: 'mi- Rafael', name: '拉斐尔先进防御系统', layerId: 'military_industry', lng: 32.92, lat: 35.0, note: '海法，铁穹/长钉导弹', impact: 'high', subKind: 'arms' },
  { id: 'mi-hal', name: '印度斯坦航空（HAL）', layerId: 'military_industry', lng: 77.6, lat: 12.95, note: '班加罗尔，LCA 光辉战机', impact: 'medium', subKind: 'aero' },
  { id: 'mi-tata-advanced', name: '塔塔先进系统', layerId: 'military_industry', lng: 72.88, lat: 19.08, note: '孟买，装甲车/S-400 本地化', impact: 'low', subKind: 'arms' },
  { id: 'mi-kai', name: '韩国航空航天（KAI）', layerId: 'military_industry', lng: 128.39, lat: 35.91, note: '泗川，T-50/FA-50', impact: 'medium', subKind: 'aero' },
  { id: 'mi-hyundai-rot', name: '现代罗特姆', layerId: 'military_industry', lng: 126.98, lat: 37.57, note: '首尔，K2 黑豹坦克', impact: 'medium', subKind: 'arms' },
  { id: 'mi-aselsan', name: '阿瑟尔桑（土耳其）', layerId: 'military_industry', lng: 32.59, lat: 39.97, note: '安卡拉，Bayraktar 无人机电子', impact: 'medium', subKind: 'aero' },
  { id: 'mi-baykar', name: '巴伊卡尔技术', layerId: 'military_industry', lng: 28.98, lat: 41.01, note: '伊斯坦布尔，Bayraktar TB2 无人机', impact: 'high', subKind: 'aero' },
];

/**
 * 超级工程（wonder_projects）— 全球超级工程与基础设施奇迹。
 * subKind 标类型：'bridge'（桥梁）/ 'tunnel'（隧道）/ 'skyscraper'（摩天楼）/ 'megaproject'（巨型基建）。
 * 整理日：2026-06-22。
 */
export const GLOBAL_WONDER_PROJECTS: ThematicPoint[] = [
  // ── 桥梁 ──
  { id: 'wp-hzmb', name: '港珠澳大桥', layerId: 'wonder_projects', lng: 113.84, lat: 22.2, note: '55km 跨海桥隧，世界最长', impact: 'high', subKind: 'bridge' },
  { id: 'wp-hzmb2', name: '杭州湾跨海大桥', layerId: 'wonder_projects', lng: 121.2, lat: 30.3, note: '36km 跨海桥', impact: 'medium', subKind: 'bridge' },
  { id: 'wp-jiaozhou', name: '胶州湾跨海大桥', layerId: 'wonder_projects', lng: 120.3, lat: 36.1, note: '青岛，42km 跨海', impact: 'medium', subKind: 'bridge' },
  { id: 'wp-akashi', name: '明石海峡大桥', layerId: 'wonder_projects', lng: 135.02, lat: 34.62, note: '神户/淡路，世界最长悬索桥主跨', impact: 'high', subKind: 'bridge' },
  { id: 'wp-akashi2', name: '金门大桥', layerId: 'wonder_projects', lng: -122.48, lat: 37.82, note: '旧金山，美西地标', impact: 'medium', subKind: 'bridge' },
  { id: 'wp-millau', name: '米约高架桥', layerId: 'wonder_projects', lng: 3.02, lat: 44.08, note: '法国，世界最高桥塔', impact: 'high', subKind: 'bridge' },
  { id: 'wp-çanakkale', name: '恰纳卡莱大桥', layerId: 'wonder_projects', lng: 26.4, lat: 40.3, note: '土耳其，2022 世界最长主跨悬索桥', impact: 'high', subKind: 'bridge' },
  { id: 'wp-russky', name: '俄罗斯岛大桥', layerId: 'wonder_projects', lng: 131.95, lat: 43.0, note: '符拉迪沃斯托克，世界最长斜拉桥之一', impact: 'medium', subKind: 'bridge' },
  { id: 'wp-runyang', name: '润扬长江大桥', layerId: 'wonder_projects', lng: 119.42, lat: 32.25, note: '镇江，悬索桥', impact: 'low', subKind: 'bridge' },
  { id: 'wp-sutong', name: '苏通长江大桥', layerId: 'wonder_projects', lng: 120.97, lat: 31.78, note: '南通，曾最长斜拉桥', impact: 'low', subKind: 'bridge' },
  { id: 'wp-osman', name: '奥斯曼加齐大桥', layerId: 'wonder_projects', lng: 29.4, lat: 40.7, note: '土耳其伊兹密特湾，第四长悬索桥', impact: 'medium', subKind: 'bridge' },
  { id: 'wp-hardanger', name: '哈当厄尔大桥', layerId: 'wonder_projects', lng: 6.66, lat: 60.27, note: '挪威，北欧最长悬索桥', impact: 'low', subKind: 'bridge' },
  // ── 隧道 ──
  { id: 'wp-gotthard', name: '圣哥达基线隧道', layerId: 'wonder_projects', lng: 8.6, lat: 46.55, note: '瑞士，57km 世界最长铁路隧道', impact: 'critical', subKind: 'tunnel' },
  { id: 'wp-seikan', name: '青函隧道', layerId: 'wonder_projects', lng: 140.33, lat: 41.6, note: '日本，53.9km 海底铁路隧道', impact: 'high', subKind: 'tunnel' },
  { id: 'wp-eurotunnel', name: '英法海底隧道', layerId: 'wonder_projects', lng: 1.26, lat: 51.09, note: '50km 海底铁路，1994 通车', impact: 'critical', subKind: 'tunnel' },
  { id: 'wp-eurotunnel2', name: '港珠澳海底隧道', layerId: 'wonder_projects', lng: 113.84, lat: 22.2, note: '6.7km 沉管隧道（合并）', impact: 'medium', subKind: 'tunnel' },
  { id: 'wp-taihang', name: '太行山隧道群', layerId: 'wonder_projects', lng: 113.5, lat: 35.5, note: '河南/山西，高铁穿山隧道群', impact: 'medium', subKind: 'tunnel' },
  { id: 'wp-marmaray', name: '马尔马雷隧道', layerId: 'wonder_projects', lng: 28.98, lat: 41.01, note: '伊斯坦布尔，欧亚海底铁路', impact: 'high', subKind: 'tunnel' },
  { id: 'wp-brenner-base', name: '布伦纳基线隧道', layerId: 'wonder_projects', lng: 11.4, lat: 47.0, note: '意奥，55km 在建', impact: 'medium', subKind: 'tunnel' },
  { id: 'wp-lerdal', name: '莱达尔隧道', layerId: 'wonder_projects', lng: 7.5, lat: 61.0, note: '挪威，24.5km 世界最长公路隧道', impact: 'medium', subKind: 'tunnel' },
  { id: 'wp-mont-blanc', name: '勃朗峰隧道', layerId: 'wonder_projects', lng: 6.86, lat: 45.83, note: '法意，11.6km 阿尔卑斯公路隧道', impact: 'medium', subKind: 'tunnel' },
  // ── 摩天楼 ──
  { id: 'wp-burj-khalifa', name: '哈利法塔', layerId: 'wonder_projects', lng: 55.27, lat: 25.2, note: '迪拜，828m 世界最高', impact: 'critical', subKind: 'skyscraper' },
  { id: 'wp-merdeka', name: '默迪卡 118', layerId: 'wonder_projects', lng: 101.7, lat: 3.14, note: '吉隆坡，679m 世界第二高', impact: 'high', subKind: 'skyscraper' },
  { id: 'wp-shanghai-tower', name: '上海中心大厦', layerId: 'wonder_projects', lng: 121.5, lat: 31.24, note: '陆家嘴，632m 中国最高', impact: 'high', subKind: 'skyscraper' },
  { id: 'wp-abraj', name: '麦加皇家钟塔', layerId: 'wonder_projects', lng: 39.83, lat: 21.42, note: '601m，沙特', impact: 'medium', subKind: 'skyscraper' },
  { id: 'wp-pingan', name: '平安金融中心', layerId: 'wonder_projects', lng: 114.06, lat: 22.54, note: '深圳，599m', impact: 'medium', subKind: 'skyscraper' },
  { id: 'wp-gold', name: '乐天世界塔', layerId: 'wonder_projects', lng: 127.1, lat: 37.51, note: '首尔，555m', impact: 'medium', subKind: 'skyscraper' },
  { id: 'wp-one-wtc', name: '世贸中心一号楼', layerId: 'wonder_projects', lng: -74.01, lat: 40.71, note: '纽约，541m', impact: 'high', subKind: 'skyscraper' },
  { id: 'wp-canton', name: '广州塔', layerId: 'wonder_projects', lng: 113.32, lat: 23.11, note: '600m 桅杆，广州地标', impact: 'medium', subKind: 'skyscraper' },
  { id: 'wp-taipei101', name: '台北 101', layerId: 'wonder_projects', lng: 121.56, lat: 25.03, note: '508m，曾世界第一', impact: 'medium', subKind: 'skyscraper' },
  { id: 'wp-petronas', name: '双子塔', layerId: 'wonder_projects', lng: 101.71, lat: 3.16, note: '吉隆坡，452m，曾世界第一', impact: 'medium', subKind: 'skyscraper' },
  { id: 'wp-burj-al-arab', name: '帆船酒店', layerId: 'wonder_projects', lng: 55.14, lat: 25.14, note: '迪拜，321m 七星级', impact: 'low', subKind: 'skyscraper' },
  { id: 'wp-shard', name: '碎片大厦', layerId: 'wonder_projects', lng: -0.09, lat: 51.5, note: '伦敦，310m 西欧最高', impact: 'low', subKind: 'skyscraper' },
  // ── 巨型基建 ──
  { id: 'wp-three-gorges-wp', name: '三峡工程', layerId: 'wonder_projects', lng: 111.0, lat: 30.82, note: '世界最大水利枢纽', impact: 'critical', subKind: 'megaproject' },
  { id: 'wp-south-north', name: '南水北调', layerId: 'wonder_projects', lng: 116.36, lat: 39.92, note: '东中西三线调水，世界最大调水工程', impact: 'critical', subKind: 'megaproject' },
  { id: 'wp-west-east-gas', name: '西气东输', layerId: 'wonder_projects', lng: 116.36, lat: 39.92, note: '新疆-上海天然气管道网', impact: 'high', subKind: 'megaproject' },
  { id: 'wp-high-speed', name: '中国高铁网络', layerId: 'wonder_projects', lng: 116.36, lat: 39.92, note: '4.5 万 km，世界最大高铁网', impact: 'critical', subKind: 'megaproject' },
  { id: 'wp-itapu-wp', name: '伊泰普水电站', layerId: 'wonder_projects', lng: -54.59, lat: -25.41, note: '巴/巴，世界第二大水电', impact: 'high', subKind: 'megaproject' },
  { id: 'wp-panama-canal', name: '巴拿马运河扩建', layerId: 'wonder_projects', lng: -79.9, lat: 9.36, note: '2016 新船闸，第三套船闸', impact: 'critical', subKind: 'megaproject' },
  { id: 'wp-suez-canal', name: '苏伊士运河新航道', layerId: 'wonder_projects', lng: 32.29, lat: 31.26, note: '2015 平行航道扩建', impact: 'critical', subKind: 'megaproject' },
  { id: 'wp-palm', name: '棕榈岛', layerId: 'wonder_projects', lng: 55.13, lat: 25.12, note: '迪拜人工岛，世界最大填海', impact: 'medium', subKind: 'megaproject' },
  { id: 'wp-neom', name: 'NEOM 新城', layerId: 'wonder_projects', lng: 35.5, lat: 28.0, note: '沙特，The Line 线性城市', impact: 'high', subKind: 'megaproject' },
  { id: 'wp-belt-road', name: '雅万高铁', layerId: 'wonder_projects', lng: 106.85, lat: -6.21, note: '东南亚首条高铁，中国出海项目', impact: 'high', subKind: 'megaproject' },
  { id: 'wp-mambilla', name: '蒙贝拉水电站', layerId: 'wonder_projects', lng: 10.5, lat: 7.0, note: '尼日利亚，中国援建，3GW 规划', impact: 'medium', subKind: 'megaproject' },
  { id: 'wp-canal-2', name: '克拉地峡运河（构想）', layerId: 'wonder_projects', lng: 100.0, lat: 10.0, note: '泰国，绕马六甲构想工程', impact: 'low', subKind: 'megaproject' },
];

/**
 * 农业产区（agriculture）— 全球主要农业产区与粮仓。
 * subKind 标类型：'grain'（粮食产区）/ 'cash'（经济作物）/ 'livestock'（畜牧产区）。
 * 整理日：2026-06-22。
 */
export const GLOBAL_AGRICULTURE: ThematicPoint[] = [
  // ── 粮食产区 ──
  { id: 'ag-midwest', name: '美国中西部玉米带', layerId: 'agriculture', lng: -93.0, lat: 41.5, note: '爱荷华/伊利诺伊，全球最大玉米/大豆产区', impact: 'critical', subKind: 'grain' },
  { id: 'ag-pampas', name: '阿根廷潘帕斯', layerId: 'agriculture', lng: -62.0, lat: -35.0, note: '南美粮仓，大豆/玉米/牛肉', impact: 'critical', subKind: 'grain' },
  { id: 'ag-cerrado', name: '巴西塞拉多', layerId: 'agriculture', lng: -49.0, lat: -14.0, note: '热带稀树草原，大豆主产区', impact: 'critical', subKind: 'grain' },
  { id: 'ag-mato', name: '马托格罗索', layerId: 'agriculture', lng: -56.0, lat: -14.0, note: '巴西头号大豆州', impact: 'high', subKind: 'grain' },
  { id: 'ag-prairie', name: '加拿大草原三省', layerId: 'agriculture', lng: -105.0, lat: 52.0, note: '萨省/阿尔伯塔/曼省，小麦/油菜籽', impact: 'high', subKind: 'grain' },
  { id: 'ag-ukraine', name: '乌克兰黑土带', layerId: 'agriculture', lng: 32.0, lat: 49.0, note: '欧洲粮仓，小麦/玉米/葵花', impact: 'critical', subKind: 'grain' },
  { id: 'ag-russia-south', name: '俄南/哈萨克草原', layerId: 'agriculture', lng: 50.0, lat: 51.0, note: '伏尔加/库班/北哈，小麦主产区', impact: 'critical', subKind: 'grain' },
  { id: 'ag-northeast', name: '中国东北黑土地', layerId: 'agriculture', lng: 126.0, lat: 45.0, note: '黑龙江/吉林，大豆/玉米', impact: 'critical', subKind: 'grain' },
  { id: 'ag-north-china', name: '华北平原', layerId: 'agriculture', lng: 115.0, lat: 36.0, note: '小麦/玉米主产区', impact: 'high', subKind: 'grain' },
  { id: 'ag-yangtze', name: '长江中下游平原', layerId: 'agriculture', lng: 114.0, lat: 30.0, note: '水稻主产区，鱼米之乡', impact: 'high', subKind: 'grain' },
  { id: 'ag-indo-gangetic', name: '印度-恒河平原', layerId: 'agriculture', lng: 82.0, lat: 26.0, note: '印度水稻/小麦主产区', impact: 'critical', subKind: 'grain' },
  { id: 'ag-punjab-india', name: '印度旁遮普', layerId: 'agriculture', lng: 75.5, lat: 31.0, note: '印度小麦/水稻粮仓', impact: 'high', subKind: 'grain' },
  { id: 'ag-punjab-pak', name: '巴基斯坦旁遮普', layerId: 'agriculture', lng: 73.0, lat: 31.5, note: '巴基斯坦小麦/水稻主产区', impact: 'high', subKind: 'grain' },
  { id: 'ag-mekong', name: '湄公河三角洲', layerId: 'agriculture', lng: 105.5, lat: 10.0, note: '越南稻米出口主产区', impact: 'high', subKind: 'grain' },
  { id: 'ag-thailand', name: '泰中平原', layerId: 'agriculture', lng: 100.5, lat: 15.5, note: '暹罗大米出口核心', impact: 'medium', subKind: 'grain' },
  { id: 'ag-murray', name: '墨累-达令盆地', layerId: 'agriculture', lng: 143.0, lat: -34.0, note: '澳洲小麦/葡萄酒主产区', impact: 'high', subKind: 'grain' },
  { id: 'ag-nile', name: '尼罗河谷与三角洲', layerId: 'agriculture', lng: 31.0, lat: 26.0, note: '埃及农业命脉，棉花/水稻', impact: 'high', subKind: 'grain' },
  // ── 经济作物 ──
  { id: 'ag-coffee-brazil', name: '巴西咖啡带', layerId: 'agriculture', lng: -45.0, lat: -20.0, note: '米纳斯吉拉斯/圣保罗，全球最大咖啡产', impact: 'critical', subKind: 'cash' },
  { id: 'ag-coffee-vietnam', name: '越南中部高原', layerId: 'agriculture', lng: 108.0, lat: 12.5, note: '世界第二咖啡产，罗布斯塔', impact: 'high', subKind: 'cash' },
  { id: 'ag-coffee-ethiopia', name: '埃塞俄比亚咖啡带', layerId: 'agriculture', lng: 38.0, lat: 7.0, note: '咖啡发源地，阿拉比卡', impact: 'medium', subKind: 'cash' },
  { id: 'ag-coffee-colombia', name: '哥伦比亚咖啡三角', layerId: 'agriculture', lng: -75.5, lat: 5.0, note: '安第斯东坡，温和阿拉比卡', impact: 'high', subKind: 'cash' },
  { id: 'ag-cocoa', name: '科特迪瓦/加纳可可带', layerId: 'agriculture', lng: -5.0, lat: 6.5, note: '全球约 60% 可可供应', impact: 'critical', subKind: 'cash' },
  { id: 'ag-rubber', name: '东南亚橡胶带', layerId: 'agriculture', lng: 101.5, lat: 3.5, note: '泰/马/印尼，天然橡胶主产', impact: 'high', subKind: 'cash' },
  { id: 'ag-tea-china', name: '中国江南茶区', layerId: 'agriculture', lng: 119.0, lat: 28.0, note: '龙井/普洱/乌龙产区', impact: 'medium', subKind: 'cash' },
  { id: 'ag-tea-india', name: '印度阿萨姆/大吉岭', layerId: 'agriculture', lng: 88.0, lat: 27.0, note: '红茶主产区', impact: 'medium', subKind: 'cash' },
  { id: 'ag-cotton', name: '中亚棉花带', layerId: 'agriculture', lng: 64.0, lat: 40.0, note: '乌兹别克/新疆，棉花主产区', impact: 'high', subKind: 'cash' },
  { id: 'ag-cotton-xinjiang', name: '新疆棉区', layerId: 'agriculture', lng: 84.0, lat: 41.5, note: '中国最大棉花产区', impact: 'high', subKind: 'cash' },
  { id: 'ag-palm', name: '印尼/马来棕榈油带', layerId: 'agriculture', lng: 102.0, lat: 0.0, note: '苏门答腊/婆罗洲，全球棕榈油主产', impact: 'critical', subKind: 'cash' },
  { id: 'ag-sugar', name: '巴西甘蔗带', layerId: 'agriculture', lng: -48.0, lat: -21.0, note: '圣保罗州，糖与乙醇', impact: 'high', subKind: 'cash' },
  { id: 'ag-wine-bordeaux', name: '波尔多葡萄园', layerId: 'agriculture', lng: -0.58, lat: 44.86, note: '法国，世界级葡萄酒产区', impact: 'medium', subKind: 'cash' },
  { id: 'ag-wine-napa', name: '纳帕谷', layerId: 'agriculture', lng: -122.29, lat: 38.3, note: '加州，美国顶级葡萄酒产区', impact: 'medium', subKind: 'cash' },
  { id: 'ag-banana', name: '厄瓜多尔香蕉带', layerId: 'agriculture', lng: -79.5, lat: -1.0, note: '全球最大香蕉出口国', impact: 'medium', subKind: 'cash' },
  { id: 'ag-opium', name: '金三角', layerId: 'agriculture', lng: 100.0, lat: 21.0, note: '缅老泰交界，鸦片/合成毒品产区', impact: 'high', subKind: 'cash' },
  // ── 畜牧 ──
  { id: 'ag-pampas-cattle', name: '潘帕斯肉牛带', layerId: 'agriculture', lng: -62.0, lat: -36.0, note: '阿根廷，世界顶级牛肉', impact: 'high', subKind: 'livestock' },
  { id: 'ag-outback', name: '澳洲牧牛/羊带', layerId: 'agriculture', lng: 135.0, lat: -25.0, note: '昆士兰/北领地，肉牛', impact: 'high', subKind: 'livestock' },
  { id: 'ag-mongolia', name: '蒙古高原牧场', layerId: 'agriculture', lng: 105.0, lat: 47.0, note: '蒙古，羊/马/骆驼游牧', impact: 'medium', subKind: 'livestock' },
  { id: 'ag-new-zealand', name: '新西兰牧场', layerId: 'agriculture', lng: 174.0, lat: -40.0, note: '羊肉/乳制品出口大国', impact: 'high', subKind: 'livestock' },
  { id: 'ag-sahel', name: '萨赫勒游牧带', layerId: 'agriculture', lng: 5.0, lat: 14.0, note: '非洲撒哈拉南缘，牛/羊/骆驼', impact: 'medium', subKind: 'livestock' },
  { id: 'ag-us-plains', name: '美国大平原牧牛带', layerId: 'agriculture', lng: -100.0, lat: 40.0, note: '得州/堪萨斯/内布拉斯加，肉牛', impact: 'high', subKind: 'livestock' },
];

/**
 * 宗教圣地（religions）— 全球主要宗教圣地与朝圣中心。
 * subKind 标宗教：'christian'（基督教）/ 'islam'（伊斯兰）/ 'buddhist'（佛教）/ 'hindu'（印度教）/ 'jewish'（犹太教）。
 * 整理日：2026-06-22。
 */
export const GLOBAL_RELIGIONS: ThematicPoint[] = [
  // ── 基督教 ──
  { id: 'rel-vatican', name: '梵蒂冈', layerId: 'religions', lng: 12.45, lat: 41.9, note: '天主教会中心，圣彼得大教堂', impact: 'critical', subKind: 'christian' },
  { id: 'rel-jerusalem-christ', name: '圣墓教堂（耶路撒冷）', layerId: 'religions', lng: 35.26, lat: 31.78, note: '耶稣受难与复活地', impact: 'critical', subKind: 'christian' },
  { id: 'rel-bethlehem', name: '伯利恒圣诞教堂', layerId: 'religions', lng: 35.2, lat: 31.7, note: '耶稣诞生地', impact: 'high', subKind: 'christian' },
  { id: 'rel-santiago', name: '圣地亚哥-德孔波斯特拉', layerId: 'religions', lng: -8.54, lat: 42.88, note: '西班牙，圣雅各朝圣路终点', impact: 'high', subKind: 'christian' },
  { id: 'rel-fatima', name: '法蒂玛', layerId: 'religions', lng: -8.65, lat: 39.62, note: '葡萄牙，圣母显现圣地', impact: 'medium', subKind: 'christian' },
  { id: 'rel-lourdes', name: '卢尔德', layerId: 'religions', lng: 0.05, lat: 43.1, note: '法国，圣母朝圣地', impact: 'medium', subKind: 'christian' },
  { id: 'rel-canterbury', name: '坎特伯雷大教堂', layerId: 'religions', lng: 1.08, lat: 51.28, note: '英国，圣公会精神中心', impact: 'medium', subKind: 'christian' },
  { id: 'rel-kiev-pochayiv', name: '基辅佩乔尔斯克修道院', layerId: 'religions', lng: 30.55, lat: 50.43, note: '乌克兰，东正教圣地', impact: 'medium', subKind: 'christian' },
  { id: 'rel-mount-athos', name: '阿索斯山', layerId: 'religions', lng: 24.13, lat: 40.16, note: '希腊，东正教修道院共和国', impact: 'high', subKind: 'christian' },
  { id: 'rel-stpetersburg', name: '喀山大教堂（圣彼得堡）', layerId: 'religions', lng: 30.32, lat: 59.94, note: '俄罗斯东正教', impact: 'medium', subKind: 'christian' },
  // ── 伊斯兰教 ──
  { id: 'rel-mecca', name: '麦加禁寺', layerId: 'religions', lng: 39.83, lat: 21.39, note: '克尔白所在地，穆斯林朝觐方向', impact: 'critical', subKind: 'islam' },
  { id: 'rel-medina', name: '麦地那先知清真寺', layerId: 'religions', lng: 39.61, lat: 24.47, note: '穆罕默德陵墓所在地', impact: 'critical', subKind: 'islam' },
  { id: 'rel-jerusalem-islam', name: '圆顶清真寺/阿克萨', layerId: 'religions', lng: 35.24, lat: 31.78, note: '耶路撒冷，伊斯兰第三圣地', impact: 'critical', subKind: 'islam' },
  { id: 'rel-najaf', name: '纳杰夫伊玛目阿里圣陵', layerId: 'religions', lng: 44.33, lat: 32.0, note: '伊拉克，什叶派第一圣地', impact: 'critical', subKind: 'islam' },
  { id: 'rel-karbala', name: '卡尔巴拉伊玛目侯赛因圣陵', layerId: 'religions', lng: 44.02, lat: 32.62, note: '伊拉克，什叶派朝圣核心', impact: 'critical', subKind: 'islam' },
  { id: 'rel-qom', name: '库姆', layerId: 'religions', lng: 50.88, lat: 34.64, note: '伊朗，什叶派学术中心', impact: 'high', subKind: 'islam' },
  { id: 'rel-mashhad', name: '马什哈德伊玛目礼萨圣陵', layerId: 'religions', lng: 59.61, lat: 36.3, note: '伊朗，第八伊玛目陵', impact: 'high', subKind: 'islam' },
  { id: 'rel-cordoba-mosque', name: '科尔多瓦大清真寺', layerId: 'religions', lng: -4.78, lat: 37.88, note: '西班牙，安达卢西亚伊斯兰遗产', impact: 'medium', subKind: 'islam' },
  // ── 佛教 ──
  { id: 'rel-bodh-gaya', name: '菩提伽耶', layerId: 'religions', lng: 84.99, lat: 24.7, note: '印度比哈尔，佛陀悟道地', impact: 'critical', subKind: 'buddhist' },
  { id: 'rel-lumbini', name: '蓝毗尼', layerId: 'religions', lng: 83.28, lat: 27.47, note: '尼泊尔，佛陀诞生地', impact: 'critical', subKind: 'buddhist' },
  { id: 'rel-sarnath', name: '鹿野苑', layerId: 'religions', lng: 83.02, lat: 25.38, note: '印度瓦拉纳西，初转法轮地', impact: 'high', subKind: 'buddhist' },
  { id: 'rel-kusinara', name: '拘尸那罗', layerId: 'religions', lng: 83.89, lat: 26.74, note: '印度，佛陀涅槃地', impact: 'high', subKind: 'buddhist' },
  { id: 'rel-wutai', name: '五台山', layerId: 'religions', lng: 113.58, lat: 39.03, note: '山西，文殊菩萨道场', impact: 'high', subKind: 'buddhist' },
  { id: 'rel-emei', name: '峨眉山', layerId: 'religions', lng: 103.34, lat: 29.6, note: '四川，普贤菩萨道场', impact: 'high', subKind: 'buddhist' },
  { id: 'rel-putuo', name: '普陀山', layerId: 'religions', lng: 122.37, lat: 30.0, note: '浙江，观音菩萨道场', impact: 'high', subKind: 'buddhist' },
  { id: 'rel-jiuhua', name: '九华山', layerId: 'religions', lng: 117.8, lat: 30.5, note: '安徽，地藏菩萨道场', impact: 'medium', subKind: 'buddhist' },
  { id: 'rel-lhasa', name: '布达拉宫/大昭寺', layerId: 'religions', lng: 91.12, lat: 29.65, note: '拉萨，藏传佛教中心', impact: 'critical', subKind: 'buddhist' },
  { id: 'rel-borobudur-rel', name: '婆罗浮屠', layerId: 'religions', lng: 110.2, lat: -7.61, note: '印尼，世界最大佛塔', impact: 'high', subKind: 'buddhist' },
  { id: 'rel-shwedagon', name: '仰光大金塔', layerId: 'religions', lng: 96.15, lat: 16.8, note: '缅甸，供奉佛发舍利', impact: 'high', subKind: 'buddhist' },
  // ── 印度教 ──
  { id: 'rel-varanasi', name: '瓦拉纳西', layerId: 'religions', lng: 83.01, lat: 25.32, note: '恒河边，印度教最圣之城', impact: 'critical', subKind: 'hindu' },
  { id: 'rel-haridwar', name: '赫尔德瓦尔', layerId: 'religions', lng: 78.17, lat: 29.95, note: '恒河出山口，大壶节举办地之一', impact: 'high', subKind: 'hindu' },
  { id: 'rel-allahabad', name: '普拉亚格拉杰（阿拉哈巴德）', layerId: 'religions', lng: 81.85, lat: 25.45, note: '三河汇流，大壶节主会场', impact: 'high', subKind: 'hindu' },
  { id: 'rel-tirupati', name: '蒂鲁帕蒂', layerId: 'religions', lng: 79.42, lat: 13.63, note: '安得拉，巴尔吉神庙，最富印度教神庙', impact: 'high', subKind: 'hindu' },
  { id: 'rel-rameswaram', name: '拉梅斯瓦拉姆', layerId: 'religions', lng: 79.31, lat: 9.29, note: '泰米尔纳德，罗摩桥起点', impact: 'medium', subKind: 'hindu' },
  { id: 'rel-pashupati', name: '帕舒帕蒂纳特', layerId: 'religions', lng: 85.35, lat: 27.71, note: '加德满都，湿婆圣地', impact: 'medium', subKind: 'hindu' },
  // ── 犹太教 ──
  { id: 'rel-western-wall', name: '西墙（哭墙）', layerId: 'religions', lng: 35.23, lat: 31.78, note: '耶路撒冷，第二圣殿遗存', impact: 'critical', subKind: 'jewish' },
  { id: 'rel-tomb-patriarchs', name: '列祖之墓（希伯伦）', layerId: 'religions', lng: 35.17, lat: 31.52, note: '亚伯拉罕/以撒/雅各墓，犹太/伊斯兰共有圣地', impact: 'high', subKind: 'jewish' },
  { id: 'rel-safed', name: '采法特', layerId: 'religions', lng: 35.5, lat: 32.97, note: '上加利利，卡巴拉神秘主义中心', impact: 'medium', subKind: 'jewish' },
  { id: 'rel-tiberias', name: '太巴列', layerId: 'religions', lng: 35.53, lat: 32.79, note: '加利利海，犹太教四大圣城之一', impact: 'medium', subKind: 'jewish' },
];

/**
 * 体育场馆（stadiums）— 全球主要体育场馆。
 * subKind 标类型：'football'（足球场）/ 'olympic'（奥运主场）/ 'american'（美式橄榄球）。
 * 整理日：2026-06-22。
 */
export const GLOBAL_STADIUMS: ThematicPoint[] = [
  // ── 足球场 ──
  { id: 'st-camp-nou', name: '诺坎普球场', layerId: 'stadiums', lng: 2.12, lat: 41.38, note: '巴塞罗那，欧洲最大足球场（9.9 万）', impact: 'high', subKind: 'football' },
  { id: 'st-bernabeu', name: '伯纳乌球场', layerId: 'stadiums', lng: -3.69, lat: 40.45, note: '皇家马德里主场', impact: 'high', subKind: 'football' },
  { id: 'st-wembley', name: '温布利球场', layerId: 'stadiums', lng: -0.28, lat: 51.56, note: '伦敦，英格兰国家队主场（9 万）', impact: 'high', subKind: 'football' },
  { id: 'st-old-trafford', name: '老特拉福德', layerId: 'stadiums', lng: -2.29, lat: 53.46, note: '曼彻斯特联主场', impact: 'medium', subKind: 'football' },
  { id: 'st-maracana', name: '马拉卡纳', layerId: 'stadiums', lng: -43.23, lat: -22.91, note: '里约，1950/2014 世界杯决赛', impact: 'critical', subKind: 'football' },
  { id: 'st-mineirao', name: '米内罗球场', layerId: 'stadiums', lng: -43.97, lat: -19.87, note: '贝洛奥里藏特，2014 半决赛', impact: 'medium', subKind: 'football' },
  { id: 'st-azteca', name: '阿兹特克球场', layerId: 'stadiums', lng: -99.15, lat: 19.3, note: '墨西哥城，1970/1986 世界杯决赛', impact: 'critical', subKind: 'football' },
  { id: 'st-bombonera', name: '糖果盒球场', layerId: 'stadiums', lng: -58.36, lat: -34.64, note: '布宜诺斯艾利斯，博卡青年', impact: 'medium', subKind: 'football' },
  { id: 'st-san-siro', name: '圣西罗/梅阿查', layerId: 'stadiums', lng: 9.12, lat: 45.48, note: '米兰，AC/国米共用', impact: 'medium', subKind: 'football' },
  { id: 'st-allianz', name: '安联球场', layerId: 'stadiums', lng: 11.62, lat: 48.22, note: '慕尼黑，拜仁主场', impact: 'medium', subKind: 'football' },
  { id: 'st-lusail', name: '卢赛尔体育场', layerId: 'stadiums', lng: 51.5, lat: 25.42, note: '卡塔尔，2022 世界杯决赛', impact: 'high', subKind: 'football' },
  { id: 'st-birds-nest', name: '鸟巢（国家体育场）', layerId: 'stadiums', lng: 116.39, lat: 39.99, note: '北京，2008 奥运主场', impact: 'critical', subKind: 'olympic' },
  { id: 'st-tokyo-new', name: '新国立竞技场', layerId: 'stadiums', lng: 139.72, lat: 35.67, note: '东京，2020 奥运主场（隈研吾）', impact: 'high', subKind: 'olympic' },
  { id: 'st-workers', name: '工人体育场', layerId: 'stadiums', lng: 116.45, lat: 39.93, note: '北京，国安主场', impact: 'low', subKind: 'football' },
  { id: 'st-berlin-olympic', name: '柏林奥林匹克体育场', layerId: 'stadiums', lng: 13.24, lat: 52.51, note: '1936 奥运/2006 世界杯决赛', impact: 'high', subKind: 'olympic' },
  { id: 'st-stade-de-france', name: '法兰西体育场', layerId: 'stadiums', lng: 2.36, lat: 48.92, note: '巴黎郊外，1998/2016 决赛', impact: 'high', subKind: 'olympic' },
  // ── 美式橄榄球/综合 ──
  { id: 'st-metlife', name: '大都会人寿体育场', layerId: 'stadiums', lng: -74.07, lat: 40.81, note: '新泽西，巨人/喷气机共用', impact: 'high', subKind: 'american' },
  { id: 'st-lambeau', name: '兰博球场', layerId: 'stadiums', lng: -88.06, lat: 44.5, note: '绿湾包装工，最古老 NFL 球场', impact: 'medium', subKind: 'american' },
  { id: 'st-sofi', name: 'SoFi 体育场', layerId: 'stadiums', lng: -118.34, lat: 33.95, note: '洛杉矶，公羊/闪电，2022 超级碗', impact: 'high', subKind: 'american' },
  { id: 'st-att', name: 'AT&T 体育场', layerId: 'stadiums', lng: -97.09, lat: 32.75, note: '阿灵顿，达拉斯牛仔', impact: 'medium', subKind: 'american' },
  { id: 'st-rose-bowl', name: '玫瑰碗', layerId: 'stadiums', lng: -118.17, lat: 34.16, note: '帕萨迪纳，1994 世界杯决赛', impact: 'high', subKind: 'american' },
  // ── 其他奥运/综合 ──
  { id: 'st-london-olympic', name: '伦敦奥林匹克体育场', layerId: 'stadiums', lng: -0.02, lat: 51.54, note: '2012 奥运主场，现西汉姆主场', impact: 'high', subKind: 'olympic' },
  { id: 'st-los-angeles', name: '洛杉矶纪念体育场', layerId: 'stadiums', lng: -118.29, lat: 34.01, note: '1932/1984 奥运主场', impact: 'medium', subKind: 'olympic' },
  { id: 'st-rod-laver', name: '罗德·拉沃尔球场', layerId: 'stadiums', lng: 144.98, lat: -37.82, note: '墨尔本，澳网主球场', impact: 'medium', subKind: 'olympic' },
  { id: 'st-wimbledon', name: '温布尔登中心球场', layerId: 'stadiums', lng: -0.21, lat: 51.43, note: '伦敦，网球大满贯圣地', impact: 'high', subKind: 'olympic' },
  { id: 'st-roland-garros', name: '罗兰·加洛斯', layerId: 'stadiums', lng: 2.25, lat: 48.85, note: '巴黎，法网主球场', impact: 'medium', subKind: 'olympic' },
  { id: 'st-indian-wells', name: '印第安维尔斯', layerId: 'stadiums', lng: -116.31, lat: 33.72, note: '加州，网球第五大满贯', impact: 'low', subKind: 'olympic' },
  { id: 'st-melbourne-cricket', name: 'MCG 墨尔本板球场', layerId: 'stadiums', lng: 144.98, lat: -37.82, note: '澳洲，1956 奥运/板球圣地（10 万）', impact: 'high', subKind: 'olympic' },
  { id: 'st-lord', name: '罗德板球场', layerId: 'stadiums', lng: -0.17, lat: 51.53, note: '伦敦，板球之家', impact: 'medium', subKind: 'olympic' },
  { id: 'st-ed-en', name: '艾德·加登', layerId: 'stadiums', lng: 18.08, lat: 59.37, note: '斯德哥尔摩，1912 奥运主场', impact: 'low', subKind: 'olympic' },
];

/**
 * 博物馆（museums）— 全球主要博物馆与文化机构。
 * subKind 标类型：'art'（艺术）/ 'history'（历史/综合）/ 'science'（科学/自然）。
 * 整理日：2026-06-22。
 */
export const GLOBAL_MUSEUMS: ThematicPoint[] = [
  // ── 艺术 ──
  { id: 'mus-louvre', name: '卢浮宫', layerId: 'museums', lng: 2.34, lat: 48.86, note: '巴黎，世界最大艺术博物馆', impact: 'critical', subKind: 'art' },
  { id: 'mus-met', name: '大都会艺术博物馆', layerId: 'museums', lng: -73.96, lat: 40.78, note: '纽约，西半球最大', impact: 'critical', subKind: 'art' },
  { id: 'mus-moma', name: '现代艺术博物馆（MoMA）', layerId: 'museums', lng: -73.98, lat: 40.76, note: '纽约，现代艺术殿堂', impact: 'high', subKind: 'art' },
  { id: 'mus-british', name: '大英博物馆', layerId: 'museums', lng: -0.13, lat: 51.52, note: '伦敦，罗塞塔石碑/帕特农雕', impact: 'critical', subKind: 'history' },
  { id: 'mus-national', name: '英国国家美术馆', layerId: 'museums', lng: -0.13, lat: 51.51, note: '伦敦特拉法加广场', impact: 'high', subKind: 'art' },
  { id: 'mus-tate', name: '泰特现代美术馆', layerId: 'museums', lng: -0.1, lat: 51.51, note: '伦敦，当代艺术', impact: 'high', subKind: 'art' },
  { id: 'mus-uffizi', name: '乌菲兹美术馆', layerId: 'museums', lng: 11.26, lat: 43.77, note: '佛罗伦萨，文艺复兴杰作', impact: 'high', subKind: 'art' },
  { id: 'mus-prado', name: '普拉多博物馆', layerId: 'museums', lng: -3.69, lat: 40.41, note: '马德里，戈雅/委拉斯凯兹', impact: 'high', subKind: 'art' },
  { id: 'mus-hermitage', name: '艾尔米塔什博物馆', layerId: 'museums', lng: 30.31, lat: 59.94, note: '圣彼得堡，冬宫', impact: 'critical', subKind: 'art' },
  { id: 'mus-van-gogh', name: '梵高博物馆', layerId: 'museums', lng: 4.88, lat: 52.36, note: '阿姆斯特丹', impact: 'medium', subKind: 'art' },
  { id: 'mus-rijks', name: '荷兰国家博物馆', layerId: 'museums', lng: 4.89, lat: 52.36, note: '阿姆斯特丹，夜巡', impact: 'high', subKind: 'art' },
  { id: 'mus-musee-orsay', name: '奥赛博物馆', layerId: 'museums', lng: 2.33, lat: 48.86, note: '巴黎，印象派殿堂', impact: 'high', subKind: 'art' },
  { id: 'mus-pompidou', name: '蓬皮杜中心', layerId: 'museums', lng: 2.35, lat: 48.86, note: '巴黎，现代/当代艺术', impact: 'medium', subKind: 'art' },
  { id: 'mus-guggenheim', name: '古根海姆博物馆', layerId: 'museums', lng: -2.93, lat: 43.27, note: '毕尔巴鄂，盖里设计', impact: 'medium', subKind: 'art' },
  // ── 历史/综合 ──
  { id: 'mus-forbidden', name: '故宫博物院', layerId: 'museums', lng: 116.39, lat: 39.92, note: '北京，明清皇宫', impact: 'critical', subKind: 'history' },
  { id: 'mus-national-palace', name: '台北故宫', layerId: 'museums', lng: 121.55, lat: 25.1, note: '台北，文物南迁精华', impact: 'high', subKind: 'history' },
  { id: 'mus-shanghai', name: '上海博物馆', layerId: 'museums', lng: 121.48, lat: 31.23, note: '人民广场，青铜/书画', impact: 'high', subKind: 'history' },
  { id: 'mus-shaanxi', name: '陕西历史博物馆', layerId: 'museums', lng: 108.96, lat: 34.23, note: '西安，周秦汉唐文物', impact: 'high', subKind: 'history' },
  { id: 'mus-terracotta', name: '秦始皇兵马俑博物馆', layerId: 'museums', lng: 109.28, lat: 34.38, note: '西安临潼，世界第八奇迹', impact: 'critical', subKind: 'history' },
  { id: 'mus-national-museum-china', name: '中国国家博物馆', layerId: 'museums', lng: 116.4, lat: 39.9, note: '天安门广场东侧', impact: 'high', subKind: 'history' },
  { id: 'mus-tokyo-national', name: '东京国立博物馆', layerId: 'museums', lng: 139.78, lat: 35.72, note: '上野，日本最大', impact: 'high', subKind: 'history' },
  { id: 'mus-kyoto-national', name: '京都国立博物馆', layerId: 'museums', lng: 135.77, lat: 34.99, note: '京都，日本传统艺术', impact: 'medium', subKind: 'history' },
  { id: 'mus-national-cairo', name: '埃及博物馆', layerId: 'museums', lng: 31.23, lat: 30.05, note: '开罗解放广场，图坦卡蒙', impact: 'critical', subKind: 'history' },
  { id: 'mus-grand', name: '大埃及博物馆', layerId: 'museums', lng: 31.13, lat: 29.99, note: '吉萨，2023 新馆', impact: 'high', subKind: 'history' },
  { id: 'mus-acropolis', name: '雅典卫城博物馆', layerId: 'museums', lng: 23.73, lat: 37.97, note: '雅典，帕特农大理石', impact: 'high', subKind: 'history' },
  { id: 'mus-smithsonian', name: '史密森尼学会', layerId: 'museums', lng: -77.03, lat: 38.89, note: '华盛顿，国家广场博物馆群', impact: 'critical', subKind: 'history' },
  { id: 'mus-mexico-city', name: '墨西哥国立人类学博物馆', layerId: 'museums', lng: -99.19, lat: 19.43, note: '墨西哥城，阿兹特克/玛雅', impact: 'high', subKind: 'history' },
  { id: 'mus-vatican-museum', name: '梵蒂冈博物馆', layerId: 'museums', lng: 12.45, lat: 41.91, note: '西斯廷礼拜堂/拉斐尔', impact: 'critical', subKind: 'art' },
  // ── 科学/自然 ──
  { id: 'mus-natural-history', name: '美国自然历史博物馆', layerId: 'museums', lng: -73.96, lat: 40.78, note: '纽约，恐龙/天文', impact: 'high', subKind: 'science' },
  { id: 'mus-air-space', name: '国家航空航天博物馆', layerId: 'museums', lng: -77.02, lat: 38.89, note: '华盛顿，阿波罗 11', impact: 'high', subKind: 'science' },
  { id: 'mus-london-science', name: '伦敦科学博物馆', layerId: 'museums', lng: -0.17, lat: 51.5, note: '南肯辛顿，工业革命', impact: 'medium', subKind: 'science' },
  { id: 'mus-deutsches', name: '德意志博物馆', layerId: 'museums', lng: 11.59, lat: 48.13, note: '慕尼黑，世界最老科技博物馆', impact: 'medium', subKind: 'science' },
  { id: 'mus-cite-sciences', name: '科学工业城', layerId: 'museums', lng: 2.39, lat: 48.9, note: '巴黎拉维莱特', impact: 'low', subKind: 'science' },
];

/**
 * 主要岛屿（islands）— 全球主要岛屿与群岛。
 * subKind 标类型：'tropical'（热带）/ 'strategic'（战略）/ 'arctic'（北极）。
 * 整理日：2026-06-22。
 */
export const GLOBAL_ISLANDS: ThematicPoint[] = [
  // ── 战略岛屿 ──
  { id: 'isl-taiwan', name: '台湾岛', layerId: 'islands', lng: 121.0, lat: 23.7, note: '约 3.6 万 km²，第一岛链核心，地缘热点', impact: 'critical', subKind: 'strategic' },
  { id: 'isl-hainan', name: '海南岛', layerId: 'islands', lng: 109.7, lat: 19.2, note: '中国第二大岛，南海前沿', impact: 'high', subKind: 'strategic' },
  { id: 'isl-hawaii', name: '夏威夷岛', layerId: 'islands', lng: -155.5, lat: 19.9, note: '美国第 50 州，太平洋中枢', impact: 'critical', subKind: 'strategic' },
  { id: 'isl-okinawa', name: '冲绳岛', layerId: 'islands', lng: 127.8, lat: 26.5, note: '日本琉球，美日基地密集', impact: 'high', subKind: 'strategic' },
  { id: 'isl-guam', name: '关岛', layerId: 'islands', lng: 144.8, lat: 13.5, note: '美国领地，第二岛链核心', impact: 'critical', subKind: 'strategic' },
  { id: 'isl-diego-garcia', name: '迪戈加西亚岛', layerId: 'islands', lng: 72.41, lat: -7.31, note: '英属印度洋，美军印度洋基地', impact: 'critical', subKind: 'strategic' },
  { id: 'isl-cyprus', name: '塞浦路斯', layerId: 'islands', lng: 33.0, lat: 35.0, note: '地中海第三大岛，分裂状态', impact: 'high', subKind: 'strategic' },
  { id: 'isl-crete', name: '克里特岛', layerId: 'islands', lng: 25.0, lat: 35.2, note: '希腊最大岛，地中海第五大岛', impact: 'medium', subKind: 'strategic' },
  { id: 'isl-sicily', name: '西西里岛', layerId: 'islands', lng: 14.0, lat: 37.6, note: '地中海最大岛，意大利', impact: 'high', subKind: 'strategic' },
  { id: 'isl-sardinia', name: '撒丁岛', layerId: 'islands', lng: 9.0, lat: 40.1, note: '地中海第二大岛', impact: 'medium', subKind: 'strategic' },
  { id: 'isl-falkland', name: '福克兰群岛', layerId: 'islands', lng: -59.5, lat: -51.7, note: '英阿争议，1982 战争', impact: 'high', subKind: 'strategic' },
  { id: 'isl-malvinas2', name: '直布罗陀', layerId: 'islands', lng: -5.35, lat: 36.14, note: '英属半岛，扼地中海出入口', impact: 'high', subKind: 'strategic' },
  { id: 'isl-singapore', name: '新加坡岛', layerId: 'islands', lng: 103.85, lat: 1.35, note: '马六甲海峡咽喉', impact: 'critical', subKind: 'strategic' },
  { id: 'isl-sri-lanka', name: '斯里兰卡', layerId: 'islands', lng: 80.8, lat: 7.9, note: '印度洋十字路口', impact: 'high', subKind: 'strategic' },
  { id: 'isl-java', name: '爪哇岛', layerId: 'islands', lng: 110.0, lat: -7.5, note: '印尼核心岛，1.5 亿人口', impact: 'critical', subKind: 'strategic' },
  { id: 'isl-sumatra', name: '苏门答腊', layerId: 'islands', lng: 101.0, lat: -0.5, note: '印尼，马六甲海峡南侧', impact: 'high', subKind: 'strategic' },
  { id: 'isl-borneo', name: '婆罗洲', layerId: 'islands', lng: 114.5, lat: 1.0, note: '世界第三大岛，文/马/印尼分治', impact: 'high', subKind: 'strategic' },
  { id: 'isl-new-guinea', name: '新几内亚', layerId: 'islands', lng: 138.0, lat: -5.0, note: '世界第二大岛，印尼/巴新分治', impact: 'high', subKind: 'strategic' },
  { id: 'isl-honshu', name: '本州岛', layerId: 'islands', lng: 138.0, lat: 36.5, note: '日本主岛，东京/大阪', impact: 'critical', subKind: 'strategic' },
  { id: 'isl-britain', name: '大不列颠岛', layerId: 'islands', lng: -2.0, lat: 54.0, note: '世界第九大岛，英/苏', impact: 'critical', subKind: 'strategic' },
  // ── 热带岛屿 ──
  { id: 'isl-bali', name: '巴厘岛', layerId: 'islands', lng: 115.19, lat: -8.41, note: '印尼，世界级度假岛', impact: 'medium', subKind: 'tropical' },
  { id: 'isl-phuket', name: '普吉岛', layerId: 'islands', lng: 98.4, lat: 7.88, note: '泰国安达曼海度假岛', impact: 'low', subKind: 'tropical' },
  { id: 'isl-maldives', name: '马尔代夫', layerId: 'islands', lng: 73.5, lat: 3.2, note: '印度洋珊瑚礁群岛国', impact: 'medium', subKind: 'tropical' },
  { id: 'isl-hawaii2', name: '大岛（夏威夷岛）', layerId: 'islands', lng: -155.5, lat: 19.6, note: '火山岛，活火山基拉韦厄', impact: 'medium', subKind: 'tropical' },
  { id: 'isl-tahiti', name: '塔希提（大溪地）', layerId: 'islands', lng: -149.43, lat: -17.65, note: '法属波利尼西亚主岛', impact: 'low', subKind: 'tropical' },
  { id: 'isl-canaries', name: '加那利群岛', layerId: 'islands', lng: -15.5, lat: 28.1, note: '西班牙，大西洋火山群岛', impact: 'medium', subKind: 'tropical' },
  { id: 'isl-mauritius', name: '毛里求斯', layerId: 'islands', lng: 57.55, lat: -20.35, note: '印度洋度假岛国', impact: 'low', subKind: 'tropical' },
  { id: 'isl-fiji', name: '斐济', layerId: 'islands', lng: 178.0, lat: -17.7, note: '南太平洋群岛国', impact: 'low', subKind: 'tropical' },
  { id: 'isl-caribbean', name: '古巴岛', layerId: 'islands', lng: -77.8, lat: 21.5, note: '加勒比最大岛', impact: 'high', subKind: 'tropical' },
  { id: 'isl-hispaniola', name: '伊斯帕尼奥拉', layerId: 'islands', lng: -71.0, lat: 19.0, note: '海地/多米尼加共岛', impact: 'medium', subKind: 'tropical' },
  { id: 'isl-iceland', name: '冰岛', layerId: 'islands', lng: -19.0, lat: 64.9, note: '北大西洋火山岛国', impact: 'high', subKind: 'tropical' },
  // ── 北极岛屿 ──
  { id: 'isl-greenland', name: '格陵兰', layerId: 'islands', lng: -40.0, lat: 72.0, note: '世界最大岛，丹麦自治', impact: 'critical', subKind: 'arctic' },
  { id: 'isl-svalbard', name: '斯瓦尔巴群岛', layerId: 'islands', lng: 16.0, lat: 78.5, note: '挪威，北极种子库', impact: 'high', subKind: 'arctic' },
  { id: 'isl-novaya', name: '新地岛', layerId: 'islands', lng: 55.0, lat: 73.0, note: '俄罗斯北极，核试验场', impact: 'high', subKind: 'arctic' },
  { id: 'isl-franz-josef', name: '法兰士约瑟夫地群岛', layerId: 'islands', lng: 55.0, lat: 81.0, note: '俄罗斯北极群岛', impact: 'medium', subKind: 'arctic' },
  { id: 'isl-banks', name: '班克斯岛', layerId: 'islands', lng: -122.0, lat: 73.5, note: '加拿大北极群岛', impact: 'low', subKind: 'arctic' },
  { id: 'isl-ellesmere', name: '埃尔斯米尔岛', layerId: 'islands', lng: -82.0, lat: 80.0, note: '加拿大北极，最北居民点', impact: 'medium', subKind: 'arctic' },
  { id: 'isl-axel', name: '阿克塞尔海伯格岛', layerId: 'islands', lng: -94.0, lat: 80.0, note: '加拿大北极无人岛', impact: 'low', subKind: 'arctic' },
];

/**
 * 各国首都（capitals）— 全球各国首都与行政中心。
 * subKind 标量级：'superpower'（大国首都）/ 'regional'（地区大国首都）/ 'small'（中小国家首都）。
 * 整理日：2026-06-22。
 */
export const GLOBAL_CAPITALS: ThematicPoint[] = [
  // ── 大国首都 ──
  { id: 'cap-beijing', name: '北京', layerId: 'capitals', lng: 116.41, lat: 39.9, note: '中华人民共和国首都', impact: 'critical', subKind: 'superpower' },
  { id: 'cap-washington', name: '华盛顿', layerId: 'capitals', lng: -77.04, lat: 38.9, note: '美国首都', impact: 'critical', subKind: 'superpower' },
  { id: 'cap-moscow', name: '莫斯科', layerId: 'capitals', lng: 37.62, lat: 55.75, note: '俄罗斯首都', impact: 'critical', subKind: 'superpower' },
  { id: 'cap-tokyo', name: '东京', layerId: 'capitals', lng: 139.69, lat: 35.69, note: '日本首都', impact: 'critical', subKind: 'superpower' },
  { id: 'cap-newdelhi', name: '新德里', layerId: 'capitals', lng: 77.21, lat: 28.61, note: '印度首都', impact: 'critical', subKind: 'superpower' },
  { id: 'cap-london', name: '伦敦', layerId: 'capitals', lng: -0.13, lat: 51.51, note: '英国首都', impact: 'critical', subKind: 'superpower' },
  { id: 'cap-paris', name: '巴黎', layerId: 'capitals', lng: 2.35, lat: 48.86, note: '法国首都', impact: 'critical', subKind: 'superpower' },
  { id: 'cap-berlin', name: '柏林', layerId: 'capitals', lng: 13.38, lat: 52.52, note: '德国首都', impact: 'critical', subKind: 'superpower' },
  // ── 地区大国首都 ──
  { id: 'cap-seoul', name: '首尔', layerId: 'capitals', lng: 126.98, lat: 37.57, note: '韩国首都', impact: 'high', subKind: 'regional' },
  { id: 'cap-riyadh', name: '利雅得', layerId: 'capitals', lng: 46.72, lat: 24.71, note: '沙特阿拉伯首都', impact: 'high', subKind: 'regional' },
  { id: 'cap-tehran', name: '德黑兰', layerId: 'capitals', lng: 51.39, lat: 35.69, note: '伊朗首都', impact: 'high', subKind: 'regional' },
  { id: 'cap-ankara', name: '安卡拉', layerId: 'capitals', lng: 32.86, lat: 39.93, note: '土耳其首都', impact: 'high', subKind: 'regional' },
  { id: 'cap-cairo', name: '开罗', layerId: 'capitals', lng: 31.24, lat: 30.04, note: '埃及首都', impact: 'high', subKind: 'regional' },
  { id: 'cap-jakarta', name: '雅加达', layerId: 'capitals', lng: 106.85, lat: -6.21, note: '印尼首都（迁都努山塔拉进行中）', impact: 'high', subKind: 'regional' },
  { id: 'cap-brasilia', name: '巴西利亚', layerId: 'capitals', lng: -47.92, lat: -15.78, note: '巴西首都', impact: 'high', subKind: 'regional' },
  { id: 'cap-mexicocity', name: '墨西哥城', layerId: 'capitals', lng: -99.13, lat: 19.43, note: '墨西哥首都', impact: 'high', subKind: 'regional' },
  { id: 'cap-buenosaires', name: '布宜诺斯艾利斯', layerId: 'capitals', lng: -58.38, lat: -34.6, note: '阿根廷首都', impact: 'high', subKind: 'regional' },
  { id: 'cap-ottawa', name: '渥太华', layerId: 'capitals', lng: -75.7, lat: 45.42, note: '加拿大首都', impact: 'high', subKind: 'regional' },
  { id: 'cap-canberra', name: '堪培拉', layerId: 'capitals', lng: 149.13, lat: -35.28, note: '澳大利亚首都', impact: 'high', subKind: 'regional' },
  { id: 'cap-rome', name: '罗马', layerId: 'capitals', lng: 12.5, lat: 41.9, note: '意大利首都', impact: 'high', subKind: 'regional' },
  { id: 'cap-madrid', name: '马德里', layerId: 'capitals', lng: -3.7, lat: 40.42, note: '西班牙首都', impact: 'high', subKind: 'regional' },
  { id: 'cap-abuja', name: '阿布贾', layerId: 'capitals', lng: 7.49, lat: 9.08, note: '尼日利亚首都', impact: 'medium', subKind: 'regional' },
  { id: 'cap-pretoria', name: '比勒陀利亚', layerId: 'capitals', lng: 28.19, lat: -25.75, note: '南非行政首都', impact: 'medium', subKind: 'regional' },
  { id: 'cap-hanoi', name: '河内', layerId: 'capitals', lng: 105.85, lat: 21.03, note: '越南首都', impact: 'medium', subKind: 'regional' },
  { id: 'cap-bangkok', name: '曼谷', layerId: 'capitals', lng: 100.5, lat: 13.75, note: '泰国首都', impact: 'medium', subKind: 'regional' },
  { id: 'cap-islamabad', name: '伊斯兰堡', layerId: 'capitals', lng: 73.05, lat: 33.68, note: '巴基斯坦首都', impact: 'medium', subKind: 'regional' },
  { id: 'cap-kabul', name: '喀布尔', layerId: 'capitals', lng: 69.17, lat: 34.53, note: '阿富汗首都', impact: 'medium', subKind: 'regional' },
  { id: 'cap-baghdad', name: '巴格达', layerId: 'capitals', lng: 44.36, lat: 33.31, note: '伊拉克首都', impact: 'medium', subKind: 'regional' },
  { id: 'cap-damascus', name: '大马士革', layerId: 'capitals', lng: 36.28, lat: 33.51, note: '叙利亚首都', impact: 'medium', subKind: 'regional' },
  { id: 'cap-pyongyang', name: '平壤', layerId: 'capitals', lng: 125.75, lat: 39.04, note: '朝鲜首都', impact: 'high', subKind: 'regional' },
  { id: 'cap-taipei', name: '台北', layerId: 'capitals', lng: 121.56, lat: 25.03, note: '中国台湾行政中心', impact: 'high', subKind: 'regional' },
  { id: 'cap-kyiv', name: '基辅', layerId: 'capitals', lng: 30.52, lat: 50.45, note: '乌克兰首都', impact: 'high', subKind: 'regional' },
  { id: 'cap-warsaw', name: '华沙', layerId: 'capitals', lng: 21.01, lat: 52.23, note: '波兰首都', impact: 'medium', subKind: 'regional' },
  // ── 中小国家首都 ──
  { id: 'cap-singapore', name: '新加坡', layerId: 'capitals', lng: 103.85, lat: 1.35, note: '新加坡城邦', impact: 'high', subKind: 'small' },
  { id: 'cap-manila', name: '马尼拉', layerId: 'capitals', lng: 120.98, lat: 14.6, note: '菲律宾首都', impact: 'medium', subKind: 'small' },
  { id: 'cap-kualalumpur', name: '吉隆坡', layerId: 'capitals', lng: 101.69, lat: 3.14, note: '马来西亚首都', impact: 'medium', subKind: 'small' },
  { id: 'cap-dhaka', name: '达卡', layerId: 'capitals', lng: 90.41, lat: 23.81, note: '孟加拉国首都', impact: 'medium', subKind: 'small' },
  { id: 'cap-colombo', name: '科伦坡/斯里贾亚瓦德纳普拉', layerId: 'capitals', lng: 79.87, lat: 6.93, note: '斯里兰卡首都', impact: 'low', subKind: 'small' },
  { id: 'cap-phnompenh', name: '金边', layerId: 'capitals', lng: 104.92, lat: 11.56, note: '柬埔寨首都', impact: 'low', subKind: 'small' },
  { id: 'cap-vientiane', name: '万象', layerId: 'capitals', lng: 102.63, lat: 17.98, note: '老挝首都', impact: 'low', subKind: 'small' },
  { id: 'cap-naypyidaw', name: '内比都', layerId: 'capitals', lng: 96.07, lat: 19.75, note: '缅甸首都（2005 迁都）', impact: 'low', subKind: 'small' },
  { id: 'cap-jerusalem', name: '耶路撒冷', layerId: 'capitals', lng: 35.23, lat: 31.78, note: '以色列首都（争议）', impact: 'high', subKind: 'small' },
  { id: 'cap-doha', name: '多哈', layerId: 'capitals', lng: 51.53, lat: 25.29, note: '卡塔尔首都', impact: 'medium', subKind: 'small' },
  { id: 'cap-abudhabi', name: '阿布扎比', layerId: 'capitals', lng: 54.37, lat: 24.48, note: '阿联酋首都', impact: 'medium', subKind: 'small' },
  { id: 'cap-amman', name: '安曼', layerId: 'capitals', lng: 35.93, lat: 31.95, note: '约旦首都', impact: 'low', subKind: 'small' },
  { id: 'cap-beirut', name: '贝鲁特', layerId: 'capitals', lng: 35.5, lat: 33.89, note: '黎巴嫩首都', impact: 'low', subKind: 'small' },
  { id: 'cap-nairobi', name: '内罗毕', layerId: 'capitals', lng: 36.82, lat: -1.29, note: '肯尼亚首都', impact: 'medium', subKind: 'small' },
  { id: 'cap-addis', name: '亚的斯亚贝巴', layerId: 'capitals', lng: 38.74, lat: 9.03, note: '埃塞俄比亚首都，非盟总部', impact: 'medium', subKind: 'small' },
  { id: 'cap-dakar', name: '达喀尔', layerId: 'capitals', lng: -17.45, lat: 14.69, note: '塞内加尔首都', impact: 'low', subKind: 'small' },
  { id: 'cap-accra', name: '阿克拉', layerId: 'capitals', lng: -0.19, lat: 5.56, note: '加纳首都', impact: 'low', subKind: 'small' },
  { id: 'cap-lima', name: '利马', layerId: 'capitals', lng: -77.04, lat: -12.05, note: '秘鲁首都', impact: 'medium', subKind: 'small' },
  { id: 'cap-bogota', name: '波哥大', layerId: 'capitals', lng: -74.07, lat: 4.71, note: '哥伦比亚首都', impact: 'medium', subKind: 'small' },
  { id: 'cap-santiago', name: '圣地亚哥', layerId: 'capitals', lng: -70.67, lat: -33.45, note: '智利首都', impact: 'medium', subKind: 'small' },
  { id: 'cap-caracas', name: '加拉加斯', layerId: 'capitals', lng: -66.9, lat: 10.49, note: '委内瑞拉首都', impact: 'medium', subKind: 'small' },
  { id: 'cap-havana', name: '哈瓦那', layerId: 'capitals', lng: -82.38, lat: 23.13, note: '古巴首都', impact: 'medium', subKind: 'small' },
  { id: 'cap-stockholm', name: '斯德哥尔摩', layerId: 'capitals', lng: 18.07, lat: 59.33, note: '瑞典首都', impact: 'medium', subKind: 'small' },
  { id: 'cap-oslo', name: '奥斯陆', layerId: 'capitals', lng: 10.75, lat: 59.91, note: '挪威首都', impact: 'medium', subKind: 'small' },
  { id: 'cap-copenhagen', name: '哥本哈根', layerId: 'capitals', lng: 12.57, lat: 55.68, note: '丹麦首都', impact: 'medium', subKind: 'small' },
  { id: 'cap-helsinki', name: '赫尔辛基', layerId: 'capitals', lng: 24.94, lat: 60.17, note: '芬兰首都', impact: 'medium', subKind: 'small' },
  { id: 'cap-amsterdam', name: '阿姆斯特丹', layerId: 'capitals', lng: 4.9, lat: 52.37, note: '荷兰宪法首都', impact: 'medium', subKind: 'small' },
  { id: 'cap-brussels', name: '布鲁塞尔', layerId: 'capitals', lng: 4.35, lat: 50.85, note: '比利时首都，欧盟总部', impact: 'high', subKind: 'small' },
  { id: 'cap-vienna', name: '维也纳', layerId: 'capitals', lng: 16.37, lat: 48.21, note: '奥地利首都，联合国办事处', impact: 'medium', subKind: 'small' },
  { id: 'cap-prague', name: '布拉格', layerId: 'capitals', lng: 14.42, lat: 50.08, note: '捷克首都', impact: 'medium', subKind: 'small' },
  { id: 'cap-budapest', name: '布达佩斯', layerId: 'capitals', lng: 19.04, lat: 47.5, note: '匈牙利首都', impact: 'medium', subKind: 'small' },
  { id: 'cap-athens', name: '雅典', layerId: 'capitals', lng: 23.73, lat: 37.98, note: '希腊首都', impact: 'medium', subKind: 'small' },
  { id: 'cap-lisbon', name: '里斯本', layerId: 'capitals', lng: -9.14, lat: 38.72, note: '葡萄牙首都', impact: 'medium', subKind: 'small' },
  { id: 'cap-dublin', name: '都柏林', layerId: 'capitals', lng: -6.27, lat: 53.35, note: '爱尔兰首都', impact: 'low', subKind: 'small' },
  { id: 'cap-bucharest', name: '布加勒斯特', layerId: 'capitals', lng: 26.1, lat: 44.43, note: '罗马尼亚首都', impact: 'low', subKind: 'small' },
  { id: 'cap-minsk', name: '明斯克', layerId: 'capitals', lng: 27.56, lat: 53.9, note: '白俄罗斯首都', impact: 'medium', subKind: 'small' },
  { id: 'cap-astana', name: '阿斯塔纳（努尔苏丹）', layerId: 'capitals', lng: 71.43, lat: 51.16, note: '哈萨克斯坦首都', impact: 'medium', subKind: 'small' },
  { id: 'cap-tashkent', name: '塔什干', layerId: 'capitals', lng: 69.24, lat: 41.31, note: '乌兹别克斯坦首都', impact: 'low', subKind: 'small' },
];

/**
 * 火电与其他发电（power_plants）— 全球主要火电厂与其他大型发电设施。
 * subKind 标类型：'coal'（燃煤）/ 'gas'（燃气）/ 'renewable'（风光/地热/光热）。
 * 与 nuclear_reactors/dams 互补，覆盖化石能源与可再生发电。整理日：2026-06-22。
 */
export const GLOBAL_POWER_PLANTS: ThematicPoint[] = [
  // ── 燃煤电厂（世界最大） ──
  { id: 'pp-tuoketuo', name: '托克托电厂', layerId: 'power_plants', lng: 111.2, lat: 40.28, note: '中国内蒙古，6.7GW 世界最大燃煤电厂', impact: 'critical', subKind: 'coal' },
  { id: 'pp-belchatow', name: '贝乌哈图夫电厂', layerId: 'power_plants', lng: 19.33, lat: 51.27, note: '波兰，5.3GW 欧洲最大褐煤电厂', impact: 'high', subKind: 'coal' },
  { id: 'pp-vindhachal', name: '温迪亚恰尔电厂', layerId: 'power_plants', lng: 82.6, lat: 24.1, note: '印度，4.8GW', impact: 'high', subKind: 'coal' },
  { id: 'pp-mundra-pp', name: '蒙德拉电厂', layerId: 'power_plants', lng: 69.72, lat: 22.84, note: '印度泰塔，4.6GW 私营燃煤', impact: 'high', subKind: 'coal' },
  { id: 'pp-sasan', name: '萨桑电厂', layerId: 'power_plants', lng: 82.5, lat: 23.8, note: '印度，3.9GW', impact: 'medium', subKind: 'coal' },
  { id: 'pp-kendal', name: '肯达尔电厂', layerId: 'power_plants', lng: 29.4, lat: -26.1, note: '南非，4.1GW 煤电', impact: 'high', subKind: 'coal' },
  { id: 'pp-majuba', name: '马久巴电厂', layerId: 'power_plants', lng: 29.8, lat: -27.05, note: '南非，4.1GW', impact: 'medium', subKind: 'coal' },
  { id: 'pp-waigaoqiao', name: '外高桥电厂', layerId: 'power_plants', lng: 121.55, lat: 31.3, note: '上海，5GW 超超临界煤电', impact: 'high', subKind: 'coal' },
  { id: 'pp-jinzhou', name: '锦州/葫芦岛电厂群', layerId: 'power_plants', lng: 121.1, lat: 41.1, note: '辽宁，超大型煤电集群', impact: 'medium', subKind: 'coal' },
  { id: 'pp-schwarze', name: '黑泵电厂', layerId: 'power_plants', lng: 14.0, lat: 51.45, note: '德国，褐煤/生物质', impact: 'medium', subKind: 'coal' },
  { id: 'pp-neurath', name: '诺伊拉特电厂', layerId: 'power_plants', lng: 6.6, lat: 50.99, note: '德国，4.3GW 褐煤', impact: 'high', subKind: 'coal' },
  { id: 'pp-drax', name: '德拉克斯电厂', layerId: 'power_plants', lng: -0.99, lat: 53.74, note: '英国，2.6GW 转生物质', impact: 'medium', subKind: 'coal' },
  { id: 'pp-gibson', name: '吉布森县电厂', layerId: 'power_plants', lng: -87.7, lat: 38.4, note: '美国印第安纳，3.4GW 煤电', impact: 'medium', subKind: 'coal' },
  { id: 'pp-monroe', name: '门罗电厂', layerId: 'power_plants', lng: -83.35, lat: 41.9, note: '美国密歇根，3.3GW', impact: 'medium', subKind: 'coal' },
  // ── 燃气电厂 ──
  { id: 'pp-surgut-2', name: '苏尔古特-2 电厂', layerId: 'power_plants', lng: 73.4, lat: 61.25, note: '俄罗斯，5.6GW 世界最大燃气电厂', impact: 'critical', subKind: 'gas' },
  { id: 'pp-ras-laffan', name: '拉斯拉凡电厂群', layerId: 'power_plants', lng: 51.2, lat: 25.87, note: '卡塔尔，4.8GW 燃气+淡化', impact: 'high', subKind: 'gas' },
  { id: 'pp-jubail-pp', name: '朱拜勒电厂群', layerId: 'power_plants', lng: 49.99, lat: 27.0, note: '沙特，4GW 燃气/淡化', impact: 'high', subKind: 'gas' },
  { id: 'pp-kashima', name: '鹿岛电厂', layerId: 'power_plants', lng: 140.83, lat: 35.95, note: '日本，4.4GW 燃气/油', impact: 'medium', subKind: 'gas' },
  { id: 'pp-tracy', name: '特雷西电厂（加州）', layerId: 'power_plants', lng: -121.4, lat: 37.7, note: '美国，1.7GW 燃气调峰', impact: 'low', subKind: 'gas' },
  { id: 'pp-medway', name: '梅德韦电厂', layerId: 'power_plants', lng: 0.6, lat: 51.4, note: '英国，1.8GW 燃气', impact: 'low', subKind: 'gas' },
  // ── 风光/地热 ──
  { id: 'pp-gansu-wind', name: '甘肃酒泉风电基地', layerId: 'power_plants', lng: 96.3, lat: 39.74, note: '中国，世界最大陆上风电集群 8GW+', impact: 'critical', subKind: 'renewable' },
  { id: 'pp-bhadralfa', name: '巴德拉太阳能公园', layerId: 'power_plants', lng: 71.6, lat: 23.7, note: '印度古吉拉特，2.25GW 光伏', impact: 'high', subKind: 'renewable' },
  { id: 'pp-tengger', name: '腾格里沙漠光伏基地', layerId: 'power_plants', lng: 105.0, lat: 37.5, note: '中国宁夏，1.5GW 光伏', impact: 'high', subKind: 'renewable' },
  { id: 'pp-bhadla', name: 'Bhadla 光伏园', layerId: 'power_plants', lng: 71.9, lat: 27.5, note: '印度拉贾斯坦，2.2GW', impact: 'medium', subKind: 'renewable' },
  { id: 'pp-geysers', name: '盖塞斯地热田', layerId: 'power_plants', lng: -122.75, lat: 38.8, note: '美国加州，世界最大地热田', impact: 'high', subKind: 'renewable' },
  { id: 'pp-hellisheidi', name: '海利舍迪地热电站', layerId: 'power_plants', lng: -21.4, lat: 64.03, note: '冰岛，303MW 地热+热电联产', impact: 'medium', subKind: 'renewable' },
  { id: 'pp-cerro', name: 'Cerro Dominador 光热', layerId: 'power_plants', lng: -69.9, lat: -23.5, note: '智利阿塔卡马，110MW 塔式光热', impact: 'medium', subKind: 'renewable' },
  { id: 'pp-noor', name: '努奥光热综合体', layerId: 'power_plants', lng: -6.9, lat: 31.08, note: '摩洛哥瓦尔扎扎特，580MW 光热', impact: 'high', subKind: 'renewable' },
  { id: 'pp-hornsdale', name: '霍恩斯代尔储能', layerId: 'power_plants', lng: 138.6, lat: -33.1, note: '澳洲南澳，150MW/194MWh 特斯拉储能', impact: 'medium', subKind: 'renewable' },
  { id: 'pp-markbygden', name: '马尔克比格登风电', layerId: 'power_plants', lng: 21.0, lat: 65.6, note: '瑞典，欧洲最大规划风电集群', impact: 'low', subKind: 'renewable' },
  { id: 'pp-ivanpah', name: '伊万帕光热电站', layerId: 'power_plants', lng: -115.47, lat: 35.55, note: '美加州莫哈维，392MW 塔式', impact: 'medium', subKind: 'renewable' },
  { id: 'pp-tide-sihwa', name: '始华湖潮汐电站', layerId: 'power_plants', lng: 126.7, lat: 37.4, note: '韩国，254MW 世界最大潮汐电站', impact: 'medium', subKind: 'renewable' },
  { id: 'pp-tide-rance', name: '朗斯潮汐电站', layerId: 'power_plants', lng: -2.02, lat: 48.62, note: '法国，240MW 世界首座大型潮汐电站', impact: 'medium', subKind: 'renewable' },
  ...DENSIFY_POWER_PLANTS_R4,
];

/**
 * 森林生态（forests）— 全球主要森林与生态区。
 * subKind 标类型：'tropical'（热带雨林）/ 'temperate'（温带森林）/ 'boreal'（北方针叶林）。
 * 整理日：2026-06-22。
 */
export const GLOBAL_FORESTS: ThematicPoint[] = [
  // ── 热带雨林 ──
  { id: 'for-amazon', name: '亚马逊雨林', layerId: 'forests', lng: -60.0, lat: -3.5, note: '世界最大热带雨林，约 550 万 km²', impact: 'critical', subKind: 'tropical' },
  { id: 'for-congo', name: '刚果雨林', layerId: 'forests', lng: 22.0, lat: -1.0, note: '世界第二大热带雨林，约 180 万 km²', impact: 'critical', subKind: 'tropical' },
  { id: 'for-borneo-rain', name: '婆罗洲雨林', layerId: 'forests', lng: 114.0, lat: 1.0, note: '亚洲最大热带雨林', impact: 'high', subKind: 'tropical' },
  { id: 'for-sumatra-rain', name: '苏门答腊雨林', layerId: 'forests', lng: 101.0, lat: -0.5, note: '濒危雨林，红猩猩栖息地', impact: 'high', subKind: 'tropical' },
  { id: 'for-newguinea-rain', name: '新几内亚雨林', layerId: 'forests', lng: 138.0, lat: -5.5, note: '亚太最大连续雨林之一', impact: 'high', subKind: 'tropical' },
  { id: 'for-madagascar', name: '马达加斯加雨林', layerId: 'forests', lng: 47.0, lat: -19.0, note: '生物多样性热点，狐猴故乡', impact: 'high', subKind: 'tropical' },
  { id: 'for-Atlantic', name: '大西洋沿岸林（Mata Atlântica）', layerId: 'forests', lng: -45.0, lat: -23.0, note: '巴西东海岸，仅存 15%', impact: 'high', subKind: 'tropical' },
  { id: 'for-westernghats', name: '西高止山脉雨林', layerId: 'forests', lng: 76.5, lat: 11.0, note: '印度西南，世界遗产', impact: 'medium', subKind: 'tropical' },
  { id: 'for-daintree', name: '丹特里雨林', layerId: 'forests', lng: 145.4, lat: -16.2, note: '澳洲昆士兰，最古老雨林', impact: 'medium', subKind: 'tropical' },
  { id: 'for-centralamerica', name: '中美洲雨林', layerId: 'forests', lng: -86.0, lat: 14.5, note: '墨西哥南部至巴拿马走廊', impact: 'medium', subKind: 'tropical' },
  { id: 'for-choco', name: '乔科-达里恩雨林', layerId: 'forests', lng: -77.0, lat: 6.0, note: '哥伦比亚/巴拿马，高降水雨林', impact: 'medium', subKind: 'tropical' },
  { id: 'for-sulawesi', name: '苏拉威西雨林', layerId: 'forests', lng: 121.0, lat: -1.5, note: '印尼，特有物种丰富', impact: 'low', subKind: 'tropical' },
  // ── 温带森林 ──
  { id: 'for-tongass', name: '通加斯国家森林', layerId: 'forests', lng: -133.5, lat: 57.5, note: '阿拉斯加，美国最大温带雨林', impact: 'high', subKind: 'temperate' },
  { id: 'for-pacificnw', name: '太平洋西北温带雨林', layerId: 'forests', lng: -124.0, lat: 47.0, note: '美/加，红杉/花旗松', impact: 'high', subKind: 'temperate' },
  { id: 'for-valdivian', name: '瓦尔迪维亚温带雨林', layerId: 'forests', lng: -72.5, lat: -40.5, note: '智利/阿根廷南端', impact: 'high', subKind: 'temperate' },
  { id: 'for-blackforest', name: '黑森林', layerId: 'forests', lng: 8.3, lat: 48.0, note: '德国巴登-符腾堡', impact: 'low', subKind: 'temperate' },
  { id: 'for-bialowieza', name: '比亚沃维耶扎森林', layerId: 'forests', lng: 23.85, lat: 52.7, note: '波/白，欧洲最后原始低地林', impact: 'high', subKind: 'temperate' },
  { id: 'for-appalachian', name: '阿巴拉契亚森林', layerId: 'forests', lng: -82.0, lat: 37.5, note: '美东，阔叶混交林带', impact: 'medium', subKind: 'temperate' },
  { id: 'for-changbai', name: '长白山森林', layerId: 'forests', lng: 128.1, lat: 42.0, note: '中朝边境，温带原始林', impact: 'medium', subKind: 'temperate' },
  { id: 'for-shennongjia', name: '神农架', layerId: 'forests', lng: 110.5, lat: 31.5, note: '湖北，华中原始林，金丝猴', impact: 'medium', subKind: 'temperate' },
  { id: 'for-sichuan-bamboo', name: '蜀南竹海', layerId: 'forests', lng: 104.9, lat: 28.4, note: '四川，中国最大竹海', impact: 'low', subKind: 'temperate' },
  // ── 北方针叶林（泰加林） ──
  { id: 'for-siberian', name: '西伯利亚针叶林', layerId: 'forests', lng: 95.0, lat: 62.0, note: '世界最大连续森林，约 800 万 km²', impact: 'critical', subKind: 'boreal' },
  { id: 'for-canadian-boreal', name: '加拿大北方林', layerId: 'forests', lng: -100.0, lat: 56.0, note: '世界第二大陆地生物群系', impact: 'critical', subKind: 'boreal' },
  { id: 'for-scandinavian', name: '斯堪的纳维亚泰加林', layerId: 'forests', lng: 20.0, lat: 66.0, note: '瑞典/芬兰/挪威北部', impact: 'high', subKind: 'boreal' },
  { id: 'for-alaskan', name: '阿拉斯加北方林', layerId: 'forests', lng: -150.0, lat: 64.0, note: '环极地林带西端', impact: 'medium', subKind: 'boreal' },
  { id: 'for-kamchatka', name: '堪察加森林', layerId: 'forests', lng: 158.0, lat: 56.0, note: '俄罗斯远东，火山与棕熊', impact: 'medium', subKind: 'boreal' },
  { id: 'for-yakutia', name: '雅库特落叶松林', layerId: 'forests', lng: 125.0, lat: 63.0, note: '东西伯利亚极寒林', impact: 'medium', subKind: 'boreal' },
  { id: 'for-rocky', name: '落基山针叶林', layerId: 'forests', lng: -115.0, lat: 52.0, note: '加拿大/美西，高山针叶林', impact: 'medium', subKind: 'boreal' },
  ...DENSIFY_FORESTS_R4,
];

/**
 * 历史大地震（earthquakes_historical）— 历史上造成重大伤亡/影响的大地震。
 * subKind 标量级：'mega'（M9+巨震）/ 'great'（M8+大震）/ 'major'（M7+强震，伤亡重大）。
 * 整理日：2026-06-22。
 */
export const GLOBAL_EARTHQUAKES_HISTORICAL: ThematicPoint[] = [
  // ── 巨震（M9+） ──
  { id: 'eq-valdivia', name: '1960 瓦尔迪维亚地震', layerId: 'earthquakes_historical', lng: -73.05, lat: -39.5, note: 'M9.5，人类记录最强地震，智利', impact: 'critical', subKind: 'mega' },
  { id: 'eq-alaska', name: '1964 阿拉斯加大地震', layerId: 'earthquakes_historical', lng: -147.5, lat: 60.9, note: 'M9.2，北美最强，安克雷奇', impact: 'critical', subKind: 'mega' },
  { id: 'eq-sumatra', name: '2004 印度洋地震/海啸', layerId: 'earthquakes_historical', lng: 95.85, lat: 3.3, note: 'M9.1，约 23 万人遇难，环印度洋海啸', impact: 'critical', subKind: 'mega' },
  { id: 'eq-tohoku', name: '2011 东日本大地震', layerId: 'earthquakes_historical', lng: 142.37, lat: 38.3, note: 'M9.0，约 2 万人遇难，福岛核事故', impact: 'critical', subKind: 'mega' },
  { id: 'eq-kamchatka', name: '1952 堪察加地震', layerId: 'earthquakes_historical', lng: 160.0, lat: 52.5, note: 'M9.0，太平洋海啸波及夏威夷', impact: 'high', subKind: 'mega' },
  // ── 大震（M8+） ──
  { id: 'eq-sichuan', name: '2008 汶川地震', layerId: 'earthquakes_historical', lng: 103.4, lat: 31.0, note: 'M8.0，约 8.7 万人遇难/失踪，四川', impact: 'critical', subKind: 'great' },
  { id: 'eq-tangshan', name: '1976 唐山大地震', layerId: 'earthquakes_historical', lng: 118.18, lat: 39.63, note: 'M7.8，约 24 万人遇难', impact: 'critical', subKind: 'great' },
  { id: 'eq-chile', name: '2010 智利地震', layerId: 'earthquakes_historical', lng: -72.7, lat: -35.9, note: 'M8.8，500 余人遇难，海啸', impact: 'high', subKind: 'great' },
  { id: 'eq-mexico85', name: '1985 墨西哥城地震', layerId: 'earthquakes_historical', lng: -102.0, lat: 18.5, note: 'M8.0，约 1 万人遇难', impact: 'high', subKind: 'great' },
  { id: 'eq-ec', name: '1906 厄瓜多尔-哥伦比亚地震', layerId: 'earthquakes_historical', lng: -79.0, lat: 1.0, note: 'M8.8，海啸波及中美', impact: 'medium', subKind: 'great' },
  { id: 'eq-assy', name: '1923 关东大地震', layerId: 'earthquakes_historical', lng: 139.5, lat: 35.3, note: 'M7.9，约 10 万人遇难，东京/横滨', impact: 'critical', subKind: 'great' },
  { id: 'eq-nepal', name: '2015 尼泊尔地震', layerId: 'earthquakes_historical', lng: 84.7, lat: 28.15, note: 'M7.8，约 9000 人遇难', impact: 'high', subKind: 'great' },
  { id: 'eq-haiti', name: '2010 海地地震', layerId: 'earthquakes_historical', lng: -72.53, lat: 18.46, note: 'M7.0，约 22 万人遇难', impact: 'critical', subKind: 'great' },
  { id: 'eq-pakistan', name: '2005 克什米尔地震', layerId: 'earthquakes_historical', lng: 73.6, lat: 34.5, note: 'M7.6，约 8.7 万人遇难', impact: 'high', subKind: 'great' },
  { id: 'eq-turkey', name: '2023 土耳其-叙利亚地震', layerId: 'earthquakes_historical', lng: 37.2, lat: 37.2, note: 'M7.8，超 5 万人遇难', impact: 'critical', subKind: 'great' },
  { id: 'eq-sparse', name: '2017 墨西哥中部地震', layerId: 'earthquakes_historical', lng: -98.6, lat: 18.5, note: 'M7.1，约 370 人遇难', impact: 'medium', subKind: 'great' },
  { id: 'eq-lisbon', name: '1755 里斯本地震', layerId: 'earthquakes_historical', lng: -9.15, lat: 38.7, note: 'M8.5-9.0，启启蒙运动地震学', impact: 'high', subKind: 'great' },
  { id: 'eq-sanfrancisco', name: '1906 旧金山地震', layerId: 'earthquakes_historical', lng: -122.5, lat: 37.7, note: 'M7.9，大火毁灭城市', impact: 'high', subKind: 'great' },
  // ── 强震（M7+，伤亡重大） ──
  { id: 'eq-arms-armenia', name: '1988 亚美尼亚地震', layerId: 'earthquakes_historical', lng: 44.2, lat: 40.9, note: 'M6.8，约 2.5 万人遇难', impact: 'medium', subKind: 'major' },
  { id: 'eq-iran-bam', name: '2003 巴姆地震', layerId: 'earthquakes_historical', lng: 58.5, lat: 29.1, note: 'M6.6，约 2.6 万人遇难', impact: 'medium', subKind: 'major' },
  { id: 'eq-china-qinghai', name: '2010 玉树地震', layerId: 'earthquakes_historical', lng: 96.6, lat: 33.2, note: 'M6.9，约 2700 人遇难', impact: 'medium', subKind: 'major' },
  { id: 'eq-lushan', name: '2013 芦山地震', layerId: 'earthquakes_historical', lng: 102.9, lat: 30.3, note: 'M7.0，约 200 人遇难', impact: 'low', subKind: 'major' },
  { id: 'eq-italia', name: '2009 拉奎拉地震', layerId: 'earthquakes_historical', lng: 13.4, lat: 42.35, note: 'M6.3，约 300 人遇难', impact: 'low', subKind: 'major' },
  { id: 'eq-jiji', name: '1999 集集地震', layerId: 'earthquakes_historical', lng: 120.85, lat: 23.85, note: 'M7.3，台湾 921，约 2400 人遇难', impact: 'high', subKind: 'major' },
  { id: 'eq-kobe', name: '1995 阪神大地震', layerId: 'earthquakes_historical', lng: 135.0, lat: 34.6, note: 'M7.3，约 6400 人遇难', impact: 'high', subKind: 'major' },
  { id: 'eq-algeria', name: '2003 阿尔及利亚地震', layerId: 'earthquakes_historical', lng: 3.6, lat: 36.9, note: 'M6.8，约 2200 人遇难', impact: 'low', subKind: 'major' },
  { id: 'eq-afghan', name: '2023 阿富汗-赫罗特地震', layerId: 'earthquakes_historical', lng: 61.5, lat: 34.5, note: 'M6.3，约 1000 人遇难', impact: 'low', subKind: 'major' },
  { id: 'eq-morocco', name: '2023 摩洛哥地震', layerId: 'earthquakes_historical', lng: -8.4, lat: 30.9, note: 'M6.8，马拉喀什南，约 2900 人遇难', impact: 'medium', subKind: 'major' },
  { id: 'eq-japan-noto', name: '2024 能登半岛地震', layerId: 'earthquakes_historical', lng: 137.2, lat: 37.5, note: 'M7.6，日本石川，海啸预警', impact: 'medium', subKind: 'major' },
  { id: 'eq-ankang', name: '1556 关中大地震（华县）', layerId: 'earthquakes_historical', lng: 109.7, lat: 34.5, note: 'M8.0，人类史上最致命地震，约 83 万人', impact: 'critical', subKind: 'great' },
];

/**
 * 科技公司总部（tech_companies）— 全球主要科技公司总部。
 * subKind 标类型：'internet'（互联网/平台）/ 'software'（软件/SaaS）/ 'cloud'（云/AI）。
 * 整理日：2026-06-22。
 */
export const GLOBAL_TECH_COMPANIES: ThematicPoint[] = [
  // ── 互联网/平台 ──
  { id: 'tc-google', name: 'Google/Alphabet', layerId: 'tech_companies', lng: -122.08, lat: 37.42, note: '山景城 Googleplex，搜索/广告/Android', impact: 'critical', subKind: 'internet' },
  { id: 'tc-meta', name: 'Meta（Facebook）', layerId: 'tech_companies', lng: -122.15, lat: 37.48, note: '门洛帕克，社交/VR/元宇宙', impact: 'critical', subKind: 'internet' },
  { id: 'tc-amazon', name: 'Amazon', layerId: 'tech_companies', lng: -122.34, lat: 47.61, note: '西雅图，电商/AWS/物流', impact: 'critical', subKind: 'internet' },
  { id: 'tc-apple', name: 'Apple', layerId: 'tech_companies', lng: -122.03, lat: 37.33, note: '库比蒂诺 Apple Park，iPhone/Mac', impact: 'critical', subKind: 'internet' },
  { id: 'tc-netflix', name: 'Netflix', layerId: 'tech_companies', lng: -122.27, lat: 37.43, note: '洛斯加托斯，流媒体', impact: 'high', subKind: 'internet' },
  { id: 'tc-uber', name: 'Uber', layerId: 'tech_companies', lng: -122.4, lat: 37.77, note: '旧金山，网约车/外卖', impact: 'medium', subKind: 'internet' },
  { id: 'tc-airbnb', name: 'Airbnb', layerId: 'tech_companies', lng: -122.41, lat: 37.77, note: '旧金山，民宿平台', impact: 'low', subKind: 'internet' },
  { id: 'tc-tencent', name: '腾讯', layerId: 'tech_companies', lng: 113.94, lat: 22.54, note: '深圳，微信/游戏/云', impact: 'critical', subKind: 'internet' },
  { id: 'tc-alibaba', name: '阿里巴巴', layerId: 'tech_companies', lng: 120.11, lat: 30.18, note: '杭州，电商/支付宝/云', impact: 'critical', subKind: 'internet' },
  { id: 'tc-bytedance', name: '字节跳动', layerId: 'tech_companies', lng: 116.48, lat: 39.99, note: '北京，抖音/TikTok', impact: 'critical', subKind: 'internet' },
  { id: 'tc-meituan', name: '美团', layerId: 'tech_companies', lng: 116.48, lat: 39.99, note: '北京，本地生活/外卖', impact: 'high', subKind: 'internet' },
  { id: 'tc-pdd', name: '拼多多', layerId: 'tech_companies', lng: 121.42, lat: 31.23, note: '上海，下沉市场电商', impact: 'high', subKind: 'internet' },
  { id: 'tc-jd', name: '京东', layerId: 'tech_companies', lng: 116.49, lat: 39.91, note: '北京亦庄，自营电商', impact: 'high', subKind: 'internet' },
  { id: 'tc-rakuten', name: '乐天', layerId: 'tech_companies', lng: 139.73, lat: 35.65, note: '东京，日本电商/金融', impact: 'medium', subKind: 'internet' },
  { id: 'tc-naver', name: 'Naver', layerId: 'tech_companies', lng: 127.03, lat: 37.36, note: '城南，韩国搜索/Line', impact: 'medium', subKind: 'internet' },
  { id: 'tc-coupang', name: 'Coupang', layerId: 'tech_companies', lng: 127.03, lat: 37.5, note: '首尔，韩国电商', impact: 'low', subKind: 'internet' },
  { id: 'tc-flipkart', name: 'Flipkart', layerId: 'tech_companies', lng: 77.64, lat: 12.93, note: '班加罗尔，印度电商（沃尔玛）', impact: 'medium', subKind: 'internet' },
  { id: 'tc-booking', name: 'Booking.com', layerId: 'tech_companies', lng: 4.9, lat: 52.37, note: '阿姆斯特丹，全球订房', impact: 'medium', subKind: 'internet' },
  { id: 'tc-spotify', name: 'Spotify', layerId: 'tech_companies', lng: 18.07, lat: 59.33, note: '斯德哥尔摩，流媒体音乐', impact: 'medium', subKind: 'internet' },
  { id: 'tc-ebay', name: 'eBay', layerId: 'tech_companies', lng: -121.93, lat: 37.3, note: '圣何塞，拍卖/C2C', impact: 'low', subKind: 'internet' },
  { id: 'tc-shopify', name: 'Shopify', layerId: 'tech_companies', lng: -80.52, lat: 43.46, note: '渥太华，独立站电商SaaS', impact: 'medium', subKind: 'internet' },
  // ── 软件/SaaS ──
  { id: 'tc-microsoft', name: 'Microsoft', layerId: 'tech_companies', lng: -122.13, lat: 47.64, note: '雷德蒙德，Windows/Azure/Office', impact: 'critical', subKind: 'software' },
  { id: 'tc-oracle', name: 'Oracle', layerId: 'tech_companies', lng: -122.31, lat: 37.53, note: '奥斯汀/红木城，数据库/云', impact: 'high', subKind: 'software' },
  { id: 'tc-sap', name: 'SAP', layerId: 'tech_companies', lng: 8.65, lat: 49.4, note: '瓦尔多夫，德国，ERP 软件', impact: 'high', subKind: 'software' },
  { id: 'tc-adobe', name: 'Adobe', layerId: 'tech_companies', lng: -121.95, lat: 37.33, note: '圣何塞，Creative/PDF', impact: 'high', subKind: 'software' },
  { id: 'tc-salesforce', name: 'Salesforce', layerId: 'tech_companies', lng: -122.4, lat: 37.78, note: '旧金山，CRM SaaS', impact: 'high', subKind: 'software' },
  { id: 'tc-intuit', name: 'Intuit', layerId: 'tech_companies', lng: -122.16, lat: 37.43, note: '山景城，财务软件（TurboTax）', impact: 'low', subKind: 'software' },
  { id: 'tc-vmware', name: 'VMware', layerId: 'tech_companies', lng: -122.14, lat: 37.46, note: '帕洛阿尔托，虚拟化', impact: 'low', subKind: 'software' },
  { id: 'tc-figma', name: 'Figma', layerId: 'tech_companies', lng: -122.4, lat: 37.78, note: '旧金山，协作设计', impact: 'low', subKind: 'software' },
  { id: 'tc-atlassian', name: 'Atlassian', layerId: 'tech_companies', lng: 151.2, lat: -33.87, note: '悉尼，Jira/Confluence', impact: 'medium', subKind: 'software' },
  { id: 'tc-zoom', name: 'Zoom', layerId: 'tech_companies', lng: -122.0, lat: 37.38, note: '圣何塞，视频会议', impact: 'low', subKind: 'software' },
  // ── 云/AI/芯片设计 ──
  { id: 'tc-nvidia', name: 'NVIDIA', layerId: 'tech_companies', lng: -121.96, lat: 37.37, note: '圣克拉拉，GPU/AI 算力王者', impact: 'critical', subKind: 'cloud' },
  { id: 'tc-openai', name: 'OpenAI', layerId: 'tech_companies', lng: -122.4, lat: 37.78, note: '旧金山，ChatGPT/GPT', impact: 'critical', subKind: 'cloud' },
  { id: 'tc-anthropic', name: 'Anthropic', layerId: 'tech_companies', lng: -122.4, lat: 37.78, note: '旧金山，Claude', impact: 'high', subKind: 'cloud' },
  { id: 'tc-palantir', name: 'Palantir', layerId: 'tech_companies', lng: -122.42, lat: 37.77, note: '丹佛，大数据情报', impact: 'medium', subKind: 'cloud' },
  { id: 'tc-cloudflare', name: 'Cloudflare', layerId: 'tech_companies', lng: -122.4, lat: 37.78, note: '旧金山，CDN/安全', impact: 'medium', subKind: 'cloud' },
  { id: 'tc-stripe', name: 'Stripe', layerId: 'tech_companies', lng: -122.4, lat: 37.78, note: '旧金山/都柏林，支付基础设施', impact: 'high', subKind: 'cloud' },
  { id: 'tc-snowflake', name: 'Snowflake', layerId: 'tech_companies', lng: -122.15, lat: 37.43, note: '博兹曼/硅谷，数据云仓', impact: 'medium', subKind: 'cloud' },
  { id: 'tc-databricks', name: 'Databricks', layerId: 'tech_companies', lng: -122.15, lat: 37.43, note: '旧金山，数据/AI 平台', impact: 'medium', subKind: 'cloud' },
  { id: 'tc-huawei-tech', name: '华为', layerId: 'tech_companies', lng: 114.06, lat: 22.55, note: '深圳坂田，通信/手机/云/昇腾', impact: 'critical', subKind: 'cloud' },
  { id: 'tc-baidu', name: '百度', layerId: 'tech_companies', lng: 116.31, lat: 40.05, note: '北京，搜索/文心一言/自动驾驶', impact: 'high', subKind: 'cloud' },
  { id: 'tc-deepseek', name: 'DeepSeek', layerId: 'tech_companies', lng: 116.31, lat: 40.05, note: '杭州/北京，开源大模型', impact: 'high', subKind: 'cloud' },
  { id: 'tc-moonshot', name: '月之暗面', layerId: 'tech_companies', lng: 116.48, lat: 39.99, note: '北京，Kimi', impact: 'medium', subKind: 'cloud' },
  { id: 'tc-zhipu', name: '智谱 AI', layerId: 'tech_companies', lng: 116.31, lat: 40.05, note: '北京，GLM 系列大模型', impact: 'medium', subKind: 'cloud' },
  { id: 'tc-arm', name: 'ARM', layerId: 'tech_companies', lng: 0.12, lat: 52.21, note: '剑桥，移动芯片架构授权', impact: 'critical', subKind: 'cloud' },
  { id: 'tc-stm', name: '意法半导体', layerId: 'tech_companies', lng: 6.94, lat: 45.81, note: '日内瓦/米兰，嵌入式芯片', impact: 'medium', subKind: 'cloud' },
  { id: 'tc-qualcomm', name: '高通', layerId: 'tech_companies', lng: -117.16, lat: 32.72, note: '圣迭戈，骁龙/基带', impact: 'high', subKind: 'cloud' },
  { id: 'tc-yandex', name: 'Yandex', layerId: 'tech_companies', lng: 37.59, lat: 55.73, note: '莫斯科，俄罗斯搜索/出行', impact: 'medium', subKind: 'internet' },
  ...DENSIFY_TECH_COMPANIES_R4,
];

/**
 * 媒体机构（media_orgs）— 全球主要媒体与新闻机构总部。
 * subKind 标类型：'news'（通讯社/报纸）/ 'tv'（电视/广播）/ 'tech_media'（科技/新媒体）。
 * 整理日：2026-06-22。
 */
export const GLOBAL_MEDIA_ORGS: ThematicPoint[] = [
  // ── 通讯社/报纸 ──
  { id: 'mo-ap', name: '美联社（AP）', layerId: 'media_orgs', lng: -74.0, lat: 40.75, note: '纽约，全球最大非营利通讯社', impact: 'critical', subKind: 'news' },
  { id: 'mo-reuters', name: '路透社', layerId: 'media_orgs', lng: -0.1, lat: 51.51, note: '伦敦，金融/国际新闻', impact: 'critical', subKind: 'news' },
  { id: 'mo-afp', name: '法新社（AFP）', layerId: 'media_orgs', lng: 2.33, lat: 48.87, note: '巴黎，全球最古老通讯社之一', impact: 'high', subKind: 'news' },
  { id: 'mo-bloomberg', name: '彭博社', layerId: 'media_orgs', lng: -74.01, lat: 40.71, note: '纽约，金融数据/终端', impact: 'critical', subKind: 'news' },
  { id: 'mo-xinhua', name: '新华社', layerId: 'media_orgs', lng: 116.34, lat: 39.91, note: '北京，中国国家通讯社', impact: 'critical', subKind: 'news' },
  { id: 'mo-people', name: '人民日报', layerId: 'media_orgs', lng: 116.38, lat: 39.91, note: '北京，中共中央机关报', impact: 'high', subKind: 'news' },
  { id: 'mo-cctv', name: '中央广播电视总台（CMG）', layerId: 'media_orgs', lng: 116.32, lat: 39.92, note: '北京，CCTV/CGTN', impact: 'critical', subKind: 'tv' },
  { id: 'mo-kyodo', name: '共同社', layerId: 'media_orgs', lng: 139.77, lat: 35.68, note: '东京，日本通讯社', impact: 'medium', subKind: 'news' },
  { id: 'mo-yomiuri', name: '读卖新闻', layerId: 'media_orgs', lng: 139.77, lat: 35.68, note: '东京，日本发行量第一', impact: 'medium', subKind: 'news' },
  { id: 'mo-yonhap', name: '韩联社', layerId: 'media_orgs', lng: 126.98, lat: 37.57, note: '首尔，韩国通讯社', impact: 'medium', subKind: 'news' },
  { id: 'mo-tass', name: '塔斯社', layerId: 'media_orgs', lng: 37.62, lat: 55.75, note: '莫斯科，俄罗斯国家通讯社', impact: 'high', subKind: 'news' },
  { id: 'mo-rt', name: 'RT（今日俄罗斯）', layerId: 'media_orgs', lng: 37.62, lat: 55.75, note: '莫斯科，国际广播', impact: 'medium', subKind: 'tv' },
  { id: 'mo-press-tv', name: 'Press TV', layerId: 'media_orgs', lng: 51.39, lat: 35.69, note: '德黑兰，伊朗国际英语新闻', impact: 'low', subKind: 'tv' },
  { id: 'mo-al-jazeera', name: '半岛电视台', layerId: 'media_orgs', lng: 51.53, lat: 25.29, note: '多哈，卡塔尔，泛阿拉伯/英语', impact: 'high', subKind: 'tv' },
  { id: 'mo-times', name: '纽约时报', layerId: 'media_orgs', lng: -74.0, lat: 40.76, note: '纽约，美国记录报', impact: 'critical', subKind: 'news' },
  { id: 'mo-wsj', name: '华尔街日报', layerId: 'media_orgs', lng: -74.01, lat: 40.71, note: '纽约，财经/国际', impact: 'high', subKind: 'news' },
  { id: 'mo-washington-post', name: '华盛顿邮报', layerId: 'media_orgs', lng: -77.03, lat: 38.9, note: '华盛顿，水门事件', impact: 'high', subKind: 'news' },
  { id: 'mo-ft', name: '金融时报（FT）', layerId: 'media_orgs', lng: -0.1, lat: 51.51, note: '伦敦，粉色报纸', impact: 'high', subKind: 'news' },
  { id: 'mo-economist', name: '经济学人', layerId: 'media_orgs', lng: -0.1, lat: 51.51, note: '伦敦，周刊', impact: 'high', subKind: 'news' },
  { id: 'mo-guardian', name: '卫报', layerId: 'media_orgs', lng: -0.12, lat: 51.53, note: '伦敦，左翼/调查', impact: 'medium', subKind: 'news' },
  { id: 'mo-lemonde', name: '世界报', layerId: 'media_orgs', lng: 2.35, lat: 48.86, note: '巴黎，法国记录报', impact: 'medium', subKind: 'news' },
  { id: 'mo-bild', name: '图片报', layerId: 'media_orgs', lng: 8.68, lat: 50.11, note: '柏林，德国小报发行量第一', impact: 'low', subKind: 'news' },
  // ── 电视/广播 ──
  { id: 'mo-cnn', name: 'CNN', layerId: 'media_orgs', lng: -84.39, lat: 33.78, note: '亚特兰大，24 小时新闻鼻祖', impact: 'critical', subKind: 'tv' },
  { id: 'mo-fox-news', name: '福克斯新闻', layerId: 'media_orgs', lng: -74.01, lat: 40.75, note: '纽约，右翼有线电视', impact: 'high', subKind: 'tv' },
  { id: 'mo-msnbc', name: 'MSNBC', layerId: 'media_orgs', lng: -74.01, lat: 40.75, note: '纽约，左翼有线新闻', impact: 'medium', subKind: 'tv' },
  { id: 'mo-abc', name: 'ABC News', layerId: 'media_orgs', lng: -73.95, lat: 40.77, note: '纽约，迪士尼/ABC', impact: 'medium', subKind: 'tv' },
  { id: 'mo-nbc', name: 'NBC News', layerId: 'media_orgs', lng: -74.01, lat: 40.75, note: '纽约 30 Rockefeller', impact: 'medium', subKind: 'tv' },
  { id: 'mo-bbc', name: 'BBC', layerId: 'media_orgs', lng: -0.13, lat: 51.52, note: '伦敦 Broadcasting House', impact: 'critical', subKind: 'tv' },
  { id: 'mo-sky', name: 'Sky News', layerId: 'media_orgs', lng: -0.18, lat: 51.49, note: '伦敦奥斯特利', impact: 'medium', subKind: 'tv' },
  { id: 'mo-nhk', name: 'NHK', layerId: 'media_orgs', lng: 139.69, lat: 35.68, note: '东京涩谷，日本公共广播', impact: 'medium', subKind: 'tv' },
  // ── 科技/新媒体 ──
  { id: 'mo-techcrunch', name: 'TechCrunch', layerId: 'media_orgs', lng: -122.42, lat: 37.77, note: '旧金山，创业科技媒体', impact: 'low', subKind: 'tech_media' },
  { id: 'mo-the-verge', name: 'The Verge', layerId: 'media_orgs', lng: -74.0, lat: 40.75, note: '纽约，Vox 旗下科技文化', impact: 'low', subKind: 'tech_media' },
  { id: 'mo-wired', name: 'WIRED', layerId: 'media_orgs', lng: -122.42, lat: 37.77, note: '旧金山，康泰纳仕科技杂志', impact: 'low', subKind: 'tech_media' },
  { id: 'mo-36kr', name: '36氪', layerId: 'media_orgs', lng: 116.48, lat: 39.99, note: '北京，创投科技媒体', impact: 'low', subKind: 'tech_media' },
  { id: 'mo-huxiu', name: '虎嗅', layerId: 'media_orgs', lng: 116.48, lat: 39.99, note: '北京，商业科技评论', impact: 'low', subKind: 'tech_media' },
];

/**
 * 汽车品牌总部（auto_brands）— 全球主要汽车品牌总部。
 * subKind 标类型：'mass'（大众市场）/ 'luxury'（豪华/超跑）/ 'ev'（新能源/电动）。
 * 与 factories（工厂）互补，聚焦品牌决策中心。整理日：2026-06-22。
 */
export const GLOBAL_AUTO_BRANDS: ThematicPoint[] = [
  // ── 大众市场 ──
  { id: 'ab-toyota', name: '丰田汽车', layerId: 'auto_brands', lng: 137.15, lat: 35.08, note: '丰田市，全球销量冠军', impact: 'critical', subKind: 'mass' },
  { id: 'ab-volkswagen', name: '大众集团', layerId: 'auto_brands', lng: 10.79, lat: 52.43, note: '沃尔夫斯堡，含奥迪/保时捷', impact: 'critical', subKind: 'mass' },
  { id: 'ab-hyundai-mob', name: '现代-起亚', layerId: 'auto_brands', lng: 127.13, lat: 37.4, note: '首尔，韩国汽车双雄', impact: 'critical', subKind: 'mass' },
  { id: 'ab-gm', name: '通用汽车（GM）', layerId: 'auto_brands', lng: -83.25, lat: 42.56, note: '底特律 Renaissance Center', impact: 'high', subKind: 'mass' },
  { id: 'ab-ford', name: '福特汽车', layerId: 'auto_brands', lng: -83.24, lat: 42.3, note: '迪尔伯恩，福特 Rouge', impact: 'high', subKind: 'mass' },
  { id: 'ab-stellantis', name: 'Stellantis', layerId: 'auto_brands', lng: 9.19, lat: 45.46, note: '阿姆斯特丹/都灵/底特律，PSA+FCA', impact: 'high', subKind: 'mass' },
  { id: 'ab-renault', name: '雷诺集团', layerId: 'auto_brands', lng: 2.2, lat: 48.83, note: '布洛涅-比扬古，法国', impact: 'high', subKind: 'mass' },
  { id: 'ab-nissan', name: '日产汽车', layerId: 'auto_brands', lng: 139.65, lat: 35.65, note: '横滨，日法联盟', impact: 'high', subKind: 'mass' },
  { id: 'ab-honda', name: '本田汽车', layerId: 'auto_brands', lng: 139.46, lat: 35.49, note: '东京青山区（旧滨松）', impact: 'high', subKind: 'mass' },
  { id: 'ab-suzuki', name: '铃木汽车', layerId: 'auto_brands', lng: 137.68, lat: 34.71, note: '滨松，印度市场王', impact: 'medium', subKind: 'mass' },
  { id: 'ab-fiat', name: '菲亚特', layerId: 'auto_brands', lng: 7.69, lat: 45.07, note: '都灵 Lingotto（合并 Stellantis）', impact: 'low', subKind: 'mass' },
  { id: 'ab-tata-motors', name: '塔塔汽车', layerId: 'auto_brands', lng: 72.88, lat: 19.07, note: '孟买，含捷豹路虎', impact: 'medium', subKind: 'mass' },
  { id: 'ab-saic', name: '上汽集团', layerId: 'auto_brands', lng: 121.45, lat: 31.23, note: '上海，含通用/大众合资', impact: 'high', subKind: 'mass' },
  { id: 'ab-faw', name: '一汽集团', layerId: 'auto_brands', lng: 125.32, lat: 43.82, note: '长春，含奥迪/丰田/大众合资', impact: 'high', subKind: 'mass' },
  { id: 'ab-dongfeng', name: '东风汽车', layerId: 'auto_brands', lng: 114.4, lat: 30.5, note: '武汉，含日产/本田合资', impact: 'high', subKind: 'mass' },
  { id: 'ab-changan', name: '长安汽车', layerId: 'auto_brands', lng: 106.55, lat: 29.56, note: '重庆，含福特/马自达合资', impact: 'medium', subKind: 'mass' },
  { id: 'ab-geely', name: '吉利控股', layerId: 'auto_brands', lng: 120.16, lat: 30.27, note: '杭州，含沃尔沃/路特斯', impact: 'high', subKind: 'mass' },
  { id: 'ab-great-wall', name: '长城汽车', layerId: 'auto_brands', lng: 114.49, lat: 38.04, note: '保定，SUV/皮卡', impact: 'medium', subKind: 'mass' },
  // ── 豪华/超跑 ──
  { id: 'ab-mercedes', name: '梅赛德斯-奔驰', layerId: 'auto_brands', lng: 9.0, lat: 48.73, note: '斯图加特 Untertürkheim', impact: 'high', subKind: 'luxury' },
  { id: 'ab-bmw', name: '宝马集团', layerId: 'auto_brands', lng: 11.58, lat: 48.13, note: '慕尼黑，含劳斯莱斯/MINI', impact: 'high', subKind: 'luxury' },
  { id: 'ab-audi', name: '奥迪', layerId: 'auto_brands', lng: 10.89, lat: 48.37, note: '英戈尔施塔特', impact: 'medium', subKind: 'luxury' },
  { id: 'ab-porsche', name: '保时捷', layerId: 'auto_brands', lng: 8.93, lat: 48.83, note: '斯图加特祖文豪森', impact: 'high', subKind: 'luxury' },
  { id: 'ab-fer', name: '法拉利', layerId: 'auto_brands', lng: 10.86, lat: 44.53, note: '马拉内罗，F1 跃马', impact: 'high', subKind: 'luxury' },
  { id: 'ab-lambo', name: '兰博基尼', layerId: 'auto_brands', lng: 9.0, lat: 45.3, note: '圣亚加塔，奥迪旗下', impact: 'medium', subKind: 'luxury' },
  { id: 'ab-bentley', name: '宾利', layerId: 'auto_brands', lng: -2.46, lat: 53.0, note: '克鲁，英国，大众旗下', impact: 'low', subKind: 'luxury' },
  { id: 'ab-rolls', name: '劳斯莱斯', layerId: 'auto_brands', lng: -2.29, lat: 53.0, note: '古德伍德，宝马旗下', impact: 'medium', subKind: 'luxury' },
  { id: 'ab-volvo-cars', name: '沃尔沃汽车', layerId: 'auto_brands', lng: 12.15, lat: 57.71, note: '哥德堡，吉利旗下', impact: 'medium', subKind: 'luxury' },
  { id: 'ab-jlr', name: '捷豹路虎', layerId: 'auto_brands', lng: -1.47, lat: 52.91, note: '考文垂，塔塔旗下', impact: 'medium', subKind: 'luxury' },
  // ── 新能源/电动 ──
  { id: 'ab-tesla-ab', name: '特斯拉', layerId: 'auto_brands', lng: -122.03, lat: 37.37, note: '奥斯汀/帕洛阿尔托', impact: 'critical', subKind: 'ev' },
  { id: 'ab-byd-ab', name: '比亚迪', layerId: 'auto_brands', lng: 114.06, lat: 22.55, note: '深圳坪山，全球新能源销冠', impact: 'critical', subKind: 'ev' },
  { id: 'ab-nio', name: '蔚来', layerId: 'auto_brands', lng: 121.6, lat: 31.25, note: '上海/合肥，换电模式', impact: 'medium', subKind: 'ev' },
  { id: 'ab-xpeng', name: '小鹏汽车', layerId: 'auto_brands', lng: 113.27, lat: 23.13, note: '广州，智能驾驶', impact: 'medium', subKind: 'ev' },
  { id: 'ab-li-auto', name: '理想汽车', layerId: 'auto_brands', lng: 116.41, lat: 39.9, note: '北京，增程式', impact: 'medium', subKind: 'ev' },
  { id: 'ab-lucid', name: 'Lucid Motors', layerId: 'auto_brands', lng: -121.93, lat: 37.4, note: '纽瓦克/亚利桑那', impact: 'low', subKind: 'ev' },
  { id: 'ab-rivian', name: 'Rivian', layerId: 'auto_brands', lng: -88.2, lat: 40.11, note: ' Normal 伊利诺伊，电动皮卡', impact: 'low', subKind: 'ev' },
  { id: 'ab-rimac', name: 'Rimac', layerId: 'auto_brands', lng: 16.03, lat: 45.78, note: '萨格勒布，克罗地亚超跑', impact: 'low', subKind: 'ev' },
];

/**
 * 药企生物科技（pharmaceutical）— 全球主要药企与生物科技公司总部。
 * subKind 标类型：'big_pharma'（大型药企）/ 'biotech'（生物科技）/ 'vaccine'（疫苗厂商）。
 * 整理日：2026-06-22。
 */
export const GLOBAL_PHARMACEUTICAL: ThematicPoint[] = [
  // ── 大型药企 ──
  { id: 'ph-pfizer', name: '辉瑞', layerId: 'pharmaceutical', lng: -74.0, lat: 40.75, note: '纽约，新冠疫苗/伟哥', impact: 'critical', subKind: 'big_pharma' },
  { id: 'ph-jnj', name: '强生', layerId: 'pharmaceutical', lng: -74.42, lat: 40.47, note: '新不伦瑞克 NJ，多元化医疗', impact: 'critical', subKind: 'big_pharma' },
  { id: 'ph-abbvie', name: '艾伯维', layerId: 'pharmaceutical', lng: -87.84, lat: 42.1, note: '北芝加哥 IL，修美乐', impact: 'high', subKind: 'big_pharma' },
  { id: 'ph-merck', name: '默克（MSD）', layerId: 'pharmaceutical', lng: -74.35, lat: 40.51, note: '拉韦 NJ，HPV/K 药', impact: 'critical', subKind: 'big_pharma' },
  { id: 'ph-lilly', name: '礼来', layerId: 'pharmaceutical', lng: -86.16, lat: 39.77, note: '印第安纳波利斯，替尔泊肽', impact: 'critical', subKind: 'big_pharma' },
  { id: 'ph-roche', name: '罗氏', layerId: 'pharmaceutical', lng: 8.56, lat: 47.39, note: '巴塞尔，瑞士，肿瘤', impact: 'critical', subKind: 'big_pharma' },
  { id: 'ph-novartis', name: '诺华', layerId: 'pharmaceutical', lng: 8.56, lat: 47.39, note: '巴塞尔，瑞士', impact: 'high', subKind: 'big_pharma' },
  { id: 'ph-novonordisk', name: '诺和诺德', layerId: 'pharmaceutical', lng: 12.06, lat: 55.68, note: ' Bagsværd 丹麦，司美格鲁肽', impact: 'critical', subKind: 'big_pharma' },
  { id: 'ph-astrazeneca', name: '阿斯利康', layerId: 'pharmaceutical', lng: 2.21, lat: 48.76, note: '剑桥英国，肿瘤/心血管', impact: 'high', subKind: 'big_pharma' },
  { id: 'ph-gsk', name: '葛兰素史克（GSK）', layerId: 'pharmaceutical', lng: -0.34, lat: 51.39, note: '布伦特福德英国', impact: 'high', subKind: 'big_pharma' },
  { id: 'ph-sanofi', name: '赛诺菲', layerId: 'pharmaceutical', lng: 2.34, lat: 48.84, note: '巴黎，法国最大药企', impact: 'high', subKind: 'big_pharma' },
  { id: 'ph-bayer', name: '拜耳', layerId: 'pharmaceutical', lng: 6.95, lat: 50.94, note: '勒沃库森，德国，阿司匹林', impact: 'high', subKind: 'big_pharma' },
  { id: 'ph-boehringer', name: '勃林格殷格翰', layerId: 'pharmaceutical', lng: 8.57, lat: 48.73, note: ' Ingelheim 德国，家族药企', impact: 'medium', subKind: 'big_pharma' },
  { id: 'ph-takeda', name: '武田药品', layerId: 'pharmaceutical', lng: 135.51, lat: 34.69, note: '大阪，日本最大药企', impact: 'high', subKind: 'big_pharma' },
  { id: 'ph-astellas', name: '安斯泰来', layerId: 'pharmaceutical', lng: 139.73, lat: 35.65, note: '东京，日本', impact: 'medium', subKind: 'big_pharma' },
  { id: 'ph-hualan', name: '华兰生物', layerId: 'pharmaceutical', lng: 113.88, lat: 35.31, note: '新乡，血液制品', impact: 'low', subKind: 'big_pharma' },
  { id: 'ph-hengrui', name: '恒瑞医药', layerId: 'pharmaceutical', lng: 119.17, lat: 34.6, note: '连云港，中国创新药龙头', impact: 'medium', subKind: 'big_pharma' },
  // ── 生物科技 ──
  { id: 'ph-amgen', name: '安进', layerId: 'pharmaceutical', lng: -118.87, lat: 34.22, note: '千橡市 CA，生物药巨头', impact: 'high', subKind: 'biotech' },
  { id: 'ph-gilead', name: '吉利德科学', layerId: 'pharmaceutical', lng: -121.93, lat: 37.4, note: '福斯特城，抗病毒/HIV', impact: 'high', subKind: 'biotech' },
  { id: 'ph-biogen', name: '渤健', layerId: 'pharmaceutical', lng: -71.26, lat: 42.36, note: '剑桥 MA，多发性硬化', impact: 'medium', subKind: 'biotech' },
  { id: 'ph-regeneron', name: '再生元', layerId: 'pharmaceutical', lng: -73.72, lat: 41.25, note: '塔里敦 NY，抗体', impact: 'medium', subKind: 'biotech' },
  { id: 'ph-moderna', name: 'Moderna', layerId: 'pharmaceutical', lng: -71.09, lat: 42.36, note: '剑桥 MA，mRNA', impact: 'high', subKind: 'biotech' },
  { id: 'ph-vertex', name: 'Vertex 制药', layerId: 'pharmaceutical', lng: -71.06, lat: 42.36, note: '波士顿，囊性纤维化', impact: 'medium', subKind: 'biotech' },
  { id: 'ph-bms', name: '百时美施贵宝（BMS）', layerId: 'pharmaceutical', lng: -74.01, lat: 40.71, note: '纽约，肿瘤免疫', impact: 'high', subKind: 'big_pharma' },
  { id: 'ph-wuxi', name: '药明康德', layerId: 'pharmaceutical', lng: 121.45, lat: 31.23, note: '上海，全球 CRO 龙头', impact: 'high', subKind: 'biotech' },
  // ── 疫苗厂商 ──
  { id: 'ph-biontech', name: 'BioNTech', layerId: 'pharmaceutical', lng: 8.25, lat: 49.99, note: '美因茨德国，mRNA 疫苗', impact: 'high', subKind: 'vaccine' },
  { id: 'ph-sinovac', name: '科兴生物', layerId: 'pharmaceutical', lng: 116.48, lat: 39.99, note: '北京，灭活疫苗', impact: 'medium', subKind: 'vaccine' },
  { id: 'ph-cansino', name: '康希诺', layerId: 'pharmaceutical', lng: 117.2, lat: 39.13, note: '天津，腺病毒载体疫苗', impact: 'low', subKind: 'vaccine' },
  { id: 'ph-bharat', name: 'Bharat Biotech', layerId: 'pharmaceutical', lng: 78.41, lat: 17.45, note: '海得拉巴，印度疫苗', impact: 'medium', subKind: 'vaccine' },
  { id: 'ph-serum', name: 'Serum Institute of India', layerId: 'pharmaceutical', lng: 73.85, lat: 18.52, note: '浦那，全球最大疫苗生产商', impact: 'critical', subKind: 'vaccine' },
];

/**
 * 国际组织（intl_orgs）— 全球主要国际组织与多边机构总部。
 * subKind 标类型：'un'（联合国系统）/ 'finance'（国际金融机构）/ 'other'（多边/区域组织）。
 * 整理日：2026-06-22。
 */
export const GLOBAL_INTL_ORGS: ThematicPoint[] = [
  // ── 联合国系统 ──
  { id: 'io-un-nyc', name: '联合国总部', layerId: 'intl_orgs', lng: -73.97, lat: 40.75, note: '纽约东河，联合国大会/安理会', impact: 'critical', subKind: 'un' },
  { id: 'io-un-geneva', name: '联合国日内瓦办事处', layerId: 'intl_orgs', lng: 6.14, lat: 46.22, note: '万国宫，人权/裁军/人道', impact: 'critical', subKind: 'un' },
  { id: 'io-un-vienna', name: '联合国维也纳办事处', layerId: 'intl_orgs', lng: 16.42, lat: 48.23, note: '维也纳国际中心，IAEA/UNODC', impact: 'high', subKind: 'un' },
  { id: 'io-un-nairobi', name: '联合国内罗毕办事处', layerId: 'intl_orgs', lng: 36.82, lat: -1.23, note: 'UNEP/UN-Habitat 总部', impact: 'high', subKind: 'un' },
  { id: 'io-un-bangkok', name: '联合国亚太经社会（ESCAP）', layerId: 'intl_orgs', lng: 100.5, lat: 13.75, note: '曼谷，联合国亚太总部', impact: 'medium', subKind: 'un' },
  { id: 'io-fao', name: '联合国粮农组织（FAO）', layerId: 'intl_orgs', lng: 12.45, lat: 41.88, note: '罗马，粮食与农业', impact: 'high', subKind: 'un' },
  { id: 'io-unesco', name: '联合国教科文组织（UNESCO）', layerId: 'intl_orgs', lng: 2.3, lat: 48.84, note: '巴黎丰特努瓦广场', impact: 'high', subKind: 'un' },
  { id: 'io-ilo', name: '国际劳工组织（ILO）', layerId: 'intl_orgs', lng: 6.15, lat: 46.22, note: '日内瓦', impact: 'medium', subKind: 'un' },
  { id: 'io-who', name: '世界卫生组织（WHO）', layerId: 'intl_orgs', lng: 6.15, lat: 46.22, note: '日内瓦，公共卫生', impact: 'critical', subKind: 'un' },
  { id: 'io-wto', name: '世界贸易组织（WTO）', layerId: 'intl_orgs', lng: 6.14, lat: 46.23, note: '日内瓦，William Rappard 中心', impact: 'high', subKind: 'un' },
  { id: 'io-itu', name: '国际电信联盟（ITU）', layerId: 'intl_orgs', lng: 6.14, lat: 46.22, note: '日内瓦，电信标准', impact: 'medium', subKind: 'un' },
  { id: 'io-unhcr', name: '联合国难民署（UNHCR）', layerId: 'intl_orgs', lng: 6.14, lat: 46.22, note: '日内瓦，难民事务', impact: 'high', subKind: 'un' },
  { id: 'io-iaea', name: '国际原子能机构（IAEA）', layerId: 'intl_orgs', lng: 16.42, lat: 48.23, note: '维也纳，核监督', impact: 'critical', subKind: 'un' },
  { id: 'io-opcw', name: '禁止化学武器组织（OPCW）', layerId: 'intl_orgs', lng: 4.34, lat: 52.09, note: '海牙，化学武器监督', impact: 'high', subKind: 'un' },
  { id: 'io-icao', name: '国际民航组织（ICAO）', layerId: 'intl_orgs', lng: -73.58, lat: 45.5, note: '蒙特利尔，航空标准', impact: 'medium', subKind: 'un' },
  { id: 'io-imo', name: '国际海事组织（IMO）', layerId: 'intl_orgs', lng: -0.12, lat: 51.51, note: '伦敦，海事/航运规则', impact: 'medium', subKind: 'un' },
  { id: 'io-wipo', name: '世界知识产权组织（WIPO）', layerId: 'intl_orgs', lng: 6.14, lat: 46.22, note: '日内瓦', impact: 'medium', subKind: 'un' },
  { id: 'io-unicef', name: '联合国儿童基金会（UNICEF）', layerId: 'intl_orgs', lng: -73.97, lat: 40.75, note: '纽约', impact: 'high', subKind: 'un' },
  { id: 'io-wmo', name: '世界气象组织（WMO）', layerId: 'intl_orgs', lng: 6.14, lat: 46.22, note: '日内瓦', impact: 'medium', subKind: 'un' },
  // ── 国际金融机构 ──
  { id: 'io-imf', name: '国际货币基金组织（IMF）', layerId: 'intl_orgs', lng: -77.03, lat: 38.9, note: '华盛顿，全球金融稳定', impact: 'critical', subKind: 'finance' },
  { id: 'io-worldbank', name: '世界银行集团', layerId: 'intl_orgs', lng: -77.04, lat: 38.9, note: '华盛顿，IBRD/IDA/IFC/MIGA', impact: 'critical', subKind: 'finance' },
  { id: 'io-bis', name: '国际清算银行（BIS）', layerId: 'intl_orgs', lng: 7.59, lat: 47.55, note: '巴塞尔，央行之央行', impact: 'critical', subKind: 'finance' },
  { id: 'io-fsb', name: '金融稳定理事会（FSB）', layerId: 'intl_orgs', lng: 7.59, lat: 47.55, note: '巴塞尔，G20 金融监管', impact: 'high', subKind: 'finance' },
  { id: 'io-aib', name: '亚洲基础设施投资银行（AIIB）', layerId: 'intl_orgs', lng: 116.39, lat: 39.91, note: '北京，多边开发银行', impact: 'high', subKind: 'finance' },
  { id: 'io-adb', name: '亚洲开发银行（ADB）', layerId: 'intl_orgs', lng: 121.05, lat: 14.55, note: '马尼拉 Ortigas', impact: 'high', subKind: 'finance' },
  { id: 'io-idb', name: '美洲开发银行（IDB）', layerId: 'intl_orgs', lng: -77.05, lat: 38.9, note: '华盛顿，拉美开发融资', impact: 'medium', subKind: 'finance' },
  { id: 'io-afdb', name: '非洲开发银行（AfDB）', layerId: 'intl_orgs', lng: 3.4, lat: 6.42, note: '阿比让（科特迪瓦）', impact: 'medium', subKind: 'finance' },
  { id: 'io-ebd', name: '欧洲复兴开发银行（EBRD）', layerId: 'intl_orgs', lng: -0.12, lat: 51.51, note: '伦敦，转型经济', impact: 'medium', subKind: 'finance' },
  { id: 'io-ndb', name: '新开发银行（金砖银行）', layerId: 'intl_orgs', lng: 121.49, lat: 31.23, note: '上海，金砖五国', impact: 'medium', subKind: 'finance' },
  { id: 'io-fsb-2', name: '伊斯兰开发银行（IsDB）', layerId: 'intl_orgs', lng: 39.83, lat: 21.49, note: '吉达，伊斯兰世界', impact: 'medium', subKind: 'finance' },
  // ── 多边/区域/标准化组织 ──
  { id: 'io-oecd', name: '经合组织（OECD）', layerId: 'intl_orgs', lng: 2.28, lat: 48.85, note: '巴黎 Château de la Muette', impact: 'high', subKind: 'other' },
  { id: 'io-nato', name: '北大西洋公约组织（NATO）', layerId: 'intl_orgs', lng: 4.34, lat: 50.85, note: '布鲁塞尔，31 国军事联盟', impact: 'critical', subKind: 'other' },
  { id: 'io-eu', name: '欧洲联盟（EU）', layerId: 'intl_orgs', lng: 4.35, lat: 50.85, note: '布鲁塞尔，主要机构所在地', impact: 'critical', subKind: 'other' },
  { id: 'io-asean', name: '东南亚国家联盟（ASEAN）', layerId: 'intl_orgs', lng: 100.5, lat: 13.75, note: '雅加达秘书处', impact: 'high', subKind: 'other' },
  { id: 'io-au', name: '非洲联盟（AU）', layerId: 'intl_orgs', lng: 38.74, lat: 9.03, note: '亚的斯亚贝巴', impact: 'high', subKind: 'other' },
  { id: 'io-oas', name: '美洲国家组织（OAS）', layerId: 'intl_orgs', lng: -77.04, lat: 38.9, note: '华盛顿', impact: 'medium', subKind: 'other' },
  { id: 'io-gcc', name: '海湾合作委员会（GCC）', layerId: 'intl_orgs', lng: 46.72, lat: 24.71, note: '利雅得秘书处', impact: 'medium', subKind: 'other' },
  { id: 'io-iso', name: '国际标准化组织（ISO）', layerId: 'intl_orgs', lng: 6.14, lat: 46.22, note: '日内瓦', impact: 'low', subKind: 'other' },
  { id: 'io-crc', name: '红十字会与红新月会国际联合会', layerId: 'intl_orgs', lng: 6.14, lat: 46.22, note: '日内瓦', impact: 'medium', subKind: 'other' },
  ...DENSIFY_INTL_ORGS_R4,
];

/**
 * 商业航天（space_companies）— 全球商业航天与卫星公司总部。
 * subKind 标类型：'rocket'（火箭发射）/ 'satellite'（卫星/星座）/ 'tourism'（太空旅游）。
 * 与 launch_sites（发射场）互补，聚焦公司决策中心。整理日：2026-06-22。
 */
export const GLOBAL_SPACE_COMPANIES: ThematicPoint[] = [
  // ── 火箭发射 ──
  { id: 'sc-spacex', name: 'SpaceX', layerId: 'space_companies', lng: -95.09, lat: 29.56, note: '霍桑/博卡奇卡星基地，猎鹰/星舰', impact: 'critical', subKind: 'rocket' },
  { id: 'sc-rocket-lab', name: 'Rocket Lab', layerId: 'space_companies', lng: 174.8, lat: -39.26, note: '长滩/新西兰 Mahia，电子号火箭', impact: 'high', subKind: 'rocket' },
  { id: 'sc-relativity', name: 'Relativity Space', layerId: 'space_companies', lng: -118.25, lat: 33.92, note: '长滩，3D 打印火箭', impact: 'medium', subKind: 'rocket' },
  { id: 'sc-firefly', name: 'Firefly Aerospace', layerId: 'space_companies', lng: -97.87, lat: 30.5, note: '奥斯汀 TX，小型火箭', impact: 'medium', subKind: 'rocket' },
  { id: 'sc-ula', name: '联合发射联盟（ULA）', layerId: 'space_companies', lng: -105.13, lat: 39.81, note: '丹佛 Centennial，Atlas/Delta', impact: 'high', subKind: 'rocket' },
  { id: 'sc-blue-origin', name: '蓝色起源（Blue Origin）', layerId: 'space_companies', lng: -122.34, lat: 47.53, note: '肯特 WA，新格伦/新谢泼德', impact: 'high', subKind: 'rocket' },
  { id: 'sc-northrop-space', name: '诺斯罗普·格鲁曼（航天）', layerId: 'space_companies', lng: -79.4, lat: 43.69, note: '敦刻尔克/范奈斯，Antares/Pegasus', impact: 'high', subKind: 'rocket' },
  { id: 'sc-expace', name: 'ExPace（科工火箭）', layerId: 'space_companies', lng: 114.39, lat: 30.52, note: '武汉，快舟系列固体火箭（中国航天科工旗下）', impact: 'medium', subKind: 'rocket' },
  { id: 'sc-galactic-energy', name: '星河动力（Galactic Energy）', layerId: 'space_companies', lng: 116.41, lat: 39.9, note: '北京，谷神星一号', impact: 'medium', subKind: 'rocket' },
  { id: 'sc-i-space', name: '星际荣耀（i-Space）', layerId: 'space_companies', lng: 116.41, lat: 39.9, note: '北京，双曲线一号', impact: 'medium', subKind: 'rocket' },
  { id: 'sc-ariane', name: '阿丽亚娜空间（Arianespace）', layerId: 'space_companies', lng: 2.33, lat: 48.93, note: '埃夫里-库尔库罗讷，法国', impact: 'high', subKind: 'rocket' },
  { id: 'sc-roscosmos', name: '俄罗斯国家航天集团', layerId: 'space_companies', lng: 37.62, lat: 55.75, note: '莫斯科，联盟/安加拉', impact: 'critical', subKind: 'rocket' },
  { id: 'sc-ispace', name: 'ispace（日本）', layerId: 'space_companies', lng: 139.73, lat: 35.65, note: '东京，Hakuto 月球着陆器', impact: 'medium', subKind: 'rocket' },
  { id: 'sc-ispace2', name: 'ispace（中国星际微宇）', layerId: 'space_companies', lng: 114.06, lat: 22.55, note: '深圳，商业卫星', impact: 'low', subKind: 'satellite' },
  // ── 卫星/星座 ──
  { id: 'sc-iridium', name: 'Iridium Communications', layerId: 'space_companies', lng: -117.16, lat: 32.72, note: '麦克利恩 VA，铱星 66 星座', impact: 'medium', subKind: 'satellite' },
  { id: 'sc-planet', name: 'Planet Labs', layerId: 'space_companies', lng: -122.39, lat: 37.77, note: '旧金山，鸽子卫星地球影像', impact: 'medium', subKind: 'satellite' },
  { id: 'sc-maxar', name: 'Maxar Technologies', layerId: 'space_companies', lng: -105.13, lat: 39.81, note: '威斯敏斯特 CO，地球影像/卫星', impact: 'medium', subKind: 'satellite' },
  { id: 'sc-inmarsat', name: 'Inmarsat', layerId: 'space_companies', lng: -0.12, lat: 51.51, note: '伦敦，海事/航空卫星', impact: 'medium', subKind: 'satellite' },
  { id: 'sc-intelsat', name: 'Intelsat', layerId: 'space_companies', lng: -77.04, lat: 38.9, note: '麦克莱恩 VA，GEO 卫星', impact: 'medium', subKind: 'satellite' },
  { id: 'sc-ses', name: 'SES S.A.', layerId: 'space_companies', lng: 6.14, lat: 49.62, note: '贝滕堡 卢森堡，GEO/MEO', impact: 'medium', subKind: 'satellite' },
  { id: 'sc-ecom', name: 'Eutelsat', layerId: 'space_companies', lng: 2.21, lat: 48.83, note: '巴黎，GEO 卫星', impact: 'medium', subKind: 'satellite' },
  { id: 'sc-star-one', name: 'Star One', layerId: 'space_companies', lng: -43.2, lat: -22.9, note: '里约，拉美最大通信卫星运营商', impact: 'low', subKind: 'satellite' },
  { id: 'sc-fgw', name: '中国卫通', layerId: 'space_companies', lng: 116.32, lat: 39.93, note: '北京，中星系列卫星', impact: 'medium', subKind: 'satellite' },
  { id: 'sc-aselsat', name: '中国航天科技（卫星业务）', layerId: 'space_companies', lng: 116.32, lat: 39.93, note: '北京，东方红/风云/北斗', impact: 'high', subKind: 'satellite' },
  // ── 太空旅游/新兴 ──
  { id: 'sc-vg', name: '维珍银河（Virgin Galactic）', layerId: 'space_companies', lng: -106.9, lat: 32.94, note: '拉斯克鲁塞斯 NM，亚轨道旅游', impact: 'medium', subKind: 'tourism' },
  { id: 'sc-aevum', name: 'Aevum', layerId: 'space_companies', lng: -86.6, lat: 34.7, note: '亨茨维尔 AL，空中发射', impact: 'low', subKind: 'tourism' },
  { id: 'sc-axiom', name: 'Axiom Space', layerId: 'space_companies', lng: -95.37, lat: 29.76, note: '休斯顿，商业空间站模块', impact: 'medium', subKind: 'tourism' },
  { id: 'sc-boeing-star', name: '波音星际航线（Starliner）', layerId: 'space_companies', lng: -122.3, lat: 47.53, note: '西雅图（合并）', impact: 'medium', subKind: 'tourism' },
  { id: 'sc-sierra', name: 'Sierra Space', layerId: 'space_companies', lng: -105.25, lat: 40.03, note: '路易斯维尔 CO，追梦者', impact: 'low', subKind: 'tourism' },
  ...DENSIFY_SPACE_COMPANIES_R4,
];

/**
 * 稀土关键矿产（rare_earth）— 全球稀土与关键矿产供应链节点。
 * subKind 标类型：'mining'（开采）/ 'refining'（精炼/加工）/ 'strategic'（战略储备/瓶颈）。
 * 专注于稀土元素（REE）与新能源/半导体关键矿产，与 minerals 互补。整理日：2026-06-22。
 */
export const GLOBAL_RARE_EARTH: ThematicPoint[] = [
  // ── 稀土开采 ──
  { id: 're-bayanobo', name: '白云鄂博矿', layerId: 'rare_earth', lng: 109.97, lat: 41.77, note: '中国内蒙古，全球最大轻稀土矿，占中国储量主体', impact: 'critical', subKind: 'mining' },
  { id: 're-jiangxi-ion', name: '赣州离子型稀土', layerId: 'rare_earth', lng: 114.93, lat: 25.83, note: '中国江西，重稀土核心，离子吸附型', impact: 'critical', subKind: 'mining' },
  { id: 're-sichuan', name: '凉山稀土矿', layerId: 'rare_earth', lng: 102.27, lat: 27.9, note: '中国四川冕宁/德昌', impact: 'high', subKind: 'mining' },
  { id: 're-shandong', name: '山东微山湖稀土', layerId: 'rare_earth', lng: 116.83, lat: 35.2, note: '中国山东，轻稀土', impact: 'medium', subKind: 'mining' },
  { id: 're-mountain-pass-re', name: '芒廷帕斯矿', layerId: 'rare_earth', lng: -115.43, lat: 35.49, note: '美国加州，MP Materials 主力，西方唯一大型稀土矿', impact: 'critical', subKind: 'mining' },
  { id: 're-round-top', name: 'Round Top 矿', layerId: 'rare_earth', lng: -105.67, lat: 31.05, note: '美国得州，USA Rare Earth', impact: 'medium', subKind: 'mining' },
  { id: 're-mt-weld-re', name: '韦尔德山矿', layerId: 'rare_earth', lng: 122.46, lat: -28.83, note: '澳大利亚西澳，Lynas 主力', impact: 'critical', subKind: 'mining' },
  { id: 're-nolans-bore', name: 'Nolans Bore 矿', layerId: 'rare_earth', lng: 133.3, lat: -22.7, note: '澳大利亚北领地，Arafura', impact: 'medium', subKind: 'mining' },
  { id: 're-duba', name: 'Dubbo Zirconia 项目', layerId: 'rare_earth', lng: 148.4, lat: -32.2, note: '澳大利亚新南威尔士，ASM', impact: 'low', subKind: 'mining' },
  { id: 're-zandkops', name: 'Steenkampskraal 矿', layerId: 'rare_earth', lng: 18.33, lat: -31.43, note: '南非，高品位独居石', impact: 'low', subKind: 'mining' },
  { id: 're-nechalacho', name: 'Nechalacho 矿', layerId: 'rare_earth', lng: -112.0, lat: 62.0, note: '加拿大西北地区，重稀土', impact: 'medium', subKind: 'mining' },
  { id: 're-kvanefjeld', name: 'Kvanefjeld 矿', layerId: 'rare_earth', lng: -45.7, lat: 60.95, note: '格陵兰，争议稀土/铀矿', impact: 'medium', subKind: 'mining' },
  { id: 're-mriz', name: 'Mrima Hill 矿', layerId: 'rare_earth', lng: 39.27, lat: -4.5, note: '肯尼亚，独居石稀土', impact: 'low', subKind: 'mining' },
  // ── 精炼/加工 ──
  { id: 're-baotou-ref', name: '包头稀土高新区', layerId: 'rare_earth', lng: 109.84, lat: 40.66, note: '中国内蒙古，全球稀土精炼核心', impact: 'critical', subKind: 'refining' },
  { id: 're-ganzhou-ref', name: '赣州稀土加工集群', layerId: 'rare_earth', lng: 114.93, lat: 25.83, note: '中国江西，重稀土分离/永磁', impact: 'critical', subKind: 'refining' },
  { id: 're-lynas-lynas', name: 'Lynas Gebeng 厂', layerId: 'rare_earth', lng: 103.42, lat: 3.96, note: '马来西亚关丹，Lynas 海外精炼', impact: 'high', subKind: 'refining' },
  { id: 're-lynas-kal', name: 'Lynas Kalgoorlie 厂', layerId: 'rare_earth', lng: 121.49, lat: -30.75, note: '西澳，新建裂解/浸出厂', impact: 'medium', subKind: 'refining' },
  { id: 're-mp-refine', name: 'MP Materials 精炼', layerId: 'rare_earth', lng: -115.43, lat: 35.49, note: '芒廷帕斯（在恢复分离产能）', impact: 'high', subKind: 'refining' },
  { id: 're-energyfuels', name: 'Energy Fuels White Mesa 厂', layerId: 'rare_earth', lng: -109.55, lat: 37.6, note: '犹他，铀/稀土共处理', impact: 'medium', subKind: 'refining' },
  { id: 're-shenghe', name: '盛和资源', layerId: 'rare_earth', lng: 104.07, lat: 30.67, note: '成都，海外稀土布局', impact: 'medium', subKind: 'refining' },
  { id: 're-zhongke', name: '中科三环', layerId: 'rare_earth', lng: 116.31, lat: 40.05, note: '北京，钕铁硼永磁', impact: 'high', subKind: 'refining' },
  { id: 're-va-xiamen', name: '厦门钨业', layerId: 'rare_earth', lng: 118.09, lat: 24.48, note: '福建，钨/稀土/锂电', impact: 'medium', subKind: 'refining' },
  { id: 're-vac', name: 'Vacuumschmelze', layerId: 'rare_earth', lng: 9.27, lat: 50.7, note: '德国哈瑙，磁性材料', impact: 'medium', subKind: 'refining' },
  // ── 战略储备/瓶颈 ──
  { id: 're-mit', name: '镓锗出口管制（中国）', layerId: 'rare_earth', lng: 116.36, lat: 39.92, note: '2023 起管制镓/锗/锑等关键金属出口', impact: 'critical', subKind: 'strategic' },
  { id: 're-graphite-cn', name: '石墨出口管制（中国）', layerId: 'rare_earth', lng: 116.36, lat: 39.92, note: '高纯/球化石墨出口管制，电池负极', impact: 'critical', subKind: 'strategic' },
  { id: 're-cobalt-drc', name: '刚果（金）钴垄断', layerId: 'rare_earth', lng: 27.48, lat: -11.66, note: '全球约 70% 钴供应，电池关键瓶颈', impact: 'critical', subKind: 'strategic' },
  { id: 're-indonesia-nickel', name: '印尼镍禁令', layerId: 'rare_earth', lng: 121.27, lat: -2.55, note: '原矿出口禁令，电池/不锈钢原料', impact: 'high', subKind: 'strategic' },
  { id: 're-us-stockpile', name: '美国国防储备库', layerId: 'rare_earth', lng: -84.4, lat: 33.75, note: 'Fort Belvoir/DLA，战略矿产储备', impact: 'medium', subKind: 'strategic' },
  { id: 're-jogmec', name: 'JOGMEC（日本）', layerId: 'rare_earth', lng: 139.73, lat: 35.65, note: '东京，油气/金属矿物机构', impact: 'medium', subKind: 'strategic' },
  ...DENSIFY_RARE_EARTH_R4,
];

/**
 * 船旗国避税地（flags_of_convenience）— 全球主要船旗国与避税地。
 * subKind 标类型：'maritime'（船旗国）/ 'tax'（避税天堂）/ 'finance'（离岸金融中心）。
 * 整理日：2026-06-22。
 */
export const GLOBAL_FLAGS_OF_CONVENIENCE: ThematicPoint[] = [
  // ── 船旗国（开放登记） ──
  { id: 'foc-panama', name: '巴拿马', layerId: 'flags_of_convenience', lng: -79.52, lat: 8.98, note: '世界最大船旗国，约 2.2 亿总吨', impact: 'critical', subKind: 'maritime' },
  { id: 'foc-liberia', name: '利比里亚', layerId: 'flags_of_convenience', lng: -10.8, lat: 6.43, note: '第二大船旗国，美国资本主导注册', impact: 'high', subKind: 'maritime' },
  { id: 'foc-marshall', name: '马绍尔群岛', layerId: 'flags_of_convenience', lng: 171.0, lat: 7.1, note: '第三大船旗国，与利比里亚同管理', impact: 'high', subKind: 'maritime' },
  { id: 'foc-hongkong', name: '香港', layerId: 'flags_of_convenience', lng: 114.16, lat: 22.28, note: '全球第五大船舶注册', impact: 'medium', subKind: 'maritime' },
  { id: 'foc-singapore', name: '新加坡', layerId: 'flags_of_convenience', lng: 103.85, lat: 1.28, note: '高质量船旗国，前五大', impact: 'high', subKind: 'maritime' },
  { id: 'foc-bahamas', name: '巴哈马', layerId: 'flags_of_convenience', lng: -77.4, lat: 25.06, note: '邮轮业主要船旗国', impact: 'high', subKind: 'maritime' },
  { id: 'foc-malta', name: '马耳他', layerId: 'flags_of_convenience', lng: 14.38, lat: 35.9, note: '欧洲最大开放船旗国', impact: 'medium', subKind: 'maritime' },
  { id: 'foc-cyprus-foc', name: '塞浦路斯', layerId: 'flags_of_convenience', lng: 33.0, lat: 35.0, note: '欧洲第二大船舶登记', impact: 'medium', subKind: 'maritime' },
  { id: 'foc-isle-of-man', name: '马恩岛', layerId: 'flags_of_convenience', lng: -4.5, lat: 54.2, note: '英国皇家属地，游艇/船舶登记', impact: 'low', subKind: 'maritime' },
  { id: 'foc-bermuda', name: '百慕大', layerId: 'flags_of_convenience', lng: -64.75, lat: 32.3, note: '英国海外领地，邮轮登记', impact: 'medium', subKind: 'maritime' },
  { id: 'foc-st-kitts', name: '圣基茨和尼维斯', layerId: 'flags_of_convenience', lng: -62.7, lat: 17.36, note: '小船旗国，投资入籍', impact: 'low', subKind: 'maritime' },
  { id: 'foc-comoros', name: '科摩罗', layerId: 'flags_of_convenience', lng: 43.36, lat: -11.65, note: '小型开放登记', impact: 'low', subKind: 'maritime' },
  { id: 'foc-mongolia', name: '蒙古（内陆船旗）', layerId: 'flags_of_convenience', lng: 106.92, lat: 47.92, note: '内陆国但开放船舶登记', impact: 'low', subKind: 'maritime' },
  { id: 'foc-moldova', name: '摩尔多瓦', layerId: 'flags_of_convenience', lng: 28.47, lat: 47.36, note: '内陆国船舶登记', impact: 'low', subKind: 'maritime' },
  // ── 避税天堂 ──
  { id: 'foc-cayman', name: '开曼群岛', layerId: 'flags_of_convenience', lng: -81.25, lat: 19.3, note: '全球对冲基金/PE 注册圣地', impact: 'critical', subKind: 'tax' },
  { id: 'foc-bvi', name: '英属维尔京群岛', layerId: 'flags_of_convenience', lng: -64.62, lat: 18.42, note: '离岸公司注册，BVI 商业公司', impact: 'high', subKind: 'tax' },
  { id: 'foc-bermuda-tax', name: '百慕大（再保险/避税）', layerId: 'flags_of_convenience', lng: -64.75, lat: 32.3, note: '再保险/ Catastrophe Bond 中心', impact: 'high', subKind: 'tax' },
  { id: 'foc-jersey', name: '泽西岛', layerId: 'flags_of_convenience', lng: -2.13, lat: 49.21, note: '英国皇家属地，信托/基金', impact: 'medium', subKind: 'tax' },
  { id: 'foc-guernsey', name: '根西岛', layerId: 'flags_of_convenience', lng: -2.54, lat: 49.47, note: '英国皇家属地，私人财富', impact: 'low', subKind: 'tax' },
  { id: 'foc-vanuatu', name: '瓦努阿图', layerId: 'flags_of_convenience', lng: 168.32, lat: -17.74, note: '太平洋避税/投资入籍', impact: 'low', subKind: 'tax' },
  { id: 'foc-seychelles', name: '塞舌尔', layerId: 'flags_of_convenience', lng: 55.45, lat: -4.68, note: '印度洋离岸公司', impact: 'low', subKind: 'tax' },
  { id: 'foc-beliz', name: '伯利兹', layerId: 'flags_of_convenience', lng: -88.77, lat: 17.25, note: '中美洲离岸登记', impact: 'low', subKind: 'tax' },
  { id: 'foc-nauru', name: '瑙鲁', layerId: 'flags_of_convenience', lng: 166.93, lat: -0.55, note: '磷酸盐/避税/洗钱历史', impact: 'low', subKind: 'tax' },
  { id: 'foc-monaco', name: '摩纳哥', layerId: 'flags_of_convenience', lng: 7.42, lat: 43.74, note: '个人免税/富豪聚居', impact: 'medium', subKind: 'tax' },
  { id: 'foc-andorra', name: '安道尔', layerId: 'flags_of_convenience', lng: 1.52, lat: 42.51, note: '比利牛斯避税公国', impact: 'low', subKind: 'tax' },
  { id: 'foc-liechtenstein', name: '列支敦士登', layerId: 'flags_of_convenience', lng: 9.55, lat: 47.14, note: '阿尔卑斯信托/基金中心', impact: 'medium', subKind: 'tax' },
  { id: 'foc-sanmarino', name: '圣马力诺', layerId: 'flags_of_convenience', lng: 12.46, lat: 43.94, note: '意大利半岛避税', impact: 'low', subKind: 'tax' },
  // ── 离岸金融中心 ──
  { id: 'foc-luxembourg-fin', name: '卢森堡', layerId: 'flags_of_convenience', lng: 6.13, lat: 49.81, note: '欧盟最大投资基金注册地', impact: 'high', subKind: 'finance' },
  { id: 'foc-ireland-fin', name: '爱尔兰', layerId: 'flags_of_convenience', lng: -6.27, lat: 53.35, note: '苹果/谷歌/Meta 欧洲总部（低税率）', impact: 'high', subKind: 'finance' },
  { id: 'foc-dutch', name: '荷兰（三明治结构）', layerId: 'flags_of_convenience', lng: 4.9, lat: 52.37, note: '荷兰三明治税收结构', impact: 'high', subKind: 'finance' },
  { id: 'foc-mauritius-fin', name: '毛里求斯', layerId: 'flags_of_convenience', lng: 57.5, lat: -20.35, note: '印度/非洲投资枢纽（DTAA）', impact: 'medium', subKind: 'finance' },
  { id: 'foc-dubai-fin', name: '迪拜（DIFC/JAFZA）', layerId: 'flags_of_convenience', lng: 55.27, lat: 25.2, note: '中东离岸/自由区金融', impact: 'high', subKind: 'finance' },
  { id: 'foc-samoa', name: '萨摩亚', layerId: 'flags_of_convenience', lng: -172.13, lat: -13.6, note: '亚太离岸公司（亚洲客户）', impact: 'low', subKind: 'finance' },
];

export const GLOBAL_THEMATIC_POINTS: ThematicPoint[] = [
  ...GLOBAL_ECON_HUBS,
  ...GLOBAL_MINERALS,
  ...GLOBAL_DATACENTERS,
  ...GLOBAL_PROTESTS,
  ...GLOBAL_CLIMATE,
  ...DENSIFY_INFRA,
  ...DENSIFY_INFRA_R2,
  ...GLOBAL_WORLD_HERITAGE,
  ...GLOBAL_CHINA_HERITAGE,
  ...GLOBAL_MEGACITIES,
  ...GLOBAL_DAMS,
  ...GLOBAL_PORTS,
  ...GLOBAL_RESEARCH_STATIONS,
  ...GLOBAL_REFINERIES,
  ...GLOBAL_AIRPORTS,
  ...GLOBAL_NUCLEAR_REACTORS,
  ...GLOBAL_FACTORIES,
  ...GLOBAL_FINANCIAL_CENTERS,
  ...GLOBAL_BORDERS,
  ...GLOBAL_DESERTS,
  ...GLOBAL_UNIVERSITIES,
  ...GLOBAL_MILITARY_INDUSTRY,
  ...GLOBAL_WONDER_PROJECTS,
  ...GLOBAL_AGRICULTURE,
  ...GLOBAL_RELIGIONS,
  ...GLOBAL_STADIUMS,
  ...GLOBAL_MUSEUMS,
  ...GLOBAL_ISLANDS,
  ...GLOBAL_CAPITALS,
  ...GLOBAL_POWER_PLANTS,
  ...GLOBAL_FORESTS,
  ...GLOBAL_EARTHQUAKES_HISTORICAL,
  ...GLOBAL_TECH_COMPANIES,
  ...GLOBAL_MEDIA_ORGS,
  ...GLOBAL_AUTO_BRANDS,
  ...GLOBAL_PHARMACEUTICAL,
  ...GLOBAL_INTL_ORGS,
  ...GLOBAL_SPACE_COMPANIES,
  ...GLOBAL_RARE_EARTH,
  ...GLOBAL_FLAGS_OF_CONVENIENCE,
];
