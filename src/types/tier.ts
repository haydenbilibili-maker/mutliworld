/**
 * 空间层（SpatialTier）类型 — 三位一体空间态势（PRD v0.1）
 *
 * 与 RegionId（地理）正交：地理选"在哪"，空间层选"在哪个高度/深度"。
 * 详见 docs/三位一体空间PRD.md
 */

import type { LayerId } from '@/types/geo';

/** 三层空间：宇宙 / 地表 / 洋底 */
export type SpatialTier = 'space' | 'surface' | 'subsurface';

/** 渲染范式：平面 / 轨道（宇宙）/ 深度（洋底） */
export type TierRenderMode = 'flat' | 'orbit' | 'depth';

/** 底图预设（MapContainer / BasemapController 按层切换） */
export type BasemapPreset =
  | 'geographic' // 洋底：OpenFreeMap Fiord + DEM 地形
  | 'imagery' // 地表/宇宙：卫星·政区·混合（由 BasemapMode 决定）
  | 'graticule'
  | 'starfield'
  | 'seabed';

/** 地表/宇宙层底图显示模式 */
export type BasemapMode = 'satellite' | 'political' | 'hybrid';

export interface TierModule {
  id: SpatialTier;
  /** 显示名（宇宙空间 / 地表 / 洋底空间） */
  name: string;
  /** 单字/emoji 图标 */
  icon: string;
  /** 一句话定位 */
  tagline: string;
  /** 该层可用图层集合 */
  layers: LayerId[];
  /** 进入该层默认开启的图层 */
  defaultLayers: LayerId[];
  /** 底图预设 */
  basemap: BasemapPreset;
  /** 渲染范式 */
  renderMode: TierRenderMode;
  /** 高度/深度区间提示（km；正=高空，负=水深），用于剖面/图例 */
  altitudeBand?: [number, number];
  /** 备注 */
  note?: string;
}
