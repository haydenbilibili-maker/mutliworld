/**
 * 中东区域类型 — LIFEOS-005 阶段3
 * 由 Iran「中东冲突态势大屏」types/index.ts 迁入（相关子集），China 自包含。
 */

/** 军力对比条目 */
export interface MideastMilitaryItem {
  label: string;
  value: string;
  /** 补充说明或来源 */
  sub?: string;
}

/** 一方/主题的军事实力区块（伊朗导弹、以色列防空、美国海空军、代理人武装等） */
export interface MideastMilitarySection {
  id: string;
  /** 阵营标识（通用化：中东 iran/us_israel；俄乌 ru/ua/nato；其它区域自定义） */
  side: string;
  title: string;
  /** 区块简述 */
  summary?: string;
  items: MideastMilitaryItem[];
  /** 数据更新时间或来源说明 */
  updatedAt?: string;
}

/* ── 能源与经济（阶段3 第二批，迁自 Iran energyEconomyData）────────── */

/** 受中东能源影响的国家/地区 */
export interface EnergyImpactRegion {
  id: string;
  name: string;
  flag?: string;
  dependency: string;
  impact: string;
  source?: string;
  updatedAt?: string;
}

/** 全球主要股指 */
export interface GlobalStockIndex {
  id: string;
  name: string;
  symbol: string;
  region: string;
  value: number;
  change: number;
  changePercent: number;
  updatedAt: string;
  lng?: number;
  lat?: number;
}

/** 产油国/产区点位 */
export interface OilProducerMapPoint {
  id: string;
  name: string;
  lng: number;
  lat: number;
  production: string;
  exportShare?: string;
  note?: string;
  /** 该点位数据更新时间（用于经济图层时间过滤/衰减） */
  updatedAt?: string;
}

/** 能源价格/产量数据点（WTI、Brent、OPEC 产量等） */
export interface EnergyDataPoint {
  id: string;
  name: string;
  unit: string;
  value: number;
  change?: number;
  changePercent?: number;
  description?: string;
  updatedAt: string;
  source?: string;
}

/* ── 目标人物（阶段3 第三批，迁自 Iran conflictData.targetPersons）──── */

import type { MideastFaction } from '@/regions/middleeast.factions';

/** 人物状态 */
export type TargetStatus = 'active' | 'restricted' | 'deceased';

/** 人物职务类别 */
export type TargetRoleCategory = 'political' | 'military' | 'diplomatic';

/** 关联行动 */
export interface RelatedAction {
  codeName: string;
  date: string;
  description: string;
  eventId?: string;
}

/** 高价值目标人物 */
export interface TargetPerson {
  id: string;
  name: string;
  faction: string;
  role: string;
  roleCategory?: TargetRoleCategory;
  status: TargetStatus;
  brief?: string;
  actions: RelatedAction[];
  avatar?: string;
}

/* ── 设施（阶段3 第四批，迁自 Iran conflictData.facilities）──────────── */

/** 中东坐标点（注意：Iran 用 {lat,lng}，与 China geo.ts 的 [lng,lat] 元组不同） */
export interface MideastGeoPoint {
  lat: number;
  lng: number;
}

/** 核设施子类（用于地图标注与侧边栏分类） */
export type NuclearKind =
  | 'power_plant'
  | 'enrichment'
  | 'reprocessing'
  | 'missile_silo'
  | 'warhead_storage'
  | 'submarine_base'
  | 'icbm_base'
  | 'test_site'
  | 'contamination'
  | 'research_reactor';

/** 设施类型 */
export type FacilityType =
  | 'base'
  | 'radar'
  | 'nuclear'
  | 'naval'
  | 'airfield'
  | 'missile';

/** 设施（基地/雷达/核设施/海军等，可上地图） */
export interface Facility {
  id: string;
  name: string;
  position: MideastGeoPoint;
  faction: string;
  type: FacilityType;
  /** 核设施细分类（type=nuclear 或导弹井等战略核设施时填写） */
  nuclearKind?: NuclearKind;
  /** 运行状态：运行中 / 封存 / 退役 / 争议控制等 */
  status?: string;
  forces?: string[];
  troopEstimate?: string;
  weapons?: string[];
  notes?: string;
  /** 档案更新时间（ISO） */
  updatedAt?: string;
}

/* ── 冲突事件（阶段3 第五批，迁自 Iran conflictData.incidents）──────── */

/** 事件类型 */
export type MideastEventType = 'political' | 'military' | 'diplomatic';

/** 冲突事件（时间轴 + 地图点） */
export interface Incident {
  id: string;
  title: string;
  /** ISO 日期 */
  date: string;
  type: MideastEventType;
  faction: string;
  location: MideastGeoPoint;
  description: string;
  /** 信息来源（媒体代号） */
  source?: string;
  /** 原文链接 */
  link?: string;
  relatedPersonIds?: string[];
  relatedFacilityIds?: string[];
}

/* ── 外交（阶段3 第六批，迁自 Iran conflictData.diplomaticActors）────── */

export type DiplomaticActorType = 'country' | 'org' | 'religious';

export type DiplomaticRegion =
  | 'china_russia'
  | 'europe'
  | 'middle_east_gulf'
  | 'international_org'
  | 'religious'
  | 'north_america';

/** 外交反应条目 */
export interface DiplomaticReactionEntry {
  date: string;
  statement: string;
  source?: string;
}

/** 外交行为体（国家/组织/宗教势力对冲突的立场与反应） */
export interface DiplomaticActor {
  id: string;
  name: string;
  nameEn?: string;
  type: DiplomaticActorType;
  region: DiplomaticRegion;
  flag?: string;
  stance: string;
  stanceLabel: string;
  reactions: DiplomaticReactionEntry[];
}

/* ── 社交媒体（阶段3 第七批，迁自 Iran socialMediaData）────────────── */

export type SocialPlatform =
  | 'x_twitter'
  | 'telegram'
  | 'instagram'
  | 'facebook'
  | 'weibo';

/** 单条社媒帖（中东局势相关热搜/热门） */
export interface SocialMediaPost {
  id: string;
  platform: SocialPlatform;
  authorName: string;
  handle: string;
  authorTitle?: string;
  avatar?: string;
  content: string;
  publishedAt: string;
  hotRank?: number;
  likes?: number;
  shares?: number;
  comments?: number;
  link?: string;
  verified?: boolean;
  faction?: string;
}

/* ── 趋势（阶段3 第八批，迁自 Iran conflictData.forceTrend/conflictIntensity）── */

/** 趋势数据点（军力/烈度曲线） */
export interface TrendDataPoint {
  date: string;
  value: number;
  faction?: string;
}

/** 冲突烈度日数据 */
export interface ConflictIntensityDay {
  date: string;
  /** 烈度指数 0-100 */
  index: number;
  eventCount: number;
}
