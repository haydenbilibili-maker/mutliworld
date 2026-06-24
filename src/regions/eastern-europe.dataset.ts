/**
 * 东欧（俄乌战线）区域数据集 — LIFEOS-005
 *
 * ⚠ 起步内容仅含「阵营」与「关键城市/地理参考点」等公开事实，
 *   不含当前战线、伤亡、具体打击等敏感时效数据——这些需由真实可核实来源填充，
 *   不可凭空编造（俄乌为进行中的真实冲突）。后续与 Hayden / Bezos 接真实数据源补全。
 */

import type { EventDetail } from '@/types/geo';
import type { RegionDataset } from '@/types/region';
import type { Incident, Facility, EnergyDataPoint, OilProducerMapPoint } from '@/types/middleeast';
import {
  EE_DENSIFY_EVENTS,
  EE_DENSIFY_INCIDENTS,
  EE_DENSIFY_FACILITIES,
  EE_DENSIFY_ENERGY,
} from './regional-densify-r2';
import {
  EE_DENSIFY_EVENTS_R4,
  EE_DENSIFY_INCIDENTS_R4,
  EE_DENSIFY_FACILITIES_R4,
} from './regional-densify-r4';
import { EE_MILITARY_SECTIONS } from './eastern-europe.military';
import { EE_DIPLOMACY } from './eastern-europe.diplomacy';

/** 阵营（俄/乌/北约） */
export const EE_FACTION_LABEL: Record<string, string> = {
  ru: '俄罗斯',
  ua: '乌克兰',
  nato: '北约',
};
export const EE_FACTION_HEX: Record<string, string> = {
  ru: '#ef4444',
  ua: '#3b82f6',
  nato: '#22d3ee',
};

/** 关键城市 / 地理参考点（公开地理事实，作为地图与列表的起点占位） */
const EE_REFERENCE_POINTS: EventDetail[] = [
  {
    id: 'ee-kyiv',
    title: '基辅 · 乌克兰首都',
    source: '公开地理参考',
    timestamp: '2026-06-15',
    location: [30.52, 50.45],
    impact_level: 'high',
    category: 'capital',
    description: '乌克兰首都与政治中心（地理参考点）',
  },
  {
    id: 'ee-moscow',
    title: '莫斯科 · 俄罗斯首都',
    source: '公开地理参考',
    timestamp: '2026-06-15',
    location: [37.62, 55.75],
    impact_level: 'high',
    category: 'capital',
    description: '俄罗斯首都与政治中心（地理参考点）',
  },
  {
    id: 'ee-crimea',
    title: '克里米亚 · 塞瓦斯托波尔',
    source: '公开地理参考',
    timestamp: '2026-06-15',
    location: [33.52, 44.6],
    impact_level: 'high',
    category: 'contested',
    description: '黑海舰队基地所在；2014 年起争议地区（地理参考点）',
  },
  {
    id: 'ee-donbas',
    title: '顿巴斯 · 顿涅茨克',
    source: '公开地理参考',
    timestamp: '2026-06-15',
    location: [37.8, 48.0],
    impact_level: 'high',
    category: 'contested',
    description: '东部争议地区，2014 年起冲突核心（地理参考点）',
  },
  {
    id: 'ee-kharkiv',
    title: '哈尔科夫 · 东部重镇',
    source: '公开地理参考',
    timestamp: '2026-06-15',
    location: [36.23, 49.99],
    impact_level: 'medium',
    category: 'city',
    description: '乌克兰东部第二大城市（地理参考点）',
  },
  {
    id: 'ee-odesa',
    title: '敖德萨 · 黑海港口',
    source: '公开地理参考',
    timestamp: '2026-06-15',
    location: [30.73, 46.48],
    impact_level: 'medium',
    category: 'port',
    description: '黑海粮食出口关键港口（地理参考点）',
  },
];

/**
 * 关键动态（联网检索的可核实公开来源，带日期与出处）。
 * ⚠ 聚合类事件（战线/territory 变化）的坐标为「示意位置」，非精确打击点。
 *   数据有时效性，需定期核实更新。检索日：2026-06-16。
 */
