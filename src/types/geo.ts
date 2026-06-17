/**
 * 地理与地图相关类型，符合 GeoJSON 与 PRD 约定
 */

/** 最小化 GeoJSON FeatureCollection，与标准一致 */
export interface FeatureCollectionGeoJSON {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

export type GeoJSONPoint = {
  type: 'Point';
  coordinates: [number, number];
};

export type GeoJSONLineString = {
  type: 'LineString';
  coordinates: [number, number][];
};

export interface GeoJSONFeature {
  type: 'Feature';
  geometry: GeoJSONPoint | GeoJSONLineString;
  properties?: Record<string, unknown>;
}

/** WGS84 坐标 [经度, 纬度] */
export type GeoPoint = [longitude: number, latitude: number];

/** 影响等级 */
export type ImpactLevel = 'low' | 'medium' | 'high' | 'critical';

/** 事件详情（侧边栏展示、列表项） */
export interface EventDetail {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  location: GeoPoint;
  impact_level: ImpactLevel;
  description?: string;
  category?: string;
  /** 可选原文链接（新闻快讯） */
  url?: string;
}

/** 图层 ID，与 URL layers 参数一致 */
export type LayerId =
  | 'conflicts'
  | 'conflict_zones'
  | 'hotspots'
  | 'bases'
  | 'economic'
  | 'waterways'
  | 'natural'
  | 'weather'
  | 'live_weather'
  | 'military'
  | 'sanctions'
  | 'nuclear'
  | 'outages'
  | 'aviation'
  | 'live_flights'
  | 'live_fires'
  | 'live_maritime'
  | 'maritime'
  | 'cables'
  | 'econ_hubs'
  | 'minerals'
  | 'daynight'
  | 'pipelines'
  | 'hydrocarbon_reserves'
  | 'datacenters'
  | 'protests'
  | 'climate'
  | 'launch_sites'
  | 'launch_log'
  | 'semiconductors'
  | 'garrisons'
  | 'deep_sea_mining'
  | 'tectonics'
  | 'cable_incidents'
  | 'quake_depth'
  | 'ground_stations'
  | 'sat_constellations'
  | 'space_stations'
  | 'satellites'
  | 'space_debris'
  | 'space_events'
  | 'marine_archaeology'
  | 'ocean_currents'
  | 'fisheries'
  | 'monsoon'
  | 'atmospheric_circulation'
  | 'deep_exploration'
  | 'pizza_index'
  | 'persons';

/** 图层配置（显隐、样式、数据源） */
export interface LayerConfig {
  id: LayerId;
  label: string;
  visible: boolean;
  order: number;
  color?: string;
  dataSource?: string;
}

/** 时间范围，与 URL timeRange 一致 */
export type TimeRange = '24h' | '7d' | '30d';

/** 视图预设 */
export type ViewPreset = 'global' | 'asia';

/** /api/geodata 响应元数据 */
export interface GeodataMeta {
  region: string;
  timeRange: TimeRange;
  layers: LayerId[];
  generatedAt: string;
  featureCount: number;
  latestEventAt: string | null;
}

/** /api/geodata 完整响应 */
export interface GeodataResponse extends FeatureCollectionGeoJSON {
  meta: GeodataMeta;
}
