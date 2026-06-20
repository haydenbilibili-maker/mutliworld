/**
 * 空间层（SpatialTier）类型 — 三位一体空间态势（PRD v0.1）
 *
 * 与 RegionId（地理）正交：地理选"在哪"，空间层选"在哪个高度/深度"。
 * 详见 docs/三位一体空间PRD.md
 */

import type { LayerId } from '@/types/geo';

/** 空间层：宇宙 / 近地 / 地表 / 洋底 */
export type SpatialTier = 'space' | 'near_earth' | 'surface' | 'subsurface';

/** 渲染范式：平面 / 轨道（宇宙）/ 深度（洋底）/ 流场（近地：粒子流 + 标量叠加，对标 earth.nullschool） */
export type TierRenderMode = 'flat' | 'orbit' | 'depth' | 'flow';

/** 底图预设（MapContainer / BasemapController 按层切换） */
export type BasemapPreset =
  | 'geographic' // 洋底：OpenFreeMap Fiord + DEM 地形
  | 'imagery' // 地表/宇宙：卫星·政区·混合（由 BasemapMode 决定）
  | 'graticule'
  | 'starfield'
  | 'seabed'
  | 'flow'; // 近地：暗色极简流场底图（对标 earth.nullschool）

/** 地表/宇宙层底图显示模式 */
export type BasemapMode = 'satellite' | 'political' | 'hybrid';

/**
 * 空间层「视图」配置 — 级联模型 空间(Tier) → 图层(Layer) → 视图(View) 的视图层。
 * 视图由空间派生（而非全局通用）：切层时应用这些默认，使每个空间拥有专属视图基线。
 */
export interface TierViewConfig {
  /** 投影默认：auto=由层规则决定(如宇宙强制球面) / mercator=平面 / globe=球面 */
  projection?: 'auto' | 'mercator' | 'globe';
  /** 粒子/流场动画速度默认倍率（近地流场层用；0.3慢 0.55中 0.9快） */
  flowSpeed?: number;
}

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
  /** 视图默认（级联：切入该层时应用；缺省则沿用通用默认） */
  view?: TierViewConfig;
  /** 高度/深度区间提示（km；正=高空，负=水深），用于剖面/图例 */
  altitudeBand?: [number, number];
  /** 备注 */
  note?: string;
}