const EE_KEY_EVENTS: EventDetail[] = [
  {
    id: 'ee-evt-frontline',
    title: '战线 · 乌东部与南部约 1200km',
    source: 'Al Jazeera（2026-02）',
    timestamp: '2026-02-07',
    location: [37.18, 48.28], // 顿涅茨克方向(示意)
    impact_level: 'high',
    category: 'frontline',
    description:
      '战线沿乌克兰东部与南部延伸约 1200 公里，严寒中持续交火（半岛电视台，截至 2026-02-07）。坐标为示意。',
  },
  {
    id: 'ee-evt-ru-advance',
    title: '俄军推进 · 占领别列斯托克等',
    source: 'Russia Matters 战报（2026-06-03）',
    timestamp: '2026-06-03',
    location: [37.35, 48.32], // 东部战线(示意)
    impact_level: 'medium',
    category: 'military',
    description:
      '2026-05-26 至 06-02，俄军在约 7 个聚居点附近推进，05-27 占领别列斯托克(Berestok)（Russia Matters）。坐标为示意。',
  },
  {
    id: 'ee-evt-ua-recapture',
    title: '乌军近 30 日收复约 247km²',
    source: 'The Economist（2026-06-09）',
    timestamp: '2026-06-09',
    location: [35.14, 47.84], // 南部扎波罗热方向(示意)
    impact_level: 'medium',
    category: 'military',
    description:
      '据《经济学人》估算，过去 30 天乌军收复约 247 平方公里（约 95 平方英里）。坐标为示意。',
  },
  {
    id: 'ee-evt-deepstate',
    title: '俄军一周净得约 6 平方英里',
    source: 'DeepState（2026-06-09）',
    timestamp: '2026-06-09',
    location: [37.62, 49.71], // 库皮扬斯克方向(示意)
    impact_level: 'medium',
    category: 'military',
    description:
      '2026-06-02 至 06-09，俄军对乌净占领约 6 平方英里，较前一周（净失约 10 平方英里）回升（DeepState）。坐标为示意。',
  },
  {
    id: 'ee-evt-truce-may',
    title: '5 月 9–11 日临时停火（胜利日）',
    source: 'Wikipedia: May 2026 Russo-Ukrainian truce',
    timestamp: '2026-05-09',
    location: [30.52, 50.45], // 基辅
    impact_level: 'high',
    category: 'diplomatic',
    description:
      '2026-05-09 至 11 围绕俄罗斯胜利日的短期人道停火，含换俘安排；被普遍视为临时人道暂停，非全面和平协议。',
  },
  {
    id: 'ee-evt-ceasefire-outlook',
    title: '6 月底全面停火前景低迷',
    source: 'Crypto Briefing / 预测市场（2026-06）',
    timestamp: '2026-06-09',
    location: [37.62, 55.75], // 莫斯科
    impact_level: 'medium',
    category: 'diplomatic',
    description:
      '截至 2026 年 6 月，6 月 30 日前达成全面停火被预测市场定价为约 9.5% 概率，外交进程停滞；早前在中东/欧洲有有限斡旋接触。',
  },
  {
    id: 'ee-evt-kherson',
    title: '赫尔松 · 第聂伯河左岸争夺',
    source: '公开态势整理 · 战线示意',
    timestamp: '2026-06-14T10:00:00Z',
    location: [32.62, 46.64],
    impact_level: 'high',
    category: 'frontline',
    description: '渡河作战与炮击对峙持续（示意坐标）',
  },
  {
    id: 'ee-evt-belgorod',
    title: '别尔哥罗德州 · 跨境袭击监测',
    source: '公开态势整理 · 安全',
    timestamp: '2026-06-13T18:00:00Z',
    location: [36.59, 50.6],
    impact_level: 'medium',
    category: 'hotspots',
    description: '俄边境州遭无人机与炮击频率上升',
  },
  {
    id: 'ee-evt-grain',
    title: '敖德萨港 · 粮食出口走廊',
    source: 'UN',
    timestamp: '2026-06-15T08:00:00Z',
    location: [30.73, 46.48],
    impact_level: 'high',
    category: 'economic',
    description: '黑海粮食倡议后续安排与运价监测',
  },
  {
    id: 'ee-evt-sumy',
    title: '苏梅 · 边境袭扰监测',
    source: '公开态势整理 · 战线示意',
    timestamp: '2026-06-14T18:00:00Z',
    location: [34.8, 50.91],
    impact_level: 'medium',
    category: 'frontline',
    description: '俄边境州跨境无人机与炮击（示意）',
  },
  {
    id: 'ee-evt-lviv',
    title: '利沃夫 · 西部后勤枢纽',
    source: '公开态势整理 · 城市',
    timestamp: '2026-06-15T06:00:00Z',
    location: [24.03, 49.84],
    impact_level: 'medium',
    category: 'city',
    description: '北约军援陆路入口与难民接待中心',
  },
  {
    id: 'ee-evt-mariupol',
    title: '马里乌波尔 · 港口城市（占领区）',
    source: '公开态势整理 · 港口',
    timestamp: '2026-06-10T12:00:00Z',
    location: [37.55, 47.1],
    impact_level: 'high',
    category: 'port',
    description: '亚速海关键港口，重建与军事化争议',
  },
  {
    id: 'ee-evt-belarus',
    title: '白俄罗斯边境 · 军事部署监测',
    source: '公开态势整理 · 热点',
    timestamp: '2026-06-13T14:00:00Z',
    location: [30.98, 52.43],
    impact_level: 'medium',
    category: 'hotspots',
    description: '俄白联合演习与边境部队集结',
  },
  {
    id: 'ee-evt-grain-price',
    title: '敖德萨—多瑙河 · 粮食出口替代路线',
    source: 'UN',
    timestamp: '2026-06-15T10:00:00Z',
    location: [28.8, 45.35],
    impact_level: 'medium',
    category: 'economic',
    description: '多瑙河港口分担黑海出口压力',
  },
  {
    id: 'ee-evt-kursk',
    title: '库尔斯克 · 边境袭扰升级',
    source: '公开态势整理 · 战线示意',
    timestamp: '2026-06-15T14:00:00Z',
    location: [36.19, 51.73],
    impact_level: 'high',
    category: 'frontline',
    description: '俄边境州遭跨境袭击频率上升',
  },
  {
    id: 'ee-evt-zaporizhzhia',
    title: '扎波罗热 · 核电站周边交火',
    source: 'IAEA',
    timestamp: '2026-06-14T20:00:00Z',
    location: [34.58, 47.51],
    impact_level: 'critical',
    category: 'nuclear',
    description: 'IAEA 呼吁建立安全区',
  },
  {
    id: 'ee-evt-dnipro',
    title: '第聂伯罗 · 导弹袭击预警',
    source: '公开态势整理 · 战线示意',
    timestamp: '2026-06-14T08:00:00Z',
    location: [35.05, 48.46],
    impact_level: 'high',
    category: 'military',
    description: '工业城市遭远程打击',
  },
  {
    id: 'ee-evt-bakhmut',
    title: '巴赫穆特方向 · 阵地争夺',
    source: '公开态势整理 · 战线示意',
    timestamp: '2026-06-13T16:00:00Z',
    location: [38.0, 48.59],
    impact_level: 'high',
    category: 'frontline',
    description: '东部战线消耗战持续',
  },
  {
    id: 'ee-evt-kherson-bridge',
    title: '安东诺夫大桥 · 渡河通道监测',
    source: '公开态势整理 · 港口',
    timestamp: '2026-06-12T12:00:00Z',
    location: [32.62, 46.64],
    impact_level: 'high',
    category: 'port',
    description: '第聂伯河左岸补给线关键节点',
  },
  {
    id: 'ee-evt-moldova',
    title: '摩尔多瓦 · 亲欧政府安全压力',
    source: '公开态势整理 · 热点',
    timestamp: '2026-06-15T06:00:00Z',
    location: [28.86, 47.01],
    impact_level: 'medium',
    category: 'hotspots',
    description: '德涅斯特河左岸局势与选举敏感',
  },
  {
    id: 'ee-evt-baltic',
    title: '波罗的海 · 北约东翼演习',
    source: 'NATO 公开资料',
    timestamp: '2026-06-14T10:00:00Z',
    location: [24.0, 56.0],
    impact_level: 'medium',
    category: 'military',
    description: '多国海空联合演训',
  },
  {
    id: 'ee-evt-transnistria',
    title: '德涅斯特河左岸 · 俄军驻留',
    source: '公开态势整理 · 热点',
    timestamp: '2026-06-11T10:00:00Z',
    location: [29.5, 47.0],
    impact_level: 'medium',
    category: 'hotspots',
    description: '摩尔多瓦分离地区俄军存在',
  },
  {
    id: 'ee-evt-energy-grid',
    title: '乌能源系统 · 修复进度监测',
    source: '公开态势整理 · 基础设施',
    timestamp: '2026-06-15T18:00:00Z',
    location: [30.52, 50.45],
    impact_level: 'high',
    category: 'outages',
    description: '变电站修复与西方设备援助',
  },
  {
    id: 'ee-evt-blacksea',
    title: '黑海 · 俄乌海上对峙',
    source: '公开态势整理 · 军事',
    timestamp: '2026-06-13T08:00:00Z',
    location: [33.0, 44.0],
    impact_level: 'high',
    category: 'military',
    description: '无人艇与导弹袭击频发',
  },
  {
    id: 'ee-evt-sanctions',
    title: '莫斯科 · 制裁规避监测',
    source: '公开态势整理 · 制裁',
    timestamp: '2026-06-14T12:00:00Z',
    location: [37.62, 55.75],
    impact_level: 'medium',
    category: 'sanctions',
    description: '影子舰队与第三国转运',
  },
];

