/**
 * 区域模块（RegionModule）类型 — LIFEOS-005 态势感知平台化
 *
 * 平台支持"可插拔区域模块"：每个区域声明自己的地图视野、图层、数据命名空间等，
 * 平台据此自动生成区域切换与地图加载。新增区域无需改平台核心。
 */

import type { EventDetail, LayerId, TimeRange } from '@/types/geo';
import type {
  MideastMilitarySection,
  EnergyImpactRegion,
  EnergyDataPoint,
  OilProducerMapPoint,
  TargetPerson,
  Facility,
  Incident,
  DiplomaticActor,
  SocialMediaPost,
  TrendDataPoint,
  ConflictIntensityDay,
} from '@/types/middleeast';

/** 区域 ID（新增区域时在此扩展） */
export type RegionId =
  | 'global'
  | 'china'
  | 'middleeast'
  | 'asia_pacific'
  | 'north_america'
  | 'latin_america'
  | 'southeast_asia'
  | 'western_europe'
  | 'eastern_europe';

/**
 * 区域数据集 — 通用能力沉淀（LIFEOS-005）
 *
 * 任何区域都可提供这套标准化的态势数据；面板/地图按字段存在与否自动渲染。
 * 新区域接入只需：建 RegionModule + 填这套 dataset（可逐步填、缺字段自动隐藏对应面板）。
 */
export interface RegionDataset {
  /** 关键监测点/事件（侧栏 + 地图） */
  events?: EventDetail[];
  /** 阵营图例 */
  factions?: {
    label: Record<string, string>;
    color: Record<string, string>;
  };
  /** 军力对比 */
  military?: MideastMilitarySection[];
  /** 能源经济 */
  energy?: {
    regions: EnergyImpactRegion[];
    points: EnergyDataPoint[];
    /** 能源资源点位（用于地图经济图层） */
    oilProducers?: OilProducerMapPoint[];
  };
  /** 高价值目标人物 */
  targets?: TargetPerson[];
  /** 设施（可上地图） */
  facilities?: Facility[];
  /** 冲突事件（可上地图） */
  incidents?: Incident[];
  /** 外交反应 */
  diplomacy?: DiplomaticActor[];
  /** 社媒热帖 */
  social?: SocialMediaPost[];
  /** 趋势（军力曲线 + 冲突烈度） */
  trend?: { force: TrendDataPoint[]; intensity: ConflictIntensityDay[] };
}

export interface RegionModule {
  /** 区域唯一标识 */
  id: RegionId;
  /** 区域显示名（用于区域切换器） */
  name: string;
  /** 视角 / 定位描述 */
  viewpoint: string;
  /** 默认地图中心 [经度, 纬度] */
  center: [number, number];
  /** 默认缩放级别 */
  zoom: number;
  /** 该区域可用的图层集合 */
  layers: LayerId[];
  /** 进入该区域时默认开启的图层（未给则取 layers 全部） */
  defaultLayers?: LayerId[];
  /** 可选地理边界 [[minLng, minLat], [maxLng, maxLat]] */
  bounds?: [[number, number], [number, number]];
  /** 默认时间范围 */
  timeRange?: TimeRange;
  /** 数据源命名空间（geodata API 按区域取数用） */
  dataNamespace: string;
  /** 是否已启用（迁移中的区域可置 false，仅占位） */
  enabled: boolean;
  /** 备注（迁移状态等） */
  note?: string;
  /** 区域数据集（可选，逐步填充；缺则该区域仅有地图与图层） */
  dataset?: RegionDataset;
}
