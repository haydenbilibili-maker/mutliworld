/**
 * 天体维度（CelestialBody）— 多天体探索 v2.0 Phase 0
 *
 * 与 Region（地球区域）/ SpatialTier（地球三层）正交：
 * earth 保持现状；moon / mars 拥有各自底图与探索图层。默认 earth，零回归。
 * 详见 docs/PRD-多天体探索-月球与火星.md
 */

export type CelestialBody =
  | 'earth'
  | 'moon'
  | 'mars'
  | 'mercury'
  | 'venus'
  | 'titan'
  | 'europa'
  | 'pluto'
  | 'ceres';

/** 天体探索图层 id */
export type BodyLayerId =
  | 'moon_apollo'
  | 'moon_change'
  | 'moon_legacy'
  | 'moon_orbiters'
  | 'moon_features'
  | 'mars_rovers'
  | 'mars_landers'
  | 'mars_traverse'
  | 'mars_orbiters'
  | 'mars_features'
  // 水星
  | 'mercury_orbiters'
  | 'mercury_flyby'
  | 'mercury_features'
  // 金星
  | 'venus_landers'
  | 'venus_orbiters'
  | 'venus_features'
  // 土卫六 泰坦
  | 'titan_landers'
  | 'titan_flyby'
  | 'titan_features'
  // 木卫二 欧罗巴
  | 'europa_flyby'
  | 'europa_features'
  // 冥王星
  | 'pluto_flyby'
  | 'pluto_features'
  // 谷神星
  | 'ceres_orbiters'
  | 'ceres_features';

/** 天体地貌要素（月海/撞击坑/火山/峡谷等） */
export interface BodyFeature {
  id: string;
  body: CelestialBody;
  layer: BodyLayerId; // moon_features | mars_features
  name: string;
  nameEn: string;
  /** 地貌类型 */
  type: string;
  lng: number;
  lat: number;
  desc: string;
}

export type BodySiteStatus = 'active' | 'completed' | 'lost';

/** 天体探索痕迹（着陆点 / 巡视器 / 着陆器）—— 真实档案坐标 */
export interface BodySite {
  id: string;
  body: CelestialBody;
  layer: BodyLayerId;
  /** 中文名 */
  name: string;
  nameEn?: string;
  /** 机构：NASA / CNSA / ISRO / ESA / JAXA / USSR */
  agency: string;
  /** 天体经度（东经正，-180..180，IAU mean-Earth/polar） */
  lng: number;
  /** 天体纬度（-90..90） */
  lat: number;
  /** 着陆/任务日期 */
  date: string;
  status: BodySiteStatus;
  summary: string;
  sourceUrl?: string;
}

export interface BodyModule {
  id: CelestialBody;
  /** 中文显示名 */
  name: string;
  icon: string;
  /** 一句话定位 */
  tagline: string;
  /** 默认相机中心（天体经纬，示意） */
  center: [number, number];
  /** 默认缩放 */
  zoom: number;
  /** Phase 0 占位底图主色（真实瓦片 P1 接入） */
  basemapColor: string;
  /** 默认开启的探索图层（Phase 0 暂空，P1+ 填充） */
  defaultLayers: string[];
  /** 是否启用（灰度开关） */
  enabled: boolean;
}