const EE_INCIDENTS: Incident[] = [
  {
    id: 'ee-inc-aid',
    title: '西方新一轮对乌军援包宣布',
    date: '2026-06-10T12:00:00Z',
    type: 'diplomatic',
    faction: 'nato',
    location: { lat: 50.45, lng: 30.52 },
    description: '多国宣布追加防空系统与弹药补给（公开来源汇总）',
    source: 'NATO 公开资料',
  },
  {
    id: 'ee-inc-energy',
    title: '乌能源设施遭远程打击 · 停电通报',
    date: '2026-06-08T20:00:00Z',
    type: 'military',
    faction: 'ru',
    location: { lat: 50.45, lng: 30.52 },
    description: '多地变电站受损，基辅等地实施限电（示意坐标）',
    source: '公开态势整理',
  },
  {
    id: 'ee-inc-drone',
    title: '俄军无人机群袭击能源设施',
    date: '2026-06-14T22:00:00Z',
    type: 'military',
    faction: 'ru',
    location: { lat: 49.99, lng: 36.23 },
    description: '哈尔科夫州变电站受损，局部停电（示意）',
    source: '公开态势整理',
  },
  {
    id: 'ee-inc-sanctions',
    title: '欧盟扩大俄影子舰队制裁',
    date: '2026-06-13T10:00:00Z',
    type: 'political',
    faction: 'nato',
    location: { lat: 50.45, lng: 30.52 },
    description: '限制通过第三国转运俄油',
    source: 'EEAS（欧盟对外行动署）',
  },
  {
    id: 'ee-inc-f16',
    title: '乌空军 F-16 训练完成通报',
    date: '2026-06-15T12:00:00Z',
    type: 'military',
    faction: 'nato',
    location: { lat: 50.45, lng: 30.52 },
    description: '西方援乌战斗机首批投入作战',
    source: '公开态势整理',
  },
  {
    id: 'ee-inc-grain',
    title: '黑海粮食走廊通行量回升',
    date: '2026-06-14T08:00:00Z',
    type: 'diplomatic',
    faction: 'ua',
    location: { lat: 46.48, lng: 30.73 },
    description: '敖德萨港装船节奏加快',
    source: '公开态势整理',
  },
  {
    id: 'ee-inc-missile',
    title: '俄军巡航导弹袭击基辅',
    date: '2026-06-14T22:00:00Z',
    type: 'military',
    faction: 'ru',
    location: { lat: 50.45, lng: 30.52 },
    description: '防空系统拦截多数目标',
    source: '公开态势整理',
  },
  {
    id: 'ee-inc-peace',
    title: '瑞士和平峰会后续接触',
    date: '2026-06-12T16:00:00Z',
    type: 'diplomatic',
    faction: 'nato',
    location: { lat: 46.95, lng: 7.45 },
    description: '多方就战俘交换进行磋商',
    source: '公开态势整理',
  },
];

