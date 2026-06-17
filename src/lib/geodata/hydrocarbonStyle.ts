/**
 * 油气储藏 — 专用色谱（棕黑琥珀石油色系，区别于地震橙红琥珀波）
 * 图例结构镜像 seismicStyle（分级光晕 + 图例条目）
 */

export type HydrocarbonReserveTier = 'mega' | 'large' | 'medium';

/** 储量分级光晕色 — 深褐 → 暗金 → 橄榄褐 */
export const HYDROCARBON_TIER_HALO: Record<HydrocarbonReserveTier, string> = {
  mega: '#3d2914',
  large: '#b8860b',
  medium: '#6b5a2a',
};

export const HYDROCARBON_TIER_LABEL: Record<HydrocarbonReserveTier, string> = {
  mega: '储量波 · 特大（世界级）',
  large: '储量波 · 大型油田/气田',
  medium: '储量波 · 中等规模',
};

export const HYDROCARBON_TIER_IMAGE: Record<HydrocarbonReserveTier, string> = {
  mega: 'hydrocarbon-mega',
  large: 'hydrocarbon-large',
  medium: 'hydrocarbon-medium',
};

/** 图例分组悬停说明 */
export const HYDROCARBON_LEGEND_HINTS: Record<string, string> = {
  hydrocarbon_reserves: '棕黑琥珀储量波色谱 · 非地震波（橙红为 USGS 地震专用）',
};
