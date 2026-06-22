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
  /** 可选头像URL（人物选中时显示在地图脉冲标记中心） */
  avatarUrl?: string;
  /** 关键指标芯片（详情页可视化；真实读数，不编造） */
  metrics?: EventMetric[];
  /** 主题/关注领域标签 */
  tags?: string[];
  /** 内联微型图表数据（如近 N 期序列、震源深度剖面等） */
  series?: EventSeries;
  /** 配图 URL（如卫星缩略图、机构图示） */
  imageUrl?: string;
  /** 附加来源/参考链接 */
  links?: { label: string; url: string }[];
}

/** 详情页指标芯片 */
export interface EventMetric {
  label: string;
  value: string;
  /** 次要提示（单位/说明） */
  hint?: string;
  /** 强调色（CSS 颜色），用于数值着色 */
  accent?: string;
}

/** 详情页内联微型图表 */
export interface EventSeries {
  label: string;
  /** 数值点（按序） */
  points: number[];
  /** 单位 */
  unit?: string;
  /** 'spark' 折线 / 'bars' 柱（默认 spark） */
  kind?: 'spark' | 'bars';
  /** 可选每点标注（与 points 等长） */
  labels?: string[];
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
  | 'coral_reefs'
  | 'marine_life'
  | 'undersea_wonders'
  | 'migration_routes'
  | 'monsoon'
  | 'atmospheric_circulation'
  | 'deep_exploration'
  | 'world_heritage'
  | 'china_heritage'
  | 'megacities'
  | 'dams'
  | 'ports'
  | 'research_stations'
  | 'refineries'
  | 'airports'
  | 'nuclear_reactors'
  | 'factories'
  | 'financial_centers'
  | 'borders'
  | 'deserts'
  | 'universities'
  | 'military_industry'
  | 'wonder_projects'
  | 'agriculture'
  | 'religions'
  | 'stadiums'
  | 'museums'
  | 'islands'
  | 'capitals'
  | 'power_plants'
  | 'forests'
  | 'earthquakes_historical'
  // 近地空间（对标 earth.nullschool：粒子流场 + 标量叠加）
  | 'wind_flow'
  | 'ocean_flow'
  | 'wave_flow'
  | 'air_pollutants'
  | 'particulates'
  | 'sea_temp'
  | 'sig_wave_height'
  | 'sst_anomaly'
  | 'coral_baa'
  | 'dhw'
  | 'air_temp'
  | 'precip'
  | 'mslp'
  | 'humidity'
  | 'cape'
  | 'earthquakes'
  | 'aurora'
  | 'volcanoes'
  | 'storms'
  | 'floods'
  | 'dusthaze'
  | 'seaice'
  | 'satellite_imagery'
  | 'iss'
  | 'tiangong'
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