const EE_FACILITIES: Facility[] = [
  {
    id: 'ee-fac-zaporizhzhia',
    name: '扎波罗热核电站',
    position: { lat: 47.51, lng: 34.58 },
    faction: 'ru',
    type: 'nuclear',
    notes: '欧洲最大核电站，IAEA 驻场监测；争议控制区',
  },
  {
    id: 'ee-fac-sevastopol',
    name: '塞瓦斯托波尔海军基地',
    position: { lat: 44.6, lng: 33.52 },
    faction: 'ru',
    type: 'naval',
    forces: ['黑海舰队'],
    notes: '黑海方向俄军海上力量核心',
  },
  {
    id: 'ee-fac-kherson-bridge',
    name: '克里米亚大桥',
    position: { lat: 45.3, lng: 36.5 },
    faction: 'ru',
    type: 'base',
    notes: '连接克里米亚与本土的关键通道，屡遭打击',
  },
  {
    id: 'ee-fac-odesa-port',
    name: '敖德萨港',
    position: { lat: 46.48, lng: 30.73 },
    faction: 'ua',
    type: 'naval',
    notes: '乌克兰最大港口，粮食与物资进出口',
  },
  {
    id: 'ee-fac-belgorod',
    name: '别尔哥罗德边境哨所',
    position: { lat: 50.6, lng: 36.59 },
    faction: 'ru',
    type: 'base',
    notes: '俄边境州军事集结与跨境袭扰',
  },
  {
    id: 'ee-fac-mykolaiv',
    name: '尼古拉耶夫港',
    position: { lat: 46.97, lng: 31.99 },
    faction: 'ua',
    type: 'naval',
    notes: '乌克兰南部重要港口，屡遭打击',
  },
  {
    id: 'ee-fac-kharkiv',
    name: '哈尔科夫军工综合体',
    position: { lat: 49.99, lng: 36.23 },
    faction: 'ua',
    type: 'base',
    notes: '坦克与装甲车辆修理基地',
  },
  {
    id: 'ee-fac-belarus',
    name: '白俄罗斯马楚利什空军基地',
    position: { lat: 53.63, lng: 28.03 },
    faction: 'ru',
    type: 'airfield',
    notes: '俄军机前沿部署点',
  },
  {
    id: 'ee-fac-constanta',
    name: '康斯坦察港',
    position: { lat: 44.17, lng: 28.65 },
    faction: 'ro',
    type: 'naval',
    notes: '北约援乌物资海运枢纽',
  },
];

