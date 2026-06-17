/**
 * 天体维度（CelestialBody）— 多天体探索 v2.0 Phase 0
 *
 * 与 Region（地球区域）/ SpatialTier（地球三层）正交：
 * earth 保持现状；moon / mars 拥有各自底图与探索图层。默认 earth，零回归。
 * 详见 docs/PRD-多天体探索-月球与火星.md
 */

export type CelestialBody = 'earth' | 'moon' | 'mars';

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