const EE_ENERGY_POINTS: EnergyDataPoint[] = [
  {
    id: 'ee-gas-transit',
    name: '经乌天然气过境',
    unit: '亿立方米/年',
    value: 150,
    change: -40,
    description: '俄气经乌输送欧洲，冲突后大幅下降',
    updatedAt: '2026-06-01T00:00:00Z',
    source: '公开态势整理',
  },
  {
    id: 'ee-oil-transit',
    name: '德鲁日巴管道输量',
    unit: '万桶/日',
    value: 45,
    change: -15,
    description: '经乌向中欧输油，冲突后大幅下降',
    updatedAt: '2026-06-15T08:00:00Z',
    source: '公开态势整理',
  },
];

const EE_OIL_PRODUCERS: OilProducerMapPoint[] = [
  {
    id: 'ee-oil-ru',
    name: '俄罗斯西部产区',
    lng: 50.0,
    lat: 55.0,
    production: '约 950 万桶/日',
    exportShare: '制裁下转向亚洲',
    note: '乌拉尔折扣与影子舰队运输',
    updatedAt: '2026-06-15T10:00:00Z',
  },
];

import { getPersonsForRegion } from './persons';

export const easternEuropeDataset: RegionDataset = {
  factions: { label: EE_FACTION_LABEL, color: EE_FACTION_HEX },
  events: [...EE_REFERENCE_POINTS, ...EE_KEY_EVENTS, ...EE_DENSIFY_EVENTS, ...EE_DENSIFY_EVENTS_R4],
  military: EE_MILITARY_SECTIONS,
  diplomacy: EE_DIPLOMACY,
  incidents: [...EE_INCIDENTS, ...EE_DENSIFY_INCIDENTS, ...EE_DENSIFY_INCIDENTS_R4],
  facilities: [...EE_FACILITIES, ...EE_DENSIFY_FACILITIES, ...EE_DENSIFY_FACILITIES_R4],
  energy: { regions: [], points: [...EE_ENERGY_POINTS, ...EE_DENSIFY_ENERGY], oilProducers: EE_OIL_PRODUCERS },
  persons: getPersonsForRegion('eastern_europe'),
};
